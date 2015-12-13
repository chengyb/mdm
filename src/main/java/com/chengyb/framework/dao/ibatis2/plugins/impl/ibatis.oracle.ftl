<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE sqlMap PUBLIC "-//ibatis.apache.org//DTD SQL Map 2.0//EN" "http://ibatis.apache.org/dtd/sql-map-2.dtd">
	<sqlMap namespace="${table.namespace}">
	<typeAlias alias="${table.alias}" type="${table.entity.name}" />
	<insert id="insert${table.entity.simpleName}" parameterClass="${table.alias}">
	<#if table.pk.generatedValue?default("true")=="true">
	<selectKey resultClass="Long" keyProperty="${table.pk.nick}">
              SELECT ${table.pk.seq?default("SEQ_SRM")}.NEXTVAL AS ID FROM DUAL
     </selectKey>
	</#if>
	<![CDATA[  
    	insert into ${table.name} (${table.pk.name?upper_case}
   	]]>
		<dynamic prepend="">
			<#foreach column in table.column?if_exists>
			<isNotNull prepend="," property="${column.nick}">${column.name?upper_case}</isNotNull>
			</#foreach>
		</dynamic>
	<![CDATA[
	) values (#${table.pk.nick}#
	]]>
		<dynamic prepend="">
			<#foreach column in table.column?if_exists>
			<isNotNull prepend="," property="${column.nick}">#${column.nick}#</isNotNull>
			</#foreach>
		</dynamic>
	<![CDATA[
	 )
	 ]]>
	</insert>
	<delete id="delete${table.entity.simpleName}">
		<![CDATA[  
    		delete ${table.name} where ${table.pk.name?upper_case} = #${table.pk.nick}#
   		]]>
	</delete>
	
	<update id="update${table.entity.simpleName}">
	<![CDATA[  
    	update ${table.name}
   	]]>
		<dynamic prepend="set">
			<#foreach column in table.column?if_exists>
			<isNotNull prepend="," property="${column.nick}">${column.name?upper_case} = #${column.nick}#</isNotNull>
			</#foreach>
		</dynamic>
	<![CDATA[
	  where ${table.pk.name?upper_case} = #${table.pk.nick}#
	 ]]>
	</update>
	
	<select id="select${table.entity.simpleName}ById" resultClass="${table.alias}">
	<![CDATA[  
    	select * from ${table.name} where  ${table.pk.name?upper_case} = #value#
   	]]>
	</select>
	
	<select id="select${table.entity.simpleName}ByCond" resultClass="${table.alias}" parameterClass="java.util.Map">
	<![CDATA[
    	select T.* from ${table.name} T where 1 = 1
   	]]>
		<dynamic prepend="">
			<isNotEmpty prepend=" and " property="${table.pk.nick}">${table.pk.name?upper_case} = #${table.pk.nick}#</isNotEmpty>		
			<#foreach column in table.column?if_exists>
			<#if column.name?lower_case?ends_with('code')>
			<isNotEmpty prepend=" and " property="${column.nick?lower_case}">${column.name?upper_case} like #${column.nick?lower_case}#||'%'</isNotEmpty>
			<#elseif column.name?lower_case?ends_with('id')>
			<isNotEmpty prepend=" and " property="${column.nick?lower_case}">${column.name?upper_case} = #${column.nick?lower_case}#</isNotEmpty>
			<#elseif column.name?lower_case?ends_with('type')>
			<isNotEmpty prepend=" and " property="${column.nick?lower_case}">${column.name?upper_case} = #${column.nick?lower_case}#</isNotEmpty>
			<#elseif column.type?lower_case=='date'>
			<isNotEmpty prepend=" and " property="${column.nick?lower_case}_start">${column.name?upper_case} >= #${column.nick}_start#</isNotEmpty>
			<isNotEmpty prepend=" and " property="${column.nick?lower_case}_end">${column.name?upper_case} <= #${column.nick}_end#</isNotEmpty>
			<#else>
			<isNotEmpty prepend=" and " property="${column.nick?lower_case}">${column.name?upper_case} like '%'||#${column.nick}#||'%'</isNotEmpty>
			</#if>
			</#foreach>
		</dynamic>
	<![CDATA[
	<#assign ordername=table.pk.name?upper_case >
	<#foreach column in table.column?if_exists>
	<#if column.name?lower_case =='ordercode'>
		<#assign ordername=column.name >
	<#else>
	</#if>
	</#foreach>
	 order by ${ordername} desc
	 ]]>
	</select>
</sqlMap>
