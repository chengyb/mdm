package com.chengyb.framework.dao.ibatis2;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
/**
 * 
 * 
 * <p>
 * Title: <b>Dialect Ibatis 扩展出反射类</b>
 * </p>
 * 
 * <p>
 * Description: Ibatis 扩展出反射类
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
class ReflectUtil {
	private static final Log logger = LogFactory.getLog(ReflectUtil.class);

	public static void setFieldValue(Object target, String fname, Class<?> ftype,
			Object fvalue) {
		if (target == null
				|| fname == null
				|| "".equals(fname)
				|| (fvalue != null && !ftype
						.isAssignableFrom(fvalue.getClass()))) {
			return;
		}
		Class<?> clazz = target.getClass();
		try {
			Method method = clazz.getDeclaredMethod("set"
					+ Character.toUpperCase(fname.charAt(0))
					+ fname.substring(1), ftype);
			if (!Modifier.isPublic(method.getModifiers())) {
				method.setAccessible(true);
			}
			method.invoke(target, fvalue);

		} catch (Exception me) {
//			if (logger.isDebugEnabled()) {
//				logger.debug(me);
//			}
			try {
				Field field = clazz.getDeclaredField(fname);
				if (!Modifier.isPublic(field.getModifiers())) {
					field.setAccessible(true);
				}
				field.set(target, fvalue);
			} catch (Exception fe) {
				if (logger.isDebugEnabled()) {
					logger.debug(fe);
				}
			}
		}
	}

}
