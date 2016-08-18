package com.neusoft.hit.fe.ext.utility;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.neusoft.hit.fe.core.utility.DBUtil;
import com.neusoft.hit.fe.core.utility.EngineUtil;

public class EmrUtil {
	
	private static final Log LOGGER = LogFactory.getLog(EmrUtil.class);
	
	public static String staffs(String codes) {
		String text = "";
		if(codes != null && codes.trim().length() > 0) {
			StringBuilder sql = new StringBuilder();
			sql.append("SELECT XM FROM YGJBXX WHERE YGBH IN (").append(codes).append(") ");
			sql.append("ORDER BY INSTR('").append(codes).append("', ygbh)");
			Connection conn = null;
			Statement stmt = null;
			ResultSet rs = null;
			try {
				conn = DBUtil.getConnection();
				stmt = conn.createStatement();
				rs = stmt.executeQuery(sql.toString());
				List<Map<String, Object>> records = DBUtil.getMultiResults(rs);
				text = EngineUtil.join(records, "XM");
			} catch (Exception e) {
				LOGGER.error(e.toString(), e);
			} finally {
				DBUtil.close(conn, stmt, rs);
			}
		}
		return text;
	}
	
	public static String staff(String code) {
		String text = "";
		if(code != null && code.trim().length() > 0) {
			StringBuilder sql = new StringBuilder();
			sql.append("SELECT XM FROM YGJBXX WHERE YGBH = ").append(code);
			Connection conn = null;
			Statement stmt = null;
			ResultSet rs = null;
			try {
				conn = DBUtil.getConnection();
				stmt = conn.createStatement();
				rs = stmt.executeQuery(sql.toString());
				if(rs.next()) {
					text = rs.getString("XM");
				}
			} catch (Exception e) {
				LOGGER.error(e.toString(), e);
			} finally {
				DBUtil.close(conn, stmt, rs);
			}
		}
		return text;
	}
	
	public static String dict(String category, String code) {
		String text = "";
		if(category != null && category.trim().length() > 0
				&& code != null && code.trim().length() > 0) {
			StringBuilder sql = new StringBuilder();
			sql.append("SELECT SHORT_NAME FROM C_PROJECT_DETAILS ");
			sql.append("WHERE PROJECT_DETAIL_CODE = '").append(code).append("' AND ");
			sql.append("PROJECT_ID = (SELECT PROJECT_ID WHERE PROJECT_CODE = '").append(category).append("')");
			Connection conn = null;
			Statement stmt = null;
			ResultSet rs = null;
			try {
				conn = DBUtil.getConnection();
				stmt = conn.createStatement();
				rs = stmt.executeQuery(sql.toString());
				if(rs.next()) {
					text = rs.getString("SHORT_NAME");
				}
			} catch (Exception e) {
				LOGGER.error(e.toString(), e);
			} finally {
				DBUtil.close(conn, stmt, rs);
			}
		}
		return text;
	}
	
}
