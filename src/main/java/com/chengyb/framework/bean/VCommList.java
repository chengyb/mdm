package com.chengyb.framework.bean;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * 
 * 
 * <p>
 * Title: <b>VCommList.java</b>
 * </p>
 * 
 * <p>
 * Description:
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
public class VCommList<E> extends ArrayList<E> {

	private static final long serialVersionUID = 1L;

	/**
	 * 当前页面
	 */
	private int currPage;
	/**
	 * 总记录数
	 */
	private int num;

	/**
	 * 每页显示行数
	 */
	private int numPerPage; // 每页显示行数

	/**
	 * 页数
	 */
	private int pageNum;

	/**
	 * 合计的HashMap
	 */
	private HashMap<String,Object> sumInfo = new HashMap<String,Object>();

	/**
	 * 总记录数
	 * 
	 * @return int
	 */
	public int getNum() {
		return num;
	}

	/**
	 * 总记录数
	 * 
	 * @param num
	 *            int
	 */
	public void setNum(int num) {
		this.num = num;
	}

	/**
	 * 每页显示行数
	 * 
	 * @param numPerPage
	 */
	public void setNumPerPage(int numPerPage) {
		this.numPerPage = numPerPage;
	}

	/**
	 * 每页显示行数
	 * 
	 * @return
	 */
	public int getNumPerPage() {
		return numPerPage;
	}

	/**
	 * 当前页面
	 * 
	 * @param currPage
	 */
	public void setCurrPage(int currPage) {
		this.currPage = currPage;
	}

	/**
	 * 当前页面
	 * 
	 * @return
	 */
	public int getCurrPage() {
		return currPage;
	}

	/**
	 * 页数
	 * 
	 * @param pageNum
	 */
	public void setPageNum(int pageNum) {
		this.pageNum = pageNum;
	}

	/**
	 * 合计的 Map
	 * 
	 * @param sumInfo
	 */
	public void setSumInfo(HashMap<String,Object> sumInfo) {
		this.sumInfo = sumInfo;
	}

	/**
	 * 页数
	 * 
	 * @return
	 */
	public int getPageNum() {
		return pageNum;
	}

	/**
	 * 合计的Map
	 * 
	 * @return
	 */
	public HashMap<String,Object> getSumInfo() {
		return sumInfo;
	}
}
