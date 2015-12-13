package com.chengyb.framework.springmvc;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;
import com.chengyb.framework.utils.StringUtils;

@Controller
public class BaseController extends MultiActionController {
	private static Log logger = LogFactory.getLog(BaseController.class);

	public Map getParameterMap(HttpServletRequest request) {
		Map paramMap = new HashMap();
		Enumeration enum1 = request.getParameterNames();
		while (enum1.hasMoreElements()) {
			String key = (String) enum1.nextElement();
			paramMap.put(key, StringUtils.inEncodingURL(StringUtils
					.convertToUTF8(request.getParameter(key))));
		}
		logger.debug("request map = " + paramMap);
		return paramMap;
	}
}
