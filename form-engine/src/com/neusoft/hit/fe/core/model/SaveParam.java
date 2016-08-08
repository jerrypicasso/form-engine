package com.neusoft.hit.fe.core.model;

import java.util.HashMap;
import java.util.Map;

public class SaveParam {
	private String tableName;
	private String primaryKeyName;
	private String primaryKeyValue;
	private Map<String, Object> columns = new HashMap<String, Object>();
	
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public String getPrimaryKeyName() {
		return primaryKeyName;
	}
	public void setPrimaryKeyName(String primaryKeyName) {
		this.primaryKeyName = primaryKeyName;
	}
	public String getPrimaryKeyValue() {
		return primaryKeyValue;
	}
	public void setPrimaryKeyValue(String primaryKeyValue) {
		this.primaryKeyValue = primaryKeyValue;
	}
	public Map<String, Object> getColumns() {
		return columns;
	}
	public void setColumns(Map<String, Object> columns) {
		this.columns = columns;
	}
}
