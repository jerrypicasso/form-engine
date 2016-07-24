package com.neusoft.hit.fe.core.utility;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.math.NumberUtils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;

import com.neusoft.hit.fe.core.model.ComboCfgInfo;
import com.neusoft.hit.fe.core.model.JdbcCfgInfo;
import com.neusoft.hit.fe.core.model.PluginCfgInfo;
import com.neusoft.hit.fe.core.model.UploadCfgInfo;

public class Configuration {
	
	private static final Configuration CONFIG = new Configuration();
	//private Properties properties;
	private Document document;
	
	
	private Configuration() {
		/*this.properties = new Properties();
		InputStream is = Configuration.class.getResourceAsStream("/engine.properties");
		try {
			properties.load(is);
		} catch (IOException e) {
			e.printStackTrace();
		}*/
		try {
			InputStream in = Configuration.class.getResourceAsStream("/engine.xml");
			SAXReader reader = new SAXReader();
			document = reader.read(in);
		} catch (DocumentException e) {
			e.printStackTrace();
		}
	}
	
	public static final Configuration getInstance() {
		return CONFIG;
	}
	
	public JdbcCfgInfo getJdbcCfg() {
		JdbcCfgInfo jdbc = new JdbcCfgInfo();
		Node node = document.selectSingleNode("/form-engine/data-source/driver-class");
		if(node != null) {
			jdbc.setDriverClass(node.getText().trim());
		}
		node = document.selectSingleNode("/form-engine/data-source/url");
		if(node != null) {
			jdbc.setUrl(node.getText().trim());
		}
		node = document.selectSingleNode("/form-engine/data-source/user-name");
		if(node != null) {
			jdbc.setUsername(node.getText().trim());
		}
		node = document.selectSingleNode("/form-engine/data-source/password");
		if(node != null) {
			jdbc.setPassword(node.getText().trim());
		}
		node = document.selectSingleNode("/form-engine/data-source/initial-size");
		if(node != null) {
			int val = NumberUtils.toInt(node.getText().trim(), 10);
			jdbc.setInitialSize(val);
		}
		node = document.selectSingleNode("/form-engine/data-source/max-active");
		if(node != null) {
			int val = NumberUtils.toInt(node.getText().trim(), 20);
			jdbc.setMaxActive(val);
		}
		node = document.selectSingleNode("/form-engine/data-source/max-idle");
		if(node != null) {
			int val = NumberUtils.toInt(node.getText().trim(), 10000);
			jdbc.setMaxIdle(val);
		}
		node = document.selectSingleNode("/form-engine/data-source/max-wait");
		if(node != null) {
			int val = NumberUtils.toInt(node.getText().trim(), 1000);
			jdbc.setMaxWait(val);
		}
		return jdbc;
	}
	
	public Map<String, ComboCfgInfo> getComboCfgs() {
		Map<String, ComboCfgInfo> combos = new HashMap<String, ComboCfgInfo>();
		List<?> nodes = document.selectNodes("/form-engine/combo-configs/combo-config");
		for(int i = 0; i < nodes.size(); i++) {
			ComboCfgInfo combo = new ComboCfgInfo();
			Node node = (Node)nodes.get(i);
			Node codeNode = node.selectSingleNode("@code");
			if(codeNode != null) {
				combo.setCode(codeNode.getText().trim());
			}
			Node nameNode = node.selectSingleNode("@name");
			if(nameNode != null) {
				combo.setName(nameNode.getText().trim());
			}
			Node sqlTplnode = node.selectSingleNode("sql-template");
			if(sqlTplnode != null) {
				combo.setSqlText(sqlTplnode.getText().trim());
			}
			Node dispTplNode = node.selectSingleNode("display-template");
			if(dispTplNode != null) {
				combo.setDisplayExpr(dispTplNode.getText().trim());
			}
			Node valTplNode = node.selectSingleNode("value-template");
			if(valTplNode != null) {
				combo.setValueExpr(valTplNode.getText().trim());
			}
			combos.put(combo.getCode(), combo);
		}
		return combos;
	}
	
	public UploadCfgInfo getUploadCfg() {
		UploadCfgInfo upload = new UploadCfgInfo();
		Node node = document.selectSingleNode("/form-engine/image-upload/save-path");
		if(node != null) {
			upload.setSavePath(node.getText().trim());
		}
		node = document.selectSingleNode("/form-engine/image-upload/file-type");
		if(node != null) {
			upload.setFileType(node.getText().trim());
		}
		node = document.selectSingleNode("/form-engine/image-upload/max-size");
		if(node != null) {
			int maxSize = NumberUtils.toInt(node.getText().trim(), 1000000);
			upload.setMaxSize(maxSize);
		}
		return upload;
	}
	
	public Map<String, PluginCfgInfo> getPluginCfg() {
		Map<String, PluginCfgInfo> plugins = new HashMap<String, PluginCfgInfo>();
		List<?> nodes = document.selectNodes("/form-engine/plugins/plugin");
		for(int i = 0; i < nodes.size(); i++) {
			PluginCfgInfo plugin = new PluginCfgInfo();
			Node node = (Node)nodes.get(i);
			Node nameNode = node.selectSingleNode("@name");
			if(nameNode != null) {
				plugin.setPluginName(nameNode.getText().trim());
			}
			Node classNode = node.selectSingleNode("@class");
			if(classNode != null) {
				plugin.setHandlerClassName(classNode.getText().trim());
			}
			plugins.put(plugin.getPluginName(), plugin);
		}
		return plugins;
	}
	
	/*public int getInt(String key) {
		return getInt(key, 0);
	}
	
	public int getInt(String key, int def) {
		String str = properties.getProperty(key);
		return NumberUtils.toInt(str, def);
	}
	
	public long getLong(String key) {
		return getLong(key, 0);
	}
	
	public long getLong(String key, long def) {
		String str = properties.getProperty(key);
		return NumberUtils.toLong(str, def);
	}
	
	public String getString(String key) {
		return properties.getProperty(key);
	}
	
	public String getString(String key, String def) {
		return properties.getProperty(key, def);
	}*/
}
