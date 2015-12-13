package com.chengyb.framework;

import com.chengyb.framework.dao.dialect.Dialect;
import com.chengyb.framework.dao.dialect.OracleDialect;
/**
 * 
 * 
 * <p>Title: <b>Context</b></p> 
 * 
 * <p>Description: 整个框架的上下文</p> 
 * 
 * <p>Copyright: Copyright (c) 2009</p> 
 * 
 * <p>Company: www.chengyb.com</p>
 * 
 * @author sagitta
 * @version 1.0
 * @date 2009-4-4
 *
 */
public class Context {
	
	private static Dialect dialect = new OracleDialect();

	public static Dialect getDialect() {
		return dialect;
	}

	public static void setDialect(Dialect dialect) {
		Context.dialect = dialect;
	}
	
}
