package com.chengyb.mdm.menu.valueobject;

/**
 * 
 * <p>Title: </p> 
 * 
 * <p>Description: </p> 
 * 
 * <p>Copyright: Copyright (c) 2012</p> 
 * 
 * <p>Company: www.chengyb.com</p>
 * 
 * @author Administrator
 * @since  
 * @version 1.0
 */

import java.awt.Menu;
import java.util.LinkedHashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang.StringUtils;

import com.chengyb.framework.bean.BaseInfo;

@Entity
@Table(name="SYS_MENU")
public class MenuInfo extends BaseInfo {

	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	private String dbid_;

	/**
	 * 
	 */
	private String parent_id_;

	/**
	 * 
	 */
	private String name_;

	/**
	 * 
	 */
	private String url_;

	/**
	 * 
	 */
	private String order_;

	/**
	 * 
	 */
	private String description_;

	/**
	 * 
	 */
	private String name_en_;


	@Id
	@Column
	public String getDbid_(){
		return dbid_;
	}

	@Column
	public String getParent_id_(){
		return parent_id_;
	}

	@Column
	public String getName_(){
		return name_;
	}

	@Column
	public String getUrl_(){
		return url_;
	}

	@Column
	public String getOrder_(){
		return order_;
	}

	@Column
	public String getDescription_(){
		return description_;
	}

	@Column
	public String getName_en_(){
		return name_en_;
	}

	public void setDbid_(String dbid_){
		this.dbid_ = dbid_;
	}
	
	public void setParent_id_(String parent_id_){
		this.parent_id_ = parent_id_;
	}
	
	public void setName_(String name_){
		this.name_ = name_;
	}
	
	public void setUrl_(String url_){
		this.url_ = url_;
	}
	
	public void setOrder_(String order_){
		this.order_ = order_;
	}
	
	public void setDescription_(String description_){
		this.description_ = description_;
	}
	
	public void setName_en_(String name_en_){
		this.name_en_ = name_en_;
	}
	private Set<MenuInfo> children = new LinkedHashSet<MenuInfo>();
	public Set<MenuInfo> getChildren() {
		return this.children;
	}

	public void setChildren(Set<MenuInfo> children) {
		this.children = children;
	}
	public String toHtml(String basePath, boolean isFirst, boolean isCn) {
		StringBuilder sb = new StringBuilder();
		if (isFirst == true){
			sb.append("<ul class='sf-menu'>\n");
			sb.append("<li id=\"m-0\">" +
		            "<a href=\"/eSight/admin/dashboard?cn=m-0\" title=\"Dashboard\"><i class=\"fa fa-lg fa-fw fa-home\"></i> <span class=\"menu-item-parent\">首页</span></a>\n" +
		            "</li>");
		} else {
			sb.append("<ul>\n");
		}

		for (MenuInfo menu : getChildren()) {
			sb.append("<li id=\"m-" + menu.getDbid_() + "\">\n");
			String url = null;
			if (StringUtils.isEmpty(menu.getUrl_()))
				url = "#";
			else if (StringUtils
					.startsWithIgnoreCase(menu.getUrl_(), "http"))
				url = menu.getUrl_();
			else {
				url = new StringBuilder().append(basePath)
						.append(menu.getUrl_()).toString();
			}
			String name = isCn ? menu.getName_() : menu.getName_en_();
			sb.append(new StringBuilder().append("<a href=\"").append(url).append("?cn=m-").append(menu.getDbid_())
					.append("\"><i class=\"fa fa-lg fa-fw ").append(menu.getDbid_().length()>1?"fa-desktop":"fa-arrow-right").append("\"></i> ").append(name).append("</a>\n").toString());
			if (!menu.getChildren().isEmpty()) {
				sb.append(menu.toHtml(basePath, false, isCn));
			}
			sb.append("</li>\n");
		}
		sb.append("</ul>\n");
		return sb.toString();
	}
}
