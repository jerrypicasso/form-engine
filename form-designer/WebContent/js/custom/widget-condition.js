function createConditionWidget(config) {
	var dropZone = $('.drop-zone');
	dropZone.removeClass('drop-zone');
	
	var condition = document.createElement('condition');
	$(condition).addClass('droppable');
	$(condition).addClass('selectable');
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

function showConditionInitConfigDialog() {
	var mask = $('.mask-layer-tpl').clone();
	mask.addClass('mask-layer').removeClass('mask-layer-tpl');
	var dialog = $('.condition-init-dialog-tpl').clone();
	dialog.removeClass('condition-init-dialog-tpl');
	dialog.addClass('dialog');
	mask.find('.dialog-zone').append(dialog);
	mask.appendTo(document.body);
	dialog.find('.ok-btn').unbind('click').bind('click',function(){
		var expression = dialog.find('input[name=expression]').val();
		if(!expression) {
			alert('表达式不能为空！');
			return;
		}
		var config = {
			expression:expression
		};
		createConditionWidget(config);
		mask.remove();
	});
	dialog.find('.cancel-btn').unbind('click').bind('click', function(){
		mask.remove();
	});
	mask.show();
	dialog.show();
}