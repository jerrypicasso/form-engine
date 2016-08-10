package com.neusoft.hit.fe.core.api;

import java.util.Map;

import com.neusoft.hit.fe.core.exception.FormEngineException;

public interface PluginDataHandler {
	
	public String handle(Map<String, Object> params) throws FormEngineException;
	
}
