/*创建读写字段控件*/
function createDiagnosisWidget(config) {
	var dropZone = $('.drop-zone');
	var field = document.createElement('span');
	$(field).addClass('widget-custom-diagnosis');
	$(field).addClass('droppable');
	$(field).attr('type', 'diagnosis');
	$(field).addClass('data-row');
	$(field).css({
		'display':'inline-block',
		'overflow':'hidden',
		'vertical-align':'center',
		'white-space':'normal',
		'width':'100%'
	});
	registerWidgetMousedownHandler(field);
	if(dropZone.hasClass('widget-container')) {
		$(field).appendTo(dropZone);
	}
	else {
		dropZone.before(field);
	}
	
	var displayField = document.createElement('span');
	$(displayField).addClass('display-field');
	$(displayField).appendTo(field);
}