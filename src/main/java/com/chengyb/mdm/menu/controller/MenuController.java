/** 
* 
*/
package com.chengyb.mdm.menu.controller;

import java.io.IOException;
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
import com.chengyb.mdm.menu.service.MenuService;
import com.chengyb.mdm.menu.valueobject.MenuInfo;
import com.chengyb.mdm.role.service.RoleService;
import com.chengyb.mdm.role.valueobject.RoleInfo;
import com.chengyb.mdm.user.service.UserService;
import com.chengyb.mdm.user.valueobject.UserInfo;

/**
 * @ClassName: MenuController 
 * @Description: 菜单控制器
 * @author tianli 
 * @date 2014-8-7 下午7:01:33 
 */

@Controller
@RequestMapping(value = {"/menu"} )
public class MenuController extends BaseController {
	
	private static final Logger logger = LoggerFactory.getLogger(MenuController.class);
	
	@Autowired
	private UserService userService;
	@Autowired
	private RoleService roleService;
	@Autowired
	private MenuService menuService;
	
	
	/**
	 * 
	 * @method manageMenu: 菜单管理界面
	 * @param request
	 * @param response
	 * @return String    
	 * @throws
	 */
	@RequestMapping(value = {"/manageMenu"}, method = RequestMethod.GET)
	public String manageMenu(HttpServletRequest request, HttpServletResponse response){
	    return "menu/menu";
	}
	
	/**
	 * 
	 * @method listMenu: 菜单列表展示
	 * @param request
	 * @param response
	 * @return BaseResponse    
	 * @throws
	 */
	@RequestMapping(value = {"/listMenu"}, method = RequestMethod.GET )
    @ResponseBody
    public BaseResponse listMenu(HttpServletRequest request, HttpServletResponse response){
	    BaseResponse br = new BaseResponse();
//	    Scroller scroller = new Scroller();
//	    // 当前页面发出的请求次数
//        Integer sEcho = ServletRequestUtils.getIntParameter(request, "sEcho", 0);
//        //搜索词
//        String sSearch = ServletRequestUtils.getStringParameter(request, "sSearch", null);
//        // 查询开始的序号
//        Integer iDisplayStart = ServletRequestUtils.getIntParameter(request, "iDisplayStart", 0);
//        // 单次查询的size
//        Integer iDisplayLength = ServletRequestUtils.getIntParameter(request, "iDisplayLength", 10);
//        scroller.setPageNo(iDisplayStart / iDisplayLength + 1);
//        scroller.setPageSize(iDisplayLength);
//        List<MenuInfo> menus = null;
//	    try {
//	        sSearch = new String(sSearch.getBytes("ISO8859-1"),"utf-8").trim();
//	        if(StringUtils.isBlank(sSearch)){
//	            menus = menuService.getAllByScroller(scroller);
//	        }else{
//	            menus = menuService.fuzzyQueryMenu(sSearch,scroller);//搜索词查询
//	        }
//            for (MenuInfo m : menus) {
//                if (m.getParent() != null) {// 排除父亲是根菜单的情况
//                    m.getParent().setChildren(null);//将父亲的孩子设为空,解决回环问题
//                    if(m.getParent().getParent() != null){
//                        //m.getParent().setParent(null);
//                        m.getParent().getParent().setChildren(null);
//                    }
//                }
//                m.setChildren(null);
//            }
//            br.setResult(Constant.RESULT_SUCCESS);
//            br.setiTotalRecords(Integer.valueOf(scroller.getRecordCount()));
//            br.setiTotalDisplayRecords(Integer.valueOf(scroller.getRecordCount()));
//            br.setData(menus);
//        } catch (Exception e) {
//            logger.error("query menu AllList error:",e);
//            br.setResult(Constant.RESULT_FAILED);
//            br.setReason("query menu AllList error!");
//        }
    return br;
	}
	
	/**
	 * 
	 * @method subMenu: 二级菜单显示
	 * @param request
	 * @param response
	 * @return BaseResponse    
	 * @throws
	 */
	@RequestMapping(value={"/subMenu"} , method=RequestMethod.GET)
    @ResponseBody
     public BaseResponse subMenu(HttpServletRequest request, HttpServletResponse response){
        BaseResponse br = new BaseResponse();
//        try {
//            List<MenuInfo> menus = menuService.findSubMenuByRoot();
//            for(MenuInfo m : menus){
//                m.setParent(null);
//                m.setChildren(null);
//            }
//            br.setResult(Constant.RESULT_SUCCESS);
//            br.setiTotalRecords(menus.size());
//            br.setiTotalDisplayRecords(menus.size());
//            br.setData(menus);
//        } catch (Exception e) {
//            logger.error("query subMenu error:", e);
//            br.setResult(Constant.RESULT_FAILED);
//            br.setReason("query subMenu error!");
//        }
        return br;
	}
	
	/**
	 * 
	 * @method addMenu: 增加菜单
	 * @param request
	 * @param response
	 * @return BaseResponse    
	 * @throws
	 */
	@RequestMapping(value={"/addMenu"} , method=RequestMethod.POST)
	@ResponseBody
	 public BaseResponse addMenu(HttpServletRequest request, HttpServletResponse response){
	    BaseResponse br = new BaseResponse();
	    String parentId = ServletRequestUtils.getStringParameter(request, "parentId", "");
	    String name = ServletRequestUtils.getStringParameter(request, "name", "");
	    String nameEn = ServletRequestUtils.getStringParameter(request, "nameEn", "");
	    String urlPath = ServletRequestUtils.getStringParameter(request, "urlPath", "");
	    String description = ServletRequestUtils.getStringParameter(request, "description", "");
	    //对接收到的数据判空
	    if(StringUtils.isBlank(parentId) || StringUtils.isBlank(name) || StringUtils.isBlank(urlPath) ){
	    	br.setResult(Constant.RESULT_FAILED);
			br.setReason("param miss!");
			return br;
	    }
	    
	    try {
//            menuService.addMenu(parentId,name,nameEn,urlPath,description);
            br.setResult(Constant.RESULT_SUCCESS);
        } catch (Exception e) {
            logger.error("createMenu error:",e);
            br.setResult(Constant.RESULT_FAILED);
            br.setReason("createMenu error!");
        }
	    return br;
	}
	
	/**
	 * 
	 * @method getMenuById: 根据id查询菜单信息
	 * @param request
	 * @param response
	 * @return BaseResponse    
	 * @throws
	 */
	@RequestMapping(value={"/{dbid}"} , method=RequestMethod.GET)
    @ResponseBody
     public void getMenuById(HttpServletRequest request, HttpServletResponse response,@PathVariable String dbid){
        BaseResponse br = new BaseResponse();
        String menu = null;
        try {
            menu = menuService.selectMenuInfoById(dbid).getName_();
            response.setCharacterEncoding("utf-8");
            response.setContentType("application/json;character=utf-8");
            response.getWriter().write(menu);
        } catch (Exception e) {
            logger.error("getMenuById error:",e);
        }
	}
	
	@RequestMapping(value={"/editMenu"} , method=RequestMethod.POST)
    @ResponseBody
    public BaseResponse editMenu(HttpServletRequest request, HttpServletResponse response){
        BaseResponse br = new BaseResponse();
        String dbid = ServletRequestUtils.getStringParameter(request, "dbid", "");
        String parentId = ServletRequestUtils.getStringParameter(request, "parentId", "");
        String name = ServletRequestUtils.getStringParameter(request, "name", "");
        String nameEn = ServletRequestUtils.getStringParameter(request, "nameEn", "");
        String urlPath = ServletRequestUtils.getStringParameter(request, "urlPath", "");
        String description = ServletRequestUtils.getStringParameter(request, "description", "");
        //对接收到的数据判空
        if(StringUtils.isBlank(dbid) || StringUtils.isBlank(name)|| StringUtils.isBlank(parentId)  || StringUtils.isBlank(urlPath) ){
	    	br.setResult(Constant.RESULT_FAILED);
			br.setReason("param miss!");
			return br;
	    }
        try {
//            menuService.updateMenu(dbid,parentId,name,nameEn,urlPath,description);
            br.setResult(Constant.RESULT_SUCCESS);
        } catch (Exception e) {
            logger.error("editMenu error:",e);
            br.setResult(Constant.RESULT_FAILED);
            br.setReason("editMenu error!");
        }
        return br;
	}
	
	
	/**
	 * 
	 * @method deleteMenu: 根据id删除菜单
	 * @param request
	 * @param response
	 * @param dbid
	 * @return BaseResponse    
	 * @throws
	 */
	@RequestMapping(value={"/delete/{dbid}"} , method=RequestMethod.DELETE)
    @ResponseBody
     public BaseResponse deleteMenu(HttpServletRequest request, HttpServletResponse response,@PathVariable String dbid){
        BaseResponse br = new BaseResponse();
        try {
//            menuService.deleteMenuById(dbid);
            br.setResult(Constant.RESULT_SUCCESS);
        } catch (Exception e) {
            logger.error("deleteMenu error:",e);
            br.setResult(Constant.RESULT_FAILED);
            br.setReason("deleteMenu error!");
        }
        return br;
	}
	
	/**
	 * menu列表  不带子节点和url
	 * @param request
	 * @param response
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = {"/list"}, method = RequestMethod.GET )
	@ResponseBody
	public BaseResponse list(HttpServletRequest request, HttpServletResponse response){
		BaseResponse br = new BaseResponse();
//		try {
//			List<Menu> menus = menuService.getAll();
//			for(Menu m : menus){
//				m.setChildren(null);
//				m.setUrlPath(null);
//			}
//			br.setResult(Constant.RESULT_SUCCESS);
//			br.setData(menus);
//		} catch (Exception e) {
//			logger.error("query menu list error:",e);
//			br.setResult(Constant.RESULT_FAILED);
//			br.setReason("query menu list error!");
//		}
		return br;
	}
	
	/**
	 * 通过用户权限查询用户的menu列表
	 * @param request
	 * @param response
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = {"/listByUser"}, method = RequestMethod.GET )
	@ResponseBody
	public BaseResponse listByUser(HttpServletRequest request, HttpServletResponse response){
		BaseResponse br = new BaseResponse();
		List<Map<String, Object>>  menuList = new ArrayList<Map<String, Object>>();
		try {
			UserInfo user = (UserInfo)request.getSession().getAttribute("user");
			user = userService.selectUserInfoById(user.getDbid_());
			List<RoleInfo> roles = roleService.selectRoleInfoByUserid(user.getDbid_());
//			Set<Authority> as = new HashSet<Authority>();
			boolean isRoot = false;
			for(RoleInfo r : roles){
				if(r.getName_().equals("root")){
					isRoot = true;
					break;
				}
//				as.addAll(r.getAuthorities());
			}
			if(isRoot){
				List<MenuInfo> menus = menuService.selectMenuInfoByCond(null, null);
				for(MenuInfo m : menus){
					Map<String, Object> map = new HashMap<String, Object>();
					map.put("dbid", m.getDbid_());
					map.put("name", m.getName_());
					map.put("nameEn", m.getName_en_());
					map.put("parentId",m!=null && m.getParent_id_()!=null?m.getParent_id_():"");
					map.put("order",m.getOrder_());
					map.put("urlPath",m.getUrl_());
					menuList.add(map);
				}
			}else{
//				for(Authority a : as){
//					if(a.getType().equals(AuthorityType.MENU)){
//						Menu m = menuService.getByID(a.getResourceId());
//						Map<String, Object> map = new HashMap<String, Object>();
//						map.put("dbid", m.getDbid());
//						map.put("name", m.getName());
//						map.put("nameEn", m.getNameEn());
//						map.put("parentId",m!=null && m.getParent()!=null?m.getParent().getDbid():"");
//						map.put("order",m.getOrder());
//						map.put("urlPath",m.getUrlPath());
//						menuList.add(map);
//					}
//				}
			}
			
			br.setResult(Constant.RESULT_SUCCESS);
			br.setData(menuList);
		} catch (Exception e) {
			logger.error("query menu list error:",e);
			br.setResult(Constant.RESULT_FAILED);
			br.setReason("query menu list error!");
		}
		return br;
	}
}
