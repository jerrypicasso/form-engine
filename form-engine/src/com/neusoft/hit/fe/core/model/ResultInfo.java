package com.neusoft.hit.fe.core.model;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ResultInfo {

	public static String getResult() {
		return getResult(null);
	}
	
	public static String getResult(Object obj) {
		Object temp = obj;
		if(temp == null) {
			temp = new Object();
		} 
		if(temp instanceof Collection || temp.getClass().isArray()) {
			return JSONArray.fromObject(temp).toString();
		}
		else {
			return JSONObject.fromObject(temp).toString();
		}
	}
	
	public static String getSuccessResult(Object obj) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("success", true);
		map.put("message", obj);
		return getResult(map);
	}
	
	public static String getFailureResult(Object obj) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("success", false);
		map.put("message", obj);
		return getResult(map);
	}
}
