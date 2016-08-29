package com.neusoft.hit.fe.core.handler;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.*;

import com.neusoft.hit.fe.ext.utility.EmrUtil;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.neusoft.hit.fe.core.exception.FormEngineException;
import com.neusoft.hit.fe.core.model.ComboCfgInfo;
import com.neusoft.hit.fe.core.model.ComboInfo;
import com.neusoft.hit.fe.core.model.ComboParam;
import com.neusoft.hit.fe.core.utility.ConfigUtil;
import com.neusoft.hit.fe.core.utility.DBUtil;
import com.neusoft.hit.fe.core.utility.FreemarkerUtil;

import net.sf.json.JSONArray;
import org.apache.poi.util.StringUtil;

public class ComboDataHandler {

    private static final Log LOGGER = LogFactory.getLog(ComboDataHandler.class);
    private Map<String, ComboCfgInfo> dropdowns;

    public ComboDataHandler() {
        this.dropdowns = ConfigUtil.getComboCfgs();
    }

    public String load(ComboParam param) throws FormEngineException {

        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<ComboInfo> combos = new ArrayList<ComboInfo>();
        try {
            ComboCfgInfo dropdown = dropdowns.get(param.getCategory());
            String sql = dropdown.getSqlText();
            String displayExpr = dropdown.getDisplayExpr();
            String valueExpr = dropdown.getValueExpr();

            Map<String, Object> arguments = new HashMap<String, Object>();
            arguments.put("param", param);
            sql = FreemarkerUtil.getMixedString(sql, arguments);
            arguments.clear();

            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            List<Map<String, Object>> list = DBUtil.getMultiResults(rs);
            for (Map<String, Object> map : list) {
                ComboInfo combo = new ComboInfo();
                arguments.put("result", map);
                String display = FreemarkerUtil.getMixedString(displayExpr, arguments);
                String value = FreemarkerUtil.getMixedString(valueExpr, arguments);
                combo.setVal(value);
                combo.setTxt(display);
                combos.add(combo);
            }
        } catch (Exception e) {
            LOGGER.error(e.toString(), e);
        } finally {
            DBUtil.close(conn, stmt, rs);
        }
        return JSONArray.fromObject(combos).toString();
    }

    /**
     * 获得icd码
     *
     * @param param
     * @return
     */
    public String loadIcd(ComboParam param) {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<ComboInfo> combos = new ArrayList<ComboInfo>();
        String sql;
        try {
            ComboCfgInfo dropdown = dropdowns.get("icd");
            String sqlTemp = dropdown.getSqlText();
            String displayExpr = dropdown.getDisplayExpr();
            String valueExpr = dropdown.getValueExpr();

            Map<String, Object> arguments = new HashMap<String, Object>();
            arguments.put("param", param);
            sql = FreemarkerUtil.getMixedString(sqlTemp, arguments);
            arguments.clear();

            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            List<Map<String, Object>> list = DBUtil.getMultiResults(rs);

            for (Map<String, Object> map : list) {
                ComboInfo combo = new ComboInfo();
                arguments.put("result", map);
                String display = FreemarkerUtil.getMixedString(displayExpr, arguments);
                String value = FreemarkerUtil.getMixedString(valueExpr, arguments);
                combo.setVal(value);
                combo.setTxt(display);
                combos.add(combo);
            }

            if (EmrUtil.isChinese(param.getFuzzy())) {
                filterByIcd(combos);
                Map<String,List<ComboInfo>> temp = new HashMap<String, List<ComboInfo>>();
                rs.close();
                arguments.clear();
                list.clear();
                dropdown = dropdowns.get("icd2");
                sqlTemp = dropdown.getSqlText();
                displayExpr = dropdown.getDisplayExpr();
                valueExpr = dropdown.getValueExpr();
                for (int x = 0; x < combos.size(); x++) {
                    param.setFuzzy(combos.get(x).getVal().substring(0,combos.get(x).getVal().indexOf(".")+2));
                    if(StringUtils.isNotBlank(param.getFuzzy())){
                        List<ComboInfo> tempList =  new ArrayList<ComboInfo>();
                        arguments.put("param", param);
                        sql = FreemarkerUtil.getMixedString(sqlTemp, arguments);
                        arguments.clear();
                        rs = stmt.executeQuery(sql);
                        list = DBUtil.getMultiResults(rs);
                        for (int y = 0; y < list.size(); y++) {
                            ComboInfo combo = new ComboInfo();
                            arguments.put("result", list.get(y));
                            String display = FreemarkerUtil.getMixedString(displayExpr, arguments);
                            String value = FreemarkerUtil.getMixedString(valueExpr, arguments);
                            combo.setVal(value);
                            combo.setTxt(display);
                            if(!combos.get(x).getVal().equals(combo.getVal())){
                                tempList.add(combo);
                            }

                        }
                        temp.put(combos.get(x).getVal(),tempList);
                    }
                }
                for(String key:temp.keySet()){
                    for(int i=0;i<combos.size();i++){
                        if(combos.get(i).getVal().equals(key)){
                            for(int j = temp.get(key).size()-1;j>=0;j--){
                                combos.add(i+1,temp.get(key).get(j));
                            }
                        }
                    }
                }


            }

        } catch (Exception e) {
            LOGGER.error(e.toString(), e);
        } finally {
            DBUtil.close(conn, stmt, rs);
        }
        return JSONArray.fromObject(combos).toString();
    }

    private void filterByIcd(List<ComboInfo> combos) {
        String icdTemp = null;

        for (int i = 0; i < combos.size(); i++) {
            icdTemp = combos.get(i).getVal().substring(0,combos.get(i).getVal().indexOf(".")+2);
            if(StringUtils.isNotBlank(icdTemp)){
                for (int j = combos.size() - 1; j > i; j--) {
                    String icdTitle =combos.get(j).getVal().substring(0,combos.get(j).getVal().indexOf(".")+2);
                    if(StringUtils.isNotBlank(icdTitle)){
                        if (icdTemp.equals(icdTitle)) {
                            combos.remove(j);
                        }
                    }
                }
            }

        }
    }
}
