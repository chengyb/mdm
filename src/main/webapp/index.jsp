<%@page import="com.chengyb.mdm.user.valueobject.UserInfo"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	UserInfo user = (UserInfo) request.getSession().getAttribute("user");

	if (user == null) {
%>
	<jsp:forward page="login.jsp" />
<%
	} else {
		response.sendRedirect("/eSight/admin/dashboard");
		return;
	}
%>
