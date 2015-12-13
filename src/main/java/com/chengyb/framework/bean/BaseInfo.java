package com.chengyb.framework.bean;

import java.io.Serializable;
import java.util.Date;

import com.chengyb.framework.utils.DateFormat;
/**
 * 
 * 
 * <p>
 * Title: <b>BaseInfo 所有VO的基类</b>
 * </p>
 * 
 * <p>
 * Description: 所有VO的基类
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
public class BaseInfo implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public static final Date DATENULL = DateFormat.parseDate("0111-11-11");

	public Date getDATENULL() {
		return DATENULL;
	}
}
