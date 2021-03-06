package com.chengyb.mdm.user.valueobject;

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

import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

import com.chengyb.framework.bean.BaseInfo;

@Entity
@Table(name="SYS_USER")
public class UserInfo extends BaseInfo {

	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	private String dbid_;

	/**
	 * 
	 */
	private String username_;

	/**
	 * 
	 */
	private String password_;

	/**
	 * 
	 */
	private String create_date_;

	/**
	 * 
	 */
	private String modify_date_;

	/**
	 * 
	 */
	private String is_in_use_;


	@Id
	@Column
	public String getDbid_(){
		return dbid_;
	}

	@Column
	public String getUsername_(){
		return username_;
	}

	@Column
	public String getPassword_(){
		return password_;
	}

	@Column
	public String getCreate_date_(){
		return create_date_;
	}

	@Column
	public String getModify_date_(){
		return modify_date_;
	}

	@Column
	public String getIs_in_use_(){
		return is_in_use_;
	}

	public void setDbid_(String dbid_){
		this.dbid_ = dbid_;
	}
	
	public void setUsername_(String username_){
		this.username_ = username_;
	}
	
	public void setPassword_(String password_){
		this.password_ = password_;
	}
	
	public void setCreate_date_(String create_date_){
		this.create_date_ = create_date_;
	}
	
	public void setModify_date_(String modify_date_){
		this.modify_date_ = modify_date_;
	}
	
	public void setIs_in_use_(String is_in_use_){
		this.is_in_use_ = is_in_use_;
	}
	
}
