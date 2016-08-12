package com.neusoft.hit.fe.core.utility;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.neusoft.hit.fe.core.exception.FormEngineException;

import freemarker.cache.StringTemplateLoader;
import freemarker.ext.beans.BeansWrapper;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateHashModel;
import freemarker.template.TemplateModelException;

public class FreemarkerUtil {
	
	private static final Log LOGGER = LogFactory.getLog(FreemarkerUtil.class);
	private static Configuration configuration;
	private static TemplateHashModel statics;
	
	static {
		configuration = new Configuration(Configuration.VERSION_2_3_25);
		configuration.setNumberFormat("#");
		StringTemplateLoader stringLoader = new StringTemplateLoader();
		configuration.setTemplateLoader(stringLoader);
		
		BeansWrapper wrapper =  new BeansWrapper(Configuration.VERSION_2_3_25);
		TemplateHashModel staticModels = wrapper.getStaticModels();
		try {
			statics = (TemplateHashModel) staticModels.get("com.neusoft.hit.fe.core.utility.CommonUtil");
		} catch (TemplateModelException e) {
			LOGGER.error(e.toString(), e);
		}
	}
	
	/**
	 * 获取freemaker混淆后的内容
	 * @param template
	 * @param rootMap
	 * @return
	 */
	public static String getMixedString(String template, Map<String, Object> rootMap) throws FormEngineException {
		String mixed = null;
		ByteArrayOutputStream os = null;
		Writer out = null;
		try {
			String key = CommonUtil.guid();
			StringTemplateLoader stringLoader = (StringTemplateLoader) configuration.getTemplateLoader();
			stringLoader.putTemplate(key, template);
			Template sqlTemplate = configuration.getTemplate(key);
			os = new ByteArrayOutputStream();
			out = new OutputStreamWriter(os, "UTF-8");
			rootMap.put("CommonUtil", statics);
			sqlTemplate.process(rootMap, out);
			mixed = new String(os.toByteArray(), "UTF-8");
		} catch (Exception e) {
			LOGGER.error(e.toString(), e);
			throw new FormEngineException("Error occurs during getting freemarker mixed string !", e);
		} finally {
			try {
				if(out != null) {
					out.close();
				}
				if(os != null) {
					os.close();
				}
			} catch (IOException e) {
				LOGGER.error(e.toString(), e);
			}
		}
		return mixed;
	}
}
