package com.neusoft.hit.fe.ext.pagnation;

import com.neusoft.hit.fe.core.api.PluginDataHandler;
import com.neusoft.hit.fe.core.exception.FormEngineException;
import com.neusoft.hit.fe.core.model.ResultInfo;
import com.neusoft.hit.fe.core.utility.DBUtil;
import com.neusoft.hit.fe.core.utility.EngineUtil;
import com.neusoft.hit.fe.core.utility.FreemarkerUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 分页数据获取插件
 * Created by Administrator on 2016/8/22 0022.
 */
public class PagnationFormHandler implements PluginDataHandler {

    private static final Log LOGGER = LogFactory.getLog(PagnationFormHandler.class);

    private static final String  SELECTPAGERESULTSQL = "SELECT GUID as \"guid\",CREATE_TIME as  \"createTime\" " +
            "FROM PAGANATION_MANAGE " +
            "WHERE CATEGORY = '${category}' " +
            "<#if patientCode?? && patientCode!=''>" +
            "AND BRBH = '${patientCode}' " +
            "</#if>" +
            "<#if medicalNum?? && medicalNum!=''>" +
            "AND JZXH = '${medicalNum}'" +
            "</#if>"+
            "order by to_date(CREATE_TIME,'yyyy-mm-dd hh24:mi:ss') DESC";

    private static final String INSERTPAGESQL = "INSERT INTO PAGANATION_MANAGE " +
            "(GUID, CATEGORY, BRBH, JZXH, CREATE_ID, CREATE_TIME, MODIFY_ID, MODIFY_TIME) " +
            "VALUES ('${guid}', '${category}', '${patientCode}', '${medicalNum}','${staffCode}'," +
            "'${EngineUtil.now()}','${staffCode}','${EngineUtil.now()}')";

    private static final String DELETEPAGESQL = "DELETE FROM PAGANATION_MANAGE WHERE GUID= '${guid}'";

    private String load(Map<String, Object> param) throws FormEngineException {

        String result = null;
        String sql = FreemarkerUtil.getMixedString(SELECTPAGERESULTSQL, param);
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            List<Map<String, Object>> pageList = DBUtil.getMultiResults(rs);
            result = JSONArray.fromObject(pageList).toString();
        } catch (Exception e) {
            LOGGER.error(e.toString(), e);
        } finally {
            DBUtil.close(conn, stmt, rs);
        }
        return result;

    }

    private String create(Map<String, Object> params) throws FormEngineException {
        String pageId = EngineUtil.guid();
        params.put("guid",pageId);
        String sql = FreemarkerUtil.getMixedString(INSERTPAGESQL, params);
        Map<String, Object> results = new HashMap<String, Object>();
        Connection conn = null;
        Statement stmt = null;
        String result = null;
        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            stmt.executeUpdate(sql);
            results.put("pageId",pageId);
        } catch (SQLException e) {
            LOGGER.error(e.toString(), e);
        }finally {
            DBUtil.close(conn,stmt,null);
        }
        result = JSONObject.fromObject(results).toString();
        return result;
    }

    private String delete(Map<String, Object> params) throws FormEngineException{
        Connection conn = null;
        Statement stmt = null;
        String sql = FreemarkerUtil.getMixedString(DELETEPAGESQL,params);
        String result = null;
        Map<String, Object> results = new HashMap<String, Object>();
        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            stmt.executeUpdate(sql);
            results.put("pageId",params.get("pageId"));
        } catch (SQLException e) {
            LOGGER.error(e.toString(), e);
        }finally {
            DBUtil.close(conn,stmt,null);
        }
        result = JSONObject.fromObject(results).toString();
        return result;
    }

    @Override
    public String handle(Map<String, Object> params) throws FormEngineException {
        String result = ResultInfo.getResult();
        Object action = params.get("action");
        if ("load".equals(action)) {
            result = load(params);
        } else if ("create".equals(action)) {
            result = create(params);
        }else if ("delete".equals(action)) {
            result = delete(params);
        }

        return result;
    }




}
