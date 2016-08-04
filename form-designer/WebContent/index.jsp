<%@page import="com.neusoft.hit.emr.fd.util.DBUtil" %>
<%@page import="java.util.List" %>
<%@page import="java.util.Map" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    List<Map<String, Object>> list = DBUtil.getMultiResults("SELECT * FROM COMBO_WIDGET_CONFIG WHERE 'DEL_FLAG' != '1'");
    request.setAttribute("combos", list);
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>表单模板编辑器</title>
    <link rel="stylesheet" type="text/css" href="css/toastr.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/form-designer.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-table.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-iterator.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-text-static.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-text-dynamic.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-field-hidden.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-field-text.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-field-date.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-field-dict.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-field-staff.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-field-number.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-field-select.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-page-count.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-page-number.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-plugin.css"/>
    <link rel="stylesheet" type="text/css" href="css/custom/widget-condition.css"/>
    <link rel="stylesheet" type="text/css" href="css/plugins/widget-custom-diagnosis.css"/>
    <link rel="stylesheet" type="text/css" href="css/plugins/widget-plugin-nursing.css"/>
    <script type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
    <script type="text/javascript" src="js/toastr.min.js"></script>
    <script type="text/javascript" src="js/Math.uuid.js"></script>
    <script type="text/javascript" src="js/custom/fd-common-main.js"></script>
    <script type="text/javascript" src="js/custom/fd-common-dialog.js"></script>
    <script type="text/javascript" src="js/custom/fd-toolbar-dataset.js"></script>
    <script type="text/javascript" src="js/custom/fd-toolbar-operate.js"></script>
    <script type="text/javascript" src="js/custom/fd-toolbar-properties.js"></script>
    <script type="text/javascript" src="js/custom/fd-toolbar-widget.js"></script>
    <script type="text/javascript" src="js/custom/widget-table.js"></script>
    <script type="text/javascript" src="js/custom/widget-iterator.js"></script>
    <script type="text/javascript" src="js/custom/widget-text-static.js"></script>
    <script type="text/javascript" src="js/custom/widget-text-dynamic.js"></script>
    <script type="text/javascript" src="js/custom/widget-field-hidden.js"></script>
    <script type="text/javascript" src="js/custom/widget-field-text.js"></script>
    <script type="text/javascript" src="js/custom/widget-field-date.js"></script>
    <script type="text/javascript" src="js/custom/widget-field-dict.js"></script>
    <script type="text/javascript" src="js/custom/widget-field-staff.js"></script>
    <script type="text/javascript" src="js/custom/widget-field-number.js"></script>
    <script type="text/javascript" src="js/custom/widget-field-select.js"></script>
    <script type="text/javascript" src="js/custom/widget-check.js"></script>
    <script type="text/javascript" src="js/custom/widget-page-count.js"></script>
    <script type="text/javascript" src="js/custom/widget-page-number.js"></script>
    <script type="text/javascript" src="js/custom/widget-plugin.js"></script>
    <script type="text/javascript" src="js/custom/widget-condition.js"></script>
    <script type="text/javascript" src="js/plugins/widget-custom-diagnosis.js"></script>
    <script type="text/javascript" src="js/plugins/widget-plugin-nursing.js"></script>
</head>
<body style="padding:0;margin:0;font-family:SimSun;">
<div class="main-frame">
    <div class="top-panel">
        <table style="width:100%;height:100%;table-layout:fixed;border-collapse:collapse;">
            <tr style="background:rgb(245, 245, 245);">
                <td style="width:80px;" valign="top">
                    <div class="banner-panel">
                        <div style="line-height:30px;">模板编辑器</div>
                    </div>
                    <input id="make-tpl-btn" type="button" style="width:100%;height:27px;" value="新建表单"/>
                    <input id="load-tpl-btn" type="button" style="width:100%;height:27px;" value="载入模版"/>
                    <input id="save-tpl-btn" type="button" style="width:100%;height:27px;" value="保存模版"/>

                    <form enctype="multipart/form-data" style="display:none;">
                        <input name="tplFile" id="load-tpl-btn-hidden" type="file"/>
                    </form>
                </td>
                <td style="width:100px;">
                    <div class="widgets-panel">
                        <div class="widgets-panel-title">
                            <div style="height:100%;">元素列表</div>
                        </div>
                        <div class="widgets"></div>
                    </div>
                </td>
                <td style="width:60px;">
                    <div class="dataset-panel">
                        <div class="dataset-panel-title">
                            <div style="height:100%;display:inline-block;">sql配置</div>
                        </div>
                        <div class="datasets"></div>
                    </div>
                </td>
                <td style="width:100px;">
                    <div class="operate-panel">
                        <div class="operate-panel-title">
                            <div style="height:100%;">元素操作</div>
                        </div>
                        <div class="operates"></div>
                    </div>
                </td>
                <td style="width:183px;">
                    <div class="prop-panel">
                        <div class="prop-panel-title">
                            <div style="height:100%;">页面属性</div>
                        </div>
                        <div class="page-settings properties"></div>
                    </div>
                </td>
                <td style="width:183px;">
                    <div class="prop-panel">
                        <div class="prop-panel-title">
                            <div style="height:100%;">元素属性</div>
                        </div>
                        <div class="widget-settings properties"></div>
                    </div>
                </td>
                <td style="width:183px;">
                    <div class="prop-panel">
                        <div class="prop-panel-title">
                            <div style="height:100%;">常规样式</div>
                        </div>
                        <div class="style-settings properties"></div>
                    </div>
                </td>
                <td style="width:183px;">
                    <div class="prop-panel">
                        <div class="prop-panel-title">
                            <div style="height:100%;">文字样式</div>
                        </div>
                        <div class="font-settings properties"></div>
                    </div>
                </td>
                <td>
                </td>
            </tr>
        </table>
    </div>
    <div class="center-panel" style="position: absolute;top:120px;left:0;right:0;bottom:0;">
        <div class="paper-wrapper">
        </div>
    </div>
</div>


<!-- 模版载入对话框 -->
<div class="load-paper-dialog-tpl" style="width:320px;height:130px;display:none;">
    <div class="dialog-title">载入模版</div>
    <form style="padding:15px;">
        <table style="width:100%;table-layout:fixed;">
            <tr>
                <td style="width:100%;" valign="top">
                    <select name="paper-code" style="width:100%;height:100%;"></select>
                </td>
            </tr>
            <tr>
                <td colspan="2" align="center">
                    <div class="ok-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        确定
                    </div>
                    <div style="width:30px;display:inline-block;"></div>
                    <div class="cancel-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        取消
                    </div>
                </td>
            </tr>
        </table>
    </form>
</div>
<!-- 创建表单模版初始化设置 -->
<div class="paper-init-config-dialog-tpl" style="width:320px;height:210px;display:none;">
    <div class="dialog-title">初始化配置</div>
    <form style="padding:15px;">
        <table style="width:100%;">
            <tr>
                <td>表单代码</td>
                <td>
                    <input name="paper-code" class="config-item" required="true" style="width:100%;"/>
                </td>
            </tr>
            <tr>
                <td>表单名称</td>
                <td>
                    <input name="paper-name" class="config-item" required="true" style="width:100%;"/>
                </td>
            </tr>
            <tr>
                <td>表单类型</td>
                <td>
                    <select name="paper-type" class="config-item" style="width:100%;">
                        <option selected="selected" value="portrait">垂直</option>
                        <option value="landscape">水平</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>对应主表</td>
                <td>
                    <input name="table-name" class="config-item" style="width:100%;"/>
                </td>
            </tr>
            <tr>
                <td colspan="3" align="center">
                    <div class="ok-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        确定
                    </div>
                    <div style="width:30px;display:inline-block;"></div>
                    <div class="cancel-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        取消
                    </div>
                </td>
            </tr>
        </table>
    </form>
</div>
<!-- 弹出框遮罩层 -->
<div class="mask-layer-tpl"
     style="position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,0.3);z-index:190;display:none;">
    <table style="width:100%;height:100%;">
        <tr>
            <td align="center" valign="middle" class="dialog-zone"></td>
        </tr>
    </table>
</div>
<!-- 动静态文本框初始化配置对话框 -->
<div class="text-init-config-dialog-tpl" style="width:320px;height:200px;display:none;">
    <div class="dialog-title">初始化配置</div>
    <form style="padding:15px;">
        <table style="width:100%;">
            <tr>
                <td>内容</td>
                <td>
                    <textarea name="text-val" class="config-item" required="true"
                              style="width:100%;height:100px;"></textarea>
                </td>
            </tr>
            <tr>
                <td colspan="3" align="center">
                    <div class="ok-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        确定
                    </div>
                    <div style="width:30px;display:inline-block;"></div>
                    <div class="cancel-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        取消
                    </div>
                </td>
            </tr>
        </table>
    </form>
</div>
<!-- 迭代控件初始化配置对话框 -->
<div class="iterator-init-config-dialog-tpl" style="width:320px;height:200px;display:none;">
    <div class="dialog-title">初始化配置</div>
    <div style="padding:15px;">
        <table style="width:100%;">
            <tr>
                <td>迭代集合</td>
                <td>
                    <input name="dataset-name" class="config-item" type="text" style="width:100%;" required="true"/>
                    <input name="iterator-name" class="config-item" type="hidden"/>
                </td>
            </tr>
            <!-- <tr>
                <td>分页总数</td>
                <td>
                    <input name="page-count" class="config-item" type="text" style="width:100%;"/>
                </td>
            </tr>
            <tr>
                <td>记录总数</td>
                <td colspan="2">
                    <input name="row-count" class="config-item" type="text" style="width:100%"/>
                </td>
            </tr> -->
            <tr>
                <td>绑定库表</td>
                <td colspan="2">
                    <input name="table-name" class="config-item" type="text" style="width:100%"/>
                </td>
            </tr>
            <tr>
            	<td>主键</td>
            	<td colspan="2">
                    <input name="primary-key" class="config-item" type="text" style="width:100%"/>
                </td>
            </tr>
            <tr>
            	<td>删除键</td>
            	<td colspan="2">
                    <input name="drop-key" class="config-item" type="text" style="width:100%"/>
                </td>
            </tr>
            <tr>
                <td colspan="3" align="center">
                    <div class="ok-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        确定
                    </div>
                    <div style="width:30px;display:inline-block;"></div>
                    <div class="cancel-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        取消
                    </div>
                </td>
            </tr>
        </table>
    </div>
</div>
<!-- 读写字段初始化配置对话框 -->
<div class="field-init-config-dialog-tpl" style="width:320px;height:240px;display:none;">
    <div class="dialog-title">初始化配置</div>
    <div style="padding:15px;">
        <table style="width:100%;">
            <tr>
                <td>实际值</td>
                <td colspan="3">
                    <input name="real-value" class="config-item" type="text" style="width:100%;" required="true">
                </td>
            </tr>
            <tr>
                <td>显示值</td>
                <td colspan="3">
                    <textarea name="disp-value" class="config-item" style="width:100%;height:60px;"></textarea>
                </td>
            </tr>
            <tr>
                <td>表字段</td>
                <td colspan="3">
                    <input name="field-name" class="config-item" type="text" style="width:100%;" required="true"/>
                </td>
            </tr>
            <tr>
                <td>行数据</td>
                <td>
                    <select name="is-row-data" class="config-item" style="width:95px;">
                        <option selected="selected" value="0">否</option>
                        <option value="1">是</option>
                    </select>
                </td>
                <td>主键</td>
                <td>
                    <select name="primary-key" class="config-item" style="width:95px;">
                        <option selected="selected" value="0">否</option>
                        <option value="1">是</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td colspan="4" align="center">
                    <div class="ok-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        确定
                    </div>
                    <div style="width:30px;display:inline-block;"></div>
                    <div class="cancel-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        取消
                    </div>
                </td>
            </tr>
        </table>
    </div>
</div>
<div class="select-init-config-dialog-tpl" style="width:320px;height:300px;display:none;">
    <div class="dialog-title">初始化配置</div>
    <div style="padding:15px;">
        <table style="width:100%;table-layout:fixed;">
            <col style="width:24%;"/>
            <col style="width:26%;"/>
            <col style="width:24%;"/>
            <col style="width:26%;"/>
            <tr>
                <td>实际值</td>
                <td colspan="3">
                    <input name="real-value" class="config-item" type="text" style="width:100%;" required="true">
                </td>
            </tr>
            <tr>
                <td>显示值</td>
                <td colspan="3">
                    <textarea name="disp-value" class="config-item" style="width:100%;height:60px;"></textarea>
                </td>
            </tr>
            <tr>
                <td>库表字段</td>
                <td>
                    <input name="field-name" class="config-item" type="text" style="width:100%;" required="true"/>
                </td>
                <td>依赖字段</td>
                <td>
                    <input name="master" class="config-item" type="text" style="width:100%;"/>
                </td>
            </tr>
            <tr>
                <td>类别</td>
                <td>
                    <select name="category" class="config-item" style="width:100%;" required="true">
                        <c:forEach items="${combos}" var="combo">
                            <option value='${combo["CODE"]}'>${combo["NAME"]}</option>
                        </c:forEach>
                    </select>
                </td>
                <td>过滤参数</td>
                <td>
                    <input name="filter" class="config-item" type="text" style="width:100%;"/>
                </td>
            </tr>
            <tr>
                <td>输入触发</td>
                <td>
                    <select name="trigger" class="config-item" style="width:100%;">
                        <option value="" selected="selected">否</option>
                        <option value="true">是</option>
                    </select>
                </td>
                <td>是否多选</td>
                <td>
                    <select name="multiple" class="config-item" style="width:100%;">
                        <option value="" selected="selected">否</option>
                        <option value="multiple">是</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>行数据</td>
                <td>
                    <select name="is-row-data" class="config-item" style="width:100%;">
                        <option selected="selected" value="0">否</option>
                        <option value="1">是</option>
                    </select>
                </td>
                <td>是否主键</td>
                <td>
                    <select name="primary-key" class="config-item" style="width:100%;">
                        <option selected="selected" value="0">否</option>
                        <option value="1">是</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td colspan="4" align="center">
                    <div class="ok-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        确定
                    </div>
                    <div style="width:30px;display:inline-block;"></div>
                    <div class="cancel-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        取消
                    </div>
                </td>
            </tr>
        </table>
    </div>
</div>
<!-- 创建表格控件的初始化配置对话框 -->
<div class="table-init-config-dialog-tpl" style="width:400px;height:270px;display:none;">
    <div class="dialog-title">表格初始化配置</div>
    <form style="padding:15px;">
        <table style="width:100%;">
            <tr>
                <td>表头(thead)行数</td>
                <td>
                    <input disabled name="thead-row-num" class="config-item" type="number" required="true"
                           style="width:100px;"/>
                </td>
                <td>
                    <input type="checkbox" name="has-thead"/>
                    <span>创建表头</span>
                </td>
            </tr>
            <tr>
                <td>表体(tbody)行数</td>
                <td colspan="2">
                    <input name="tbody-row-num" class="config-item" type="number" style="width:100px;" min="1"
                           required="true"/>
                </td>
            </tr>
            <tr>
                <td>表格列数</td>
                <td colspan="2">
                    <input name="table-col-num" class="config-item" type="number" style="width:100px;" min="1"
                           required="true"/>
                </td>
            </tr>
            <tr>
                <td>是否为数据行</td>
                <td colspan="2">
                    <select name="is-data-row" class="config-item" style="width:100px;">
                        <option selected="selected" value="0">否</option>
                        <option value="1">是</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>复选框容器类型</td>
                <td>
                    <select disabled name="check-group-type" class="config-item" style="width:100px;" required="true">
                        <option selected="selected" value="single">单选</option>
                        <option value="multi">多选</option>
                    </select>
                </td>
                <td>
                    <input type="checkbox" name="is-check-group"/>
                    <span>复选框容器</span>
                </td>
            </tr>
            <tr>
                <td>打印分页处理</td>
                <td colspan="2">
                    <select name="is-pagination-table" class="config-item" style="width:100px;">
                        <option selected="selected" value="0">否</option>
                        <option value="1">是</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td colspan="3" align="center">
                    <div class="ok-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        确定
                    </div>
                    <div style="width:30px;display:inline-block;"></div>
                    <div class="cancel-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        取消
                    </div>
                </td>
            </tr>
        </table>
    </form>
</div>
<!-- sql管理对话框 -->
<div class="sql-management-dialog-tpl" style="width:400px;height:350px;display:none;">
    <div class="dialog-title">新增sql</div>
    <form style="padding:15px;">
        <table style="width:100%;">
            <tr>
                <td style="width:100px;">数据集名称</td>
                <td>
                    <input name="sql-name" type="text" style="width:100%;"/>
                </td>
            </tr>
            <tr>
            	<td style="width:100px;">依赖数据集</td>
            	<td>
            		<select name="dependency" style="width:100%;">
            			<option value="">无</option>
            		</select>
            	</td>
            </tr>
            <tr>
                <td style="width:100px;">结果集类型</td>
                <td>
                    <select name="sql-result-type" style="width:100%;">
                        <option selected="selected" value="single">单条记录</option>
                        <option value="multi-auto">不定数量集合</option>
                        <option value="multi-fixed">固定数量集合</option>
                    </select>
                </td>
            </tr>
            <tr class="var-name-wrapper">
                <td style="width:100px;">迭代变量名</td>
                <td>
                    <input name="var-name" type="text" style="width:100%;"/>
                </td>
            </tr>
            <tr>
                <td style="width:100px;">限制条数</td>
                <td>
                    <input name="sql-result-limit" type="number" style="width:100%;"/>
                </td>
            </tr>
            <tr>
                <td style="width:100px;">查询语句</td>
                <td colspan="2">
                    <textarea name="sql" style="width:100%;resize:none;height:120px;"></textarea>
                </td>
            </tr>
            <tr>
                <td colspan="3" align="center">
                    <div class="ok-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        确定
                    </div>
                    <div style="width:30px;display:inline-block;"></div>
                    <div class="cancel-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        取消
                    </div>
                </td>
            </tr>
        </table>
    </form>
</div>
<!-- sql节点模版 -->
<div class="sql-wrapper-tpl">
    <div class="sql-node">
        <span class="sql-name"></span>
        <span class="sql-result-type"></span>
        <span class="var-name"></span>
        <span class="sql-result-limit"></span>

        <div class="sql"></div>
    </div>
</div>
<!-- 字段选择辅助对话框 -->
<div class="pick-field-dialog-tpl" style="width:400px;height:500px;display:none;">
    <div class="dialog-title">绑定数据集字段</div>
    <form style="padding:15px;">
        <table style="width:100%;table-layout:fixed;">
            <tr>
                <td style="width:50%;height:400px;border:1px solid #cdcdcd;" valign="top">
                    <div style="height:100%;overflow:auto;">
                        <ul class="datasets-wrapper"></ul>
                    </div>
                </td>
                <td style="width:50%;height:400px;border:1px solid #cdcdcd;overflow:auto;" valign="top">
                    <div style="height:100%;overflow:auto;">
                        <ul class="fields-wrapper"></ul>
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="2" align="center">
                    <div class="ok-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        确定
                    </div>
                    <div style="width:30px;display:inline-block;"></div>
                    <div class="cancel-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        取消
                    </div>
                </td>
            </tr>
        </table>
    </form>
</div>
<div class="edit-script-dialog-tpl" style="width:800px;height:500px;display:none;">
    <div class="dialog-title">编辑脚本</div>
    <form style="padding:15px;">
        <table style="width:100%;table-layout:fixed;">
            <tr>
                <td style="width:100%;height:400px;" valign="top">
                    <textarea style="width:100%;height:100%;"></textarea>
                </td>
            </tr>
            <tr>
                <td colspan="2" align="center">
                    <div class="ok-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        确定
                    </div>
                    <div style="width:30px;display:inline-block;"></div>
                    <div class="cancel-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        取消
                    </div>
                </td>
            </tr>
        </table>
    </form>
</div>
<div class="plugin-init-dialog-tpl" style="width:400px;height:200px;display:none;">
    <div class="dialog-title">插件初始化配置</div>
    <form style="padding:15px;">
        <table style="width:100%;table-layout:fixed;">
        	<col style="width:15%;">
        	<col style="width:85%;">
        	<tr>
                <td >类名</td>
                <td>
                	<input name="className" style="width:300px;"/>
				</td>
            </tr>
            <tr>
                <td>属性</td>
                <td>
                	<input name="attributes" style="width:300px;"/>
				</td>
            </tr>
            <tr>
            	<td>样式</td>
                <td>
                    <input name="styles" style="width:300px;"/>
                </td>
            </tr>
            <tr>
                <td align="center" colspan="2">
                    <div class="ok-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        确定
                    </div>
                    <div style="width:30px;display:inline-block;"></div>
                    <div class="cancel-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        取消
                    </div>
                </td>
            </tr>
        </table>
    </form>
</div>
<div class="condition-init-dialog-tpl" style="width:400px;height:160px;display:none;">
    <div class="dialog-title">条件控制</div>
    <form style="padding:15px;">
        <table style="width:100%;table-layout:fixed;">
        	<col style="width:20%;">
        	<col style="width:80%;">
            <tr>
            	<td>表达式：</td>
                <td>
                    <input name="expression" style="width:100%;"/>
                </td>
            </tr>
            <tr>
                <td colspan="2" align="center">
                    <div class="ok-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        确定
                    </div>
                    <div style="width:30px;display:inline-block;"></div>
                    <div class="cancel-btn"
                         style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">
                        取消
                    </div>
                </td>
            </tr>
        </table>
    </form>
</div>
</body>
</html>