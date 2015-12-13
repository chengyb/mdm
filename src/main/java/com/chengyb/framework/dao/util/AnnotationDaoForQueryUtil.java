package com.chengyb.framework.dao.util;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

/**
 * 
 * 
 * <p>
 * Title: <b>AnnotationDaoForQueryUtil 分析VO注解工具类</b>
 * </p>
 * 
 * <p>
 * Description: 分析VO注解工具类，配合完成及联查询的功能
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
 * @date 2009-5-12
 */

public class AnnotationDaoForQueryUtil<T> {
	/**
	 * 主键列
	 */
	private String pkColumn;
	/**
	 * 主键值
	 */
	private Object pkValue;
	/**
	 * oneToOne Method CascadeType.REFRESH and CascadeType.ALL
	 */
	private List<Method> oneToOne = new ArrayList<Method>();
	/**
	 * oneToMany Method CascadeType.REFRESH and CascadeType.ALL
	 */
	private List<Method> oneToMany = new ArrayList<Method>();

	/**
	 * 传入 Object 对象
	 * 
	 * @param t
	 */
	public AnnotationDaoForQueryUtil(T t) {
		try {
			init(t);
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 分析Object 对象 获取其中的 oneToOne oneToMany 主键 关系
	 * 
	 * @param t
	 *            Object 对象
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	private void init(T t) throws IllegalArgumentException, IllegalAccessException, InvocationTargetException {
		Method[] methods = t.getClass().getMethods();
		for (Method method : methods) {
			OneToOne _one2one = method.getAnnotation(OneToOne.class);
			OneToMany _one2many = method.getAnnotation(OneToMany.class);
			Id id = method.getAnnotation(Id.class);
			if (id != null) {
				pkColumn = method.getName().substring(3, method.getName().length());
				pkValue = method.invoke(t, new Object[0]);
			}
			if (_one2one != null) {
				if (isInCascadeType(_one2one.cascade(), CascadeType.REFRESH)) {
					oneToOne.add(method);
				}
			} else if (_one2many != null) {
				if (isInCascadeType(_one2many.cascade(), CascadeType.REFRESH)) {
					oneToMany.add(method);
				}
			}

		}
	}

	/**
	 * 判断及联的类别
	 * 
	 * @param cas
	 *            CascadeType[]
	 * @param target
	 *            CascadeType
	 * @return
	 */
	private boolean isInCascadeType(CascadeType[] cas, CascadeType target) {

		for (CascadeType c : cas) {
			if (CascadeType.ALL.equals(c) || target.equals(c)) {
				return true;
			}
		}
		return false;

	}

	/**
	 * 获取需要级联查询的方法 OneToOne
	 * 
	 * @return List<Method>
	 */
	public List<Method> getOneToOne() {
		return oneToOne;
	}

	/**
	 * 获取需要级联查询的方法 oneToMane
	 * 
	 * @return List<Method>
	 */
	public List<Method> getOneToMany() {
		return oneToMany;
	}

	/**
	 * 获取主键列
	 * 
	 * @return String
	 */
	public String getPkColumn() {
		return pkColumn;
	}

	/**
	 * 获取主键值
	 * 
	 * @return Object
	 */
	public Object getPkValue() {
		return pkValue;
	}

	// /////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * 根据 类型 new 新的实例
	 * 
	 * @param _type
	 *            Type
	 * @return
	 */

	
	@SuppressWarnings("rawtypes")
	public static Object newInstance(Type _type) {
		Object obj = null;

		if (_type instanceof ParameterizedType) {
			ParameterizedType tp = (ParameterizedType) _type;
			_type = tp.getActualTypeArguments()[0];// 取出泛型
		}
		Class _class = (Class) _type;
		try {
			obj = _class.newInstance();
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}
		return obj;
	}

	/**
	 * 设置关联的外键的值
	 * 
	 * @param get
	 *            Method 父对象中 主建get方法
	 * @param obj
	 *            String 主
	 * @param value
	 *            Object 父对象主键值 本对象外键值
	 */
	public static void setFkValue(Object obj, String pkColumn, Object id) {
		try {
			Method method = obj.getClass().getMethod("set" + pkColumn, id.getClass());
			method.invoke(obj, id);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	/**
	 * 设置关联的外键的值
	 * 
	 * @param get
	 *            Method 父对象中 主建get方法
	 * @param obj
	 *            Object 需要设置外键的对象
	 * @param value
	 *            Object 父对象主键值 本对象外键值
	 */
	@SuppressWarnings("rawtypes")
	public static void setFkValue(Method get, Object obj, Object value) {
		try {
			Class _class = value.getClass();
			if (value instanceof java.util.List) {
				_class = java.util.List.class;
			}

			Method set = obj.getClass().getMethod(get.getName().replaceFirst("get", "set"), _class);
			set.invoke(obj, value);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
}
