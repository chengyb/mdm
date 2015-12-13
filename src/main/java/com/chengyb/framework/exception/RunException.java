/**
 * 
 */
package com.chengyb.framework.exception;

import java.text.MessageFormat;

//import com.chengyb.framework.utils.DB2messageUtil;
//import com.chengyb.framework.utils.I18nUtil;

/**
 * 
 * <p>
 * Title: <b>RunException.java 框架统一异常类</b>
 * </p>
 * 
 * <p>
 * Description: 框架统一异常类、支持事务
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
 * @date 2009-3-31
 * 
 */

public class RunException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String exceptionKey = null;

	private Object[] exceptionArgs = null;

	public RunException(String exceptionKey) {
		super(exceptionKey);
//		super(new I18nUtil().message("exception."+exceptionKey,exceptionKey));
//		//对于DB2报错的统一处理 高文跃
//		if (exceptionKey.indexOf("DB2")>=0) {
//			exceptionKey = DB2messageUtil.getError(exceptionKey);
//		}
		this.exceptionKey = exceptionKey;
	}

	public RunException(Throwable cause) {
		super(cause.getMessage());
	}

	public RunException(String exceptionKey, String... args) {
		super(exceptionKey);
//		super(MessageFormat.format(new I18nUtil().message("exception."+exceptionKey,exceptionKey), args));
		this.exceptionKey = exceptionKey;
		this.exceptionArgs = args;
	}

	public String getExceptionKey() {
		return exceptionKey;
	}

	public Object[] getExceptionArgs() {
		return exceptionArgs;
	}
}
