package com.chengyb.framework.dao.dialect;

/**
 * 
 * 
 * <p>
 * Title: <b>Dialect Ibatis 扩展出的支持多数据库的接口类</b>
 * </p>
 * 
 * <p>
 * Description: Ibatis 扩展出的支持多数据库的接口类
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
public interface Dialect {
	/**
	 * 是否支持分页
	 * @return boolean
	 */
	public boolean supportsLimit();

	/**
	 * 分页后的sql
	 * @param sql 原始sql
	 * @param offset 开始行 
	 * @param limit 行数
	 * @return
	 */
	public String getLimitString(String sql, int offset, int limit);

	/**
	 * 求和的SQL
	 * @param sql
	 * @param sumColumn 求和列
	 * @return
	 */
	public String getSumString(String sql, String[] sumColumn);
	////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 替换 统计中的数据库函数
	 * @return
	 */
	public String replaceAll(String str);

}
