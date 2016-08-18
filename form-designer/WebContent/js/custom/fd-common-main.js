$(document).ready(function() {
	$(document.body).bind('contextmenu', function() { 
		return false; 
	});
	toastr.options = {positionClass: 'toast-top-center'};
	createWidgetControls();
	createSqlOperateControls();
	createOperateControls();
	createPropertiesControls();
	
	$(document.body).bind('mouseup', function() {
		$('.droppable').unbind('mouseover');
		var dropZone = $('.drop-zone');
		if(dropZone.length > 0) {
			if($('.draggable').length > 0) {
				var type = $('.draggable').attr('id');
				if(type === 'table') {
					showTableInitConfigDialog();
				}
				else if(type === 'static-text') {
					showWidgetInitConfigDialog('text-init-config-dialog-tpl',createStaticTextWidget);
				}
				else if(type === 'dynamic-text') {
					showWidgetInitConfigDialog('text-init-config-dialog-tpl',createDynamicTextWidget);
				}
				else if(type === 'date-field') {
					showWidgetInitConfigDialog('field-init-config-dialog-tpl',createDateFieldWidget);
				}
				else if(type === 'dict-field') {
					showWidgetInitConfigDialog('field-init-config-dialog-tpl',createDictFieldWidget);
				}
				else if(type === 'staff-field') {
					showWidgetInitConfigDialog('field-init-config-dialog-tpl',createStaffFieldWidget);
				}
				else if(type === 'number-field') {
					showWidgetInitConfigDialog('field-init-config-dialog-tpl',createNumberFieldWidget);
				}
				else if(type === 'hidden-field') {
					showWidgetInitConfigDialog('field-init-config-dialog-tpl',createHiddenFieldWidget);
				}
				else if(type === 'text-field') {
					showWidgetInitConfigDialog('field-init-config-dialog-tpl',createTextFieldWidget);
				}
				else if(type === 'select-field') {
					showSelectInitConfigDialog();
				}
				else if(type === 'check') {
					showCheckInitConfigDialog();
				}
				else if(type === 'iterator') {
					showIteratorInitConfigDialog();
				}
				else if(type === 'page-number') {
					createPageNumberWidget();
				}
				else if(type === 'page-count') {
					createPageCountWidget();
				}
				else if(type === 'condition') {
					showConditionInitConfigDialog();
				}
				else if(type === 'plugin') {
					showPluginInitConfigDialog();
				}
				else if(type === 'diagnosis') {
					showDiagnosisPluginInitConfigDialog();
				}
				else if(type === 'nursing') {
					showNursingPluginInitConfigDialog();
				}
				else if(type === 'surgery') {
					showSurgeryPluginInitConfigDialog();
				}
				else if(type === 'audit') {
					showAuditPluginInitConfigDialog();
				}
			}
			else if($('.movable').length > 0 && dropZone != $('.movable')) {
				var movableWidget = $('.movable');
				if(movableWidget.hasClass('cell')) {
					var tableId = movableWidget.attr('grid');
					movableWidget = $('.widget-table[id='+ tableId +']');
				}
				if(dropZone.hasClass('widget-container')) {
					if(dropZone.hasClass('cell')) {
						if(confirm("是否置前？")) {
							var gridId = dropZone.attr('grid')
							dropZone = $('.widget-table[id='+ gridId +']');
							dropZone.before(movableWidget);
						}
						else {
							dropZone.append(movableWidget);
						}
					}
					else {
						dropZone.append(movableWidget);
					}
				}
				else {
					dropZone.before(movableWidget);
				}
				$('.drop-zone').removeClass('drop-zone');
			}
		}
		$('.draggable').removeClass('draggable');
		$('.movable').removeClass('movable');
	});
	
	resetAndHideAllPropertiesFields();
	
	registerSqlConfigHandlers();
	registerTableOperateHandlers();
	registerWidgetPropertiesHandlers();
	
	$('#make-tpl-btn').bind('click', function() {
		showPaperInitConfigDialog();
	});
	$('#load-tpl-btn').bind('click', function() {
		//$('#load-tpl-btn-hidden').click();
		showLoadPaperDialog();
	});
	$('#save-tpl-btn').bind('click', function() {
		var paperWrapper = $('.paper-wrapper').clone();
		paperWrapper.find('.header-resizer').remove();
		paperWrapper.find('.content-resizer').remove();
		paperWrapper.find('.footer-resizer').remove();
		paperWrapper.find('.selected-widget').removeClass('selected-widget');
		paperWrapper.find('.sql-wrapper').hide();
		paperWrapper.find('.selected-sql').removeClass('selected-sql');
		//paperWrapper.find('.content').removeAttr('style');
		var paper = paperWrapper.find('.paper');
		var name = paper.attr('name');
		var code = paper.attr('code');
		var html = paperWrapper.html();
		$.ajax({
			url: 'saveFormTpl.do',
			type: 'post',
			data: {'tpl':html,'name':name,'code':code},
			success: function() {
				toastr['success']('保存完毕');
			}
		});
	});
	$('#add-dataset-btn').bind('click', showSqlManagementDialog);
});


/*创建表单编辑页*/
function createFormPaper() {
	var paperWrapper = $('.paper-wrapper');
	paperWrapper.empty();
	
	var sqlWrapper = $('.sql-wrapper-tpl').clone();
	sqlWrapper.removeClass('sql-wrapper-tpl').addClass('sql-wrapper');
	sqlWrapper.empty();
	paperWrapper.append(sqlWrapper);
	
	var paper = $('<div class="paper" style="font-size:14px;position:relative;background:rgb(255, 255, 255);margin:0 auto;">');
	paperWrapper.append(paper);
	
	var contentWrapper = $('<div class="content-wrapper" style="position:relative;padding:10px;">');
	$(paper).append(contentWrapper);
	
	
	var header = $('<div class="header droppable widget-container" style="height:150px;">');
	$(contentWrapper).append(header);
	
	var content = $('<div class="content droppable widget-container" style="height:550px;">');
	$(contentWrapper).append(content);
	
	var footer = $('<div class="footer droppable widget-container" style="height:100px;">');
	$(contentWrapper).append(footer);
	
	$(contentWrapper).append('<script id="form-script" type="text/javascript"></script>');
}

/* 设置页头的高度可调整 */
function makeHeaderResizable() {
	var vResizeHandle = document.createElement('div');
	$(vResizeHandle).width(8);
	$(vResizeHandle).height(4);
	$(vResizeHandle).addClass('header-resizer');
	$(vResizeHandle).bind('mousedown', function(e) {
		$(vResizeHandle).data('flag', true);
		$(vResizeHandle).data('y', e.pageY);
	});
	$(document.body).bind('mouseup', function() {
		$(vResizeHandle).removeData('flag');
		$(vResizeHandle).removeData('y');
	});
	$(document.body).bind('mousemove', function(e) {
		var flag = $(vResizeHandle).data('flag');
		var oldY = $(vResizeHandle).data('y');
		if (flag) {
			var newY = e.pageY;
			var offsetY = newY - oldY;
			var height = Math.max($('.header').height() + offsetY, 0);
			//height = Math.min(height, $('.paper').height());
			$('.header').height(height);
			$(vResizeHandle).data('y', newY);
			/*var top = Math.max($('.content').position().top + offsetY, 0);
			top = Math.min(top, $('.paper').height());
			$('.content').css({
				'top' : top + 'px'
			});*/
		}
	});
	$('.header').append(vResizeHandle);
}

function makeContentResizable() {
	var vResizeHandle = document.createElement('div');
	$(vResizeHandle).width(8);
	$(vResizeHandle).height(4);
	$(vResizeHandle).addClass('content-resizer');
	$(vResizeHandle).bind('mousedown', function(e) {
		$(vResizeHandle).data('flag', true);
		$(vResizeHandle).data('y', e.pageY);
	});
	$(document.body).bind('mouseup', function() {
		$(vResizeHandle).removeData('flag');
		$(vResizeHandle).removeData('y');
	});
	$(document.body).bind('mousemove', function(e) {
		var flag = $(vResizeHandle).data('flag');
		var oldY = $(vResizeHandle).data('y');
		if (flag) {
			var newY = e.pageY;
			var offsetY = newY - oldY;
			var height = Math.max($('.content').height() + offsetY, 0);
			$('.content').height(height);
			$(vResizeHandle).data('y', newY);
			/*var bottom = $('.content').css('bottom').replace('px', '');
			bottom = Math.max(bottom - offsetY, 0);
			bottom = Math.min(bottom, $('.paper').height());
			$('.content').css({
				'bottom' : bottom + 'px'
			});*/
		}
	});
	$('.content').append(vResizeHandle);
}

/* 设置页脚的高度可调整 */
function makeFooterResizable() {
	var vResizeHandle = document.createElement('div');
	$(vResizeHandle).width(8);
	$(vResizeHandle).height(4);
	$(vResizeHandle).addClass('footer-resizer');
	$(vResizeHandle).bind('mousedown', function(e) {
		$(vResizeHandle).data('flag', true);
		$(vResizeHandle).data('y', e.pageY);
	});
	$(document.body).bind('mouseup', function() {
		$(vResizeHandle).removeData('flag');
		$(vResizeHandle).removeData('y');
	});
	$(document.body).bind('mousemove', function(e) {
		var flag = $(vResizeHandle).data('flag');
		var oldY = $(vResizeHandle).data('y');
		if (flag) {
			var newY = e.pageY;
			var offsetY = newY - oldY;
			var height = Math.max($('.footer').height() + offsetY, 0);
			//height = Math.min(height, $('.paper').height());
			$('.footer').height(height);
			$(vResizeHandle).data('y', newY);
			/*var bottom = $('.content').css('bottom').replace('px', '');
			bottom = Math.max(bottom - offsetY, 0);
			bottom = Math.min(bottom, $('.paper').height());
			$('.content').css({
				'bottom' : bottom + 'px'
			});*/
		}
	});
	$('.footer').append(vResizeHandle);
}

function registerWidgetMousedownHandler(widget) {
	$(widget).bind('mousedown', function(e){
		$('.selected-widget').removeClass('selected-widget');
		var selectedWidget = $(this);
		prepareRelativePropertiesFields(selectedWidget);
		selectedWidget.addClass('selected-widget');
		if(!selectedWidget.hasClass('widget-container')) {
			selectedWidget.addClass('movable');
			$('.droppable').unbind('mouseover');
			$('.droppable').bind('mouseover',function(e) {
				if($('.movable').length > 0) {
					$('.drop-zone').removeClass('drop-zone');
					if(!$(this).hasClass('movable')) {
						$(this).addClass('drop-zone');
					}
				}
				e.stopPropagation();
			});
		}
		e.stopPropagation();
	});
}
