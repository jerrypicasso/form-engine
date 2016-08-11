function createPropertiesControls() {
	var arr = [{
		name:'paddingTop',
		label:'顶部边距',
		type:'number',
		parent:'page-settings'
	},{
		name:'paddingRight',
		label:'右侧边距',
		type:'number',
		parent:'page-settings'
	},{
		name:'paddingBottom',
		label:'底部边距',
		type:'number',
		parent:'page-settings'
	},{
		name:'paddingLeft',
		label:'左侧边距',
		type:'number',
		parent:'page-settings'
	}];
	for(var i = 0; i < arr.length; i++) {
		createPropertiesControl(arr[i]);
	}
	
	var options = [];
	$('.config-item[name=category] option').each(function(){
		var opt = $(this);
		options.push({
			key: opt.val(),
			value: opt.html()
		});
	});
	
	arr = [{
		name:'widgetType',
		label:'元素类型',
		type:'text',
		disabled: true,
		parent:'widget-settings'
	},{
		name:'actualVal',
		label:'实际内容',
		type:'text',
		parent:'widget-settings'
	},{
		name:'displayVal',
		label:'显示内容',
		type:'text',
		parent:'widget-settings'
	},{
		name:'required',
		label:'是否必填',
		options:[{key:'',value:'否',defaultValue:true},{key:'required',value:'是'}],
		parent:'widget-settings'
	},{
		name:'fieldName',
		label:'字段名称',
		type:'text',
		parent:'widget-settings'
	},{
		name:'tableName',
		label:'对应表名',
		type:'text',
		parent:'widget-settings'
	},{
		name:'primaryKey',
		label:'是否主键',
		options:[{key:'',value:'否',defaultValue:true},{key:'true',value:'是'}],
		parent:'widget-settings'
	},{
		name:'maxLength',
		label:'最大长度',
		type:'number',
		parent:'widget-settings'
	},{
		name:'minLength',
		label:'最小长度',
		type:'number',
		parent:'widget-settings'
	},{
		name:'maxNum',
		label:'最大数字',
		type:'number',
		parent:'widget-settings'
	},{
		name:'minNum',
		label:'最小数字',
		type:'number',
		parent:'widget-settings'
	},{
		name:'category',
		label:'控件类别',
		options:options,
		parent:'widget-settings'
	},{
		name:'isRich',
		label:'控件类别',
		options:[{key:'',value:'普通',defaultValue:true},{key:'rich',value:'富文本'}],
		parent:'widget-settings'
	},{
		name:'filter',
		label:'过滤参数',
		type:'text',
		parent:'widget-settings'
	},{
		name:'trigger',
		label:'输入触发',
		options:[{key:'',value:'否',defaultValue:true},{key:'true',value:'是'}],
		parent:'widget-settings'
	},{
		name:'multiple',
		label:'是否多选',
		options:[{key:'',value:'否',defaultValue:true},{key:'multiple',value:'是'}],
		parent:'widget-settings'
	},{
		name:'master',
		label:'依赖字段',
		type:'text',
		parent:'widget-settings'
	},{
		name:'itemsName',
		label:'迭代集合',
		type:'text',
		parent:'widget-settings'
	},{
		name:'itemName',
		label:'迭代变量',
		type:'text',
		parent:'widget-settings'
	}/*,{
		name:'totalPage',
		label:'分页总数',
		type:'text',
		parent:'widget-settings'
	},{
		name:'totalRow',
		label:'记录总数',
		type:'text',
		parent:'widget-settings'
	}*/,{
		name:'primaryKeyName',
		label:'主键名称',
		type:'text',
		parent:'widget-settings'
	},{
		name:'dropKeyName',
		label:'删除键名',
		type:'text',
		parent:'widget-settings'
	}];
	for(var i = 0; i < arr.length; i++) {
		createPropertiesControl(arr[i]);
	}
	arr = [{
		name:'bgColor',
		label:'背景颜色',
		type:'color',
		parent:'style-settings'
	},{
		name:'width',
		label:'元素宽度',
		type:'number',
		parent:'style-settings'
	},{
		name:'height',
		label:'元素高度',
		type:'number',
		parent:'style-settings'
	},{
		name:'hAlign',
		label:'横向对齐',
		options:[{key:'',value:'默认',defaultValue:true},{key:'left',value:'居左'},
		         {key:'center',value:'居中'},{key:'right',value:'居右'}],
		parent:'style-settings'
	},{
		name:'vAlign',
		label:'纵向对齐',
		options:[{key:'',value:'默认',defaultValue:true},{key:'top',value:'居上'},
		         {key:'middle',value:'居中'},{key:'bottom',value:'居下'}],
		parent:'style-settings'
	},{
		name:'overflow',
		label:'超出内容',
		options:[{key:'',value:'默认',defaultValue:true},{key:'visible',value:'可见'},
		         {key:'hidden',value:'隐藏'},{key:'scroll',value:'滚动'},{key:'auto',value:'自动'}],
		parent:'style-settings'
	}];
	for(var i = 0; i < arr.length; i++) {
		createPropertiesControl(arr[i]);
	}
	arr = [{
		name:'fontColor',
		label:'文字颜色',
		type:'color',
		parent:'font-settings'
	},{
		name:'fontSize',
		label:'文字大小',
		type:'number',
		parent:'font-settings'
	},{
		name:'lineHeight',
		label:'文字行高',
		type:'number',
		parent:'font-settings'
	},{
		name:'wordWrap',
		label:'文字换行',
		options:[{key:'',value:'默认',defaultValue:true},{key:'normal',value:'常规'},{key:'break-word',value:'强制'}],
		parent:'font-settings'
	},{
		name:'fontWeight',
		label:'文字粗度',
		options:[{key:'',value:'默认',defaultValue:true},{key:'400',value:'常规'},
		         {key:'700',value:'粗体'},{key:'100',value:'细体'}],
		parent:'font-settings'
	}];
	for(var i = 0; i < arr.length; i++) {
		createPropertiesControl(arr[i]);
	}
}

function createPropertiesControl(config) {
	var control = document.createElement('div');
	var label = document.createElement('span');
	$(label).html(config.label);
	$(control).append(label);
	var element = null;
	if(config.options) {
		element = document.createElement('select');
		for(var i = 0; i < config.options.length; i++) {
			var item = config.options[i];
			var option = document.createElement('option');
			$(option).val(item.key);
			$(option).html(item.value);
			if(item.defaultValue === true) {
				$(option).attr('selected', 'selected');
			}
			$(element).append(option);
		}
	} else {
		element = document.createElement('input');
		$(element).attr('type', config.type);
	}
	$(element).attr('name', config.name);
	if(config.disabled === true) {
		$(element).attr('disabled', 'disabled');
	}
	$(element).css({'width':'80px'});
	$(control).append(element);
	
	$(control).append('<input type="button" style="width:24px;height:24px;" value="√"/>');
	
	$('.' + config.parent).append(control);
}

/*重置并隐藏全部属性面板中的内容*/
function resetAndHideAllPropertiesFields() {
	var propPanel = $('.properties');
	var widgetTypeField = propPanel.find('input[name=widgetType]');
	widgetTypeField.val('');
	widgetTypeField.parent().hide();
	var actualValField = propPanel.find('input[name=actualVal]');
	actualValField.val('');
	actualValField.parent().hide();
	var displayValField = propPanel.find('input[name=displayVal]');
	displayValField.val('');
	displayValField.parent().hide();
	var requiredField = propPanel.find('select[name=required]');
	requiredField.val('');
	requiredField.parent().hide();
	var fieldNameField = propPanel.find('input[name=fieldName]');
	fieldNameField.val('');
	fieldNameField.parent().hide();
	var maxLengthField = propPanel.find('input[name=maxLength]');
	maxLengthField.val('');
	maxLengthField.parent().hide();
	var minLengthField = propPanel.find('input[name=minLength]');
	minLengthField.val('');
	minLengthField.parent().hide();
	var maxNumField = propPanel.find('input[name=maxNum]');
	maxNumField.val('');
	maxNumField.parent().hide();
	var minNumField = propPanel.find('input[name=minNum]');
	minNumField.val('');
	minNumField.parent().hide();
	var categoryField = propPanel.find('select[name=category]');
	categoryField.val('');
	categoryField.parent().hide();
	var widthField = propPanel.find('input[name=width]');
	widthField.val('');
	widthField.parent().hide();
	var heightField = propPanel.find('input[name=height]');
	heightField.val('');
	heightField.parent().hide();
	var bgColorField = propPanel.find('input[name=bgColor]');
	bgColorField.val('');
	bgColorField.parent().hide();
	var hAlignField = propPanel.find('select[name=hAlign]');
	hAlignField.val('');
	hAlignField.parent().hide();
	var vAlignField = propPanel.find('select[name=vAlign]');
	vAlignField.val('');
	vAlignField.parent().hide();
	var itemsNameField = propPanel.find('input[name=itemsName]');
	itemsNameField.val('');
	itemsNameField.parent().hide();
	var itemNameField = propPanel.find('input[name=itemName]');
	itemNameField.val('');
	itemNameField.parent().hide();
	/*var totalPageField = propPanel.find('input[name=totalPage]');
	totalPageField.val('');
	totalPageField.parent().hide();
	var totalRowField = propPanel.find('input[name=totalRow]');
	totalRowField.val('');
	totalRowField.parent().hide();*/
	var primaryKeyNameField = propPanel.find('input[name=primaryKeyName]');
	primaryKeyNameField.val('');
	primaryKeyNameField.parent().hide();
	var dropKeyNameField = propPanel.find('input[name=dropKeyName]');
	dropKeyNameField.val('');
	dropKeyNameField.parent().hide();
	
	var tableNameField = propPanel.find('input[name=tableName]');
	tableNameField.val('');
	tableNameField.parent().hide();
	var lineHeightField = propPanel.find('input[name=lineHeight]');
	lineHeightField.val('');
	lineHeightField.parent().hide();
	var fontSizeField = propPanel.find('input[name=fontSize]');
	fontSizeField.val('');
	fontSizeField.parent().hide();
	var fontColorField = propPanel.find('input[name=fontColor]');
	fontColorField.val('');
	fontColorField.parent().hide();
	var wordWrapField = propPanel.find('select[name=wordWrap]');
	wordWrapField.val('');
	wordWrapField.parent().hide();
	var overflowField = propPanel.find('select[name=overflow]');
	overflowField.val('');
	overflowField.parent().hide();
	var displayField = propPanel.find('select[name=display]');
	displayField.val('');
	displayField.parent().hide();
	var primaryKeyField = propPanel.find('select[name=primaryKey]');
	primaryKeyField.val('');
	primaryKeyField.parent().hide();
	var isMultipleField = propPanel.find('select[name=multiple]');
	isMultipleField.val('');
	isMultipleField.parent().hide();
	var autoCompleteField = propPanel.find('select[name=trigger]');
	autoCompleteField.val('');
	autoCompleteField.parent().hide();
	var fontWeightField = propPanel.find('select[name=fontWeight]');
	fontWeightField.val('');
	fontWeightField.parent().hide();
	var masterField = propPanel.find('input[name=master]');
	masterField.val('');
	masterField.parent().hide();
	var filterField = propPanel.find('input[name=filter]');
	filterField.val('');
	filterField.parent().hide();
	var isRichField = propPanel.find('select[name=isRich]');
	isRichField.val('');
	isRichField.parent().hide();
	
	if($('.paper').length > 0) {
		var paddingTopField = propPanel.find('input[name=paddingTop]');
		var paddingTop = $('.content-wrapper').css('padding-top').replace('px', '');
		paddingTopField.val(paddingTop);
		
		var paddingLeftField = propPanel.find('input[name=paddingLeft]');
		var paddingLeft = $('.content-wrapper').css('padding-left').replace('px', '');
		paddingLeftField.val(paddingLeft);
		
		var paddingBottomField = propPanel.find('input[name=paddingBottom]');
		var paddingBottom = $('.content-wrapper').css('padding-bottom').replace('px', '');
		paddingBottomField.val(paddingBottom);
		
		var paddingRightField = propPanel.find('input[name=paddingRight]');
		var paddingRight = $('.content-wrapper').css('padding-right').replace('px', '');
		paddingRightField.val(paddingRight);
	}
	return propPanel;
}

/*为属性面板中的按钮注册事件处理器*/
function registerWidgetPropertiesHandlers() {
	var propPanel = $('.properties');
	propPanel.find('input[name=paddingTop]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.content-wrapper').css('padding-top', val + 'px');
	});
	propPanel.find('input[name=paddingLeft]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.content-wrapper').css('padding-left', val + 'px');
	});
	propPanel.find('input[name=paddingBottom]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.content-wrapper').css('padding-bottom', val + 'px');
	});
	propPanel.find('input[name=paddingRight]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.content-wrapper').css('padding-right', val + 'px');
	});
	propPanel.find('input[name=actualVal]').next().bind('click',function(){
		var selectedWidget = $('.selected-widget');
		var valueField = selectedWidget.find('.value-field');
		if(valueField.length > 0) {
			valueField.html($(this).prev().val());
		}
	});
	propPanel.find('input[name=displayVal]').next().bind('click',function(){
		var selectedWidget = $('.selected-widget');
		var displayField = selectedWidget.find('.display-field');
		if(displayField.length > 0) {
			displayField.html($(this).prev().val());
		} else {
			selectedWidget.html($(this).prev().val());
		}
	});
	propPanel.find('select[name=required]').next().bind('click',function(){
		var val = $(this).prev().val();
		if(val) {
			$('.selected-widget').attr('required', val);
		}
		else {
			$('.selected-widget').removeAttr('required');
		}
	});
	propPanel.find('input[name=fieldName]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr('field', val);
	});
	propPanel.find('input[name=maxLength]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr('max-len', val);
	});
	propPanel.find('input[name=minLength]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr('min-len', val);
	});
	propPanel.find('input[name=maxNum]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr('max-num', val);
	});
	propPanel.find('input[name=minNum]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr('min-num', val);
	});
	propPanel.find('select[name=category]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr('category', val);
	});
	propPanel.find('input[name=width]').next().bind('click',function(){
		var width = $(this).prev().val();
		$('.selected-widget').width(width);
	});
	propPanel.find('input[name=height]').next().bind('click',function(){
		$('.selected-widget').height($(this).prev().val());
	});
	propPanel.find('input[name=bgColor]').next().bind('click',function(){
		$('.selected-widget').css({'background-color': $(this).prev().val()});
	});
	propPanel.find('input[name=fontColor]').next().bind('click',function(){
		$('.selected-widget').css({'color': $(this).prev().val()});
	});
	propPanel.find('input[name=lineHeight]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.selected-widget').css({'line-height': val + 'px'});
		//$('.selected-widget').find('.display-field').css({'line-height': val + 'px'});
	});
	propPanel.find('select[name=wordWrap]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.selected-widget').css({'word-wrap': val});
		$('.selected-widget').find('.display-field').css({'word-wrap': val});
	});
	propPanel.find('input[name=fontSize]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.selected-widget').css({'font-size': val + 'px'});
	});
	propPanel.find('select[name=hAlign]').next().bind('click',function(){
		var val = $(this).prev().val();
		var selectedWidget = $('.selected-widget');
		if(selectedWidget.hasClass('cell')) {
			selectedWidget.attr('align', val);
		}
		else {
			selectedWidget.css({'text-align': val});
		}
	});
	propPanel.find('select[name=vAlign]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.selected-widget').css({'vertical-align': val});
		//$('.selected-widget').find('.display-field').css({'vertical-align': val});
	});
	propPanel.find('input[name=itemsName]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr('page-param-name', val + '_page');
		$('.selected-widget').find('list').attr('items', val);
	});
	propPanel.find('input[name=itemName]').next().bind('click',function(){
		var val = $(this).prev().val();
		$('.selected-widget').find('list').attr('var', val);
	});
	/*propPanel.find('input[name=totalPage]').next().bind('click', function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr('total-page', val);
	});
	propPanel.find('input[name=totalRow]').next().bind('click', function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr('total-row', val);
	});*/
	propPanel.find('input[name=primaryKeyName]').next().bind('click', function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr('primary-key', val);
	});
	propPanel.find('input[name=dropKeyName]').next().bind('click', function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr('drop-key', val);
	});
	propPanel.find('input[name=tableName]').next().bind('click', function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr('table', val);
	});
	propPanel.find('select[name=overflow]').next().bind('click', function(){
		var val = $(this).prev().val();
		$('.selected-widget').css({'overflow':val});
	});
	propPanel.find('select[name=display]').next().bind('click', function(){
		var val = $(this).prev().val();
		$('.selected-widget').css({'display':val});
		$('.selected-widget').find('.display-field').css({'display': val});
	});
	propPanel.find('select[name=primaryKey]').next().bind('click', function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr({'primary-key':val});
	});
	propPanel.find('select[name=multiple]').next().bind('click', function(){
		var val = $(this).prev().val();
		if(val === 'multiple') {
			$('.selected-widget').attr({'multi-select':val});
		}
		else {
			$('.selected-widget').removeAttr('multi-select');
		}
	});
	propPanel.find('select[name=trigger]').next().bind('click', function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr({'trigger':val});
	});
	propPanel.find('select[name=fontWeight]').next().bind('click', function(){
		var val = $(this).prev().val();
		$('.selected-widget').css({'font-weight':val});
	});
	propPanel.find('input[name=master]').next().bind('click', function(){
		var val = $(this).prev().val();
		$('.selected-widget').val(val);
	});
	propPanel.find('input[name=filter]').next().bind('click', function(){
		var val = $(this).prev().val();
		$('.selected-widget').attr({'filter':val});
	});
	propPanel.find('select[name=isRich]').next().bind('click', function(){
		var val = $(this).prev().val();
		if('rich' === val) {
			$('.selected-widget').attr('rich', 'true');
		} else {
			$('.selected-widget').removeAttr('rich');
		}
	});
}

/*为特定的控件准备相关的属性面板内容*/
function prepareRelativePropertiesFields(widget) {
	var propPanel = resetAndHideAllPropertiesFields();
	
	var widgetTypeField = propPanel.find('input[name=widgetType]');
	if(widget.hasClass('cell')) {
		widgetTypeField.val('单元格');
	}
	else if(widget.hasClass('widget-field-date')) {
		widgetTypeField.val('日期字段');
	}
	else if(widget.hasClass('widget-field-dict')) {
		widgetTypeField.val('字典字段');
	}
	else if(widget.hasClass('widget-field-hidden')) {
		widgetTypeField.val('隐藏字段');
	}
	else if(widget.hasClass('widget-field-number')) {
		widgetTypeField.val('数字字段');
	}
	else if(widget.hasClass('widget-field-staff')) {
		widgetTypeField.val('员工字段');
	}
	else if(widget.hasClass('widget-field-text')) {
		widgetTypeField.val('文本字段');
	}
	else if(widget.hasClass('iterator-wrapper')) {
		widgetTypeField.val('迭代器');
	}
	else if(widget.hasClass('widget-page-count')) {
		widgetTypeField.val('总页数');
	}
	else if(widget.hasClass('widget-page-number')) {
		widgetTypeField.val('当前页');
	}
	else if(widget.hasClass('widget-text-dynamic')) {
		widgetTypeField.val('动态文本');
	}
	else if(widget.hasClass('widget-text-static')) {
		widgetTypeField.val('静态文本');
	}
	else if(widget.hasClass('widget-field-select')) {
		widgetTypeField.val('下拉框字段');
	}
	widgetTypeField.parent().show();
	
	if(widget.hasClass('widget-field-text')) {
		var maxLengthField = propPanel.find('input[name=maxLength]');
		var maxLength = widget.attr('max-len');
		maxLengthField.val(maxLength);
		maxLengthField.parent().show();
		
		var minLengthField = propPanel.find('input[name=minLength]');
		var minLength = widget.attr('min-len');
		minLengthField.val(minLength);
		minLengthField.parent().show();
		
		var isRichField = propPanel.find('select[name=isRich]');
		var isRich = widget.attr('rich');
		if(isRich == 'true') {
			isRichField.val('rich');
		} else {
			isRichField.val('');
		}
		isRichField.parent().show();
	}
	if(widget.hasClass('widget-field-number')) {
		var maxNumField = propPanel.find('input[name=maxNum]');
		var maxNum = widget.attr('max-num');
		maxNumField.val(maxNum);
		maxNumField.parent().show();
		
		var minNumField = propPanel.find('input[name=minNum]');
		var minNum = widget.attr('min-num');
		minNumField.val(minNum);
		minNumField.parent().show();
	}
	if(widget.hasClass('widget-field-dict') || widget.hasClass('widget-field-staff')
			|| widget.hasClass('widget-field-select')) {
		var categoryField = propPanel.find('select[name=category]');
		var category = widget.attr('category');
		categoryField.val(category);
		categoryField.parent().show();
		
		var filterField = propPanel.find('input[name=filter]');
		var filter = widget.attr('filter');
		filterField.val(filter);
		filterField.parent().show();
		
		var multipleField = propPanel.find('select[name=multiple]');
		var multiple = widget.attr('multi-select') || '';
		multipleField.val(multiple);
		multipleField.parent().show();
		
		var autoCompleteField = propPanel.find('select[name=trigger]');
		var autoComplete = widget.attr('trigger');
		autoCompleteField.val(autoComplete);
		autoCompleteField.parent().show();
		
		var masterField = propPanel.find('input[name=master]');
		var master = widget.attr('master');
		masterField.val(master);
		masterField.parent().show();
	}
	if(widget.hasClass('widget-field-text') || widget.hasClass('widget-field-date')
			|| widget.hasClass('widget-field-number') || widget.hasClass('widget-field-dict')
			|| widget.hasClass('widget-field-staff') || widget.hasClass('widget-field-hidden')
			|| widget.hasClass('widget-check') || widget.hasClass('widget-field-select')) {
		var actualValField = propPanel.find('input[name=actualVal]');
		actualValField.val(widget.find('.value-field').html());
		actualValField.parent().show();
		
		var fieldNameField = propPanel.find('input[name=fieldName]');
		var fieldName = widget.attr('field');
		fieldNameField.val(fieldName);
		fieldNameField.parent().show();
		
		var requiredField = propPanel.find('select[name=required]');
		var required = widget.attr('required');
		requiredField.val(required);
		requiredField.parent().show();
		
		var dispField = widget.find('.display-field');
		var displayValField = propPanel.find('input[name=displayVal]');
		if(dispField.length > 0) {
			displayValField.val(dispField.html());
		}
		else {
			displayValField.val(widget.html());
		}
		displayValField.parent().show();
	}
	if(!widget.hasClass('iterator-wrapper') && !widget.hasClass('widget-field-hidden')) {
		var widthField = propPanel.find('input[name=width]');
		var width = widget.prop('style').width.replace('px', '').replace('auto','');
		widthField.val(width);
		widthField.parent().show();
		
		var heightField = propPanel.find('input[name=height]');
		var height = widget.prop('style').height.replace('px', '').replace('auto','');
		heightField.val(height);
		heightField.parent().show();
		
		var hAlignField = propPanel.find('select[name=hAlign]');
		var hAlign = widget.attr('align') || widget.css('text-align');
		hAlignField.val(hAlign);
		hAlignField.parent().show();
		
		var bgColorField = propPanel.find('input[name=bgColor]');
		var rgb = widget.css('background-color');
		var hexStr = rgbToHex(rgb);
		bgColorField.val(hexStr);
		bgColorField.parent().show();
		
		var vAlignField = propPanel.find('select[name=vAlign]');
		vAlignField.val(widget.css('vertical-align'));
		vAlignField.parent().show();
		
		var lineHeightField = propPanel.find('input[name=lineHeight]');
		var lineHeight = widget.css('line-height');// || dispField.css('line-height');
		lineHeightField.val(lineHeight.replace('px',''));
		lineHeightField.parent().show();
		
		var fontSizeField = propPanel.find('input[name=fontSize]');
		fontSizeField.val(widget.css('font-size').replace('px',''));
		fontSizeField.parent().show();
		
		var fontWeightField = propPanel.find('select[name=fontWeight]');
		fontWeightField.val(widget.css('font-weight'));
		fontWeightField.parent().show();
		
		var fontColorField = propPanel.find('input[name=fontColor]');
		var rgb = widget.css('color');
		var hexStr = rgbToHex(rgb);
		fontColorField.val(hexStr);
		fontColorField.parent().show();
	}
	if(widget.hasClass('widget-text-static') || widget.hasClass('widget-text-dynamic') 
			|| widget.hasClass('widget-field-text') || widget.hasClass('widget-field-number')
			|| widget.hasClass('widget-field-dict') || widget.hasClass('widget-field-staff')
			|| widget.hasClass('widget-field-date') || widget.hasClass('widget-check')
			|| widget.hasClass('widget-field-select')) {
		var dispField = widget.find('.display-field');
		
		var wordWrapField = propPanel.find('select[name=wordWrap]');
		var wordWrap = widget.css('word-wrap') || dispField.css('word-wrap');
		wordWrapField.val(wordWrap);
		wordWrapField.parent().show();
		
		var displayField = propPanel.find('select[name=display]');
		var display = widget.css('display') || dispField.css('display');
		displayField.val(display);
		displayField.parent().show();
	}
	if(widget.hasClass('iterator-wrapper')) {
		var itemsNameField = propPanel.find('input[name=itemsName]');
		itemsNameField.val(widget.find('list').attr('items'));
		itemsNameField.parent().show();
		
		var itemNameField = propPanel.find('input[name=itemName]');
		itemNameField.val(widget.find('list').attr('var'));
		itemNameField.parent().show();
		
		/*var totalPageField = propPanel.find('input[name=totalPage]');
		totalPageField.val(widget.attr('total-page'));
		totalPageField.parent().show();
		
		var totalRowField = propPanel.find('input[name=totalRow]');
		totalRowField.val(widget.attr('total-row'));
		totalRowField.parent().show();*/
		
		var primaryKeyNameField = propPanel.find('input[name=primaryKeyName]');
		primaryKeyNameField.val(widget.attr('primary-key'));
		primaryKeyNameField.parent().show();
		
		var dropKeyNameField = propPanel.find('input[name=dropKeyName]');
		dropKeyNameField.val(widget.attr('drop-key'));
		dropKeyNameField.parent().show();
	}
	if(widget.hasClass('widget-field-text') || widget.hasClass('widget-field-date')
			|| widget.hasClass('widget-field-number') || widget.hasClass('widget-field-dict')
			|| widget.hasClass('widget-field-staff') || widget.hasClass('widget-field-hidden')
			|| widget.hasClass('widget-check') || widget.hasClass('widget-field-select')
			|| widget.hasClass('iterator-wrapper')) {
		var tableNameField = propPanel.find('input[name=tableName]');
		tableNameField.val(widget.attr('table'));
		tableNameField.parent().show();
	}
	if(widget.hasClass('widget-field-hidden')) {
		var primaryKeyField = propPanel.find('select[name=primaryKey]');
		var primaryKey = widget.attr('primary-key');
		primaryKeyField.val(primaryKey);
		primaryKeyField.parent().show();
	}
	if(widget.hasClass('cell')) {
		var overflowField = propPanel.find('select[name=overflow]');
		var overflow = widget.css('overflow') || dispField.css('overflow');
		overflowField.val(overflow);
		overflowField.parent().show();
	}
}

function rgbToHex(rgb) {
	rgb = rgb.replace('rgb', '').replace('(', '').replace(')', '');
	var rgbArr = rgb.split(',');
	var hexStr = '#';
	for(var i = 0; i < rgbArr.length; i++) {
		var hex = parseInt(rgbArr[i]).toString(16);
		if(hex.length === 1) {
			hex = '0' + hex;
		}
		hexStr = hexStr + hex;
	}
	return hexStr;
}
