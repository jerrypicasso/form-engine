<%@page import="java.util.List"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="java.util.Map"%>
<%@page import="java.sql.Statement"%>
<%@page import="java.sql.Connection"%>
<%@page import="com.neusoft.hit.fe.core.utility.DBUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>test</title>
<link rel="stylesheet" type="text/css" href="toastr.css" />
<link rel="stylesheet" type="text/css" href="select2.css" />
<link rel="stylesheet" type="text/css" href="form.css" />
<link rel="stylesheet" href="css/font-awesome.css" />
<link rel="stylesheet" href="kindeditor/themes/default/default.css" />
<link rel="stylesheet" href="kindeditor/plugins/code/prettify.css" />
<!-- <link rel="stylesheet" href="jquery-ui-1.12.0/jquery-ui.min.css" />
<link rel="stylesheet" href="jquery-ui-1.12.0/ext/jquery-ui-timepicker-addon.min.css" /> -->
<script type="text/javascript" src="jquery-1.9.1.js"></script>
<!-- <script type="text/javascript" src="jquery-2.0.3.min.js"></script> -->
<!-- <script type="text/javascript" src="jquery-ui-1.12.0/jquery-ui.min.js"></script>
<script type="text/javascript" src="jquery-ui-1.12.0/ext/jquery-ui-timepicker-addon.min.js"></script> -->
<script type="text/javascript" src="My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="kindeditor/kindeditor-all-min.js"></script>
<script type="text/javascript" src="kindeditor/lang/zh-CN.js"></script>
<script type="text/javascript" src="kindeditor/plugins/code/prettify.js"></script>
<script type="text/javascript" src="layer/layer.js"></script>
<script type="text/javascript" src="toastr.min.js"></script>
<script type="text/javascript" src="select2.min.js"></script>
<script type="text/javascript" src="engine.js"></script>
<script type="text/javascript" src="plugin-diagnosis.js"></script>
<script type="text/javascript" src="plugin-nursing.js"></script>

<script type="text/javascript">
	$(document).ready(function(){
		$('#queryBtn').click(function(){
			var tplName = $('#chooseTpl').val();
			$('#container').form('load', {
				'patientCode': '1459047',
				'staffCode':'9527',
				'jzxh':'2009188',
				'category':tplName
			});
		});
		$('#changeModeBtn').click(function(){
			$('#container').form('toggle');
		});
		$('#tempSaveBtn').click(function(){
			var tplName = $('#chooseTpl').val();
			$('#container').form('stage');
		});
		$('#saveBtn').click(function(){
			$('#container').form('save');
		});
		$('#printBtn').click(function() {
			$('#container').form('export', {
				type:'pdf'
			});
		});
		
		//禁用右键菜单
		$(document).bind("contextmenu",function(e){
	        return false;
	    });
	});
</script>
<style type="text/css">
	.button-bar {
		position: fixed;
		top:0;
		left:0;
		right:0;
		height:30px;
		background:rgb(0,191,255);
	}
	
	#container {
		position:fixed;
		top:30px;
		left:0;
		right:0;
		bottom:0;
		overflow:auto;
	}
</style>
</head>
<body style="font-family:SimSun;font-size:14px;background:#cdcdcd;">
	<div class="button-bar">
		<select id="chooseTpl" style="width:200px;float:left;vertical-align:middle;">
		<%
			List<Map<String, Object>> list = null;
			Connection conn = null;
			Statement stmt = null;
			ResultSet rs = null;
			String sql = "SELECT DISTINCT CODE FROM FORM_TEMPLATE_STORAGE";
			try {
				conn = DBUtil.getConnection();
				stmt = conn.createStatement();
				rs = stmt.executeQuery(sql);
				list = DBUtil.getMultiResults(rs);
			}
			catch(Exception e) {
				e.printStackTrace();
			}
			finally {
				DBUtil.close(conn, stmt, rs);
			}
			for(Map<String, Object> map : list) {
				String tplName = map.get("CODE").toString();
		%>	
				<option value="<%= tplName%>"><%= tplName %></option>
		<%
			}
		%>
		</select>
	
		<input id="editorTestBtn" type="button" value="显示"/>
		<input id="queryBtn" style="float:left;vertical-align:middle;" type="button" value="查询">
		<input id="changeModeBtn" style="float:left;vertical-align:middle;" type="button" value="编辑"/>
		<input id="tempSaveBtn" style="float:left;vertical-align:middle;" type="button" value="暂存"/>
		<input id="saveBtn" style="float:left;vertical-align:middle;" type="button" value="保存"/>
		<input id="printBtn" type="button" style="float:right;vertical-align:middle;" value="打印"/>
		<input id="exportXls" type="button" style="float:right;vertical-align:middle;" value="导出excel"/>
		<input id="exportDoc" type="button" style="float:right;vertical-align:middle;" value="导出word"/>
	</div>
	<div id="container"></div>
</body>
</html>