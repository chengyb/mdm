package com.chengyb.framework.dao.ibatis2;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.chengyb.framework.bean.SplitPage;
import com.chengyb.framework.bean.VCommList;
/**
 * 
 * 
 * <p>
 * Title: <b>Dialect Ibatis 扩展出简单业务操作类</b>
 * </p>
 * 
 * <p>
 * Description: Ibatis 扩展出简单业务操作类
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
@SuppressWarnings("unchecked")
public class SimpleDaoSupport extends BaseIbatisDaoSupport {

	/*
	 * private String getIbaitsId (Object obj,String type){ String ibaitsId =
	 * ""; ibaitsId = NameUtils.valueObjectToIbatisId(obj.getClass().getName(),
	 * type); return ibaitsId; }
	 */

	/**
	 * 执行insert操作
	 */
	public Object insert(Object obj, String ibaitsId) {
		return this.getClientTemplate().insert(ibaitsId, obj);
	}

	/*
	 * public Object insert(Object obj) { AnnotationDaoUtil a = new
	 * AnnotationDaoUtil(obj); Object pk = a.getId(); String ibaitsId =
	 * this.getIbaitsId(obj, "insert_"); Object pk2 =
	 * this.getSqlMapClientTemplate().insert(ibaitsId, obj); if(pk == null){ pk =
	 * pk2; } return pk; }
	 */
	/**
	 * 执行update操作
	 */
	public int update(Object obj, String ibaitsId) {
		return this.getClientTemplate().update(ibaitsId, obj);
	}

	/**
	 * 执行delete操作
	 */
	public int delete(Object obj, String ibaitsId) {
		return this.getClientTemplate().delete(ibaitsId, obj);
	}

	/**
	 * 执行queryForObject 查询单挑记录操作
	 */
	public Object find(Object obj, String ibaitsId) {
		return this.getClientTemplate().queryForObject(ibaitsId, obj);
	}

	/**
	 * 执行多条insert操作
	 */
	public List<Object> insert(List<Object> list, String ibaitsId) {
		if (list == null || list.size() == 0) {
			return null;
		}
		ArrayList<Object> re_list = new ArrayList<Object>();

		for (int i = 0, n = list.size(); i < n; i++) {
			Object obj = list.get(i);
			Object re_obj = this.getClientTemplate().insert(ibaitsId, obj);
			re_list.add(re_obj);
		}
		return re_list;
	}

	/**
	 * 执行多条update操作
	 */
	public List<Object> update(List<Object> list, String ibaitsId) {
		if (list == null || list.size() == 0) {
			return null;
		}
		ArrayList<Object> re_list = new ArrayList<Object>();

		for (int i = 0, n = list.size(); i < n; i++) {
			Object obj = list.get(i);
			Object re_obj = this.getClientTemplate().update(ibaitsId, obj);
			re_list.add(re_obj);
		}
		return re_list;
	}

	/**
	 * 执行多条delete操作
	 */
	public List<Object> delete(List<Object> list, String ibaitsId) {
		if (list == null || list.size() == 0) {
			return null;
		}
		ArrayList<Object> re_list = new ArrayList<Object>();
		for (int i = 0, n = list.size(); i < n; i++) {
			Object obj = list.get(i);
			Object re_obj = this.getClientTemplate().delete(ibaitsId, obj);
			re_list.add(re_obj);
		}
		return re_list;
	}

	/**
	 * 执行多条数据查询操作,返回VCommList
	 */
	public VCommList<Object> queryForVCommList(String className, Map<String, String> cond, SplitPage spage) {
		return this.getClientTemplate().queryForVCommList(className, cond);
	}

}
