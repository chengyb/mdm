package com.chengyb.framework.dao.ibatis2.plugins;

/**
 * 表与类的对照VO
 */
public class Table {

	private String name;//表名

	private Column pk;//主键

	private Column[] column;//列名

	private String comment;//注释

	private Class<?> entity;//实体名
	
	private String alias;//别名
	
	private String namespace;//命名空间

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Column getPk() {
		return pk;
	}

	public void setPk(Column pk) {
		this.pk = pk;
	}

	public Column[] getColumn() {
		return column;
	}

	public void setColumn(Column[] column) {
		this.column = column;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Class<?> getEntity() {
		return entity;
	}

	public void setEntity(Class<?> entity) {
		this.entity = entity;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getNamespace() {
		return namespace;
	}

	public void setNamespace(String namespace) {
		this.namespace = namespace;
	}
}
