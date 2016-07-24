package com.neusoft.hit.fe.core.model;

public class DeleteParam {
	private String tableName;
	private String primaryKeyName;
	private String primaryKeyValue;
	private String dropFlagName;
	private String dropFlagValue;

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

	public String getDropFlagName() {
		return dropFlagName;
	}

	public void setDropFlagName(String dropFlagName) {
		this.dropFlagName = dropFlagName;
	}

	public String getDropFlagValue() {
		return dropFlagValue;
	}

	public void setDropFlagValue(String dropFlagValue) {
		this.dropFlagValue = dropFlagValue;
	}
	
	public static DeleteParam create() {
		return new DeleteParam();
	}
}
