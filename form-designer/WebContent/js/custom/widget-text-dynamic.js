function createDynamicTextWidget(config) {
	var dropZone = $('.drop-zone');
	var text = document.createElement('span');
	$(text).addClass('widget-text-dynamic');
	$(text).addClass('droppable');
	$(text).addClass('selectable');
	$(text).css({
		'display':'inline-block',
		'vertical-align':'middle',
		'white-space':'normal',
		'word-wrap':'break-word',
		'text-align':'center',
		'overflow':'hidden',
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
	var width = $(text).width();
	$(text).width(width);
}