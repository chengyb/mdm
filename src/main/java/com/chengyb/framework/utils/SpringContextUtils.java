package com.chengyb.framework.utils;

import java.io.File;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * 
 * 
 * <p>
 * Title: <b>SpringConext 工具类</b>
 * </p>
 * 
 * <p>
 * Description: 获取Sprint配置上下文(测试时候使用)
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
public class SpringContextUtils {

	private static ApplicationContext context;

	private SpringContextUtils() {

	}

	public static ApplicationContext getApplicationContext() {
		if(null==context){
			initApplicationContext();
		}
		return context;
	}

	@SuppressWarnings("unchecked")
	public static <T> T getBean(Class<T> c) {
		String className = c.getSimpleName();
		className = StringUtils.tofirstLowerCase(className, 1);
		T bean = null;
		try
		{
			bean = (T) SpringContextUtils.getBean(className);
		}
		catch (Exception e)
		{
			if (className.endsWith("Impl"))
			{
				bean = (T) SpringContextUtils.getBean(className.substring(0, className.length() - 4));
			}
		}
		return bean;
	}

	public static Object getBean(String beanid) {
		if (context == null) {
			initApplicationContext();
		}
		return context.getBean(beanid);
	}

	public static void setApplicationContext(ApplicationContext context) {
		SpringContextUtils.context = context;

	}

	private static void initApplicationContext() {
		SessionContext sessionContext =SessionContext.getCurrentContext();
		if (sessionContext == null || sessionContext.getRequest()==null) {
			File f = new File(SpringContextUtils.class.getClassLoader().getResource("").getFile());
			String path = f.getParentFile().getPath() + File.separator ;
			path = path.replaceAll("\\"+File.separator , "/");
			
			/*SpringContextUtils.context = new FileSystemXmlApplicationContext(new String[]{path+"applicationContext.xml",path+"applicationContext-cnooc.xml" 
					,path+"applicationContext-webService.xml",path+"applicationContext-esb.xml",path+"applicationContext-dataclean.xml"});*/
					SpringContextUtils.context = new FileSystemXmlApplicationContext(new String[]{path+"applicationContext.xml",path+"applicationContext-*.xml"});
		} else {
			SpringContextUtils.context =WebApplicationContextUtils.getRequiredWebApplicationContext(sessionContext.getServletContext());
		}
	}
	
	
	
}
