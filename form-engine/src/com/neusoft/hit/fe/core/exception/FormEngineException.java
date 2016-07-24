package com.neusoft.hit.fe.core.exception;

public class FormEngineException extends Exception {

	private static final long serialVersionUID = 1L;

	public FormEngineException(String msg) {
		super(msg);
	}
	
	public FormEngineException(String msg, Throwable throwable) {
		super(msg, throwable);
	}
}
