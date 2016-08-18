function createIteratorWidget(config) {
	var dropZone = $('.drop-zone');
	dropZone.removeClass('drop-zone');
	var iterWrapper = document.createElement('div');
	$(iterWrapper).attr('id', Math.uuidFast().toLowerCase());
	$(iterWrapper).addClass('iterator-wrapper');
	$(iterWrapper).addClass('selectable');
	//$(iterWrapper).attr('total-row', config['row-count']);
	//$(iterWrapper).attr('total-page', config['page-count']);
	//$(iterWrapper).attr('table-name', config['table-name']);
	//$(iterWrapper).attr('primary-key', config['primary-key']);
	//$(iterWrapper).attr('drop-key', config['drop-key'])
	$(iterWrapper).attr('editable', config['editable']);
	$(iterWrapper).css({
		'position':'relative'
	});
	if(dropZone.hasClass('widget-container')) {
		$(iterWrapper).appendTo(dropZone);
	}
	else {
		dropZone.before(iterWrapper);
	}
	
	var iter = document.createElement('list');
	$(iter).addClass('droppable');
	$(iter).addClass('widget-container');
	$(iter).attr('items', config['dataset-name']);
	$(iter).attr('var', config['iterator-name']);
	registerWidgetMousedownHandler(iterWrapper);
	$(iter).appendTo(iterWrapper);
}

function showIteratorInitConfigDialog() {
	var mask = $('.mask-layer-tpl').clone();
	mask.addClass('mask-layer').removeClass('mask-layer-tpl');
	
	var html = [
	    '<div class="dialog" style="width:320px;height:150px;"><div class="dialog-title">初始化配置</div>',
	    '<div style="padding:15px;"><table style="width:100%;table-layout:fixed;">',
	    '<col style="width:25%;"/><col style="width:75%;"/>',
	    '<tr><td>迭代集合</td><td><input name="dataset-name" class="config-item" type="text" style="width:100%;" required="true"/></td>',
	    '<tr><td>迭代器名</td><td><input name="iterator-name" class="config-item" type="text" style="width:100%;" required="true"/></td></tr>',
	    '<tr><td>可编辑</td><td><select name="editable" style="width:100%;"><option value="true" selected>是</option><option value="false">否</option></select></td></tr>',
	    '<tr><td colspan="4" align="center"><div class="ok-btn">确定</div><div class="cancel-btn">取消</div></td></tr>',
	    '</table></div></div>'].join('');
	
	mask.find('.dialog-zone').append(html);
	mask.appendTo(document.body);
	
	var dialog = mask.find('.dialog');
	dialog.find('input[name=dataset-name]').bind('dblclick', function() {
		showPickDatasetFieldDialog(dialog);
	});
	var dropZone = $('.drop-zone');
	dialog.find('.ok-btn').unbind('click').bind('click',function(){
		var datasetName = mask.find('input[name=dataset-name]').val();
		var iteratorName = mask.find('input[name=iterator-name]').val();
		var editable = mask.find('select[name=editable]').val();
		var msg = [];
		if(datasetName === '') {
			msg.push('迭代集合不能为空！');
		}
		if(iteratorName === '') {
			msg.push('迭代器名不能为空！');
		}
		if(msg.length > 0) {
			alert(msg.join('\n'));
			return;
		}
		createIteratorWidget({
			'dataset-name': datasetName,
			'iterator-name': iteratorName,
			'editable': editable
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