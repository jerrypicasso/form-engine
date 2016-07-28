$.Engine.plugin('diagnosis',{
	//实现afterFormLoaded方法
	afterFormLoaded: function(options) {
		var container = options.container;
		var diagnosisWidget = container.find('.widget-custom-diagnosis');
		if(diagnosisWidget.length > 0) {
			queryDiagnosis(diagnosisWidget, container.data('options'));
		}
	},
	//实现afterModeChanged方法
	afterModeChanged: function(options) {
		var container = options.container;
		if(options.mode === 'view') {
			container.find('.widget-custom-diagnosis .display-field').unbind();
			container.find('.widget-custom-diagnosis .editor-wrapper').remove();
		}
		else if(options.mode === 'edit') {
			container.find('.widget-custom-diagnosis').each(function(){
				var diagnosis = $(this);
				diagnosis.addClass('editable');
				createDiagnosisEditor(diagnosis, container.data('options'));
			});
		}
	}
});

function queryDiagnosis(diagnosisWidget, opts) {
	var param = {'diagnosisType':'340'};
	$.extend(param, opts);
	$.ajax({
		url:'form/plugin.process?action=load&handler=diagnosis',
		data : param,
		dataType : 'json',
		success : function(data) {
			var displayField = diagnosisWidget.find('.display-field');
			displayField.empty();
			if(data.length > 0) {
				var list = $('<ul style="margin:0;padding:0;list-style:none;"></ul>');
				for(var i = 0; i < data.length; i++) {
					var li = $('<li id="'+ data[i].ID +'" type="main" class="selectable">');
					li.append('<b>'+ data[i].NAME +'</b>');
					list.append(li);
					var items = data[i].items;
					if(items && items.length > 0) {
						var subList = $('<ul style="margin:0 20px;padding:0;list-style:none;"></ul>');
						for(var j = 0; j < items.length; j++) {
							subList.append('<li id="'+ items[j].ID +'" type="sub" class="selectable">'+ items[j].NAME +'</li>');
						}
						li.append(subList);
					}
				}
				displayField.append(list);
				
				$('li.selectable').unbind('click').bind('click', function(){
					$('li.selectable').removeClass('selected');
					$(this).addClass('selected');
					return false;
				});
			}
		}
	});
}

function createDiagnosisEditor(diagnosisWidget, opts) {
	var diagnosisEditorWrapper = diagnosisWidget.find('.editor-wrapper');
	if(diagnosisEditorWrapper.length <= 0) {
		diagnosisEditorWrapper = $('<div class="editor-wrapper">');
		diagnosisEditorWrapper.append(['<div>',
		                               '<span><input class="custom" type="checkbox"/>自定义诊断</span>',
									   '<input type="button" class="add" value="添加主诊断"/>',
		 							   '<input type="button" class="add-sub" value="添加子诊断"/>',
									   '<input type="button" class="del" value="删除诊断"/>',
									   '<input type="button" class="up" value="上移"/>',
									   '<input type="button" class="down" value="下移"/>',
									   '<div>'].join(''));
		diagnosisEditorWrapper.append('<input class="combo" style="width:100%;"/>');
		diagnosisWidget.append(diagnosisEditorWrapper);
	}
	diagnosisEditorWrapper.find('.custom').bind('change', function(){
		if($(this).prop('checked')) {
			diagnosisEditorWrapper.find('.combo').select2('destroy');
			diagnosisEditorWrapper.find('.combo').val('');
		}
		else {
			renderInputToSelect2(diagnosisEditorWrapper.find('.combo'));
		}
	});
	renderInputToSelect2(diagnosisEditorWrapper.find('.combo'));
	diagnosisEditorWrapper.find('.add').unbind('click').bind('click', function(){
		var diagnosisCode = null;
		var diagnosisText = null;
		var codeField = diagnosisEditorWrapper.find('.combo')[1];
		if(codeField) {
			diagnosisCode = diagnosisEditorWrapper.find('.combo')[1].value;
			diagnosisText = diagnosisEditorWrapper.find('.combo')[0].innerText;
		}
		else {
			diagnosisText = diagnosisEditorWrapper.find('.combo')[0].value;
		}
		var param = {
			'diagnosisType':'340',
			'diagnosisText':diagnosisText,
			'diagnosisCode':diagnosisCode,
			'diagnosisParent':null
		};
		$.extend(param, opts);
		$.ajax({
			url:'form/plugin.process?action=save&handler=diagnosis',
			data:param,
			dataType : 'json',
			success : function(data) {
				diagnosisEditorWrapper.find('.combo').select2('val', '');
				diagnosisEditorWrapper.find('.combo').val('');
				queryDiagnosis(diagnosisWidget, opts);
			}
		});
	});
	diagnosisEditorWrapper.find('.add-sub').unbind('click').bind('click', function(){
		var selected = $('li.selected');
		if(selected && selected.length > 0) {
			var diagnosisCode = null;
			var diagnosisText = null;
			var codeField = diagnosisEditorWrapper.find('.combo')[1];
			if(codeField) {
				diagnosisCode = diagnosisEditorWrapper.find('.combo')[1].value;
				diagnosisText = diagnosisEditorWrapper.find('.combo')[0].innerText;
			}
			else {
				diagnosisText = diagnosisEditorWrapper.find('.combo')[0].value;
			}
			var diagnosisId = selected.attr('id');
			if($.trim(diagnosisText).length <= 0) {
				alert('诊断内容不能为空！');
				return;
			}
			var param = {
				'diagnosisType':'340',
				'diagnosisText':diagnosisText,
				'diagnosisCode':diagnosisCode,
				'diagnosisParent':diagnosisId
			};
			$.extend(param, opts);
			$.ajax({
				url:'form/plugin.process?action=save&handler=diagnosis',
				data:param,
				dataType : 'json',
				success : function(data) {
					diagnosisEditorWrapper.find('.combo').select2('val','');
					diagnosisEditorWrapper.find('.combo').val('');
					queryDiagnosis(diagnosisWidget, opts);
				}
			});
		}
		else {
			alert('请选择一条主诊断！');
		}
	});
	diagnosisEditorWrapper.find('.del').unbind('click').bind('click', function(){
		var selected = diagnosisWidget.find('li.selected');
		if(selected && selected.length > 0) {
			var id = selected.attr('id');
			$.ajax({
				url:'form/plugin.process?action=drop&handler=diagnosis',
				data:{id: id},
				dataType : 'json',
				success : function(data) {
					queryDiagnosis(diagnosisWidget, opts);
				}
			});
		}
		else {
			alert('请选择一条诊断！');
		}
	});
	diagnosisEditorWrapper.find('.up').unbind('click').bind('click', function(){
		var selected = diagnosisWidget.find('li.selected');
		if(selected && selected.length > 0) {
			var type = selected.attr('type');
			var prev = selected.prev('li[type='+ type +']');
			if(prev && prev.length > 0) {
				prev.before(selected);
			}
			var brothers = selected.parent().find('li[type='+ type +']');
			var records = [];
			for(var i = 0; i < brothers.length; i++) {
				var id = $(brothers[i]).attr('id');
				var seq = i;
				records.push({'id': id, 'seq':seq});
			}
			if(records.length > 0) {
				$.ajax({
					url:'form/plugin.process?action=sort&handler=diagnosis',
					data:{type: type, records:JSON.stringify(records)},
					dataType : 'json',
					success : function(data) {
					}
				});
			}
		}
		else {
			alert('请选择一条诊断！');
		}
	});
	diagnosisEditorWrapper.find('.down').unbind('click').bind('click', function(){
		var selected = diagnosisWidget.find('li.selected');
		if(selected && selected.length > 0) {
			var type = selected.attr('type');
			var next = selected.next('li[type='+ type +']');
			if(next && next.length > 0) {
				next.after(selected);
			}
			var brothers = selected.parent().find('li[type='+ type +']');
			var records = [];
			for(var i = 0; i < brothers.length; i++) {
				var id = $(brothers[i]).attr('id');
				var seq = i;
				records.push({'id': id, 'seq':seq});
			}
			if(records.length > 0) {
				$.ajax({
					url:'form/plugin.process?action=sort&handler=diagnosis',
					data:{type: type, records:JSON.stringify(records)},
					dataType : 'json',
					success : function(data) {
					}
				});
			}
		}
		else {
			alert('请选择一条诊断！');
		}
	});
}

function renderInputToSelect2(input) {
	input.select2({
		minimumInputLength : 1,
		minimumResultsForSearch : 'Infinity',
		closeOnSelect: true,
		language : {
			inputTooShort: function(args) {
				return '<span style="font-size:12px;">请输入</span>';
			},
			noResults: function() {
				return '<span style="font-size:12px;">没找到</span>';
		    }
		},
		multiple : false,
		ajax:{
			url : 'form/fill-combo.process',
			dataType : 'json',
			quietMillis : 250,
			cache : true,
			data : function(term, page) {
				return {
					'category': 'icd',
					'fuzzy' : term
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
		escapeMarkup : function(markup) {
			return markup;
		},
		formatResult : function(item) {
			if(item.loading) {
				return item.text;
			} 
			return item.name;
		},
		formatSelection : function(item) {
			return item.name || item.text;
		}
	});
}


