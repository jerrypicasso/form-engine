package com.neusoft.hit.fe.ext.diagnosis;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

import com.neusoft.hit.fe.core.api.PluginDataHandler;
import com.neusoft.hit.fe.core.exception.FormEngineException;
import com.neusoft.hit.fe.core.model.ResultInfo;
import com.neusoft.hit.fe.core.utility.CommonUtil;
import com.neusoft.hit.fe.core.utility.DBUtil;
import com.neusoft.hit.fe.core.utility.FreemarkerUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class DiagnosisDataHandler implements PluginDataHandler {
	
	private String load(Map<String, Object> param) throws FormEngineException {
		String result = null;
		String sqlTpl = "SELECT ID,ICD_10,NAME FROM DIAGNOSIS WHERE PATIENT_CODE = ${brbh} AND CATEGORY = ${lx} ORDER BY SEQ";
		String sql = FreemarkerUtil.getMixedString(sqlTpl, param);
		Connection conn = null;
		Statement stmt = null;
		ResultSet rs = null;
		try {
			conn = DBUtil.getConnection();
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
			List<Map<String, Object>> diagnosisList = DBUtil.getMultiResults(rs);
			rs.close();
			sqlTpl = "SELECT ID,DIAGNOSIS_ID,NAME,ICD_10 FROM DIAGNOSIS_SUB WHERE DIAGNOSIS_ID = '${ID}' ORDER BY SEQ";
			for(Map<String, Object> diagnosis : diagnosisList) {
				sql = FreemarkerUtil.getMixedString(sqlTpl, diagnosis);
				rs = stmt.executeQuery(sql);
				List<Map<String, Object>> subDiagnosisList = DBUtil.getMultiResults(rs);
				rs.close();
				diagnosis.put("items", subDiagnosisList);
			}
			result = JSONArray.fromObject(diagnosisList).toString();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			DBUtil.close(conn, stmt, rs);
		}
		return result;
	}
	
	private String save(Map<String, Object> param) throws FormEngineException {
		String sqlTpl = "INSERT INTO DIAGNOSIS(ID,PATIENT_CODE,CATEGORY,ICD_10,NAME) VALUES('${id}','${brbh}','${diagnosisType}','${diagnosisCode}','${diagnosisText}')";
		Object diagnosisParent = param.get("diagnosisParent");
		if(diagnosisParent != null && !"".equals(diagnosisParent)) {
			sqlTpl = "INSERT INTO DIAGNOSIS_SUB(ID,DIAGNOSIS_ID,ICD_10,NAME) VALUES('${id}','${diagnosisParent}','${diagnosisCode}','${diagnosisText}')";
		}
		param.put("id", CommonUtil.guid());
		String sql = FreemarkerUtil.getMixedString(sqlTpl, param);
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
	
	private String drop(Map<String, Object> param) throws FormEngineException {
		Connection conn = null;
		Statement stmt = null;
		try {
			conn = DBUtil.getConnection();
			conn.setAutoCommit(false);
			stmt = conn.createStatement();
			String sqlTpl = "DELETE FROM DIAGNOSIS WHERE ID = '${id}'";
			String sql = FreemarkerUtil.getMixedString(sqlTpl, param);
			stmt.executeUpdate(sql);
			sqlTpl = "DELETE FROM DIAGNOSIS_SUB WHERE ID = '${id}' OR DIAGNOSIS_ID = '${id}'";
			sql = FreemarkerUtil.getMixedString(sqlTpl, param);
			stmt.executeUpdate(sql);
			conn.commit();
		} catch (SQLException e) {
			try {
				conn.rollback();
			} catch (SQLException ex) {
				ex.printStackTrace();
			}
		} finally {
			DBUtil.close(conn, stmt, null);
		}
		return ResultInfo.getResult();
	}
	
	private String sort(Map<String, Object> param) throws FormEngineException {
		Object records = param.get("records");
		Object type = param.get("type");
		if(records != null) {
			JSONArray arr = JSONArray.fromObject(records);
			String sql = "UPDATE DIAGNOSIS SET SEQ = ? WHERE ID = ?";
			if("sub".equals(type)) {
				sql = "UPDATE DIAGNOSIS_SUB SET SEQ = ? WHERE ID = ?";
			}
			Connection conn = null;
			PreparedStatement stmt = null;
			try {
				conn = DBUtil.getConnection();
				conn.setAutoCommit(false);
				stmt = conn.prepareStatement(sql);
				for(int i = 0; i < arr.size(); i++) {
					JSONObject jsonObj = (JSONObject) arr.get(i);
					stmt.setObject(1, jsonObj.get("seq"));
					stmt.setObject(2, jsonObj.get("id"));
					stmt.addBatch();
				}
				stmt.executeBatch();
				conn.commit();
			} catch (SQLException e) {
				e.printStackTrace();
				try {
					conn.rollback();
				} catch (SQLException ex) {
					ex.printStackTrace();
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
}
