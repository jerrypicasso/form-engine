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
        	
        	nursingWidgets.each(function () {
        		var nursingWidget = $(this);
                var iterName = nursingWidget.attr('iterator');
                var sumName = nursingWidget.attr('sum-name');
                var ioTable = nursingWidget.attr('io-table');
                var inName = nursingWidget.attr('in-name');
                var inFields = nursingWidget.attr('in-fields');
                var outName = nursingWidget.attr('out-name');
                var outFields = nursingWidget.attr('out-fields');
                var auditField = nursingWidget.attr('audit-field');
                
                var iteratorWrapper = $('.iterator-wrapper[name='+ iterName +']');
                var editWrapper = iteratorWrapper.children('.edit-wrapper:first');
                var ioButton = $('<input class="edit-btn" type="button" value="新增出入量统计"/>');
                ioButton.unbind('click').bind('click', function(){
                	showSumIntakeOutputDialog({
                		ioTable : ioTable,
                		inName : inName,
                		inFields : inFields,
                		outName : outName,
                		outFields : outFields
                	});
                });
                editWrapper.append(ioButton);
        	});
        	
        }
    }
});

function showSumIntakeOutputDialog(options) {
	var content = ['<table>',
	               '<tr>',
	               '<td>开始时间：</td>',
	               '<td><input class="beginTime"/></td>',
	               '</tr>',
	               '<tr>',
	               '<td>结束时间：</td>',
	               '<td><input class="endTime"/></td>',
	               '</tr>',
	               '<tr>',
	               '<td><input class="ok" type="button" value="确定"></td>',
	               '<td><input class="cancel" type="button" value="取消"/></td>',
	               '</tr>',
	               '</table>'].join('');
	/**/
	layer.open({
		type : 1,
		skin : 'layui-layer-rim', // 加上边框
		area : [ '420px', '240px' ], // 宽高
		content : content,
		success : function(self, index) {
			self.find('.beginTime,.endTime').bind('click', function(){
				WdatePicker({
					readOnly:true,
					dateFmt:'yyyy-MM-dd HH:mm:ss',
					maxDate:'%y-%M-%d %H:%m:%s'
				});
			});
			
			self.find('.ok').bind('click', function(){
				var beginTime = self.find('.beginTime').val();
				var endTime = self.find('.endTime').val();
				if(beginTime && endTime) {
					var params = {
							beginTime: beginTime,
							endTime: endTime
					};
					$.extend(params, options);
					/*$.ajax({
						url:'',
						type:'post',
						dataType: 'json',
						param: params,
						success: function(){
							
						}
					});*/
				}
			});
			
			self.bind('.cancel').bind('click', function(){
				layer.close(index)
			});
		}
	});
}