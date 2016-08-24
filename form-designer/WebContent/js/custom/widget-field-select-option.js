/**
 * 下拉框选择dict别名
 */
function createOptionFieldWidget() {
	$("#waringDetailDiv").show();
	$.ajax({
		url : 'loadProjectList.do',
		type : 'post',
		dataType : 'JSON',
		cache : true,
		async : false,
		success : function(data) {
		    var showDiv = "";
			for(var i=0;i < data.length;i++){
				showDiv += "<li class='TemplIdNames'>"+
					"<span class='lab_list' title='"+data[i].PROJECT_CODE+"'>"+
                "<input name='TemplId' value='"+data[i].PROJECT_CODE+"' class='radios' type='radio'>"+
                ""+data[i].PROJECT_CODE+"("+data[i].PROJECT_CATALOG2+"->"+data[i].PROJECT_NAME+")"+
              "</span>"+
              "</li>";
			}
			if(data.length>0){
				$("#showDetailDiv").html("别称：&nbsp;<input type='text' id='filterTemplId'"+
						"class='put_text' style='width:120px;'  onkeyup='filterTemplId();'/>") ;
						//"<input class='tabSub tabSub_5' onkeydown='filterTemplId();' type='button' value='搜索' />");
				$(".txtBox").html(showDiv);
			}
		},
		error : function() {
			alert('请求失败');
		}
	});
}
/**
 * 关闭窗口
 */
function closeWaringDetailDiv(){
	$("#waringDetailDiv").hide();
}
/**
 * 模糊查询
 */
function filterTemplId(){
    var filterInfo = $("#filterTemplId").val();
   /* if($.trim(filterInfo)==""){
  	  alert("请输入查询关键字");
  	  return;
    }*/
    if (filterInfo == ''){ // 显示所有
    	$(".TemplIdNames span").show();
    }else{ // 过滤
    	filterInfo=filterInfo.toUpperCase();
    	$(".TemplIdNames span[title*='"+filterInfo +"']").show();
    	$(".TemplIdNames span:not([title*='"+filterInfo +"'])").hide();
    }
}
/**
 * 为过滤参数赋值
 */
function setFilterVal(){
	var setVal=$("input[name='TemplId']:checked").val();
	if(setVal==""||setVal==null)
	{
		alert("请选择一个选项后再执行操作！");
		return;
	}
	var propPanel = $('.properties');
	var filterTypeField = propPanel.find('input[name=filter]');
	filterTypeField.val(setVal);
	$("#waringDetailDiv").hide();
}