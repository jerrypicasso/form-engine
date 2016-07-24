package com.neusoft.hit.fe.core.model;

public class ComboCfgInfo {
	private String id;
	private String code;
	private String name;
	private String sqlText;
	private String displayExpr;
	private String valueExpr;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSqlText() {
		return sqlText;
	}

	public void setSqlText(String sqlText) {
		this.sqlText = sqlText;
	}

	public String getDisplayExpr() {
		return displayExpr;
	}

	public void setDisplayExpr(String displayExpr) {
		this.displayExpr = displayExpr;
	}

	public String getValueExpr() {
		return valueExpr;
	}

	public void setValueExpr(String valueExpr) {
		this.valueExpr = valueExpr;
	}
}
