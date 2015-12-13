package com.chengyb.mdm.menu.service;

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

import com.chengyb.mdm.menu.valueobject.MenuInfo;

public class MenuServiceImpl extends BaseIbatisDaoSupport implements MenuService{

	/**
	 * Method insertMenuInfo 新增 MenuInfo
	 * 
	 * @param menuInfo MenuInfo.class
	 * @return String
	 */
	@AutoLogger(name = "新增",classfication="SYS_MENU")
	public String insertMenuInfo(MenuInfo menuInfo){
		Object args = this.getClientTemplate().insert("com.chengyb.mdm.menu.insertMenuInfo", menuInfo);
		return args.toString();
	}

	/**
	 * Method deleteMenuInfo 删除 MenuInfo
	 * 
	 * @param list List.class
	 * @return int 删除的个数 
	 */
	 @AutoLogger(name = "删除",classfication="SYS_MENU")
	public int deleteMenuInfo(List<MenuInfo> list){
		int sum = 0;
		for (int i = 0, n = (null == list ? 0 : list.size()); i < n; i++) {
			MenuInfo menuInfo = list.get(i);
			sum += this.getClientTemplate().delete("com.chengyb.mdm.menu.deleteMenuInfo", menuInfo);
		}
		return sum;
	}
	
	/**
	 * Method deleteMenuInfo 删除 MenuInfo
	 * 
	 * @param menuInfo MenuInfo.class
	 * @return int 删除的个数 
	 */
	@AutoLogger(name = "删除",classfication="SYS_MENU")	 
	public int deleteMenuInfo(MenuInfo menuInfo){
		return this.getClientTemplate().delete("com.chengyb.mdm.menu.deleteMenuInfo", menuInfo);
	}

	/**
	 * Method saveMenuInfo 保存 MenuInfo
	 * 
	 * @param menuInfos List.class
	 * @return int 保存的个数 
	 */
	@AutoLogger(name = "保存",classfication="SYS_MENU")	 
	public int saveMenuInfo(List<MenuInfo> menuInfos){
		int sum = 0;
		for (int i = 0, n = (null == menuInfos ? 0 : menuInfos.size()); i < n; i++) {
			MenuInfo menuInfo = menuInfos.get(i);
			if (null == menuInfo.getDbid_() || null==selectMenuInfoById(menuInfo.getDbid_())) {
				this.getClientTemplate().insert("com.chengyb.mdm.menu.insertMenuInfo", menuInfo);
				sum++;
			} else {
				sum += this.getClientTemplate().update("com.chengyb.mdm.menu.updateMenuInfo", menuInfo);
			}
		}
		return sum;
	}


	/**
	 * Method updateMenuInfo 修改 MenuInfo
	 * 
	 * @param menuInfo MenuInfo.class
	 */
	@AutoLogger(name = "修改",classfication="SYS_MENU")	 
	public int updateMenuInfo(MenuInfo menuInfo){
		return this.getClientTemplate().update("com.chengyb.mdm.menu.updateMenuInfo", menuInfo);
	}

	/**
	 * Method getMenuInfoDetail 查询 MenuInfo 详细信息
	 * 
	 * @param menuInfo MenuInfo.class 包含主键
	 * @return MenuInfo
	 */
	@AutoLogger(name = "查询",classfication="SYS_MENU")	 
	public MenuInfo selectMenuInfoById(String dbid_){
		return (MenuInfo)this.getClientTemplate().queryForObject("com.chengyb.mdm.menu.selectMenuInfoById", dbid_);
	}

	/**
	 * Method selectMenuInfoByCond 查询 MenuInfo
	 * 
	 * @param cond Map<String,String>.class 
	 * @return VCommList<MenuInfo>
	 */
	@AutoLogger(name = "查询",classfication="SYS_MENU")	 
	public VCommList<MenuInfo> selectMenuInfoByCond(Map<String,String> cond,SplitPage spage){
		return this.getClientTemplate().queryForVCommList("com.chengyb.mdm.menu.selectMenuInfoByCond", cond, null, spage);
	}

	
}