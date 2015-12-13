package com.chengyb.core.utils;

import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.chengyb.framework.cache.DataCache;
import com.chengyb.framework.utils.SessionContext;
import com.chengyb.framework.utils.SpringContextUtils;
import com.chengyb.framework.utils.StringUtils;

/**
 * 
 * 
 * <p>
 * Title: <b>Session 工具类</b>
 * </p>
 * 
 * <p>
 * Description: 在session中存取 登陆用户信息
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
public class SessionUtils {

	private static final String LOGIN_USERID = "SWJ_LOGIN_USERID";
	private static final String LOGIN_USERCODE = "SWJ_LOGIN_USERCODE";
	private static final String LOGIN_USERDESC = "SWJ_LOGIN_USERDESC";
	private static final String LOGIN_USER = "SWJ_LOGIN_USER";
	private static final String LOGIN_DATE = "SWJ_LOGIN_DATE";
	private static final String LOGIN_CONSIGNUSERCODE = "SWJ_LOGIN_CONSIGNUSERCODE";
	private static final String LOGIN_CONSIGNUSERID = "SWJ_LOGIN_CONSIGNUSERID";
	private static final String LOGIN_CONSIGNUSERDESC = "SWJ_LOGIN_CONSIGNUSERDESC";
	public static final String LOGIN_CONSIGNFLAG = "SWJ_LOGIN_CONSIGNFLAG";

	private static final String LOGIN_SESSIONID = "SWJ_LOGIN_SESSIONID";
	private static final String LOGIN_LOCAL = "SWJ_LOGIN_LOCAL";

	private DataCache cache = DataCache.getInstance();

	// private HttpServletRequest request;
	public static String safeSessionId(String _sessionid) {
		if (_sessionid.indexOf("!") > 0) {
			String sessionid = _sessionid.split("!")[0];
			return sessionid;
		}
		return _sessionid;
	}

	public static String getSessionId(HttpSession session) {
		String _sessionid = session.getId();
		if (_sessionid.indexOf("!") > 0) {
			String sessionid = _sessionid.split("!")[0];
			return sessionid;
		}

		return _sessionid;
	}

	@SuppressWarnings({ "rawtypes" })
	public void init(HttpServletRequest request) {
		if (request == null)
			return;
		HttpSession session = request.getSession();

		// if(cache.containsKey(LOGIN_SESSIONID) &&
		// !"".equals(StringUtils.toString(cache.getData(LOGIN_SESSIONID)))){
		// return;
		// }

		cache.putData(LOGIN_SESSIONID, SessionUtils.safeSessionId(session.getId()));
		cache.putData(LOGIN_LOCAL, session.getAttribute("locale"));
		cleanCahceAll();
		Enumeration attributeNames = session.getAttributeNames();
		while (attributeNames.hasMoreElements()) {
			Object key = attributeNames.nextElement();
			cache.putData(StringUtils.toString(key), session.getAttribute(StringUtils.toString(key)));
		}
	}

	private void cleanCahceAll() {
		cache.cleanCache(LOGIN_USERID);
		cache.cleanCache(LOGIN_USERCODE);
		cache.cleanCache(LOGIN_USERDESC);
		cache.cleanCache(LOGIN_DATE);
		cache.cleanCache(LOGIN_CONSIGNUSERCODE);
		cache.cleanCache(LOGIN_CONSIGNUSERID);
		cache.cleanCache(LOGIN_CONSIGNUSERDESC);
		cache.cleanCache(LOGIN_CONSIGNFLAG);
		cache.cleanCache(LOGIN_USER);
	}

	/**
	 * 取HttpServletRequest
	 * 
	 * @param request
	 */
	private SessionUtils(HttpServletRequest request) {
		if (null == request) {
		} else {
		}
		// init(request);
	}

	public SessionUtils() {
		this(SessionContext.getCurrentContext().getRequest());
	}

	/**
	 * LOGIN_SESSIONID
	 * 
	 * @return String
	 */
	public String getSessionid() {
		return StringUtils.toString(cache.getData(LOGIN_SESSIONID));
	}

	public String getLocal() {
		return StringUtils.toString(cache.getData(LOGIN_LOCAL));
	}

	/**
	 * 判断是否是登录有效用户
	 * 
	 * @return boolean TRUE：是 FALSE:否
	 */
	public boolean isLogin(HttpServletRequest httpRequest) {
		return null != httpRequest.getSession().getAttribute(LOGIN_USERCODE);

	}
	

	/**
	 * 得到当前登录用户的ID
	 * 
	 * @return
	 */
	public Long getUserId() {
		String userId = StringUtils.toString(cache.getData(LOGIN_USERID));
		if ("".equals(userId)) {
			return null;
		}
		return Long.valueOf(userId);
	}

	public Long getConsignuserId() {

		String consignuserId = StringUtils.toString(cache.getData(LOGIN_CONSIGNUSERID));
		if ("".equals(consignuserId)) {
			return null;
		}
		return Long.valueOf(consignuserId);
	}

	/**
	 * 得到当前登录用户的编码
	 */
	public String getUsercode() {
		String usercode = StringUtils.toString(cache.getData(LOGIN_USERCODE));
		return usercode;
	}

	/**
	 * 得到当前登录用户的委托人编码
	 */
	public String getConsignusercode() {
		String consignusercode = StringUtils.toString(cache.getData(LOGIN_CONSIGNUSERCODE));
		return consignusercode;
	}

	/**
	 * 得到当前登录用户的名称
	 * 
	 * @return
	 */
	public String getConsignuserdesc() {
		String consignusername = StringUtils.toString(cache.getData(LOGIN_CONSIGNUSERDESC));
		return consignusername;
	}

	public String getConsignflag() {
		String consignusername = StringUtils.toString(cache.getData(LOGIN_CONSIGNFLAG));
		return consignusername;
	}

	/**
	 * 得到当前登录用户的名称
	 * 
	 * @return
	 */
	public String getUserdesc() {
		String username = StringUtils.toString(cache.getData(LOGIN_USERDESC));
		return username;
	}

	
}
