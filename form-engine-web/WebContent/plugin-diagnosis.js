$.Engine.plugin('diagnosis', {
    //实现afterFormLoaded方法
    afterFormLoaded: function (options) {
        var container = options.container;
        var diagnosisWidget = container.find('.widget-custom-diagnosis');
        if (diagnosisWidget.length > 0) {
            diagnosisWidget.each(function () {
                queryDiagnosis($(this), container.data('options'), options.mode);
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
            container.find('.widget-custom-diagnosis .diagnosis-list').removeClass('edit');
        }
        else if (options.mode === 'edit') {
            container.find('.widget-custom-diagnosis .diagnosis-list').addClass('edit');
            container.find('.widget-custom-diagnosis').each(function () {
                var diagnosis = $(this);
                diagnosis.addClass('editable');
                createDiagnosisEditor(diagnosis, container.data('options'));
                diagnosis.find('.editor-wrapper').before('<div class="diagnosisEditorWrapper"></div>');//添加诊断模板区域
                createDiagnosisModel(diagnosis, container.data('options'));//穿件诊断模板控件
            });
        }
    }
});

function queryDiagnosis(diagnosisWidget, opts, mode) {

    var param = {diagnosisType: diagnosisWidget.attr('diagnosistype')};
    $.extend(param, opts);
    $.ajax({
        url: 'form/plugin.process?action=load&handler=diagnosis',
        data: param,
        dataType: 'json',
        success: function (data) {
            var displayField = diagnosisWidget.find('.display-field');
            displayField.empty();
            if (data.length > 0) {
                var list = $('<ul style="margin:0;padding:0;list-style:none;" class="diagnosis-list"></ul>');
                for (var i = 0; i < data.length; i++) {
                    var li = $('<li id="' + data[i].ID + '" type="main" class="selectable">'), index = i + 1;
                    if (data.length > 1) {
                        li.append('<b class="index">' + index + '</b><b>. ' + data[i].NAME + '</b><span class="icd">' + data[i].ICD_10 + '</span>');
                    } else {
                        li.append('<b>' + data[i].NAME + '</b><span class="icd">' + data[i].ICD_10 + '</span>');
                    }

                    list.append(li);
                    var items = data[i].items;
                    if (items && items.length > 0) {
                        var subList = $('<ul style="margin:0 0 0 20px;padding:0;list-style:none;" class="diagnosis-list"></ul>');
                        for (var j = 0; j < items.length; j++) {
                            var subIndex = j + 1;
                            if (items.length > 1) {
                                subList.append('<li id="' + items[j].ID + '" type="sub" class="selectable"><span class="index">' + subIndex + '</span><span>. ' + items[j].NAME + '</span>'
                                    + '<span class="icd">' + items[j].ICD_10 + '</span></li>');
                            } else {
                                subList.append('<li id="' + items[j].ID + '" type="sub" class="selectable"><span>' + items[j].NAME + '</span>'
                                    + '<span class="icd">' + items[j].ICD_10 + '</span></li>');
                            }

                        }
                        li.append(subList);
                    }
                }
                displayField.append(list);

                $('li.selectable').unbind('click').bind('click', function () {
                    $('li.selectable').removeClass('selected');
                    $(this).addClass('selected');
                    return false;
                });
            }
            diagnosisWidget.find('.comboTextBox').hide();
            if (!mode || mode === 'edit') {
                diagnosisWidget.find('.diagnosis-list').removeClass('edit');
                diagnosisWidget.find('.diagnosis-list').addClass('edit');
            } else {
                diagnosisWidget.find('.diagnosis-list').removeClass('edit');

            }

        }
    });

}

function createDiagnosisModel(diagnosisWidget, opts){
    var diagnosisModelWrapper =diagnosisWidget.find('.diagnosisEditorWrapper');
    diagnosisModelWrapper.css({'padding':'5 5 5 5'}).append('<div style="background-color: #337FE5;height:100%;color:white">诊断模板</div>');
    $.ajax({
        url: 'form/plugin.process?action=modelLoad&handler=diagnosis',
        data: opts,
        dataType: 'json',
        success: function (data) {
            diagnosisModelWrapper.empty();
            if (data.length > 0) {
                //todo 完成展示模板区域
            }
        }
    });


}


function createDiagnosisEditor(diagnosisWidget, opts) {
    var diagnosisEditorWrapper = diagnosisWidget.find('.editor-wrapper'),
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
    if ('350' === diagnosisType) {
        diagnosisWidget.find('.display-field').before('<div class="addDiagnosisBox"><input type="button" class="addDiagnosis" value="添加修正诊断区域"/></div>');
        diagnosisWidget.find('.addDiagnosisBox input[type="button"].addDiagnosis').unbind('click').bind('click', function () {
            /*   var newDianosis = diagnosisWidget.clone();
             diagnosisWidget.parent('td').append(newDianosis);*/
            //todo 创建新修正控件的方法
        })
    }


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
                queryDiagnosis(diagnosisWidget, opts, 'edit');
            }
        });
    });


    /*添加自诊断*/
    diagnosisEditorWrapper.find('.add-sub').unbind('click').bind('click', function () {
        var selected = $('li.selected');
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
                    queryDiagnosis(diagnosisWidget, opts, 'edit');
                }
            });
        }
        else {
            alert('请选择一条主诊断！');
        }
    });
    diagnosisEditorWrapper.find('.del').unbind('click').bind('click', function () {
        var selected = diagnosisWidget.find('li.selected');
        if (selected && selected.length > 0) {
            var id = selected.attr('id');
            $.ajax({
                url: 'form/plugin.process?action=drop&handler=diagnosis',
                data: {id: id},
                dataType: 'json',
                success: function (data) {
                    queryDiagnosis(diagnosisWidget, opts, 'edit');
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
