function createPluginWidget(config) {
	var dropZone = $('.drop-zone');
	var plugin = document.createElement('div');
	$(plugin).addClass('widget-plugin');
	$(plugin).addClass(config.className);
	$(plugin).addClass('droppable');
	$(plugin).addClass('selectable');
	if(config.styles) {
		var styles = $.parseJSON(config.styles);
		$(plugin).css(styles);
	}
	if(config.attributes) {
		var attributes = $.parseJSON(config.attributes);
		$(plugin).attr(attributes);
	}
	
	registerWidgetMousedownHandler(plugin);
	if(dropZone.hasClass('widget-container')) {
		$(plugin).appendTo(dropZone);
	}
	else {
		dropZone.before(plugin);
	}
} 