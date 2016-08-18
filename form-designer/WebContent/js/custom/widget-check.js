/*创建复选框控件*/
function createCheckWidget(config) {
	var dropZone = $('.drop-zone');
	var check = document.createElement('span');
	$(check).addClass('widget-check');
	$(check).addClass('droppable');
	$(check).addClass('selectable');
	$(check).attr('field', config['field-name']);
	$(check).attr('type', 'check');
	$(check).css({
		'display':'inline-block',
		'border': '1px solid rgb(0, 0, 0)',
	    'height': '16px',
	    'line-height': '16px',
	    'overflow': 'hidden',
	    'text-align': 'center',
	    'white-space': 'normal',
	    'vertical-align': 'middle',
	    'width': '16px'
	});
	registerWidgetMousedownHandler(check);
	if(dropZone.hasClass('widget-container')) {
		$(check).appendTo(dropZone);
	}
	else {
		dropZone.before(check);
	}
	
	var valueField = document.createElement('span');
	$(valueField).addClass('value-field');
	$(valueField).hide();
	$(valueField).html(config['real-value']);
	$(valueField).appendTo(check);
	
	var displayField = document.createElement('span');
	$(displayField).css({'display':'block','line-height':'16px','height':'100%'});
	$(displayField).addClass('check-field');
	$(displayField).appendTo(check);
	
	var width = $(check).width();
	$(check).width(width);
}

function showCheckInitConfigDialog() {
	var mask = $('.mask-layer-tpl').clone();
	mask.addClass('mask-layer').removeClass('mask-layer-tpl');
	
	var html = [
	    '<div class="dialog" style="width:320px;height:150px;"><div class="dialog-title">初始化配置</div>',
	    '<div style="padding:15px;"><table style="width:100%;table-layout:fixed;">',
	    '<col style="width:25%;"/><col style="width:75%;"/>',
	    '<tr><td>实际值</td><td><input name="real-value" class="config-item" type="text" style="width:100%;" required="true"></td></tr>',
	    //'<tr><td>数据库表</td><td colspan="3"><input name="table-name" class="config-item" type="text" style="width:100%;" required="true"/></td></tr>',
	    '<tr><td>库表字段</td><td><input name="field-name" class="config-item" type="text" style="width:100%;" required="true"/></td></tr>',
	    '<tr><td colspan="4" align="center"><div class="ok-btn">确定</div><div class="cancel-btn">取消</div></td></tr>',
	    '</table></div></div>'].join('');
	
	mask.find('.dialog-zone').append(html);
	mask.appendTo(document.body);

	var dialog = mask.find('.dialog');
	dialog.find('.ok-btn').unbind('click').bind('click',function(){
		var realValue = mask.find('input[name=real-value]').val();
		var fieldName = mask.find('input[name=field-name]').val();
		var msg = [];
		if(realValue === '') {
			msg.push('实际值不能为空！');
		}
		if(fieldName === '') {
			msg.push('字段名不能为空！');
		}
		if(msg.length > 0) {
			alert(msg.join('\n'));
			return;
		}
		createCheckWidget({
			'real-value': realValue,
			'field-name': fieldName
		});
		$('.drop-zone').removeClass('drop-zone');
		mask.remove();
	});
	dialog.find('.cancel-btn').unbind('click').bind('click',function() {
		$('.drop-zone').removeClass('drop-zone');
		mask.remove();
	});
	mask.show();
}