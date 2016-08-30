package com.neusoft.hit.emr.fd.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.commons.lang.time.DateUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class CommonUtil {
	
	public static final Log LOGGER = LogFactory.getLog(CommonUtil.class);
	
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
		String[] patterns = new String[]{"yyyy-MM-dd HH:mm:ss","yyyy-MM-dd","yyyy/MM/dd","yyyyMMdd"};
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
		if(date != null) {
			dateStr = DateFormatUtils.format(date, pattern);
		}
		return dateStr;
	}
}
