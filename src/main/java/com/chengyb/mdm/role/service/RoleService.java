package com.chengyb.mdm.role.service;

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
import java.util.Set;

import com.chengyb.framework.bean.SplitPage;
import com.chengyb.framework.bean.VCommList;
import com.chengyb.mdm.role.valueobject.RoleInfo;

public interface RoleService {

	/**
	 * Method insertRoleInfo 新增 RoleInfo
	 * 
	 * @param roleInfo RoleInfo.class
	 * @return String
	 */
	public String insertRoleInfo(RoleInfo roleInfo);

	/**
	 * Method deleteRoleInfo 删除 RoleInfo
	 * 
	 * @param roleInfos List.class
	 * @return int 删除的个数 
	 */
	public int deleteRoleInfo(List<RoleInfo> roleInfos);
	
	/**
	 * Method deleteRoleInfo 删除 RoleInfo
	 * 
	 * @param roleInfo RoleInfo.class
	 * @return int 删除的个数 
	 */
	public int deleteRoleInfo(RoleInfo roleInfo);

	/**
	 * Method updateRoleInfo 修改 RoleInfo
	 * 
	 * @param roleInfo RoleInfo.class
	 */
	public int updateRoleInfo(RoleInfo roleInfo);

	/**
	 * Method saveRoleInfo 保存 RoleInfo
	 * 
	 * @param roleInfos List.class
	 * @return int 保存的个数 
	 */
	public int saveRoleInfo(List<RoleInfo> roleInfos);

	/**
	 * Method getRoleInfoDetail 查询 RoleInfo 详细信息
	 * 
	 * @param roleInfo RoleInfo.class 包含主键
	 * @return RoleInfo
	 */
	public RoleInfo selectRoleInfoById(String dbid_);

	/**
	 * Method selectRoleInfoByCond 查询 RoleInfo
	 * 
	 * @param cond Map<String,String>.class 
	 * @return VCommList<RoleInfo>
	 */
	public VCommList<RoleInfo> selectRoleInfoByCond(Map<String,String> cond,SplitPage spage);

	public List<RoleInfo> selectRoleInfoByUserid(String dbid_);

	
}