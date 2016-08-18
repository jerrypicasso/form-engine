/*创建表格元件*/
function createTableWidget(config) {
	var dropZone = $('.drop-zone');
	var column = config['table-col-num'];
	var table = document.createElement('table');
	$(table).attr('id', Math.uuidFast().toLowerCase());
	$(table).addClass('widget-table');
	$(table).addClass('droppable');
	if(config['is-data-row'] === '1') {
		$(table).addClass('data-row');
	}
	var style = 'width:0;border-collapse:collapse;table-layout:fixed;font-size:14px;';
	if(config['is-pagination-table'] === '1') {
		style = style + '-fs-table-paginate:paginate;word-break:break-all;border-spacing:0;';
	}
	if(config['check-group-type']) {
		$(table).attr('check-group-type', config['check-group-type']);
	}
	$(table).attr('style', style);
	var colWidth = null;
	if(dropZone.hasClass('widget-container')) {
		colWidth = Math.max(0,(dropZone.width() - 1))/column;
	}
	else {
		colWidth = Math.max(0,(dropZone.parent().width() - 1))/column;
	}
	colWidth = Math.floor(colWidth);
	var colGroup = document.createElement('colgroup');
	$(colGroup).attr('grid', $(table).attr('id'));
	$(colGroup).appendTo(table);
	for(var k = 0; k < column; k++) {
		var col = document.createElement('col');
		$(col).css({'width':colWidth + 'px'});
		$(col).appendTo(colGroup);
	}
	if(config['thead-row-num'] && config['thead-row-num'] > 0) {
		var thead = document.createElement('thead');
		$(table).append(thead);
		for (var m = 0; m < config['thead-row-num']; m++) {
			var tr = document.createElement('tr');
			$(tr).attr('index', m);
			$(tr).attr('id', Math.uuidFast().toLowerCase());
			$(tr).attr('grid', $(table).attr('id'));
			//行高默认为20像素
			$(tr).height(20);
			for (var n = 0; n < column; n++) {
				var th = document.createElement('th');
				$(th).attr('coordinate', n + '-' + m);
				$(th).attr('grid', $(table).attr('id'));
				$(th).addClass('droppable');
				$(th).addClass('cell');
				$(th).addClass('widget-container');
				//$(th).css({'padding':'0'/*,'white-space':'nowrap','overflow':'hidden'*/});
				$(th).addClass('th-border-invisible');
				$(tr).append(th);
			}
			$(thead).append(tr);
		}
	}
	var tbody = document.createElement('tbody');
	$(table).append(tbody);
	for (var i = 0; i < config['tbody-row-num']; i++) {
		var tr = document.createElement('tr');
		$(tr).attr('index', i);
		$(tr).attr('id', Math.uuidFast().toLowerCase());
		$(tr).attr('grid', $(table).attr('id'));
		//行高默认为20像素
		$(tr).height(20);
		for (var j = 0; j < column; j++) {
			var td = document.createElement('td');
			$(td).attr('coordinate', j + '-' + i);
			$(td).attr('grid', $(table).attr('id'));
			$(td).addClass('droppable');
			$(td).addClass('cell');
			$(td).addClass('widget-container');
			//$(td).css({'padding':'0'/*,'white-space':'nowrap','overflow':'hidden'*/});
			$(td).addClass('td-border-invisible');
			$(tr).append(td);
		}
		$(tbody).append(tr);
	}
	if(dropZone.hasClass('widget-container')) {
		$(table).appendTo(dropZone);
	}
	else {
		dropZone.before(table);
	}
	//使表格的宽度与其父容器的宽度一致
	var offset = $(table).parent().width() - $(table).width() - 1;
	if(offset > 0) {
		var cols = $(table).find('colgroup[grid='+ $(table).attr('id') +'] col');
		for(var i = 0; i < offset; i++) {
			var oldWidth = $(cols[i]).width();
			$(cols[i]).width(++oldWidth); 
		}
	}
	registerCellEventHandlers(table);
}

/*清空单元格*/
function emptyCells() {
	$('.cell.selected-widget').empty();
	$('.cell.selected-widget').removeClass('selected-widget');
}

/*传染算法，始终保持方形选择区域*/
function infect(tPart, tag, minX, minY, maxX, maxY) {
	var table = tPart.parent();
	tPart.find(tag + '[grid='+ table.attr('id') +']').each(function() {
		var cell = $(this);
		var xy = cell.attr('coordinate').split('-');
		//最小x坐标
		var x1 = parseInt(xy[0]);
		//最小y坐标
		var y1 = parseInt(xy[1]);
		//通过colspan计算横向偏移值
		var offsetX = (cell.attr('colspan') || 1) - 1;
		//通过rowspan计算纵向偏移值
		var offsetY = (cell.attr('rowspan') || 1) - 1;
		//最大x坐标
		var x2 = x1 + offsetX;
		//最大y坐标
		var y2 = y1 + offsetY;
		//左上角在区域
		if ((x1 >= minX && x1 <= maxX) && (y1 >= minY && y1 <= maxY)) {
			cell.addClass('selected-widget');
		} else if ((x2 >= minX && x2 <= maxX) && (y1 >= minY && y1 <= maxY)) {
			cell.addClass('selected-widget');
		} else if ((x1 >= minX && x1 <= maxX) && (y2 >= minY && y2 <= maxY)) {
			cell.addClass('selected-widget');
		} else if ((x2 >= minX && x2 <= maxX) && (y2 >= minY && y2 <= maxY)) {
			cell.addClass('selected-widget');
		}
	});

	var coordinates = calculateMinMaxCoordinates();
	var _minX = coordinates[0];
	var _minY = coordinates[1];
	var _maxX = coordinates[2];
	var _maxY = coordinates[3];
	//如果新老坐标有一点不匹配就再次进入传染算法
	if (minX != _minX || minY != _minY || maxX != _maxX || maxY != _maxY) {
		infect(tPart, tag, _minX, _minY, _maxX, _maxY);
	}
}

/* 计算最小和最大坐标 */
function calculateMinMaxCoordinates() {
	var coordinates = [];
	//新的最小x坐标
	var _minX = null;
	//新的最小y坐标
	var _minY = null;
	//新的最大x坐标
	var _maxX = null;
	//新的最大y坐标
	var _maxY = null;
	$('.cell.selected-widget').each(function() {
		var selectedCell = $(this);
		var colspan = selectedCell.attr('colspan') || 1;
		var rowspan = selectedCell.attr('rowspan') || 1;
		var offsetX = colspan - 1;
		var offsetY = rowspan - 1;
		var coordinate = selectedCell.attr('coordinate').split('-');
		var x1 = parseInt(coordinate[0]);
		var y1 = parseInt(coordinate[1]);
		var x2 = x1 + offsetX;
		var y2 = y1 + offsetY;

		if (_minX === null) {
			_minX = x1;
		}
		if (_minY === null) {
			_minY = y1;
		}
		if (_maxX === null) {
			_maxX = x2;
		}
		if (_maxY === null) {
			_maxY = y2;
		}
		_minX = Math.min(x1, _minX);
		_minY = Math.min(y1, _minY);
		_maxX = Math.max(x2, _maxX);
		_maxY = Math.max(y2, _maxY);
	});
	coordinates.push(_minX);
	coordinates.push(_minY);
	coordinates.push(_maxX);
	coordinates.push(_maxY);
	return coordinates;
}

/* 合并单元格 */
function mergeCells() {
	var coordinates = calculateMinMaxCoordinates();
	var minX = coordinates[0];
	var minY = coordinates[1];
	var maxX = coordinates[2];
	var maxY = coordinates[3];
	var colspan = (maxX - minX) + 1;
	var rowspan = (maxY - minY) + 1;
	$('.cell.selected-widget').each(function() {
		var selectedCell = $(this);
		var coordinate = selectedCell.attr('coordinate');
		if (coordinate != minX + '-' + minY) {
			selectedCell.remove();
		}
	});
	var cell = $('.cell.selected-widget[coordinate=' + minX + '-' + minY + ']')
	cell.attr({
		'colspan' : colspan,
		'rowspan' : rowspan
	});
	cell.removeClass('selected-widget');
}

/* 拆分单元格 */
function splitCells() {
	$('.cell.selected-widget').each(function(){
		var cell = $(this);
		var colspan = cell.attr('colspan') || 1;
		var rowspan = cell.attr('rowspan') || 1;
		cell.removeClass('selected-widget');
		if(colspan > 1 || rowspan > 1) {
			var tPart = cell.parent().parent();
			var tableId = cell.attr('grid');
			var table = $('#' + tableId);
			var xy = cell.attr('coordinate').split('-');
			var beginX = parseInt(xy[0]);
			var beginY = parseInt(xy[1]);
			var offsetX = colspan - 1;
			var offsetY = rowspan - 1;
			var endX = beginX + offsetX;
			var endY = beginY + offsetY;
			var tag = this.tagName.toLowerCase();
			//删除原来带colspan和rowspan的cell
			cell.remove();
			for (var i = beginY; i <= endY; i++) {
				//插在哪格后面
				var coordinate = (beginX - 1) + '-' + i;
				var prevCell = tPart.find(tag + '[coordinate=' + coordinate + '][grid=' + tableId + ']');
				//插在哪行最前面
				var row = tPart.find('tr[index=' + i + '][grid=' + tableId + ']');
				for (var j = beginX; j <= endX; j++) {
					var unit = document.createElement(tag);
					$(unit).addClass(tag + '-border-invisible');
					$(unit).attr('coordinate', j + '-' + i);
					$(unit).attr('grid', tableId);
					$(unit).addClass('widget-container');
					$(unit).addClass('droppable');
					$(unit).addClass('cell');
					//如果前格存在则插在其后面
					if (prevCell.length > 0) {
						prevCell.after(unit);
					}
					//否则插在行的最前面
					else {
						row.prepend(unit);
					}
					prevCell = $(unit);
				}
			}
			registerCellEventHandlers(table);
		}
	});
}

/*开始修改行高*/
function beginResizeRow(e) {
	var tr = $('tr.resizable');
	var oldY = tr.data('y');
	if(tr.length > 0) {
		var newY = e.pageY;
		var offsetY = newY - oldY;
		var height = Math.max(tr.height() + offsetY, 0);
		height = Math.min(height, $('.paper').height());
		tr.height(height);
		tr.data('y', newY);
	}
}

/*结束修改行高*/
function endResizeRow(e) {
	var tr = $('tr.resizable');
	tr.removeData('y');
	tr.removeClass('resizable');
}

/*开始修改列宽*/
function beginResizeCol(e) {
	var col = $('col.resizable');
	var oldX = col.data('x');
	if(col.length > 0) {
		var newX = e.pageX;
		var offsetX = newX - oldX;
		var oldWidth = col.get(0).style.width.replace('px', '');
		var width = Math.max(parseFloat(oldWidth) + offsetX, 0);
		width = Math.min(width, 1173/*col.parent().width()*/);
		col.get(0).style.width = width + 'px';
		col.data('x', newX);
	}
}

/*结束修改列宽*/
function endResizeCol(e) {
	var col = $('col.resizable');
	col.removeData('x');
	col.removeClass('resizable');
}

/*开始选择单元格*/
function beginSelectCells() {
	var cell = $(this);
	//如果有起始单元格
	var startCoordinate = $('.paper').data('startCoordinate');
	var tag = this.tagName.toLowerCase();
	if (startCoordinate) {
		$('.cell.selected-widget').removeClass('selected-widget');
		var coordinate = startCoordinate.split('-');
		var beginX = parseInt(coordinate[0]);
		var beginY = parseInt(coordinate[1]);
		coordinate = cell.attr('coordinate').split('-');
		var colspan = (cell.attr('colspan') || 1) - 1;
		var rowspan = (cell.attr('rowspan') || 1) - 1;
		var endX = parseInt(coordinate[0]);
		var endY = parseInt(coordinate[1]);
		endX = endX + colspan;
		endY = endY + rowspan;
		cell.addClass('selected-widget');
		
		var minX = Math.min(beginX, endX);
		var minY = Math.min(beginY, endY);
		var maxX = Math.max(endX, beginX);
		var maxY = Math.max(endY, beginY);
		
		var table = cell.parents('table:eq(0)');
		var tPart = cell.parent().parent();
		for (var x = minX; x <= maxX; x++) {
			for (var y = minY; y <= maxY; y++) {
				var position = x + '-' + y;
				var tableId = table.attr('id');
				var units = tPart.find(tag + '[coordinate=' + position + '][grid=' + tableId + ']');
				units.addClass('selected-widget');
			}
		}
		//进入传染算法
		infect(tPart, tag, minX, minY, maxX, maxY);
	}
}

/*结束选择单元格*/
function endSelectCells() {
	$('.paper').removeData('startCoordinate');
}

/*标记行高或列宽是否可修改*/
function markRowColResizable(e) {
	var cell = $(this);
	var top = cell.offset().top;
	var left = cell.offset().left;
	var width = cell.innerWidth();
	var height = cell.innerHeight();
	var pageX = e.pageX;
	var pageY = e.pageY;
	if(left + width - pageX < 1 ) {
		cell.removeClass('row-resizable');
		cell.addClass('col-resizable');
	}
	else if(top + height - pageY < 1) {
		cell.removeClass('col-resizable');
		cell.addClass('row-resizable');
	}
	else {
		cell.removeClass('row-resizable');
		cell.removeClass('col-resizable');
	}
}

/*鼠标按下后移动前要处理的事情*/
function beforeMousemoveAction(e) {
	var cell = $(this);
	$('.cell').unbind('mouseover');
	if (e.which === 1) {
		$('.selected-widget').removeClass('selected-widget');
		if(cell.hasClass('row-resizable')) {
			$('tr.resizable').removeClass('resizable');
			var tr = cell.parent();
			tr.addClass('resizable');
			tr.data('y', e.pageY);
			$(document.body).unbind('mousemove', beginResizeRow);
			$(document.body).bind('mousemove', beginResizeRow);
			$(document.body).unbind('mouseup', endResizeRow);
			$(document.body).bind('mouseup', endResizeRow);
		}
		else if(cell.hasClass('col-resizable')) {
			$('col.resizable').removeClass('resizable');
			var table = cell.attr('grid');
			var index = cell.attr('coordinate').split('-')[0];
			var col = $('colgroup[grid=' + table + '] col').get(index);
			$(col).addClass('resizable');
			$(col).data('x', e.pageX);
			$(document.body).unbind('mousemove', beginResizeCol);
			$(document.body).bind('mousemove', beginResizeCol);
			$(document.body).unbind('mouseup', endResizeCol);
			$(document.body).bind('mouseup', endResizeCol);
		}
		else {
			prepareRelativePropertiesFields(cell);
			$('.paper').data('startCoordinate', $(this).attr('coordinate'));
			cell.addClass('selected-widget');
			var table = cell.parents('table:eq(0)');
			var tPart = cell.parent().parent();
			var tag = this.tagName.toLowerCase();
			var cells = tPart.find(tag + '[grid='+ table.attr('id') +']');
			cells.unbind('mouseover', beginSelectCells);
			cells.bind('mouseover', beginSelectCells);
			$(document.body).unbind('mouseup', endSelectCells);
			$(document.body).bind('mouseup', endSelectCells);
		}
	}
	else if(e.which === 3) {
		cell.addClass('movable');
		$('.droppable').unbind('mouseover');
		var tableId = cell.attr('grid');
		$('.droppable[grid!='+ tableId +']').bind('mouseover',function(e) {
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
}

/*为每个单元格注册相关事件*/
function registerCellEventHandlers(table) {
	var cells = $(table).find('td,th');
	cells.unbind('mousedown', beforeMousemoveAction);
	cells.bind('mousedown', beforeMousemoveAction);
	cells.unbind('mousemove', markRowColResizable);
	cells.bind('mousemove', markRowColResizable);
}

function referColSetting() {
	var selectedCell = $('.cell.selected-widget');
	if(selectedCell.length >= 0) {
		var tableId = selectedCell.attr('grid');
		var table = $('#' + tableId);
		table.addClass('col-setting-referenced');
	}
}

function applyColSetting() {
	var selectedCell = $('.cell.selected-widget');
	var referencedTable = $('table.col-setting-referenced');
	if(selectedCell.length >= 0) {
		var applyingTableId = selectedCell.attr('grid');
		var referencedTableId = referencedTable.attr('id');
		if(applyingTableId != referencedTableId) {
			var colgroup = referencedTable.find('colgroup[grid='+ referencedTableId +']').clone();
			var applyingTable = $('#' + applyingTableId);
			applyingTable.find('colgroup[grid='+ applyingTableId +']').remove();
			colgroup.attr('grid', applyingTableId);
			applyingTable.prepend(colgroup);
		}
	}
	referencedTable.removeClass('col-setting-referenced');
}

function insertNewRow() {
	var selectedCell = $('.cell.selected-widget');
}

function insertNewCol() {
	var selectedCell = $('.cell.selected-widget');
}