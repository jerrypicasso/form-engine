function createNursingWidget(config) {
	var dropZone = $('.drop-zone');
	var field = document.createElement('span');
	$(field).addClass('widget-plugin-nursing');
	$(field).attr('type', 'nursing');
	$(field).attr('iterator', config['iterName']);
	$(field).attr('datetime-field', config['datetimeField']);
	$(field).css({'display':'none'});
	$(field).html(config['sql']);
	registerWidgetMousedownHandler(field);
	if(dropZone.hasClass('widget-container')) {
		$(field).appendTo(dropZone);
	}
	else {
		dropZone.before(field);
	}
}

function showNursingPluginInitConfigDialog() {
	var mask = $('.mask-layer-tpl').clone();
	mask.addClass('mask-layer').removeClass('mask-layer-tpl');
	
	var html = ['<div class="dialog" style="width:400px;height:420px;">',
	            '<div class="dialog-title">护理记录控件配置</div>',
	            '<form style="padding:15px;">',
	            '<table style="width:100%;table-layout:fixed;">',
	            '<tr><td>关联迭代器名称：</td></tr>',
                '<tr><td valign="top"><input name="iterName" style="width:100%;"></td></tr>',
                '<tr><td>日期时间列名称：</td></tr>',
                '<tr><td valign="top"><input name="datetimeField" style="width:100%;"></td></tr>',
	            '<tr><td>计算出入量sql：</td></tr>',
                '<tr><td valign="top"><textarea name="ioSql" style="width:100%;height:200px;"></textarea></td></tr>',
                '<tr>',
                '<td align="center">',
                '<div class="ok-btn" style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">确定</div>',
                '<div style="width:30px;display:inline-block;"></div>',
                '<div class="cancel-btn" style="cursor:pointer;background:rgb(67, 142, 185);width:80px;height:30px;line-height:30px;color:#fff;display:inline-block;">取消</div>',
                '</td>',
                '</tr>',
                '</table>',
                '</form>',
                '</div>'].join('');
	mask.find('.dialog-zone').append(html);
	mask.appendTo(document.body);
	mask.find('.ok-btn').unbind('click').bind('click',function(){
		var iterName = mask.find('input[name=iterName]').val();
		var datetimeField = mask.find('input[name=datetimeField]').val();
		var sql = mask.find('textarea[name=ioSql]').val();
		createNursingWidget({
			datetimeField : datetimeField,
			iterName : iterName,
			sql : sql
		});
		mask.remove();
	});
	mask.find('.cancel-btn').unbind('click').bind('click', function(){
		mask.remove();
	});
	mask.show();
}