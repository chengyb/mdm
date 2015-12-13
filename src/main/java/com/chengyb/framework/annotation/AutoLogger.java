package com.chengyb.framework.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


/**
 * 
 * 
 * <p>
 * Title: <b>AutoLogger 自动记录日志的注释标签</b>
 * </p>
 * 
 * <p>
 * Description: 自动记录日志的注释标签
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
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AutoLogger {
	
	

	public abstract java.lang.String name() default "";
	/**
	 * 操作成功
	 * @return "success"
	 */
	public abstract java.lang.String success() default "success";
	/**
	 * 操作失败
	 * @return "error"
	 */
	public abstract java.lang.String error() default "error";
	
	/**
	 * 操作所属类型(模块)
	 * @return
	 */
	public abstract java.lang.String classfication() default "classfication";
	
	/**
	 * 是否需要记录日志
	 * @return
	 */
	public abstract java.lang.String need() default "true";

}
