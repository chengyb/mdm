package com.chengyb.framework.web.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import com.chengyb.core.utils.SessionUtils;
import com.chengyb.framework.utils.SessionContext;
/**
 * 
 * 
 * <p>Title: <b>Session 过滤器</b></p> 
 * 
 * <p>Description: 将Session和后台线程绑定</p> 
 * 
 * <p>Copyright: Copyright (c) 2009</p> 
 * 
 * <p>Company: www.chengyb.com</p>
 * 
 * @author chengyb
 * @version 1.0
 * @date 2009-3-30
 *
 */
public class SessionContextFilter implements Filter {

	public void destroy() {

	}
	/**
	 * 将Session和后台线程绑定
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
		SessionContext.setCurrentContext((HttpServletRequest) request);
		SessionUtils sessionUtils = new SessionUtils();
		sessionUtils.init((HttpServletRequest) request);
		filterChain.doFilter(request, response);
	}

	public void init(FilterConfig arg0) throws ServletException {

	}

}
