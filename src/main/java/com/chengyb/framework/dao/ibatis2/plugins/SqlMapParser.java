package com.chengyb.framework.dao.ibatis2.plugins;

/**
 * ibatis 类序列化接口
 * @author sagitta
 *
 */
public interface SqlMapParser {
	/**
	 * 类序列化为String
	 * @param <T>
	 * @param T
	 * @return
	 */
	public <T> String getClassAsString(Class<T> T);
}
