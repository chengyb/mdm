package com.chengyb.framework.dao.dialect;

public class MySQLDialect implements Dialect {

	protected static final String SQL_END_DELIMITER = ";";

	/**
	 * 返回sql语句，查询数据从offset到limit行
	 * 
	 * @param sql
	 *            String
	 * @param offset
	 *            int
	 * @param limit
	 *            int
	 * @return String
	 */
	public String getLimitString(String sql, int offset, int limit) {
		sql = trim(sql);
		StringBuffer sb = new StringBuffer(sql.length() + 20);
		sb.append(sql);
		if (offset > 0) {
			sb.append(" limit ").append(offset).append(',').append(limit).append(SQL_END_DELIMITER);
		} else {
			sb.append(" limit ").append(limit).append(SQL_END_DELIMITER);
		}
		return sb.toString();
	}

	public boolean supportsLimit() {
		return true;
	}

	/**
	 * 去掉sql的空格
	 * 
	 * @param sql
	 *            String
	 * @return String
	 */
	private String trim(String sql) {
		sql = sql.trim();
		if (sql.endsWith(SQL_END_DELIMITER)) {
			sql = sql.substring(0, sql.length() - 1 - SQL_END_DELIMITER.length());
		}
		return sql;
	}

	/**
	 * 返回求字段和的sql
	 * 
	 * @param sql
	 *            String
	 * @param sumColumn
	 *            String[]
	 * @return
	 */
	public String getSumString(String sql, String[] sumColumn) {
		StringBuffer strbf = new StringBuffer();
		strbf.append("SELECT ");
		for (int i = 0; sumColumn != null && i < sumColumn.length; i++) {
			strbf.append("SUM(IFNULL(");
			strbf.append(sumColumn[i].trim());
			strbf.append(",0)),");
		}
		strbf.append(" COUNT(1) CNT FROM ( \n ");

		strbf.append(delOrderbyFromSQL(sql));

		strbf.append("\n ) T_T");

		return strbf.toString();
	}

	/**
	 * 去掉sqlStr语句中的order by 排序
	 * 
	 * @param sqlStr
	 *            String
	 * @return String
	 */
	private String delOrderbyFromSQL(String sqlStr) {
		String reStr = null;
		String tmp = sqlStr.toLowerCase();
		int lastorder = tmp.lastIndexOf("order ");
		int lastby = tmp.lastIndexOf("by ");

		int lasttmp = tmp.lastIndexOf(")");

		if (lastorder == -1) {
			reStr = sqlStr;
		} else {
			if (lastby <= lastorder) {
				return sqlStr;
			}

			if (lasttmp == -1) {
				reStr = sqlStr.substring(0, lastorder);

			} else if (lastorder > lasttmp) {
				reStr = sqlStr.substring(0, lastorder);
			} else {
				reStr = sqlStr;
			}
		}
		return reStr;

	}

	@Override
	public String replaceAll(String str) {
		str = str.replaceAll("\\s{1,}", " ");
		return str;
	}
}
