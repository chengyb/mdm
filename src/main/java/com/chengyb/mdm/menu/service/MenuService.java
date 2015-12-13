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

import com.chengyb.mdm.menu.valueobject.MenuInfo;

public interface MenuService {

	/**
	 * Method insertMenuInfo 新增 MenuInfo
	 * 
	 * @param menuInfo MenuInfo.class
	 * @return String
	 */
	public String insertMenuInfo(MenuInfo menuInfo);

	/**
	 * Method deleteMenuInfo 删除 MenuInfo
	 * 
	 * @param menuInfos List.class
	 * @return int 删除的个数 
	 */
	public int deleteMenuInfo(List<MenuInfo> menuInfos);
	
	/**
	 * Method deleteMenuInfo 删除 MenuInfo
	 * 
	 * @param menuInfo MenuInfo.class
	 * @return int 删除的个数 
	 */
	public int deleteMenuInfo(MenuInfo menuInfo);

	/**
	 * Method updateMenuInfo 修改 MenuInfo
	 * 
	 * @param menuInfo MenuInfo.class
	 */
	public int updateMenuInfo(MenuInfo menuInfo);

	/**
	 * Method saveMenuInfo 保存 MenuInfo
	 * 
	 * @param menuInfos List.class
	 * @return int 保存的个数 
	 */
	public int saveMenuInfo(List<MenuInfo> menuInfos);

	/**
	 * Method getMenuInfoDetail 查询 MenuInfo 详细信息
	 * 
	 * @param menuInfo MenuInfo.class 包含主键
	 * @return MenuInfo
	 */
	public MenuInfo selectMenuInfoById(String dbid_);

	/**
	 * Method selectMenuInfoByCond 查询 MenuInfo
	 * 
	 * @param cond Map<String,String>.class 
	 * @return VCommList<MenuInfo>
	 */
	public VCommList<MenuInfo> selectMenuInfoByCond(Map<String,String> cond,SplitPage spage);

	
}