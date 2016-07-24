package com.neusoft.hit.fe.core.utility;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.UUID;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.neusoft.hit.fe.core.exception.FormEngineException;

import freemarker.cache.StringTemplateLoader;
import freemarker.template.Configuration;
import freemarker.template.Template;

public class FreemarkerUtil {
	
	private static final Log LOGGER = LogFactory.getLog(FreemarkerUtil.class);
	private static Configuration configuration;
	
	static {
		configuration = new Configuration();
		configuration.setNumberFormat("#");
		StringTemplateLoader stringLoader = new StringTemplateLoader();
		configuration.setTemplateLoader(stringLoader);
	}
	
	/**
	 * 获取freemaker混淆后的内容
	 * @param template
	 * @param rootMap
	 * @return
	 */
	public static String getMixedString(String template, Object rootMap) throws FormEngineException {
		String mixed = null;
		ByteArrayOutputStream os = null;
		Writer out = null;
		try {
			String key = UUID.randomUUID().toString();
			StringTemplateLoader stringLoader = (StringTemplateLoader) configuration.getTemplateLoader();
			stringLoader.putTemplate(key, template);
			Template sqlTemplate = configuration.getTemplate(key);
			os = new ByteArrayOutputStream();
			out = new OutputStreamWriter(os, "UTF-8");
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
