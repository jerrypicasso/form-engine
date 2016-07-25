package com.neusoft.hit.emr.fd.util;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class DBUtil {
	
	private static String driver = null;
	private static String url = null;
	private static String username = null;
	private static String password = null;
	
	static {
		Properties properties = new Properties();
		InputStream is = DBUtil.class.getResourceAsStream("/jdbc.properties");
		try {
			properties.load(is);
			driver = properties.getProperty("driver");
			url = properties.getProperty("url");
			username = properties.getProperty("username");
			password = properties.getProperty("password");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static Connection getConnection() {
		Connection conn = null;
		try {
			Class.forName(driver);
			conn = DriverManager.getConnection(url, username, password);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return conn;
	}
	
	public static List<Map<String, Object>> getMultiResults(String sql) {
		List<Map<String, Object>> records = new ArrayList<Map<String, Object>>();
		Connection conn = DBUtil.getConnection();
		Statement stmt = null;
		ResultSet rs = null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
			ResultSetMetaData meta = rs.getMetaData();
			int columnNum =  meta.getColumnCount();
			while(rs.next()) {
				Map<String, Object> record = new HashMap<String, Object>();
				for(int i = 0; i < columnNum; i++) {
					String columnName = meta.getColumnLabel(i+1);
					Object value = rs.getObject(columnName);
					if(value instanceof Clob) {
						Clob temp = ((Clob)value);
						value = temp.getSubString(1l, (int)temp.length());
					}
					record.put(columnName, value);
				}
				records.add(record);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				rs.close();
				stmt.close();
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return records;
	}
	
	public static List<Map<String, Object>> getMultiResults(String sql, Object[] params) {
		List<Map<String, Object>> records = new ArrayList<Map<String, Object>>();
		Connection conn = DBUtil.getConnection();
		PreparedStatement stmt = null;
		ResultSet rs = null;
		try {
			stmt = conn.prepareStatement(sql);
			for(int i = 0; i < params.length; i++) {
				stmt.setObject(i + 1, params[i]);
			}
			rs = stmt.executeQuery();
			ResultSetMetaData meta = rs.getMetaData();
			int columnNum =  meta.getColumnCount();
			while(rs.next()) {
				Map<String, Object> record = new HashMap<String, Object>();
				for(int i = 0; i < columnNum; i++) {
					String columnName = meta.getColumnLabel(i+1);
					Object value = rs.getObject(columnName);
					if(value instanceof Clob) {
						Clob temp = ((Clob)value);
						value = temp.getSubString(1l, (int)temp.length());
					}
					record.put(columnName, value);
				}
				records.add(record);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				rs.close();
				stmt.close();
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return records;
	}
	
	public static List<String> getFieldNames(String sql) {
		List<String> names = new ArrayList<String>();
		Connection conn = DBUtil.getConnection();
		Statement stmt = null;
		ResultSet rs = null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
			ResultSetMetaData meta = rs.getMetaData();
			int columnNum =  meta.getColumnCount();
			for(int i = 0; i < columnNum; i++) {
				String columnName = meta.getColumnLabel(i+1);
				names.add(columnName);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				if(rs != null) {
					rs.close();
				}
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
		return names;
	}
	
	public static Map<String, Object> getSingleResult(String sql) {
		Map<String, Object> record = null;
		Connection conn = DBUtil.getConnection();
		Statement stmt = null;
		ResultSet rs = null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
			ResultSetMetaData meta = rs.getMetaData();
			int columnNum =  meta.getColumnCount();
			if(rs.next()) {
				record = new HashMap<String, Object>();
				for(int i = 0; i < columnNum; i++) {
					String columnName = meta.getColumnLabel(i+1);
					Object value = rs.getObject(columnName);
					if(value instanceof Clob) {
						Clob temp = ((Clob)value);
						value = temp.getSubString(1l, (int)temp.length());
					}
					record.put(columnName, value);
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				rs.close();
				stmt.close();
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return record;
	}
	
	public static Map<String, Object> getSingleResult(String sql, Object[] params) {
		Map<String, Object> record = null;
		Connection conn = DBUtil.getConnection();
		PreparedStatement stmt = null;
		ResultSet rs = null;
		try {
			stmt = conn.prepareStatement(sql);
			for(int i = 0; i < params.length; i++) {
				stmt.setObject(i + 1, params[i]);
			}
			rs = stmt.executeQuery();
			ResultSetMetaData meta = rs.getMetaData();
			int columnNum =  meta.getColumnCount();
			if(rs.next()) {
				record = new HashMap<String, Object>();
				for(int i = 0; i < columnNum; i++) {
					String columnName = meta.getColumnLabel(i+1);
					Object value = rs.getObject(columnName);
					if(value instanceof Clob) {
						Clob temp = ((Clob)value);
						value = temp.getSubString(1l, (int)temp.length());
					}
					record.put(columnName, value);
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				rs.close();
				stmt.close();
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return record;
	}
	
	public static void upsertRecord(String sql) {
		Connection conn = DBUtil.getConnection();
		Statement stmt = null;
		try {
			stmt = conn.createStatement();
			stmt.executeUpdate(sql);
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				stmt.close();
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	
	public static void deleteRecord(String sql) {
		Connection conn = DBUtil.getConnection();
		Statement stmt = null;
		try {
			stmt = conn.createStatement();
			stmt.execute(sql);
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				stmt.close();
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	
	public static void upsertSingleRecord(String sql, Object[] params) {
		Connection conn = DBUtil.getConnection();
		PreparedStatement stmt = null;
		try {
			stmt = conn.prepareStatement(sql);
			for(int i = 0; i < params.length; i++) {
				stmt.setObject(i + 1, params[i]);
			}
			stmt.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				stmt.close();
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	
	public static void deleteRecord(String sql, Object[] params) {
		Connection conn = DBUtil.getConnection();
		Statement stmt = null;
		try {
			stmt = conn.createStatement();
			stmt.executeUpdate(sql);
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				stmt.close();
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	
	public static String getDataBaseType() {  
        //通过driverName是否包含关键字判断
        if(driver.toUpperCase().indexOf("ORACLE") != -1) {
        	return "Oracle";
        } else if(driver.toUpperCase().indexOf("POSTGRESQL") != -1) {
        	return "Postgresql";
        }
        return "-1";  
    }
}
