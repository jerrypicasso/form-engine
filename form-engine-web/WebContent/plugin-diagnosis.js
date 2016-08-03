$.Engine.plugin('diagnosis', {
    //实现afterFormLoaded方法

    afterFormLoaded: function (options) {
        var container = options.container;
        var diagnosisWidget = container.find('.widget-custom-diagnosis').css({'min-height':'20px','position':'relative'});
        if (diagnosisWidget.length > 0) {
            diagnosisWidget.each(function () {
                queryDiagnosis($(this), container.data('options'), options.mode,container);
            });
        }
    },
    //实现afterModeChanged方法
    afterModeChanged: function (options) {
        var container = options.container;
        if (options.mode === 'view') {
            container.find('.widget-custom-diagnosis').removeClass('editable');
            container.find('.widget-custom-diagnosis .display-field').unbind();
            container.find('.widget-custom-diagnosis .editor-wrapper').remove();
            container.find('.widget-custom-diagnosis .model-wrapper').remove();
            container.find('.widget-custom-diagnosis .addDiagnosisBox').remove();
            container.find('.widget-custom-diagnosis .editTrigger').remove();
            container.find('.widget-custom-diagnosis .diagnosis-list').removeClass('edit');
        }
        else if (options.mode === 'edit') {
            container.find('.widget-custom-diagnosis .diagnosis-list').addClass('edit');
            container.find('.widget-custom-diagnosis').each(function () {
                var diagnosis = $(this);
                diagnosis.addClass('editable');


                queryDiagnosis(diagnosis,container.data('options'),'edit',container)
            });
        }
    }
});




function queryDiagnosis(diagnosisWidget, opts, mode,container) {

    var param = {diagnosisType: diagnosisWidget.attr('diagnosistype')}, diagnosisType = diagnosisWidget.attr('diagnosistype');
    $.extend(param, opts);
    $.ajax({
        url: 'form/plugin.process?action=load&handler=diagnosis',
        data: param,
        dataType: 'json',
        success: function (data) {
            var displayField = diagnosisWidget.find('.display-field'),list;
            if(!displayField||displayField.length<=0){
                $('<div class="display-field"></div>').appendTo(diagnosisWidget);
            }
            if ('30' == diagnosisType) {

            }
            displayField.append('<span></span>');
            displayField.empty();
            if (data.length > 0) {
                list = $('<ul style="margin:0;padding:0;list-style:none;" class="diagnosis-list"></ul>');
                for (var i = 0; i < data.length; i++) {
                    var li = $('<li id="' + data[i].ID + '" type="main" class="selectable">'), index = i + 1;
                    if (data.length > 1) {
                        li.append('<b class="index">' + index + '. </b><b class="text">' + data[i].NAME + '</b><span class="icd">' + data[i].ICD_10 + '</span>');
                    } else {
                        li.append('<b class="text">' + data[i].NAME + '</b><span class="icd">' + data[i].ICD_10 + '</span>');
                    }

                    list.append(li);
                    var items = data[i].items;
                    if (items && items.length > 0) {
                        var subList = $('<ul style="margin:0 0 0 20px;padding:0;list-style:none;" class="diagnosis-list"></ul>');
                        for (var j = 0; j < items.length; j++) {
                            var subIndex = j + 1;
                            if (items.length > 1) {
                                subList.append('<li id="' + items[j].ID + '" type="sub" class="selectable"><span class="index">(' + subIndex + '). </span><span class="text">' + items[j].NAME + '</span>'
                                    + '<span class="icd">' + items[j].ICD_10 + '</span></li>');
                            } else {
                                subList.append('<li id="' + items[j].ID + '" type="sub" class="selectable"><span class="text">' + items[j].NAME + '</span>'
                                    + '<span class="icd">' + items[j].ICD_10 + '</span></li>');
                            }

                        }
                        li.append(subList);
                    }
                }
                displayField.append(list);
            }
            diagnosisWidget.data("zdLists", data);//将每次读取的节点放入容器中
            diagnosisWidget.find('.comboTextBox').hide();
            if (!mode || mode === 'edit') {
                var editTrigger = $('<input type="button" value="编辑" class="editTrigger" style="position: absolute;right:0;top:0"/>')
                    .appendTo(diagnosisWidget)
                    .on('click',function(){
                    if (!diagnosisWidget.find('.editor-wrapper') || diagnosisWidget.find('.editor-wrapper').length <= 0) {

                        container.find('.widget-custom-diagnosis .display-field').unbind();
                        container.find('.widget-custom-diagnosis .editor-wrapper').remove();
                        container.find('.widget-custom-diagnosis .model-wrapper').remove();
                        container.find('.widget-custom-diagnosis .addDiagnosisBox').remove();
                        //container.find('.widget-custom-diagnosis .diagnosis-list').removeClass('edit');

                        createDiagnosisEditor(diagnosisWidget, opts,container);
                        //添加诊断模板区域
                        diagnosisWidget.find('.editor-wrapper').before('<div class="model-wrapper"></div>');
                        createDiagnosisModel(diagnosisWidget, opts,container);//穿件诊断模板控件
                        container.find('.editTrigger').val('编辑');
                        $(this).val('取消编辑');
                    }else{
                        //todo 此处和上面的部分都要进行样式修改，以满足诊断控件撑开的要求
                    }
                });


                displayField.find('li.selectable').unbind('click').bind('click', function () {
                    $('li.selectable').removeClass('selected');

                    if(!$(this).hasClass('selected')){
                        $(this).addClass('selected');
                    }
                    return false;
                });

                if(!diagnosisWidget.find('.editor-wrapper')||diagnosisWidget.find('.editor-wrapper').length<=0){
                    displayField.addClass('hover');
                }else{
                    displayField.removeClass('hover');
                }

                diagnosisWidget.find('.diagnosis-list').removeClass('edit');
                diagnosisWidget.find('.diagnosis-list').addClass('edit');

            } else {
                diagnosisWidget.find('.diagnosis-list').removeClass('edit');

            }

        }
    });

}


/**
 * 创建诊断模板模块
 * @param diagnosisWidget
 * @param opts
 * @param container
 */
function createDiagnosisModel(diagnosisWidget, opts,container) {
    var diagnosisModelWrapper = diagnosisWidget.find('.model-wrapper'),diagnosisType =diagnosisWidget.attr('diagnosistype'),
        modelTitleBox = $('<div class="model-title" style="background-color: #337FE5;line-height:30px;height:30px;color:white">诊断模板</div>'),
        displayField = diagnosisWidget.find('.display-field');

    if(!diagnosisModelWrapper||diagnosisModelWrapper.length<=0){
        diagnosisModelWrapper  =$('<div class="model-wrapper"></div>');
        diagnosisWidget.find('.editor-wrapper').before(diagnosisModelWrapper);
    }
    modelTitleBox.append([
        '<input type="button" class="addModel" value="添加个人诊断"/>',
        '<input type="button" class="delModel" value="删除"/>',
        '<input type="button" class="upModel" value="上移"/>',
        '<input type="button" class="downModel" value="下移"/>'].join('')).appendTo(diagnosisModelWrapper);
    $.ajax({
        url: 'form/plugin.process?action=modelLoad&handler=diagnosis',
        data: opts,
        dataType: 'json',
        success: function (results) {
            var data = results.grzdList;
            var zdList = results.bczdList;
            if (data && data.length > 0) {
                var list = $('<ul style="padding:0;' +
                    'list-style:none;margin:10px 0 0 10px;" class="diagnosis-model-list">' +
                    '<div class="list-title"><i class="fa fa-plus grzd"></i>&nbsp;个人模板</div></ul>');
                for (var i = 0; i < data.length; i++) {
                    var li = $('<li id="' + data[i].id + '" type="main" icd="' + data[i]['icd_10'] +
                        '" class="selectable grzd" style="font-size: 14px;"><i class="fa fa-plus-square-o"></i>&nbsp;<span>'
                        + data[i].lr + '</span></li>');
                    list.append(li);
                    var children = data[i].children;
                    if (children && children.length > 0) {
                        var subList = $('<ul style="margin:0 0 0 10px;padding:0;list-style:none;" class="diagnosis-model-list"></ul>');
                        for (var j = 0; j < children.length; j++) {
                            subList.append('<li id="' + children[j].id + '" type="sub" icd="' + children[j]['icd_10'] +
                                '" class="selectable sub grzd"><i class="fa  fa-file-o"></i>&nbsp;<span>' + children[j].lr + '</span>');
                        }
                        li.append(subList);
                    }else{
                        li.find('i').removeClass('fa-plus-square-o').addClass('fa-plus-square');
                    }
                }


                if (zdList && zdList.length > 0) {
                    list.append('<div class="list-title"><i class="fa fa-plus bczd"></i>&nbsp;本次诊断</div>');

                    for (var x = 0; x < zdList.length; x++) {
                        var li2 = $('<li id="' + zdList[x].ID + '" type="main" icd="' + zdList[x].ICD_10 +
                            '" class="selectable bczd" style="font-size: 14px;"><i class="fa fa-plus-square-o"></i>&nbsp;<span>'
                            + zdList[x].NAME + '</span></li>');
                        list.append(li2);
                        var items = zdList[x].items;
                        if (items && items.length > 0) {
                            var subList2 = $('<ul style="margin:0 0 0 10px;padding:0;list-style:none;" class="diagnosis-model-list"></ul>');
                            for (var y = 0; y < items.length; y++) {
                                subList2.append('<li id="' + items[y].ID + '" type="sub" icd="' + items[y].ICD_10 +
                                    '" class="selectable sub bczd"><i class="fa  fa-file-o"></i>&nbsp;<span>' + items[y].NAME + '</span>');
                            }
                            li2.append(subList2);
                        }else{
                            li2.find('i').removeClass('fa-plus-square-o').addClass('fa-plus-square');
                        }
                    }

                }

                list.find('li').hide();

                /*诊断的dropdown*/
                var l = list.find('li').not('.sub');
                var i = l.find('i');
                i.bind('click', function () {
                    if ($(this).hasClass('fa-plus-square-o')) {
                        $(this).parent('li').find('li.sub').show('fast');
                        $(this).removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
                    } else if($(this).hasClass('fa-minus-square-o')){
                        $(this).parent('li').find('li.sub').hide('fast');
                        $(this).removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
                    }
                });
                /*分类节点的dropdown*/
                list.find('.list-title i').unbind('click').bind('click', function () {
                    if ($(this).hasClass('grzd')) {
                        if ($(this).hasClass('fa-plus')) {
                            $(this).removeClass('fa-plus').addClass('fa-minus');
                            list.find('li.grzd').not('.sub').show('fast');
                        } else {
                            $(this).removeClass('fa-minus').addClass('fa-plus');
                            list.find('li.grzd').not('.sub').hide('fast');
                        }
                    }else{
                        if ($(this).hasClass('fa-plus')) {
                            $(this).removeClass('fa-plus').addClass('fa-minus');
                            list.find('li.bczd').not('.sub').show('fast');
                        } else {
                            $(this).removeClass('fa-minus').addClass('fa-plus');
                            list.find('li.bczd').not('.sub').hide('fast');
                        }
                    }
                });
                diagnosisModelWrapper.append(list);


                /*添加诊断*/
                diagnosisModelWrapper.find('li.selectable span').unbind('dblclick').bind('dblclick', function () {
                    var diagnosisEditorWrapper = diagnosisWidget.find('.editor-wrapper'),li =$(this).parent('li.selectable'),
                        diagnosisCode = li.attr('icd'),selected = displayField.find('li.selected'),
                        diagnosisText = $(this).text().trim(),
                        param, subParams =[],
                        modelType = li.attr('type'),
                        selectedType = selected.attr('type'),
                        diagnosisId;

                    if (!diagnosisCode || diagnosisCode.trim() === '') {
                        alert('诊断内容不能为空！');
                        return;
                    }

                    if(selected&&selected.length>0){
                        if('main'==selectedType){
                            diagnosisId = selected.attr('id');
                            param={
                                'diagnosisType': diagnosisType,
                                'diagnosisText': diagnosisText,
                                'diagnosisCode': diagnosisCode,
                                'diagnosisParent': diagnosisId
                            };
                        }else if('sub'==selectedType){
                            alert('请选择一条主诊断进行添加！');
                            return;
                        }
                    }else{
                        param={
                            'diagnosisType': diagnosisType,
                            'diagnosisText': diagnosisText,
                            'diagnosisCode': diagnosisCode,
                            'diagnosisParent': null
                        };
                        if('main'==modelType){

                            li.find('ul li').each(function(){
                                subParams.push({
                                    'diagnosisType': diagnosisType,
                                    'diagnosisText': $(this).find('span').text(),
                                    'diagnosisCode': $(this).attr('icd')
                                });
                            });

                            if(subParams&&subParams.length>0){
                                param.children = JSON.stringify(subParams);
                            }
                        }
                    }

                    $.extend(param, opts);
                    $.ajax({
                        url: 'form/plugin.process?action=save&handler=diagnosis',
                        data: param,
                        dataType: 'json',
                        type: 'post',
                        success: function (data) {
                            queryDiagnosis(diagnosisWidget, opts, 'edit',container);
                            container.find('.widget-custom-diagnosis .model-wrapper').remove();
                            createDiagnosisModel(diagnosisWidget, opts,container);
                        }
                    });

                    return false;
                }).bind('click', function () {
                    var li =$(this).parent('li.selectable');
                    if (li.hasClass('selected')) {
                        li.removeClass('selected');
                    } else {
                        diagnosisModelWrapper.find('li.selectable').removeClass('selected');
                        li.addClass('selected');
                    }
                    return false;
                });


                /*添加个人诊断*/
                diagnosisModelWrapper.find('input.addModel').unbind().bind('click',function(){
                    var selected = displayField.find('li.selected'),children=[],param;



                    if(selected&&selected.length>0){

                        param = {
                            diagnosisText: selected.find('b.text').text(),
                            diagnosisCode: selected.find('span.icd').text(),
                            diagnosisParent: null,
                            staffCode: opts.staffCode
                        };

                        if('main'==selected.attr('type')&&selected.find('li[type="sub"]')&&selected.find('li[type="sub"]').length>0) {
                            selected.find('li[type="sub"]').each(function(){
                                children.push({
                                    diagnosisText: $(this).find('span.text').text(),
                                    diagnosisCode: selected.find('span.icd').text(),
                                    staffCode: opts.staffCode
                                });
                            });
                            if(children&&children.length>0){
                                param.children = JSON.stringify(children);
                            }
                        }

                        $.ajax({
                            url: 'form/plugin.process?action=modelSave&handler=diagnosis',
                            data: param,
                            dataType: 'json',
                            type: 'post',
                            success: function (data) {
                                queryDiagnosis(diagnosisWidget, opts, 'edit',container);
                                container.find('.widget-custom-diagnosis .model-wrapper').remove();
                                createDiagnosisModel(diagnosisWidget, opts,container);
                            }
                        });
                    }else{
                        alert('请选择一条诊断记录！');
                    }
                })



                /*删除个人诊断*/
                diagnosisModelWrapper.find('input.delModel').unbind().bind('click',function(){
                    var selected = diagnosisModelWrapper.find('li.selected'),param,children = [];
                    if(!selected||selected.length<=0){
                        alert('请选择一条个人诊断模板');
                        return;
                    }

                    if(!selected.hasClass('grzd')){
                        alert('本次诊断内容无法删除，请选择一条个人诊断');
                        return;
                    }

                    param = {
                        guid:selected.prop('id')
                    };

                    if(selected.find('li[type="sub"]')&&selected.find('li[type="sub"]').length>0){
                        selected.find('li[type="sub"]').each(function(){
                            children.push({
                                guid:$(this).prop('id')
                            });
                        });
                        if(children&&children.length>0){
                            param.children = JSON.stringify(children);
                        }
                    }
                    $.ajax({
                        url: 'form/plugin.process?action=modelDelete&handler=diagnosis',
                        data: param,
                        dataType: 'json',
                        type: 'post',
                        success: function (data) {
                            queryDiagnosis(diagnosisWidget, opts, 'edit',container);
                            container.find('.widget-custom-diagnosis .model-wrapper').remove();
                            createDiagnosisModel(diagnosisWidget, opts,container);
                        }
                    });

                });


                /*上移诊断模板*/
                diagnosisModelWrapper.find('input.upModel').unbind().bind('click',function(){
                    var selected = diagnosisModelWrapper.find('li.selected');
                    if(!selected||selected.length<=0){
                        alert('请选择一条个人诊断模板');
                        return;
                    }

                    if(!selected.hasClass('grzd')){
                        alert('本次诊断内容无法上移，请选择一条个人诊断');
                        return;
                    }

                    var type = selected.attr('type');
                    var prev = selected.prev('li[type=' + type + ']');

                    if (prev && prev.length > 0) {
                        prev.before(selected);
                    }
                    var brothers = selected.parent().find('li[type=' + type + ']');
                    var records = [];
                    for (var i = 0; i < brothers.length; i++) {
                        var id = $(brothers[i]).prop('id');
                        var seq = i;
                        records.push({'id': id, 'seq': seq});
                    }
                    if (records.length > 0) {
                        $.ajax({
                            url: 'form/plugin.process?action=modelSort&handler=diagnosis',
                            data: {records: JSON.stringify(records)},
                            dataType: 'json',
                            success: function (data) {
                            }
                        });
                    }


                });

                /*下移诊断模板*/
                diagnosisModelWrapper.find('input.downModel').unbind().bind('click',function(){
                    var selected = diagnosisModelWrapper.find('li.selected');
                    if(!selected||selected.length<=0){
                        alert('请选择一条个人诊断模板');
                        return;
                    }

                    if(!selected.hasClass('grzd')){
                        alert('本次诊断内容无法下移，请选择一条个人诊断');
                        return;
                    }
                    var type = selected.attr('type');
                    var next = selected.next('li[type=' + type + ']');

                    if (next && next.length > 0) {
                        next.before(selected);
                    }
                    var brothers = selected.parent().find('li[type=' + type + ']');
                    var records = [];
                    for (var i = 0; i < brothers.length; i++) {
                        var id = $(brothers[i]).prop('id');
                        var seq = i;
                        records.push({'id': id, 'seq': seq});
                    }
                    if (records.length > 0) {
                        $.ajax({
                            url: 'form/plugin.process?action=modelSort&handler=diagnosis',
                            data: {records: JSON.stringify(records)},
                            dataType: 'json',
                            success: function (data) {
                            }
                        });
                    }

                });
            }
        }

    });


}


function createDiagnosisEditor(diagnosisWidget, opts,container) {
    var diagnosisEditorWrapper = diagnosisWidget.find('.editor-wrapper'),displayField = diagnosisWidget.find('.display-field'),
        diagnosisType = diagnosisWidget.attr('diagnosistype');
    if (diagnosisEditorWrapper.length <= 0) {
        diagnosisEditorWrapper = $('<div class="editor-wrapper">');
        diagnosisEditorWrapper.append(['<div>',
            '<input type="button" class="add" value="添加主诊断"/>',
            '<input type="button" class="add-sub" value="添加子诊断"/>',
            '<input type="button" class="del" value="删除诊断"/>',
            '<input type="button" class="up" value="上移"/>',
            '<input type="button" class="down" value="下移"/>',
            '<div>'].join(''));
        diagnosisEditorWrapper.append('<input class="combo" style="width:100%;"/>');
        diagnosisEditorWrapper.append(['<div class="comboTextBox" style="display: none">',
            '<input class="comboText" type="text" style="width:70%;display: inline-block" maxlength="64"/>',
            '<input class="cancel" type="button" value="取消"/>',
            '</div>'].join(''));
        diagnosisWidget.append(diagnosisEditorWrapper);
    }

    //如果diagnosisType为修正诊断，便显示添加修正诊断按钮
   /* if ('30' == diagnosisType) {
        diagnosisWidget.find('.display-field').before('<div class="addDiagnosisBox"><input type="button" class="addDiagnosis" value="添加修正诊断区域"/></div>');
        diagnosisWidget.find('.addDiagnosisBox input[type="button"].addDiagnosis').unbind('click').bind('click', function () {
        })
    }
*/

    renderInputToSelect2(diagnosisEditorWrapper.find('.combo'));
    diagnosisEditorWrapper.find('.combo').on('change', function (e) {
        var comboTextBox = diagnosisEditorWrapper.find('.comboTextBox').show();
        diagnosisEditorWrapper.find('.combo').select2("container").hide();
        diagnosisEditorWrapper.find('.comboText').val(e.added.name);
        comboTextBox.find('.cancel').bind('click', function () {
            diagnosisEditorWrapper.find('.combo').select2("container").show();
            comboTextBox.hide();
        })
    });
    diagnosisEditorWrapper.find('.add').unbind('click').bind('click', function () {
        var diagnosisCode = null;
        var diagnosisText = null;

        if (diagnosisEditorWrapper.find('.combo').select2('data')) {
            diagnosisCode = diagnosisEditorWrapper.find('.combo').select2('data').id;
            diagnosisText = diagnosisEditorWrapper.find('.combo').select2('data').name;
        }

        if (diagnosisEditorWrapper.find('.comboTextBox .comboText').val() && diagnosisEditorWrapper.find('.comboTextBox .comboText').val().trim() != '') {
            diagnosisText = diagnosisEditorWrapper.find('.comboTextBox .comboText').val();
        }


        if (!diagnosisCode || diagnosisCode.trim() === '') {
            alert('诊断内容不能为空！');
            return;
        }

        var param = {
            'diagnosisType': diagnosisType,
            'diagnosisText': diagnosisText,
            'diagnosisCode': diagnosisCode,
            'diagnosisParent': null
        };
        $.extend(param, opts);
        $.ajax({
            url: 'form/plugin.process?action=save&handler=diagnosis',
            data: param,
            dataType: 'json',
            type: 'post',
            success: function (data) {
                diagnosisEditorWrapper.find('.combo').select2('val', '');
                diagnosisEditorWrapper.find('.combo').val('');
                diagnosisEditorWrapper.find('.combo').select2('container').show();
                queryDiagnosis(diagnosisWidget, opts, 'edit',container);
                container.find('.widget-custom-diagnosis .model-wrapper').remove();
                createDiagnosisModel(diagnosisWidget, opts,container);

            }
        });
    });


    /*添加子诊断*/
    diagnosisEditorWrapper.find('.add-sub').unbind('click').bind('click', function () {
        var selected = displayField.find('li.selected');
        var diagnosisCode = null;
        var diagnosisText = null;
        if (selected && selected.length > 0) {
            if (diagnosisEditorWrapper.find('.combo').select2('data')) {
                diagnosisCode = diagnosisEditorWrapper.find('.combo').select2('data').id;
                diagnosisText = diagnosisEditorWrapper.find('.combo').select2('data').name;
            }

            if (diagnosisEditorWrapper.find('.comboTextBox .comboText').val() && diagnosisEditorWrapper.find('.comboTextBox .comboText').val().trim() != '') {
                diagnosisText = diagnosisEditorWrapper.find('.comboTextBox .comboText').val();
            }


            if (!diagnosisCode || diagnosisCode.trim() === '') {
                alert('诊断内容不能为空！');
                return;
            }
            var diagnosisId = selected.attr('id');
            var param = {
                'diagnosisType': diagnosisType,
                'diagnosisText': diagnosisText,
                'diagnosisCode': diagnosisCode,
                'diagnosisParent': diagnosisId
            };
            $.extend(param, opts);
            $.ajax({
                url: 'form/plugin.process?action=save&handler=diagnosis',
                data: param,
                dataType: 'json',
                type: 'post',
                success: function (data) {
                    diagnosisEditorWrapper.find('.combo').select2('val', '');
                    diagnosisEditorWrapper.find('.combo').val('');
                    diagnosisEditorWrapper.find('.combo').select2('container').show();
                    queryDiagnosis(diagnosisWidget, opts, 'edit',container);
                    container.find('.widget-custom-diagnosis .model-wrapper').remove();
                    createDiagnosisModel(diagnosisWidget, opts,container);

                }
            });
        }
        else {
            alert('请选择一条主诊断！');
        }
    });
    diagnosisEditorWrapper.find('.del').unbind('click').bind('click', function () {
        var selected = displayField.find('li.selected');
        if (selected && selected.length > 0) {
            var id = selected.attr('id');
            $.ajax({
                url: 'form/plugin.process?action=drop&handler=diagnosis',
                data: {id: id},
                dataType: 'json',
                success: function (data) {
                    queryDiagnosis(diagnosisWidget, opts, 'edit',container);
                    container.find('.widget-custom-diagnosis .model-wrapper').remove();
                    createDiagnosisModel(diagnosisWidget, opts,container);

                }
            });
        }
        else {
            alert('请选择一条诊断！');
        }
    });
    diagnosisEditorWrapper.find('.up').unbind('click').bind('click', function () {
        var selected = diagnosisWidget.find('li.selected'), index = selected.find('b.index'), subIndex = selected.find('span.index'), idx, preIdx, temp;
        if (selected && selected.length > 0) {
            var type = selected.attr('type');
            var prev = selected.prev('li[type=' + type + ']');

            if (prev && prev.length > 0) {
                if (index && index.length > 0) {
                    idx = index.text();
                    preIdx = prev.find('b.index').text();
                    temp = idx;
                    idx = preIdx;
                    preIdx = temp;
                    selected.find('b.index').text(idx);
                    prev.find('b.index').text(preIdx);
                } else if (subIndex && subIndex.length > 0) {
                    idx = subIndex.text();
                    preIdx = prev.find('span.index').text();
                    temp = idx;
                    idx = preIdx;
                    preIdx = temp;
                    selected.find('span.index').text(idx);
                    prev.find('span.index').text(preIdx);
                }


                prev.before(selected);
            }
            var brothers = selected.parent().find('li[type=' + type + ']');
            var records = [];
            for (var i = 0; i < brothers.length; i++) {
                var id = $(brothers[i]).attr('id');
                var seq = i;
                records.push({'id': id, 'seq': seq});
            }
            if (records.length > 0) {
                $.ajax({
                    url: 'form/plugin.process?action=sort&handler=diagnosis',
                    data: {type: type, records: JSON.stringify(records)},
                    dataType: 'json',
                    success: function (data) {
                    }
                });
            }
        }
        else {
            alert('请选择一条诊断！');
        }
    });
    diagnosisEditorWrapper.find('.down').unbind('click').bind('click', function () {
        var selected = diagnosisWidget.find('li.selected'), index = selected.find('b.index'), subIndex = selected.find('span.index'), idx, nextIdx, temp;
        if (selected && selected.length > 0) {
            var type = selected.attr('type');
            var next = selected.next('li[type=' + type + ']');
            if (next && next.length > 0) {
                if (index && index.length > 0) {
                    idx = index.text();
                    nextIdx = next.find('b.index').text();
                    temp = idx;
                    idx = nextIdx;
                    nextIdx = temp;
                    selected.find('b.index').text(idx);
                    next.find('b.index').text(nextIdx);
                } else if (subIndex && subIndex.length > 0) {
                    idx = subIndex.text();
                    nextIdx = next.find('span.index').text();
                    temp = idx;
                    idx = nextIdx;
                    nextIdx = temp;
                    selected.find('span.index').text(idx);
                    next.find('span.index').text(nextIdx);
                }

                next.after(selected);
            }
            var brothers = selected.parent().find('li[type=' + type + ']');
            var records = [];
            for (var i = 0; i < brothers.length; i++) {
                var id = $(brothers[i]).attr('id');
                var seq = i;
                records.push({'id': id, 'seq': seq});
            }
            if (records.length > 0) {
                $.ajax({
                    url: 'form/plugin.process?action=sort&handler=diagnosis',
                    data: {type: type, records: JSON.stringify(records)},
                    dataType: 'json',
                    success: function (data) {
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
        minimumInputLength: 1,
        minimumResultsForSearch: 'Infinity',
        closeOnSelect: true,
        language: {
            inputTooShort: function (args) {
                return '<span style="font-size:12px;">请输入</span>';
            },
            noResults: function () {
                return '<span style="font-size:12px;">没找到</span>';
            }
        },
        multiple: false,
        ajax: {
            url: 'form/fill-combo.process',
            dataType: 'json',
            quietMillis: 250,
            cache: true,
            data: function (term, page) {
                return {
                    'category': 'icd',
                    'fuzzy': term
                };
            },
            results: function (data, page) {
                var results = [];
                $.each(data, function (index, item) {
                    results.push({
                        id: item.val,
                        name: item.txt
                    });
                });
                return {results: results};
            }
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        formatResult: function (item) {
            return item.name + '                     ' + item.id;
        },
        formatSelection: function (item) {
            return item.name + '                     ' + item.id;
        }
    });

    input.on('change', function (e) {

        JSON.stringify({val: e.val, added: e.added, removed: e.removed})
    })
}

