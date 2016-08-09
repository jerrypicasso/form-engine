package com.neusoft.hit.fe.ext.nursing;

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

public class NursingDataHandler implements PluginDataHandler {

	private static final Log LOGGER = LogFactory.getLog(NursingDataHandler.class);
	
	@Override
	public String handle(Map<String, Object> params) throws FormEngineException {
		Object ioSql = params.get("ioSql");
		Object beginTime = params.get("beginTime");
		Object endTime = params.get("endTime");
		Object patientCode = params.get("patientCode");
		if(ioSql != null && beginTime != null && endTime != null && patientCode != null) {
			String sql = ioSql.toString().replaceAll("@\\{([^\\}]*)\\}", "\\${$1}");
			sql = FreemarkerUtil.getMixedString(sql, params);
			Connection conn = null;
			Statement stmt = null;
			conn = DBUtil.getConnection();
			try {
				stmt = conn.createStatement();
				System.out.println(sql);
				stmt.executeUpdate(sql);
			} catch (SQLException e) {
				LOGGER.error(e.toString(), e);
			} finally {
				DBUtil.close(conn, stmt, null);
			}
		}
		return ResultInfo.getResult();
	}

}
