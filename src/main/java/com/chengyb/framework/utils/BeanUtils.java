package com.chengyb.framework.utils;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

@SuppressWarnings("rawtypes")
public class BeanUtils {
	private static Log logger = LogFactory.getLog(BeanUtils.class);

	/**
	 * 将Object provide对象的值赋予Object accept对象（对象里具有相同属性名）
	 * 
	 * 
	 * @param provide
	 *            Object
	 * @param accept
	 *            Object
	 */
	public static void copyProperties(Object provide, Object accept) {
		if (provide == null || accept == null)
			return;
		Method[] mProvide = provide.getClass().getMethods();
		Method[] mAccept = accept.getClass().getMethods();
		for (int i = 0; i < mProvide.length; i++) {
			String mProvideName = mProvide[i].getName();
			if ("get".equals(mProvideName.substring(0, 3)) || "is".equals(mProvideName.subSequence(0, 2))) {

				String tempProvidePropertie = null;
				if ("get".equals(mProvideName.substring(0, 3))) {
					tempProvidePropertie = mProvideName.substring(3, mProvideName.length()).toUpperCase();
				}
				if ("is".equals(mProvideName.substring(0, 2))) {
					tempProvidePropertie = mProvideName.substring(2, mProvideName.length()).toUpperCase();
				}

				for (int j = 0; j < mAccept.length; j++) {
					String mAcceptName = mAccept[j].getName();
					if ("set".equals(mAcceptName.substring(0, 3))) {
						String tempAcceptPropertie = mAcceptName.substring(3, mAcceptName.length()).toUpperCase();

						if (tempAcceptPropertie.equals(tempProvidePropertie)) {
							try {
								Object[] args = null;
								Object tempValue = mProvide[i].invoke(provide, args);
								Class cls = mAccept[j].getParameterTypes()[0];
								if (tempValue == null) {
									break;
								}
								Object val = infoEncode(tempValue, cls);
								Object[] temp = { val };

								mAccept[j].invoke(accept, temp);
							} catch (InvocationTargetException ex) {
							} catch (IllegalArgumentException ex) {
							} catch (IllegalAccessException ex) {
							}
							break;
						}
					}
				}
			}
		}
	}

	/**
	 * 将查询结果ResultSet rs对象的值赋予Object accept对象（对象里具有相同属性名）
	 * 
	 * @param rs
	 *            ResultSet
	 * @param accept
	 *            Object
	 */
	public static void copyProperties(ResultSet rs, Object accept) {
		if (rs == null || accept == null)
			return;
		Method[] mAccept = accept.getClass().getMethods();

		try {
			ResultSetMetaData rsmd = rs.getMetaData();
			for (int i = 1; i <= rsmd.getColumnCount(); i++) {
				String columnName = rsmd.getColumnName(i).toUpperCase();
				for (int j = 0; j < mAccept.length; j++) {
					Method tMethod = mAccept[j];
					String mName = tMethod.getName();
					String pName = mName.substring(3, mName.length()).toUpperCase();

					if (tMethod.getName().startsWith("set") && columnName.equals(pName)) {
						Class cls = tMethod.getParameterTypes()[0];
						String par = cls.getName();
						try {
							if (par.equals("java.lang.String")) {
								String tmpValue = rs.getString(columnName);
								Object[] tmp = { tmpValue };
								tMethod.invoke(accept, tmp);
							}
							if (par.equals("java.lang.Integer")) {
								Integer tmpValue = new Integer(rs.getInt(columnName));
								Object[] tmp = { tmpValue };
								tMethod.invoke(accept, tmp);
							}
							if (par.equals("java.lang.Long")) {
								Long tmpValue = new Long(rs.getLong(columnName));
								Object[] tmp = { tmpValue };
								tMethod.invoke(accept, tmp);
							}
							if (par.equals("java.sql.Date")) {
								Date tmpValue = rs.getDate(columnName);
								Object[] tmp = { tmpValue };
								tMethod.invoke(accept, tmp);
							}
							if (par.equals("java.util.Date")) {
								Date tmpValue = rs.getDate(columnName);
								Object[] tmp = { tmpValue };
								tMethod.invoke(accept, tmp);
							}

							if (par.equals("java.sql.Timestamp")) {
								Timestamp tmpValue = rs.getTimestamp(columnName);
								Object[] tmp = { tmpValue };
								tMethod.invoke(accept, tmp);
							}
							if (par.equals("java.lang.Double")) {
								Double tmpValue = new Double(rs.getDouble(columnName));
								Object[] tmp = { tmpValue };
								tMethod.invoke(accept, tmp);
							}
							if (par.equals("java.lang.Float")) {
								Float tmpValue = new Float(rs.getFloat(columnName));
								Object[] tmp = { tmpValue };
								tMethod.invoke(accept, tmp);
							}
							if (par.equals("double")) {
								Double tmpValue = new Double(rs.getDouble(columnName));
								Object[] tmp = { tmpValue };
								tMethod.invoke(accept, tmp);
							}
							if (par.equals("int")) {
								Integer tmpValue = new Integer(rs.getInt(columnName));
								Object[] tmp = { tmpValue };
								tMethod.invoke(accept, tmp);
							}
							if (par.equals("float")) {

								Float tmpValue =

								new Float(rs.getFloat(columnName));

								Object[] tmp = { tmpValue };
								tMethod.invoke(accept, tmp);
							}
						} catch (InvocationTargetException ex) {
						} catch (IllegalArgumentException ex) {
						} catch (IllegalAccessException ex) {
						}
						break;
					}
				}
			}
		} catch (SQLException ex) {
		}

	}

	public static void setProperties(Object accept, Object data, String property) {
		Method[] mm = accept.getClass().getMethods();
		for (int i = 0; i < mm.length; i++) {
			if (mm[i].getName().toUpperCase().equals("SET" + property.toUpperCase())) {
				Method cm = mm[i];
				Class[] acls = cm.getParameterTypes();
				if (acls.length != 1) {
					continue;
				}
				Class cls = acls[0];
				Object val = infoEncode(data, cls);
				Object[] args = { val };
				try {
					cm.invoke(accept, args);
				} catch (IllegalAccessException ex) {
				} catch (IllegalArgumentException ex) {
				} catch (InvocationTargetException ex) {
				}
				break;
			}
		}
	}

	public static void setProperties_alias(Object accept, Object data, String property) {
		Method[] mm = accept.getClass().getMethods();
		for (int i = 0; i < mm.length; i++) {
			if (mm[i].getName().toUpperCase().equals("SET" + property.toUpperCase())) {
				Method cm = mm[i];
				Class[] acls = cm.getParameterTypes();
				if (acls.length != 1) {
					continue;
				}
				Class cls = acls[0];
				Object val = infoEncode_alias(data, cls);
				Object[] args = { val };
				try {
					cm.invoke(accept, args);
				} catch (IllegalAccessException ex) {
				} catch (IllegalArgumentException ex) {
				} catch (InvocationTargetException ex) {
				}
				break;
			}
		}
	}

	public static Object getProperties(Object provide, String property) {
		Object tempValue = null;
		Method[] mm = provide.getClass().getMethods();
		for (int i = 0; i < mm.length; i++) {
			if (mm[i].getName().toUpperCase().equals("GET" + property.toUpperCase())) {

				Method cm = mm[i];

				try {
					Object[] args = null;
					tempValue = cm.invoke(provide, args);
				} catch (IllegalAccessException ex) {
				} catch (IllegalArgumentException ex) {
				} catch (InvocationTargetException ex) {
				}
				break;
			}
		}
		return tempValue;
	}

	/**
	 * 将Object obj转换成需要的Class类型
	 */
	public static Object infoEncode(Object obj, Class cls) {
		String pVal = StringUtils.toString(obj);
		return infoEncode(pVal, cls);
	}

	/**
	 * 将Object obj转换成需要的Class类型
	 */
	public static Object infoEncode_alias(Object obj, Class cls) {
		String pVal = StringUtils.toString_alias(obj);
		return infoEncode(pVal, cls);
	}

	private static Object infoEncode(String mProviderValue, Class cls) {
		String className = cls.getName();
		if (className.equals("java.lang.String")) {
			return ObjectUtils.getString(mProviderValue);
		}
		if (className.equals("java.lang.Integer")) {
			return ObjectUtils.getInteger(mProviderValue);
		}
		if (className.equals("java.lang.Float")) {
			return ObjectUtils.getFloat(mProviderValue);
		}
		if (className.equals("java.lang.Long")) {
			return ObjectUtils.getLong(mProviderValue);
		}
		if (className.equals("java.lang.Double")) {
			return ObjectUtils.getDouble(mProviderValue);
		}
		if (className.equals("java.lang.Boolean")) {
			return ObjectUtils.getBoolean(mProviderValue);
		}
		if (className.equals("java.sql.Date")) {
			return ObjectUtils.getSqlDate(mProviderValue);
		}
		if (className.equals("java.util.Date")) {
			return ObjectUtils.getUtilDate(mProviderValue);
		}
		if (className.equals("java.sql.Timestamp")) {
			return ObjectUtils.getTimestamp(mProviderValue);
		}

		if (className.equals("double")) {
			return ObjectUtils.getDouble(mProviderValue);
		}
		if (className.equals("int")) {

			return ObjectUtils.getInteger(mProviderValue);
		}
		if (className.equals("float")) {
			return ObjectUtils.getFloat(mProviderValue);
		}
		if (className.equals("long")) {
			return ObjectUtils.getLong(mProviderValue);
		}
		if (className.equals("boolean")) {
			return ObjectUtils.getBoolean(mProviderValue);
		}

		return null;
	}
	


	/**
	 * 将查询结果ResultSet rs转换为HashMap
	 * 
	 * @param rs
	 *            ResultSet
	 * @return HashMap
	 */
	@SuppressWarnings("unchecked")
	public static HashMap rsultSetToHashMap(ResultSet rs) {
		HashMap map = new HashMap();
		try {
			ResultSetMetaData rsmd = rs.getMetaData();
			String colName = null;

			for (int i = 0; i < rsmd.getColumnCount(); i++) {
				colName = rsmd.getColumnName(i + 1);
				map.put(colName.toUpperCase(), rs.getString(colName));
			}
			return map;
		} catch (Exception ex) {
			return map;
		}
	}

	/**
	 * 将HttpServletRequest request请求的数据赋予具有相同属性的 Object 对象
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @param accept
	 *            Object
	 */

	public static void copyProperties(HttpServletRequest request, Object accept) {

		if (accept == null || request == null) {
			return;
		}

		Enumeration provide = request.getParameterNames();

		Method[] mAccept = accept.getClass().getMethods();
		while (provide.hasMoreElements()) {

			String mProvideName = (String) provide.nextElement();

			if (mProvideName != null) {
				String tempProvidePropertie = mProvideName.toUpperCase();

				for (int j = 0; j < mAccept.length; j++) {
					String mAcceptName = mAccept[j].getName();
					if (mAcceptName.substring(0, 3).equals("set")) {
						String tempAcceptPropertie = mAcceptName.substring(3, mAcceptName.length()).toUpperCase();
						if (tempAcceptPropertie.equals(tempProvidePropertie)) {

							try {

								Object tempValue = request.getParameter(mProvideName);

								Class cls = mAccept[j].getParameterTypes()[0];
								if (tempValue == null || cls.isPrimitive()) {
									break;
								}

								Object temp[] = { infoEncode((String) tempValue, cls) };
								mAccept[j].invoke(accept, temp);
							} catch (InvocationTargetException ex) {
							} catch (IllegalArgumentException ex) {
							} catch (IllegalAccessException ex) {
							}
							break;
						}
					}
				}
			}
		}

	}
	/**
	 * 判断 javaBean or Map 是否相等
	 * @param source
	 * @param target
	 * @return
	 */
	public static <T> boolean equalsValue(T source, T target) {

		if (source == null && target == null) {
			logger.debug("is all null");
			return true;
		}
		if (source == null && target != null) {
			logger.debug("source is null");
			return false;
		}
		if (source != null && target == null) {
			logger.debug("target is null");
			return false;
		}
		if (!source.getClass().equals(target.getClass())) {
			logger.debug("class is not equals");
			return false;
		}

		if (source instanceof Map) {
			return equalsValueMap((Map) source, (Map) target);
		} else if (source instanceof Collection) {
			logger.debug("class is Collection");
			return false;
		} else if (source instanceof Object[]) {
			logger.debug("class is Object[]");
			return false;
		} else {
			// 基本类型
			if (isBaseType(source)) {
				if (StringUtils.toString(source).equals(StringUtils.toString(target))) {
					return true;
				}
			} else {
				try {
					Map source1 = convertBean(source);
					Map target1 = convertBean(target);
					return equalsValueMap(source1, target1);
				} catch (Exception e) {
					logger.debug("class convertBean to Map  error");
				}
			}
		}
		return false;

	}
	
	private static boolean equalsValueMap(Map source, Map target){
		if(source.keySet().size() != target.keySet().size()){
			return false;
		}
		for(Object key:source.keySet()){
			if(!target.containsKey(key)){
				return false;
			}else{
				if(null == source.get(key) && null != target.get(key)){
					return false;
				}
				if(!source.get(key).equals(target.get(key))){
					return false;
				}
			}
		}
		
		return true;
	}
	/**
	 * 将info 转换成  map
	 * @param bean
	 * @return
	 * @throws IntrospectionException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@SuppressWarnings("unchecked" )
	public static HashMap convertBean(Object bean) throws IntrospectionException, IllegalAccessException, InvocationTargetException {
		Class type = bean.getClass();
		HashMap returnMap = new HashMap();
		BeanInfo beanInfo = Introspector.getBeanInfo(type);

		PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
		for (int i = 0; i < propertyDescriptors.length; i++) {
			PropertyDescriptor descriptor = propertyDescriptors[i];
			String propertyName = descriptor.getName();
			if (!propertyName.equals("class")) {
				Method readMethod = descriptor.getReadMethod();
				Object result = readMethod.invoke(bean, new Object[0]);
				if (result != null) {
					returnMap.put(propertyName, result);
				} else {
					returnMap.put(propertyName, "");
				}
			}
		}
		return returnMap;
	}
	/**
	 * map里的值copy到info中 tangcq2014年4月14日15:14:10
	 * @param bean
	 * @return
	 * @throws IntrospectionException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	public static void convertMap(Map provide, Object accept)  {
		Class type = accept.getClass();
		try {
			BeanInfo beanInfo = Introspector.getBeanInfo(type);
			PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
			Map<String, Class > PropertyMapping=new HashMap<String, Class>();
			for (int i = 0; i < propertyDescriptors.length; i++) {
				PropertyDescriptor descriptor = propertyDescriptors[i];
				PropertyMapping.put(descriptor.getName().toLowerCase(), descriptor.getPropertyType());
			}
			Method[] mProvide = accept.getClass().getMethods();
			for (int i = 0; i < mProvide.length; i++) {
				String mProvideName = mProvide[i].getName();
				if ("set".equals(mProvideName.substring(0, 3))) {
					String propertyName =mProvideName.substring(3).toLowerCase();
					if (provide.get(propertyName)!=null&&!"".equals(provide.get(propertyName).toString())) {
						Method setMethod=mProvide[i];
						Object value=BeanUtils.infoEncode(provide.get(propertyName), PropertyMapping.get(propertyName));
						Object[] temp = { value };
						setMethod.invoke(accept, temp);
					}
				} 
			}
		
		} catch (IntrospectionException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}

	}

	public static <T> boolean isBaseType(T t) {
		String[] a = { "java.lang.String", "java.lang.Integer", "java.lang.Float", "java.lang.Long", "java.lang.Double", "java.lang.Boolean", "java.sql.Date", "java.util.Date", "java.sql.Timestamp",
				"double", "int", "float", "long", "byte", "boolean" };
		String name = t.getClass().getName();
		for(String k:a){
			if(k.equals(name)){
				return true;
			}
		}
		return false;

	}
	
}
