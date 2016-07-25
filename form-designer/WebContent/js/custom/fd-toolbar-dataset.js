function createSqlOperateControls() {
	var arr = [{
		id:'show-sqls-btn',
		icon:'url(icon/show_sql.png)',
		title:'显示sql'
	},{
		id:'hide-sqls-btn',
		icon:'url(icon/hide_sql.png)',
		title:'隐藏sql'
	},{
		id:'add-sql-btn',
		icon:'url(icon/add_sql.png)',
		title:'添加sql'
	},{
		id:'edit-sql-btn',
		icon:'url(icon/edit_sql.png)',
		title:'修改sql'
	},{
		id:'delete-sql-btn',
		icon:'url(icon/delete_sql.png)',
		title:'删除sql'
	},{
		id:'edit-script-btn',
		icon:'url(icon/edit_sql.png)',
		title:'编辑脚本'
	}];
	for(var i = 0; i < arr.length; i++) {
		createSqlOperateControl(arr[i]);
	}
}

function createSqlOperateControl(config) {
	var control = document.createElement('div');
	$(control).attr('id', config.id);
	$(control).attr('title', config.title);
	$(control).addClass('control');
	$(control).css({
		'background-image': config.icon,
		'background-repeat':'no-repeat',
		'background-position':'center'
	});
	$('.datasets').append(control);
}

/*显示数据集管理对话框*/
function showSqlManagementDialog(sqlName) {
	var mask = $('.mask-layer-tpl').clone();
	mask.addClass('mask-layer').removeClass('mask-layer-tpl');
	var dialog = $('.sql-management-dialog-tpl').clone();
	dialog.removeClass('sql-management-dialog-tpl');
	dialog.addClass('dialog');
	mask.find('.dialog-zone').append(dialog);
	mask.appendTo(document.body);
	
	if(sqlName) {
		var sqlItem = $('.sql-node[name='+ sqlName +']');
		var sqlVal = sqlItem.find('.sql').html();
		var sqlResultType = sqlItem.find('.sql-result-type').html();
		var sqlResultLimit = sqlItem.find('.sql-result-limit').html();
		var varName = sqlItem.find('.var-name').html();
		dialog.find('input[name=sql-name]').val(sqlName);
		dialog.find('input[name=sql-result-limit]').val(sqlResultLimit);
		dialog.find('select[name=sql-result-type]').val(sqlResultType);
		if(varName) {
			dialog.find('.var-name-wrapper').show();
			dialog.find('input[name=var-name]').val(varName);
		}
		dialog.find('textarea[name=sql]').val(sqlVal);
	}
	dialog.find('.ok-btn').unbind('click').bind('click',function(){
		var sqlName = dialog.find('input[name=sql-name]').val();
		var sqlResultLimit = dialog.find('input[name=sql-result-limit]').val();
		var sqlResultType = dialog.find('select[name=sql-result-type]').val();
		var varName = dialog.find('input[name=var-name]').val();
		var sql = dialog.find('textarea[name=sql]').val();
		if($.trim(sqlName) <= 0) {
			alert('数据集名称不能为空！');
			return false;
		}
		if($.trim(sql) <= 0) {
			alert('sql不能为空！');
			return false;
		}
		if(sqlResultType == 'multi' && $.trim(varName) <= 0) {
			alert('迭代变量名不能为空！');
			return false;
		}
		
		var sqlNode = $('.sql-node[name='+ sqlName +']');
		if(sqlNode.length <= 0) {
			sqlNode = $('.sql-wrapper-tpl').find('.sql-node').clone();
			$('.sql-wrapper').append(sqlNode);
		}
		$(sqlNode).attr('name', $.trim(sqlName));
		$(sqlNode).find('.sql-name').html($.trim(sqlName));
		$(sqlNode).find('.sql-result-type').html(sqlResultType);
		$(sqlNode).find('.var-name').html($.trim(varName));
		$(sqlNode).find('.sql-result-limit').html(sqlResultLimit);
		if($.trim(varName)) {
			$(sqlNode).find('.var-name').show();
		}
		else {
			$(sqlNode).find('.var-name').hide();
		}
		if(sqlResultLimit) {
			$(sqlNode).find('.sql-result-limit').show();
		}
		else {
			$(sqlNode).find('.sql-result-limit').hide();
		}
		$(sqlNode).find('.sql').html(sql);
		$(sqlNode).find('.sql_name').html();
		registerSelectedSqlNodeHandler(sqlNode);
		$(sqlNode).show();
		mask.remove();
	});
	dialog.find('.cancel-btn').unbind('click').bind('click', function(){
		mask.remove();
	});
	mask.show();
	dialog.show();
}

function registerSelectedSqlNodeHandler(sqlNode) {
	$(sqlNode).bind('click', function() {
		$('.selected-sql').removeClass('selected-sql');
		$(this).addClass('selected-sql');
	});
}

function registerSqlConfigHandlers() {
	$('#show-sqls-btn').bind('click', function(){
		$('.sql-wrapper').show();
	});
	$('#hide-sqls-btn').bind('click', function(){
		$('.sql-wrapper').hide();
	});
	$('#add-sql-btn').bind('click', function(){
		showSqlManagementDialog();
	});
	$('#edit-sql-btn').bind('click', function(){
		var selectedSql = $('.selected-sql');
		if(selectedSql.length > 0) {
			var sqlName = selectedSql.attr('name');
			showSqlManagementDialog(sqlName);
		}
	});
	$('#delete-sql-btn').bind('click', function(){
		var selectedSql = $('.selected-sql');
		if(selectedSql.length > 0) {
			selectedSql.remove();
		}
	});
	$('#edit-script-btn').bind('click', function(){
		var scriptWrapper = $('#form-script');
		var script = scriptWrapper.html();
		showEditScriptDialog(script);
	});
}

function showEditScriptDialog(script) {
	var mask = $('.mask-layer-tpl').clone();
	mask.addClass('mask-layer').removeClass('mask-layer-tpl');
	var dialog = $('.edit-script-dialog-tpl').clone();
	dialog.removeClass('sql-management-dialog-tpl');
	dialog.addClass('dialog');
	mask.find('.dialog-zone').append(dialog);
	mask.appendTo(document.body);
	if(script) {
		dialog.find('textarea').val(script)
	}
	dialog.find('.ok-btn').unbind('click').bind('click',function(){
		var js = dialog.find('textarea').val();
		$('#form-script').html(js);
		mask.remove();
	});
	dialog.find('.cancel-btn').unbind('click').bind('click', function(){
		mask.remove();
	});
	mask.show();
	dialog.show();
}