package com.chengyb.framework.utils;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
/**
 * Object 处理类
 * @author sagitta
 *
 */
public class ObjectUtils {

	public static int getInt(String str) {
		try {
			return Integer.parseInt(str);
		} catch (Exception ex) {
			return 0;
		}
	}

	public static double getdouble(String str) {
		try {
			return Double.parseDouble(str);
		} catch (Exception ex) {
			return 0;
		}
	}

	public static long getlong(String str) {
		try {
			return Long.parseLong(str);
		} catch (Exception ex) {
			return 0;
		}
	}

	public static float getfloat(String str) {
		try {
			return Float.parseFloat(str);
		} catch (Exception ex) {
			return 0;
		}

	}

	public static boolean getboolean(String str) {
		try {
			return Boolean.getBoolean(str);
		} catch (Exception ex) {
			return false;
		}

	}

	public static Boolean getBoolean(String str) {
		try {
			return Boolean.valueOf(str);
		} catch (Exception ex) {
			return null;
		}

	}

	public static String getString(String str) {
		if (str == null) {
			return null;
		}
		return str;
	}

	public static Integer getInteger(String str) {
		try {
			if (str == null || str.equals("")) {
				return null;
			}

			return new Integer(str);
		} catch (Exception ex) {
			return null;
		}
	}

	public static Float getFloat(String str) {
		try {
			if (str == null || str.equals("")) {
				return null;
			}

			return new Float(str);
		} catch (Exception ex) {
			return null;
		}
	}

	public static Long getLong(String str) {
		try {
			if (str == null || str.equals("")) {
				return null;
			}

			return new Long(str);
		} catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}
	}
	
	public static Long getLongByFloat(String str) {
		try {
			if (str == null || str.equals("")) {
				return null;
			}
			return ((Float) Float.parseFloat(str)).longValue();
		} catch (Exception ex) {
			ex.printStackTrace();
			throw new RuntimeException("请输入数字；");
		}
	}

	public static java.sql.Date getSqlDate(String str) {
		try {
			if (str == null || str.equals("")) {
				return null;
			}
			DateFormat df = new java.text.SimpleDateFormat("yyyy-MM-dd");
			java.util.Date tempDate = df.parse(str);
			return new java.sql.Date(tempDate.getTime());
		} catch (ParseException ex) {
			return null;
		}
	}

	public static java.util.Date getUtilDate(String str) {
		try {

			if (str == null || str.trim().equals("")) {
				return null;
			}
			DateFormat df = new java.text.SimpleDateFormat("yyyy-MM-dd");
			java.util.Date tempDate = df.parse(str);
			return tempDate;
		} catch (ParseException ex) {
			return null;
		}
	}

	public static Double getDouble(String str) {
		try {
			if (str == null || str.equals("")) {
				return null;
			}
			return new Double(str);
		} catch (NumberFormatException ex) {
			return null;
		}
	}

	public static Timestamp getTimestamp(String str) {
		try {
			if (str == null || str.equals("")) {
				return null;
			}
			if (str.length() == 10) {
				DateFormat df = new java.text.SimpleDateFormat("yyyy-MM-dd");// DateFormat.getDateInstance(DateFormat.MEDIUM,
				// java.util.Locale.CHINA);
				java.util.Date tempDate = df.parse(str);
				return new java.sql.Timestamp(tempDate.getTime());
			}
			DateFormat df = DateFormat.getDateTimeInstance();
			java.util.Date tempDate = df.parse(str);
			return new java.sql.Timestamp(tempDate.getTime());
		} catch (ParseException ex) {
			return null;
		}
	}

	/**
	 * toString
	 */
	public static String toString(Object obj) {
		return StringUtils.toString(obj);
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
}
