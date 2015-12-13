package com.chengyb.mdm.user.service;

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
 
import java.util.List;
import java.util.Map;

import com.chengyb.framework.bean.SplitPage;
import com.chengyb.framework.bean.VCommList;
import com.chengyb.framework.dao.ibatis2.BaseIbatisDaoSupport;
import com.chengyb.framework.annotation.AutoLogger;
import com.chengyb.mdm.user.valueobject.UserInfo;

public class UserServiceImpl extends BaseIbatisDaoSupport implements UserService{

	/**
	 * Method insertUserInfo 新增 UserInfo
	 * 
	 * @param userInfo UserInfo.class
	 * @return String
	 */
	@AutoLogger(name = "新增",classfication="SYS_USER")
	public String insertUserInfo(UserInfo userInfo){
		Object args = this.getClientTemplate().insert("com.chengyb.mdm.user.insertUserInfo", userInfo);
		return args.toString();
	}

	/**
	 * Method deleteUserInfo 删除 UserInfo
	 * 
	 * @param list List.class
	 * @return int 删除的个数 
	 */
	 @AutoLogger(name = "删除",classfication="SYS_USER")
	public int deleteUserInfo(List<UserInfo> list){
		int sum = 0;
		for (int i = 0, n = (null == list ? 0 : list.size()); i < n; i++) {
			UserInfo userInfo = list.get(i);
			sum += this.getClientTemplate().delete("com.chengyb.mdm.user.deleteUserInfo", userInfo);
		}
		return sum;
	}
	
	/**
	 * Method deleteUserInfo 删除 UserInfo
	 * 
	 * @param userInfo UserInfo.class
	 * @return int 删除的个数 
	 */
	@AutoLogger(name = "删除",classfication="SYS_USER")	 
	public int deleteUserInfo(UserInfo userInfo){
		return this.getClientTemplate().delete("com.chengyb.mdm.user.deleteUserInfo", userInfo);
	}

	/**
	 * Method saveUserInfo 保存 UserInfo
	 * 
	 * @param userInfos List.class
	 * @return int 保存的个数 
	 */
	@AutoLogger(name = "保存",classfication="SYS_USER")	 
	public int saveUserInfo(List<UserInfo> userInfos){
		int sum = 0;
		for (int i = 0, n = (null == userInfos ? 0 : userInfos.size()); i < n; i++) {
			UserInfo userInfo = userInfos.get(i);
			if (null == userInfo.getDbid_() || null==selectUserInfoById(userInfo.getDbid_())) {
				this.getClientTemplate().insert("com.chengyb.mdm.user.insertUserInfo", userInfo);
				sum++;
			} else {
				sum += this.getClientTemplate().update("com.chengyb.mdm.user.updateUserInfo", userInfo);
			}
		}
		return sum;
	}


	/**
	 * Method updateUserInfo 修改 UserInfo
	 * 
	 * @param userInfo UserInfo.class
	 */
	@AutoLogger(name = "修改",classfication="SYS_USER")	 
	public int updateUserInfo(UserInfo userInfo){
		return this.getClientTemplate().update("com.chengyb.mdm.user.updateUserInfo", userInfo);
	}

	/**
	 * Method getUserInfoDetail 查询 UserInfo 详细信息
	 * 
	 * @param userInfo UserInfo.class 包含主键
	 * @return UserInfo
	 */
	@AutoLogger(name = "查询",classfication="SYS_USER")	 
	public UserInfo selectUserInfoById(String dbid_){
		return (UserInfo)this.getClientTemplate().queryForObject("com.chengyb.mdm.user.selectUserInfoById", dbid_);
	}

	/**
	 * Method selectUserInfoByCond 查询 UserInfo
	 * 
	 * @param cond Map<String,String>.class 
	 * @return VCommList<UserInfo>
	 */
	@AutoLogger(name = "查询",classfication="SYS_USER")	 
	public VCommList<UserInfo> selectUserInfoByCond(Map<String,String> cond,SplitPage spage){
		return this.getClientTemplate().queryForVCommList("com.chengyb.mdm.user.selectUserInfoByCond", cond, null, spage);
	}

	@Override
	public UserInfo selectUserInfoByName(String username) {
		return (UserInfo)this.getClientTemplate().queryForObject("com.chengyb.mdm.user.sql.selectUserInfoByName", username);
	}

	
}