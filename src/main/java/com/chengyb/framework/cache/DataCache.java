package com.chengyb.framework.cache;

import java.util.HashMap;
import java.util.Map;

/**
 * 数据缓存类，放到spring的拦截器(Interceptor)之中
 * 
 * @author zhaolei
 * 
 */
public class DataCache {
	public final Map<String, Object> map = new HashMap<String, Object>(); // Cache
																			// table

	/**
	 * 是否开启线程
	 */
	private boolean openCache = false;

	/* 保证该实例在当前线程中，与其他线程互不影响 */
	protected static ThreadLocal<DataCache> instance = new ThreadLocal<DataCache>();

	public static DataCache getInstance() {
		if (instance.get() == null) {
			instance.set(new DataCache());
		}
		return instance.get();
	}

	private DataCache() {
	} // 防止在外部实例化

	public <T> String getKey(T t) {
		return CacheKey.getKeyValue(t);
	}

	/**
	 * 获取缓存
	 */
	public Object getData(String key) {
		return map.get(key);
	}

	public Map<String, Object> getMapAll() {
		return map;
	}

	public boolean containsKey(String key) {
		return map.containsKey(key);
	}

	/**
	 * 放入缓存中
	 */
	public Object putData(String key, Object value) {
		if (!isEmpty(value)) {
			map.put(key, value);
		}
		return value;
	}

	public Object getData(String key, CacheHandler handler) {
		Object value = null;
		if (this.containsKey(key)) {
			return map.get(key);
		} else {
			value = handler.execute();
			if (!isEmpty(value)) {
				map.put(key, value);
			}
			return value;
		}

	}

	private boolean isEmpty(Object value) {
		if (value == null) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 清空所有缓存
	 */
	public void cleanCache() {
		this.openCache = false;
		for (String key : map.keySet()) {
			@SuppressWarnings("unused")
			Object o = map.get(key);
			o = null;
		}
		map.clear();
	}

	public void cleanCache(Object key) {
		map.remove(key);
	}

	public void copyCache(DataCache source) {//相当于浅层克隆
		map.putAll(source.getMapAll());
	}

	public boolean isOpenCache() {
		return openCache;
	}

	public void openCache() {
		this.openCache = true;
	}
}
