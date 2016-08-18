package com.neusoft.hit.fe.core.utility;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.commons.lang.time.DateUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class EngineUtil {
	
	public static final Log LOGGER = LogFactory.getLog(EngineUtil.class);
	
	public static String guid() {
		return UUID.randomUUID().toString().replaceAll("\\-", "");
	}

	public static String now() {
		Date now = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return formatter.format(now);
	}

	public static String md5(String data) {
		return DigestUtils.md5Hex(data);
	}

	public static String format(String dateStr, String pattern) {
		String[] patterns = new String[] { "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd", "yyyy/MM/dd", "yyyyMMdd" };
		String ret = null;
		try {
			Date date = DateUtils.parseDate(dateStr, patterns);
			ret = format(date, pattern);
		} catch (ParseException e) {
			LOGGER.error(e.toString(), e);
		}
		return ret;
	}

	public static String format(Date date, String pattern) {
		String dateStr = null;
		if (date != null) {
			dateStr = DateFormatUtils.format(date, pattern);
		}
		return dateStr;
	}

	public static String join(String str, String newSeperator, String defaultVal) {
		return join(str, ",", newSeperator, "", "", defaultVal);
	}

	public static String join(String str, String oldSeperator, String newSeperator, String begin, String end,
			String defaultVal) {
		if (str == null) {
			return defaultVal;
		}
		String[] array = str.split(oldSeperator);
		StringBuilder builder = new StringBuilder();
		if (begin != null) {
			builder.append(begin);
		}
		for (int i = 0; i < array.length; i++) {
			builder.append(array[i]);
			builder.append(newSeperator);
		}
		int index = builder.lastIndexOf(newSeperator);
		if (index > -1) {
			builder.setLength(index);
		}
		builder.append(end);
		return builder.toString();
	}

	public static String join(List<Map<String, Object>> list, String field) {
		return join(list, field, ",", "", "", "");
	}

	public static String join(List<Map<String, Object>> list, String field, String seperator, String begin, String end,
			String defaultVal) {
		if (list == null || list.isEmpty()) {
			return defaultVal;
		}
		StringBuilder builder = new StringBuilder();
		if (begin != null) {
			builder.append(begin);
		}
		for (int i = 0; i < list.size(); i++) {
			Object obj = list.get(i).get(field);
			if (obj != null) {
				builder.append(obj);
				builder.append(seperator);
			}
		}
		int index = builder.lastIndexOf(seperator);
		if (index > -1) {
			builder.setLength(index);
		}
		builder.append(end);
		return builder.toString();
	}

	public static <T> T create(Class<T> clazz, Map<String, String> propertyMap) {
		T obj = null;
		try {
			obj = clazz.newInstance();
			Method[] methods = clazz.getMethods();
			for (Method method : methods) {
				String methodName = method.getName();
				Class<?>[] parameterTypes = method.getParameterTypes();
				if (methodName.startsWith("set") && parameterTypes.length == 1) {
					String key = StringUtils.uncapitalize(methodName.substring(3));
					Class<?> parameterType = parameterTypes[0];
					String name = parameterType.getSimpleName();
					if (propertyMap.containsKey(key)) {
						String value = propertyMap.get(key);
						if ("Object".equalsIgnoreCase(name) || "String".equalsIgnoreCase(name)) {
							method.invoke(obj, value);
						} else if ("Long".equalsIgnoreCase(name)) {
							method.invoke(obj, NumberUtils.toLong(value));
						} else if ("Integer".equalsIgnoreCase(name) || "Int".equalsIgnoreCase(name)) {
							method.invoke(obj, NumberUtils.toInt(value));
						} else if ("Short".equalsIgnoreCase(name)) {
							method.invoke(obj, NumberUtils.toShort(value));
						} else if ("Float".equalsIgnoreCase(name)) {
							method.invoke(obj, NumberUtils.toFloat(value));
						} else if ("Double".equalsIgnoreCase(name)) {
							method.invoke(obj, NumberUtils.toDouble(value));
						} else if ("Boolean".equalsIgnoreCase(name)) {
							method.invoke(obj, BooleanUtils.toBoolean(value));
						}
					}
				}
			}
		} catch (InstantiationException e) {
			LOGGER.error(e.toString(), e);
		} catch (IllegalAccessException e) {
			LOGGER.error(e.toString(), e);
		} catch (IllegalArgumentException e) {
			LOGGER.error(e.toString(), e);
		} catch (InvocationTargetException e) {
			LOGGER.error(e.toString(), e);
		}
		return obj;
	}
}
