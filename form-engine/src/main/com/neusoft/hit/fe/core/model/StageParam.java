package com.neusoft.hit.fe.core.model;

public class StageParam {
	private String content;
	private String staffCode;
	private String patientCode;
	private String category;

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getStaffCode() {
		return staffCode;
	}

	public void setStaffCode(String staffCode) {
		this.staffCode = staffCode;
	}

	public String getPatientCode() {
		return patientCode;
	}

	public void setPatientCode(String patientCode) {
		this.patientCode = patientCode;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}
	
	public static StageParam create() {
		return new StageParam();
	}
}
