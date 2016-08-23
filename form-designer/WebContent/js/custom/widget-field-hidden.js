function createHiddenFieldWidget(config) {
	var dropZone = $('.drop-zone');
	var field = document.createElement('span');
	$(field).addClass('widget-field-hidden');
	$(field).addClass('droppable');
	$(field).addClass('selectable');
	$(field).attr('field', config['field-name']);
	$(field).attr('table', config['table-name']);
	$(field).attr('trigger-show-val', config['show-val']);
	$(field).attr('to-show-widgets', config['show-ids']);
	if(config['is-row-data'] === '1') {
		$(field).addClass('row-field');
	} 
	else {
		$(field).addClass('main-field');
	}
	if(config['primary-key'] === '1') {
		$(field).attr('primary-key', 'true');
	}
	$(field).css({
		'display':'none',
		'width':'auto'
	});
	registerWidgetMousedownHandler(field);
	if(dropZone.hasClass('widget-container')) {
		$(field).appendTo(dropZone);
	}
	else {
		dropZone.before(field);
	}
	
	var valueField = document.createElement('span');
	$(valueField).addClass('value-field');
	$(valueField).hide();
	$(valueField).html(config['real-value']);
	$(valueField).appendTo(field);
	
	var displayField = document.createElement('span');
	$(displayField).addClass('display-field');
	$(displayField).hide();
	$(displayField).html(config['disp-value']);
	$(displayField).appendTo(field);
	
	var width = $(field).width();
	$(field).width(width);
}

function showHiddenInitConfigDialog() {
	var mask = $('.mask-layer-tpl').clone();
	mask.addClass('mask-layer').removeClass('mask-layer-tpl');
	
	var html = [
        '<div class="dialog" style="width:360px;height:360px;"><div class="dialog-title">初始化配置</div>',
        '<div style="padding:15px;"><table style="width:100%;table-layout:fixed;">',
        '<col style="width:24%;"/><col style="width:26%;"/><col style="width:24%;"/><col style="width:26%;"/>',
        '<tr><td>实际值</td><td colspan="3"><input name="real-value" class="config-item" type="text" style="width:100%;" required="true"></td></tr>',
        '<tr><td>显示值</td><td colspan="3"><textarea name="disp-value" class="config-item" style="width:100%;height:60px;"></textarea></td></tr>',
        '<tr><td>数据库表</td><td colspan="3"><input name="table-name" class="config-item" type="text" style="width:100%;"/></td></tr>',
        '<tr><td>库表字段</td><td><input name="field-name" class="config-item" type="text" style="width:100%;" required="true"/></td></tr>',
        '<tr><td>行数据</td><td><select name="is-row-data" class="config-item" style="width:100%;"><option selected value="0">否</option><option value="1">是</option></select></td>',
        	'<td>是否主键</td><td><select name="primary-key" class="config-item" style="width:100%;"><option selected value="0">否</option><option value="1">是</option></select></td></tr>',
        '<tr><td>触发显示</td><td colspan="3"><input name="show-val" class="config-item" type="text" style="width:100%;"/></td></tr>',	
        '<tr><td>受控控件</td><td colspan="3"><input name="show-ids" class="config-item" type="text" style="width:100%;"/></td></tr>',	
        '<tr><td colspan="4" align="center"><div class="ok-btn">确定</div><div class="cancel-btn">取消</div></td></tr>',
        '</table></div></div>',].join('');
	
	mask.find('.dialog-zone').append(html);
	mask.appendTo(document.body);
	
	var dialog = mask.find('.dialog');
	dialog.find('input[name=real-value]').bind('dblclick', function() {
		showPickDatasetFieldDialog(dialog);
	});
	dialog.find('textarea[name=disp-value]').bind('dblclick', function() {
		showPickDatasetFieldDialog($(this));
	});
	dialog.find('textarea[name=text-val]').bind('dblclick', function() {
		showPickDatasetFieldDialog($(this));
	});
	dialog.find('input[name=table-name]').bind('dblclick', function() {
		showPickTableDialog(dialog);
	});
	dialog.find('select[name=is-row-data]').val('0');
	var dropZone = $('.drop-zone');
	if(dropZone.hasClass('cell')) {
		if($('#' + dropZone.attr('table')).hasClass('data-row')) {
			dialog.find('select[name=is-row-data]').val('1');
		}
		else {
			dialog.find('select[name=is-row-data]').val('0');
		}
	}
	else if(dropZone.hasClass('row-field')) {
		dialog.find('select[name=is-row-data]').val('1');
	}
	else {
		dialog.find('select[name=is-row-data]').val('0');
	}
	dialog.find('.ok-btn').unbind('click').bind('click',function(){
		var msg = [];
		var config = {};
		dialog.find('.config-item[disabled!=disabled]').each(function(){
			var name = $(this).attr('name');
			var value = $(this).val();
			var required = $(this).attr('required');
			if(required == 'required' && $.trim(value) <= 0) {
				msg.push(name + '不能为空!');
			}
			config[name] = value;
		});
		if(msg.length > 0) {
			alert(msg.join('\n'));
			return;
		}
		createHiddenFieldWidget(config);
		$('.drop-zone').removeClass('drop-zone');
		mask.remove();
	});
	dialog.find('.cancel-btn').unbind('click').bind('click',function() {
		$('.drop-zone').removeClass('drop-zone');
		mask.remove();
	});
	mask.show();
}