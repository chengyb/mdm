package com.chengyb.framework.dao.ibatis2.plugins;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;

import org.apache.commons.io.IOUtils;

import com.chengyb.framework.Context;
import com.chengyb.framework.dao.dialect.Dialect;
import com.chengyb.framework.dao.ibatis2.plugins.impl.SqlMapParserBean;

/**
 * 动态加载ibatis资源
 * @author sagitta
 *
 */
public class IbatisResource {

	/**
	 * 类序列化为Reader
	 * @param className 类名
	 * @return
	 */
	public static Reader getClassAsReader(String className) {

		Reader reader = new InputStreamReader(getClassAsStream(className));
		return reader;
	}

	/**
	 * 类序列为流
	 * @param className 类名
	 * @return
	 */
	public static InputStream getClassAsStream(String className) {
		try {
			SqlMapParser parser = new SqlMapParserBean();
			String str = parser.getClassAsString(Class.forName(className));
			InputStream is = convertToInputStream(str);
			return is;
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 根据数据库类型不对对流进行转化
	 * @param inputStream
	 * @return
	 * @throws IOException
	 */
	public static InputStream convertInputStream(InputStream inputStream) throws IOException {
		String str = convertToString(inputStream);
		try {
			inputStream.close();	
		} catch (Exception e) {
		}

		Dialect dialect=Context.getDialect();
		str=dialect.replaceAll(str);
		return convertToInputStream(str);
	}

	/**
	 * 流转化为String
	 * @param is
	 * @return
	 */
	private static String convertToString(InputStream is) {

		ByteArrayOutputStream baos=null;
		int i = -1;
		try {
			baos = new ByteArrayOutputStream();
			while ((i = is.read()) != -1) {
				baos.write(i);
			}
			return baos.toString();
		} catch (IOException e) {
			
		}finally{
			IOUtils.closeQuietly(baos);
		}
		
		return "";

	}

	/**
	 * String转化为Stream
	 * @param str
	 * @return
	 */
	private static InputStream convertToInputStream(String str) {
		ByteArrayInputStream is;
		try {
			is = new ByteArrayInputStream(str.getBytes("utf-8"));
		} catch (UnsupportedEncodingException e) {
			is = new ByteArrayInputStream(str.getBytes());

		}
		return is;
	}
}
