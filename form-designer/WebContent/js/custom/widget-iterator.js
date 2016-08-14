function createIteratorWidget(config) {
	var dropZone = $('.drop-zone');
	dropZone.removeClass('drop-zone');
	var iterWrapper = document.createElement('div');
	$(iterWrapper).attr('id', Math.uuidFast().toLowerCase());
	$(iterWrapper).addClass('iterator-wrapper');
	$(iterWrapper).addClass('selectable');
	//$(iterWrapper).attr('total-row', config['row-count']);
	//$(iterWrapper).attr('total-page', config['page-count']);
	$(iterWrapper).attr('table-name', config['table-name']);
	$(iterWrapper).attr('primary-key', config['primary-key']);
	$(iterWrapper).attr('drop-key', config['drop-key'])
	$(iterWrapper).css({
		'position':'relative'
	});
	if(dropZone.hasClass('widget-container')) {
		$(iterWrapper).appendTo(dropZone);
	}
	else {
		dropZone.before(iterWrapper);
	}
	
	var iter = document.createElement('list');
	$(iter).addClass('droppable');
	$(iter).addClass('widget-container');
	$(iter).attr('items', config['dataset-name']);
	$(iter).attr('var', config['iterator-name']);
	registerWidgetMousedownHandler(iterWrapper);
	$(iter).appendTo(iterWrapper);
}