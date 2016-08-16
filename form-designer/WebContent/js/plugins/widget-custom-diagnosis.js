/*创建读写字段控件*/
function createDiagnosisWidget(config) {
	var dropZone = $('.drop-zone');
	var field = document.createElement('div');
	$(field).addClass('widget-custom-diagnosis');
	$(field).addClass('droppable');
	$(field).addClass('selectable');
	$(field).attr('type', 'diagnosis');
	$(field).attr('diagnosistype', config['diagnosisType']);
	$(field).attr('direct', config['direction']);
	$(field).attr('sign', config['sign']);
	$(field).css({
		'display':'inline-block',
		'vertical-align':'middle',
		'white-space':'normal',
		'width':'100%'
	});
	registerWidgetMousedownHandler(field);
	if(dropZone.hasClass('widget-container')) {
		$(field).appendTo(dropZone);
	}
	else {
		dropZone.before(field);
	}
	
	var displayField = document.createElement('div');
	$(displayField).addClass('display-field');
	$(displayField).appendTo(field);
}

function showDiagnosisPluginInitConfigDialog() {
	var mask = $('.mask-layer-tpl').clone();
	mask.addClass('mask-layer').removeClass('mask-layer-tpl');
	
	var html = ['<div class="dialog" style="width:300px;height:180px;">',
	            '<div class="dialog-title">诊断控件配置</div>',
	            '<form style="padding:15px;">',
	            '<table style="width:100%;table-layout:fixed;">',
	            '<tr><td style="width:25%;">诊断类型：</td>',
                '<td style="width:75%;" valign="top"><input name="diagnosis-type" style="width:100%;"></td></tr>',
                '<tr><td style="width:25%;">显示方向：</td>',
                '<td style="width:75%;" valign="top"><select name="direction" style="width:100%"><option value="horizontal">横向</option><option value="vertical" selected>垂直</option></select></td></tr>',
                '<tr><td style="width:25%;">是否签名：</td>',
                '<td style="width:75%;" valign="top"><select name="sign" style="width:100%;"><option value="true" selected>是</option><option value="false">否</option></select></td></tr>',
                '<tr><td align="center" colspan="2">',
                '<div class="ok-btn">确定</div>',
                '<div class="cancel-btn">取消</div>',
                '</td></tr>',
                '</table>',
                '</form>',
                '</div>'].join('');
	mask.find('.dialog-zone').append(html);
	mask.appendTo(document.body);
	mask.find('.ok-btn').unbind('click').bind('click',function(){
		var diagnosisType = mask.find('input[name=diagnosis-type]').val();
		var direction = mask.find('select[name=direction]').val();
		var sign = mask.find('select[name=sign]').val();
		createDiagnosisWidget({
			'diagnosisType':diagnosisType,
			'direction':direction,
			'sign':sign
		});
		$('.drop-zone').removeClass('drop-zone');
		mask.remove();
	});
	mask.find('.cancel-btn').unbind('click').bind('click', function(){
		$('.drop-zone').removeClass('drop-zone');
		mask.remove();
	});
	mask.show();
}