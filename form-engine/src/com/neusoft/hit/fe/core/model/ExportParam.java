package com.neusoft.hit.fe.core.model;

public class ExportParam {
	private String type;
	private String header;
	private String footer;
	private String content;
	private int headerHeight;
	private int footerHeight;
	private int marginTop;
	private int marginRight;
	private int marginBottom;
	private int marginLeft;
	private String direction;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getHeader() {
		return header;
	}

	public void setHeader(String header) {
		this.header = header;
	}

	public String getFooter() {
		return footer;
	}

	public void setFooter(String footer) {
		this.footer = footer;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public int getHeaderHeight() {
		return headerHeight;
	}

	public void setHeaderHeight(int headerHeight) {
		this.headerHeight = headerHeight;
	}

	public int getFooterHeight() {
		return footerHeight;
	}

	public void setFooterHeight(int footerHeight) {
		this.footerHeight = footerHeight;
	}

	public int getMarginTop() {
		return marginTop;
	}

	public void setMarginTop(int marginTop) {
		this.marginTop = marginTop;
	}

	public int getMarginRight() {
		return marginRight;
	}

	public void setMarginRight(int marginRight) {
		this.marginRight = marginRight;
	}

	public int getMarginBottom() {
		return marginBottom;
	}

	public void setMarginBottom(int marginBottom) {
		this.marginBottom = marginBottom;
	}

	public int getMarginLeft() {
		return marginLeft;
	}

	public void setMarginLeft(int marginLeft) {
		this.marginLeft = marginLeft;
	}

	public String getDirection() {
		return direction;
	}

	public void setDirection(String direction) {
		this.direction = direction;
	}
	
	public static ExportParam create() {
		return new ExportParam();
	}
}
