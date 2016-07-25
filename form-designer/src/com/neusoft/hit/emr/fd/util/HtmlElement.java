package com.neusoft.hit.emr.fd.util;

import org.jsoup.nodes.Element;

public class HtmlElement {

	private Element element;
	
	public HtmlElement(Element element) {
		this.element = element;
	}
	
	public HtmlElement appendElement(String tagName) {
		Element e = element.appendElement(tagName);
		return new HtmlElement(e);
	}
	
	public String attr(String attributeKey) {
		return element.attr(attributeKey);
	}
	
	public void attr(String attributeKey, String attributeValue) {
		element.attr(attributeKey, attributeValue);
	}
	
	public void removeAttr(String attributeKey) {
		element.removeAttr(attributeKey);
	}
	
	public HtmlElement getElementById(String id) {
		HtmlElement htmlElement = null;
		Element e = element.getElementById(id);
		if(e != null) {
			htmlElement = new HtmlElement(e);
		}
		return htmlElement;
	}
	
	public void addClass(String className) {
		element.addClass(className);
	}
	
	public void html(String html) {
		element.html(html);
	}
	
	public void style(String style) {
		element.attr("style", style);
	}

	public void appendStyle(String key, String value) {
		String styleStr = key + ":" + value + ";";
		String styleAttr = element.attr("style");
		styleAttr = styleAttr == null ? "" : styleAttr;
		if(!styleAttr.endsWith(";")) {
			styleAttr = styleAttr + ";";
		}
		styleAttr = styleAttr + styleStr;
		element.attr("style", styleAttr);
	}
	
	public String innerHtml() {
		return element.html();
	}
	
	public String outerHtml() {
		return element.outerHtml();
	}
}
