package com.chengyb.framework.dao.ibatis2;

import java.sql.Connection;
import java.sql.SQLException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.ibatis.sqlmap.engine.execution.SqlExecutor;
import com.ibatis.sqlmap.engine.mapping.statement.RowHandlerCallback;
import com.ibatis.sqlmap.engine.scope.StatementScope;
import com.chengyb.framework.Context;
import com.chengyb.framework.dao.dialect.Dialect;
/**
 * 
 * 
 * <p>
 * Title: <b>Dialect Ibatis 扩展出分页的方言类</b>
 * </p>
 * 
 * <p>
 * Description: Ibatis 扩展出分页的方言类
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
class LimitSqlExecutor extends SqlExecutor {
	private static final Log logger = LogFactory.getLog(LimitSqlExecutor.class);

	private Dialect dialect;

	private boolean enableLimit = true;

	public Dialect getDialect() {

		return dialect;
	}
	/**
	 * 设置系统为什么数据库方言 spring配置文件中
	 * @param dialect
	 */
	public void setDialect(Dialect dialect) {
		// 第一次设置 dialect
		this.dialect = dialect;
		Context.setDialect(dialect);
	}

	public boolean isEnableLimit() {
		return enableLimit;
	}

	public void setEnableLimit(boolean enableLimit) {
		this.enableLimit = enableLimit;
	}
	
	@Override
	public void executeQuery(StatementScope request, Connection conn, String sql, Object[] parameters, int skipResults, int maxResults, RowHandlerCallback callback) throws SQLException {
		if ((skipResults != NO_SKIPPED_RESULTS || maxResults != NO_MAXIMUM_RESULTS) && supportsLimit()) {
			sql = dialect.getLimitString(sql, skipResults, maxResults);
			if (logger.isDebugEnabled()) {
				logger.debug(sql);
			}
			skipResults = NO_SKIPPED_RESULTS;
			maxResults = NO_MAXIMUM_RESULTS;
		}
		
		//2013-12-27   liuyl 解决经常抛出java.lang.ClassCastException: java.lang.String incompatible with java.util.Date类似错误  导致审核中的主数据校验信息也能看到
		//这么修改不足之处是开发人员调试时 前台看不到查询的报错信息；暂时做此修改
		try
		{
			super.executeQuery(request, conn, sql, parameters, skipResults, maxResults, callback);
		}catch(ClassCastException e)
		{
				logger.error(e.getMessage());	
		}
	}
	/**
	 * 是否支持分页 
	 * @return
	 */
	public boolean supportsLimit() {
		if (enableLimit && dialect != null) {
			return dialect.supportsLimit();
		}
		return false;
	}

}
