package com.neusoft.hit.fe.core.utility;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;

public class CommonUtil {
	
	public static String guid() {
		return UUID.randomUUID().toString().replaceAll("\\-", "");
	}
	
	public static <T> T create(Class<T> clazz, Map<String, String> propertyMap) {
		T obj = null;
		try {
			obj = clazz.newInstance();
			Method[] methods = clazz.getMethods();
			for(Method method : methods) {
				String methodName = method.getName();
				Class<?>[] parameterTypes = method.getParameterTypes();
				if(methodName.startsWith("set") && parameterTypes.length == 1) {
					String key = StringUtils.uncapitalize(methodName.substring(3));
					Class<?> parameterType = parameterTypes[0];
					String name = parameterType.getSimpleName();
					if(propertyMap.containsKey(key)) {
						String value = propertyMap.get(key);
						if("Object".equalsIgnoreCase(name) || "String".equalsIgnoreCase(name)) {
							method.invoke(obj, value);
						}
						else if("Long".equalsIgnoreCase(name)) {
							method.invoke(obj, NumberUtils.toLong(value));
						}
						else if("Integer".equalsIgnoreCase(name) || "Int".equalsIgnoreCase(name)) {
							method.invoke(obj, NumberUtils.toInt(value));
						}
						else if("Short".equalsIgnoreCase(name)) {
							method.invoke(obj, NumberUtils.toShort(value));
						}
						else if("Float".equalsIgnoreCase(name)) {
							method.invoke(obj, NumberUtils.toFloat(value));
						}
						else if("Double".equalsIgnoreCase(name)) {
							method.invoke(obj, NumberUtils.toDouble(value));
						}
						else if("Boolean".equalsIgnoreCase(name)) {
							method.invoke(obj, BooleanUtils.toBoolean(value));
						}
					}
				}
			}
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		return obj;
	}
}
