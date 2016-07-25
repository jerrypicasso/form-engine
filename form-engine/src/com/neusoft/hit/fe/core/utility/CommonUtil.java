package com.neusoft.hit.fe.core.utility;

import java.util.UUID;

public class CommonUtil {
	
	public static String guid() {
		return UUID.randomUUID().toString().replaceAll("\\-", "");
	}
	
}
