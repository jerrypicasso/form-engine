package com.neusoft.hit.fe.core.model;

public class SqlTplInfo {
	private String name;
	private String resultType;
	private Integer resultLimit;
	private String sql;

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

}
