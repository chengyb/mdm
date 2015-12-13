/**
 * 
 */
package com.chengyb.framework.dao.ibatis2.plugins.impl;


import com.chengyb.framework.dao.ibatis2.plugins.SqlMapParser;

/**
 * 
 * <p>Title: <b>SqlMapParserSQLServer.java</b></p> 
 * 
 * <p>Description: </p> 
 * 
 * <p>Copyright: Copyright (c) 2009</p> 
 * 
 * <p>Company: www.chengyb.com</p>
 * 
 * @author chengyb
 * @version 1.0
 * @date 2009-4-1
 *
 */

public class SqlMapParserSQLServer implements SqlMapParser {

	/* (non-Javadoc)
	 * @see com.chengyb.framework.plugins.ibatis.SqlMapParser#getClassAsStream(java.lang.Class)
	 */
	public <T> String getClassAsString(Class<T> T) {
		return null;
	}

}
