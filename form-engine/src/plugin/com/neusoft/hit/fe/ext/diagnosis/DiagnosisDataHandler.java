package com.neusoft.hit.fe.ext.diagnosis;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.neusoft.hit.fe.core.api.PluginDataHandler;
import com.neusoft.hit.fe.core.exception.FormEngineException;
import com.neusoft.hit.fe.core.model.ResultInfo;
import com.neusoft.hit.fe.core.utility.DBUtil;
import com.neusoft.hit.fe.core.utility.FreemarkerUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class DiagnosisDataHandler implements PluginDataHandler {
	
	private static final Log LOGGER = LogFactory.getLog(DiagnosisDataHandler.class);
	private String diagnosisSelectSql;
	private String diagnosisInsertSql;
	private String subDiagnosisSelectSql;
	private String subDiagnosisInsertSql;
	private String diagnosisOrderSql;
	private String subDiagnosisOrderSql;
	private String diagnosisDeleteSql;
	private String subDiagnosisDeleteSql;
	
	private String load(Map<String, Object> param) throws FormEngineException {
		String result = null;
		String sql = FreemarkerUtil.getMixedString(diagnosisSelectSql, param);
		Connection conn = null;
		Statement stmt = null;
		ResultSet rs = null;
		try {
			conn = DBUtil.getConnection();
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
			List<Map<String, Object>> diagnosisList = DBUtil.getMultiResults(rs);
			rs.close();
			for(Map<String, Object> diagnosis : diagnosisList) {
				sql = FreemarkerUtil.getMixedString(subDiagnosisSelectSql, diagnosis);
				rs = stmt.executeQuery(sql);
				List<Map<String, Object>> subDiagnosisList = DBUtil.getMultiResults(rs);
				rs.close();
				diagnosis.put("items", subDiagnosisList);
			}
			result = JSONArray.fromObject(diagnosisList).toString();
		} catch (SQLException e) {
			LOGGER.error(e.toString(), e);
		} finally {
			DBUtil.close(conn, stmt, rs);
		}
		return result;
	}
	
	private String save(Map<String, Object> param) throws FormEngineException {
		Object diagnosisParent = param.get("diagnosisParent");
		String sql = null;
		if(diagnosisParent != null && !"".equals(diagnosisParent)) {
			sql = FreemarkerUtil.getMixedString(subDiagnosisInsertSql, param);
		}
		else {
			sql = FreemarkerUtil.getMixedString(diagnosisInsertSql, param);
		}
		Connection conn = null;
		Statement stmt = null;
		try {
			conn = DBUtil.getConnection();
			stmt = conn.createStatement();
			stmt.executeUpdate(sql);
		} catch (SQLException e) {
			LOGGER.error(e.toString(), e);
		} finally {
			DBUtil.close(conn, stmt, null);
		}
		return ResultInfo.getResult();
	}
	
	private String drop(Map<String, Object> param) throws FormEngineException {
		Connection conn = null;
		Statement stmt = null;
		try {
			conn = DBUtil.getConnection();
			conn.setAutoCommit(false);
			stmt = conn.createStatement();
			String sql = FreemarkerUtil.getMixedString(diagnosisDeleteSql, param);
			stmt.executeUpdate(sql);
			sql = FreemarkerUtil.getMixedString(subDiagnosisDeleteSql, param);
			stmt.executeUpdate(sql);
			conn.commit();
		} catch (SQLException e) {
			LOGGER.error(e.toString(), e);
			try {
				conn.rollback();
			} catch (SQLException ex) {
				LOGGER.error(e.toString(), ex);
			}
		} finally {
			DBUtil.close(conn, stmt, null);
		}
		return ResultInfo.getResult();
	}
	
	@SuppressWarnings("unchecked")
	private String sort(Map<String, Object> param) throws FormEngineException {
		Object records = param.get("records");
		Object type = param.get("type");
		if(records != null) {
			JSONArray arr = JSONArray.fromObject(records);
			String sql = diagnosisOrderSql;
			if("sub".equals(type)) {
				sql = subDiagnosisOrderSql;
			}
			Connection conn = null;
			Statement stmt = null;
			try {
				conn = DBUtil.getConnection();
				conn.setAutoCommit(false);
				stmt = conn.prepareStatement(sql);
				for(int i = 0; i < arr.size(); i++) {
					JSONObject jsonObj = (JSONObject) arr.get(i);
					sql = FreemarkerUtil.getMixedString(sql, jsonObj);
					stmt.executeUpdate(sql);
				}
				conn.commit();
			} catch (SQLException e) {
				LOGGER.error(e.toString(), e);
				try {
					conn.rollback();
				} catch (SQLException ex) {
					LOGGER.error(e.toString(), ex);
				}
			} finally {
				DBUtil.close(conn, stmt, null);
			}
		}
		return ResultInfo.getResult();
	}

	@Override
	public String handle(Map<String, Object> params) throws FormEngineException {
		String result = ResultInfo.getResult();
		Object action = params.get("action");
		if("load".equals(action)) {
			result = load(params);
		}
		else if("save".equals(action)) {
			result = save(params);
		}
		else if("drop".equals(action)) {
			result = drop(params);
		}
		else if("sort".equals(action)) {
			result = sort(params);
		}
		return result;
	}

	public String getDiagnosisSelectSql() {
		return diagnosisSelectSql;
	}

	public void setDiagnosisSelectSql(String diagnosisSelectSql) {
		this.diagnosisSelectSql = diagnosisSelectSql;
	}

	public String getDiagnosisInsertSql() {
		return diagnosisInsertSql;
	}

	public void setDiagnosisInsertSql(String diagnosisInsertSql) {
		this.diagnosisInsertSql = diagnosisInsertSql;
	}

	public String getSubDiagnosisSelectSql() {
		return subDiagnosisSelectSql;
	}

	public void setSubDiagnosisSelectSql(String subDiagnosisSelectSql) {
		this.subDiagnosisSelectSql = subDiagnosisSelectSql;
	}

	public String getSubDiagnosisInsertSql() {
		return subDiagnosisInsertSql;
	}

	public void setSubDiagnosisInsertSql(String subDiagnosisInsertSql) {
		this.subDiagnosisInsertSql = subDiagnosisInsertSql;
	}

	public String getDiagnosisOrderSql() {
		return diagnosisOrderSql;
	}

	public void setDiagnosisOrderSql(String diagnosisOrderSql) {
		this.diagnosisOrderSql = diagnosisOrderSql;
	}

	public String getSubDiagnosisOrderSql() {
		return subDiagnosisOrderSql;
	}

	public void setSubDiagnosisOrderSql(String subDiagnosisOrderSql) {
		this.subDiagnosisOrderSql = subDiagnosisOrderSql;
	}

	public String getDiagnosisDeleteSql() {
		return diagnosisDeleteSql;
	}

	public void setDiagnosisDeleteSql(String diagnosisDeleteSql) {
		this.diagnosisDeleteSql = diagnosisDeleteSql;
	}

	public String getSubDiagnosisDeleteSql() {
		return subDiagnosisDeleteSql;
	}

	public void setSubDiagnosisDeleteSql(String subDiagnosisDeleteSql) {
		this.subDiagnosisDeleteSql = subDiagnosisDeleteSql;
	}
}
