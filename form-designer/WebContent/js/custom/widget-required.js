function createRequiredWidget() {
	var dropZone = $('.drop-zone');
	dropZone.removeClass('drop-zone');
	var widget = document.createElement('span');
	$(widget).addClass('widget-required');
	$(widget).addClass('droppable');
	$(widget).addClass('selectable');
	$(widget).html('*');
	$(widget).css({
		'display':'inline-block',
		'vertical-align':'middle',
		'text-align':'center',
		'color':'red'
	});
	registerWidgetMousedownHandler(widget);
	if(dropZone.hasClass('widget-container')) {
		$(widget).appendTo(dropZone);
	}
	else {
		dropZone.before(widget);
	}
}