package com.chengyb.framework.utils;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Map;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

/**
 * FreeMarket 工具类
 * 
 * @author chengyb
 * 
 */
public class FreeMarketUtils {
	private static Configuration cfg = null;

	/**
	 * 初始化FreeMarket 环境 ，设置默认路径 默认路径设置为 $path$/classes/
	 */
	public FreeMarketUtils() {
		if (null == cfg) {
			cfg = new Configuration();

			cfg.setClassForTemplateLoading(this.getClass(), "/");
			cfg.setDefaultEncoding("utf-8");
		}
	}

	/**
	 * 
	 * @param template
	 *            模板文件路径
	 * @param map
	 *            模板中使用的参数
	 * @param out
	 *            输出 Out
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	private boolean write(String template, Map map, Writer out) {
		try {
			Template t = cfg.getTemplate(template);
			t.process(map, out);
			return true;
		} catch (TemplateException e) {
			e.printStackTrace();
			return false;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
	}

	@SuppressWarnings("rawtypes")
	public String writeString(String template, Map map) {
		StringWriter out = new StringWriter();
		try {
			boolean flag = write(template, map, out);
			if (flag) {
				out.flush();
				return out.getBuffer().toString();
			} else {
				return null;
			}

		} finally {
			try {
				out.close();
			} catch (IOException e) {
				
				e.printStackTrace();
			}
		}

	}
}
