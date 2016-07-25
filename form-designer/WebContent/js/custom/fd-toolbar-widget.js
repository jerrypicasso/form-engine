function createWidgetControls() {
	var arr = [{
		id:'table',
		icon:'url(icon/table.png)',
		title:'表格元素'
	},{
		id:'static-text',
		icon:'url(icon/static_text.png)',
		title:'静态文本'
	},{
		id:'dynamic-text',
		icon:'url(icon/dynamic_text.png)',
		title:'动态文本'
	},{
		id:'text-field',
		icon:'url(icon/text_field.png)',
		title:'文本字段'
	},{
		id:'number-field',
		icon:'url(icon/number_field.png)',
		title:'数字字段'
	},{
		id:'date-field',
		icon:'url(icon/date_field.png)',
		title:'日期字段'
	},{
		id:'dict-field',
		icon:'url(icon/dict_field.png)',
		title:'字典字段'
	},{
		id:'staff-field',
		icon:'url(icon/staff_field.png)',
		title:'人员字段'
	},{
		id:'hidden-field',
		icon:'url(icon/hidden_field.png)',
		title:'隐藏字段'
	},{
		id:'select-field',
		icon:'url(icon/hidden_field.png)',
		title:'下拉框字段'
	},{
		id:'check',
		icon:'url(icon/check.png)',
		title:'复选框'
	},{
		id:'iterator',
		icon:'url(icon/iterator.png)',
		title:'数据迭代'
	},{
		id:'page-number',
		icon:'url(icon/page_number.png)',
		title:'当前页码'
	},{
		id:'page-count',
		icon:'url(icon/page_count.png)',
		title:'总共页数'
	},{
		id:'diagnosis',
		icon:'url(icon/iterator.png)',
		title:'诊断'
	}];
	for(var i = 0; i < arr.length; i++) {
		createWidgetControl(arr[i]);
	}
}

function createWidgetControl(config) {
	var widgetModel = document.createElement('div');
	$(widgetModel).attr('id', config.id);
	$(widgetModel).attr('title', config.title);
	$(widgetModel).addClass('widget');
	$(widgetModel).addClass('control');
	$(widgetModel).css({
		'background-image': config.icon,
		'background-repeat':'no-repeat',
		'background-position':'center'
	});
	/*标记控件可拖拽*/
	$(widgetModel).bind('mousedown', function(){
		$(this).addClass('draggable');
		$('.droppable').unbind('mouseover');
		$('.droppable').bind('mouseover',function(e) {
			if($('.draggable').length > 0) {
				$('.drop-zone').removeClass('drop-zone');
				$(this).addClass('drop-zone');
			}
			e.stopPropagation();
		});
	});
	$('.widgets').append(widgetModel);
}