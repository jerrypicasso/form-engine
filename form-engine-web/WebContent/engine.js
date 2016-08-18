(function($) {
	toastr.options = {positionClass: 'toast-top-center'};
	
	var plugins = {};
	
	$.Engine = {
		'plugin': function(name, options) {
			plugins[name] = options;
		}	
	};
	
	$.fn.form = function(funcName,options) {
		if(funcName) {
			var func = methods[funcName];
			if(func) {
				return func.apply(this, [options]);
			}
		}
	};
	
	var methods = {
		'load': function(options) {
			var container = $(this);
			if(options) {
				container.data('options', options);
			}
			loadForm(options, container);
		},
		'reload':function(options) {
			var container = $(this);
			loadForm(null, container);
		},
		'toggle': function(options) {
			var container = $(this);
			var mode = container.data('mode') == 'view'? 'edit':'view';
			if(options) {
				mode = options['mode'];
			}
			if(mode == 'view') {
				viewForm(container);
			}
			else {
				editForm(container);
			}
			for(var name in plugins) {
				plugin = plugins[name];
				if(plugin.afterModeChanged) {
					plugin.afterModeChanged.apply(container, [{
						'container': container,
						'mode': mode
					}]);
				}
			}
			container.data('mode', mode);
			container.trigger('mode-changed',[{'mode': mode}]);
			renderCheckboxWidgets(container);
		},
		'save': function(options) {
			var container = $(this);
			var mode = container.data('mode');
			if(mode == 'edit') {
				saveForm(container);
			}
		},
		'delete': function(options) {
			var container = $(this);
		},
		'stage': function(options) {
			var container = $(this);
			var mode = container.data('mode');
			if(mode == 'edit') {
				stageForm(container);
			}
		},
		'export' : function(options) {
			var container = $(this);
			var type = options ? options['type']:'pdf';
			var mode = container.data('mode');
			if(mode != 'edit') {
				if(type === 'doc') {
					exportDoc(container);
				}
				else if(type === 'xls') {
					exportXls(container);
				}
				else {
					exportPdf(container);
				}
			}
		},
		'lookup' : function(options) {
			var obj = {};
			var container = $(this);
			var fieldName = options ? options['field']:null;
			if(fieldName) {
				var hiddenWidget = container.find('.widget-field-hidden[field='+ fieldName +']');
				if(hiddenWidget) {
					var valueField = hiddenWidget.find('.value-field');
					var displayField = hiddenWidget.find('.display-field');
					obj.value = valueField.html() || null;
					obj.text = displayField.html() || null;
				}
			}
			return obj;
		}
	};
	
	function exportPdf(container) {
		var header = container.find('.header').clone();
		header.find('.tool-bar,.value-field,.widget-field-hidden').remove();
		header.width(container.find('.header').width());
		header.css('margin','0 auto');
		var footer = container.find('.footer').clone();
		footer.find('.tool-bar,.value-field,.widget-field-hidden').remove();
		footer.width(container.find('.footer').width());
		footer.css('margin','0 auto');
		//如果行高不大于48则不允许行内分页,(是否要在页面加载完后触发?)
		$(container).find('.content table.data-row').each(function(){
			if($(this).height() <= 48) {
				var style = $(this).attr('style');
				style = style + "page-break-inside:avoid;"
				$(this).attr('style', style);
			}
		});
		var content = container.find('.content').clone();
		content.find('.tool-bar,.value-field,.widget-field-hidden').remove();
		content.width(container.find('.content').width());
		content.css('margin','0 auto');
		
		var parts = [header, footer, content];
		var href = window.location.href;
		href = href.substring(0, href.lastIndexOf('/'));
		$(parts).each(function(){
			//去除隐藏值域
			$(this).find('.value-field').remove();
			//替换img地址
			$(this).find('img').each(function(){
				var img = $(this);
				var relativeHref = img.attr('src');
				img.attr('src', href + relativeHref);
			});
			//表格数据中的text文本域样式中的inline-block改为block,否则打印会有断行问题
			$(this).find('.row-field.widget-field-text').css('display','block');
			//分页处理的表格，表头不需要加-fs-table-paginate:paginate
			$(this).find('thead .widget-table').each(function(){
				var table = $(this);
				table.attr('style', table.attr('style').replace('-fs-table-paginate:paginate;',''));
			});
			//去除分页栏
			$(this).find('.page-wrapper').remove();
			//表头和表体的容器单元格需要设为border:none否则打印出来表头和表体之间有间隙
			//TODO
		});
		
		var headerHeight = container.find('.header').height();
		var footerHeight = container.find('.footer').height();
		var marginTop = container.find('.content-wrapper').css('padding-top').replace('px','');
		var marginRight = container.find('.content-wrapper').css('padding-right').replace('px','');
		var marginBottom = container.find('.content-wrapper').css('padding-bottom').replace('px','');
		var marginLeft = container.find('.content-wrapper').css('padding-left').replace('px','');
		var direction = container.find('.paper').attr('direction');
		$('#export-form').attr('action', 'form/export.process?type=pdf');
		$('#export-form').find('input[name=header]').val(header.prop('outerHTML'));
		$('#export-form').find('input[name=footer]').val(footer.prop('outerHTML'));
		$('#export-form').find('input[name=content]').val(content.prop('outerHTML'));
		$('#export-form').find('input[name=header-height]').val(headerHeight);
		$('#export-form').find('input[name=footer-height]').val(footerHeight);
		$('#export-form').find('input[name=margin-top]').val(marginTop);
		$('#export-form').find('input[name=margin-right]').val(marginRight);
		$('#export-form').find('input[name=margin-bottom]').val(marginBottom);
		$('#export-form').find('input[name=margin-left]').val(marginLeft);
		$('#export-form').find('input[name=direction]').val(direction);
		$('#export-form').submit();
	}
	
	function exportDoc(container) {
		//TODO
	}
	
	function exportXls(container) {
		//TODO
	}
	
	function stageForm(container) {
		KindEditor.sync('textarea');
		KindEditor.remove('textarea');
		var paper = container.find('.paper');
		paper.find('.widget-check').removeClass('editable');
		paper.find('.main-field').each(function(){
			var mainField = $(this);
			mainField.removeClass('editable');
			var editor = mainField.find('.editor');
			var fieldValue = editor.val();
			var valueField = mainField.find('.value-field');
			var displayField = mainField.find('.display-field');
			var fieldText = '';
			if(editor.hasClass('select')) {
				fieldValue = editor.select2('val');
				if($.isArray(fieldValue)) {
					fieldValue = fieldValue.join(',');
				}
				var selectedData = editor.select2('data');
				if($.isArray(selectedData)) {
					var arr = [];
					for(var i = 0; i < selectedData.length; i++) {
						arr.push(selectedData[i].name);
					}
					fieldText = arr.join(',');
				}
				else if(selectedData) {
					fieldText = selectedData.name;
				}
				editor.select2('destroy');
			}
			else {
				fieldText = fieldValue;
			}
			valueField.html(fieldValue);
			displayField.html(fieldText);
			editor.remove();
			displayField.show();
		});
		paper.find('.data-row').each(function(){
			$(this).removeClass('editing');
			$(this).removeClass('selected');
			$(this).removeClass('editable');
			$(this).find('.row-field').each(function(){
				var rowField = $(this);
				var editor = rowField.find('.editor');
				if(editor.hasClass('select')) {
					editor.select2('destroy');
				}
				editor.remove();
				rowField.find('.display-field').show();
			});
		});
		paper.find('.tool-bar').remove();
		
		//插件都变为view状态
		for(var name in plugins) {
			plugin = plugins[name];
			if(plugin.afterModeChanged) {
				plugin.afterModeChanged.apply(container, [{
					'container': container,
					'mode': 'view'
				}]);
			}
		}
		
		var html = paper.prop('outerHTML');
		var opts = container.data('options');
		var key = JSON.stringify(opts);
		var param = {
			'key': key,
			'content': html
		};
		$.ajax({
			url:'form/stage.process',
			type:'post',
			data: param,
			success:function(data) {
				toastr['success']('暂存完毕！');
				var func = methods['reload'];
				func.apply(container);
			}
		});
	}
	
	function saveForm(container) {
		var msg = [];
		var records = [];
		KindEditor.sync('textarea');
		container.find('.main-field').each(function() {
			var dataField = $(this);
			var editor = dataField.find('.editor');
			validateField(editor, msg);
			var fieldName = dataField.attr('field');
			var tableName = dataField.attr('table');
			var primaryKey = dataField.attr('primary-key');
			var fieldValue = editor.val();
			if(editor.hasClass('select')) {
				fieldValue = editor.select2('val');
				if($.isArray(fieldValue)) {
					fieldValue = fieldValue.join(',');
				}
			}
			records.push({
				'tableName' : tableName,
				'fieldName' : fieldName,
				'fieldValue': fieldValue,
				'isPrimary' : primaryKey
			});
		});
		if(msg.length > 0) {
			toastr['error'](msg.join('<br/>'));
			return;
		}
		var errors = [];
		container.trigger('before-save', [records, errors]);
		if(errors.length <= 0) {
			var tableName = container.find('.paper').attr('table-name');
			var primaryKeyField = container.find('.main-field[primary-key=true]');
			if(primaryKeyField.length <= 0) {
				primaryKeyField = container.find('.main-field[field=id]');
			}
			if(primaryKeyField.length > 0) {
				var primaryKeyName = primaryKeyField.attr('field');
				var primaryKeyValue = primaryKeyField.find('.value-field').html();
				var data = {};
				var params = {
					//'tableName':tableName,
					//'primaryKeyName':primaryKeyName,
					//'primaryKeyValue':primaryKeyValue,
					'record':JSON.stringify(records),
					'stageKey':JSON.stringify(container.data('options'))
				};
				$.extend(data, container.data('lastOptions'));
				$.extend(data, params);
				$.ajax({
					url:'form/save.process',
					type:'post',
					data:data,
					success:function(data){
						if(data.success == false) {
							toastr['error'](data.message);
						}
						else {
							container.data('mode', 'view');
							var func = methods['reload'];
							func.apply(container);
						}
					}
				});
			}
			else {
				toastr['error']('未设置主键字段，无法保存修改！');
				return false;
			}
		}
		else {
			toastr['error'](errors.join('<br/>'));
		}
	}
	
	function viewForm(container) {
		KindEditor.remove('textarea');
		container.find('.edit-wrapper').remove();
		//删除编辑器
		//$('.main-field .ok-cancel-wrapper').remove();
		/*$('.main-field .editor').each(function(){
			if($(this).hasClass('select')) {
				$(this).select2('destroy');
			}
		});*/
		container.find('.main-field .editor').remove();
		//清除注册的事件
		container.find('.main-field .display-field').unbind();
		//显示文本域
		container.find('.main-field .display-field').show();
		//去掉主表数据可编辑状态
		container.find('.main-field').removeClass('editable');
		//去掉选中状态
		container.find('.data-row').removeClass('selected');
		//去掉子表数据可编辑状态
		container.find('.data-row').unbind();
		container.find('.data-row[row-mode=new]').remove();
		container.find('.data-row.editing').each(function(){
			$(this).removeClass('editing');
			/*$(this).find('.editor').each(function(){
				if($(this).parent().hasClass('widget-field-staff')
						|| $(this).parent().hasClass('widget-field-dict')) {
					$(this).select2('destroy');
				}
			});*/
			$(this).find('.editor').remove();
			$(this).find('.display-field').show();
		});
		container.find('.widget-check').removeClass('editable');
		container.find('.widget-check').unbind('click');
		container.find('.widget-check .check-field').html('');
	}
	
	function editForm(container) {
		var iteratorWrappers = container.find('.iterator-wrapper[editable=true]');
		iteratorWrappers.find('.edit-wrapper').remove();
		iteratorWrappers.each(function(){
			var iteratorWrapper = $(this);
			var editWrapper = $('<div class="edit-wrapper"></div>');
			var insertBtn = $('<input type="button" class="edit-btn" value="新增"/>');
			insertBtn.unbind('click').bind('click', function(){
				insertDataRow.call(container, iteratorWrapper);
				return false;
			});
			insertBtn.appendTo(editWrapper);
			var updateBtn = $('<input type="button" class="edit-btn" value="修改"/>');
			updateBtn.unbind('click').bind('click', function(){
				updateDataRow.call(container, iteratorWrapper);
				return false;
			});
			updateBtn.appendTo(editWrapper);
			var deleteBtn = $('<input type="button" class="edit-btn" value="删除"/>');
			deleteBtn.unbind('click').bind('click', function(){
				deleteDataRow.call(container, iteratorWrapper);
				return false;
			});
			deleteBtn.appendTo(editWrapper);
			var saveRowBtn = $('<input type="button" class="edit-btn" value="保存"/>');
			saveRowBtn.unbind('click').bind('click', function(){
				saveDataRow.call(container, iteratorWrapper);
				return false;
			});
			saveRowBtn.appendTo(editWrapper);
			var cancelBtn = $('<input type="button" class="edit-btn" value="取消"/>');
			cancelBtn.unbind('click').bind('click', function(){
				cancelEditRow.call(container, iteratorWrapper);
				return false;
			});
			cancelBtn.appendTo(editWrapper);
			//$(this).addClass('editable');
			$(this).append(editWrapper);
		});
		//点击后高亮，表示行被选中
		iteratorWrappers.find('.data-row').click(function(){
			container.find('.data-row').removeClass('selected');
			$(this).addClass('selected');
			return false;
		});
		//鼠标移入后，边框高亮，表示可选
		iteratorWrappers.find('.data-row').mouseenter(function() {
			if(!$(this).hasClass('editing')) {
				$(this).addClass('editable');
			}
		});
		//鼠标移出后，取消边框高亮
		iteratorWrappers.find('.data-row').mouseleave(function() {
			$(this).removeClass('editable');
		});
		//双击可编辑
		iteratorWrappers.find('.data-row').bind('dblclick', function() {
			var iteratorWrapper = $(this).parents('.iterator-wrapper:first');
			if(iteratorWrapper.attr('editable') === 'true' && !$(this).hasClass('editing')) {
				$(this).addClass('selected');
				updateDataRow(iteratorWrapper);
			}
		});
		//主表数据可编辑状态
		container.find('.main-field').each(function(){
			var mainField = $(this);
			if(!mainField.hasClass('editable')) {
				createFieldEditor(mainField);
				mainField.addClass('editable');
			}
		});
		//chechbox可编辑状态
		container.find('.widget-check').each(function(){
			var widgetCheck = $(this);
			widgetCheck.addClass('editable');
			widgetCheck.unbind('click').bind('click', function(){
				var fieldName = $(this).attr('field');
				var parent = $(this).parents('table[check-group-type]:first');
				if(parent.length > 0 && fieldName) {
					var realVal = $(this).find('.value-field').html();
					var hiddenField = parent.find('.widget-field-hidden[field='+ fieldName +']');
					var checkGroupType = parent.attr('check-group-type');
					var checkField = $(this).find('.check-field');
					if(checkField.html() == '√') {
						checkField.html('');
					}
					else {
						checkField.html('√');
						//如果是单选设置，则将其余的checkbox都设为''
						if(checkGroupType == 'single') {
							parent.find('.widget-check .check-field').each(function(){
								if($(this).prev().html() != realVal) {
									$(this).html('');
								}
							});
						}
					}
					var arr = [];
					parent.find('.check-field').each(function(){
						if($(this).html() == '√') {
							var val = $(this).prev().html();
							arr.push(val);
						}
					});
					hiddenField.find('.editor').val(arr.join(','));
					hiddenField.find('.editor').change();
				}
			});
		});
	}
	
	function loadForm(options, container) {
		var params = {};
		var lastOptions = container.data('lastOptions');
		if(lastOptions) {
			$.extend(params, lastOptions);
		}
		if(options) {
			$.extend(params, options);
		}
		var opts = container.data('options');
		if(opts) {
			$.extend(params,{'stageKey': JSON.stringify(opts)});
		}
		var mode = container.data('mode') || 'view';
		$.extend(params, {'mode': mode});
		
		$.ajax({
			url : 'form/load.process',
			data : params,
			type : 'post',
			dataType : 'json',
			success : function(data) {
				//将返回的表单html放在container中
				if(data['success'] == false) {
					toastr['error'](data['message']);
					return;
				}
				container.html(data['content']);
				container.data('lastOptions', params);
				container.data('mode', data['mode']);
				handleEmptyWidgetField(container);
				createPaginationBars(container);
				renderCheckboxWidgets(container);
				createExportForm();
				container.find('.data-row[row-tpl=true]').hide();
				var mode = container.data('mode');
				container.trigger('form-loaded', [{'mode':mode}]);
				for(var name in plugins) {
					plugin = plugins[name];
					if(plugin.afterFormLoaded) {
						plugin.afterFormLoaded.apply(container, [{
							'container': container,
							'mode': mode
						}]);
					}
				}
				if(mode == 'edit') {
					container.data('mode', 'edit');
					var func = methods['toggle'];
					func.apply(container, [{'mode':'edit'}]);
				}
			}
		});
	}
	
	function validateField(editor, msg) {
		editor.each(function(){
			var val = $(this).val()||'';
			var fieldName = $(this).attr('field');
			var required = $(this).attr('required');
			if(required == 'true' || required == 'required') {
				if(val.length <= 0) {
					msg.push(fieldName + '是必填项，不允许为空！');
				}
			}
			var maxLength = $(this).attr('maxLength');
			if(maxLength) {
				if(val.length > maxLength) {
					msg.push(fieldName + '字符长度不允许超过' + maxLength + '，当前长度' + val.length);
				}
			}
		});
	}

	function createFieldEditor(dataField) {
		//var width = dataField.width();
		var type = dataField.attr('type');
		var fieldName = dataField.attr('field');
		var required = dataField.attr('required');
		var maxLength = dataField.attr('max-len');
		var txtField = dataField.find('.display-field');
		var valField = dataField.find('.value-field');
		var val = valField.html();
		val = $.trim(val);
		var txt = txtField.html();
		txt = $.trim(txt);
		var editor = null;
		if(type == 'select') {
			editor = document.createElement('input');
			dataField.prepend(editor);
			var filter = dataField.attr('filter');
			var category = dataField.attr('category');
			var multiple = dataField.attr('multi-select');
			var master = dataField.attr('master');
			var autocomplete = dataField.attr('trigger');
			var closeOnSelect = true;
			if(multiple === 'multiple') {
				closeOnSelect = false;
			}
			var minimumInputLength = null;
			var minimumResultsForSearch = 'Infinity';
			if(autocomplete === 'true') {
				minimumInputLength = 1;
				minimumResultsForSearch = null;
			}
			$(editor).select2({
				minimumInputLength : minimumInputLength,
				minimumResultsForSearch : minimumResultsForSearch,
				closeOnSelect: closeOnSelect,
				language : {
					inputTooShort: function(args) {
						return '<span style="font-size:12px;">请输入</span>';
					},
					noResults: function() {
						return '<span style="font-size:12px;">没找到</span>';
				    }
				},
				multiple : multiple === 'multiple',
				ajax:{
					url : 'form/fill-combo.process',
					dataType : 'json',
					type: 'post',
					quietMillis : 250,
					cache : true,
					data : function(term, page) {
						return {
							'category': category,
							'filter': filter,
							'fuzzy' : term,
							'master' : master,
							'page' : page
						};
					},
					results : function(data, page) {
						var results = [];
						$.each(data, function(index, item){
							results.push({
								id : item.val,
								name : item.txt
							});
						});
						return {results : results};
					}
				},
				initSelection: function(element, callback) {
					var data = null;
					var multi = element.attr('multi');
					var display = element.data('display');
					var value = element.val();
					if(value && display) {
						if(multi === 'true') {
							data = [];
							var txtArr = display.split(',');
							var valArr = value.split(',');
							for(var i = 0; i < Math.min(txtArr.length, valArr.length); i++) {
								data.push({id:valArr[i], name:txtArr[i]});
							}
							if(data.length > 0) {
								callback(data);
							}
						}
						else {
							data = {id: value, name: display};
							callback(data);
						}
					}
				},
				escapeMarkup : function(markup) {
					return markup;
				},
				formatResult : function(item) {
					return item.name;
				},
				formatSelection : function(item) {
					return item.name;
				}
			});
			$(editor).attr('multi', multiple === 'multiple');
			$(editor).data('display', txt);
			$(editor).val(val).trigger('change');
		}
		else if(type == 'date') {
			editor = document.createElement('input');
			dataField.prepend(editor);
			//$(editor).addClass('Wdate');
			$(editor).bind('click', function(){
				WdatePicker({
					readOnly:true,
					dateFmt:'yyyy-MM-dd HH:mm:ss',
					maxDate:'%y-%M-%d %H:%m:%s'
				});
			});
			$(editor).val(val);
		} 
		else if(type == 'number') {
			editor = document.createElement('input');
			dataField.prepend(editor);
			var min = dataField.attr('min-num') || 0;
			var max = dataField.attr('max-num') || 9999;
			if(min) {
				$(editor).attr('min', min);
			}
			if(max) {
				$(editor).attr('max', max);
			}
			$(editor).val(val);
		} 
		/*else if(type == 'check') {
			dataField.find('.check-field').bind('click', function(){
				var checkField = $(this);
				var fieldName = checkField.parent().attr('field');
				var parent = $(this).parents('table[check-group-type]:first');
				if(parent.length > 0 && fieldName) {
					var realVal = checkField.prev().html();
					var hiddenField = parent.find('.widget-field-hidden[field='+ fieldName +']');
					var checkGroupType = parent.attr('check-group-type');
					if(checkField.html() == '√') {
						checkField.html('');
					}
					else {
						checkField.html('√');
						//如果是单选设置，则将其余的checkbox都设为''
						if(checkGroupType == 'single') {
							parent.find('.widget-check .check-field').each(function(){
								if($(this).prev().html() != realVal) {
									$(this).html('');
								}
							});
						}
					}
					var arr = [];
					parent.find('.check-field').each(function(){
						if($(this).html() == '√') {
							var val = $(this).prev().html();
							arr.push(val);
						}
					});
					hiddenField.find('.editor').val(arr.join(','));
				}
			});
		}*/
		else if(type == 'text' || dataField.hasClass('widget-field-hidden')) {
			var isRich = dataField.attr('rich');
			if(isRich === 'true') {
				editor = document.createElement('textarea');
				$(editor).val(val);
				dataField.prepend(editor);
				KindEditor.create(editor, {
					width: '100%',
					newlineTag : 'br',
					uploadJson : 'form/upload.process',
					items : ['fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
							'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
							'insertunorderedlist', '|', 'table', 'image', 'link']
				});
			}
			else {
				editor = document.createElement('input');
				dataField.prepend(editor);
				$(editor).val(val);
			}
			$(editor).attr({'maxLength':maxLength});
		}
		
		txtField.hide();
		$(editor).addClass('editor');
		$(editor).addClass(type);
		$(editor).css('width', '100%');
		$(editor).attr({'field':fieldName,'required':required});
	}

	function createPaginationBars(container) {
		var iteratorWrapper = $('.iterator-wrapper');
		iteratorWrapper.find('.page-wrapper').remove();
		//为每个子表添加分页栏
		iteratorWrapper.each(function(){
			var wrapper = $(this);
			//总页数
			var pages = wrapper.attr('total-page');
			var rows = wrapper.attr('total-row');
			var pageParamName = wrapper.attr('page-param-name');
			if(pages && parseInt(pages) > 0) {
				var pageWrapper = $('<div class="page-wrapper">');
				pageWrapper.appendTo(wrapper);
				var firstPageBtn = $('<input type="button" class="page-btn" value="首页"/>');
				firstPageBtn.appendTo(pageWrapper);
				firstPageBtn.click(function(){
					var param = new Object();
					param[pageParamName] = 0;
					loadForm(param, container);
				});
				var prevPageBtn = $('<input type="button" class="page-btn" value="上一页"/>');
				prevPageBtn.appendTo(pageWrapper);
				prevPageBtn.click(function(){
					var lastOptions = container.data('lastOptions');
					var page = lastOptions[pageParamName] || 0
					if(page > 0) {
						page--;
					}
					var param = new Object();
					param[pageParamName] = page;
					loadForm(param, container);
				});
				var currentPage = $('<span id="'+ pageParamName +'"></span>');
				currentPage.appendTo(pageWrapper);
				var totalRows = $('<span>，共' + rows + '条记录</span>');
				totalRows.appendTo(pageWrapper);
				var nextPageBtn = $('<input type="button" class="page-btn" value="下一页"/>');
				nextPageBtn.appendTo(pageWrapper);
				nextPageBtn.click(function(){
					var lastOptions = container.data('lastOptions');
					var page = lastOptions[pageParamName] || 0
					if(page < (pages - 1)) {
						page++;
					}
					var param = new Object();
					param[pageParamName] = page;
					loadForm(param, container);
				});
				var lastPageBtn = $('<input type="button" class="page-btn" value="尾页"/>');
				lastPageBtn.appendTo(pageWrapper);
				lastPageBtn.click(function(){
					var param = new Object();
					param[pageParamName] = pages - 1;
					loadForm(param, container);
				});
				var lastOptions = container.data('lastOptions');
				var currentPage = lastOptions[pageParamName] || 0;
				currentPage++;
				$('#' + pageParamName).html('第' + currentPage + '页/共' + pages + '页');
			}
		});
	}
	
	function handleEmptyWidgetField(container) {
		container.find('.display-field,.widget-text-dynamic').each(function(){
			var displayField = $(this);
			if($.trim(displayField.html()) === '') {
				displayField.html('&nbsp;');
			}
		});
	}

	function renderCheckboxWidgets(container) {
		container.find('.widget-check').each(function() {
			var fieldName = $(this).attr('field');
			var checkVal = $(this).find('.value-field').html();
			var checkGroupParent = $(this).parents('table[check-group-type]:first');
			if(checkGroupParent.length > 0) {
				var hiddenField = checkGroupParent.find('.widget-field-hidden[field='+fieldName+']');
				if(hiddenField.length > 0) {
					var hiddenVal = hiddenField.find('.value-field').html();
					var checkGroupType = checkGroupParent.attr('check-group-type');
					if(checkGroupType === 'single') {
						if(hiddenVal == checkVal) {
							$(this).find('.check-field').html('√');
						}
					}
					else if(checkGroupType === 'multi') {
						var arr = hiddenVal.split(',');
						if(arr.indexOf(checkVal) > -1) {
							$(this).find('.check-field').html('√');
						}
					}
				}
			}
		});
	}

	function createEditableRow(iteratorId, row) {
		if(row && row.length > 0) {
			row.find('.row-field').each(function(){
				var rowField = $(this);
				var iteratorWrapper = rowField.parents('.iterator-wrapper');
				if(iteratorId === iteratorWrapper.attr('id')) {
					createFieldEditor(rowField);
				}
			});
			row.removeClass('editable');
			row.addClass('editing');
		}
	}

	function createExportForm() {
		if($('#export-form').length <= 0) {
			var form = ['<form id="export-form" method="post" target="_blank" style="display:none;">',
						'<input type="hidden" name="header"/>',
						'<input type="hidden" name="footer"/>',
						'<input type="hidden" name="content"/>',
						'<input type="hidden" name="header-height"/>',
						'<input type="hidden" name="footer-height"/>',
						'<input type="hidden" name="margin-top"/>',
						'<input type="hidden" name="margin-right"/>',
						'<input type="hidden" name="margin-bottom"/>',
						'<input type="hidden" name="margin-left"/>',
						'<input type="hidden" name="direction"/>',
						'</form>'].join('');
			$(document.body).append(form);
		}
	}
	
	function insertDataRow(iteratorWrapper) {
		var newRow = iteratorWrapper.children('.data-row[row-tpl=true]:first').clone();
		newRow.attr('row-mode','new');
		iteratorWrapper.children('.data-row').remove();
		iteratorWrapper.prepend(newRow);
		var iteratorId = iteratorWrapper.attr('id');
		createEditableRow(iteratorId, newRow);
		newRow.show();
	}

	function updateDataRow(iteratorWrapper) {
		var selected = iteratorWrapper.find('.data-row.selected');
		if(selected && selected.length > 0) {
			var flag = true;
			for(var name in plugins) {
				plugin = plugins[name];
				if(plugin.beforeEditRow) {
					var ret = plugin.beforeEditRow.apply(container, [{
						'container': container,
						'wrapper': iteratorWrapper,
						'row': selected
					}]);
					flag = flag && ret;
				}
			}
			if(!flag) {
				return flag;
			}
			if(!selected.hasClass('editing')) {
				iteratorWrapper.find('.data-row[row-mode=new]').remove();
				iteratorWrapper.find('.data-row.editing').each(function(){
					$(this).removeClass('editing');
					$(this).find('.editor').each(function(){
						if($(this).hasClass('select')) {
							$(this).select2('destroy');
						}
					});
					$(this).find('.editor').remove();
					$(this).find('.display-field').show();
				});
				var primaryField = selected.find('.row-field[primary-key=true]:first');
				if(primaryField && $.trim(primaryField.find('.value-field').html()).length > 0) {
					var iteratorId = iteratorWrapper.attr('id');
					createEditableRow(iteratorId,selected);
				}
				else {
					toastr['warning']('此行主键为空值，无法修改！');
				}
			}
			
		}
		else {
			toastr['warning']('请选择一条记录！');
		}
	}

	function deleteDataRow(iteratorWrapper) {
		var container = $(this);
		var selected = iteratorWrapper.find('.data-row.selected');
		if(selected && selected.length > 0) {
			var primaryKey = selected.find('.row-field[primary-key=true]:first');
			if(primaryKey && primaryKey.length > 0) {
				var tableName = primaryKey.attr('table');
				var primaryKeyValue = primaryKey.find('.value-field').html();
				var primaryKeyName = primaryKey.attr('field') || 'GUID';
				var dropFlagName = 'DEL_FLAG';
				var dropFlagValue = '1';
				if(primaryKeyValue && tableName) {
					$.ajax({
						url:'form/drop.process',
						data:{
							'tableName':tableName,
							'primaryKeyName':primaryKeyName,
							'primaryKeyValue':primaryKeyValue,
							'dropFlagName':dropFlagName,
							'dropFlagValue':dropFlagValue
						},
						success:function(){
							var pageParamName = iteratorWrapper.attr('page-param-name');
							var param = new Object();
							param[pageParamName] = 0;
							loadForm(param, container);
						}
					});
				}
				else {
					toastr['warning']('此行主键为空值，无法删除！');
				}
			}
			else {
				toastr['warning']('没有设定主键，无法删除！');
			}
		}
		else {
			toastr['warning']('请选择一条记录！');
		}
	}

	function saveDataRow(iteratorWrapper) {
		KindEditor.sync('textarea');
		var row = iteratorWrapper.children('.data-row.editing');
		var editors = row.find('.editor');
		var msg = [];
		validateField(editors, msg);
		if(msg.length > 0) {
			toastr['error'](msg.join('<br/>'));
			return false;
		}
		var records = [];
		//var rowDataWrapper = row.parents('.iterator-wrapper');
		//var tableName = rowDataWrapper.attr('table-name');
		var primaryKeyField = row.find('.row-field[primary-key=true]');
		if(primaryKeyField.length <= 0) {
			primaryKeyField = row.find('.row-field[field=id]');
		}
		if(primaryKeyField.length > 0) {
			var primaryKeyName = primaryKeyField.attr('field');
			var primaryKeyValue = primaryKeyField.find('.value-field').html();
			row.find('.row-field').each(function(){
				var fieldName = $(this).attr('field');
				var tableName = $(this).attr('table');
				var primaryKey = $(this).attr('primary-key');
				var editor = $(this).find('.editor');
				var fieldValue = editor.val();
				if(editor.hasClass('select')) {
					fieldValue = editor.select2('val');
					if($.isArray(fieldValue)) {
						fieldValue = fieldValue.join(',');
					}
				}
				if(fieldName && tableName) {
					records.push({
						'tableName':tableName,
						'fieldName':fieldName,
						'fieldValue':fieldValue,
						'isPrimary':primaryKey
					});
				}
			});
			$.ajax({
				url:'form/save.process',
				type: 'post',
				data:{
					//'tableName':tableName,
					//'primaryKeyName':primaryKeyName,
					//'primaryKeyValue':primaryKeyValue,
					'record':JSON.stringify(records)
				},
				success:function() {
					var func = methods['reload'];
					func.apply(container);
				}
			});
		}
		else {
			toastr['error']('未设置主键字段，无法保存修改！');
			return false;
		}
	}

	function cancelEditRow(iteratorWrapper) {
		var func = methods['reload'];
		func.apply(container);
	}
	
})(jQuery);


