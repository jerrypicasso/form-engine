package com.neusoft.hit.fe.ext.audit;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.neusoft.hit.fe.core.api.PluginDataHandler;
import com.neusoft.hit.fe.core.exception.FormEngineException;
import com.neusoft.hit.fe.core.model.ResultInfo;
import com.neusoft.hit.fe.core.utility.DBUtil;
import com.neusoft.hit.fe.core.utility.FreemarkerUtil;

public class AuditDataHandler implements PluginDataHandler {

	private static final Log LOGGER = LogFactory.getLog(AuditDataHandler.class);
	
	@Override
	public String handle(Map<String, Object> params) throws FormEngineException {
		String result = ResultInfo.getResult();
		Object action = params.get("action");
		if("check".equals(action)) {
			result = check(params);
		}
		else if("update".equals(action)) {
			result = update(params);
		}
		return result;
	}

	private String check(Map<String, Object> params) throws FormEngineException {
		return "{\"authorized\":\"true\",\"message\":\"2041740\"}";
	}
	
	private String update(Map<String, Object> params) throws FormEngineException {
		String sql = "UPDATE ${tableName} SET MODIFY_ID = '${staffCode}' WHERE ${pkName} = '${pkValue}' " ;
		sql = FreemarkerUtil.getMixedString(sql, params);
		Connection conn = null;
		Statement stmt = null;
		try {
			conn = DBUtil.getConnection();
			stmt = conn.createStatement();
			stmt.executeUpdate(sql);
		} catch (SQLException e) {
			LOGGER.error(e.toString(), e);
			ResultInfo.getFailureResult(e.getMessage());
		} finally {
			DBUtil.close(conn, stmt, null);
		}
		return ResultInfo.getSuccessResult("审签完毕！");
	}
}
