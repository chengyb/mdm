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

import com.chengyb.framework.annotation.AutoLogger;
import com.chengyb.framework.bean.SplitPage;
import com.chengyb.framework.bean.VCommList;
import com.chengyb.framework.dao.ibatis2.BaseIbatisDaoSupport;
import com.chengyb.mdm.role.valueobject.RoleInfo;

public class RoleServiceImpl extends BaseIbatisDaoSupport implements RoleService{

	/**
	 * Method insertRoleInfo 新增 RoleInfo
	 * 
	 * @param roleInfo RoleInfo.class
	 * @return String
	 */
	@AutoLogger(name = "新增",classfication="SYS_ROLE")
	public String insertRoleInfo(RoleInfo roleInfo){
		Object args = this.getClientTemplate().insert("com.chengyb.mdm.role.insertRoleInfo", roleInfo);
		return args.toString();
	}

	/**
	 * Method deleteRoleInfo 删除 RoleInfo
	 * 
	 * @param list List.class
	 * @return int 删除的个数 
	 */
	 @AutoLogger(name = "删除",classfication="SYS_ROLE")
	public int deleteRoleInfo(List<RoleInfo> list){
		int sum = 0;
		for (int i = 0, n = (null == list ? 0 : list.size()); i < n; i++) {
			RoleInfo roleInfo = list.get(i);
			sum += this.getClientTemplate().delete("com.chengyb.mdm.role.deleteRoleInfo", roleInfo);
		}
		return sum;
	}
	
	/**
	 * Method deleteRoleInfo 删除 RoleInfo
	 * 
	 * @param roleInfo RoleInfo.class
	 * @return int 删除的个数 
	 */
	@AutoLogger(name = "删除",classfication="SYS_ROLE")	 
	public int deleteRoleInfo(RoleInfo roleInfo){
		return this.getClientTemplate().delete("com.chengyb.mdm.role.deleteRoleInfo", roleInfo);
	}

	/**
	 * Method saveRoleInfo 保存 RoleInfo
	 * 
	 * @param roleInfos List.class
	 * @return int 保存的个数 
	 */
	@AutoLogger(name = "保存",classfication="SYS_ROLE")	 
	public int saveRoleInfo(List<RoleInfo> roleInfos){
		int sum = 0;
		for (int i = 0, n = (null == roleInfos ? 0 : roleInfos.size()); i < n; i++) {
			RoleInfo roleInfo = roleInfos.get(i);
			if (null == roleInfo.getDbid_() || null==selectRoleInfoById(roleInfo.getDbid_())) {
				this.getClientTemplate().insert("com.chengyb.mdm.role.insertRoleInfo", roleInfo);
				sum++;
			} else {
				sum += this.getClientTemplate().update("com.chengyb.mdm.role.updateRoleInfo", roleInfo);
			}
		}
		return sum;
	}


	/**
	 * Method updateRoleInfo 修改 RoleInfo
	 * 
	 * @param roleInfo RoleInfo.class
	 */
	@AutoLogger(name = "修改",classfication="SYS_ROLE")	 
	public int updateRoleInfo(RoleInfo roleInfo){
		return this.getClientTemplate().update("com.chengyb.mdm.role.updateRoleInfo", roleInfo);
	}

	/**
	 * Method getRoleInfoDetail 查询 RoleInfo 详细信息
	 * 
	 * @param roleInfo RoleInfo.class 包含主键
	 * @return RoleInfo
	 */
	@AutoLogger(name = "查询",classfication="SYS_ROLE")	 
	public RoleInfo selectRoleInfoById(String dbid_){
		return (RoleInfo)this.getClientTemplate().queryForObject("com.chengyb.mdm.role.selectRoleInfoById", dbid_);
	}

	/**
	 * Method selectRoleInfoByCond 查询 RoleInfo
	 * 
	 * @param cond Map<String,String>.class 
	 * @return VCommList<RoleInfo>
	 */
	@AutoLogger(name = "查询",classfication="SYS_ROLE")	 
	public VCommList<RoleInfo> selectRoleInfoByCond(Map<String,String> cond,SplitPage spage){
		return this.getClientTemplate().queryForVCommList("com.chengyb.mdm.role.selectRoleInfoByCond", cond, null, spage);
	}

	@Override
	public List<RoleInfo> selectRoleInfoByUserid(String dbid_) {
		return getClientTemplate().queryForList("com.chengyb.mdm.role.sql.selectRoleInfoByUserid",dbid_);
	}

	
}