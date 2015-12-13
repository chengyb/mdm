package com.chengyb.framework.dao.ibatis2.plugins;

public class Column {

	private String name;
	private String nick;
	private String type;
	private String defaultValue;
	private String comment;

	private String generatedValue;

	private String seq;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getSeq() {
		return seq;
	}

	public void setSeq(String seq) {
		this.seq = seq;
	}

	public String getGeneratedValue() {
		return generatedValue;
	}

	public void setGeneratedValue(String generatedValue) {
		this.generatedValue = generatedValue;
	}

	public String getNick() {
		return nick;
	}

	public void setNick(String nick) {
		this.nick = nick;
	}
}
