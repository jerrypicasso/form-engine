(function($) {
	$.Engine.plugin('surgery', {
	    //实现afterFormLoaded方法
	    afterFormLoaded: function (options) {
	        var container = options.container;
	        var surgeryWidgets = container.find('.widget-plugin-surgery');
	        surgeryWidgets.each(function () {
	            var surgeryWidget = $(this);
	            querySurgery(surgeryWidget);
	        });
	    },
	    //实现afterModeChanged方法
	    afterModeChanged: function (options) {
	        var container = options.container;
	        if (options.mode === 'view') {
	        	var surgeryWidgets = container.find('.widget-plugin-surgery');
	        	surgeryWidgets.removeClass('editable');
	        	surgeryWidgets.find('.edit-wrapper').remove();
	        	surgeryWidgets.find('.surgery-item.selected').removeClass('selected');
	        }
	        else if (options.mode === 'edit') {
	        	var surgeryWidgets = container.find('.widget-plugin-surgery');
	        	surgeryWidgets.each(function () {
	        		var surgeryWidget = $(this);
	        		var surgery = surgeryWidget.attr('surgery');
	        		var operator = surgeryWidget.attr('operator');
	        		surgeryWidget.addClass('editable');
	        		var editWrapper = $('<div class="edit-wrapper"></div>');
	        		surgeryWidget.append(editWrapper);
	        		editWrapper.append(['<div style="text-align:center;">',
	        		                    '<input class="surgeryItemInput" style="width:100%;"/>',
	        		                    '</div>'].join(''));
	        		editWrapper.append(['<div style="text-align:center;">',
	        		                    '<span><input class="customSurgeryItem" type="checkbox"/>自定义手术</span>',
	        		                    '<input class="appendSurgeryItemBtn" type="button" value="添加"/>',
	        		                    '<input class="deleteSurgeryItemBtn" type="button" value="删除"/>',
	        		                    '</div>'].join(''));
	        		var surgeryItemInput = editWrapper.find('.surgeryItemInput');
	        		renderInputToSelect2(surgeryItemInput);
	        		editWrapper.find('.customSurgeryItem').bind('change', function(){
	        			if($(this).prop('checked')) {
	        				surgeryItemInput.select2('destroy');
	        				surgeryItemInput.val('');
	        				surgeryItemInput.css({'padding':'5px 0'});
	        			}
	        			else {
	        				surgeryItemInput.css({'padding':'0'});
	        				renderInputToSelect2(surgeryItemInput);
	        			}
	        		});
	        		editWrapper.find('.appendSurgeryItemBtn').bind('click', function(){
	        			if(!$.trim(surgery)) {
	            			toastr['warning']("关联手术ID为空，无法保存，请联系管理员！");
	            			return;
	            		}
	        			var surgeryItemCode = null;
	        			var surgeryItemName = null;
	        			var codeField = editWrapper.find('.surgeryItemInput')[1];
	        			if(codeField) {
	        				surgeryItemCode = editWrapper.find('.surgeryItemInput')[1].value;
	        				surgeryItemName = editWrapper.find('.surgeryItemInput')[0].innerText;
	        			}
	        			else {
	        				surgeryItemName = editWrapper.find('.surgeryItemInput')[0].value;
	        			}
	        			if(!$.trim(surgeryItemName)) {
	        				toastr['warning']("手术名为空，无法保存！");
	            			return;
	        			}
	        			var param = {
	    					'surgery':surgery,
	    					'surgeryItemCode':surgeryItemCode,
	    					'surgeryItemName':surgeryItemName,
	    					'operator':operator
	    				};
	        			$.ajax({
	        				url:'form/plugin.process?handler=surgery&action=save',
	        				type:'post',
	        				dataType:'json',
	        				data:param,
	        				success: function(data){
	        					querySurgery(surgeryWidget);
	        					if(codeField) {
	        						editWrapper.find('.surgeryItemInput').select2('val', '');
	        					} 
	        					else {
	        						editWrapper.find('.surgeryItemInput').val('');
	        					}
	        				}
	        			});
	        		});
	        		editWrapper.find('.deleteSurgeryItemBtn').bind('click', function(){
	        			var selectedItem = surgeryWidget.find('.surgery-item.selected');
	        			if(selectedItem.length <= 0) {
	        				toastr['warning']("请选择要移除的手术条目！");
	        				return;
	        			}
	        			var itemId = selectedItem.attr('id');
	        			$.ajax({
	        				url:'form/plugin.process?handler=surgery&action=drop',
	        				type:'post',
	        				dataType:'json',
	        				data:{'id':itemId},
	        				success: function(data){
	        					querySurgery(surgeryWidget);
	        				}
	        			});
	        		});
	        	});
	        }
	    }
	});
	
	function querySurgery(surgeryWidget) {
		var surgery = surgeryWidget.attr('surgery');
        var direction = surgeryWidget.attr('direction');
        var displayField = surgeryWidget.find('.display-field').empty();
        $.ajax({
			url:'form/plugin.process?handler=surgery&action=load',
			type:'post',
			dataType:'json',
			data:{'surgery':surgery},
			success: function(data){
				for(var i = 0; i < data.length; i++) {
					var item = $('<span class="surgery-item">');
					item.css({'display':'inline-block','padding-right':'5px'});
					item.html((i + 1) + '.' + data[i].SSMC);
					item.attr('id', data[i].GUID);
					item.bind('click', function(){
						surgeryWidget.find('.surgery-item').removeClass('selected');
						$(this).addClass('selected');
					});
					displayField.append(item);
				}
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
			//width: 'off',
			ajax:{
				url : 'form/fill-combo.process',
				dataType : 'json',
				quietMillis : 300,
				cache : true,
				data : function(term, page) {
					return {
						'category': 'surgery',
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
			formatResult: function (item) {
	            return ['<table style="width:100%;table-layout:fixed;">',
	                    '<tr><td style="width:80%;">',
	                    item.name,
	                    '</td><td style="width:20%;">',
	                    item.id,
	                    '</td></tr></table>'].join('');
	        },
	        formatSelection: function (item) {
	        	return item.name;
	        }
		});
	}
})(jQuery);
