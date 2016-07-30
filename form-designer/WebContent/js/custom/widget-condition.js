function createConditionWidget(config) {
	var dropZone = $('.drop-zone');
	dropZone.removeClass('drop-zone');
	
	var condition = document.createElement('condition');
	$(condition).addClass('droppable');
	$(condition).addClass('widget-condition');
	$(condition).addClass('widget-container');
	$(condition).attr('expr', config['expression']);
	$(condition).css({'position':'relative'});
	registerWidgetMousedownHandler(condition);
	if(dropZone.hasClass('widget-container')) {
		$(condition).appendTo(dropZone);
	}
	else {
		dropZone.before(condition);
	}
	
}