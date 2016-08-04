$.Engine.plugin('diagnosis', {
    //实现afterFormLoaded方法

    afterFormLoaded: function (options) {
        var container = options.container;
        var diagnosisWidget = container.find('.widget-custom-diagnosis').css({'min-height': '20px'});
        if (diagnosisWidget.length > 0) {
            diagnosisWidget.each(function () {
                var diagnosis = $(this);
                /*var editTrigger = $('<input type="button" value="编辑" class="editTrigger" style="position: absolute;right:0;top:0"/>')
                 .appendTo(diagnosis).hide();*/

                queryDiagnosis($(this), container.data('options'), options.mode, container);

            });
        }
    },
    //实现afterModeChanged方法
    afterModeChanged: function (options) {
        var container = options.container;
        if (options.mode === 'view') {
            container.find('.widget-custom-diagnosis').removeClass('editable').removeClass('model-modal').css({
                'top': '0px',
                'left': '0px'
            });
            container.find('.widget-custom-diagnosis .display-field').unbind().removeClass('hover');
            container.find('.widget-custom-diagnosis .display-field li').unbind().removeClass('selected');
            container.find('.widget-custom-diagnosis').removeClass('model-modal').css({'top': '0px', 'left': '0px'});
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
                var editTrigger = $('<input type="button" value="编辑" class="editTrigger" style="position: absolute;right:0;top:0"/>')
                    .appendTo(diagnosis);
                queryDiagnosis(diagnosis, container.data('options'), 'edit', container)
            });
        }
    }
});


function queryDiagnosis(diagnosisWidget, opts, mode, container,stayEdit) {

    var param = {diagnosisType: diagnosisWidget.attr('diagnosistype')}, diagnosisType = diagnosisWidget.attr('diagnosistype');
    $.extend(param, opts);
    $.ajax({
        url: 'form/plugin.process?action=load&handler=diagnosis',
        data: param,
        dataType: 'json',
        success: function (data) {
            var displayField = diagnosisWidget.find('.display-field'), list, typeText = diagnosisWidget.find('.diagnosisType-text');
            if (!displayField || displayField.length <= 0) {
                $('<div class="display-field"></div>').appendTo(diagnosisWidget);
            }
            if ('30' == diagnosisType) {

            }
            displayField.append('<span></span>');
            displayField.empty();
            if (data.length > 0) {


                if (!typeText || typeText.length <= 0) {
                    typeText = $('<div class="diagnosisType-text"></div>').insertBefore(displayField);
                }
                if ('30' == diagnosisType) {
                    typeText.text('修正诊断：')
                } else if ('20' == diagnosisType) {
                    typeText.text('入院诊断：')
                } else if ('10' == diagnosisType) {
                    typeText.text('初步诊断：')
                }

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
                if(stayEdit){
                    list.before('<div  class="display-title title">诊断列表</div>');
                    displayField.find('li.selectable').unbind('click').bind('click', function () {
                        $('li.selectable').removeClass('selected');

                        if (!$(this).hasClass('selected')) {
                            $(this).addClass('selected');
                        }
                        return false;
                    });
                }

            }

            /*diagnosisWidget.find('.comboTextBox').hide();*/
            if (!mode || mode === 'edit') {
                diagnosisWidget.find('.editTrigger').off('click').on('click', function () {
                    if (!diagnosisWidget.find('.editor-wrapper') || diagnosisWidget.find('.editor-wrapper').length <= 0) {
                        var displayTitle = displayField.find('.display-title');
                        container.find('.widget-custom-diagnosis').removeClass('model-modal').css({
                            'top': '0px',
                            'left': '0px'
                        });
                        container.find('.widget-custom-diagnosis .display-field').unbind();
                        container.find('.widget-custom-diagnosis .editor-wrapper').remove();
                        container.find('.widget-custom-diagnosis .model-wrapper').remove();
                        container.find('.widget-custom-diagnosis .addDiagnosisBox').remove();
                        //container.find('.widget-custom-diagnosis .diagnosis-list').removeClass('edit');

                        if (!displayTitle || displayTitle.length <= 0) {
                            if (!list) {
                                $('<div class="display-title title">诊断列表</div>').appendTo(displayField);
                            } else {
                                list.before('<div  class="display-title title">诊断列表</div>');
                            }
                        }

                        var left = container.find('div.content').offset().left;
                        var width = container.find('div.content').width();
                        var originWidth = diagnosisWidget.width();
                        diagnosisWidget.addClass('model-modal').css({'top': '40px', 'left': left + 'px'});
                        createDiagnosisEditor(diagnosisWidget, opts, container);
                        //添加诊断模板区域
                        diagnosisWidget.find('.editor-wrapper').before('<div class="model-wrapper"></div>');
                        createDiagnosisModel(diagnosisWidget, opts, container);//创建诊断模板控件
                        container.find('.editTrigger').val('编辑');
                        $(this).val('X');


                    } else {
                        container.find('.widget-custom-diagnosis').removeClass('model-modal').css({
                            'top': '0px',
                            'left': '0px'
                        });
                        container.find('.widget-custom-diagnosis .display-field').unbind();
                        container.find('.widget-custom-diagnosis .editor-wrapper').remove();
                        container.find('.widget-custom-diagnosis .model-wrapper').remove();
                        container.find('.widget-custom-diagnosis .addDiagnosisBox').remove();

                        $(this).val('编辑');

                    }
                });


                if (!diagnosisWidget.find('.editor-wrapper') || diagnosisWidget.find('.editor-wrapper').length <= 0) {
                    displayField.addClass('hover');
                } else {
                    displayField.removeClass('hover');
                }

                if(stayEdit){
                    displayField.addClass('hover');
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
function createDiagnosisModel(diagnosisWidget, opts, container, showGrzd) {
    var diagnosisModelWrapper = diagnosisWidget.find('.model-wrapper'), diagnosisType = diagnosisWidget.attr('diagnosistype'),
        modelTitleBox = $('<div class="model-title title">诊断模板</div>'),
        displayField = diagnosisWidget.find('.display-field');

    if (!diagnosisModelWrapper || diagnosisModelWrapper.length <= 0) {
        diagnosisModelWrapper = $('<div class="model-wrapper"></div>');
        diagnosisWidget.find('.editor-wrapper').before(diagnosisModelWrapper);
    }
    modelTitleBox.append(['<div class="model-tool-bar">',
        '<input type="button" class="addModel" value="添加个人诊断"/>',
        '<input type="button" class="delModel" value="删除"/>',
        '<input type="button" class="upModel" value="上移"/>',
        '<input type="button" class="downModel" value="下移"/>',
        '</div>'].join('')).appendTo(diagnosisModelWrapper);
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
                    } else {
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
                        } else {
                            li2.find('i').removeClass('fa-plus-square-o').addClass('fa-plus-square');
                        }
                    }

                }
                if (showGrzd) {
                    list.find('li.bczd').hide();
                    list.find('li.grzd[type="sub"]').hide();
                } else {
                    list.find('li').hide();
                }
                /*诊断的dropdown*/
                var l = list.find('li').not('.sub');
                var i = l.find('i');
                i.bind('click', function () {
                    if ($(this).hasClass('fa-plus-square-o')) {
                        $(this).parent('li').find('li.sub').show('fast');
                        $(this).removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
                    } else if ($(this).hasClass('fa-minus-square-o')) {
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
                    } else {
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
                    var diagnosisEditorWrapper = diagnosisWidget.find('.editor-wrapper'), li = $(this).parent('li.selectable'),
                        diagnosisCode = li.attr('icd'), selected = displayField.find('li.selected'),
                        diagnosisText = $(this).text().trim(),
                        param, subParams = [],
                        modelType = li.attr('type'),
                        selectedType = selected.attr('type'),
                        diagnosisId;

                    if (!diagnosisCode || diagnosisCode.trim() === '') {
                        alert('诊断内容不能为空！');
                        return;
                    }

                    if (selected && selected.length > 0) {
                        if ('main' == selectedType) {
                            diagnosisId = selected.attr('id');
                            param = {
                                'diagnosisType': diagnosisType,
                                'diagnosisText': diagnosisText,
                                'diagnosisCode': diagnosisCode,
                                'diagnosisParent': diagnosisId
                            };
                        } else if ('sub' == selectedType) {
                            alert('请选择一条主诊断进行添加！');
                            return;
                        }
                    } else {
                        param = {
                            'diagnosisType': diagnosisType,
                            'diagnosisText': diagnosisText,
                            'diagnosisCode': diagnosisCode,
                            'diagnosisParent': null
                        };
                        if ('main' == modelType) {

                            li.find('ul li').each(function () {
                                subParams.push({
                                    'diagnosisType': diagnosisType,
                                    'diagnosisText': $(this).find('span').text(),
                                    'diagnosisCode': $(this).attr('icd')
                                });
                            });

                            if (subParams && subParams.length > 0) {
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
                            queryDiagnosis(diagnosisWidget, opts, 'edit', container ,true);
                            container.find('.widget-custom-diagnosis .model-wrapper').remove();
                            createDiagnosisModel(diagnosisWidget, opts, container);
                        }
                    });

                    return false;
                }).bind('click', function () {
                    var li = $(this).parent('li.selectable');
                    if (li.hasClass('selected')) {
                        li.removeClass('selected');
                    } else {
                        diagnosisModelWrapper.find('li.selectable').removeClass('selected');
                        li.addClass('selected');
                    }
                    return false;
                });


                /*添加个人诊断*/
                diagnosisModelWrapper.find('input.addModel').unbind().bind('click', function () {
                    var selected = displayField.find('li.selected'), children = [], param;


                    if (selected && selected.length > 0) {

                        param = {
                            diagnosisText: selected.find('b.text').text().trim() || selected.find('span.text').text().trim(),
                            diagnosisCode: selected.find('span.icd').text(),
                            diagnosisParent: null,
                            staffCode: opts.staffCode
                        };

                        if ('main' == selected.attr('type') && selected.find('li[type="sub"]') && selected.find('li[type="sub"]').length > 0) {
                            selected.find('li[type="sub"]').each(function () {
                                children.push({
                                    diagnosisText: $(this).find('span.text').text(),
                                    diagnosisCode: selected.find('span.icd').text().trim(),
                                    staffCode: opts.staffCode
                                });
                            });
                            if (children && children.length > 0) {
                                param.children = JSON.stringify(children);
                            }
                        }

                        $.ajax({
                            url: 'form/plugin.process?action=modelSave&handler=diagnosis',
                            data: param,
                            dataType: 'json',
                            type: 'post',
                            success: function (data) {
                                queryDiagnosis(diagnosisWidget, opts, 'edit', container ,true);
                                container.find('.widget-custom-diagnosis .model-wrapper').remove();
                                createDiagnosisModel(diagnosisWidget, opts, container,true);
                            }
                        });
                    } else {
                        alert('请选择一条诊断记录！');
                    }
                })


                /*删除个人诊断*/
                diagnosisModelWrapper.find('input.delModel').unbind().bind('click', function () {
                    var selected = diagnosisModelWrapper.find('li.selected'), param, children = [];
                    if (!selected || selected.length <= 0) {
                        alert('请选择一条个人诊断模板');
                        return;
                    }

                    if (!selected.hasClass('grzd')) {
                        alert('本次诊断内容无法删除，请选择一条个人诊断');
                        return;
                    }

                    param = {
                        guid: selected.prop('id')
                    };

                    if (selected.find('li[type="sub"]') && selected.find('li[type="sub"]').length > 0) {
                        selected.find('li[type="sub"]').each(function () {
                            children.push({
                                guid: $(this).prop('id')
                            });
                        });
                        if (children && children.length > 0) {
                            param.children = JSON.stringify(children);
                        }
                    }
                    $.ajax({
                        url: 'form/plugin.process?action=modelDelete&handler=diagnosis',
                        data: param,
                        dataType: 'json',
                        type: 'post',
                        success: function (data) {
                            queryDiagnosis(diagnosisWidget, opts, 'edit', container ,true);
                            container.find('.widget-custom-diagnosis .model-wrapper').remove();
                            createDiagnosisModel(diagnosisWidget, opts, container,true);
                        }
                    });

                });


                /*上移诊断模板*/
                diagnosisModelWrapper.find('input.upModel').unbind().bind('click', function () {
                    var selected = diagnosisModelWrapper.find('li.selected');
                    if (!selected || selected.length <= 0) {
                        alert('请选择一条个人诊断模板');
                        return;
                    }

                    if (!selected.hasClass('grzd')) {
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
                diagnosisModelWrapper.find('input.downModel').unbind().bind('click', function () {
                    var selected = diagnosisModelWrapper.find('li.selected');
                    if (!selected || selected.length <= 0) {
                        alert('请选择一条个人诊断模板');
                        return;
                    }

                    if (!selected.hasClass('grzd')) {
                        alert('本次诊断内容无法下移，请选择一条个人诊断');
                        return;
                    }
                    var type = selected.attr('type');
                    var next = selected.next('li[type=' + type + ']');

                    if (next && next.length > 0) {
                        next.after(selected);
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


function createDiagnosisEditor(diagnosisWidget, opts, container) {
    var diagnosisEditorWrapper = diagnosisWidget.find('.editor-wrapper'), displayField = diagnosisWidget.find('.display-field'),
        diagnosisType = diagnosisWidget.attr('diagnosistype'), diagnosisInputType = container.attr('diagnosisInputType'),
        dTypeSelector, dTypeSelectorBox, triggerBox,
        TFWLIST = ['LOA', 'LOT', 'LOP', 'ROA', 'ROT', 'ROP', 'LSA', 'LST', 'LSP', 'RSA', 'RST', 'RSP', 'LMA', 'LMT', 'LMP', 'RMA', 'RMT', 'RMP', 'LScA', 'LScP', 'RScA', 'RScp'],
        SCZTLIST = ['待产', '临产', '已产'];
    if (diagnosisEditorWrapper.length <= 0) {
        diagnosisEditorWrapper = $('<div class="editor-wrapper">');
        diagnosisEditorWrapper.append(['<div class="editor-toolbar" >',
            '<input type="button" class="add button" value="添加主诊断"/>',
            '<input type="button" class="add-sub button" value="添加子诊断"/>',
            '<input type="button" class="del button" value="删除诊断"/>',
            '<input type="button" class="up button" value="上移"/>',
            '<input type="button" class="down button" value="下移"/>',
            '<div>'].join(''));

        dTypeSelectorBox = $('<div class="comboTextBox dTypeSelectorBox"><span class="label-interval">诊断类型：</span></div>').appendTo(diagnosisEditorWrapper);
        if (!diagnosisInputType || diagnosisInputType.trim().length <= 0) {
            dTypeSelector = $([
                '<select style="width: 50%">',
                '<option value=""></option>',
                '<option value="pt">普通诊断</option>',
                '<option value="zl">肿瘤分期诊断</option>',
                '<option value="ck">产科诊断</option>',
                '<option value="zy">中医诊断</option>',
                '</select>'].join('')).appendTo(dTypeSelectorBox);
        } else {
            diagnosisInputType = diagnosisInputType.split(',');
            dTypeSelector = $('<select style="width: 50%"><option value=""></option></select>');
            for (var type in diagnosisInputType) {
                var prop = type.split(':');
                dTypeSelector.append('<option value="' + prop[0] + '">' + prop[1] + '</option>');
            }
            dTypeSelectorBox.append(dTypeSelector);
        }

        triggerBox = $('<div class="triggerBox"></div>').appendTo(diagnosisEditorWrapper);

        /*根据诊断类型的改变，改变诊断控件形式*/
        dTypeSelector.select2().off('select2-selecting').on('select2-selecting', function (e) {
            if ('pt' == e.choice.id) {
                triggerBox.empty();
                diagnosisEditorWrapper.find('.comboText').val('');
                diagnosisEditorWrapper.find('.resultsView').show();
                triggerBox.append('<div class="comboTextBox"><span class="label-interval">选择ICD：' +
                    '</span></label><input class="combo" style="width:50%;"/></div>');
                renderInputToSelect2(triggerBox.find('.combo'));

                diagnosisEditorWrapper.find('.combo').off('select2-selecting').on('select2-selecting', function (e) {
                    diagnosisEditorWrapper.find('.comboText').val(e.choice.name);
                });

            } else if ('zl' == e.choice.id) {
                triggerBox.empty();
                diagnosisEditorWrapper.find('.comboText').val('');
                diagnosisEditorWrapper.find('.resultsView').show();
                triggerBox.append('<div class="comboTextBox"><span class="label-interval">分期诊断：' +
                    '</span><input class="combo fq" style="width:50%;"/></div>');
                var xtBox = $('<div class="comboTextBox"><span class="label-interval">形态学诊断：' +
                    '</span><input class="combo xtx" style="width:30%;"/></div>').appendTo(triggerBox);
                xtBox.append([
                    '<select class="xtSelect xt1">',
                    '<option>T0</option>',
                    '<option>T1</option>',
                    '<option>T2</option>',
                    '<option>T3</option>',
                    '<option>T4</option>',
                    '<option>TS</option>',
                    '<option>TX</option>',
                    '</select>'
                ].join('')).append([
                    '<select class="xtSelect xt2">',
                    '<option>N0</option>',
                    '<option>N1</option>',
                    '<option>N2</option>',
                    '<option>N3</option>',
                    '<option>NX</option>',
                    '</select>'
                ].join('')).append(
                    '<select class="xtSelect xt3">' +
                    '<option>M0</option>' +
                    '<option>M1</option>' +
                    '<option>MX</option>' +
                    '</select>'
                ).append('<input class="compound button" type="button" value="组合"/>');
                renderInputToSelect2(triggerBox.find('.combo'));
                xtBox.find('.xtSelect').select2();
                xtBox.find('.compound').unbind('click').bind('click', function () {
                    var fq = triggerBox.find('.fq').select2('data').name.trim();
                    var xtx = triggerBox.find('.xtx').select2('data').name.trim();
                    var xt1 = triggerBox.find('.xtSelect.xt1').select2('data').text.trim();
                    var xt2 = triggerBox.find('.xtSelect.xt2').select2('data').text.trim();
                    var xt3 = triggerBox.find('.xtSelect.xt3').select2('data').text.trim();
                    var text = fq + xt1 + xt2 + xt3 + xtx;
                    diagnosisEditorWrapper.find('.comboText').val(text);
                });
            } else if ('ck' == e.choice.id) {
                triggerBox.empty();
                diagnosisEditorWrapper.find('.comboText').val('');
                diagnosisEditorWrapper.find('.resultsView').show();
                triggerBox.append('<div class="comboTextBox"><span class="label-interval">选择ICD：' +
                    '</span><input class="combo" style="width:50%;"/></div>');
                var scztBox = $('<div class="comboTextBox"><span class="label-interval">生产状态：' +
                    '</span><select class="sczt" style="width:30%;"><option></option></select></div>').appendTo(triggerBox);
                for (var i=0;i<SCZTLIST.length;i++) {
                    scztBox.find('select.sczt').append('<option>' + SCZTLIST[i] + '</option>');
                }
                scztBox.append('<span class="label-interval mini">孕周:</span><input class="yz" type="text" style="width:10%;"/>');

                var tfwBox = $('<div class="comboTextBox"><span class="label-interval">胎方位：' +
                    '</span><select class="tfw" style="width:30%;"><option></option></select></div>').appendTo(triggerBox);

                for (var j=0;j<TFWLIST.length;j++) {
                    tfwBox.find('select.tfw').append('<option>' + TFWLIST[j] + '</option>');
                }
                tfwBox.append('<span class="label-interval mini">孕次:</span><input class="yc" type="text" style="width:10%;"/>')
                    .append('<input class="compound button" type="button" value="组合"/>');
                renderInputToSelect2(triggerBox.find('.combo'));
                triggerBox.find('.tfw').select2();
                triggerBox.find('.sczt').select2();
                tfwBox.find('.compound').unbind('click').bind('click', function () {
                    var text = triggerBox.find('.combo').select2('data').name.trim();
                    var sczt = triggerBox.find('select.sczt').select2('data').text.trim();
                    var tfw = triggerBox.find('select.tfw').select2('data').text.trim();
                    var yz = triggerBox.find('input.yz').val().trim();
                    var yc = triggerBox.find('input.yc').val().trim();
                    text = text+' '+yz+' '+yc+' '+tfw+' '+sczt;
                    diagnosisEditorWrapper.find('.comboText').val(text);
                });

            } else if ('zy' == e.choice.id) {
                triggerBox.empty();
                diagnosisEditorWrapper.find('.comboText').val('');
                diagnosisEditorWrapper.find('.resultsView').hide();
                triggerBox.append('<div class="comboTextBox"><span class="label-interval">主病ICD：' +
                    '</span><input class="combo zbzd" style="width:50%;"/></div>');
                triggerBox.append('<div class="comboTextBox"><span class="label-interval">证候ICD：' +
                    '</span><input class="combo zhzd" style="width:50%;"/></div>');
                triggerBox.append('<div class="comboTextBox"><span class="label-interval">主病内容：' +
                    '</span><input class="zbzdnr" style="width:50%;"/></div>');
                triggerBox.append('<div class="comboTextBox"><span class="label-interval">证候内容：' +
                    '</span><input class="zhzdnr" style="width:50%;"/></div>');
                renderInputToSelect2(triggerBox.find('.combo'),'20');

                diagnosisEditorWrapper.find('.combo').off('select2-selecting').on('select2-selecting', function (e) {
                    if($(this).hasClass('zbzd')){
                        diagnosisEditorWrapper.find('.zbzdnr').val(e.choice.name);
                    }else{
                        diagnosisEditorWrapper.find('.zhzdnr').val(e.choice.name);
                    }
                });
            }
        });


        diagnosisEditorWrapper.append(['<div class="comboTextBox resultsView">',
            '<span class="label-interval">诊断内容：</span>',
            '<input class="comboText" type="text" style="width:50%;display: inline-block" maxlength="64"/>',
            '<input class="clear button" type="button" value="清空"/>',
            '</div>'].join(''));
        diagnosisWidget.append(diagnosisEditorWrapper);

        diagnosisEditorWrapper.find('.resultsView .clear').unbind('click').bind('click', function () {
            diagnosisEditorWrapper.find('.comboText').val('');
        });
    }

    displayField.find('li.selectable').unbind('click').bind('click', function () {
        $('li.selectable').removeClass('selected');

        if (!$(this).hasClass('selected')) {
            $(this).addClass('selected');
        }
        return false;
    });


    diagnosisEditorWrapper.find('.add').unbind('click').bind('click', function () {
        var diagnosisCode = null;
        var diagnosisText = null;
        var diagnosisInputType ,param;
        if(dTypeSelector.select2('data')){
            diagnosisInputType =dTypeSelector.select2('data').id;
        }else if(!dTypeSelector.select2('data')||dTypeSelector.select2('data').length<=0){
            toastr['warning']('请选择一种诊断类型。');
            return;
        }

        try{
            if('pt'==diagnosisInputType||'ck'==diagnosisInputType){
                diagnosisCode = diagnosisEditorWrapper.find('.combo').select2('data').id;
                diagnosisText = diagnosisEditorWrapper.find('.comboTextBox .comboText').val();
            }else if('zl'==diagnosisInputType){
                diagnosisCode = diagnosisEditorWrapper.find('.combo.fq').select2('data').id;
                diagnosisText = diagnosisEditorWrapper.find('.comboTextBox .comboText').val();
            }else if('zy'==diagnosisInputType){
                var zbCode = diagnosisEditorWrapper.find('.combo.zbzd').select2('data').id;
                var zhCode = diagnosisEditorWrapper.find('.combo.zhzd').select2('data').id;
                var zbText = diagnosisEditorWrapper.find('.zbzdnr').val();
                var zhText = diagnosisEditorWrapper.find('.zhzdnr').val();
            }
        }catch(e){
            toastr['warning']('ICD未选择。');
            return;
        }



        if('zy'!=diagnosisInputType){
            if (!diagnosisCode || diagnosisCode.trim() === '') {
                toastr['warning']('缺少诊断ICD，请从下拉框中进行选择。');
                return;
            }
            if(!diagnosisText||diagnosisText.trim().length<=0){
                toastr['warning']('诊断内容不能为空。');
                return;
            }
            param = {
                'diagnosisType': diagnosisType,
                'diagnosisText': diagnosisText,
                'diagnosisCode': diagnosisCode,
                'diagnosisParent': null
            };

        }else if('zy'==diagnosisInputType){
            if(!zbCode||zbCode.trim()==''){
                toastr['warning']('缺少主病诊断ICD，请从下拉框中进行选择。');
                return;
            }
            if(!zhCode||zhCode.trim()==''){
                toastr['warning']('缺少证候诊断ICD，请从下拉框中进行选择。');
                return;
            }
            if(!zbText||zbText.trim().length<=0){
                toastr['warning']('主病诊断内容不能为空。');
                return;
            }
            if(!zhText||zhText.trim().length<=0){
                toastr['warning']('症候诊断内容不能为空。');
                return;
            }

            param = {
                'diagnosisType': diagnosisType,
                'diagnosisText': zbText,
                'diagnosisCode': zbCode,
                'diagnosisParent': null
            };
            param.children = JSON.stringify([{
                'diagnosisType': diagnosisType,
                    'diagnosisText': zhText,
                    'diagnosisCode': zhCode
            }]);

        }


        $.extend(param, opts);
        $.ajax({
            url: 'form/plugin.process?action=save&handler=diagnosis',
            data: param,
            dataType: 'json',
            type: 'post',
            success: function (data) {
                queryDiagnosis(diagnosisWidget, opts, 'edit', container ,true);
                container.find('.widget-custom-diagnosis .model-wrapper').remove();
                createDiagnosisModel(diagnosisWidget, opts, container);
                toastr['success']('添加成功！');
            }
        });
    });


    /*添加子诊断*/
    diagnosisEditorWrapper.find('.add-sub').unbind('click').bind('click', function () {
        var selected = displayField.find('li.selected');
        var diagnosisCode = null;
        var diagnosisText = null;
        var diagnosisInputType;
        if (selected && selected.length > 0) {
            if(dTypeSelector.select2('data')){
                diagnosisInputType =dTypeSelector.select2('data').id;
                if('zy'==diagnosisInputType){

                    toastr['warning']('中医诊断不可作为子诊断。');
                    return;
                }
            }else if(!dTypeSelector.select2('data')||dTypeSelector.select2('data').length<=0){

                toastr['warning']('请选择一种诊断类型。');
                return;
            }



            try{
                if('pt'==diagnosisInputType||'ck'==diagnosisInputType){
                    diagnosisCode = diagnosisEditorWrapper.find('.combo').select2('data').id;
                    diagnosisText = diagnosisEditorWrapper.find('.comboTextBox .comboText').val();
                }else if('zl'==diagnosisInputType){
                    diagnosisCode = diagnosisEditorWrapper.find('.combo.fq').select2('data').id;
                    diagnosisText = diagnosisEditorWrapper.find('.comboTextBox .comboText').val();
                }
            }catch(e){
                toastr['warning']('ICD未选择。');
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
                    queryDiagnosis(diagnosisWidget, opts, 'edit', container ,true);
                    container.find('.widget-custom-diagnosis .model-wrapper').remove();
                    createDiagnosisModel(diagnosisWidget, opts, container);
                    toastr['success']('添加成功！');
                }
            });
        }
        else {
            toastr['warning']('请选择一条主诊断。');
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
                    queryDiagnosis(diagnosisWidget, opts, 'edit', container ,true);
                    container.find('.widget-custom-diagnosis .model-wrapper').remove();
                    createDiagnosisModel(diagnosisWidget, opts, container);
                }
            });
        }
        else {
            toastr['warning']('请选择一条诊断！');
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



function renderInputToSelect2(input,type) {
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
        width: 'off',
        multiple: false,
        ajax: {
            url: 'form/fill-combo.process',
            dataType: 'json',
            quietMillis: 250,
            cache: true,
            data: function (term, page) {
                return {
                    'category': 'icd',
                    'fuzzy': term,
                    'filter':type||'10'
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

