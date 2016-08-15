package com.neusoft.hit.fe.core.utility;

import com.neusoft.hit.fe.core.model.JdbcCfgInfo;
import org.apache.commons.dbcp.BasicDataSource;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.sql.DataSource;
import java.lang.reflect.Field;
import java.sql.*;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 数据库工具类
 *
 * @author Jian
 */
public class DBUtil {


    private static final Log LOGGER = LogFactory.getLog(DBUtil.class);
    /**
     * 数据库驱动类名
     */
    private static String driverClass;
    /**
     * 连接用url
     */
    private static String url;
    /**
     * 登录用户名
     */
    private static String username;
    /**
     * 登录密码
     */
    private static String password;
    /**
     * 连接池初始化大小
     */
    private static int initialSize;
    /**
     * 连接池的最大数据库连接数，设为0表示无限制
     */
    private static int maxActive;
    /**
     * 最大空闲数，数据库连接的最大空闲时间，超过空闲时间，数据库连
     * 接将被标记为不可用，然后被释放，设为0表示无限制
     */
    private static int maxIdle;
    /**
     * 最大建立连接等待时间，如果超过此时间将接到异常，设为-1表示无限制
     */
    private static int maxWait;

    private static DataSource dataSource;

    static {
        Configuration configuration = Configuration.getInstance();
        JdbcCfgInfo jdbc = configuration.getJdbcCfg();
        driverClass = jdbc.getDriverClass();//configuration.getString("jdbc.driverClass");
        url = jdbc.getUrl();//configuration.getString("jdbc.url");
        username = jdbc.getUsername();//configuration.getString("jdbc.username");
        password = jdbc.getPassword();//configuration.getString("jdbc.password");
        initialSize = jdbc.getInitialSize();//configuration.getInt("jdbc.initialSize");
        maxActive = jdbc.getMaxActive();//configuration.getInt("jdbc.maxActive");
        maxIdle = jdbc.getMaxWait();//configuration.getInt("jdbc.maxIdle");
        maxWait = jdbc.getMaxWait();//configuration.getInt("jdbc.maxWait");
        BasicDataSource ds = new BasicDataSource();
        ds.setDriverClassName(driverClass);
        ds.setUsername(username);
        ds.setPassword(password);
        ds.setUrl(url);
        ds.setInitialSize(initialSize);
        ds.setMaxActive(maxActive);
        ds.setMaxIdle(maxIdle);
        ds.setMaxWait(maxWait);
        dataSource = ds;
    }

    /**
     * 获取数据库连接
     *
     * @return
     */
    public static Connection getConnection() {
        Connection conn = null;
        try {
            conn = dataSource.getConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return conn;
    }

    /**
     * 获取单条数据
     *
     * @param rs
     * @return
     */
    public static Map<String, Object> getSingleResult(ResultSet rs) {
        Map<String, Object> record = null;
        try {
            ResultSetMetaData meta = rs.getMetaData();
            int columnNum = meta.getColumnCount();
            if (rs.next()) {
                record = convertResultSetToMap(rs, meta, columnNum);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return record;
    }

    /**
     * 获取多条数据
     *
     * @param rs
     * @return
     */
    public static List<Map<String, Object>> getMultiResults(ResultSet rs) {
        List<Map<String, Object>> records = new ArrayList<Map<String, Object>>();
        try {
            ResultSetMetaData meta = rs.getMetaData();
            int columnNum = meta.getColumnCount();
            while (rs.next()) {
                Map<String, Object> record = convertResultSetToMap(rs, meta, columnNum);
                records.add(record);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return records;
    }

    private static Map<String, Object> convertResultSetToMap(ResultSet rs, ResultSetMetaData meta, int columnNum) throws SQLException {
        Map<String, Object> record = new LinkedHashMap<String, Object>();
        for (int i = 0; i < columnNum; i++) {
            String columnName = meta.getColumnLabel(i + 1);
            String columnType = meta.getColumnTypeName(i + 1);
            Object value = null;
            if ("TIMESTAMP".equals(columnType)) {
                value = rs.getTimestamp(columnName);
            } else if ("CLOB".equals(columnType)) {
                Clob clob = rs.getClob(columnName);
                value = clob.getSubString(1, (int) clob.length());
            } else {
                value = rs.getObject(columnName);
            }
            record.put(columnName, value);
        }
        return record;
    }

    /**
     * 关闭Connection
     *
     * @param conn
     */
    public static void close(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 关闭Statement
     *
     * @param stmt
     */
    public static void close(Statement stmt) {
        if (stmt != null) {
            try {
                stmt.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 关闭ResultSet
     *
     * @param rs
     */
    public static void close(ResultSet rs) {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 关闭全部
     *
     * @param conn
     * @param stmt
     * @param rs
     */
    public static void close(Connection conn, Statement stmt, ResultSet rs) {
        close(rs);
        close(stmt);
        close(conn);
    }

    /**
     * 获取数据库类型
     *
     * @return
     */
    public static String getDataBaseType() {
        //通过driverName是否包含关键字判断
        if (driverClass.toUpperCase().indexOf("ORACLE") != -1) {
            return "Oracle";
        } else if (driverClass.toUpperCase().indexOf("POSTGRESQL") != -1) {
            return "Postgresql";
        }
        return "-1";
    }
    
    public static boolean checkTableExists(String tableName) {
    	String dbType = getDataBaseType();
    	String sql = null;
    	if("Oracle".equalsIgnoreCase(dbType)) {
    		sql = "SELECT COUNT(*) FROM USER_TABLES WHERE TABLE_NAME = '"+ StringUtils.upperCase(tableName) +"'";
    	}
    	else if("Postgresql".equalsIgnoreCase(dbType)) {
    		//TODO
    	}
    	Connection conn = null;
    	Statement stmt = null;
    	ResultSet rs = null;
    	boolean ret = false;
    	try {
			conn = getConnection();
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
			if(rs.next()) {
				ret = rs.getInt(1) > 0 ? true : false;
			}
		} catch (SQLException e) {
			LOGGER.error(e.toString(), e);
		} finally {
			close(conn, stmt, rs);
		}
    	return ret;
    }


    /**
     * 将数据集转换成list
     *
     * @param cls
     * @param sql
     * @param <T>
     * @return
     */
    public static <T> List<T> executeList(Class<T> cls, String sql) {
        List<T> list = new ArrayList<T>();
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = getConnection();
            ps = con.prepareStatement(sql);
            rs = ps.executeQuery();
            while (rs.next()) {
                T obj = executeResultSet(cls, rs);
                list.add(obj);
            }
        } catch (Exception e) {
            LOGGER.error(e.toString(), e);
        } finally {
            close(con, ps, rs);
        }
        return list;
    }


    /**
     * 将结果转换成对象
     *
     * @param cls
     * @param rs
     * @param <T>
     * @return
     * @throws InstantiationException
     * @throws IllegalAccessException
     * @throws SQLException
     */
    private static <T> T executeResultSet(Class<T> cls, ResultSet rs)
            throws InstantiationException, IllegalAccessException, SQLException {
        T obj = cls.newInstance();
        ResultSetMetaData rsm = rs.getMetaData();
        int columnCount = rsm.getColumnCount();
        // Field[] fields = cls.getFields();
        Field[] fields = cls.getDeclaredFields();
        for (int i = 0; i < fields.length; i++) {
            Field field = fields[i];
            String fieldName = field.getName();
            for (int j = 1; j <= columnCount; j++) {
                String columnName = rsm.getColumnName(j);
                if (fieldName.equalsIgnoreCase(columnName)) {
                    Object value = rs.getObject(j);
                    field.setAccessible(true);
                    field.set(obj, value);
                    break;
                }
            }
        }
        return obj;
    }


}
