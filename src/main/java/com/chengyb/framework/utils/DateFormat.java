package com.chengyb.framework.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/**
 * 
 * 
 * <p>
 * Title: <b>日期工具类</b>
 * </p>
 * 
 * <p>
 * Description: 处理各类日期、时间的格式和类型转换
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

public class DateFormat {
	
	public static String formatDate = "yyyy-MM-dd";

	private static String timePattern = formatDate + " HH:mm:ss";

	private static final String DATETIME = "yyyy-MM-dd HH:mm:ss";

	/**
	 * Description: 对该方法的调用只有第一次能有效;
	 * 
	 * @param str
	 * @return void
	 */

	/**
	 * use a private contructor to establish a singleton pattern
	 */
	private DateFormat() {
	}

	/**
	 * return current date in the specified format 将当前的日期按照需要的日期格式进行转化
	 */
	public static String currentDate(String format) {
		if (format == null)
			format = "";
		return formatDate(new Date(), format);
	}

	/**
	 * return date string in the specified format 将日期Date date格式化为"yyyy-MM-dd"
	 */

	public static String formatDate(Date date) {
		return formatDate(date, formatDate);
	}

	/**
	 * 将Date date日期格式化为需要的format格式
	 */
	public static String formatDate(Date date, String format) {
		if (date == null) {
			return "";
		}
		if (format == null)
			format = "";
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		return sdf.format(date);
	}
	
	public static Date format(Date date, String format) {
		if (date == null) {
			return null;
		}
		if (format == null)
			format = "";
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		return parseDate(sdf.format(date),format);
	}

	/**
	 * 将日期格式的字符串dateStr转化为"yyyy-MM-dd"格式的Date
	 * 
	 * @param dateStr
	 *            String
	 * @return Date
	 */
	public static Date parseDate(String dateStr) {
		return parseDate(dateStr, formatDate);
	}

	/**
	 * parse the text to a date in the specified format
	 * 将日期格式的字符串dateStr转化为format格式的Date
	 */
	public static Date parseDate(String dateStr, String format) {
		try {
			if (format == null)
				format = "";
			SimpleDateFormat sdf = new SimpleDateFormat(format);

			return sdf.parse(dateStr);

		} catch (Exception ex) {
			return null;
		}
	}

	/**
	 * parse the text to a date in the specified format add ntime
	 * 将日期格式的字符串dateStr转化为"yyyy-MM-dd"的Date，再加上相应的ntime天数
	 */
	public static Date parseDate(String dateStr, int ntime) {
		try {
			Date sdate = parseDate(dateStr);

			if (sdate == null) {
				return null;
			}
			Calendar clen = Calendar.getInstance(Locale.CHINESE);
			clen.setTime(sdate);
			clen.add(Calendar.DAY_OF_MONTH, ntime);
			sdate = clen.getTime();

			return sdate;

		} catch (Exception ex) {
			return null;
		}

	}

	/**
	 * 显示时分秒格式的时间
	 */
	public static String formateDateTime(Date date) {
		if (date == null)
			return "";
		SimpleDateFormat sdf = new SimpleDateFormat(timePattern);

		return sdf.format(date);
	}

	/**
	 * 显示时分秒格式的时间 param date: The date to be display in the pattern of
	 * "yyyy-mm-dd param daysAdded: The days that are added to date.
	 * 
	 */
	public static String formateDateTime(Date date, int daysAdded) {

		if (date == null)
			return "";
		Calendar cal = Calendar.getInstance(java.util.Locale.CHINA);
		cal.setTime(date);
		cal.add(Calendar.DATE, daysAdded);
		SimpleDateFormat sdf = new SimpleDateFormat(formatDate);
		return sdf.format(cal.getTime());

	}

	/**
	 * 将日期格式的字符串dateStr转化为"yyyy-MM-dd HH:mm:ss"格式的Date
	 * 
	 * @param dateStr
	 *            String
	 * @return Date
	 */
	public static Date parseDateTime(String dateStr) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(DATETIME);
			return sdf.parse(dateStr);
		} catch (Exception ex) {
			try {
				SimpleDateFormat sdf = new SimpleDateFormat(DATETIME);
				return sdf.parse(dateStr + " 00:00:00");
			} catch (Exception e) {
				return null;
			}
		}
	}
	
	/**
	 * 比较日期大小
	 * 
	 * @param dateStr
	 *            String
	 * @return Date
	 */
	 public static int compare_date(String DATE1, String DATE2) {
	        
	        
		 SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
	        try {
	            Date dt1 = df.parse(DATE1);
	            Date dt2 = df.parse(DATE2);
	            if (dt1.getTime() > dt2.getTime()) {
//	                logger.debug(DATE1+"在"+DATE2+"后");
	                return 1;
	            } else if (dt1.getTime() < dt2.getTime()) {
//	                logger.debug(DATE1+"在"+DATE2+"前");
	                return -1;
	            } else {
	                return 0;
	            }
	        } catch (Exception exception) {
	            exception.printStackTrace();
	        }
	        return 0;
	    }
}
