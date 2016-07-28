package com.neusoft.hit.fe.core.model;

import java.util.HashMap;
import java.util.Map;

public class PluginCfgInfo {
	private String pluginName;
	private String handlerClassName;
	private Map<String, String> propertiesMap;

	public PluginCfgInfo() {
		this.propertiesMap = new HashMap<String, String>();
	}
	
	public String getPluginName() {
		return pluginName;
	}

	public void setPluginName(String pluginName) {
		this.pluginName = pluginName;
	}

	public String getHandlerClassName() {
		return handlerClassName;
	}

	public void setHandlerClassName(String handlerClassName) {
		this.handlerClassName = handlerClassName;
	}

	public Map<String, String> getPropertiesMap() {
		return propertiesMap;
	}

	public void setPropertiesMap(Map<String, String> propertiesMap) {
		this.propertiesMap = propertiesMap;
	}
}
