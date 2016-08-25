(function($) {
	$.Engine.plugin('audit', {
	    //实现afterFormLoaded方法
	    afterFormLoaded: function (options) {
	        var container = options.container;
	        var auditWidgets = container.find('.widget-plugin-audit');
	        auditWidgets.each(function () {
	            var auditWidget = $(this);
	            var createId = auditWidget.attr('create-id');
        		var modifyId = auditWidget.attr('modify-id');
        		var modifyName = auditWidget.attr('modify-name');
        		if(createId !== modifyId && modifyId !== '' && modifyName !== '') {
        			var signature = $('<span>' + modifyName + '/</span>');
        			signature.css({'color':'red'});
        			auditWidget.empty().append(signature);
        		}
	        });
	    },
	    //实现afterModeChanged方法
	    afterModeChanged: function (options) {
	        var container = options.container;
	        if (options.mode === 'view') {
	        	var auditWidgets = container.find('.widget-plugin-audit');
	        	auditWidgets.each(function () {
		            var auditWidget = $(this);
		            var createId = auditWidget.attr('create-id');
	        		var modifyId = auditWidget.attr('modify-id');
	        		var modifyName = auditWidget.attr('modify-name');
	        		if(createId !== modifyId && modifyId !== '' && modifyName !== '') {
	        			var signature = $('<span>' + modifyName + '/</span>');
	        			signature.css({'color':'red'});
	        			auditWidget.empty().append(signature);
	        		}
	        		else {
	        			auditWidget.empty();
	        		}
		        });
	        }
	        else if (options.mode === 'edit') {
	        	var auditWidgets = container.find('.widget-plugin-audit');
	        	auditWidgets.each(function(){
	        		var auditWidget = $(this);
	        		var createId = auditWidget.attr('create-id');
	        		var modifyId = auditWidget.attr('modify-id');
	        		var modifyName = auditWidget.attr('modify-name');
	        		var tableName = auditWidget.attr('table-name');
	        		var pkName = auditWidget.attr('pk-name');
	        		var pkValue = auditWidget.attr('pk-value');
	        		if(createId === modifyId && createId != '') {
	        			var auditBtn = $('<input type="button" value="审签"/>');
	        			auditBtn.css({'width':'40px','padding':'0'});
	        			auditBtn.bind('click', function(){
	        				var params = {
	        					'tableName': tableName,
	        					'pkName': pkName,
	        					'pkValue': pkValue,
	        					'modifyId': modifyId
	        				};
	        				showAuditDialog(params, container, auditWidget);
	        				return false;
	        			});
	        			auditWidget.empty().append(auditBtn);
	        		}
	        	});
	        }
	    }
	});
	
	function showAuditDialog(params, container, auditWidget) {
		var content = ['<table style="width:100%;">',
		               '<tr>',
		               '<td align="right">帐号：</td>',
		               '<td><input style="width:130px;" name="account"/></td>',
		               '</tr>',
		               '<tr>',
		               '<td align="right">密码：</td>',
		               '<td><input type="password" style="width:130px;" name="password"/></td>',
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
				var account = self.find('input[name=account]').val();
				var password = self.find('input[name=password]').val();
				if(account && password) {
					$.ajax({
						url:ctx + '/jsp/checkDoctor.action',
						type:'post',
						dataType: 'json',
						data: {
							'username': account, 
							'password': password, 
							'modifyid' :params.modifyId
						},
						success: function(data){
							if(data.authorized) {
								var staffCode = data.currentid;
								var auditName = data.name;
								if(!staffCode) {
									toastr['warning']('审签人编号为空，无法审签！');
									return;
								}
								var opts = {'staffCode': staffCode};
								$.extend(opts, params);
								doAudit(opts, function(){
									if(auditName !== '') {
					        			var signature = $('<span>' + auditName + '/</span>');
					        			signature.css({'color':'red'});
					        			auditWidget.empty().append(signature);
					        		}
									layer.close(index);
								});	
							}
							else {
								toastr['error'](data.message);
							}
						}
					});
				}
				else {
					toastr['warning']('帐号和密码不能为空！');
				}
			},
			cancel : function(index) {
				layer.close(index);
			}
		});
	}
	
	function doAudit(params, callback) {
		$.ajax({
			url: 'form/plugin.process?handler=audit&action=update',
			type: 'post',
			dataType: 'json',
			data: params,
			success: function(data){
				if(data.success) {
					toastr['success'](data.message);
					callback();
				} 
			}
		});
	}
	
})(jQuery);