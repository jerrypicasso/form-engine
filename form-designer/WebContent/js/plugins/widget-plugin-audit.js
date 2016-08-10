function createAuditWidget(config) {
	var dropZone = $('.drop-zone');
	var field = document.createElement('span');
	$(field).addClass('widget-plugin-audit');
	$(field).attr('type', 'audit');
	$(field).attr('create-id', config['createId']);
	$(field).attr('modify-id', config['modifyId']);
	$(field).attr('modify-name', config['modifyName']);
	$(field).attr('pk-value', config['pkValue']);
	$(field).attr('pk-name', config['pkName']);
	$(field).attr('table-name', config['tableName']);
	$(field).css({
		'display':'inline-block',
		'vertical-align':'middle'
	});
	registerWidgetMousedownHandler(field);
	if(dropZone.hasClass('widget-container')) {
		$(field).appendTo(dropZone);
	}
	else {
		dropZone.before(field);
	}
}

function showAuditPluginInitConfigDialog() {
	var mask = $('.mask-layer-tpl').clone();
	mask.addClass('mask-layer').removeClass('mask-layer-tpl');
	
	var html = ['<div class="dialog" style="width:300px;height:180px;">',
	            '<div class="dialog-title">审签控件配置</div>',
	            '<form style="padding:15px;">',
	            '<table style="width:100%;table-layout:fixed;">',
	            '<col style="width:25%;"><col style="width:75%;">',
	            '<tr><td>记录创建者：</td>',
	            '<td valign="top"><input name="createId" style="width:100%;"></td></tr>',
	            '<tr><td>记录修改者：</td>',
	            '<td valign="top"><input name="modifyId" style="width:100%;"></td></tr>',
	            '<tr><td>修改者姓名：</td>',
	            '<td valign="top"><input name="modifyName" style="width:100%;"></td></tr>',
	            '<tr><td>记录主键值：</td>',
	            '<td valign="top"><input name="pkValue" style="width:100%;"></td></tr>',
	            '<tr><td>记录主键名：</td>',
                '<td valign="top"><input name="pkName" style="width:100%;"></td></tr>',
                '<tr><td>所属库表名：</td>',
                '<td valign="top"><input name="tableName" style="width:100%;"></td></tr>',
                '<tr><td align="center" colspan="2">',
                '<div class="ok-btn" style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">确定</div>',
                '<div style="width:30px;display:inline-block;"></div>',
                '<div class="cancel-btn" style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">取消</div>',
                '</td></tr>',
                '</table>',
                '</form>',
                '</div>'].join('');
	mask.find('.dialog-zone').append(html);
	mask.appendTo(document.body);
	mask.find('.ok-btn').unbind('click').bind('click',function(){
		var createId = mask.find('input[name=createId]').val();
		var modifyId = mask.find('input[name=modifyId]').val();
		var modifyName = mask.find('input[name=modifyName]').val();
		var pkValue = mask.find('input[name=pkValue]').val();
		var pkName = mask.find('input[name=pkName]').val();
		var tableName = mask.find('input[name=tableName]').val();
		createAuditWidget({
			createId : createId,
			modifyId : modifyId,
			modifyName : modifyName,
			pkValue : pkValue,
			pkName : pkName,
			tableName : tableName
		});
		mask.remove();
	});
	mask.find('.cancel-btn').unbind('click').bind('click', function(){
		mask.remove();
	});
	mask.show();
}