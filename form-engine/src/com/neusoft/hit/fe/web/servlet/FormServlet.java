package com.neusoft.hit.fe.web.servlet;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.math.NumberUtils;

import com.neusoft.hit.fe.core.api.PluginDataHandler;
import com.neusoft.hit.fe.core.exception.FormEngineException;
import com.neusoft.hit.fe.core.handler.ComboDataHandler;
import com.neusoft.hit.fe.core.handler.FormEditHandler;
import com.neusoft.hit.fe.core.handler.FormExportHandler;
import com.neusoft.hit.fe.core.handler.FormLoadHandler;
import com.neusoft.hit.fe.core.handler.ImgUploadHandler;
import com.neusoft.hit.fe.core.model.ComboParam;
import com.neusoft.hit.fe.core.model.ExportParam;
import com.neusoft.hit.fe.core.model.PluginCfgInfo;
import com.neusoft.hit.fe.core.model.ResultInfo;
import com.neusoft.hit.fe.core.model.StageParam;
import com.neusoft.hit.fe.core.utility.Configuration;

public class FormServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private FormEditHandler formEditHandler;
	private FormExportHandler formExportHandler;
	private FormLoadHandler formLoadHandler;
	private ComboDataHandler comboDataHandler;
	private ImgUploadHandler imgUploadHandler;
	
	public FormServlet() {
		this.formEditHandler = new FormEditHandler();
		this.formExportHandler = new FormExportHandler();
		this.formLoadHandler = new FormLoadHandler();
		this.comboDataHandler = new ComboDataHandler();
		this.imgUploadHandler = new ImgUploadHandler();
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		this.doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("utf-8");
		resp.setContentType("text/json;charset=utf-8");
		String servletPath = req.getServletPath();
		
		Map<String, Object> params = new HashMap<String, Object>();
		Enumeration<String> parameterNames = req.getParameterNames();
		while(parameterNames.hasMoreElements()) {
			String paramName = parameterNames.nextElement();
			params.put(paramName, req.getParameter(paramName));
		}
		
		try {
			if(servletPath.endsWith("/load.process")) {
				String result = formLoadHandler.load(params);
				resp.getWriter().write(result);
			}
			else if(servletPath.endsWith("/save.process")) {
				formEditHandler.save(params);
				resp.getWriter().write(ResultInfo.getResult());
			}
			else if(servletPath.endsWith("/drop.process")) {
				formEditHandler.drop(params);
				resp.getWriter().write(ResultInfo.getResult());
			}
			else if(servletPath.endsWith("/stage.process")) {
				StageParam param = StageParam.create();
				param.setCategory(req.getParameter("category"));
				param.setContent(req.getParameter("content"));
				param.setPatientCode(req.getParameter("patientCode"));
				param.setStaffCode(req.getParameter("staffCode"));
				formEditHandler.stage(param);
				resp.getWriter().write(ResultInfo.getResult());
			}
			else if(servletPath.endsWith("/export.process")) {
				ExportParam param = ExportParam.create();
				param.setType(req.getParameter("type"));
				param.setContent(req.getParameter("content"));
				param.setDirection(req.getParameter("direction"));
				param.setHeader(req.getParameter("header"));
				param.setFooter(req.getParameter("footer"));
				int headerHeight = NumberUtils.toInt(req.getParameter("header-height"), 0);
				param.setHeaderHeight(headerHeight);
				int footerHeight = NumberUtils.toInt(req.getParameter("footer-height"), 0);
				param.setFooterHeight(footerHeight);
				int marginBottom = NumberUtils.toInt(req.getParameter("margin-bottom"), 0);
				param.setMarginBottom(marginBottom);
				int marginLeft = NumberUtils.toInt(req.getParameter("margin-left"), 0);
				param.setMarginLeft(marginLeft);
				int marginRight = NumberUtils.toInt(req.getParameter("margin-right"), 0);
				param.setMarginRight(marginRight);
				int marginTop = NumberUtils.toInt(req.getParameter("margin-top"), 0);
				param.setMarginTop(marginTop);
				resp.setContentType("application/pdf");
				resp.setHeader("Content-Disposition", "filename=form.pdf");
				formExportHandler.export(param, resp.getOutputStream());
			}
			else if(servletPath.endsWith("/fill-combo.process")) {
				ComboParam param = ComboParam.create();
				param.setCategory(req.getParameter("category"));
				param.setFuzzy(req.getParameter("fuzzy"));
				param.setMaster(req.getParameter("master"));
				param.setFilter(req.getParameter("filter"));
				int page = NumberUtils.toInt(req.getParameter("page"), 1);
				param.setPage(page);
				String result = comboDataHandler.load(param);
				resp.getWriter().write(result);
			}
			else if(servletPath.endsWith("/upload.process")) {
				imgUploadHandler.upload(req, resp);
			}
			else if(servletPath.endsWith("/download.process")) {
				imgUploadHandler.download(req, resp);
			}
			else if(servletPath.endsWith("/plugin.process")) {
				String result = ResultInfo.getResult();
				String handlerName = req.getParameter("handler");
				if(handlerName != null && handlerName.trim().length() > 0) {
					Configuration config = Configuration.getInstance();
					PluginCfgInfo pluginCfg = config.getPluginCfg().get(handlerName);
					String handlerClassName = pluginCfg.getHandlerClassName();
					try {
						Class<?> clazz = Class.forName(handlerClassName);
						PluginDataHandler handler = (PluginDataHandler) clazz.newInstance();
						result = handler.handle(params);
					} catch (ClassNotFoundException e) {
						e.printStackTrace();
					} catch (InstantiationException e) {
						e.printStackTrace();
					} catch (IllegalAccessException e) {
						e.printStackTrace();
					}
				}
				resp.getWriter().write(result);
			}
		} catch (FormEngineException e) {
			resp.getWriter().write(ResultInfo.getFailureResult(e.getMessage()));
		}
	}
	
	
}
