package com.neusoft.hit.fe.ext.surgery;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

import com.neusoft.hit.fe.core.api.PluginDataHandler;
import com.neusoft.hit.fe.core.exception.FormEngineException;
import com.neusoft.hit.fe.core.model.ResultInfo;
import com.neusoft.hit.fe.core.utility.DBUtil;
import com.neusoft.hit.fe.core.utility.FreemarkerUtil;

public class SurgeryDataHandler implements PluginDataHandler {

	@Override
	public String handle(Map<String, Object> params) throws FormEngineException {
		String result = ResultInfo.getResult();
        Object action = params.get("action");
        if ("load".equals(action)) {
            result = load(params);
        } else if ("save".equals(action)) {
            result = save(params);
        } else if ("drop".equals(action)) {
            result = drop(params);
        } else if ("sort".equals(action)) {
            result = sort(params);
        } 
        return result;
	}
	
	private String load(Map<String, Object> params) throws FormEngineException {
		String sql = "SELECT * FROM NEW_SSXX_TM WHERE SS_ID = '${surgery}' ORDER BY CREATE_TIME ASC";
		sql = FreemarkerUtil.getMixedString(sql, params);
		Connection conn = null;
		Statement stmt = null;
		ResultSet rs = null;
		List<Map<String, Object>> records = null;
		try {
			conn = DBUtil.getConnection();
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql.toString());
			records = DBUtil.getMultiResults(rs);
			
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			DBUtil.close(conn, stmt, rs);
		}
		return ResultInfo.getResult(records);
	}
	
	private String save(Map<String, Object> params) throws FormEngineException {
		String sql = "<#assign now=.now?string('yyyy-MM-dd HH:mm:ss')/>" +
					 "INSERT INTO NEW_SSXX_TM(GUID,SS_ID,SSBM,SSMC,CREATE_ID,CREATE_TIME,MODIFY_ID,MODIFY_TIME) " +
					 "VALUES('${CommonUtil.guid()}','${surgery}','${(surgeryItemCode)!}','${surgeryItemName}'," + 
					 "'${(operator)!}','${now}','${(operator)!}','${now}')";
		sql = FreemarkerUtil.getMixedString(sql, params);
		Connection conn = null;
		Statement stmt = null;
		try {
			conn = DBUtil.getConnection();
			stmt = conn.createStatement();
			stmt.executeUpdate(sql);
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			DBUtil.close(conn, stmt, null);
		}
		return ResultInfo.getResult();
	}
	
	private String drop(Map<String, Object> params) throws FormEngineException {
		String sql = "DELETE FROM NEW_SSXX_TM WHERE GUID = '${id}'";
		sql = FreemarkerUtil.getMixedString(sql, params);
		Connection conn = null;
		Statement stmt = null;
		try {
			conn = DBUtil.getConnection();
			stmt = conn.createStatement();
			stmt.executeUpdate(sql);
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			DBUtil.close(conn, stmt, null);
		}
		return ResultInfo.getResult();
	}

	private String sort(Map<String, Object> params) throws FormEngineException {
		return null;
	}
}
