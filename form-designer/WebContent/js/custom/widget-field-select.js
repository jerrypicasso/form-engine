/*创建读写字段控件*/
function createSelectFieldWidget(config) {
	var dropZone = $('.drop-zone');
	var field = document.createElement('span');
	$(field).addClass('widget-field-select');
	$(field).addClass('droppable');
	$(field).addClass('selectable');
	$(field).attr('field', config['field-name']);
	$(field).attr('table', config['table-name']);
	$(field).attr('category', config['category']);
	$(field).attr('filter', config['filter']);
	$(field).attr('type', 'select');
	if(config['filter']) {
		$(field).attr('filter', config['filter']);
	}
	if(config['multiple']) {
		$(field).attr('multi-select', config['multiple']);
	}
	if(config['trigger']) {
		$(field).attr('trigger', config['trigger']);
	}
	if(config['master']) {
		$(field).attr('master', config['master']);
	}
	if(config['is-row-data'] === '1') {
		$(field).addClass('row-field');
	} 
	else {
		$(field).addClass('main-field');
	}
	$(field).css({
		'display':'inline-block',
		'overflow':'hidden',
		'text-align':'center',
		'vertical-align':'middle',
		'white-space':'normal',
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
	$(displayField).html(config['disp-value']);
	$(displayField).appendTo(field);
	
	var width = $(field).width();
	$(field).width(width);
}

