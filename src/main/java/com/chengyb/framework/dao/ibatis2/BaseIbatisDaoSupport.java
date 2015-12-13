package com.chengyb.framework.dao.ibatis2;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.springframework.orm.ibatis.SqlMapClientCallback;
import org.springframework.orm.ibatis.SqlMapClientTemplate;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.ibatis.sqlmap.client.SqlMapExecutor;
import com.ibatis.sqlmap.engine.execution.SqlExecutor;
import com.ibatis.sqlmap.engine.impl.ExtendedSqlMapClient;
import com.ibatis.sqlmap.engine.impl.SqlMapClientImpl;
import com.ibatis.sqlmap.engine.mapping.parameter.ParameterMap;
import com.ibatis.sqlmap.engine.mapping.sql.Sql;
import com.ibatis.sqlmap.engine.mapping.statement.MappedStatement;
import com.ibatis.sqlmap.engine.scope.SessionScope;
import com.ibatis.sqlmap.engine.scope.StatementScope;
import com.chengyb.core.utils.SessionUtils;
import com.chengyb.framework.cache.DataCache;
import com.chengyb.framework.dao.util.AnnotationDaoUtil;
import com.chengyb.framework.exception.RunException;
import com.chengyb.framework.utils.StringUtils;

/**
 * 
 * 
 * <p>
 * Title: <b>Dialect Ibatis 扩展出Dao的基类</b>
 * </p>
 * 
 * <p>
 * Description: Ibatis 扩展出Dao的基类
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
@SuppressWarnings({ "unchecked", "unused", "deprecation" })
public class BaseIbatisDaoSupport extends SqlMapClientDaoSupport {

	


//	protected String getUserSpelling(UserInfo userInfo) {
//		return this.getPhoneticSymbol(userInfo.getUserdesc());
//	}

//	protected String getPhoneticSymbol(String chineseString) {
//		String result = "convertionfailed";
//		try {
//			result = CnToSpell.getFullSpell(chineseString);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		return result;
//	}

	protected List<String> getIdListFromEntityList(List<?> entityList, String idName) throws RunException {
		if (StringUtils.isEmpty(idName) || entityList == null || entityList.size() == 0) {
			return null;
		}

		List<String> idList = new ArrayList<String>();
		for (Object entity : entityList) {
			try {
				idList.add(BeanUtils.getProperty(entity, idName));
			} catch (Exception e) {
				throw new RunException(e);
			}
		}

		return idList;
	}

	protected static String INSERT = AnnotationDaoUtil.INSERT;
	protected static String UPDATE = AnnotationDaoUtil.UPDATE;
	protected static String DELETE = AnnotationDaoUtil.DELETE;
	protected static String SELECT = AnnotationDaoUtil.SELECT;

	private SqlExecutor sqlExecutor;

	public void setSqlExecutor(SqlExecutor sqlExecutor) {
		this.sqlExecutor = sqlExecutor;
	}

	public void setEnableLimit(boolean enableLimit) {
		if (sqlExecutor instanceof LimitSqlExecutor) {
			((LimitSqlExecutor) sqlExecutor).setEnableLimit(enableLimit);
		}
	}

	/**
	 * spring 自动加载 这个函数
	 * 
	 * @throws Exception
	 */

	private void initialize() throws Exception {
		if (sqlExecutor != null) {
			SqlMapClient sqlMapClient = getSqlMapClientTemplate().getSqlMapClient();
			if (sqlMapClient instanceof ExtendedSqlMapClient) {
				ReflectUtil.setFieldValue(((ExtendedSqlMapClient) sqlMapClient).getDelegate(), "sqlExecutor", SqlExecutor.class, sqlExecutor);
			}
		}
	}

	/**
	 * 根据 ibatisid 参数 获取sql
	 * 
	 * @param statementName
	 *            ibatisid
	 * @param cond
	 *            参数
	 * @return sql
	 */
	protected final String getSql(String statementName, Map<?, ?> cond) {
		SqlMapClientTemplate sqlMapClientTemplate = super.getSqlMapClientTemplate();

		SqlMapClientImpl sqlMapClientImpl = (SqlMapClientImpl) sqlMapClientTemplate.getSqlMapClient();
		MappedStatement mappedStatement = sqlMapClientImpl.getMappedStatement(statementName);

		StatementScope requestScope = new StatementScope(new SessionScope());
		mappedStatement.initRequest(requestScope);
		Sql sql = mappedStatement.getSql();
		String sqlStr = sql.getSql(requestScope, cond);
		return sqlStr;
	}

	/**
	 * 根据 ibatisid 参数 获取参数
	 * 
	 * @param statementName
	 * @param cond
	 * @return
	 */
	protected final Object[] getParameters(String statementName, Map<?, ?> cond) {
		SqlMapClientTemplate sqlMapClientTemplate = super.getSqlMapClientTemplate();

		SqlMapClientImpl sqlMapClientImpl = (SqlMapClientImpl) sqlMapClientTemplate.getSqlMapClient();
		MappedStatement mappedStatement = sqlMapClientImpl.getMappedStatement(statementName);

		StatementScope requestScope = new StatementScope(new SessionScope());
		mappedStatement.initRequest(requestScope);
		Sql sql = mappedStatement.getSql();

		ParameterMap parameterMap = sql.getParameterMap(requestScope, cond);
		requestScope.setParameterMap(parameterMap);

		Object[] parameters = parameterMap.getParameterObjectValues(requestScope, cond);
		return parameters;
	}

	/**
	 * 根据 Class 获取SQL 配合系统自动生成的ibatis sql
	 * 
	 * @param obj
	 *            VO
	 * @param type
	 *            操作类型 (CREATE,UPDATE,DELETE,SELECT)
	 * @return
	 */
	protected final String getIbaitsId(Object obj, String type) {
		String ibaitsId = AnnotationDaoUtil.getIbatisId(obj.getClass(), type);
		return ibaitsId;
	}

	/**
	 * 根据 Class 获取自动生成的ibatisid
	 * 
	 * @param _class
	 * @param type
	 * @return
	 */
	protected final String getIbaitsId(Class<?> _class, String type) {
		String ibaitsId = AnnotationDaoUtil.getIbatisId(_class, type);
		return ibaitsId;
	}

	/**
	 * 获得 Ibatis2SqlMapClientTemplate
	 * 
	 * @return
	 */
	protected final Ibatis2SqlMapClientTemplate getClientTemplate() {

		return (Ibatis2SqlMapClientTemplate) super.getSqlMapClientTemplate();
	}

	

	public void deleteTempvpversion() {
		this.getClientTemplate().delete("com.chengyb.mdm.core.sql.deletetempvpversion");
	}

	protected void printTempvpversion(String str) {
		Map<String,Object> map = (Map<String,Object>)this.getClientTemplate().queryForObject("com.chengyb.mdm.core.sql.printTempversion");
		if(map!=null){
			logger.debug(str+"==categorycode:"+map.get("CATEGORYCODE")+" $ "+"version:"+map.get("VERSION")+" $ "+"categoryversion:"+map.get("CATEGORYVERSION")+" $ "+"auditflag:"+map.get("AUDITFLAG"));
		}else{
			logger.debug(str+"=="+"无初始化数据");
		}
	}

	/**
	 * 插入一条数据到 视图参数临时表
	 * 
	 * @param cond
	 * @return
	 */
	protected void insertTempvpversion(Map<String, String> cond) {
		cond.put("syscodeversion", "".equals(StringUtils.toString(cond.get("version"))) ? StringUtils.toString(cond.get("syscodeversion")) : StringUtils.toString(cond.get("version")));
		this.getClientTemplate().insert("com.chengyb.mdm.core.sql.inserttempvpversion", cond);
	}
	
	
	/**
	 * 拼接sql的新方法，不用in使用中间表，防止用in时，数据过多，造成内存不足的问题     lj  2015年7月31日15:06:52
	 */
	
	public  String getBiginSql(String prefix, String idsstr,int groupsize) 
	{
		String biginsql = "";
		final String[] ary = idsstr.split(",");
		
	   this.getClientTemplate().execute(new SqlMapClientCallback<Object>() {
			@Override
			public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
				executor.startBatch();
				for(int i=0;i<ary.length;i++){
					executor.insert("com.chengyb.mdm.code.sql.insertTEMPORARY_AUDIT_OBJ", StringUtils.toString(ary[i]));
				}
				executor.executeBatch();
				return null;
			}
		});
		biginsql =  " exists (select 1 from  TEMPORARY_AUDIT_OBJ q where q.workflowid = "+prefix+")";
		
		return biginsql;
	}
	
}
