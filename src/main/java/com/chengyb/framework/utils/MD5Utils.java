package com.chengyb.framework.utils;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import sun.misc.BASE64Encoder;

public class MD5Utils {
	private static final Log LOG = LogFactory.getLog(MD5Utils.class);

	public static String encode(String str) {
		if (StringUtils.isEmpty(str)) {
			return "";
		}
		String result = null;
		try {
			MessageDigest md5 = MessageDigest.getInstance("MD5");
			BASE64Encoder base64en = new BASE64Encoder();
			result = base64en.encode(md5.digest(str.getBytes("utf-8")));
		} catch (NoSuchAlgorithmException e1) {
			LOG.error("不支持MD5算法", e1);
			throw new RuntimeException(e1);
		} catch (UnsupportedEncodingException e2) {
			LOG.error("不支持utf-8编码", e2);
			throw new RuntimeException(e2);
		}

		return result;
	}

	public static void main(String[] args) {
		System.out.println(encode("admin"));
	}
}