package com.chengyb.framework.dao.ibatis2;

import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.persistence.CascadeType;
import javax.sql.DataSource;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy;
import org.springframework.orm.ibatis.SqlMapClientCallback;
import org.springframework.orm.ibatis.SqlMapClientTemplate;
import org.springframework.util.Assert;

import com.ibatis.sqlmap.client.SqlMapExecutor;
import com.ibatis.sqlmap.client.SqlMapSession;
import com.ibatis.sqlmap.engine.impl.SqlMapClientImpl;
import com.ibatis.sqlmap.engine.mapping.parameter.ParameterMap;
import com.ibatis.sqlmap.engine.mapping.sql.Sql;
import com.ibatis.sqlmap.engine.mapping.statement.MappedStatement;
import com.ibatis.sqlmap.engine.scope.SessionScope;
import com.ibatis.sqlmap.engine.scope.StatementScope;
import com.chengyb.framework.bean.SplitPage;
import com.chengyb.framework.bean.VCommList;
import com.chengyb.framework.cache.DataCache;
import com.chengyb.framework.dao.dialect.Dialect;
import com.chengyb.framework.dao.util.AnnotationDaoForQueryUtil;
import com.chengyb.framework.dao.util.AnnotationDaoUtil;
import com.chengyb.framework.exception.RunException;
import com.chengyb.framework.utils.SpringContextUtils;
import com.chengyb.framework.utils.StringUtils;
//import com.chengyb.mdm.core.service.SyscodeService;
//import com.chengyb.mdm.core.valueobject.SyscodeInfo;
/**
 * 
 * 
 * <p>
 * Title: <b>Dialect Ibatis 扩展出Ibatis2SqlMapClientTemplate</b>
 * </p>
 * 
 * <p>
 * Description: Ibatis 扩展Ibatis2SqlMapClientTemplate
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

@SuppressWarnings({"unchecked","rawtypes"})
public class Ibatis2SqlMapClientTemplate extends SqlMapClientTemplate {

	public Ibatis2SqlMapClientTemplate() {
		super();
	}
	
	
	private boolean isSQLInjection(String key,String param) {
		
		String ext_sql_key="mdm_tablecode_specialitytstandbg|mdm_tablecode_propertysynbg|mdm_tablecode_specialitybg|mdm_tablecode_propertygroupbg|mdm_tablecode_listpropertysbg|mdm_tablecode_propertyvaluesbg|mdm_tablecode_propertysbg|tempusergroupcode|outRole|RightSQL|oraclelikeSQLscore|fwgx_filter|sqlcond|searchSql|fieldcondition|coderbySQL|searchScoreSQL|compareScore|searchScoreSQLcondition|descondstr|sessionsql|descondstr|v_excelorder|desc|v_excelquery|linkmodelsql|propertycontrolsql|changhongarclistsql|oraclelikeSQL|corpcodes";
		String ext_sql_keys[] = ext_sql_key.split("\\|");
		
		for (int i = 0; i < ext_sql_keys.length; i++) {
			if (key!=null && key.equalsIgnoreCase(ext_sql_keys[i]) ) {
				return false;
			}
		}

		String inj_str = "exec|insert|select|delete|update|count|chr|or|mid|master|truncate|char|declare|;|-|+";
		String inj_stra[] = inj_str.split("\\|");
		for (int i = 0; i < inj_stra.length; i++) {
			if (param.toLowerCase().indexOf("'") >= 0 && param.toLowerCase().indexOf(inj_stra[i].toLowerCase()) >= 0 && !"".equals(StringUtils.toString(inj_stra[i]))) {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 包含分页的查询
	 * @param statementName String ibatisid
	 * @param parameterObject Map 参数
	 * @param sumColumns String[] 求和列
	 * @param spage  SplitPage 分页
	 * @return VCommList.class
	 * @throws DataAccessException
	 */
	private VCommList query4VCommList(final String statementName, final Object parameterObject, final String[] sumColumns, SplitPage spage) throws DataAccessException {

		
		
		// 处理SQL注入
		if (parameterObject instanceof Map) {
			Map parameterMap = (Map) parameterObject;

			Iterator iter = parameterMap.entrySet().iterator();
			while (iter.hasNext()) {
				Map.Entry entry = (Map.Entry) iter.next();
				Object key = entry.getKey();
				Object val = entry.getValue();
				if (isSQLInjection(StringUtils.toString(key), StringUtils.toString(val))) {
					logger.error("出现SQL注入的风险 key=" + key + ":value=" + StringUtils.toString(val));
					throw new RunException("出现SQL注入的风险 key=" + key + ":value=" + StringUtils.toString(val));
				}
			}
		}
		
		
		
		if (spage == null && null == sumColumns) {
			@SuppressWarnings("deprecation")
			List list = (List) executeWithListResult(new SqlMapClientCallback() {
				public Object doInSqlMapClient(final SqlMapExecutor executor) throws SQLException {
					return executor.queryForList(statementName, parameterObject);
				}
			});
			if (list == null) {
				return null;
			} else {
				VCommList vlist = new VCommList();
				vlist.addAll(list);
				fillVCommList(vlist, null, list.size());
				return vlist;
			}
		} else {

			final int skipResults = (spage.getCurrPage() - 1) * spage.getNumPerPage() + 1;
			final int maxResults = spage.getNumPerPage() - 1;
			VCommList vlist = executeWithListResult(statementName, parameterObject, sumColumns, spage, new SqlMapClientCallback() {
				public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
					return executor.queryForList(statementName, parameterObject, skipResults, maxResults);
				}
			});
			
			return vlist;

		}
	}

	/**
	 * 
	 * @param statementName
	 *            String ibatisId
	 * @param cond
	 *            Map 查询条件
	 * @return VCommList
	 */
	public VCommList queryForVCommList(String statementName, Map cond) {
		return queryForVCommList(statementName, cond, null, null);
	}

	/**
	 * 
	 * @param statementName
	 *            String ibatisId
	 * @param cond
	 *            Map 查询条件
	 * @param spage
	 *            SplitPage 分页信息
	 * @return VCommList
	 */
	public VCommList queryForVCommList(String statementName, Map<String, String> cond, SplitPage spage) {
		return this.queryForVCommList(statementName, cond, null, spage);
	}

	/**
	 * 
	 * @param statementName
	 *            String ibatisId
	 * @param sumcols
	 *            String[] 求和列
	 * @param spage
	 *            SplitPage 分页信息
	 * @return VCommList
	 */
	public VCommList queryForVCommList(String statementName, String[] sumcols, SplitPage spage) {
		return this.queryForVCommList(statementName, null, sumcols, spage);
	}

	/**
	 * 
	 * @param statementName
	 *            String ibatisId
	 * @param cond
	 *            Map 查询条件
	 * @param sumcols
	 *            String[] 求和列
	 * @return VCommList
	 */
	public VCommList queryForVCommList(String statementName, Map<String, String> cond, String[] sumcols) {
		return this.queryForVCommList(statementName, cond, sumcols, null);
	}

	/**
	 * 
	 * @param statementName
	 *            String ibatisId
	 * @param cond
	 *            Map 查询条件
	 * @param sumcols
	 *            String[] 求和列
	 * @param spage
	 *            SplitPage 分页信息
	 * @return VCommList
	 */
	public VCommList queryForVCommList(String statementName, Map<String, String> cond, String[] sumcols, SplitPage spage) {
		if(cond==null) cond=new HashMap<String,String>();
		return this.query4VCommList(statementName, cond, sumcols, spage);
	}
	
	
	private void loggerSQL(String prefix,String loggerSQL){
		DataCache dataCache = DataCache.getInstance();
		if(!"nosqllog".equals(dataCache.getData("TimeListener_JOBS")))
		logger.info(prefix+":"+loggerSQL);			
	}
	
	/**
	 * 调用ibatis 方法完成 查询等操作的基础函数
	 * @param statementName ibatisid
	 * @param parameterObject 传入参数
	 * @param sumColumns 求和列
	 * @param spage 分页信息 
	 * @param action 执行的基础函数
	 * @return
	 * @throws DataAccessException
	 */
	private Object execute(final String statementName, final Object parameterObject, final String[] sumColumns, SplitPage spage, SqlMapClientCallback action) throws DataAccessException {
		Assert.notNull(action, "Callback object must not be null");
		Assert.notNull(this.getSqlMapClient(), "No SqlMapClient specified");
		String loggerSQL="";
		// We always needs to use a SqlMapSession, as we need to pass a
		// Spring-managed
		// Connection (potentially transactional) in. This shouldn't be
		// necessary if
		// we run against a TransactionAwareDataSourceProxy underneath, but
		// unfortunately
		// we still need it to make iBATIS batch execution work properly: If
		// iBATIS
		// doesn't recognize an existing transaction, it automatically executes
		// the
		// batch for every single statement...
		VCommList vlist = new VCommList();
		int num = 0;
		
		LimitSqlExecutor chengybitSqlExecutor =null;
		
		SessionScope sessionScope =null;

		SqlMapSession session = this.getSqlMapClient().openSession();
		if (logger.isDebugEnabled()) {
			logger.debug("Opened SqlMapSession [" + session + "] for iBATIS operation");
		}
		Connection ibatisCon = null;

		try {
			
			 
			
			Connection springCon = null;
			DataSource dataSource = getDataSource();
			boolean transactionAware = (dataSource instanceof TransactionAwareDataSourceProxy);

			// Obtain JDBC Connection to operate on...
			try {
				ibatisCon = session.getCurrentConnection();
				if (ibatisCon == null) {
					springCon = (transactionAware ? dataSource.getConnection() : DataSourceUtils.doGetConnection(dataSource));
					session.setUserConnection(springCon);
					if (logger.isDebugEnabled()) {
						logger.debug("Obtained JDBC Connection [" + springCon + "] for iBATIS operation");
					}
				} else {
					if (logger.isDebugEnabled()) {
						logger.debug("Reusing JDBC Connection [" + ibatisCon + "] for iBATIS operation");
					}
				}

				String sqlStr = null;
				Object[] parameters = null;

				SqlMapClientImpl sqlMapClientImpl = (SqlMapClientImpl) this.getSqlMapClient();
				MappedStatement mappedStatement = sqlMapClientImpl.getMappedStatement(statementName);
				sessionScope = new SessionScope();
				StatementScope requestScope = new StatementScope(sessionScope);
				mappedStatement.initRequest(requestScope);
				Sql sql = mappedStatement.getSql();
				sqlStr = sql.getSql(requestScope, parameterObject);
				
				loggerSQL=sqlStr;
				
				loggerSQL("SQL",loggerSQL);
				ParameterMap parameterMap = sql.getParameterMap(requestScope, parameterObject);
				requestScope.setParameterMap(parameterMap);

				parameters = parameterMap.getParameterObjectValues(requestScope, parameterObject);

				limitSqlExecutor = (LimitSqlExecutor) sqlMapClientImpl.getSqlExecutor();

				
				
				Dialect dialect = limitSqlExecutor.getDialect();
				sqlStr = dialect.getSumString(sqlStr, sumColumns);
				loggerSQL("PreparedStatement SUMSQL",sqlStr);

				HashMap sumInfo = new HashMap();
				ResultSet rs = null;
				PreparedStatement pstmt = null;
				String syscode="";
				String syscodeName="";
				String largNum="";
				String largenumvalidflag="";//是否需要校验 最大记录数  liuyl 目前只有主数据查询才校验
				
				if(parameterObject!=null && parameterObject instanceof Map){//查询记录数的限制
					Map  storemap=(Map)parameterObject;
					syscode=StringUtils.toString(storemap.containsKey("tablecode") ? storemap.get("tablecode") :storemap.get("syscode"));
					largenumvalidflag=StringUtils.toString(storemap.get("largenumvalidflag"));
					if(!"".equals(StringUtils.toString(syscode)) && "Y".equals(largenumvalidflag))
					{
						
//						SyscodeService syscodeService = SpringContextUtils.getBean(SyscodeService.class);
//						SyscodeInfo SyscodeInfo =syscodeService.selectSyscodeInfoBySyscodeByCache(syscode);
//						if(SyscodeInfo!=null){
//							largNum = StringUtils.toString(SyscodeInfo.getLargnum());
//							syscodeName = SyscodeInfo.getCodename();
//						}
					}
				}
				
				try {
					pstmt = springCon.prepareStatement(sqlStr);
					for (int i = 0, n = (null == parameters ? 0 : parameters.length); i < n; i++) {
						pstmt.setObject(i + 1, parameters[i]);
					}
					rs = pstmt.executeQuery();
					if (rs.next()) {
						num = rs.getInt("CNT");
						
						if(!"0".equals(largNum) && !"".equals(largNum)){
							if(new Long(num).longValue()>new Long(largNum).longValue()){
								throw new RunException("LARGEDATA_EXCEPTION");
							}
						}

						if (sumColumns != null) {
							for (int i = 0; i < sumColumns.length; i++) {
								String tmp =sumColumns[i];
								try {
									sumInfo.put(tmp.toLowerCase(), new Double(rs.getDouble(i + 1)));
								} catch (Exception ex) {
									sumInfo.put(tmp.toLowerCase(), new Double(0));
								}
							}
							vlist.setSumInfo(sumInfo);
						}
					}
				} catch (RunException ex) {
					logger.error("SQL:\n"+sqlStr);
					if(ex.getMessage().equals("LARGEDATA_EXCEPTION"))
						throw new RunException("查询结果{0}条，{1}仅允许查询{2}条。请录入查询条件进一步查询！",StringUtils.toString(num),syscodeName,StringUtils.toString(largNum));
				} finally {
					if (rs != null) {
						rs.close();
						rs= null;
					}
					if (pstmt != null) {
						pstmt.close();
						pstmt = null;
					}
				}
				fillVCommList(vlist, spage, num);

				// ////////////////////////////////////////////
			} catch (SQLException ex) {
				logger.error("出错了  SQL:\n"+loggerSQL);
				throw new CannotGetJdbcConnectionException("Could not get JDBC Connection", ex);
			}finally{
				limitSqlExecutor.cleanup(sessionScope);
				sessionScope.cleanup();
				sessionScope = null;
				limitSqlExecutor = null;
			}

			// Execute given callback...
			try {
				if (num > 0) {
					List list = (List) action.doInSqlMapClient(session);
					vlist.addAll(list);
				}else{
					logger.warn("没有记录 ： SQL :\n " + loggerSQL);
				}
				return vlist;
			} catch (SQLException ex) {
				logger.error("SQL:\n"+loggerSQL);
				throw getExceptionTranslator().translate("SqlMapClient operation", null, ex);
			} finally {
				try {
					if (springCon != null) {
						if (transactionAware) {
							springCon.close();
						} else {
							DataSourceUtils.doReleaseConnection(springCon, dataSource);
						}
					}
				} catch (Throwable ex) {
					logger.debug("Could not close JDBC Connection", ex);
				}
			}

			// Processing finished - potentially session still to be closed.
		} finally {
			// Only close SqlMapSession if we know we've actually opened it
			// at the present level.
			if (ibatisCon == null) {
				session.close();
			}
		}
	}	
	/**
	 * 配合  execute 完成 queryForVCommList 操作
	 * @param statementName
	 * @param parameterObject
	 * @param sumColumns
	 * @param spage
	 * @param action
	 * @return
	 * @throws DataAccessException
	 */
	private VCommList executeWithListResult(final String statementName, final Object parameterObject, final String[] sumColumns, SplitPage spage, SqlMapClientCallback action)
			throws DataAccessException {
		return (VCommList) execute(statementName, parameterObject, sumColumns, spage, action);
	}
	/**
	 * 填充 VCommList.class 中的分页信息
	 * @param vlist
	 * @param spage
	 * @param nCount
	 */
	private void fillVCommList(VCommList vlist, SplitPage spage, int nCount) {
		if (vlist == null) {
			return;
		}
		if (spage == null) {
			spage = new SplitPage();
			spage.setNumPerPage(SplitPage.CONST_MAX_NUMPERPAGE);
			spage.setCurrPage(SplitPage.CONST_CURRPAGE);
		}
		vlist.setNumPerPage(spage.getNumPerPage());
		vlist.setCurrPage(spage.getCurrPage());
		vlist.setNum(nCount);
		vlist.setPageNum(nCount / vlist.getNumPerPage());
		if ((vlist.getPageNum() * vlist.getNumPerPage()) < nCount)
			vlist.setPageNum(vlist.getPageNum() + 1);
	}

	// ////////////////////////////////
	/**
	 * insert方法,调用自动提供的ibatis 方法完成完成 包括 oneToOne oneToMany中的数据同时自动保存
	 * 
	 * @param t
	 *            T T 中包含你要insert的数据 ,包括 oneToOne oneToMany中的数据
	 * @return T 输入什么返回什么
	 */
	public <T> Object insert(T t) {

		AnnotationDaoUtil adu = new AnnotationDaoUtil(t);
		String ibaitsId = AnnotationDaoUtil.getIbatisId(t.getClass(), AnnotationDaoUtil.INSERT);

		Object args = this.insert(ibaitsId, t);
		List oneToOne = adu.oneToOne(CascadeType.PERSIST);
		if (oneToOne != null) {
			for (Object obj : oneToOne) {
				AnnotationDaoUtil.setFkValue(obj, adu.getPkColumn(), args);
				this.insert(obj);
			}
		}

		List oneToMany = adu.oneToMany(CascadeType.PERSIST);
		if (oneToMany != null) {
			for (Object obj : oneToMany) {
				AnnotationDaoUtil.setFkValue(obj, adu.getPkColumn(), args);
				this.insert(obj);
			}
		}

		return args;
	}

	/**
	 * update方法,调用自动提供的ibatis 方法完成完成 包括 oneToOne oneToMany中的数据同时自动保存
	 * 
	 * @param t
	 *            T T 中包含你要insert的数据 ,包括 oneToOne oneToMany中的数据
	 * @return int 成功保存的主表记录数
	 */
	public <T> int update(T t) {
		AnnotationDaoUtil adu = new AnnotationDaoUtil(t);
		String ibaitsId = AnnotationDaoUtil.getIbatisId(t.getClass(), AnnotationDaoUtil.UPDATE);

		int num = this.update(ibaitsId, t);
		List oneToOne = adu.oneToOne(CascadeType.MERGE);
		if (oneToOne != null) {
			for (Object obj : oneToOne) {
				this.update(obj);
			}
		}

		List oneToMany = adu.oneToMany(CascadeType.MERGE);
		if (oneToMany != null) {
			for (Object obj : oneToMany) {
				this.update(obj);
			}
		}

		return num;
	}

	/**
	 * query方法,调用自动提供的ibatis 方法完成完成 包括 oneToOne oneToMany中的数据同时自动保存
	 * 
	 * @param t
	 *            T T 中包含你要insert的数据 ,包括 oneToOne oneToMany中的数据
	 * @return int 成功保存的主表记录数
	 */
	public <T> T queryForObject(T t) {
		return queryForObject(t, false);
	}

	
	private <T> T queryForObject(T t, boolean isFK) {
		AnnotationDaoForQueryUtil adu = new AnnotationDaoForQueryUtil(t);
		String pkColumn = adu.getPkColumn();
		Object pk_value = adu.getPkValue();
		if (!isFK) {
			String ibaitsId = AnnotationDaoUtil.getIbatisId(t.getClass(), AnnotationDaoUtil.SELECT)+"ById";
			t = (T) this.queryForObject(ibaitsId,pk_value);
		}
		List<Method> oneToOne = adu.getOneToOne();
		List<Method> oneToMany = adu.getOneToMany();

		for (Method m : oneToOne) {
			Object obj = AnnotationDaoForQueryUtil.newInstance(m.getReturnType());
			AnnotationDaoForQueryUtil.setFkValue(obj, pkColumn, pk_value);
			obj = this.queryForObject(obj, false);
			AnnotationDaoForQueryUtil.setFkValue(m, t, obj);

		}
		for (Method m : oneToMany) {
			Object obj = AnnotationDaoForQueryUtil.newInstance(m.getGenericReturnType());
			AnnotationDaoForQueryUtil.setFkValue(obj, pkColumn, pk_value);
			String _ibaitsId = AnnotationDaoUtil.getIbatisId(obj.getClass(), AnnotationDaoUtil.SELECT)+"ByCond";
			List list = this.queryForList(_ibaitsId, obj);
			AnnotationDaoForQueryUtil.setFkValue(m, t, list);
			if (list != null && list.size() > 0) {
				for (Object _obj : list) {
					queryForObject(_obj, true);
				}
			}
		}

		return t;
	}

	/**
	 * 没有实现,利用数据库实现及联删除
	 * 
	 * @param t
	 *            T
	 * @return 删除的主表行数
	 */
	public <T> int delete(T t) {// 配合数据库级及联删除
		String ibaitsId = AnnotationDaoUtil.getIbatisId(t.getClass(), AnnotationDaoUtil.DELETE);
		return this.delete(ibaitsId, t);
	}
}