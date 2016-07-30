package com.neusoft.hit.fe.core.html;

import java.util.ArrayList;
import java.util.List;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

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
	
	public HtmlElement getElementById(String id) {
		HtmlElement htmlElement = null;
		Element e = element.getElementById(id);
		if(e != null) {
			htmlElement = new HtmlElement(e);
		}
		return htmlElement;
	}
	
	public List<HtmlElement> getElementsByClass(String className) {
		List<HtmlElement> htmlElements = new ArrayList<HtmlElement>();
		Elements elements = element.getElementsByClass(className);
		for(Element element : elements) {
			HtmlElement htmlElement = new HtmlElement(element);
			htmlElements.add(htmlElement);
		}
		return htmlElements;
	}
	
	public HtmlElement getSingleElementByClass(String className) {
		HtmlElement htmlElement = null;
		List<HtmlElement> htmlElements = getElementsByClass(className);
		if(!htmlElements.isEmpty()) {
			htmlElement = htmlElements.get(0);
		}
		return htmlElement;
	}
	
	public HtmlElement getFirstParentElementByTag(String tagName) {
		Elements parents = element.parents();
		for(Element element : parents) {
			if(element.tagName().equalsIgnoreCase(tagName)) {
				return new HtmlElement(element);
			}
		}
		return null;
	}
	
	public void removeAttr(String attributeKey) {
		element.removeAttr(attributeKey);
	}
	
	public void addClass(String className) {
		element.addClass(className);
	}
	
	public void removeClass(String className) {
		element.removeClass(className);
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
		element.ownerDocument().outputSettings().prettyPrint(false);
		return element.html();
	}
	
	public String outerHtml() {
		element.ownerDocument().outputSettings().prettyPrint(false);
		return element.outerHtml();
	}
	
	public HtmlElement parent() {
		return new HtmlElement(element.parent());
	}
	
	public List<HtmlElement> children(String className) {
		List<HtmlElement> elements = new ArrayList<HtmlElement>();
		Elements children = element.children();
		for(Element element : children) {
			if(element.hasClass(className)) {
				elements.add(new HtmlElement(element));
			}
		}
		return elements;
	}
}
