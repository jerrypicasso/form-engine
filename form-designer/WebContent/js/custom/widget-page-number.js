function createPageNumberWidget() {
	var dropZone = $('.drop-zone');
	dropZone.removeClass('drop-zone');
	var pager = document.createElement('span');
	$(pager).addClass('widget-page-number');
	$(pager).addClass('droppable');
	$(pager).css({
		'line-height': '24px',
		'display':'inline-block',
		'overflow':'hidden',
		'vertical-align':'middle',
		'text-align':'center'
	});
	registerWidgetMousedownHandler(pager);
	if(dropZone.hasClass('widget-container')) {
		$(pager).appendTo(dropZone);
	}
	else {
		dropZone.before(pager);
	}
}