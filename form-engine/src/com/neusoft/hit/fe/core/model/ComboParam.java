package com.neusoft.hit.fe.core.model;

public class ComboParam {
	
	private String category;
	private String filter;
	private String master;
	private String fuzzy;
	private int page;
	
	public String getFilter() {
		return filter;
	}

	public void setFilter(String filter) {
		this.filter = filter;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getMaster() {
		return master;
	}

	public void setMaster(String master) {
		this.master = master;
	}

	public String getFuzzy() {
		return fuzzy;
	}

	public void setFuzzy(String fuzzy) {
		this.fuzzy = fuzzy;
	}

	public static ComboParam create() {
		return new ComboParam();
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}
	
}
