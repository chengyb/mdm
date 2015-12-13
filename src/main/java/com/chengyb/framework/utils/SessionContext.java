package com.chengyb.framework.utils;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@SuppressWarnings({"unchecked","rawtypes"})
public class SessionContext {
	
	

	/**
	 * ThreadLocal object for storing object in current thread.
	 */
	private static ThreadLocal tl = null;
	private static ThreadLocal getThreadLocal()
	{
		if (tl == null)
		{
			tl = new ThreadLocal();
		}
		return tl;
	}

	/**
	 * Set current context
	 * 
	 * @param request
	 *            The HttpRequest object
	 * @param response
	 *            The HttpResponses object
	 */

	static public void setCurrentContext(HttpServletRequest request) {
		SessionContext c=(SessionContext) getThreadLocal().get();
		if (c == null) {
			c = new SessionContext(request);
			getThreadLocal().set(c);
		} else {
			c.setRequest(request);
		}
	}
	
//	
//	static private String getSessionID() {
//		return getCurrentContext().getRequest().getSession().getId();
//	}

	/**
	 * Get current context value
	 * 
	 * @return The current context
	 */
	static public SessionContext getCurrentContext() {
		SessionContext c=(SessionContext) getThreadLocal().get();
		if(c==null){
			c=new SessionContext(null);
		}
		return c;
	}

	// ----------------------------------------------------------
	//
	// Class members
	//
	// ----------------------------------------------------------

	/**
	 * The http request object. The lifecycle of the request object is defined
	 * as the request scope. It may be reused in another incoming connection, so
	 * dont use it in another thread.
	 */
	private HttpServletRequest request;


	/**
	 * The constructor is private, to get an instance of the AMFContext, please
	 * use getCurrentContext() method.
	 * 
	 * @param request
	 * @param response
	 */
	private SessionContext(HttpServletRequest request) {
		this.request = request;
	}

	/**
	 * Get request object
	 * 
	 * @return Http request object
	 */
	public HttpServletRequest getRequest() {
		return request;
	}

	/**
	 * Set request object
	 * 
	 * @param Http
	 *            request object
	 */
	private void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	/**
	 * Get the servlet context
	 * 
	 * @return
	 */
	public ServletContext getServletContext() {
		HttpSession session = this.getSession();
		return session.getServletContext();
	}

	/**
	 * Get the current running session
	 * 
	 * @return
	 */
	private HttpSession getSession() {
		return request.getSession();
	}
}