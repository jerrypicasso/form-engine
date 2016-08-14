/*创建复选框控件*/
function createCheckWidget(config) {
	var dropZone = $('.drop-zone');
	var check = document.createElement('span');
	$(check).addClass('widget-check');
	$(check).addClass('droppable');
	$(check).addClass('selectable');
	$(check).attr('field', config['field-name']);
	$(check).attr('type', 'check');
	/*if(config['is-row-data'] === '1') {
		$(check).addClass('row-field');
	} 
	else {
		$(check).addClass('main-field');
	}*/
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
	$(displayField).html(config['disp-value']);
	$(displayField).addClass('check-field');
	$(displayField).appendTo(check);
	
	var width = $(check).width();
	$(check).width(width);
}