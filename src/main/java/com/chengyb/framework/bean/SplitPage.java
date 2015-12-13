package com.chengyb.framework.bean;

import java.io.Serializable;

//import com.chengyb.core.cache.ApplicationCache;
import com.chengyb.framework.utils.StringUtils;

/**
 * 
 * 
 * <p>
 * Title: <b>SplitPage 分页类</b>
 * </p>
 * 
 * <p>
 * Description: 分页类 包含当前页，每页显示行数
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2009
 * </p>
 * 
 * <p>
 * Company: www.chengyb.com
 * </p>
 * 
 * @author chengyb
 * @version 1.0
 * @date 2009-3-30
 * 
 */
public class SplitPage implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public static final int CONST_CURRPAGE = 1;
	public static int CONST_NUMPERPAGE = 20;
	public static final int CONST_MAX_NUMPERPAGE = 1000000;

	/**
	 * 当前页面
	 */
	private int currPage = CONST_CURRPAGE;
	/**
	 * 每页显示行数
	 */
	private int numPerPage = CONST_NUMPERPAGE;

	/**
	 * 设置静态的初始化变量
	 */
	public static void init() {
		try {
//			CONST_NUMPERPAGE = StringUtils.parseInt(ApplicationCache.getCo("NUMPERPAGE"));
		} catch (Exception ex) {
		}
	}

	/**
	 * 构造函数
	 */
	public SplitPage() {
	}

	/**
	 * 构造函数
	 * 
	 * @param currPage
	 *            当前页
	 * @param numPerPage
	 *            每页显示行数
	 */
	public SplitPage(int currPage, int numPerPage) {
		this.currPage = currPage;
		this.numPerPage = numPerPage;

		if (currPage < 1) {
			currPage = CONST_CURRPAGE;
		}

		if (numPerPage < 1) {
			numPerPage = CONST_NUMPERPAGE;
		}
		if (numPerPage > CONST_MAX_NUMPERPAGE) {
			numPerPage = CONST_MAX_NUMPERPAGE;
		}
	}

	/**
	 * 构造函数
	 * 
	 * @param currPage
	 *            当前页
	 * @param numPerPage
	 *            每页显示行数
	 */
	public SplitPage(Integer currPage, Integer numPerPage) {

		try {
			this.currPage = currPage.intValue();
		} catch (Exception ex) {
			this.currPage = CONST_CURRPAGE;
		}
		try {
			this.numPerPage = numPerPage.intValue();
		} catch (Exception ex) {
			this.numPerPage = CONST_NUMPERPAGE;
		}

		if (currPage < 1) {
			currPage = CONST_CURRPAGE;
		}

		if (numPerPage < 1) {
			numPerPage = CONST_NUMPERPAGE;
		}
		if (numPerPage > CONST_MAX_NUMPERPAGE) {
			numPerPage = CONST_MAX_NUMPERPAGE;
		}
	}

	/**
	 * 构造函数
	 * 
	 * @param currPage
	 *            当前页
	 * @param numPerPage
	 *            每页显示行数
	 */
	public SplitPage(String currPage, String numPerPage) {

		try {
			this.currPage = Integer.parseInt(currPage);
		} catch (Exception ex) {
			this.currPage = CONST_CURRPAGE;
		}
		try {
			this.numPerPage = Integer.parseInt(numPerPage);
		} catch (Exception ex) {
			this.numPerPage = CONST_NUMPERPAGE;
		}
	}

	/**
	 * 当前页面
	 * 
	 * @return int
	 */
	public int getCurrPage() {
		if (currPage < 1) {
			currPage = CONST_CURRPAGE;
		}
		return currPage;
	}

	/**
	 * 每页行数
	 * 
	 * @return int
	 */
	public int getNumPerPage() {
		if (numPerPage < 0) {
			numPerPage = CONST_NUMPERPAGE;
		}
		if (numPerPage == 0) {
			numPerPage = 1;
		}
		return numPerPage;
	}

	/**
	 * 当前页面
	 * 
	 * @param currPage
	 */
	public void setCurrPage(int currPage) {
		if (currPage < 1) {
			currPage = CONST_CURRPAGE;
		}

		this.currPage = currPage;
	}

	/**
	 * 每页行数
	 * 
	 * @param numPerPage
	 */
	public void setNumPerPage(int numPerPage) {
		if (numPerPage < 1) {
			numPerPage = CONST_NUMPERPAGE;
		}
		if (numPerPage > CONST_MAX_NUMPERPAGE) {
			numPerPage = CONST_MAX_NUMPERPAGE;
		}
		this.numPerPage = numPerPage;
	}
}
