package com.neusoft.hit.fe.core.handler;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.tidy.Tidy;
import org.xhtmlrenderer.pdf.ITextFontResolver;
import org.xhtmlrenderer.pdf.ITextRenderer;

import com.itextpdf.text.pdf.BaseFont;
import com.neusoft.hit.fe.core.exception.FormEngineException;
import com.neusoft.hit.fe.core.model.ExportParam;

public class FormExportHandler {
	
	private static final Log LOGGER = LogFactory.getLog(FormExportHandler.class);
	
	public void export(ExportParam param, OutputStream out) throws FormEngineException {
		String type = param.getType();
		if("doc".equalsIgnoreCase(type)) {
			exportDoc(param, out);
		}
		else if("xls".equalsIgnoreCase(type)) {
			exportXls(param, out);
		}
		else {
			exportPdf(param, out);
		}
	}
	
	private void exportPdf(ExportParam param, OutputStream out) throws FormEngineException {
		String header = param.getHeader();
		String footer = param.getFooter();
		String content = param.getContent();
		int headerHeight = param.getHeaderHeight();
		int footerHeight = param.getFooterHeight();
		int marginTop = param.getMarginTop();
		int marginRight = param.getMarginRight();
		int marginBottom = param.getMarginBottom();
		int marginLeft = param.getMarginLeft();
		String direction = param.getDirection();
		
		StringBuilder html = new StringBuilder();
		html.append("<!DOCTYPE html>");
		html.append("<html>");
		html.append("<head>");
		html.append("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>");
		html.append("<style>");
		html.append(".widget-page-number:before {content:counter(page);}");
		html.append(".widget-page-count:before {content:counter(pages);}");
		html.append("@media print {");
		html.append("body {margin:0;padding:0;width:100%;line-height:24px;}");
		html.append("span,div {word-wrap:break-word;}");
		html.append(".header {position:running(header) !important;padding-top:")
			.append(marginTop).append("px}");
		html.append(".footer {position:running(footer) !important;padding-bottom:")
			.append(marginBottom).append("px}");
		html.append(".content {position:static !important;}");
		html.append(".widget-table td,th{padding:0;border:1px solid transparent;}");
		html.append("}");
		html.append("@page {");
		html.append("size:A4 ").append(direction).append(";");
		html.append("margin:").append(marginTop + headerHeight).append("px ")
							  .append(marginRight).append("px ")
							  .append(marginBottom + footerHeight).append("px ")
							  .append(marginLeft).append("px;");
		html.append("padding:0;");
		html.append("@top-center {content:element(header);}");
		html.append("@bottom-center {content:element(footer);}");
		html.append("}");
		html.append("</style>");
		html.append("</head>");
		html.append("<body style=\"font-family:SimSun;\">");
		html.append(header);
		html.append(footer);
		html.append(content);
		html.append("</body>");
		html.append("</html>");
		
		ByteArrayOutputStream buffer = new ByteArrayOutputStream();
		Tidy tidy = new Tidy();
		tidy.setShowWarnings(false);
		tidy.setXHTML(true);
		tidy.setInputEncoding("utf-8");
		tidy.setDropEmptyParas(false);
		tidy.setTrimEmptyElements(false);
		try {
			tidy.parse(new ByteArrayInputStream(html.toString().getBytes("utf-8")), buffer);
			String htmlStr = buffer.toString("utf-8");
			htmlStr = htmlStr.replaceAll("\\-ms\\-word\\-wrap", "word-wrap");
        	ITextRenderer renderer = new ITextRenderer();  
        	renderer.setDocumentFromString(htmlStr);
        	
			// 解决中文支持问题  
			ITextFontResolver fontResolver = renderer.getFontResolver();  
			//fontResolver.addFont("C:/Windows/Fonts/SIMKAI.TTF", BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);  
			fontResolver.addFont("/usr/share/fonts/win/simsun.ttc",BaseFont.IDENTITY_H,BaseFont.NOT_EMBEDDED);
			fontResolver.addFont("/usr/share/fonts/win/simsunbd.ttf",BaseFont.IDENTITY_H,BaseFont.NOT_EMBEDDED);
			//fontResolver.addFont("c:/windows/fonts/SimSun-Bold.ttf",BaseFont.IDENTITY_H,BaseFont.NOT_EMBEDDED);
  
			// 解决图片的相对路径问题  
			//renderer.getSharedContext().setBaseURL("file:/D:/Work/Demo2do/Yoda/branch/Yoda%20-%20All/conf/template/");  
			  
			renderer.layout();  
			renderer.createPDF(out);  
			
			out.flush();
			out.close();
		} catch (Exception e) {
			LOGGER.error(e.toString(), e);
			throw new FormEngineException("导出pdf文件时发生错误，操作失败 ！", e);
		}
	}
	
	private void exportDoc(ExportParam param, OutputStream out) throws FormEngineException {
		//TODO
	}
	
	private void exportXls(ExportParam param, OutputStream out) throws FormEngineException {
		//TODO
	}
	
}
