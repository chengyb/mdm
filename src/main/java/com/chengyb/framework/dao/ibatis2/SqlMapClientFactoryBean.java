package com.chengyb.framework.dao.ibatis2;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.nio.charset.Charset;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.NestedIOException;
import org.springframework.core.io.Resource;
import org.springframework.util.ObjectUtils;

import com.ibatis.common.resources.Resources;
import com.ibatis.common.xml.NodeletException;
import com.ibatis.sqlmap.client.SqlMapClient;
import com.ibatis.sqlmap.client.SqlMapClientBuilder;
import com.ibatis.sqlmap.engine.builder.xml.SqlMapConfigParser;
import com.ibatis.sqlmap.engine.builder.xml.SqlMapParser;
import com.ibatis.sqlmap.engine.builder.xml.XmlParserState;
import com.ibatis.sqlmap.engine.config.SqlMapConfiguration;
import com.chengyb.framework.dao.ibatis2.plugins.IbatisResource;

/**
 * 
 * 
 * <p>
 * Title: <b>Dialect Ibatis 扩展出Client 工厂类</b>
 * </p>
 * 
 * <p>
 * Description: Ibatis 扩展出Client 工厂类
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
public class SqlMapClientFactoryBean extends org.springframework.orm.ibatis.SqlMapClientFactoryBean {

	
	private static Log logger = LogFactory.getLog(SqlMapClientFactoryBean.class);
	private Resource[] javaLocations;
	private Resource[] mappingJarLocations;

	public Resource[] getMappingJarLocations() {
		return mappingJarLocations;
	}

	public void setMappingJarLocations(Resource[] mappingJarLocations) {
		this.mappingJarLocations = mappingJarLocations;
	}

	/**
	 * Build a SqlMapClient instance based on the given standard configuration.
	 * <p>
	 * The default implementation uses the standard iBATIS
	 * {@link SqlMapClientBuilder} API to build a SqlMapClient instance based on
	 * an InputStream (if possible, on iBATIS 2.3 and higher) or on a Reader (on
	 * iBATIS up to version 2.2).
	 * 
	 * @param configLocations
	 *            the config files to load from
	 * @param properties
	 *            the SqlMapClient properties (if any)
	 * @return the SqlMapClient instance (never <code>null</code>)
	 * @throws IOException
	 *             if loading the config file failed
	 * @see com.ibatis.sqlmap.client.SqlMapClientBuilder#buildSqlMapClient
	 */
	protected SqlMapClient buildSqlMapClient(Resource[] configLocations, Resource[] mappingLocations, Properties properties) throws IOException {
		Resources.setCharset(Charset.forName("UTF-8"));
		if (ObjectUtils.isEmpty(configLocations)) {
			throw new IllegalArgumentException("At least 1 'configLocation' entry is required");
		}
		
		SqlMapClient client = null;
		SqlMapConfigParser configParser = new SqlMapConfigParser();
		for (int i = 0; i < configLocations.length; i++) {
			InputStream is = configLocations[i].getInputStream();
			try {
				client = configParser.parse(new InputStreamReader(is), properties);
			} catch (RuntimeException ex) {
				throw new NestedIOException("Failed to parse config resource: " + configLocations[i], ex.getCause());
			}
		}
		if (mappingLocations != null) {
			SqlMapParser mapParser = SqlMapParserFactory.createSqlMapParser(configParser);

			for (int i = 0; i < mappingLocations.length; i++) {
				try {
					mapParser.parse(mappingLocations[i].getInputStream());
				} catch (NodeletException ex) {
					logger.debug("com.chengyb.framework.dao.ibatis2.SqlMapClientFactoryBean.buildSqlMapClient \n No." + i + ":" + mappingLocations[i].getFile().getAbsolutePath());
					throw new NestedIOException("Failed to parse mapping resource: " + mappingLocations[i], ex);
				}
			}
		}
	
		if (javaLocations != null) {
			SqlMapParser mapParser = SqlMapParserFactory.createSqlMapParser(configParser);
			String basePath = this.getClass().getResource("/").getPath();
			for (int i = 0; i < javaLocations.length; i++) {
				try {
					String path = "";
					if (javaLocations[i].getURI() != null && javaLocations[i].getURI().getPath() != null) {
						path = javaLocations[i].getURI().getPath();
						path = path.replaceFirst(basePath, "");

					} else {
						path = javaLocations[i].getURL().getPath();
						path = path.replaceFirst("^file:\\S*!/", "");
					}
					path = path.replaceAll("/", ".");
					path = path.replaceFirst("\\S*WEB-INF.classes.", "");
					
					path = path.replaceFirst("\\S*WEB-INF.lib.*.jar!.", "");
					
					String className = path.replaceFirst("\\.class$", "");
					
					
					try {
						Class<?> _class = Class.forName(className);
						javax.persistence.Entity _entity = (javax.persistence.Entity) _class.getAnnotation(javax.persistence.Entity.class);
						javax.persistence.Table _table = (javax.persistence.Table) _class.getAnnotation(javax.persistence.Table.class);
						if (_entity != null && _table != null) {
							InputStream inputStream = IbatisResource.getClassAsStream(className);
							mapParser.parse(inputStream);
						}

					} catch (ClassNotFoundException e) {
						System.out.println("ClassNotFoundException:"+e.getMessage());
						logger.debug(e.getMessage());
					}

				} catch (NodeletException ex) {
					throw new NestedIOException("Failed to parse mapping resource: " + javaLocations[i], ex);
				}
			}
		}

		// *************其实只改这一点而已，为了方便他人，全source贴出**************
		// 为了取sqlMapConfig，反射private的field
		try {
			Field stateField = configParser.getClass().getDeclaredField("state");
			stateField.setAccessible(true);
			XmlParserState state = (XmlParserState) stateField.get(configParser);
			SqlMapConfiguration sqlMapConfig = state.getConfig();
			// 反射取设置cache的方法，执行
			Method wireUpCacheModels = sqlMapConfig.getClass().getDeclaredMethod("wireUpCacheModels");
			wireUpCacheModels.setAccessible(true);
			wireUpCacheModels.invoke(sqlMapConfig);
		} catch (Exception ex) {
			ex.printStackTrace();
//			throw new IOException(ex.getMessage());
		}
		// ************************************************************************
		return client;
	}

	/**
	 * Inner class to avoid hard-coded iBATIS 2.3.2 dependency (XmlParserState
	 * class).
	 */
	private static class SqlMapParserFactory {

		public static SqlMapParser createSqlMapParser(SqlMapConfigParser configParser) {
			// Ideally: XmlParserState state = configParser.getState();
			// Should raise an enhancement request with iBATIS...
			XmlParserState state = null;
			try {
				Field stateField = SqlMapConfigParser.class.getDeclaredField("state");
				stateField.setAccessible(true);
				state = (XmlParserState) stateField.get(configParser);
			} catch (Exception ex) {
				throw new IllegalStateException("iBATIS 2.3.2 'state' field not found in SqlMapConfigParser class - "
						+ "please upgrade to IBATIS 2.3.2 or higher in order to use the new 'mappingLocations' feature. " + ex);
			}
			return new SqlMapParser(state);
		}
	}

	public void setJavaLocations(Resource[] javaLocations) {
		this.javaLocations = javaLocations;
	}
}
