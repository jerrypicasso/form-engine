function createStaticTextWidget(config) {
	var dropZone = $('.drop-zone');
	var text = document.createElement('span');
	$(text).addClass('widget-text-static');
	$(text).addClass('droppable');
	$(text).css({
		'display':'inline-block',
		'vertical-align':'bottom',
		'overflow':'hidden',
		'white-space':'nowrap',
		'text-align':'center',
		'width':'auto'
	});
	$(text).html(config['text-val']);
	registerWidgetMousedownHandler(text);
	if(dropZone.hasClass('widget-container')) {
		$(text).appendTo(dropZone);
	}
	else {
		dropZone.before(text);
	}
	$(text).width($(text).innerWidth());
}
