package com.chengyb.framework.dao;


public class NameUtils {
	public static String tableToValueObject(String tableName) {
		return "";
	}

	/**
	 * 返回类名
	 * @param className String
	 * @return String
	 * String str = InviteSchemeInfo.class.getName();
	 * str=com.chengyb.srm80.invitescheme.valueobject.InviteSchemeInfo
	 * str.substring(str.indexOf("valueobject.")+12,str.length());//=InviteSchemeInfo
	 */
	public static String valueObjectToTable(String className) {
		return className.substring(className.indexOf("valueobject.")+12,className.length());
	}
	
	/**
	 * 返回statementName
	 * @param className String
	 * @param prefix String 需要替换的字符串
	 * @return String
	 * String str = InviteSchemeInfo.class.getName();
	 * str.replaceAll("valueobject.", "inser");//=com.chengyb.srm80.invitescheme.inserInviteSchemeInfo
	 */
	public static String valueObjectToIbatisId(String className,String prefix) {
		return className.replaceAll("valueobject.", prefix);
	}
}
