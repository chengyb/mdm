package com.chengyb.framework.utils;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.net.URLDecoder;
import java.sql.Date;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 
 * 
 * <p>
 * Title: <b>String 工具类</b>
 * </p>
 * 
 * <p>
 * Description: 字符串处理,格式转换等操作
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2009
 * </p>
 * 
 * <p>
 * Company: www.chengyb.com
 * </p>
 * 
 * @author chengyb
 * @version 1.0
 * @date 2009-3-30
 * 
 */
public class StringUtils {
	public static final String STRING_5$ = "\\$[^\\$]*\\$[^\\$]*\\$[^\\$]*\\$[^\\$]*\\$";

	public static String replace5$(String sourceString,
			ArrayList<String> arrReplace) {
		return replace(sourceString, STRING_5$, arrReplace);
	}

	/**
	 * 将源字符串中每一个匹配的子串替换成arrReplace对应的字符串 例如： ArrayList<String> arrReplace = new
	 * ArrayList<String>(); arrReplace.add("#"); arrReplace.add("%");
	 * logger.debug(replace("abcabc", "b", arrReplace)); 输出结果：a#ca%c
	 * 
	 * @param sourceString
	 *            源字符串
	 * @param pattern
	 *            正则表达式
	 * @param arrReplace
	 *            替换字符集
	 * @return 替换后的字符串
	 */
	public static String replace(String sourceString, String pattern,
			ArrayList<String> arrReplace) {
		Pattern p = Pattern.compile(pattern);
		Matcher m = p.matcher(sourceString);
		StringBuffer sb = new StringBuffer();
		int count = 0;
		while (m.find()) {
			m.appendReplacement(sb,
					arrReplace.size() > count ? arrReplace.get(count++) : "");
		}
		m.appendTail(sb);
		return sb.toString();
	}

	/**
	 * 将url中的特殊字符进行编码转换
	 * 
	 * @param
	 * @return
	 * @exception
	 */
	public static String encodeUrl(String url) {
		String result = url;

		result = result.replaceAll("\\?", "@");
		result = result.replaceAll("&", "-");

		return result;
	}

	/**
	 * 计算当前字符串 转换为oracle长度后的长度
	 * 
	 * @param obj
	 * @return
	 */
	public static int getOracleLength(Object obj) {
		String s = StringUtils.toString(obj);
		s = s.replaceAll("[^\\x00-\\xff]", "***");
		int length = s.length();
		return length;
	}

	/**
	 * 判断当前字符串中是否包含汉字 或全角字符
	 * 
	 * @param obj
	 * @return
	 */
	public static boolean hasChineseWord(Object obj) {
		String s = StringUtils.toString(obj);
		s = s.replaceAll("[^\\x00-\\xff]", "***");
		if (s.length() > StringUtils.toString(obj).length()) {
			return true;
		}
		return false;
	}

	/**
	 * 将url中的特殊字符进行解码转换
	 * 
	 * @param
	 * @return
	 * @exception
	 */
	public static String decodeUrl(String decodeUrl) {
		String result = decodeUrl;

		result = result.replaceAll("@", "?");
		result = result.replaceAll("-", "&");

		return result;
	}

	public static String inEncodingURL(String url) {
		try {
			return URLDecoder.decode(url, "UTF-8");
		} catch (UnsupportedEncodingException e) {
		}
		return url;
	}

	public static String convertToUTF8(String s) {
		if ((s == null) || (s.length() == 0)) {
			return s;
		}
		try {
			byte[] b = s.getBytes("ISO8859_1");
			for (int i = 0; i < b.length; i++) {
				if (b[i] + 0 < 0) {
					return new String(b, "UTF-8");
				}
			}
			b = s.getBytes("UTF-8");
			for (int i = 0; i < b.length; i++) {
				if (b[i] + 0 < 0) {
					return new String(b, "UTF-8");
				}
			}
		} catch (Exception e) {
		}
		return s;
	}

	public static long parseLong(String str) {
		try {

			return Long.parseLong(str);
		} catch (Exception ex) {
			return 0L;
		}
	}

	public static int parseInt(String str) {
		try {

			return Integer.parseInt(str);
		} catch (Exception ex) {
			return 0;
		}
	}

	public static int parseInt(String str, int i) {
		try {

			return Integer.parseInt(str);
		} catch (Exception ex) {
			return i;
		}
	}

	public static double parseDouble(String str) {
		try {
			return Double.parseDouble(str);
		} catch (Exception ex) {
			return 0;
		}
	}

	public static String toString(Object obj) {
		if (obj == null) {
			return "";
		}
		if (obj.getClass().getName().equals("java.lang.String")) {
			return toString((String) obj).trim();
		}
		if (obj.getClass().getName().equals("java.lang.Integer")) {
			return toString((Integer) obj).trim();
		}
		if (obj.getClass().getName().equals("java.lang.Long")) {
			return toString((Long) obj).trim();
		}
		if (obj.getClass().getName().equals("java.sql.Date")) {
			return toString((Date) obj).trim();
		}
		if (obj.getClass().getName().equals("java.util.Date")) {
			return toString((java.util.Date) obj).trim();
		}
		if (obj.getClass().getName().equals("java.lang.Float")) {
			return toString((Float) obj).trim();
		}
		if (obj.getClass().getName().equals("java.sql.Timestamp")) {
			return toString((Timestamp) obj).trim();
		}
		if (obj.getClass().getName().equals("java.lang.Double")) {
			return toString((Double) obj).trim();
		}

		return obj.toString().trim();
	}

	// 字符串 不启用trim
	public static String toString_alias(Object obj) {
		if (obj == null) {
			return "";
		}
		if (obj.getClass().getName().equals("java.lang.String")) {
			return toString((String) obj);
		}
		if (obj.getClass().getName().equals("java.lang.Integer")) {
			return toString((Integer) obj).trim();
		}
		if (obj.getClass().getName().equals("java.lang.Long")) {
			return toString((Long) obj).trim();
		}
		if (obj.getClass().getName().equals("java.sql.Date")) {
			return toString((Date) obj).trim();
		}
		if (obj.getClass().getName().equals("java.util.Date")) {
			return toString((java.util.Date) obj).trim();
		}
		if (obj.getClass().getName().equals("java.lang.Float")) {
			return toString((Float) obj).trim();
		}
		if (obj.getClass().getName().equals("java.sql.Timestamp")) {
			return toString((Timestamp) obj).trim();
		}
		if (obj.getClass().getName().equals("java.lang.Double")) {
			return toString((Double) obj).trim();
		}

		return obj.toString();
	}

	public static String toCSV(Object obj) {
		String str = toString(obj);
		return str.replaceAll("\"", "\"\"").replaceAll("\n", "")
				.replaceAll("\r", "");
	}

	public static String toString(int obj) {
		return String.valueOf(obj);
	}

	public static String toString(long obj) {
		return String.valueOf(obj);
	}

	public static String toString(double obj) {
		return String.valueOf(obj);
	}

	public static String toString(float obj) {
		return String.valueOf(obj);
	}

	public static String toString(boolean obj) {
		return String.valueOf(obj);
	}

	public static String toString(char obj) {
		return String.valueOf(obj);
	}

	private static String toString(String obj) {
		if (obj == null) {
			return "";
		}
		return obj;
	}

	private static String toString(Integer obj) {
		if (obj == null) {
			return "";
		}
		return obj.toString();
	}

	private static String toString(Long obj) {
		if (obj == null) {
			return "";
		}
		return obj.toString();
	}

	private static String toString(Date obj) {
		if (obj == null) {
			return "";
		}

		DateFormat dftime = new java.text.SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		String str = dftime.format(obj);
		if (str.indexOf("00:00:00") < 0) {
			return str;
		} else {
			DateFormat df = new java.text.SimpleDateFormat("yyyy-MM-dd");
			return df.format(obj);
		}
	}

	private static String toString(Double obj) {
		if (obj == null) {
			return "";
		}
		// liuyl fix bug .old BigDecimal return like
		// 2.45459999999999999999999999999999999999999345345
		return obj.doubleValue() + "";
		// BigDecimal bd = new BigDecimal(obj);
		// return bd.toString();
	}

	private static String toString(Float obj) {
		if (obj == null) {
			return "";
		}
		return obj.toString();
	}

	private static String toString(Timestamp obj) {
		if (obj == null) {
			return "";
		}
		return obj.toString();
	}

	private static String toString(java.util.Date obj) {
		if (obj == null) {
			return "";
		}
		return getDateString(obj);
	}

	private static String getDateString(java.util.Date adate) {

		if (adate == null) {
			return "";
		}

		DateFormat dftime = new java.text.SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		String str = dftime.format(adate);
		if (str.indexOf("00:00:00") < 0) {
			return str;
		} else {
			DateFormat df = new java.text.SimpleDateFormat("yyyy-MM-dd");
			return df.format(adate);
		}

	}

	/**
	 * 验证日期格式。
	 * 
	 * @param date
	 *            : 验证的日期字符串。 日期格式：2012-02-15
	 * @return ： if true 格式正确；else 格式错误。
	 */
	public static boolean checkDate(String date) {
		boolean flag = false;
		String dateFormat = "^\\d{4}-\\d{2}-\\d{2}$"; // 日期格式
		if (date.matches(dateFormat)) {
			String eL = "^((\\d{2}(([02468][048])|([13579][26]))[\\-\\/\\s]?((((0?[13578])|(1[02]))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])))))|(\\d{2}(([02468][1235679])|([13579][01345789]))[\\-\\/\\s]?((((0?[13578])|(1[02]))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-\\/\\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\\s(((0?[0-9])|([1][0-9])|([2][0-3]))\\:([0-5]?[0-9])((\\s)|(\\:([0-5]?[0-9])))))?$";
			Pattern p = Pattern.compile(eL);
			Matcher m = p.matcher(date);
			flag = m.matches();
		}
		return flag;
	}

	/**
	 * 在 source 后边填充 target 总长len (target 单字符)
	 * 
	 * @param source
	 * @param target
	 * @param len
	 * @return
	 */
	public static String fillAfter(String source, String target, int len) {
		StringBuffer bf = new StringBuffer(len);
		for (int i = 0; i < len; i++) {
			bf.append(target);
		}
		String temp = bf.toString();
		temp = temp.substring(source.length(), len);
		return source + temp;
	}

	/**
	 * 在 source 前边填充 target (target 单字符),填充完后总长度为len
	 * 
	 * @param source
	 * @param target
	 * @param len
	 * @return
	 */
	public static String fillBefore(String source, String target, int len) {
		StringBuffer bf = new StringBuffer(len);
		for (int i = 0; i < len; i++) {
			bf.append(target);
		}
		String temp = bf.toString();
		temp = temp.substring(0, len - source.length());
		return temp + source;
	}

	public static String tofirstUpperCase(String source, int index) {
		String temp = source.substring(0, index);
		source = temp.toUpperCase() + source.substring(index, source.length());
		return source;
	}

	public static String toOnlyfirstUpperCase(String source, int index) {
		String temp = source.substring(0, index);
		source = temp.toUpperCase()
				+ source.substring(index, source.length()).toLowerCase();
		return source;
	}

	public static String tofirstLowerCase(String source, int index) {
		String temp = source.substring(0, index);
		source = temp.toLowerCase() + source.substring(index, source.length());
		return source;
	}

	public static String and(String value, String target) {

		BigInteger _value = new BigInteger(value, 2);
		BigInteger _target = new BigInteger(target, 2);

		return StringUtils.fillBefore(
				Integer.toBinaryString(_value.and(_target).intValue()), "0",
				value.length());
	}

	public static String or(String value, String target) {
		BigInteger _value = new BigInteger(value, 2);
		BigInteger _target = new BigInteger(target, 2);
		return StringUtils.fillBefore(
				Integer.toBinaryString(_value.or(_target).intValue()), "0",
				value.length());
	}

	public static String round(double d, int n) {
		if (d == 0) {
			d = 0;
		}
		if (n < 0) {
			n = 0;
		}
		String str = "";
		if (n == 0) {
			str = "0";
		} else {
			str = "0.";
		}
		for (int i = 0; i < n; i++) {
			str = str + "0";
		}
		DecimalFormat formater = new DecimalFormat(str);
		BigDecimal b = new BigDecimal(d + "");
		double tempd = b.setScale(n, BigDecimal.ROUND_HALF_UP).doubleValue();

		if (tempd == 0) {
			tempd = 0;
		}
		return formater.format(tempd);
	}

	public static boolean isEmpty(String str) {
		return "".equals(StringUtils.toString(str));
	}

	public static boolean isNotEmpty(String str) {
		return !"".equals(StringUtils.toString(str));
	}

	/**
	 * str:有效的数字 字符 如：-5;5;-0.99;99.66 cout:小数位的个数 0 表示整数 ; >0 表示小数点后位数 ;-1
	 * 表示浮点小数 不控制位数
	 */
	public static boolean validDecimal(String str, long count) {
		String reg;
		if (count == 0) {
			reg = "^-?\\d+$";// 整数
		} else if (count > 0) {
			// 刘永领 特殊情况判断：如果小数点后位数小于精度 认为合法 。根据具体客户要求 是否需要自动补0
			// 如:精度是3 客户录入 1.1 认为有效 如果是整数也有效
			try {
				int pos = str.indexOf(".");
				if ((str.substring(pos, str.length())).length() <= count)
					return true;
			} catch (Exception e) {
				return true;
			}

			reg = "\\d+(\\.\\d{" + count + "})";
		} else if (count == -1) {
			reg = "\\d+(\\.\\d+)";
		} else {
			throw new RuntimeException("传入的小数位参数有误！");
		}
		if (str.matches(reg)) {
			return true;
		}
		return false;
	}

	public static boolean isNumber(String str) {
		if (str == null) {
			return true;
		}
		// Pattern pattern = Pattern.compile("[0-9]*");
		String regExp = "^(-|\\+)?\\d+(\\.\\d+)?$";
		Pattern pattern = Pattern.compile(regExp);
		return pattern.matcher(str).matches();
	}

	/**
	 * 判断是否只是数字、字母和下划线，过滤掉特殊字符
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNumberOrCharacter(String str) {
		if (str == null) {
			return false;
		}
		String regExp = "^[a-zA-Z0-9_]+$";
		Pattern pattern = Pattern.compile(regExp);
		return pattern.matcher(str).matches();
	}

	/**
	 * 验证日期格式。
	 * 
	 * @param date
	 *            验证的日期字符串。
	 * @return if true 格式正确；else 格式错误。
	 */
	public static boolean isDate(String date) {
		String eL = "^((\\d{2}(([02468][048])|([13579][26]))[\\-\\/\\s]?((((0?[13578])|(1[02]))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])))))|(\\d{2}(([02468][1235679])|([13579][01345789]))[\\-\\/\\s]?((((0?[13578])|(1[02]))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-\\/\\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\\s(((0?[0-9])|([1][0-9])|([2][0-3]))\\:([0-5]?[0-9])((\\s)|(\\:([0-5]?[0-9])))))?$";
		Pattern p = Pattern.compile(eL);
		Matcher m = p.matcher(date);
		boolean b = m.matches();
		return b;
	}

	// 全替换字符串
	public static String replaceAll(String strSource, String strFrom,
			String strTo) {
		if (strSource == null) {
			return null;
		}
		int i = 0;
		if ((i = strSource.indexOf(strFrom, i)) >= 0) {
			char[] cSrc = strSource.toCharArray();
			char[] cTo = strTo.toCharArray();
			int len = strFrom.length();
			StringBuffer buf = new StringBuffer(cSrc.length);
			buf.append(cSrc, 0, i).append(cTo);
			i += len;
			int j = i;
			while ((i = strSource.indexOf(strFrom, i)) > 0) {
				buf.append(cSrc, j, i - j).append(cTo);
				i += len;
				j = i;
			}
			buf.append(cSrc, j, cSrc.length - j);
			return buf.toString();
		}
		return strSource;
	}

	/**
	 * 判断是否是手机号码
	 * 
	 * @param str
	 * @return
	 */
	public static boolean checkTelephone(String str) {
		if (str == null) {
			return false;
		}
		String regExp = "^(1{1}[0-9]{10})?$";
		Pattern pattern = Pattern.compile(regExp);
		return pattern.matcher(str).matches();
	}

	public static String hiddenCenter(String str, String replaceStr, int len) {
		int length = toString(str).length();
		if (length >= len * 2 + 1) {
			return str.substring(0, len + 1)
					+ str.substring(len + 1, length - len).replaceAll(".",
							replaceStr) + str.substring(length - len);
		}
		return "";
	}

	/**
	 * 处理oracle contains(全文检索) 转义特殊字符
	 * 
	 * @param sql
	 * @return
	 */
	public static String escapeSpecialCharsInOralceText(String sql) {
		String[] specialcharacters = { "-", "&", "|", "!", "(", ")", "{", "}",
				"[", "]", "^", "\"", "~", "*", "?", ":", "'" };
		for (String str : specialcharacters) {
			sql = sql.replace(str, "\\" + str);
		}
		return sql;
	}

	/**
	 * 去除字符串数组中重复的值
	 * 
	 * @param String
	 * @return String [] str 例如：source: a,b,c,d,a String [] str: [a,b,c,d]
	 */
	public static String[] removeRepeatString(String source) {
		String[] target = source.split(",");
		Set<String> set = new TreeSet<String>();
		for (int i = 0; i < target.length; i++) {
			set.add(target[i]);
		}
		target = (String[]) set.toArray(new String[0]);
		return target;
	}

	/**
	 * 通过正则过滤html标签
	 * 
	 * @param htmlStr
	 * @return
	 */
	public static String filterHtmlTag(String htmlStr) {
		String regEx_html = "<[^>]+>"; // 定义HTML标签的正则表达式
		Pattern p_html = Pattern.compile(regEx_html, Pattern.CASE_INSENSITIVE);
		Matcher m_html = p_html.matcher(htmlStr);
		htmlStr = m_html.replaceAll(""); // 过滤html标签
		return htmlStr;
	}

	/**
	 * 判断Key是否存在与数组中
	 * 
	 * @param htmlStr
	 * @return
	 */
	public static boolean isInclude(String[] keys, String key) {
		for (String _key : keys) {
			if (_key.equals(key)) {
				return true;
			}
		}
		return false;
	}

	public static String deleteSpecialCode(String str) {

		if ("".equals(StringUtils.toString(str))) {
			return StringUtils.toString(str);
		} else {
			String newStr = null;
			if (str.contains("-")) {
				newStr = str.replace("-", "chengybMDM");
				return newStr;
			} else {
				return StringUtils.toString(str);
			}
		}
	}

	public static String replaceAdUser(String aduser) {
		if (StringUtils.toString(aduser).lastIndexOf("\\") > 0) {
			aduser = aduser.substring(aduser.lastIndexOf("\\") + 1,
					aduser.length());
		}
		return aduser;
	}
}
