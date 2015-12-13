package com.chengyb.core.utils;


import java.util.HashMap;

public class UserManager {
	
	private final static HashMap<String,String> map =new HashMap<String,String>();
	private final static UserManager userManager =new UserManager();
	private UserManager (){
		
	}
	
	public static  UserManager newUserManager(){
		return userManager;
	}
	
	public static void login(String sessionid,String usercode){
		map.put(sessionid, usercode);
	}
	
	public static void logout(String sessionid){
		map.remove(sessionid);
	}
	
	
	public static int getCurrentUserCnt(){
		return map.size();
	}
}