package com.neusoft.hit.fe.ext.diagnosis;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    private String diagnosisSelectSql;
    private String diagnosisInsertSql;
    private String subDiagnosisSelectSql;
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
            for (Map<String, Object> diagnosis : diagnosisList) {
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
        Object children1 = param.get("children");
        JSONArray children =null;
        if(children1!=null){
            children = JSONArray.fromObject(param.get("children"));
        }
        String guid = null;
        if (diagnosisParent != null && !"".equals(diagnosisParent)) {
            param.put("guid",CommonUtil.guid());
            sql = FreemarkerUtil.getMixedString(subDiagnosisInsertSql, param);
        } else {
            guid = CommonUtil.guid();
            param.put("guid",guid );
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

        /*应用于诊断模板存储子数据*/
        if(children!=null&&children.size()>0&&!children.isEmpty()){
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
                    jsonObj.put("diagnosisParent",guid);
                    jsonObj.put("staffCode",param.get("staffCode"));
                    jsonObj.put("guid",CommonUtil.guid());
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
        Map<String,Object> results = new HashMap<String, Object>();

        for(int x = 0 ;x<diagnosisModelList.size();x++){
            if(StringUtils.isBlank(diagnosisModelList.get(x).getPid())||"0".equals(diagnosisModelList.get(x).getPid())){
                DiagnosisModel diagnosisModel = diagnosisModelList.get(x);
                String id = diagnosisModel.getId();
                List<DiagnosisModel> children = new ArrayList<DiagnosisModel>();
                for (int y = 0 ;y<diagnosisModelList.size();y++) {
                    if (id.equals(diagnosisModelList.get(y).getPid())) {
                        children.add(diagnosisModelList.get(y));
                    }
                }
                if(children.size()>0){
                    diagnosisModel.setChildren(children);
                }
                grzdResults.add(diagnosisModel);
            }
        }
        results.put("grzdList",grzdResults);


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
            results.put("bczdList",diagnosisList);
        } catch (SQLException e) {
            LOGGER.error(e.toString(), e);
        } finally {
            DBUtil.close(conn, stmt, rs);
        }




        result = JSONObject.fromObject(results).toString();
        return result;
    }

    private String modelSave(Map<String, Object> param)throws FormEngineException {
        String sql = null;
        JSONArray children =null;
        if(param.get("children")!=null){
            children = JSONArray.fromObject(param.get("children"));
        }
        String guid = CommonUtil.guid();
        param.put("guid",guid);
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

        if(children!=null&&children.size()>0&&!children.isEmpty()){
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
                    jsonObj.put("diagnosisParent",guid);
                    jsonObj.put("staffCode",param.get("staffCode"));
                    jsonObj.put("guid",CommonUtil.guid());
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

    private String modelDelete(Map<String, Object> param)throws FormEngineException {
        String sql = null;
        JSONArray children =null;
        if(param.get("children")!=null){
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

        if(children!=null&&children.size()>0&&!children.isEmpty()){
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

    private String modelSort(Map<String, Object> param)throws FormEngineException {

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
        } else if("modelLoad".equals(action)){
            result = modelLoad(params);
        } else if("modelSave".equals(action)){
            result = modelSave(params);
        } else if("modelDelete".equals(action)){
            result = modelDelete(params);
        } else if("modelSort".equals(action)){
            result = modelSort(params);
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
}
