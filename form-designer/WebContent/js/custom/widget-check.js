/*创建复选框控件*/
function createCheckWidget(config) {
	var dropZone = $('.drop-zone');
	var field = document.createElement('span');
	$(field).addClass('widget-check');
	$(field).addClass('droppable');
	$(field).attr('field', config['field-name']);
	$(field).attr('type', 'check');
	/*if(config['is-row-data'] === '1') {
		$(field).addClass('row-field');
	} 
	else {
		$(field).addClass('main-field');
	}*/
	$(field).css({
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
	$(displayField).css({'display':'block','line-height':'16px','height':'100%'});
	$(displayField).html(config['disp-value']);
	$(displayField).addClass('check-field');
	$(displayField).appendTo(field);
	
	var width = $(field).width();
	$(field).width(width);
}