package com.neusoft.hit.fe.core.handler;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.neusoft.hit.fe.core.exception.FormEngineException;
import com.neusoft.hit.fe.core.model.StageParam;
import com.neusoft.hit.fe.core.utility.DBUtil;

import net.sf.json.JSONObject;

public class FormEditHandler {
	
	private static final Log LOGGER = LogFactory.getLog(FormEditHandler.class);
	
	public void save(Map<String, Object> params) throws FormEngineException {
		Object tableName = params.get("tableName");
		Object pkName = params.get("primaryKeyName");
		Object pkValue = params.get("primaryKeyValue");
		Object recordStr = params.get("record");
		JSONObject columns = JSONObject.fromObject(recordStr);
		StringBuilder saveSql = new StringBuilder();
		//新增
		if(pkValue == null || "".equals(pkValue)) {
			StringBuilder columnNames = new StringBuilder(" (");
			StringBuilder columnValues = new StringBuilder(" (");
			columns.put(pkName, UUID.randomUUID().toString());
			Iterator<?> it = columns.keys();
			while (it.hasNext()) {
				String key = (String) it.next();  
                String value = columns.getString(key);
                columnNames.append(key).append(',');
                if(value.matches("\\d{4}-\\d{1,2}-\\d{1,2}\\s\\d{2}:\\d{2}:\\d{2}")) {
                	if("Oracle".equals(DBUtil.getDataBaseType())) {
                		columnValues.append("TO_DATE('").append(value).append("','yyyy-mm-dd hh24:mi:ss'),");
                	}
                	else {
                		columnValues.append('\'').append(value).append("',");
                	}
                } 
                else {
                	columnValues.append('\'').append(value).append("',");
                }
			}
			columnNames.setCharAt(columnNames.length() - 1, ')');
			columnValues.setCharAt(columnValues.length() - 1, ')');
			saveSql.append("INSERT INTO ").append(tableName).append(columnNames);
			saveSql.append(" VALUES ").append(columnValues);
		}
		//修改
		else {
			StringBuilder update = new StringBuilder();
			Iterator<?> it = columns.keys();
			while (it.hasNext()) {
				String key = (String) it.next();  
				String value = columns.getString(key);
				if(value.matches("\\d{4}-\\d{1,2}-\\d{1,2}\\s\\d{2}:\\d{2}:\\d{2}")) {
                	if("Oracle".equals(DBUtil.getDataBaseType())) {
                		update.append(key).append('=').append("TO_DATE('").append(value).append("','yyyy-mm-dd hh24:mi:ss'),");
                	}
                	else {
                		update.append(key).append('=').append('\'').append(value).append("',");
                	}
                } 
                else {
                	update.append(key).append('=').append('\'').append(value).append("',");
                }
			}
			update.deleteCharAt(update.length() - 1);
			saveSql.append("UPDATE ").append(tableName).append(" SET ").append(update);
			saveSql.append(" WHERE ").append(pkName).append("='").append(pkValue).append('\'');
		}
		StringBuilder delStageSql = new StringBuilder();
		delStageSql.append("DELETE FROM STAGE_FORM_STORAGE ");
		delStageSql.append("WHERE STAFF_CODE = '").append(params.get("staffCode")).append("' ");
		delStageSql.append("AND PATIENT_CODE = '").append(params.get("patientCode")).append("' ");
		delStageSql.append("AND CATEGORY = '").append(params.get("category")).append('\'');
		Connection conn = null;
		Statement stmt = null;
		try {
			conn = DBUtil.getConnection();
			conn.setAutoCommit(false);
			stmt = conn.createStatement();
			stmt.executeUpdate(saveSql.toString());
			stmt.executeUpdate(delStageSql.toString());
			conn.commit();
		} catch (SQLException e) {
			try {
				conn.rollback();
			} catch (SQLException ex) {
				ex.printStackTrace();
			}
			LOGGER.error(e.toString(), e);
			throw new FormEngineException("Error occurs during saving data to database !", e);
		} finally {
			DBUtil.close(conn, stmt, null);
		}
	}
	
	public void drop(Map<String, Object> params) throws FormEngineException {
		Object tableName = params.get("tableName");
		Object primaryKeyName = params.get("primaryKeyName");
		if(primaryKeyName == null || "".equals(primaryKeyName)) {
			primaryKeyName = "ID";
		}
		Object primaryKeyValue = params.get("primaryKeyValue");
		Object dropFlagName = params.get("dropFlagName");
		if(dropFlagName == null || "".equals(dropFlagName)) {
			dropFlagName = "SCBZW";
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
			throw new FormEngineException("Error occurs during marking record deleted in database !", e);
		} finally {
			DBUtil.close(conn, stmt, null);
		}
	}
	
	public void stage(StageParam param) throws FormEngineException {
		String content = param.getContent();
		String staffCode = param.getStaffCode();
		String patientCode = param.getPatientCode();
		String category = param.getCategory();
		String deleteSql = "DELETE FROM STAGE_FORM_STORAGE WHERE STAFF_CODE = ? AND PATIENT_CODE = ? AND CATEGORY = ?";
		String insertSql = "INSERT INTO STAGE_FORM_STORAGE(ID, STAFF_CODE, PATIENT_CODE, CATEGORY, CONTENT) VALUES(?,?,?,?,?)";
		Connection conn = null;
		PreparedStatement deleteStmt = null;
		PreparedStatement insertStmt = null;
		try {
			conn = DBUtil.getConnection();
			conn.setAutoCommit(false);
			deleteStmt = conn.prepareStatement(deleteSql);
			deleteStmt.setString(1, staffCode);
			deleteStmt.setString(2, patientCode);
			deleteStmt.setString(3, category);
			deleteStmt.executeUpdate();
			insertStmt = conn.prepareStatement(insertSql);
			insertStmt.setString(1, UUID.randomUUID().toString());
			insertStmt.setString(2, staffCode);
			insertStmt.setString(3, patientCode);
			insertStmt.setString(4, category);
			insertStmt.setString(5, content);
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
			throw new FormEngineException("Error occurs during staging form content to database !", e);
		} finally {
			DBUtil.close(deleteStmt);
			DBUtil.close(insertStmt);
			DBUtil.close(conn);
		}
	}
	
}
