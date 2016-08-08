package com.neusoft.hit.fe.core.model;

public class StageParam {
	private String key;
	private String content;

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	
	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public static StageParam create() {
		return new StageParam();
	}
}
