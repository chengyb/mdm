package com.chengyb.mdm.login.controller;

import java.io.IOException;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chengyb.framework.springmvc.BaseResponse;
import com.chengyb.framework.springmvc.Constant;
import com.chengyb.framework.utils.MD5Utils;
import com.chengyb.mdm.menu.service.MenuService;
import com.chengyb.mdm.user.service.UserService;
import com.chengyb.mdm.user.valueobject.UserInfo;
import com.google.gson.Gson;

@Controller
public class LoginController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

	@Autowired
	private UserService userService;
	@Autowired
	private MenuService menuService;
	
	/**
	 * 进入dashboard页面
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = {"/dashboard"}, method = RequestMethod.GET )
	public String loginPage(HttpServletRequest request, HttpServletResponse response){
		return "dashboard";
		
	}
	
	/**
     * 进入clustermanager页面
     * @param request
     * @param response
     * @return
     */
	@RequestMapping(value = {"/clustermanager"}, method = RequestMethod.GET )
    public String clusterManager(HttpServletRequest request, HttpServletResponse response){
        return "monitor/clustermanager";
        
    }
	
	/**
	 * 登录
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = {"/login"}, method = RequestMethod.POST )
	public String login(HttpServletRequest request, HttpServletResponse response, HttpSession session) 
			throws IOException {
		String username = ServletRequestUtils.getStringParameter(request, "username","");
		String password = ServletRequestUtils.getStringParameter(request, "password","");

		UserInfo user = userService.selectUserInfoByName(username);
		String md5_password = MD5Utils.encode(password);
		if(user == null){
			logger.info("用户不存在！");
			request.setAttribute("loginFailCause", "用户不存在！");
			return "login";
		}else{
			if( !md5_password.equals(user.getPassword_())){
				logger.info("用户名或密码错误！md5_password:{}, user_password：{}",md5_password, user.getPassword_());
				request.setAttribute("loginFailCause", "用户名或密码错误！");
				return "login";
			}else{
				session.setAttribute("user", user);
				//session.setMaxInactiveInterval(60*60*1000);
				logger.info("登录成功！");
				response.sendRedirect("/eSight/admin/dashboard");
				return null;
			}
		}
	}

	
	/**
	 * 登出
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping(value = {"/logout"}, method = RequestMethod.GET )
	public String logout(HttpServletRequest request, HttpServletResponse response, HttpSession session){
		session.removeAttribute("user");
		return "login";
	}
	
	
	/**
	 * 修改密码
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/chgPwd", method = RequestMethod.POST)
	@ResponseBody
	public BaseResponse changePassword(HttpServletRequest request, HttpServletResponse response, HttpSession session){
	    BaseResponse br = new BaseResponse();
	    String oldPassword = ServletRequestUtils.getStringParameter(request, "oldPassword","");
	    String newPassword = ServletRequestUtils.getStringParameter(request, "newPassword","");
	    UserInfo user = (UserInfo) session.getAttribute("user");
	    try{
	        String md5_oldPassword = MD5Utils.encode(oldPassword);
	        if(!md5_oldPassword.equals(user.getPassword_())){
	            logger.info("旧密码输入错误！md5_oldPassword:{}, user_password：{}",md5_oldPassword, user.getPassword_());
	            br.setResult(Constant.RESULT_FAILED);
	        }else{
//	            userService.updatePassword(user,newPassword);
	            session.setAttribute("user", user);
	            br.setResult(Constant.RESULT_SUCCESS);
	        }
	        br.setData(user);
	    }catch(Exception e){
	        logger.error("chgPwd error", e);
	        br.setResult(Constant.RESULT_FAILED);
	        br.setReason("chgPwd error");
	    }
		return br;
	}
	
}
