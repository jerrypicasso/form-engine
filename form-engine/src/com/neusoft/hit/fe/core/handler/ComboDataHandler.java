package com.neusoft.hit.fe.core.handler;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.neusoft.hit.fe.core.exception.FormEngineException;
import com.neusoft.hit.fe.core.model.ComboCfgInfo;
import com.neusoft.hit.fe.core.model.ComboInfo;
import com.neusoft.hit.fe.core.model.ComboParam;
import com.neusoft.hit.fe.core.utility.Configuration;
import com.neusoft.hit.fe.core.utility.DBUtil;
import com.neusoft.hit.fe.core.utility.FreemarkerUtil;

import net.sf.json.JSONArray;

public class ComboDataHandler {
	
	private static final Log LOGGER = LogFactory.getLog(ComboDataHandler.class);
	private Map<String, ComboCfgInfo> dropdowns;
	
	public ComboDataHandler() {
		Configuration configuration = Configuration.getInstance();
		this.dropdowns = configuration.getComboCfgs();
	}
	
	public String load(ComboParam param) throws FormEngineException {
		ComboCfgInfo dropdown = dropdowns.get(param.getCategory());
		String sql = dropdown.getSqlText();
		String displayExpr = dropdown.getDisplayExpr();
		String valueExpr = dropdown.getValueExpr();
		
		List<ComboInfo> combos = new ArrayList<ComboInfo>();
		Connection conn = null;
		Statement stmt = null;
		ResultSet rs = null;
		Map<String, Object> arguments = new HashMap<String, Object>();
		arguments.put("param", param);
		sql = FreemarkerUtil.getMixedString(sql, arguments);
		arguments.clear();
		try {
			conn = DBUtil.getConnection();
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
			List<Map<String, Object>> list = DBUtil.getMultiResults(rs);
			for(Map<String, Object> map : list) {
				ComboInfo combo = new ComboInfo();
				arguments.put("result", map);
				String display = FreemarkerUtil.getMixedString(displayExpr, arguments);
				String value = FreemarkerUtil.getMixedString(valueExpr, arguments);
				combo.setVal(value);
				combo.setTxt(display);
				combos.add(combo);
			}
		} catch (SQLException e) {
			LOGGER.error(e.toString(), e);
		} finally {
			DBUtil.close(conn, stmt, rs);
		}
		return JSONArray.fromObject(combos).toString();
	}
}
