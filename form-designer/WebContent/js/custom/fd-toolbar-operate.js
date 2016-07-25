function createOperateControls() {
	var arr = [{
		id:'merge-cells-btn',
		icon:'url(icon/merge_cells.png)',
		title:'合并单元格'
	},{
		id:'split-cell-btn',
		icon:'url(icon/split_cell.png)',
		title:'拆分单元格'
	},{
		id:'show-top-border-btn',
		icon:'url(icon/border_top.png)',
		title:'显示顶边框'
	},{
		id:'show-right-border-btn',
		icon:'url(icon/border_right.png)',
		title:'显示右边框'
	},{
		id:'show-bottom-border-btn',
		icon:'url(icon/border_bottom.png)',
		title:'显示下边框'
	},{
		id:'show-left-border-btn',
		icon:'url(icon/border_left.png)',
		title:'显示左边框'
	},{
		id:'hide-all-borders-btn',
		icon:'url(icon/hide_border.png)',
		title:'隐藏边框'
	},{
		id:'refer-col-setting-btn',
		icon:'url(icon/copy_cols.png)',
		title:'参考表格列宽配置'
	},{
		id:'apply-col-setting-btn',
		icon:'url(icon/paste_cols.png)',
		title:'应用表格列宽配置'
	},{
		id:'copy-widget-btn',
		icon:'url(icon/copy_widget.png)',
		title:'复制元素'
	},{
		id:'paste-widget-btn',
		icon:'url(icon/paste_widget.png)',
		title:'粘贴元素'
	},{
		id:'proper-width-btn',
		icon:'url(icon/proper_width.png)',
		title:'合适宽度'
	},{
		id:'fill-width-btn',
		icon:'url(icon/fill_width.png)',
		title:'100%宽度'
	},{
		id:'remove-widget-btn',
		icon:'url(icon/del_widget.png)',
		title:'删除元素'
	}];
	for(var i = 0; i < arr.length; i++) {
		createOperateControl(arr[i]);
	}
}

function createOperateControl(config) {
	var control = document.createElement('div');
	$(control).attr('id', config.id);
	$(control).attr('title', config.title);
	$(control).addClass('control');
	$(control).css({
		'background-image': config.icon,
		'background-repeat':'no-repeat',
		'background-position':'center'
	});
	$('.operates').append(control);
}

/*注册表格操作处理方法*/
function registerTableOperateHandlers() {
	$('#merge-cells-btn').bind('click', mergeCells);
	$('#split-cell-btn').bind('click', splitCells);
	$('#show-all-borders-btn').bind('click', showBorders);
	$('#show-top-border-btn').bind('click', function() {
		showBorders('top');
	});
	$('#show-right-border-btn').bind('click', function() {
		showBorders('right');
	});
	$('#show-bottom-border-btn').bind('click', function() {
		showBorders('bottom');
	});
	$('#show-left-border-btn').bind('click', function() {
		showBorders('left');
	});
	$('#hide-all-borders-btn').bind('click', hideBorders);
	$('#empty-cells-btn').bind('click', emptyCells);
	$('#refer-col-setting-btn').bind('click', referColSetting);
	$('#apply-col-setting-btn').bind('click', applyColSetting);
	$('#remove-widget-btn').bind('click', removeWidget);
	$('#copy-widget-btn').bind('click', copyWidget);
	$('#paste-widget-btn').bind('click', pasteWidget);
	$('#insert-new-row-btn').bind('click', insertNewRow);
	$('#insert-new-col-btn').bind('click', insertNewCol);
	$('#proper-width-btn').bind('click', setProperWidth);
	$('#fill-width-btn').bind('click', setFillWidth);
}

/*复制元素*/
function copyWidget() {
	$('.copying').removeClass('copying');
	var selectedWidget = $('.selected-widget');
	if(!selectedWidget.is('td') && !selectedWidget.is('th')) {
		selectedWidget.addClass('copying');
	}
}

/*粘贴元素*/
function pasteWidget() {
	var copiedWidget = $('.copying');
	if(!copiedWidget.is('td') && !copiedWidget.is('th')) {
		$('.selected-widget').each(function(){
			var selectedWidget = $(this);
			if(selectedWidget.hasClass('droppable')) {
				selectedWidget.empty();
				var widget = copiedWidget.clone(true);
				widget.removeClass('copying');
				selectedWidget.append(widget);
			}
		});
	}
	copiedWidget.removeClass('copying');
}

/*删除元素*/
function removeWidget() {
	if(confirm("是否要删除该元素？")) {
		var selectedWidget = $('.selected-widget');
		if(selectedWidget.is('td') || selectedWidget.is('th')) {
			var tableId = selectedWidget.attr('table');
			selectedWidget = $('#' + tableId);
		}
		selectedWidget.remove();
	}
}

/*显示边框线*/
function showBorders(which) {
	$('.selected-widget').each(function() {
		if(which === 'top') {
			$(this).css('border-top','1px solid #000');
		}
		else if(which === 'right') {
			$(this).css('border-right','1px solid #000');
		}
		else if(which === 'bottom') {
			$(this).css('border-bottom','1px solid #000');
		}
		else if(which === 'left') {
			$(this).css('border-left','1px solid #000');
		}
		else {
			$(this).css('border','1px solid #000');
		}
	});
}

/*隐藏边框线*/
function hideBorders() {
	$('.selected-widget').each(function() {
		$(this).css('border','');
		$(this).css('border-top','');
		$(this).css('border-right','');
		$(this).css('border-bottom','');
		$(this).css('border-left','');
		/*var tag = this.tagName.toLowerCase();
		if(tag === 'td' || tag === 'th') {
			$(this).addClass(tag + '-border-invisible');
		}*/
	});
}

function setFillWidth() {
	var selectedWidget = $('.selected-widget');
	if(!selectedWidget.hasClass('cell')) {
		selectedWidget.css('width', '100%');
	}
}

function setProperWidth() {
	var selectedWidget = $('.selected-widget');
	if(selectedWidget.hasClass('widget-text-static')) {
		selectedWidget.css('width','auto');
		var width = selectedWidget.width();
		selectedWidget.width(width);
	}
	else if(selectedWidget.hasClass('widget-text-dynamic')) {
		var width = selectedWidget.parent().width();
		selectedWidget.width(width);
	}
	else if(selectedWidget.hasClass('cell')) {
		var width = 0;
		selectedWidget.children('.widget-text-static').each(function(){
			width = width + $(this).width();
		});
		if(width > 0) {
			var tableId = selectedWidget.attr('table');
			var colIndex = selectedWidget.attr('coordinate').split('-')[0];
			var col = $('colgroup[table='+ tableId +']').find('col:eq('+ colIndex +')');
			col.css('width', width);
		}
	}
}