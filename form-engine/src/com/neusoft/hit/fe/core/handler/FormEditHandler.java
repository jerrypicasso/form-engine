package com.neusoft.hit.fe.core.handler;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.neusoft.hit.fe.core.exception.FormEngineException;
import com.neusoft.hit.fe.core.model.SaveParam;
import com.neusoft.hit.fe.core.model.StageParam;
import com.neusoft.hit.fe.core.utility.DBUtil;
import com.neusoft.hit.fe.core.utility.EngineUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class FormEditHandler {
	
	private static final Log LOGGER = LogFactory.getLog(FormEditHandler.class);
	
	public String save(Map<String, Object> params) throws FormEngineException {
		String guid = null;
		Object recordStr = params.get("record");
		JSONArray records = JSONArray.fromObject(recordStr);
		Map<String, SaveParam> saveParams = new HashMap<String, SaveParam>();
		for(int i = 0; i < records.size(); i++) {
			JSONObject record = (JSONObject) records.get(i);
			String fieldName = record.optString("fieldName");
			if(fieldName == null) {
				throw new FormEngineException("缺少表字段，无法生成保存语句！");
			}
			String tableName = record.optString("tableName");
			if(tableName == null) {
				throw new FormEngineException("字段对应的表名为空，无法生成保存语句！");
			}
			String fieldValue = record.optString("fieldValue");
			boolean isPrimary = record.optBoolean("isPrimary");
			SaveParam saveParam = saveParams.get(tableName.toUpperCase());
			if(saveParam == null) {
				saveParam = new SaveParam();
				saveParams.put(tableName.toUpperCase(), saveParam);
			}
			saveParam.setTableName(tableName.toUpperCase());
			if(isPrimary) {
				saveParam.setPrimaryKeyName(fieldName.toUpperCase());
				if(fieldValue == null) {
					throw new FormEngineException("主键值不允许为空，无法生成保存语句！");
				}
				saveParam.setPrimaryKeyValue(fieldValue);
			}
			else {
				saveParam.getColumns().put(fieldName.toUpperCase(), fieldValue);
			}
		}
		
		Connection conn = null;
		Statement stmt = null;
		try {
			conn = DBUtil.getConnection();
			conn.setAutoCommit(false);
			stmt = conn.createStatement();
			for(Map.Entry<String, SaveParam> entry : saveParams.entrySet()) {
				SaveParam saveParam = entry.getValue();
				String tableName = saveParam.getTableName();
				String pkName = saveParam.getPrimaryKeyName();
				String pkValue = saveParam.getPrimaryKeyValue();
				Map<String, Object> columns = saveParam.getColumns();
				StringBuilder saveSql = new StringBuilder();
				//新增
				if(pkValue == null || "".equals(pkValue)) {
					guid = EngineUtil.guid();
					StringBuilder columnNames = new StringBuilder(" (");
					StringBuilder columnValues = new StringBuilder(" (");
					columns.put(pkName, guid);
					String now = EngineUtil.now();
					columns.put("CREATE_TIME", now);
					columns.put("MODIFY_TIME", now);
					Iterator<?> it = columns.keySet().iterator();
					while (it.hasNext()) {
						String key = (String) it.next();  
			            Object value = columns.get(key);
			            columnNames.append(key).append(',');
			            /*if(value.matches("\\d{4}-\\d{1,2}-\\d{1,2}\\s\\d{2}:\\d{2}:\\d{2}")) {
			            	if("Oracle".equals(DBUtil.getDataBaseType())) {
			            		columnValues.append("TO_DATE('").append(value).append("','yyyy-mm-dd hh24:mi:ss'),");
			            	}
			            	else {
			            		columnValues.append('\'').append(value).append("',");
			            	}
			            } 
			            else {
			            	columnValues.append('\'').append(value).append("',");
			            }*/
			            columnValues.append('\'').append(value).append("',");
					}
					columnNames.setCharAt(columnNames.length() - 1, ')');
					columnValues.setCharAt(columnValues.length() - 1, ')');
					saveSql.append("INSERT INTO ").append(tableName).append(columnNames);
					saveSql.append(" VALUES ").append(columnValues);
				}
				//修改
				else {
					StringBuilder update = new StringBuilder();
					columns.remove("CREATE_ID");
					String now = EngineUtil.now();
					columns.put("MODIFY_TIME", now);
					Iterator<?> it = columns.keySet().iterator();
					while (it.hasNext()) {
						String key = (String) it.next();  
						Object value = columns.get(key);
						/*if(value.matches("\\d{4}-\\d{1,2}-\\d{1,2}\\s\\d{2}:\\d{2}:\\d{2}")) {
			            	if("Oracle".equals(DBUtil.getDataBaseType())) {
			            		update.append(key).append('=').append("TO_DATE('").append(value).append("','yyyy-mm-dd hh24:mi:ss'),");
			            	}
			            	else {
			            		update.append(key).append('=').append('\'').append(value).append("',");
			            	}
			            } 
			            else {
			            	update.append(key).append('=').append('\'').append(value).append("',");
			            }*/
						update.append(key).append('=').append('\'').append(value).append("',");
					}
					update.deleteCharAt(update.length() - 1);
					saveSql.append("UPDATE ").append(tableName).append(" SET ").append(update);
					saveSql.append(" WHERE ").append(pkName).append("='").append(pkValue).append('\'');
				}
				stmt.executeUpdate(saveSql.toString());
				
				String historyTableName = tableName + "_HISTORY";
				//保存痕迹到历史表
				if(DBUtil.checkTableExists(historyTableName)) {
					StringBuilder historySql = new StringBuilder();
					historySql.append("INSERT INTO ").append(historyTableName);
					historySql.append(" SELECT * FROM ").append(tableName);
					historySql.append(" WHERE ").append(pkName).append("='");
					historySql.append(pkValue).append("'");
					stmt.executeUpdate(historySql.toString());
				}
			}
			
			StringBuilder delStageSql = new StringBuilder();
			delStageSql.append("DELETE FROM STAGE_FORM_STORAGE ");
			delStageSql.append("WHERE KEY = '").append(params.get("stageKey")).append('\'');
			stmt.executeUpdate(delStageSql.toString());
			conn.commit();
		} catch (SQLException e) {
			try {
				conn.rollback();
			} catch (SQLException ex) {
				LOGGER.error(ex.toString(), ex);
			}
			LOGGER.error(e.toString(), e);
			throw new FormEngineException("保存数据时发生错误，操作失败 ！", e);
		} finally {
			DBUtil.close(conn, stmt, null);
		}
		return guid;
	}
	
	public void drop(Map<String, Object> params) throws FormEngineException {
		Object tableName = params.get("tableName");
		Object primaryKeyName = params.get("primaryKeyName");
		if(primaryKeyName == null || "".equals(primaryKeyName)) {
			primaryKeyName = "GUID";
		}
		Object primaryKeyValue = params.get("primaryKeyValue");
		Object dropFlagName = params.get("dropFlagName");
		if(dropFlagName == null || "".equals(dropFlagName)) {
			dropFlagName = "DEL_FLAG";
		}
		Object dropFlagValue = params.get("dropFlagValue");
		if(dropFlagValue == null || "".equals(dropFlagValue)) {
			dropFlagValue = "1";
		}
		StringBuilder sql = new StringBuilder("UPDATE ");
		sql.append(tableName);
		sql.append(" SET ").append(dropFlagName).append(" = '").append(dropFlagValue);
		sql.append("' WHERE ").append(primaryKeyName).append(" = '");
		sql.append(primaryKeyValue);
		sql.append('\'');
		
		Connection conn = null;
		Statement stmt = null;
		try {
			conn = DBUtil.getConnection();
			stmt = conn.createStatement();
			stmt.executeUpdate(sql.toString());
		} catch (SQLException e) {
			LOGGER.error(e.toString(), e);
			throw new FormEngineException("删除数据时发生错误，操作失败 ！", e);
		} finally {
			DBUtil.close(conn, stmt, null);
		}
	}
	
	public void stage(StageParam param) throws FormEngineException {
		String key = param.getKey();
		String content = param.getContent();
		String deleteSql = "DELETE FROM STAGE_FORM_STORAGE WHERE KEY = ?";
		String insertSql = "INSERT INTO STAGE_FORM_STORAGE(ID, KEY, CONTENT) VALUES(?,?,?)";
		Connection conn = null;
		PreparedStatement deleteStmt = null;
		PreparedStatement insertStmt = null;
		try {
			conn = DBUtil.getConnection();
			conn.setAutoCommit(false);
			deleteStmt = conn.prepareStatement(deleteSql);
			deleteStmt.setString(1, key);
			deleteStmt.executeUpdate();
			insertStmt = conn.prepareStatement(insertSql);
			insertStmt.setString(1, EngineUtil.guid());
			insertStmt.setString(2, key);
			insertStmt.setString(3, content);
			insertStmt.executeUpdate();
			conn.commit();
			conn.setAutoCommit(true);
		} catch (SQLException e) {
			try {
				conn.rollback();
			} catch (SQLException ex) {
				LOGGER.error(ex.toString(), ex);
			}
			LOGGER.error(e.toString(), e);
			throw new FormEngineException("暂存数据时发生错误，操作失败！", e);
		} finally {
			DBUtil.close(deleteStmt);
			DBUtil.close(insertStmt);
			DBUtil.close(conn);
		}
	}
	
}
