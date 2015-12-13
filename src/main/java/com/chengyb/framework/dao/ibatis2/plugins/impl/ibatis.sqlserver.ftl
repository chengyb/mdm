<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE sqlMap PUBLIC "-//ibatis.apache.org//DTD SQL Map 2.0//EN" "http://ibatis.apache.org/dtd/sql-map-2.dtd">
	<sqlMap namespace="${table.namespace}">
	<typeAlias alias="${table.alias}" type="${table.entity.name}" />
	<insert id="create${table.entity.simpleName}" parameterClass="${table.alias}">
	<![CDATA[  
    	insert into ${table.name} (${table.pk.name?upper_case}
   	]]>
		<dynamic prepend="">
			<#foreach column in table.column?if_exists>
			<isNotNull prepend="," property="${column.name}">${column.name?upper_case}</isNotNull>
			</#foreach>
		</dynamic>
	<![CDATA[
	) values (#${table.pk.name}#
	]]>
		<dynamic prepend="">
			<#foreach column in table.column?if_exists>
			<isNotNull prepend="," property="${column.name}">#${column.name}#</isNotNull>
			</#foreach>
		</dynamic>
	<![CDATA[
	 )
	 ]]>
	 <selectKey resultClass="Long" keyProperty="tid">
		<![CDATA[
		SELECT @@IDENTITY AS TID
		]]>
	</selectKey>
	</insert>
	<delete id="delete${table.entity.simpleName}">
		<![CDATA[  
    		delete ${table.name} where ${table.pk.name?upper_case} = #${table.pk.name}#
   		]]>
	</delete>
	
	<update id="update${table.entity.simpleName}">
	<![CDATA[  
    	update ${table.name} set ${table.pk.name?upper_case} = #${table.pk.name}#
   	]]>
		<dynamic prepend="">
			<#foreach column in table.column?if_exists>
			<isNotNull prepend="," property="${column.name}">${column.name?upper_case} = #${column.name}#</isNotNull>
			</#foreach>
		</dynamic>
	<![CDATA[
	  where ${table.pk.name?upper_case} = #${table.pk.name}#
	 ]]>
	</update>
	
	<select id="select${table.entity.simpleName}ById" resultClass="${table.alias}">
	<![CDATA[  
    	select * from ${table.name} where  ${table.pk.name?upper_case} = #value#
   	]]>
	</select>

	<select id="select${table.entity.simpleName}" resultClass="${table.alias}">
	<![CDATA[  
    	select T.* from ${table.name} T where 1 = 1
   	]]>
		<dynamic prepend="">
		    <isNotEmpty prepend=" and " property="${table.pk.name}">${table.pk.name?upper_case} like '$${table.pk.name}$%'</isNotEmpty>
			<#foreach column in table.column?if_exists>
			<isNotEmpty prepend=" and " property="${column.name}">${column.name?upper_case} like '$${column.name}$%'</isNotEmpty>
			</#foreach>
		</dynamic>
	<![CDATA[
	 order by ${table.pk.name?upper_case} desc
	 ]]>
	</select>
	
	<select id="select${table.entity.simpleName}ByCond" resultClass="${table.alias}" parameterClass="java.util.Map">
	<![CDATA[
    	select T.* from ${table.name} T where 1 = 1
   	]]>
		<dynamic prepend="">
			<isNotEmpty prepend=" and " property="${table.pk.name}">${table.pk.name?upper_case} like '$${table.pk.name}$%'</isNotEmpty>		
			<#foreach column in table.column?if_exists>
			<isNotEmpty prepend=" and " property="${column.name}">${column.name?upper_case} like '$${column.name}$%'</isNotEmpty>
			</#foreach>
		</dynamic>
	<![CDATA[
	 order by ${table.pk.name?upper_case} desc
	 ]]>
	</select>
</sqlMap>

