package com.chengyb.mdm.role.controller;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.chengyb.framework.springmvc.BaseController;
import com.chengyb.framework.springmvc.BaseResponse;
import com.chengyb.framework.springmvc.Constant;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chengyb.mdm.menu.service.MenuService;
import com.chengyb.mdm.role.service.RoleService;
import com.chengyb.mdm.user.service.UserService;
import com.google.gson.Gson;

@Controller
@RequestMapping(value = {"/role"} )
public class RoleController extends BaseController{
	
	private static final Logger logger = LoggerFactory.getLogger(RoleController.class);

	@Autowired
	private UserService userService;
	@Autowired
	private RoleService roleService;
	@Autowired
	private MenuService menuService;
	
	/**
	 * 角色管理界面
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = {"/manageRole"}, method = RequestMethod.GET )
	public String managerRole(HttpServletRequest request, HttpServletResponse response){
		return "role/role";
	}
	
	/**
	 * 角色列表
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = {"/list"}, method = RequestMethod.GET )
	@ResponseBody
	public BaseResponse list(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse br = new BaseResponse();
//		//当前页面发出的请求次数
//		Integer sEcho = ServletRequestUtils.getIntParameter(request, "sEcho",0);
//		//搜索词
//		String name = ServletRequestUtils.getStringParameter(request, "sSearch", null);
//		//查询开始的序号
//		Integer iDisplayStart = ServletRequestUtils.getIntParameter(request, "iDisplayStart",0);
//		//单次查询的size
//		Integer iDisplayLength = ServletRequestUtils.getIntParameter(request, "iDisplayLength",10);
//		try {
//			Scroller scroller = new Scroller();
//			scroller.setPageNo(iDisplayStart/iDisplayLength + 1);
//			scroller.setPageSize(iDisplayLength);
//			List<Role> roles = null;
//			int count = 0;
//			if(StringUtils.isBlank(name)){
//				roles = roleService.listByScroller(scroller);
//				count = roleService.getQueryTotalCountString();
//			}else{
//				Role sr = new Role();
//				sr.setName(name);
//				roles = roleService.findByExample(sr, scroller);
//			}
//			List<Role> roleList = new ArrayList<Role>();
//			for(Role r : roles){
//				if(r.getIsInUse()){
//					r.setAuthorities(null);
//					roleList.add(r);
//				}
//			}
//			br.setResult(Constant.RESULT_SUCCESS);
//			int iDisplayEnd = (iDisplayStart+iDisplayLength) > roleList.size()?roleList.size():iDisplayStart+iDisplayLength;
//			br.setData(roleList.subList(iDisplayStart, iDisplayEnd));
//			br.setsEcho(sEcho);
//			//TODO size应该是总数
//			br.setiTotalRecords(roleList.size());
//			br.setiTotalDisplayRecords(roleList.size());
//		} catch (Exception e) {
//			logger.error("query role list error:",e);
//			br.setResult(Constant.RESULT_FAILED);
//			br.setReason("query role list error!");
//		}
		return br;
		
	}
	
	/**
	 * 添加角色
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = {"/add"}, method = RequestMethod.POST )
	@ResponseBody
	public BaseResponse add(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse br = new BaseResponse();
		try{
//			Gson gson = new Gson();
//			Map params = getParameterMap(request);
//			String name = (String)params.get("name");
//			String desc = (String)params.get("desc");
//			String menuIds = (String)params.get("menuIds");
//			Role role = new Role();
//			role.setName(name);
//			role.setDesc(desc);
//			role.setCreateDate(Calendar.getInstance().getTime());
//			Set<Authority> authorities = new HashSet<Authority>();
//			for(String id : menuIds.split(",")){
//				Authority authority = new Authority();
//				authority.setResourceId(id);
//				authority.setType(AuthorityType.MENU);
//				authorities.add(authority);
//			}
//			role.setAuthorities(authorities);
//			role = this.roleService.addRole(role);
//			br.setResult(Constant.RESULT_SUCCESS);
//			br.setData(role);
		}catch(Exception e){
			logger.error("add role error!",e);
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("add role error!");
		}
		return br;
	}
	
	/**
	 * 删除角色
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE )
	@ResponseBody
	public BaseResponse delete(HttpServletRequest request, HttpServletResponse response, @PathVariable String id) {
		BaseResponse br = new BaseResponse();
		try {
//			Role role = this.roleService.findByRoleId(id);
//			this.roleService.delRole(role);
			br.setResult(Constant.RESULT_SUCCESS);
		} catch (Exception e) {
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("delete role fail!");
		}
		return br;
	}
	
	/**
	 * 编辑角色
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = {"/edit"}, method = RequestMethod.POST )
	@ResponseBody
	public BaseResponse edit(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse br = new BaseResponse();
		try{
//			Map params = getParameterMap(request);
//			String dbid = (String)params.get("dbid");
//			String name = (String)params.get("name");
//			String desc = (String)params.get("desc");
//			String menuIds = (String)params.get("menuIds");
//			Role role = roleService.findByRoleId(dbid);
//			role.setName(name);
//			role.setDesc(desc);
//			role.setModifyDate(Calendar.getInstance().getTime());
//			Set<Authority> authorities = new HashSet<Authority>();
//			for(String id : menuIds.split(",")){
//				Authority authority = new Authority();
//				authority.setResourceId(id);
//				authority.setType(AuthorityType.MENU);
//				authorities.add(authority);
//			}
//			role.setAuthorities(authorities);
//			role = this.roleService.updateRole(role);
//			//刷新session
//			User u = (User)request.getSession().getAttribute("user");
//			u = userService.findUserById(u.getDbid());
//			request.getSession().setAttribute("user", u);
//			br.setResult(Constant.RESULT_SUCCESS);
//			br.setData(role);
		}catch(Exception e){
			logger.error("update role error!",e);
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("update role error!");
		}
		return br;
	}
	
	/**
	 * 通过名称查询用户
	 * 
	 * @param request
	 * @param response
	 * @param name
	 * @return @
	 */
	@RequestMapping(value = { "/name/{name}" }, method = RequestMethod.GET)
	@ResponseBody
	public BaseResponse getUserByName(HttpServletRequest request,
			HttpServletResponse response, @PathVariable String name) {
		BaseResponse br = new BaseResponse();
		if (StringUtils.isBlank(name)) {
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("param miss!");
			return br;
		}
		try{
//			Role r = roleService.getRoleByName(name);
//			if(r != null){
//				r.setAuthorities(null);
//			}
//			br.setResult(Constant.RESULT_SUCCESS);
//			br.setData(r);
		}catch(Exception e){
			logger.error("get role by name error!",e);
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("get role by name error!");
		}
		return br;
	}
	
	/**
	 * 查询所有的菜单
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = {"/listMenu"}, method = RequestMethod.GET )
	@ResponseBody
	public BaseResponse listMenu(HttpServletRequest request,
	HttpServletResponse response) {
		BaseResponse br = new BaseResponse();
		List<Map<String, Object>>  menuList = new ArrayList<Map<String, Object>>();
		try{
//			//menu列表
//			List<Menu> menus = menuService.getAll();
//			//将角色拥有关联的menu设置为true，否则设置为false
//			for(Menu m : menus){
//				Map<String, Object> map = new HashMap<String, Object>();
//				map.put("dbid", m.getDbid());
//				map.put("name", m.getName());
//				map.put("parentId",m!=null && m.getParent()!=null?m.getParent().getDbid():"");
//				map.put("isBlong",false);
//				menuList.add(map);
//			}
//			br.setResult(Constant.RESULT_SUCCESS);
//			br.setData(menuList);
		}catch(Exception e){
			logger.error("query menu list error!", e);
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("query menu list error!");
		}

		return br;
	}
	
	/**
	 * 查询角色关联的menu信息
	 * @param request
	 * @param response
	 * @param id 角色id
	 * @return
	 */
	@RequestMapping(value = { "/findMenu/{id}" }, method = RequestMethod.GET)
	@ResponseBody
	public BaseResponse findMenu(HttpServletRequest request,
			HttpServletResponse response, @PathVariable String id) {
		BaseResponse br = new BaseResponse();
		if (StringUtils.isBlank(id)) {
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("param miss!");
			return br;
		}
		try {
			//角色
//			Role role = roleService.findByRoleId(id);
//			List<Map<String, Object>>  menuList = new ArrayList<Map<String, Object>>();
//			if(role == null){
//				br.setResult(Constant.RESULT_SUCCESS);
//				br.setData(menuList);
//				return br;
//			}
//			//角色关联的资源
//			Set<Authority> authorities = role.getAuthorities();
//			//menu列表
//			List<Menu> menus = menuService.getAll();
//			//将角色拥有关联的menu设置为true，否则设置为false
//			for(Menu m : menus){
//				Map<String, Object> map = new HashMap<String, Object>();
//				map.put("dbid", m.getDbid());
//				map.put("name", m.getName());
//				map.put("parentId",m!=null && m.getParent()!=null?m.getParent().getDbid():"");
//				Boolean b = false;
//				for(Authority a : authorities){
//					if(a.getType().equals(AuthorityType.MENU) && m.getDbid().equals(a.getResourceId())){
//						b = true;
//					}
//				}
//				map.put("isBlong",b);
//				menuList.add(map);
//			}
//			
//			
//			br.setResult(Constant.RESULT_SUCCESS);
//			br.setData(menuList);
		} catch (Exception e) {
			logger.error("find role's menus error!", e);
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("find role's menus error!");
		}
		return br;
	}
}
