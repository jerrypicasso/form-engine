package com.neusoft.hit.emr.fd.servlet;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import com.neusoft.hit.emr.fd.util.DBUtil;
import net.sf.json.JSONArray;

public class FormDesignerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		this.doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String servletPath = req.getServletPath();
		if("/eidtDataset.do".equals(servletPath)) {
			String sql = req.getParameter("sql");
			List<String> names = DBUtil.getFieldNames(sql);
			resp.setContentType("text/json;charset=utf-8");
			JSONArray jsonArr = JSONArray.fromObject(names);
			resp.getWriter().write(jsonArr.toString());
			resp.getWriter().flush();
		}
		else if("/saveFormTpl.do".equals(servletPath)) {
			String tpl = req.getParameter("tpl");
			String name = req.getParameter("name");
			String code = req.getParameter("code");
			tpl = tpl.replaceAll("\\-ms\\-word\\-wrap", "word-wrap");
			String outputFile = "D:\\test\\tpl\\"+ code +".html";
			File file = new File(outputFile);
			if(!file.exists()) {
				file.createNewFile();
			}
			FileWriter writer = new FileWriter(outputFile);
			writer.write(tpl);
			writer.flush();
			writer.close();

			Connection conn = null;
			PreparedStatement stmt = null;
			String sql = "INSERT INTO FORM_TEMPLATE_STORAGE(\"ID\", \"CODE\", \"TITLE\", \"CONTENT\", \"VERSION\") VALUES(?,?,?,?,?)";
			try {

				conn = DBUtil.getConnection();
				stmt = conn.prepareStatement(sql);
				stmt.setString(1, UUID.randomUUID().toString());
				stmt.setString(2, code.toLowerCase());
				stmt.setString(3, name);
				if("Oracle".equals(DBUtil.getDataBaseType())){
					Clob clob = conn.createClob();
					clob.setString(1, tpl);
					stmt.setClob(4, clob);
				}else{
					stmt.setString(4, tpl);
				}


				stmt.setTimestamp(5, new Timestamp(Calendar.getInstance().getTimeInMillis()));
				stmt.executeUpdate();
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				try {
					if(stmt != null) {
						stmt.close();
					}
					if(conn != null) {
						conn.close();
					}
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			resp.setContentType("text/json;charset=utf-8");
			resp.getWriter().write("{}");
			resp.getWriter().flush();
		}
		else if("/loadFormTpl.do".equals(servletPath)) {
			String code = req.getParameter("code");
			StringBuilder sql = new StringBuilder();
			String dbType = DBUtil.getDataBaseType();
			if("Oracle".equals(dbType)) {
				sql.append("SELECT * FROM (");
				sql.append("SELECT * FROM FORM_TEMPLATE_STORAGE WHERE CODE = '").append(code).append("' ");
				sql.append("ORDER BY VERSION DESC");
				sql.append(") A ");
				sql.append("WHERE ROWNUM = 1 ");
			}
			else if("Postgresql".equals(dbType)) {
				sql.append("SELECT * FROM (");
				sql.append("SELECT * FROM FORM_TEMPLATE_STORAGE WHERE \"CODE\" = '").append(code).append("' ");
				sql.append("ORDER BY \"VERSION\" DESC");
				sql.append(") AS A ");
				sql.append("LIMIT 1 ");
			}
			Map<String, Object> record = DBUtil.getSingleResult(sql.toString());
			String tpl = record.get("CONTENT").toString();
			resp.setContentType("text/html;charset=utf-8");
			resp.getWriter().write(tpl);
			resp.getWriter().flush();
		}
		else if("/loadFields.do".equals(servletPath)) {
			String sql = req.getParameter("sql");
			sql = sql.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("\\$\\{[^}]+\\}", "0");
			List<String> fieldNames = DBUtil.getFieldNames(sql);
			resp.setContentType("text/json;charset=utf-8");
			JSONArray jsonArr = JSONArray.fromObject(fieldNames);
			resp.getWriter().write(jsonArr.toString());
			resp.getWriter().flush();
		}
		else if("/loadTempList.do".equals(servletPath)) {
			String sql = "SELECT DISTINCT \"CODE\",\"TITLE\" FROM FORM_TEMPLATE_STORAGE";
			List<Map<String, Object>> records = DBUtil.getMultiResults(sql);
			resp.setContentType("text/json;charset=utf-8");
			JSONArray jsonArr = JSONArray.fromObject(records);
			resp.getWriter().write(jsonArr.toString());
			resp.getWriter().flush();
		}
	}

}
