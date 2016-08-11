(function($){
	$.Engine.plugin('nursing', {
	    //实现afterFormLoaded方法
	    afterFormLoaded: function (options) {
	        var container = options.container;
	        var nursingWidgets = container.find('.widget-plugin-nursing');
	    	nursingWidgets.each(function () {
	            var nursingWidget = $(this);
	            var iterName = nursingWidget.attr('iterator');
	            var datetimeField = nursingWidget.attr('datetime-field');
	            
	            var iteratorWrapper = $('.iterator-wrapper[name='+ iterName +']');
	            
	            //处理时间列，同一天的只有第一条显示日期时间，其余都显示时间
	            var prevDate = null;
	            iteratorWrapper.find('.row-field[field='+ datetimeField +']').each(function(){
	                var displayField = $(this).children('.display-field');
	                var valueField = $(this).children('.value-field');
	                if(valueField) {
	                    var datetime = valueField.html();
	                    var date = datetime.substring(0,10);
	                    if(date === prevDate) {
	                        displayField.html(datetime.substring(11));
	                    }
	                    prevDate = date;
	                }
	            });
	            
	            //出入量栏中自动计算剩余空间，并用空行补全
	            iteratorWrapper.find('.data-row[row-tpl!=true] .iterator-wrapper').each(function(){
	            	var iterator = $(this);
	            	var rowHeight = iterator.parent().height();
	            	var usedHeight = 0;
	            	iterator.find('.data-row[row-tpl!=true]').each(function(){
	            		usedHeight = usedHeight + $(this).height();
	            	});
	            	var restHeight = rowHeight - usedHeight;
	            	if(restHeight > 0) {
	            		var more = Math.ceil(restHeight/20);
	            		var rowTpl = iterator.find('.data-row[row-tpl=true]');
	            		for(var i = 0; i < more; i++) {
	            			var emptyRow = rowTpl.clone();
	            			emptyRow.addClass('empty');
	            			emptyRow.removeAttr('row-tpl');
	            			emptyRow.appendTo(iterator);
	            			emptyRow.show();
	            			var style = emptyRow.attr('style');
							style = style + "-fs-table-paginate:paginate;"
							emptyRow.attr('style', style);
	            		}
	            	}
	            	iterator.find('.data-row[row-tpl!=true]:last td').css('border-bottom','none');
	            });
	            
	        });
	    },
	    //实现afterModeChanged方法
	    afterModeChanged: function (options) {
	        var container = options.container;
	        if (options.mode === 'view') {
	        	//隐藏占位行
	        	$('.data-row .empty').show();
	        }
	        else if (options.mode === 'edit') {
	        	//隐藏占位行
	        	$('.data-row .empty').hide();
	        	var nursingWidgets = container.find('.widget-plugin-nursing');
	        	var opts = container.data('options');
	        	nursingWidgets.each(function () {
	        		var nursingWidget = $(this);
	                var iterName = nursingWidget.attr('iterator');
	                var ioSql = nursingWidget.html();
	                var iteratorWrapper = $('.iterator-wrapper[name='+ iterName +']');
	                var editWrapper = iteratorWrapper.children('.edit-wrapper:first');
	                var ioButton = $('<input class="edit-btn" type="button" value="新增出入量统计"/>');
	                var params = {ioSql : ioSql};
	                $.extend(params, opts);
	                ioButton.unbind('click').bind('click', function(){
	                	showSumIntakeOutputDialog(container,params);
	                });
	                editWrapper.append(ioButton);
	        	});
	        	
	        }
	    },
	    beforeEditRow : function(options) {
	    	//TODO 行数据修改三级权限判断
	    	var row = options.row;
	    	var modifyField = row.find('.row-field[field=MODIFY_ID]');
	    	var modifyId = modifyField.find('.display-field').html();
	    	var staffCode = modifyField.find('.value-field').html();
	    	var flag = true;
	    	if(modifyId) {
	    		$.ajax({
					url: 'form/plugin.process?handler=audit&action=check',
					type: 'post',
					async: false,
					dataType: 'json',
					data: {'modifyId': modifyId, 'staffCode': staffCode},
					success: function(data){
						if(data.authorized === 'true') {
							flag = true;
						} 
						else {
							flag = false;
						}
					}
				});
	    	}
	    	return true;
	    }
	});

	function showSumIntakeOutputDialog(container, options) {
		var content = ['<table style="width:100%;">',
		               '<tr>',
		               '<td align="right">开始时间：</td>',
		               '<td><input style="width:130px;" class="beginTime"/></td>',
		               '</tr>',
		               '<tr>',
		               '<td align="right">结束时间：</td>',
		               '<td><input style="width:130px;" class="endTime"/></td>',
		               '</tr>',
		               '</table>'].join('');
		/*弹出层*/
		layer.open({
			type : 1,
			skin : 'layui-layer-rim', // 加上边框
			area : [ '240px', '160px' ], // 宽高
			content : content,
			btn:['确定','取消'],
			yes: function(index, self){
				var beginTime = self.find('.beginTime').val();
				var endTime = self.find('.endTime').val();
				if(beginTime && endTime) {
					var params = {
						'beginTime': beginTime,
						'endTime': endTime
					};
					$.extend(params, options);
					$.ajax({
						url:'form/plugin.process?handler=nursing',
						type:'post',
						dataType: 'json',
						data: params,
						success: function(){
							layer.close(index);
							container.form('reload');
						}
					});
				}
			},
			cancel : function(index) {
				layer.close(index);
			},
			success : function(self, index) {
				self.find('.beginTime,.endTime').bind('click', function(){
					WdatePicker({
						readOnly:true,
						dateFmt:'yyyy-MM-dd HH:mm:ss',
						maxDate:'%y-%M-%d %H:%m:%s'
					});
				});
			}
		});
	}
})(jQuery);

