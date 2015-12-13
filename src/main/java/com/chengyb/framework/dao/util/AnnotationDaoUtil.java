package com.chengyb.framework.dao.util;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.CascadeType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

/**
 * 
 * 
 * <p>
 * Title: <b>AnnotationDaoUtil.java</b>
 * </p>
 * 
 * <p>
 * Description: 分析VO注解工具类，配合完成及联insert and update 的功能
 * 
 * CascadeType.PERSIST（级联新建）、CascadeType.REMOVE（级联删除)
 * CascadeType.REFRESH（级联刷新）、CascadeType.MERGE（级联更新）
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
@SuppressWarnings( { "unchecked", "unused" ,"rawtypes"})
public class AnnotationDaoUtil<T> {
	/**
	 * 所有 CascadeType 类型的 oneToOne 对象
	 */
	private Map<CascadeType, List<Object>> oneToOneMap = new HashMap<CascadeType, List<Object>>();
	/**
	 * 所有 CascadeType 类型的 oneToMany 对象
	 */
	private Map<CascadeType, List<Object>> oneToManyMap = new HashMap<CascadeType, List<Object>>();
	/**
	 * 构造函数中传入的要分析的对象
	 */
	private T t;
	/**
	 * 主键列
	 */
	private String pkColumn;

	/**
	 * 构造函数
	 * 
	 * @param t
	 *            T
	 */
	public AnnotationDaoUtil(T t) {
		this.t = t;
		try {
			init(t);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 分析Object 对象 获取其中的 oneToOne oneToMany 主键 关系
	 * 
	 * @param t
	 *            T
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	private void init(T t) throws IllegalArgumentException, IllegalAccessException, InvocationTargetException {
		Method[] methods = t.getClass().getMethods();
		for (Method method : methods) {
			OneToOne _one2one = method.getAnnotation(OneToOne.class);
			OneToMany _one2many = method.getAnnotation(OneToMany.class);
			Object[] args_ = new Object[0];
			Id id = method.getAnnotation(Id.class);
			if (id != null) {
				pkColumn = method.getName().substring(3, method.getName().length());
			}

			if (_one2one != null) {
				Object _value = method.invoke(t, args_);
				if (_value != null) {
					putOneToOne(_one2one.cascade(), _value);// 存入oneToOne
															// Map中的是对象的值
				}
			} else if (_one2many != null) {
				Object _value = method.invoke(t, args_);
				if (_value != null) {
					List obj_l = null;
					if (_value instanceof List) {
						obj_l = (List) _value;
					} else {
						obj_l = Arrays.asList(_value);
					}
					putOneToMany(_one2many.cascade(), _value);// 存入oneToMany
																// Map中的是对象的值
																// 而且是 是把明细List
																// 拆开存
				}
			}
		}
	}

	// 存入oneToOne
	private void putOneToOne(CascadeType[] cas, Object value) {
		if (null == cas) {
			return;
		}
		if (isCascadeType(CascadeType.ALL, cas)) {
			putMapOneToOne(oneToOneMap, CascadeType.MERGE, value);
			putMapOneToOne(oneToOneMap, CascadeType.PERSIST, value);
			putMapOneToOne(oneToOneMap, CascadeType.REFRESH, value);
			putMapOneToOne(oneToOneMap, CascadeType.REMOVE, value);
			return;
		} else {
			for (CascadeType c : cas) {
				putMapOneToOne(oneToOneMap, c, value);
			}

		}
	}

	// 存入oneToMany
	private void putOneToMany(CascadeType[] cas, Object value) {
		if (null == cas) {
			return;
		}
		if (isCascadeType(CascadeType.ALL, cas)) {
			putMapOneToMany(oneToManyMap, CascadeType.MERGE, value);
			putMapOneToMany(oneToManyMap, CascadeType.PERSIST, value);
			putMapOneToMany(oneToManyMap, CascadeType.REFRESH, value);
			putMapOneToMany(oneToManyMap, CascadeType.REMOVE, value);
			return;
		} else {
			for (CascadeType c : cas) {
				putMapOneToMany(oneToOneMap, c, value);
			}

		}
	}

	private boolean isCascadeType(CascadeType cascade, CascadeType[] cas) {

		for (CascadeType c : cas) {
			if (cascade.equals(c)) {
				return true;
			}
		}
		return false;
	}
	/**
	 * CascadeType 作为 key 把Object 存入 Map 中 
	 * @param map Map<CascadeType, List<Object>>
	 * @param key CascadeType
	 * @param obj Object
	 */
	private void putMapOneToOne(Map<CascadeType, List<Object>> map, CascadeType key, Object obj) {
		if (null == obj) {
			return;
		}
		List _list = map.get(key);

		if (null == _list) {
			_list = new ArrayList();
		}
		_list.add(obj);
		map.put(key, _list);

	}
	/**
	 * CascadeType 作为 key 把Object 存入 Map 中 
	 * 如果Object 是list or object[] 拆开存放
	 * @param map Map<CascadeType, List<Object>>
	 * @param key CascadeType
	 * @param obj Object
	 */
	private void putMapOneToMany(Map<CascadeType, List<Object>> map, CascadeType key, Object obj) {
		if (null == obj) {
			return;
		}
		List _list = map.get(key);

		if (null == _list) {
			_list = new ArrayList();
		}
		List obj_l = null;
		if (obj instanceof List) {
			obj_l = (List) obj;

		} else {
			obj_l = Arrays.asList(obj);
		}
		_list.addAll(obj_l);
		map.put(key, _list);

	}

	public List oneToOne(CascadeType cascade) {
		List list = new ArrayList();

		if (oneToOneMap == null || oneToOneMap.isEmpty()) {
			return null;
		}

		List _list = oneToOneMap.get(cascade);

		if (_list != null) {
			list.addAll(_list);
		}
		return list;

	}

	public List oneToMany(CascadeType cascade) {
		List list = new ArrayList();
		if (oneToManyMap == null || oneToManyMap.isEmpty()) {
			return null;
		}
		List _list = oneToManyMap.get(cascade);
		if (_list != null) {
			list.addAll(_list);
		}
		return list;

	}
	
	public static String INSERT = "insert";
	public static String UPDATE = "update";
	public static String DELETE = "delete";
	public static String SELECT = "select";

	/**
	 * 获取系统自动生成的ibatis 方法 的 id
	 * @param _class VO的className
	 * @param prefix 操作符 CREATE UPDATE DELETE SELECT
	 * @return ibatisId
	 */
	public static <T> String getIbatisId(Class<T> _class, String prefix) {
		return _class.getPackage().getName().replaceAll("valueobject", prefix) + _class.getSimpleName();
	}

	/**
	 * 将主键的值赋予明细表对应的字段的值
	 * 
	 * @param one2one
	 *            Object
	 * @param id
	 *            Object
	 */
	public static void setFkValue(Object obj, String pkColumn, Object id) {
		try {
			Method method = obj.getClass().getMethod("set" + pkColumn, id.getClass());
			method.invoke(obj, id);
		} catch (Exception e) {
		}

	}

	public String getPkColumn() {
		return pkColumn;
	}

}
