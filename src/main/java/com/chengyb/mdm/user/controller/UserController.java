package com.chengyb.mdm.user.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

import com.chengyb.framework.springmvc.BaseController;
import com.chengyb.framework.springmvc.BaseResponse;
import com.chengyb.framework.springmvc.Constant;
import com.chengyb.mdm.role.service.RoleService;
import com.chengyb.mdm.role.valueobject.RoleInfo;
import com.chengyb.mdm.user.service.UserService;
import com.chengyb.mdm.user.valueobject.UserInfo;

@Controller
@RequestMapping(value = { "/user" })
public class UserController extends BaseController {

	private static final Logger logger = LoggerFactory
			.getLogger(UserController.class);

	@Autowired
	private UserService userService;
	@Autowired
	private RoleService roleService;

	/**
	 * 用户管理界面
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = { "/manageUser" }, method = RequestMethod.GET)
	public String managerUser(HttpServletRequest request,
			HttpServletResponse response) {
		return "user/user";
	}

	/**
	 * 用户列表
	 * 
	 * @param request
	 * @param response
	 * @return @
	 */
	@RequestMapping(value = { "/list" }, method = RequestMethod.GET)
	@ResponseBody
	public BaseResponse listUser(HttpServletRequest request,
			HttpServletResponse response) {
		BaseResponse br = new BaseResponse();
		try {
//			List<UserInfo> users = userService.getAll();
//			List<UserInfo> userList = new ArrayList<UserInfo>();
//			for (UserInfo user : users) {
//				if (user.getIsInUse()) {
//					UserInfo u = new UserInfo();
//					u.setDbid(user.getDbid());
//					u.setUsername(user.getUsername());
//					u.setModifyDate(user.getModifyDate());
//					u.setCreateDate(user.getCreateDate());
//					u.setRoles(new HashSet<Role>());
//					userList.add(u);
//				}
//			}
//			br.setResult(Constant.RESULT_SUCCESS);
//			br.setData(userList);
		} catch (Exception e) {
			logger.error("query user list error:",e);
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("query user list error!");
		}
		return br;
	}

	
	@RequestMapping(value = { "/list-ajax" }, method = RequestMethod.GET)
	@ResponseBody
	public BaseResponse listUserByPage(HttpServletRequest request,
			HttpServletResponse response) {
		BaseResponse br = new BaseResponse();
		//当前页面发出的请求次数
		Integer sEcho = ServletRequestUtils.getIntParameter(request, "sEcho",0);
		//搜索词
		String sSearch = ServletRequestUtils.getStringParameter(request, "sSearch", null);
		//查询开始的序号
		Integer iDisplayStart = ServletRequestUtils.getIntParameter(request, "iDisplayStart",0);
		//单次查询的size
		Integer iDisplayLength = ServletRequestUtils.getIntParameter(request, "iDisplayLength",10);
		try {
//			Scroller scroller = new Scroller();
//			scroller.setPageNo(iDisplayStart/iDisplayLength + 1);
//			scroller.setPageSize(iDisplayLength);
//			List<User> users = null;
//			if(StringUtils.isBlank(sSearch)){
//				users = userService.getAll();
//			}else{
//				users = userService.fuzzyQueryUser(sSearch, scroller);
//			}
//			List<UserInfo> userList = new ArrayList<UserInfo>();
//			for (UserInfo user : users) {
//				if (user.getIsInUse()) {
//					UserInfo u = new UserInfo();
//					u.setDbid(user.getDbid());
//					u.setUsername(user.getUsername());
//					u.setModifyDate(user.getModifyDate());
//					u.setCreateDate(user.getCreateDate());
//					u.setRoles(new HashSet<RoleInfo>());
//					userList.add(u);
//				}
//			}
//			br.setResult(Constant.RESULT_SUCCESS);
//			int iDisplayEnd = (iDisplayStart+iDisplayLength) > userList.size()?userList.size():iDisplayStart+iDisplayLength;
//			br.setData(userList.subList(iDisplayStart, iDisplayEnd));
//			br.setsEcho(sEcho);
//			//TODO size应该是总数
//			br.setiTotalRecords(userList.size());
//			br.setiTotalDisplayRecords(userList.size());
		} catch (Exception e) {
			logger.error("query user list error:",e);
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("query user list error!");
		}
		return br;
	}
	
	
	/**
	 * 删除用户
	 * 
	 * @param request
	 * @param response
	 * @param id
	 *            @
	 */
	@RequestMapping(value = { "/delete/{dbid}" }, method = RequestMethod.DELETE)
	@ResponseBody
	public BaseResponse delete(HttpServletRequest request,
			HttpServletResponse response, @PathVariable String dbid) {
		BaseResponse br = new BaseResponse();
		try {
			UserInfo userInfo=new UserInfo();
			userInfo.setDbid_(dbid);
			userService.deleteUserInfo(userInfo);
			br.setResult(Constant.RESULT_SUCCESS);
		} catch (Exception e) {
			logger.error("user delete error:", e);
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("user delete error!");
		}
		return br;
	}

	/**
	 * 新增用户
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = { "/add" }, method = RequestMethod.POST)
	@ResponseBody
	public BaseResponse add(HttpServletRequest request,
			HttpServletResponse response) {
		String username = ServletRequestUtils.getStringParameter(request,
				"username", "");
		String password = ServletRequestUtils.getStringParameter(request,
				"password", "");
		String repassword = ServletRequestUtils.getStringParameter(request,
				"repassword", "");
		BaseResponse br = new BaseResponse();
		if (StringUtils.isBlank(username) || StringUtils.isBlank(password) || StringUtils.isBlank(repassword)) {
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("param miss!");
			return br;
		}
		if(!password.equals(repassword)){
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("password and repassword is diffrent!");
			return br;
		}
		try {
//			UserInfo u = userService.addUser(username, password);
//			if(u != null){
//				u.setRoles(new HashSet<RoleInfo>());
//			}
//			br.setResult(Constant.RESULT_SUCCESS);
//			br.setData(u);
		} catch (Exception e) {
			logger.error("user add error:", e);
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("user add error!");
		}
		return br;
	}

	/**
	 * 编辑用户
	 * 
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = { "/edit" }, method = RequestMethod.POST)
	@ResponseBody
	public BaseResponse edit(HttpServletRequest request,
			HttpServletResponse response) {
		String dbid = ServletRequestUtils.getStringParameter(request, "dbid",
				"");
		String username = ServletRequestUtils.getStringParameter(request,
				"username", "");
		String password = ServletRequestUtils.getStringParameter(request,
				"password", "");
		String repassword = ServletRequestUtils.getStringParameter(request,
				"repassword", "");
		BaseResponse br = new BaseResponse();
		if (StringUtils.isBlank(dbid) || StringUtils.isBlank(username)
				|| StringUtils.isBlank(password)|| StringUtils.isBlank(repassword)) {
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("param miss!");
			return br;
		}
		if(!password.equals(repassword)){
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("password and repassword is diffrent!");
			return br;
		}
		try {
//			UserInfo u = userService.updateUser(dbid, username, password);
//			br.setResult(Constant.RESULT_SUCCESS);
//			br.setData(u);
		} catch (Exception e) {
			logger.error("user edit error:", e);
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("user edit error!");
		}
		return br;
	}

	/**
	 * 查询用户的角色信息
	 * @param request
	 * @param response
	 * @param id 用户id
	 * @return
	 */
	@RequestMapping(value = { "/findRole/{id}" }, method = RequestMethod.GET)
	@ResponseBody
	public BaseResponse findRole(HttpServletRequest request,
			HttpServletResponse response, @PathVariable String id) {
		BaseResponse br = new BaseResponse();
		if (StringUtils.isBlank(id)) {
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("param miss!");
			return br;
		}
		try {
//			Map<String, String> oldRoleIdNames = new HashMap<String, String>();
//			UserInfo user = userService.findUserById(id);
//			Set<RoleInfo> oldRoles = user.getRoles();
//			for (RoleInfo role : oldRoles) {
//				oldRoleIdNames.put(role.getDbid(), role.getName());
//			}
//			List<RoleInfo> allRole = roleService.getAll(false);
//			List<Map<String, Object>> roles = new ArrayList<Map<String, Object>>();
//			if (allRole != null) {
//				for (RoleInfo role : allRole) {
//					if (role.getIsInUse().booleanValue()) {
//						Map<String, Object> map = new HashMap<String, Object>();
//						map.put("dbid", role.getDbid());
//						map.put("name", role.getName());
//						if (oldRoleIdNames.keySet().contains(role.getDbid())) {
//							map.put("isBlong", true);
//						} else {
//							map.put("isBlong", false);
//						}
//						roles.add(map);
//					}
//				}
//			}
//			br.setResult(Constant.RESULT_SUCCESS);
//			br.setData(roles);
		} catch (Exception e) {
			logger.error("find user's roles error!", e);
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("find user's roles error!");
		}
		return br;
	}

	/**
	 * 编辑用户的角色信息
	 * 
	 * @param request
	 * @param response
	 * @return @
	 */
	@RequestMapping(value = { "/saveRole" }, method = RequestMethod.POST)
	@ResponseBody
	public BaseResponse saveRole(HttpServletRequest request,
			HttpServletResponse response) {
		String id = ServletRequestUtils.getStringParameter(request, "dbid", "");
		String roleIds = ServletRequestUtils.getStringParameter(request,
				"roleIds", "");

		BaseResponse br = new BaseResponse();
		if (StringUtils.isBlank(id) || StringUtils.isBlank(roleIds)) {
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("param miss!");
			return br;
		}
		try {
			UserInfo user = userService.selectUserInfoById(id);
			Set<RoleInfo> roles = new HashSet<RoleInfo>();
			if (!StringUtils.isEmpty(roleIds)) {
				String[] split = StringUtils.split(roleIds, ",");
				for (String string : split) {
					RoleInfo role = roleService.selectRoleInfoById(string);
					roles.add(role);
				}
			}
//			user.setRoles(roles);
//			userService.updateUser(user);
			br.setResult(Constant.RESULT_SUCCESS);
		} catch (Exception e) {
			logger.error("edit user's role error:", e);
			br.setResult(Constant.RESULT_SUCCESS);
			br.setReason("edit user's role error!");
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
//			UserInfo u = userService.getUserByName(name);
//			if (u != null) {
//				u.setRoles(new HashSet<RoleInfo>());
//			}
//			br.setResult(Constant.RESULT_SUCCESS);
//			br.setData(u);
		}catch(Exception e){
			logger.error("get user by name error!",e);
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("get user by name error!");
		}
		return br;
	}

	/**
	 * 通过dbid获取用户
	 * 
	 * @param request
	 * @param response
	 * @param dbid
	 * @return @
	 */
	@RequestMapping(value = { "/{dbid}" }, method = RequestMethod.GET)
	@ResponseBody
	public BaseResponse getUserByDbid(HttpServletRequest request,
			HttpServletResponse response, @PathVariable String dbid) {
		BaseResponse br = new BaseResponse();
		if (StringUtils.isBlank(dbid)) {
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("param miss!");
			return br;
		}
		try{
			UserInfo u = userService.selectUserInfoById(dbid);
			if (u != null) {
//				u.setRoles(new HashSet<RoleInfo>());
			}
			br.setResult(Constant.RESULT_SUCCESS);
			br.setData(u);
		}catch(Exception e){
			logger.error("get user by id error!",e);
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("get user by id error!");
		}
		return br;
	}
}
