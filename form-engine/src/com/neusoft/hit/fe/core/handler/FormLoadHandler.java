package com.neusoft.hit.fe.core.handler;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.math.NumberUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.neusoft.hit.fe.core.exception.FormEngineException;
import com.neusoft.hit.fe.core.html.HtmlDocument;
import com.neusoft.hit.fe.core.html.HtmlElement;
import com.neusoft.hit.fe.core.model.SqlTplInfo;
import com.neusoft.hit.fe.core.utility.DBUtil;
import com.neusoft.hit.fe.core.utility.FreemarkerUtil;

import net.sf.json.JSONObject;

public class FormLoadHandler {
	
	private static final Log LOGGER = LogFactory.getLog(FormLoadHandler.class);
	
	public String load(Map<String, Object> rootMap) throws FormEngineException {
		Map<String, Object> result = new HashMap<String, Object>();
		String stagedForm = getStagedForm(rootMap);
		String html = null;				
		if(stagedForm == null || stagedForm.trim().length() <= 0) {
			String formTemplate = getFormTemplate(rootMap);
			if(formTemplate != null && formTemplate.trim().length() > 0) {
				HtmlDocument htmlDocument = HtmlDocument.parse(formTemplate);
				regulateFormTemplate(htmlDocument);
				List<SqlTplInfo> sqlTplMap = parseSqlTplTree(htmlDocument);
				loadDatasetByExecutingQuerySql(sqlTplMap, rootMap);
				
				HtmlElement htmlElement = htmlDocument.getSingleElementByClass("paper");
				String form = htmlElement.outerHtml();
				form = form.replaceAll("<list", "<#list").replaceAll("</list", "</#list")
						.replaceAll("expr=\"([^\"]+)\"", "$1");
				form = form.replaceAll("<condition", "<#if").replaceAll("</condition", "</#if")
						.replaceAll("expr=\"([^\"]+)\"", "$1");
				form = form.replaceAll("&amp;", "&");
				html = FreemarkerUtil.getMixedString(form, rootMap);
				
				
				result.put("mode", rootMap.get("mode"));
			}
		}
		else {
			html = stagedForm;
			result.put("mode", "edit");
		}
		result.put("content", html);
		return JSONObject.fromObject(result).toString();
	}
	
	private String getStagedForm(Map<String, Object> rootMap) throws FormEngineException {
		String stagedFormStr = null;
		String sql = "SELECT * FROM STAGE_FORM_STORAGE WHERE STAFF_CODE = ? AND PATIENT_CODE = ? AND CATEGORY = ?";
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		try {
			conn = DBUtil.getConnection();
			if(conn != null) {
				stmt = conn.prepareStatement(sql);
				stmt.setObject(1, rootMap.get("staffCode"));
				stmt.setObject(2, rootMap.get("patientCode"));
				stmt.setObject(3, rootMap.get("category"));
				rs = stmt.executeQuery();
				Map<String, Object> record = DBUtil.getSingleResult(rs);
				if(record != null) {
					Object content = record.get("CONTENT");
					if(content != null) {
						stagedFormStr = content.toString();
					}
				}
			}
		} catch (SQLException e) {
			LOGGER.error(e.toString(), e);
			throw new FormEngineException("Error occurs during getting staged form content from database !", e);
		} finally {
			DBUtil.close(conn, stmt, rs);
		}
		return stagedFormStr;
	}
	
	private String getFormTemplate(Map<String, Object> rootMap) throws FormEngineException {
		String formTemplate = null;
		StringBuilder sql = new StringBuilder();
		sql.append("select * from (");
		sql.append("SELECT * FROM FORM_TEMPLATE_STORAGE WHERE CODE = ? ORDER BY VERSION DESC");
		sql.append(") TEMP WHERE 1=1 ");
		String dbType = DBUtil.getDataBaseType();
		if("Oracle".equalsIgnoreCase(dbType)) {
			sql.append("AND ROWNUM = 1");
		}
		else if("Postgresql".equalsIgnoreCase(dbType)) {
			sql.append("LIMIT 1");
		}
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		try {
			conn = DBUtil.getConnection();
			if(conn != null) {
				stmt = conn.prepareStatement(sql.toString());
				stmt.setObject(1, rootMap.get("category"));
				rs = stmt.executeQuery();
				Map<String, Object> record = DBUtil.getSingleResult(rs);
				if(record != null) {
					Object content = record.get("CONTENT");
					if(content != null) {
						formTemplate = content.toString();
					}
				}
			}
		} catch (SQLException e) {
			LOGGER.error(e.toString(), e);
			throw new FormEngineException("Error occurs during getting form template from database !", e);
		} finally {
			DBUtil.close(conn, stmt, rs);
		}
		return formTemplate;
	}
	
	private void regulateFormTemplate(HtmlDocument htmlDocument) throws FormEngineException {
		//为每个行数据元素添加row-mode属性
		List<HtmlElement> rowElements = htmlDocument.getElementsByClass("data-row");
		for(HtmlElement rowElement : rowElements) {
			HtmlElement iterElement = rowElement.getFirstParentElementByTag("list");
			String var = iterElement.attr("var");
			if(var != null && !var.trim().isEmpty()) {
				rowElement.attr("row-tpl", "${(" + var + ".rowTpl)!}");
			}
		}
		//处理list元素
		List<HtmlElement> listElements = htmlDocument.getElementsByTag("list");
		for(HtmlElement listElement : listElements) {
			String itemsName = listElement.attr("items");
			String varName = listElement.attr("var");
			listElement.attr("expr", itemsName + " as " + varName);
			listElement.removeAttr("items");
			listElement.removeAttr("var");
			listElement.removeAttr("class");
			listElement.removeAttr("style");
			HtmlElement listWrapper = listElement.parent();
			listWrapper.attr("total-row", "${(" + itemsName + "_pagination.ROW_COUNT)!}");
			listWrapper.attr("total-page", "${(" + itemsName + "_pagination.PAGE_COUNT)!}");
			listWrapper.attr("page-param-name", itemsName + "_page");
			listWrapper.attr("name", itemsName);
		}
		//处理condition元素
		List<HtmlElement> conditionElements = htmlDocument.getElementsByTag("condition");
		for(HtmlElement conditionElement : conditionElements) {
			conditionElement.removeClass("widget-condition");
			conditionElement.removeAttr("class");
			conditionElement.removeAttr("style");
		}
		//删除所有droppable和widget-container样式类
		List<HtmlElement> elements = htmlDocument.getElementsByClass("droppable");
		for(HtmlElement element: elements) {
			element.removeClass("droppable");
			element.removeClass("widget-container");
			if("".equals(element.attr("class"))) {
				element.removeAttr("class");
			}
		}
		//清理所有单元格
		elements = htmlDocument.getElementsByClass("cell");
		for(HtmlElement element : elements) {
			element.removeClass("cell");
			element.removeClass("th-border-invisible");
			element.removeClass("td-border-invisible");
			element.removeClass("col-resizable");
			element.removeClass("row-resizable");
			element.removeAttr("coordinate");
			element.removeAttr("table");
			if("".equals(element.attr("class"))) {
				element.removeAttr("class");
			}
		}
		//清理所有表格
		elements = htmlDocument.getElementsByAttribute("table");
		for(HtmlElement element : elements) {
			element.removeAttr("table");
			element.removeAttr("index");
			if("".equals(element.attr("class"))) {
				element.removeAttr("class");
			}
		}
	}
	
	private SqlTplInfo parseSqlTplNode(HtmlElement htmlElement) {
		SqlTplInfo sqlTpl = new SqlTplInfo();
		HtmlElement sqlNameNode = htmlElement.getSingleElementByClass("sql-name");
		if(sqlNameNode != null) {
			String sqlName = sqlNameNode.innerHtml();
			sqlTpl.setName(sqlName);
		}
		HtmlElement sqlResultTypeNode = htmlElement.getSingleElementByClass("sql-result-type");
		if(sqlResultTypeNode != null) {
			String sqlResultType = sqlResultTypeNode.innerHtml();
			sqlTpl.setResultType(sqlResultType);
		}
		HtmlElement sqlResultLimitNode = htmlElement.getSingleElementByClass("sql-result-limit");
		if(sqlResultLimitNode != null) {
			String sqlResultLimitStr = sqlResultLimitNode.innerHtml();
			if(!sqlResultLimitStr.trim().isEmpty()) {
				Integer sqlResultLimit = Integer.parseInt(sqlResultLimitStr);
				sqlTpl.setResultLimit(sqlResultLimit);
			}
		}
		HtmlElement sqlVarNameNode = htmlElement.getSingleElementByClass("var-name");
		if(sqlVarNameNode != null) {
			String sqlVarName = sqlVarNameNode.innerHtml();
			sqlTpl.setVarName(sqlVarName);
		}
		HtmlElement sqlNode = htmlElement.getSingleElementByClass("sql");
		if(sqlNode != null) {
			String sql = sqlNode.innerHtml();
			sql = sql.replaceAll("&gt;", ">").replaceAll("&lt;", "<");
			sqlTpl.setSql(sql);
		}
		List<HtmlElement> children = htmlElement.children("sql-node");
		for(HtmlElement child : children) {
			sqlTpl.getChildren().add(parseSqlTplNode(child));
		}
		return sqlTpl;
	}
	
	private List<SqlTplInfo> parseSqlTplTree(HtmlDocument htmlDocument) throws FormEngineException {
		List<SqlTplInfo> selectSqlList = new ArrayList<SqlTplInfo>();
		HtmlElement sqlWrapper = htmlDocument.getSingleElementByClass("sql-wrapper");
		List<HtmlElement> children = sqlWrapper.children("sql-node");
		for(HtmlElement htmlElement : children) {
			selectSqlList.add(parseSqlTplNode(htmlElement));
		}
		return selectSqlList;
	}
	
	private void loadDatasetByExecutingQuerySql(List<SqlTplInfo> selectSqlList, 
			Map<String, Object> rootMap) throws FormEngineException {
		//把select语句都执行一下，得到的结果作为展示用的数据源
		for(SqlTplInfo sqlTpl : selectSqlList) {
			String sqlName = sqlTpl.getName();
			String resultType = sqlTpl.getResultType();
			String sql = sqlTpl.getSql();
			Integer resultlimit = sqlTpl.getResultLimit();
			sql = FreemarkerUtil.getMixedString(sql, rootMap);
			Connection conn = DBUtil.getConnection();
			Statement stmt = null;
			ResultSet recordRs = null;
			ResultSet paginationRs = null;
			try {
				stmt = conn.createStatement();
				if("single".equals(resultType)) {
					recordRs = stmt.executeQuery(sql);
					Map<String, Object> record = DBUtil.getSingleResult(recordRs);
					rootMap.put(sqlName, record);
				} 
				else if(resultType != null && resultType.startsWith("multi")) {
					String recordSql = sql;
					String paginationSql = null;
					List<Map<String, Object>> records = new ArrayList<Map<String, Object>>();
					if(resultlimit != null && resultlimit > 0) {
						StringBuilder sqlBuilder = new StringBuilder();
						Object page = rootMap.get(sqlName + "_page");
						if(page == null) {
							page = "0";
						}
						int pageNum = Integer.parseInt(page.toString());
						int begin = resultlimit * pageNum;
						int end = resultlimit * (pageNum + 1);
						String dbType = DBUtil.getDataBaseType();
						if("Oracle".equals(dbType)) {
							sqlBuilder.append("SELECT * FROM ( SELECT OLD.*,ROWNUM RN FROM (");
							sqlBuilder.append(sql);
							sqlBuilder.append(") OLD WHERE ROWNUM <= ");
							sqlBuilder.append(end);
							sqlBuilder.append(") WHERE RN > ");
							sqlBuilder.append(begin);
						}
						else if("Postgresql".equals(dbType)) {
							sqlBuilder.append(sql).append(" LIMIT ").append(resultlimit)
								.append(" OFFSET ").append(begin);
						}
						recordSql = sqlBuilder.toString();
						
						sqlBuilder.setLength(0);
						sqlBuilder.append("SELECT COUNT(*) AS TOTAL FROM (");
						sqlBuilder.append(sql);
						sqlBuilder.append(")");
						paginationSql = sqlBuilder.toString();
					}
					recordRs = stmt.executeQuery(recordSql);
					List<Map<String, Object>> results = DBUtil.getMultiResults(recordRs);
					if("multi-fixed".equals(resultType)) {
						int size = results.size();
						if(size < resultlimit) {
							for(int i = 0; i < resultlimit - size; i++) {
								results.add(new HashMap<String, Object>());
							}
						}
					}
					records.addAll(results);
					//增加一条隐藏的空行，用来作为新增记录时的编辑模版
					Map<String, Object> record = new HashMap<String, Object>();
					record.put("rowTpl", "true");
					records.add(record);
					rootMap.put(sqlName, records.toArray());
					
					//如果paginationSql不为空，则计算出分页参数
					if(paginationSql != null) {
						paginationRs = stmt.executeQuery(paginationSql);
						Map<String, Object> pagination = DBUtil.getSingleResult(paginationRs);
						if(pagination != null) {
							Object total = pagination.get("TOTAL");
							int rowCount = NumberUtils.toInt(total.toString(), 0);
							int pageCount = rowCount/resultlimit + (rowCount%resultlimit > 0 ? 1 : 0);
							pagination.clear();
							pagination.put("ROW_COUNT", rowCount);
							pagination.put("PAGE_COUNT", pageCount);
							rootMap.put(sqlName + "_pagination", pagination);
						}
					}
				}
				List<SqlTplInfo> children = sqlTpl.getChildren();
				loadDatasetByExecutingQuerySql(children, rootMap);
			} catch (NumberFormatException e) {
				LOGGER.error(e.toString(), e);
				throw new FormEngineException("Error occurs during loading dataset by executing query sql !", e);
			} catch (SQLException e) {
				throw new FormEngineException("Error occurs during loading dataset by executing query sql !", e);
			} finally {
				DBUtil.close(paginationRs);
				DBUtil.close(conn, stmt, recordRs);
			}
		}
	}
	
}
