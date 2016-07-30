package com.neusoft.hit.fe.core.model;

import java.util.ArrayList;
import java.util.List;

public class SqlTplInfo {
	private String name;
	private String resultType;
	private Integer resultLimit;
	private String sql;
	private List<SqlTplInfo> children;
	private String varName;

	public SqlTplInfo() {
		this.children = new ArrayList<SqlTplInfo>();
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSql() {
		return sql;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}

	public String getResultType() {
		return resultType;
	}

	public void setResultType(String resultType) {
		this.resultType = resultType;
	}

	public Integer getResultLimit() {
		return resultLimit;
	}

	public void setResultLimit(Integer resultLimit) {
		this.resultLimit = resultLimit;
	}

	public List<SqlTplInfo> getChildren() {
		return children;
	}

	public void setChildren(List<SqlTplInfo> children) {
		this.children = children;
	}

	public String getVarName() {
		return varName;
	}

	public void setVarName(String varName) {
		this.varName = varName;
	}

}
