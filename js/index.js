//designWidth:设计稿的实际宽度值，需要根据实际设置
//maxWidth:制作稿的最大宽度值，需要根据实际设置
(function(designWidth, maxWidth) {
    var doc = document,
    win = window,
    docEl = doc.documentElement,
    remStyle = document.createElement("style"),
    tid;

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        maxWidth = maxWidth || 540;
        width>maxWidth && (width=maxWidth);
        var rem = width * 100 / designWidth;
        remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
    }

    if (docEl.firstElementChild) {
        docEl.firstElementChild.appendChild(remStyle);
    } else {
        var wrap = doc.createElement("div");
        wrap.appendChild(remStyle);
        doc.write(wrap.innerHTML);
        wrap = null;
    }
    //要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
    refreshRem();

    win.addEventListener("resize", function() {
        clearTimeout(tid); //防止执行两次
        tid = setTimeout(refreshRem, 300);
    }, false);

    win.addEventListener("pageshow", function(e) {
        if (e.persisted) { // 浏览器后退的时候重新计算
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === "complete") {
        doc.body.style.fontSize = "16px";
    } else {
        doc.addEventListener("DOMContentLoaded", function(e) {
            doc.body.style.fontSize = "16px";
        }, false);
    }






    //吸顶条
    var stickyEl = document.querySelector('.jk-screen');
    function fixed(num) {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; 
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
        if(isAndroid) {
            window.onscroll = function(e) {
                var scrollT = document.documentElement.scrollTop;
                if (scrollT > num) {
                    $(stickyEl).addClass('fixed-top');
                }else {
                    $(stickyEl).removeClass('fixed-top');
                }
            };
        }else if(isiOS) {
            $(stickyEl).addClass('sticky');
        }
    }
    fixed(200);

})(750, 750);





/**
 * tag 选择组件
 * @param tagItem           tag匹配的数组，注数组顺序要与页面显示顺序一致
 * @param itemBoxId         tag标签外侧div的id  默认‘tag’
 * @param tagItemClassName  tag标签的class 默认‘tagItem’
 * @param returnTagDataId   tag标签需要set返回值的input的id 默认‘returnTagDataId’
 * @param selectClass       选中标签的高亮class 默认‘tagHover’
 * @param isRadio           是否是单选          默认false
 * @param radioDefault      选中标签的高亮class
 * @param rowData           用于首页二级
 */
function getSelectData(tagItem, itemBoxId, tagItemClassName, returnTagDataId, selectClass, isRadio, radioDefault, rowData) {
    if(!tagItem)   tagItem = [];
    if(!itemBoxId) itemBoxId = 'tag';
    if(!itemBoxId) itemBoxId = 'tagItem';
    if(!returnTagDataId) returnTagDataId = 'returnTagDataId';
    if(!selectClass) selectClass = 'tagHover';
    if(!isRadio) isRadio = false;
    if(!radioDefault) radioDefault = null;
    var returnData=[];
    var tagEle = $('#'+itemBoxId + ' .' + tagItemClassName);


    if(isRadio && radioDefault){
        //根据当前选中tag匹配默认值  设置默认值及默认选中class
        var s = tagItem.join(",").indexOf(radioDefault);
        $("#"+returnTagDataId).val(radioDefault);
        $(tagEle[s]).addClass(selectClass);
    }else{
        $("#"+returnTagDataId).val(tagItem[0]);
        $(tagEle[0]).addClass(selectClass);
    }

    //给每一个tag绑定点击事件
    for(var i = 0,m = tagEle.length; i < m;i++){
        $(tagEle[i]).click(function(){
            
            // 判断标签是否是单选
            if(isRadio){
                //获取当前点击tag的id
                var _thisI = $(this).attr('data-id');
                console.info('_thisI', _thisI)
                tagEle.each(function () {
                    $(this).removeClass(selectClass);
                })
                $(tagEle[_thisI]).addClass(selectClass);
                //设置当前选中的值
                $("#"+returnTagDataId).val($(tagEle[_thisI]).html());


                //首页筛选二级单独处理
                if(itemBoxId == 'row1'){
                    $('#row2').remove();
                    if(rowData && rowData[_thisI].child)
                    addRow(rowData[_thisI].child, 1, 2);
                }

            }else{
                //获取当前点击tag的id
                var _thisI = $(this).attr('data-id');
                console.info('_thisI', _thisI)
                $(tagEle[_thisI]).addClass(selectClass)
                //根据当前选中tag匹配是否已选
                var s = returnData.join(",").indexOf(tagItem[_thisI]);
                if(s>=0){
                    for(var r in returnData){
                        if( returnData[r] == tagItem[_thisI] ){
                            returnData.splice(r,1);
                            $(tagEle[_thisI]).removeClass(selectClass)
                        }
                    }
                } else{
                    returnData.push(tagItem[_thisI])
                }
                console.info('returnData' ,returnData);
                $("#"+returnTagDataId).val(returnData.join(" "));
            }

        })
    }
}




// 区域切换
function showTab(type){
    var tabItemEle = $('.showTabItem');
    tabItemEle.removeClass('shover');
    $('#screenType'). val($('#'+type).html());
    $('.addRow').remove();
    if(type == 'near'){
        // 默认附近
        var rentNear = ["不限","1000m内","2000m内","3000m内"];
        $(tabItemEle[0]).addClass('shover');
        addRow(rentNear, 1, 1);
    }else if(type == 'area'){
        $(tabItemEle[1]).addClass('shover');

        //请求区域数据
        $.get('../index.html', function (response) {
            response = [
                {name:"test1",child:['test1-1','test1-2','test1-3']},
                {name:"test2",child:['test2-1','test2-2','test2-3']},
                {name:"test3",child:['test3-1','test3-2','test3-3']}
            ];
            // 区域
            var areaData = response;
            console.info('areaData', areaData)
            //渲染区域dom及click事件
            addRow(areaData, 2, 1);
        })


    }else if(type == 'subWay'){
        $(tabItemEle[2]).addClass('shover');
        //请求区域数据
        $.get('../index.html', function (response) {
            response =  [
                {name:"全北京",child:['test1-1','test1-2','test1-4']},
                {name:"朝阳",child:['test2-1','test2-2','test2-5']},
                {name:"昌平",child:['test3-1','test3-2','test3-3']}
            ];
            // 地铁
            var subWayData = response;
            console.info('subWayData', subWayData)
            //渲染地铁dom及click事件
            addRow(subWayData, 2, 1);
        })
    }
}

function addRow(rowData, addNum,rowNum){
    var bg = 'screenBg';
    if(addNum != 1){
        bg = "screenBg1";
    }
    var jkScreenItem = '<div class="addRow jk-screen-cont jkFlexItem '+ bg+'" id="row'+rowNum+'">'+
                            '<ul class="jk-screen-ui">';
    var tagList = [];
    // 判断需要追加几行
    if(addNum == 1){
        for(var i=0; i<rowData.length; i++){
            jkScreenItem += '<li class="tagItem" data-id="'+i+'">'+rowData[i]+'</li>';
        }
    }else{
        for(var i=0; i<rowData.length; i++){
            tagList.push(rowData[i].name);
            jkScreenItem += '<li class="tagItem" data-id="'+i+'">'+rowData[i].name+'</li>';
        }
    }
    
    console.info('tagList', tagList);
    jkScreenItem +='</ul>'+
                    '<input type="hidden" name="row'+rowNum+'Val" id="row'+rowNum+'Val" />'+
                    '</div>';
    $('#jkScreenArea').append(jkScreenItem);

    
    if(addNum == 1){
        getSelectData(rowData, 'row'+rowNum, 'tagItem', 'row'+rowNum+'Val','shover', true);
    }else if(addNum==2 ){

        getSelectData(tagList, 'row'+rowNum, 'tagItem', 'row'+rowNum+'Val','shover', true, undefined, rowData);

        //根据当前选中tag匹配是否已选
        var val = $('#row'+rowNum+'Val').val();
        var s = tagList.join(",").indexOf(val);

        if(s >= 0 && rowData[s].child && rowData[s].child.length>0){
            addRow(rowData[s].child, 1, 2);
        }
    }
}

//个人信息页面显示“我想住”选择
function showScreenArea(){
    $('.jkScreen').show();

     //默认显示 附近
     showTab('near');
}

// 个人信息页面“我想住弹层”点击完成之后的回显
function getLikeplace(){
    $('.jkScreen').hide();
    console.info()
    var screenType = $('#screenType').val();
    if(screenType == '附近'){
        var likePlaceVal =  $('#row1Val').val();
        $('#likePlace').html(likePlaceVal);
    }else{
        var likePlaceVal =  $('#row1Val').val() + '/'+ $('#row2Val').val();
        $('#likePlace').html(likePlaceVal);
    }
}
