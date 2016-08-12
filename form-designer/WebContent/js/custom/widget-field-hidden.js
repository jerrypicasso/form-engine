function createHiddenFieldWidget(config) {
	var dropZone = $('.drop-zone');
	var field = document.createElement('span');
	$(field).addClass('widget-field-hidden');
	$(field).addClass('droppable');
	$(field).attr('field', config['field-name']);
	$(field).attr('table', config['table-name']);
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
