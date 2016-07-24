package com.neusoft.hit.fe.core.html;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class HtmlDocument {
	
	private Document document;
	
	private HtmlDocument(Document document) {
		this.document = document;
	}
	
	public static HtmlDocument parse(String html) {
		Document doc = Jsoup.parse(html);
		HtmlDocument htmlDocument = new HtmlDocument(doc);
		return htmlDocument;
	}
	
	public static HtmlDocument parse(InputStream in, String charsetName, String baseUri) {
		HtmlDocument htmlDocument = null;
		try {
			Document doc = Jsoup.parse(in, charsetName, baseUri);
			htmlDocument = new HtmlDocument(doc);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return htmlDocument;
	}
	
	public String html() {
		document.outputSettings().prettyPrint(false);
		return document.html();
	}
	
	public List<HtmlElement> getElementsByClass(String className) {
		List<HtmlElement> htmlElements = new ArrayList<HtmlElement>();
		Elements elements = document.getElementsByClass(className);
		for(Element element : elements) {
			HtmlElement htmlElement = new HtmlElement(element);
			htmlElements.add(htmlElement);
		}
		return htmlElements;
	}
	
	public List<HtmlElement> getElementsByAttribute(String key) {
		List<HtmlElement> htmlElements = new ArrayList<HtmlElement>();
		Elements elements = document.getElementsByAttribute("table");
		for(Element element : elements) {
			HtmlElement htmlElement = new HtmlElement(element);
			htmlElements.add(htmlElement);
		}
		return htmlElements;
	}
	
	public HtmlElement getElementById(String id) {
		HtmlElement htmlElement = null;
		Element element = document.getElementById(id);
		if(element != null) {
			htmlElement = new HtmlElement(element);
		}
		return htmlElement;
	}
	
	public HtmlElement getSingleElementByClass(String className) {
		HtmlElement htmlElement = null;
		List<HtmlElement> htmlElements = getElementsByClass(className);
		if(!htmlElements.isEmpty()) {
			htmlElement = htmlElements.get(0);
		}
		return htmlElement;
	}
	
	public List<HtmlElement> getElementsByTag(String tagName) {
		List<HtmlElement> htmlElements = new ArrayList<HtmlElement>();
		Elements elements = document.getElementsByTag(tagName);
		for(Element element : elements) {
			HtmlElement htmlElement = new HtmlElement(element);
			htmlElements.add(htmlElement);
		}
		return htmlElements;
	}
	
}
