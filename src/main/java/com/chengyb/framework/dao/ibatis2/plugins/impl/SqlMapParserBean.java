/**
 * 
 */
package com.chengyb.framework.dao.ibatis2.plugins.impl;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.chengyb.framework.dao.ibatis2.plugins.Column;
import com.chengyb.framework.dao.ibatis2.plugins.SqlMapParser;
import com.chengyb.framework.dao.ibatis2.plugins.Table;
import com.chengyb.framework.utils.FreeMarketUtils;

/**
 * 
 * <p>
 * Title: <b>SqlMapParserBean.java</b>
 * </p>
 * 
 * <p>
 * Description:
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
 * @date 2009-4-1
 * 
 */

public class SqlMapParserBean implements SqlMapParser {

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.chengyb.framework.plugins.ibatis.SqlMapParser#getClassAsStream
	 * (java.lang.Class) 自动生成对Table table的增删改查的sql语句，用FreeMarketUtils工具类
	 */
	public <T> String getClassAsString(Class<T> c) {
		Table table = getTable4Bean(c);
		FreeMarketUtils freeMarket = new FreeMarketUtils();
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("table", table);
		map.put("class", c);
		return freeMarket.writeString("/com/chengyb/framework/dao/ibatis2/plugins/impl/ibatis.oracle.ftl", map);
	}

	/**
	 * 获得Class<T> c所有相关表的信息
	 * 
	 * 
	 * 
	 * @param <T>
	 *            泛型
	 * @param c
	 *            Class<T>
	 * @return Table
	 */
	private <T> Table getTable4Bean(Class<T> c) {
		javax.persistence.Table table = c.getAnnotation(javax.persistence.Table.class);
		// 设置表信息
		Table itable = new Table();
		itable.setName(table.name());

		itable.setEntity(c);
		String packageName = c.getPackage().getName();
		itable.setNamespace(packageName.substring(0, packageName.lastIndexOf(".valueobject")));
		itable.setAlias(c.getSimpleName().toLowerCase());

		ArrayList<Column> columns = new ArrayList<Column>();

		Method[] methods = c.getDeclaredMethods();

		for (Method method : methods) {
			Id id = method.getAnnotation(Id.class);
			OneToOne one2one = method.getAnnotation(OneToOne.class);
			OneToMany one2many = method.getAnnotation(OneToMany.class);
			javax.persistence.Column _column = method.getAnnotation(javax.persistence.Column.class);
			if (_column == null) {
				continue;
			}
			if (id != null) {
				String pkName = method.getName().substring(3, method.getName().length());
				String returnType = method.getReturnType().getName();
				// 设置主键
				Column pk = new Column();
				pk.setNick(pkName.toLowerCase());
				pk.setName(pk.getNick());
				pk.setType(returnType);
				
				GeneratedValue generatedValue = method.getAnnotation(GeneratedValue.class);
				
				javax.persistence.Column v_c=method.getAnnotation(javax.persistence.Column.class);
				
				if(v_c!=null && !"".equals(v_c.name())){
					pk.setName(v_c.name());
				}
				if (generatedValue != null) {
					pk.setGeneratedValue("true");
					String seq = generatedValue.generator();

					if (seq != null && !"".equals(seq)) {
						pk.setSeq(seq);
					}
				} else {
					pk.setGeneratedValue("false");
				}
				itable.setPk(pk);

			} else if (one2one != null) {

			} else if (one2many != null) {

			} else {
				String methodName = method.getName();
				if (methodName.startsWith("get") && 0 == method.getParameterTypes().length) {
					// 设置列
					String returnType = method.getReturnType().getName();
					String args = "java.lang.String|java.util.Date|java.sql.Date|java.lang.Double|java.lang.Long|java.lang.Integer|java.lang.Float|java.math.BigInteger|java.math.BigDecimal|int|long|float|double";
					if (returnType.matches(args)) {
						Column column = new Column();
						
						column.setNick(methodName.substring(3, methodName.length()).toLowerCase());
						column.setName(column.getNick());
						javax.persistence.Column v_c=method.getAnnotation(javax.persistence.Column.class);
						if(v_c!=null && !"".equals(v_c.name())){
							column.setName(v_c.name());
						}
						column.setType(returnType);
						columns.add(column);
					}
				}
			}

		}

		itable.setColumn(columns.toArray(new Column[0]));
		return itable;
	}
}
