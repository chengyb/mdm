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
import com.chengyb.mdm.user.valueobject.UserInfo;

public interface UserService {

	/**
	 * Method insertUserInfo 新增 UserInfo
	 * 
	 * @param userInfo UserInfo.class
	 * @return String
	 */
	public String insertUserInfo(UserInfo userInfo);

	/**
	 * Method deleteUserInfo 删除 UserInfo
	 * 
	 * @param userInfos List.class
	 * @return int 删除的个数 
	 */
	public int deleteUserInfo(List<UserInfo> userInfos);
	
	/**
	 * Method deleteUserInfo 删除 UserInfo
	 * 
	 * @param userInfo UserInfo.class
	 * @return int 删除的个数 
	 */
	public int deleteUserInfo(UserInfo userInfo);

	/**
	 * Method updateUserInfo 修改 UserInfo
	 * 
	 * @param userInfo UserInfo.class
	 */
	public int updateUserInfo(UserInfo userInfo);

	/**
	 * Method saveUserInfo 保存 UserInfo
	 * 
	 * @param userInfos List.class
	 * @return int 保存的个数 
	 */
	public int saveUserInfo(List<UserInfo> userInfos);

	/**
	 * Method getUserInfoDetail 查询 UserInfo 详细信息
	 * 
	 * @param userInfo UserInfo.class 包含主键
	 * @return UserInfo
	 */
	public UserInfo selectUserInfoById(String dbid_);

	/**
	 * Method selectUserInfoByCond 查询 UserInfo
	 * 
	 * @param cond Map<String,String>.class 
	 * @return VCommList<UserInfo>
	 */
	public VCommList<UserInfo> selectUserInfoByCond(Map<String,String> cond,SplitPage spage);

	public UserInfo selectUserInfoByName(String username);

	
}