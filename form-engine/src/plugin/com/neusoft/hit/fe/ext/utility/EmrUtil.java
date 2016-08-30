package com.neusoft.hit.fe.ext.utility;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

import net.sf.json.JSON;
import net.sf.json.JSONObject;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.neusoft.hit.fe.core.utility.DBUtil;
import com.neusoft.hit.fe.core.utility.EngineUtil;

public class EmrUtil {

    private static final Log LOGGER = LogFactory.getLog(EmrUtil.class);

    public static String staffs(String codes) {
        String text = "";
        if (codes != null && codes.trim().length() > 0) {
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
        if (code != null && code.trim().length() > 0) {
            StringBuilder sql = new StringBuilder();
            sql.append("SELECT XM FROM YGJBXX WHERE YGBH = ").append(code);
            Connection conn = null;
            Statement stmt = null;
            ResultSet rs = null;
            try {
                conn = DBUtil.getConnection();
                stmt = conn.createStatement();
                rs = stmt.executeQuery(sql.toString());
                if (rs.next()) {
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
        if (category != null && category.trim().length() > 0
                && code != null && code.trim().length() > 0) {
            StringBuilder sql = new StringBuilder();
            sql.append("SELECT SHORT_NAME FROM C_PROJECT_DETAILS ");
            sql.append("WHERE PROJECT_DETAIL_CODE = '").append(code).append("' AND ");
            sql.append("PROJECT_ID = (SELECT PROJECT_ID FROM C_PROJECT WHERE PROJECT_CODE = '");
            sql.append(category).append("')");
            Connection conn = null;
            Statement stmt = null;
            ResultSet rs = null;
            try {
                conn = DBUtil.getConnection();
                stmt = conn.createStatement();
                rs = stmt.executeQuery(sql.toString());
                if (rs.next()) {
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

    /**
     * 读取诊断表中的类型，然后返回内容
     *
     * @return
     */
    public static String diagnosis(String brId, String diagnosisType) {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        String result = null;
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ID,LR AS NR FROM ZDINFO");
        sql.append(" WHERE BRID = ").append(brId).append(" AND LX =").append(diagnosisType).append(" ORDER BY DIAGNOSTIC_ORDER1,MODIFY_TIME desc");
        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql.toString());
            List<Map<String, Object>> diagnosisList = DBUtil.getMultiResults(rs);
            rs.close();
            for (Map<String, Object> diagnosis : diagnosisList) {
                sql.delete(0, sql.length());
                sql.append("SELECT ZD_NR AS NR FROM SUB_ZD_INFO WHERE ZD_ID = '").append(diagnosis.get("ID")).append("' ORDER BY DIAGNOSTIC_ORDER1,MODIFY_TIME desc");
                rs = stmt.executeQuery(sql.toString());
                List<Map<String, Object>> subDiagnosisList = DBUtil.getMultiResults(rs);
                rs.close();
                diagnosis.put("items", subDiagnosisList);
            }
            result = combineDiagnosis(diagnosisList);
        } catch (Exception e) {
            LOGGER.error(e.toString(), e);
        } finally {
            DBUtil.close(conn, stmt, rs);
        }
        return result;
    }

    /**
     * 组合诊断为String
     *
     * @param diagnosisList
     * @return
     */
    @SuppressWarnings("unchecked")
    private static String combineDiagnosis(List<Map<String, Object>> diagnosisList) {

        StringBuilder sb = new StringBuilder();
        for (int x = 0; x < diagnosisList.size(); x++) {
            if (diagnosisList.size() > 1) {
                sb.append(x + 1).append(".");
            }
            sb.append(diagnosisList.get(x).get("NR"));
            List<Map<String, Object>> subDiagnosisList = (List<Map<String, Object>>) diagnosisList.get(x).get("items");
            if (subDiagnosisList != null && subDiagnosisList.size() > 0) {
                for (int y = 0; y < subDiagnosisList.size(); y++) {
                    if (subDiagnosisList.size() > 1) {
                        sb.append("(").append(y + 1).append(")").append(".");
                    }
                    sb.append(subDiagnosisList.get(y).get("NR"));
                }
            }
        }

        return sb.toString();
    }


    /**
     * 读取诊断表中的类型，手术专用类
     *
     * @return
     */
    public static String diagnosis(String brId, String diagnosisType, String treeId) {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        String result = null;
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ID,LR AS NR FROM ZDINFO");
        sql.append("WHERE BRID = ").append(brId).append(" AND LX =").append(diagnosisType).
                append(" AND SSTREEID ='").append(treeId).append("' ORDER BY DIAGNOSTIC_ORDER1,MODIFY_TIME desc");
        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql.toString());
            List<Map<String, Object>> diagnosisList = DBUtil.getMultiResults(rs);
            rs.close();
            for (Map<String, Object> diagnosis : diagnosisList) {
                sql.delete(0, sql.length());
                sql.append("SELECT ZD_NR AS NR FROM SUB_ZD_INFO WHERE ZD_ID = '").append(diagnosis.get("ID")).append("' ORDER BY DIAGNOSTIC_ORDER1,MODIFY_TIME desc");
                rs = stmt.executeQuery(sql.toString());
                List<Map<String, Object>> subDiagnosisList = DBUtil.getMultiResults(rs);
                rs.close();
                diagnosis.put("items", subDiagnosisList);
            }
            result = combineDiagnosis(diagnosisList);
        } catch (Exception e) {
            LOGGER.error(e.toString(), e);
        } finally {
            DBUtil.close(conn, stmt, rs);
        }
        return result;

    }

    /**
     * 功能code获得表名
     *
     * @param code
     * @return
     */
    public static String formInfo(String code) {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        String result = null;
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT TITLE AS \"title\" FROM FORM_TEMPLATE_STORAGE WHERE CODE='").append(code).append("' AND ROWNUM<=1");

        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql.toString());
            Map<String, Object> singleResult = DBUtil.getSingleResult(rs);
            rs.close();

            result = JSONObject.fromObject(singleResult).toString();
        } catch (Exception e) {
            LOGGER.error(e.toString(), e);
        } finally {
            DBUtil.close(conn, stmt, rs);
        }
        return result;
    }


    /**
     * 只能判断部分CJK字符（CJK统一汉字）
     * @param c
     * @return
     */
    public static boolean isChineseByREG(char c) {
        return c >= 0x4E00 &&  c <= 0x9FA5;// 根据字节码判断
	}

    /**
     * 判断字符是否为中文
     * @param c
     * @return
     */
    public static boolean isChinese(char c) {
        Character.UnicodeBlock ub = Character.UnicodeBlock.of(c);
        if (ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS || ub == Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS
                || ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A || ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_B
                || ub == Character.UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION || ub == Character.UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS
                || ub == Character.UnicodeBlock.GENERAL_PUNCTUATION) {
            return true;
        }
        return false;
    }

    /**
     * 判断字符创是含有中文
     *
     * @param str
     * @return
     */
    public static boolean isChinese(String str) {
        if (str == null) return false;
        for (char c : str.toCharArray()) {
            if (isChinese(c)) return true;// 有一个中文字符就返回
        }
        return false;
    }


    /**
     * 判断字符串长度
     * @param s
     * @return
     */
    public static int stringLength(String s) {
        if (s == null)
            return 0;
        char[] c = s.toCharArray();
        int len = 0;
        for (int i = 0; i < c.length; i++) {
            len++;
            if (isChinese(c[i])) {
                len++;
            }
        }
        return len;
    }

}
