function createSurgeryWidget(config) {
	var dropZone = $('.drop-zone');
	var field = document.createElement('span');
	$(field).addClass('widget-plugin-surgery');
	$(field).addClass('droppable');
	$(field).addClass('selectable');
	$(field).attr('type', 'surgery');
	$(field).attr('surgery', config['surgery']);
	$(field).attr('direction', config['direction']);
	$(field).attr('operator', config['operator']);
	$(field).html('<span class="display-field" style="width:100%;display:inline-block;"></span>');
	$(field).css({
		'display':'inline-block',
		'vertical-align':'middle',
		'width':'100%'
	});
	registerWidgetMousedownHandler(field);
	if(dropZone.hasClass('widget-container')) {
		$(field).appendTo(dropZone);
	}
	else {
		dropZone.before(field);
	}
}

function showSurgeryPluginInitConfigDialog() {
	var mask = $('.mask-layer-tpl').clone();
	mask.addClass('mask-layer').removeClass('mask-layer-tpl');
	
	var html = ['<div class="dialog" style="width:300px;height:180px;">',
	            '<div class="dialog-title">手术控件配置</div>',
	            '<form style="padding:15px;">',
	            '<table style="width:100%;table-layout:fixed;">',
	            '<tr><td style="width:25%;">手术id：</td>',
                '<td style="width:75%;" valign="top"><input name="surgery-id" style="width:100%;"></td></tr>',
                '<tr><td style="width:25%;">显示方向：</td>',
                '<td style="width:75%;" valign="top"><select name="direction" style="width:100%"><option value="horizontal" selected>横向</option><option value="vertical">垂直</option></select></td></tr>',
                '<tr><td style="width:25%;">操作者：</td>',
                '<td style="width:75%;" valign="top"><input name="operator" style="width:100%;"></td></tr>',
                '<tr><td align="center" colspan="2">',
                '<div class="ok-btn">确定</div>',
                '<div class="cancel-btn">取消</div>',
                '</td></tr>',
                '</table>',
                '</form>',
                '</div>'].join('');
	mask.find('.dialog-zone').append(html);
	mask.appendTo(document.body);
	mask.find('.ok-btn').unbind('click').bind('click',function(){
		var surgeryId = mask.find('input[name=surgery-id]').val();
		var direction = mask.find('select[name=direction]').val();
		var operator = mask.find('input[name=operator]').val();
		createSurgeryWidget({
			'surgery' : surgeryId,
			'direction':direction,
			'operator':operator
		});
		$('.drop-zone').removeClass('drop-zone');
		mask.remove();
	});
	mask.find('.cancel-btn').unbind('click').bind('click', function(){
		$('.drop-zone').removeClass('drop-zone');
		mask.remove();
	});
	mask.show();
}