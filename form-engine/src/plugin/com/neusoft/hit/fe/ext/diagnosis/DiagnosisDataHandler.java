package com.neusoft.hit.fe.ext.diagnosis;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;

import com.neusoft.hit.fe.core.utility.CommonUtil;
import org.apache.commons.lang.StringUtils;
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
    public static String TRUE = "Y";
    public static String FALSE = "N";
    private String diagnosisSelectSql;
    private String diagnosisSelectSql2;
    private String diagnosisInsertSql;
    private String subDiagnosisSelectSql;
    private String subDiagnosisSelectSql2;
    private String subDiagnosisInsertSql;
    private String diagnosisOrderSql;
    private String subDiagnosisOrderSql;
    private String diagnosisDeleteSql;
    private String subDiagnosisDeleteSql;
    private String modelSelectSql;
    private String diagnosisSelectSqlAll;
    private String modelSaveSql;
    private String modelDeleteSql;
    private String modelSortSql;
    private String hasDiagnosisSql;
    private String dropRYdiagnosisSql;
    private String syncdiagnosisSql;
    private String dropSubRYdiagnosisSql;
    private String diagnosisSyncSql;
    private String subDiagnosisSyncSql;
    private String diagnosisUpdateAllSql;
    private String changeSyncStatusSql;

    public String getChangeSyncStatusSql() {
        return changeSyncStatusSql;
    }

    public void setChangeSyncStatusSql(String changeSyncStatusSql) {
        this.changeSyncStatusSql = changeSyncStatusSql;
    }

    private String load(Map<String, Object> param) throws FormEngineException {
        String result = null;
        String sql = FreemarkerUtil.getMixedString(diagnosisSelectSql, param);
        Map<String, Object> resultMap = new HashMap<String, Object>();
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            List<Map<String, Object>> diagnosisList = DBUtil.getMultiResults(rs);
            rs.close();
            for (Map<String, Object> diagnosis : diagnosisList) {
                sql = FreemarkerUtil.getMixedString(subDiagnosisSelectSql, diagnosis);
                rs = stmt.executeQuery(sql);
                List<Map<String, Object>> subDiagnosisList = DBUtil.getMultiResults(rs);
                rs.close();
                diagnosis.put("items", subDiagnosisList);
            }

            resultMap.put("list", diagnosisList);

            sql = FreemarkerUtil.getMixedString(hasDiagnosisSql, param);
            rs = stmt.executeQuery(sql);
            Map<String, Object> hasDiagnosis = DBUtil.getSingleResult(rs);
            if (null != hasDiagnosis) {
                resultMap.put("signatureInfo", hasDiagnosis);
            }


            result = JSONObject.fromObject(resultMap).toString();
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
        Object children1 = param.get("children");
        JSONArray children = null;
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;


        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            sql = FreemarkerUtil.getMixedString(hasDiagnosisSql, param);
            rs = stmt.executeQuery(sql);
            Map<String, Object> hasDiagnosis = DBUtil.getSingleResult(rs);
            if (null == hasDiagnosis || null == hasDiagnosis.get("createId")) {
                param.put("createId", param.get("staffCode"));
            } else {
                param.put("createId", hasDiagnosis.get("createId"));
            }
        } catch (SQLException e) {
            LOGGER.error(e.toString(), e);
        } finally {
            DBUtil.close(conn, stmt, null);
        }


        if (children1 != null) {
            children = JSONArray.fromObject(param.get("children"));
        }
        String guid = null;
        if (diagnosisParent != null && !"".equals(diagnosisParent)) {
            param.put("guid", CommonUtil.guid());
            sql = FreemarkerUtil.getMixedString(subDiagnosisInsertSql, param);
        } else {
            guid = CommonUtil.guid();
            param.put("guid", guid);
            sql = FreemarkerUtil.getMixedString(diagnosisInsertSql, param);
        }

        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            stmt.executeUpdate(sql);

            sql = FreemarkerUtil.getMixedString(diagnosisUpdateAllSql, param);
            stmt.executeUpdate(sql);


            if (param.get("diagnosisType") != null && ("10".equals(param.get("diagnosisType").toString()) || "20".equals(param.get("diagnosisType").toString()))) {
                param.put("syncStatus", DiagnosisDataHandler.FALSE);
                sql = FreemarkerUtil.getMixedString(changeSyncStatusSql, param);
                stmt.executeUpdate(sql);
            }

        } catch (SQLException e) {
            LOGGER.error(e.toString(), e);
        } finally {
            DBUtil.close(conn, stmt, null);
        }

        /*应用于诊断模板存储子数据*/
        if (children != null && children.size() > 0 && !children.isEmpty()) {
            conn = null;
            stmt = null;
            String sqlTemplate = subDiagnosisInsertSql;
            try {
                conn = DBUtil.getConnection();
                conn.setAutoCommit(false);
                stmt = conn.prepareStatement(sqlTemplate);
                for (int i = 0; i < children.size(); i++) {
                    sql = sqlTemplate;
                    JSONObject jsonObj = (JSONObject) children.get(i);
                    jsonObj.put("diagnosisParent", guid);
                    jsonObj.put("staffCode", param.get("staffCode"));
                    jsonObj.put("createId", param.get("createId"));
                    jsonObj.put("guid", CommonUtil.guid());
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
            sql = FreemarkerUtil.getMixedString(diagnosisUpdateAllSql, param);
            stmt.executeUpdate(sql);
            if (param.get("diagnosisType") != null
                    && ("10".equals(param.get("diagnosisType").toString())
                    || "20".equals(param.get("diagnosisType").toString()))) {
                param.put("syncStatus", DiagnosisDataHandler.FALSE);
                sql = FreemarkerUtil.getMixedString(changeSyncStatusSql, param);
            }
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
        if (records != null) {
            JSONArray arr = JSONArray.fromObject(records);
            String sqlTemplate = diagnosisOrderSql;
            if ("sub".equals(type)) {
                sqlTemplate = subDiagnosisOrderSql;
            }
            Connection conn = null;
            Statement stmt = null;
            try {
                conn = DBUtil.getConnection();
                conn.setAutoCommit(false);
                stmt = conn.prepareStatement(sqlTemplate);
                for (int i = 0; i < arr.size(); i++) {
                    String sql = sqlTemplate;
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

    private String modelLoad(Map<String, Object> param) throws FormEngineException {
        String result;
        String sql = FreemarkerUtil.getMixedString(modelSelectSql, param);
        List<DiagnosisModel> diagnosisModelList = DBUtil.executeList(DiagnosisModel.class, sql);
        List<DiagnosisModel> grzdResults = new ArrayList<DiagnosisModel>();
        Map<String, Object> results = new HashMap<String, Object>();

        for (int x = 0; x < diagnosisModelList.size(); x++) {
            if (StringUtils.isBlank(diagnosisModelList.get(x).getPid()) || "0".equals(diagnosisModelList.get(x).getPid())) {
                DiagnosisModel diagnosisModel = diagnosisModelList.get(x);
                String id = diagnosisModel.getId();
                List<DiagnosisModel> children = new ArrayList<DiagnosisModel>();
                for (int y = 0; y < diagnosisModelList.size(); y++) {
                    if (id.equals(diagnosisModelList.get(y).getPid())) {
                        children.add(diagnosisModelList.get(y));
                    }
                }
                if (children.size() > 0) {
                    diagnosisModel.setChildren(children);
                }
                grzdResults.add(diagnosisModel);
            }
        }
        results.put("grzdList", grzdResults);


        sql = FreemarkerUtil.getMixedString(diagnosisSelectSqlAll, param);
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            List<Map<String, Object>> diagnosisList = DBUtil.getMultiResults(rs);
            rs.close();
            for (Map<String, Object> diagnosis : diagnosisList) {
                sql = FreemarkerUtil.getMixedString(subDiagnosisSelectSql, diagnosis);
                rs = stmt.executeQuery(sql);
                List<Map<String, Object>> subDiagnosisList = DBUtil.getMultiResults(rs);
                rs.close();
                diagnosis.put("items", subDiagnosisList);
            }
            results.put("bczdList", diagnosisList);
        } catch (SQLException e) {
            LOGGER.error(e.toString(), e);
        } finally {
            DBUtil.close(conn, stmt, rs);
        }


        result = JSONObject.fromObject(results).toString();
        return result;
    }

    private String modelSave(Map<String, Object> param) throws FormEngineException {
        String sql = null;
        JSONArray children = null;
        if (param.get("children") != null) {
            children = JSONArray.fromObject(param.get("children"));
        }
        String guid = CommonUtil.guid();
        param.put("guid", guid);
        sql = FreemarkerUtil.getMixedString(modelSaveSql, param);
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

        if (children != null && children.size() > 0 && !children.isEmpty()) {
            conn = null;
            stmt = null;
            String sqlTemplate = modelSaveSql;
            try {
                conn = DBUtil.getConnection();
                conn.setAutoCommit(false);
                stmt = conn.prepareStatement(sqlTemplate);
                for (int i = 0; i < children.size(); i++) {
                    sql = sqlTemplate;
                    JSONObject jsonObj = (JSONObject) children.get(i);
                    jsonObj.put("diagnosisParent", guid);
                    jsonObj.put("staffCode", param.get("staffCode"));
                    jsonObj.put("guid", CommonUtil.guid());
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

    private String modelDelete(Map<String, Object> param) throws FormEngineException {
        String sql = null;
        JSONArray children = null;
        if (param.get("children") != null) {
            children = JSONArray.fromObject(param.get("children"));
        }

        sql = FreemarkerUtil.getMixedString(modelDeleteSql, param);
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

        if (children != null && children.size() > 0 && !children.isEmpty()) {
            conn = null;
            stmt = null;
            String sqlTemplate = modelDeleteSql;
            try {
                conn = DBUtil.getConnection();
                conn.setAutoCommit(false);
                stmt = conn.prepareStatement(sqlTemplate);
                for (int i = 0; i < children.size(); i++) {
                    sql = sqlTemplate;
                    JSONObject jsonObj = (JSONObject) children.get(i);
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

    private String modelSort(Map<String, Object> param) throws FormEngineException {

        Object records = param.get("records");
        if (records != null) {
            JSONArray arr = JSONArray.fromObject(records);
            String sqlTemplate = modelSortSql;
            Connection conn = null;
            Statement stmt = null;
            try {
                conn = DBUtil.getConnection();
                conn.setAutoCommit(false);
                stmt = conn.prepareStatement(sqlTemplate);
                for (int i = 0; i < arr.size(); i++) {
                    String sql = sqlTemplate;
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


    /**
     * 完成审核
     *
     * @param param
     * @return
     */
    private String audit(Map<String, Object> param) throws FormEngineException {
        String sql = null;
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            param.put("diagnosisType", 10);
            sql = FreemarkerUtil.getMixedString(diagnosisUpdateAllSql, param);
            stmt.executeUpdate(sql);

            if (param.get("syncStatus") != null) {
                sql = FreemarkerUtil.getMixedString(changeSyncStatusSql, param);
                stmt.executeUpdate(sql);
            }
        } catch (SQLException e) {
            LOGGER.error(e.toString(), e);
        } finally {
            DBUtil.close(conn, stmt, null);
        }
        return ResultInfo.getResult();
    }

    /**
     * 同步入院记录并完成审核
     *
     * @param param
     * @return
     */
    private String sync(Map<String, Object> param) throws FormEngineException {
        param.put("diagnosisType", 10);
        String result = null;
        String sqlTemplate = diagnosisSyncSql;
        String sqlTemplateSub = subDiagnosisSyncSql;
        String sql = FreemarkerUtil.getMixedString(diagnosisSelectSql2, param);
        String sqlSub = null;
        Map<String, Object> resultMap = new HashMap<String, Object>();
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            List<Map<String, Object>> cbDiagnosisList = DBUtil.getMultiResults(rs);
            rs.close();
            for (Map<String, Object> diagnosis : cbDiagnosisList) {
                sql = FreemarkerUtil.getMixedString(subDiagnosisSelectSql2, diagnosis);
                rs = stmt.executeQuery(sql);
                List<Map<String, Object>> subDiagnosisList = DBUtil.getMultiResults(rs);
                rs.close();
                diagnosis.put("items", subDiagnosisList);
            }

            List<Map<String, Object>> ryDiagnosisList = DBUtil.getMultiResults(rs);
            rs.close();
            for (Map<String, Object> diagnosis : ryDiagnosisList) {
                sql = FreemarkerUtil.getMixedString(dropSubRYdiagnosisSql, diagnosis);
                stmt.executeUpdate(sql);
            }

            sql = FreemarkerUtil.getMixedString(dropRYdiagnosisSql, param);
            stmt.executeUpdate(sql);


            conn.setAutoCommit(false);
            stmt = conn.prepareStatement(sqlTemplate);
            for (Map<String, Object> diagnosis : cbDiagnosisList) {
                diagnosis.put("guid", CommonUtil.guid());
                diagnosis.put("staffCode", param.get("staffCode"));
                diagnosis.put("LX", "20");

                sql = sqlTemplate;
                sql = FreemarkerUtil.getMixedString(sql, diagnosis);
                stmt.executeUpdate(sql);
            }

            conn.setAutoCommit(false);
            stmt = conn.prepareStatement(sqlTemplateSub);
            for (Map<String, Object> diagnosis : cbDiagnosisList) {
                List<Map<String, Object>> children = (List<Map<String, Object>>) diagnosis.get("items");
                if (children != null && children.size() > 0) {
                    for (Map<String, Object> subDiagnosis : children) {
                        subDiagnosis.put("guid", CommonUtil.guid());
                        subDiagnosis.put("diagnosisParent", diagnosis.get("guid"));
                        subDiagnosis.put("staffCode", param.get("staffCode"));
                        sql = sqlTemplateSub;
                        sql = FreemarkerUtil.getMixedString(sql, subDiagnosis);
                        stmt.executeUpdate(sql);
                    }
                }
            }
            conn.commit();

        } catch (SQLException e) {
            LOGGER.error(e.toString(), e);
        } finally {
            DBUtil.close(conn, stmt, rs);
        }


        param.put("syncStatus", DiagnosisDataHandler.TRUE);
        return audit(param);
    }


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
        } else if ("modelLoad".equals(action)) {
            result = modelLoad(params);
        } else if ("modelSave".equals(action)) {
            result = modelSave(params);
        } else if ("modelDelete".equals(action)) {
            result = modelDelete(params);
        } else if ("modelSort".equals(action)) {
            result = modelSort(params);
        } else if ("sync".equals(action)) {
            result = sync(params);
        } else if ("audit".equals(action)) {
            result = audit(params);
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

    public String getModelSelectSql() {
        return modelSelectSql;
    }

    public void setModelSelectSql(String modelSelectSql) {
        this.modelSelectSql = modelSelectSql;
    }

    public String getModelSaveSql() {
        return modelSaveSql;
    }

    public void setModelSaveSql(String modelSaveSql) {
        this.modelSaveSql = modelSaveSql;
    }

    public String getDiagnosisSelectSqlAll() {
        return diagnosisSelectSqlAll;
    }

    public void setDiagnosisSelectSqlAll(String diagnosisSelectSqlAll) {
        this.diagnosisSelectSqlAll = diagnosisSelectSqlAll;
    }

    public String getModelDeleteSql() {
        return modelDeleteSql;
    }

    public void setModelDeleteSql(String modelDeleteSql) {
        this.modelDeleteSql = modelDeleteSql;
    }

    public String getModelSortSql() {
        return modelSortSql;
    }

    public void setModelSortSql(String modelSortSql) {
        this.modelSortSql = modelSortSql;
    }

    public String getHasDiagnosisSql() {
        return hasDiagnosisSql;
    }

    public void setHasDiagnosisSql(String hasDiagnosisSql) {
        this.hasDiagnosisSql = hasDiagnosisSql;
    }

    public String getDropRYdiagnosisSql() {
        return dropRYdiagnosisSql;
    }

    public void setDropRYdiagnosisSql(String dropRYdiagnosisSql) {
        this.dropRYdiagnosisSql = dropRYdiagnosisSql;
    }

    public String getSyncdiagnosisSql() {
        return syncdiagnosisSql;
    }

    public void setSyncdiagnosisSql(String syncdiagnosisSql) {
        this.syncdiagnosisSql = syncdiagnosisSql;
    }

    public String getDiagnosisSelectSql2() {
        return diagnosisSelectSql2;
    }

    public void setDiagnosisSelectSql2(String diagnosisSelectSql2) {
        this.diagnosisSelectSql2 = diagnosisSelectSql2;
    }

    public String getSubDiagnosisSelectSql2() {
        return subDiagnosisSelectSql2;
    }

    public void setSubDiagnosisSelectSql2(String subDiagnosisSelectSql2) {
        this.subDiagnosisSelectSql2 = subDiagnosisSelectSql2;
    }

    public String getDiagnosisSyncSql() {
        return diagnosisSyncSql;
    }

    public void setDiagnosisSyncSql(String diagnosisSyncSql) {
        this.diagnosisSyncSql = diagnosisSyncSql;
    }

    public String getDropSubRYdiagnosisSql() {
        return dropSubRYdiagnosisSql;
    }

    public void setDropSubRYdiagnosisSql(String dropSubRYdiagnosisSql) {
        this.dropSubRYdiagnosisSql = dropSubRYdiagnosisSql;
    }

    public String getSubDiagnosisSyncSql() {
        return subDiagnosisSyncSql;
    }

    public void setSubDiagnosisSyncSql(String subDiagnosisSyncSql) {
        this.subDiagnosisSyncSql = subDiagnosisSyncSql;
    }


    public String getDiagnosisUpdateAllSql() {
        return diagnosisUpdateAllSql;
    }

    public void setDiagnosisUpdateAllSql(String diagnosisUpdateAllSql) {
        this.diagnosisUpdateAllSql = diagnosisUpdateAllSql;
    }
}
