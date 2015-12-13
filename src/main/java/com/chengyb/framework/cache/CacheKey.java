package com.chengyb.framework.cache;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.JoinPoint;

import com.chengyb.framework.utils.BeanUtils;
import com.chengyb.framework.utils.StringUtils;

public class CacheKey {

	private CacheKey() {
	}
	private static Log logger = LogFactory.getLog(CacheKey.class);
	public static <T> String getKey(JoinPoint joinPoint) {

		String prefix = joinPoint.getSignature().toLongString();
		String cacheKey = getKeyValue(joinPoint.getArgs());
		return cacheKey == null ? null : prefix + "!" + cacheKey;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static <T> String getKeyValue(T t) {
		if (null == t) {
			return null;
		}

		if (t instanceof HashMap) {
			return getKey4HashMap((HashMap<?, ?>) t);
		} else if (t instanceof Map) {
			HashMap<?, ?> hashMap = new HashMap();
			hashMap.putAll((Map) t);
			return getKey4HashMap(hashMap);
		} else if (t instanceof Collection) {
			logger.debug("class is Collection");
			return null;
		} else if (t instanceof Object[]) {
			logger.debug("class is Object[]");
			return null;
		} else {
			// 基本类型
			if (BeanUtils.isBaseType(t)) {
				return StringUtils.toString(t);
			} else {
				try {
					HashMap hashMap = BeanUtils.convertBean(t);
					return getKey4HashMap(hashMap);
				} catch (Exception e) {
					logger.debug("class convertBean to Map  error");
				}
			}
		}

		return null;
	}

	private static String getKey4HashMap(HashMap<?, ?> hashMap) {
		if (hashMap.isEmpty()) {
			return null;
		}
		return hashMap.toString();
	}

	private static <T> String getKeyValue(T[] t) {
		String cacheKeys = null;
		for (T t1 : t) {
			String cacheKey = getKeyValue(t1);
			if (null == cacheKey) {
				return null;
			}
			cacheKeys = cacheKeys==null ? cacheKey : cacheKeys+"!" + cacheKey;
		}

		return cacheKeys;
	}

}
