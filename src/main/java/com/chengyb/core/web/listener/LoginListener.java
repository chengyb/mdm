package com.chengyb.core.web.listener;

import javax.servlet.ServletContextAttributeEvent;
import javax.servlet.ServletContextAttributeListener;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import com.chengyb.core.utils.SessionUtils;
import com.chengyb.core.utils.UserManager;
import com.chengyb.framework.utils.SpringContextUtils;


/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Copyright: Copyright (c) 2002
 * </p>
 * <p>
 * Company:
 * </p>
 * 
 * @author chengyb
 * @version 1.0
 */
public class LoginListener implements HttpSessionListener, ServletContextListener, ServletContextAttributeListener {

	public void sessionDestroyed(HttpSessionEvent se) {
		try {
			UserManager.logout(SessionUtils.getSessionId(se.getSession()));
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	@Override
	public void attributeAdded(ServletContextAttributeEvent arg0) {
	}

	@Override
	public void attributeRemoved(ServletContextAttributeEvent arg0) {
	}

	@Override
	public void attributeReplaced(ServletContextAttributeEvent arg0) {
	}

	@Override
	public void contextInitialized(ServletContextEvent event) {
	}

	@Override
	public void sessionCreated(HttpSessionEvent se) {
	}

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {	
	}
}
