package com.chengyb.framework.dao;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.CascadeType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;


@SuppressWarnings({"unchecked","rawtypes"})
public class AnnotationDaoUtil {

	private Object id = null;

	private String column = null;

	private Object obj = null;

	private List oneToOne = new ArrayList();

	private Map<String, List> oneToOneMap = new HashMap<String, List>();

	private List<List> oneToMany = new ArrayList();

	private Map<String, List> oneToManyMap = new HashMap<String, List>();

	private List<String> oneToManyClassNames = new ArrayList();

	private List<String> oneToOneClassNames = new ArrayList();

	private List<String> oneToManyClassName = new ArrayList();

	public AnnotationDaoUtil(Object obj) {
		this.obj = obj;
		try {
			init(this.obj);
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 对Object obj进行分析整理成需要的数据 id 获得主键的值 column 主键所对应的列名 oneToOneClassNames
	 * 对应oneToOne所在类的calssname 和List oneToOne一一对应 oneToManyClassNames
	 * 对应oneToMany所在类的calssname 和List<List> oneToMany一一对应
	 * 
	 * @param obj
	 *            Object
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	private void init(Object obj) throws IllegalArgumentException, IllegalAccessException, InvocationTargetException {
		Id pk_id = null;
		Method[] methods = obj.getClass().getDeclaredMethods();
		String objname = obj.getClass().getName();
		int pos = objname.lastIndexOf(".");
		String packagename = objname.substring(0, pos);
		for (Method method : methods) {
			pk_id = method.getAnnotation(Id.class);
			OneToOne one2one = method.getAnnotation(OneToOne.class);
			OneToMany one2many = method.getAnnotation(OneToMany.class);

			Object[] args_ = null;
			if (pk_id != null) {
				try {
					this.id = method.invoke(obj, args_);
					column = method.getName().substring(3, method.getName().length());
				} catch (IllegalArgumentException e) {
				} catch (IllegalAccessException e) {
				} catch (InvocationTargetException e) {
				}
			} else if (one2one != null) {

				oneToOneClassNames.add(packagename + "." + method.getName().substring(3));
				Object value = method.invoke(obj, args_);
				if (value != null) {
					oneToOne.add(value);
					putOneToOne(one2one.cascade(), value);
				}
			}
			if (one2many != null) {
				Object value = method.invoke(obj, args_);
				if (value != null) {
					if (value instanceof List) {
						List obj_l = (List) value;
						oneToMany.addAll(obj_l);
						for (int i = 0; i < obj_l.size(); i++) {
							oneToManyClassNames.add(packagename + "." + method.getName().substring(3));
						}
					}
					putOneToMany(one2many.cascade(), value);
				}
				oneToManyClassName.add(packagename + "." + method.getName().substring(3));
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

	private void putOneToOne(CascadeType[] cas, Object value) {
		if (null == cas) {
			return;
		}
		if (isCascadeType(CascadeType.ALL, cas)) {
			putMap(oneToOneMap, CascadeType.MERGE.toString(), value);
			putMap(oneToOneMap, CascadeType.PERSIST.toString(), value);
			putMap(oneToOneMap, CascadeType.REFRESH.toString(), value);
			putMap(oneToOneMap, CascadeType.REMOVE.toString(), value);
			return;
		} else {
			for (CascadeType c : cas) {
				putMap(oneToOneMap, c.toString(), value);
			}

		}
	}

	private void putOneToMany(CascadeType[] cas, Object value) {
		if (null == cas) {
			return;
		}
		if (isCascadeType(CascadeType.ALL, cas)) {
			putMap(oneToManyMap, CascadeType.MERGE.toString(), value);
			putMap(oneToManyMap, CascadeType.PERSIST.toString(), value);
			putMap(oneToManyMap, CascadeType.REFRESH.toString(), value);
			putMap(oneToManyMap, CascadeType.REMOVE.toString(), value);
			return;
		} else {
			for (CascadeType c : cas) {
				putMap(oneToOneMap, c.toString(), value);
			}

		}
	}

	/**
	 * 将主键的值赋予明细表对应的字段的值
	 * @param one2one Object
	 * @param id Object
	 */
	public void setFk4oneToOne(Object one2one, Object id) {
		try {
			Method method = one2one.getClass().getMethod("set" + column, id.getClass());
			method.invoke(one2one, id);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private void putMap(Map<String, List> map, String key, Object obj) {
		List _list = map.get(key);
		if (null == _list) {
			_list = new ArrayList();
		}
		if (obj instanceof List) {
			List obj_l = (List) obj;
			_list.addAll(obj_l);
		} else {
			_list.add(obj);
		}
		map.put(key, _list);

	}

	public Object getId() {
		return id;
	}

	public List getOneToOne(CascadeType cascade) {
		if (CascadeType.ALL.equals(cascade)) {
			return oneToOne;
		} else {
			return oneToOneMap.get(cascade.toString());

		}
	}

	public List<List> getOneToMany(CascadeType cascade) {
		if (CascadeType.ALL.equals(cascade)) {
			return oneToMany;
		} else {
			return oneToManyMap.get(cascade.toString());

		}
	}

	public List<String> getOneToManyClassnames() {
		return oneToManyClassNames;
	}

	public List<String> getOneToOneClassnames() {
		return oneToOneClassNames;
	}

	public String getColumn() {
		return column;
	}

	public List<String> getOneToManyClassName() {
		return oneToManyClassName;
	}

	public void setOneToManyClassName(List<String> oneToManyClassName) {
		this.oneToManyClassName = oneToManyClassName;
	}
}
