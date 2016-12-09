/**
 * Created by xiaocai on 2016/11/14.
 */
var ROOT = "http://localhost:8080/markdown/";
$(function(){
    makeTree.makeT();
    makeTree.makeTreeOther();
    tools.modifyNodeName();
    makeDom.editBox();

})
var tools = {
    setPreviewCount:function(eventObj,dom){
        var content = eventObj.parseContent();
        if (content === '') dom.show();
        else dom.show().find('#comment-md-preview').html(content).find('table').addClass('table table-bordered table-striped table-hover');
    },
    ajaxGetCount:function(serverData){
        if(serverData) {
            for (var k = 0, lenk = serverData.data.length; k < lenk; k++) {
                $.each($("#main .template:not(:first)"), function (kd, n) {
                    if ($(n).attr("data-id") == serverData.data[k].id) {
                        $(n).html(serverData.data[k].context)
                    }
                })
            }
        }
    },
    markDownEObj:null,
    treeModify:{},
    treeAdd:{},
    addOrModify:"modify",
    treeNodeCount:[],
    preNode:"",
    fatherOneContent:"",
    modifyNodeName:function(){
        $("#edit .title").focusout(function(){
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = treeObj.transformToArray(treeObj.getNodes());
            $.each(nodes,function(i,n){
                if(n.id ==(tools.treeModify.id||tools.treeAdd.id)){
                    n.name = $("#edit .title").val();
                    treeObj.updateNode(n);
                }
            })
        })
    },
    findNodeCount:function(id,treeNode){
        $("#treeDemo").block({message:"正在加载，请稍后......."});
        $("#main").block({message:"正在加载，请稍后......."});
        $.ajax({
            url:ROOT+"node/findNodesByFather.do",
            data:{fid:id},
            method:"post",
            success:function(data){
                data = data?data:0;
                for(var a = 0;a<data.data.length;a++){
                    var treeNodeCountObj = {};
                    treeNodeCountObj.id = data.data[a].id;
                    treeNodeCountObj.count = data.data[a].context;
                    tools.treeNodeCount.push(treeNodeCountObj);
                    if(tools.markDownEObj){
                        tools.ajaxGetCount(data)
                    }
                }

                if(treeNode?treeNode.isParent:false){
                    treeNode.icon = "";
                }
                var displayDomId =0;
                var treeOnClickObj = $.fn.zTree.getZTreeObj("treeDemo");
                var isChildren = treeNode?treeNode:false;
                if(isChildren?treeNode.children:false){
                    var treeArr = treeOnClickObj.getNodesByParamFuzzy("tId","treeDemo",treeNode);
                    var getFirstNodeArray = [];
                    for(var i=0,len=treeArr.length;i<len;i++){
                        if(!treeArr[i].isParent && treeArr[i].isFirstNode){
                            getFirstNodeArray.push(treeArr[i])
                        }
                    }
                    displayDomId = getFirstNodeArray[0].id;//返回的id
                }else{
                    var searchNodeParent = treeOnClickObj.getNodeByTId("treeDemo_1");
                    var treeArr = treeOnClickObj.getNodesByParamFuzzy("tId","treeDemo",searchNodeParent);
                    var getFirstNodeArray = [];
                    for(var i=0,len=treeArr.length;i<len;i++){
                        if(!treeArr[i].isParent && treeArr[i].isFirstNode){
                            getFirstNodeArray.push(treeArr[i])
                        }
                    }
                    displayDomId = getFirstNodeArray[0].id;//返回的id
                }
                $.each($("#main .template:not(:first)"),function(i,n){
                    if($(n).attr("data-id") == displayDomId){
                        $(n).show();
                    }else{
                        $(n).hide();
                    }
                });
                $("#treeDemo").unblock();
                $("#main").unblock();
            }
        })
    }
};
var makeTree = {
    makeT:function(){
        var setting = {
            view: {
                selectedMulti: false
            },
            edit: {

            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick:function(e,treeId, treeNode){
                    var displayDomId = 0;
                    if(!treeNode.isParent){
                        tools.preNode = treeNode.id;
                        displayDomId = treeNode.id;
                    }else{
                        displayDomId = tools.preNode;
                    }
                    $("#main").css({"border":"0"})

                    // var treeOnClickObj = $.fn.zTree.getZTreeObj("treeDemo");
                    /* if(treeNode.children){
                     var treeArr = treeOnClickObj.getNodesByParamFuzzy("tId","treeDemo",treeNode);
                     var getFirstNodeArray = [];
                     for(var i=0,len=treeArr.length;i<len;i++){
                     if(!treeArr[i].isParent && treeArr[i].isFirstNode){
                     getFirstNodeArray.push(treeArr[i])
                     }
                     }
                     displayDomId = getFirstNodeArray[0].id;//返回的id
                     }*/
                    $.each($("#main .template:not(:first)"),function(i,n){
                        if($(n).attr("data-id") == displayDomId){
                            $(n).show();
                        }else{
                            $(n).hide();
                        }
                    });
                    if(!treeNode.children && treeNode.pId === null){
                        $.ajax({
                            url:ROOT+"node/findNode.do",
                            data:{id:treeNode.id},
                            method:"post",
                            success:function(data){
                                $.each($("#main .template:not(:first)"),function(i,n){
                                    if($(n).attr("data-id") == data.data.id){
                                        var treeNodeCountObj = {};
                                        treeNodeCountObj.id = data.data.id;
                                        treeNodeCountObj.count = data.data.context;
                                        tools.treeNodeCount.push(treeNodeCountObj);
                                        $(n).html(data.data.context);
                                        $(n).show();
                                    }else{
                                        $(n).hide();
                                    }
                                })
                            }
                        })
                    }
                },
                beforeExpand:function(treeId, treeNode){
                    $("#main").css({"border":"0"})

                    if(treeNode.children){
                        var currentTree = treeNode.children;
                        for(var i=0,len=currentTree.length;i<len;i++){
                            if(!currentTree[i].isParent){
                                treeNode.icon = "../img/loading.gif";
                                tools.findNodeCount(treeNode.id,treeNode)
                                /* $.ajax({
                                 url:"http://localhost:8080/markdown/node/findNodesByFather.do",
                                 data:{fid:treeNode.id},
                                 method:"post",
                                 success:function(data){
                                 console.log(data)
                                 // makeDom.editBox(data);
                                 for(var a = 0;a<data.data.length;a++){
                                 var treeNodeCountObj = {};
                                 treeNodeCountObj.id = data.data[a].id;
                                 treeNodeCountObj.count = data.data[a].context;
                                 tools.treeNodeCount.push(treeNodeCountObj);
                                 if(tools.markDownEObj){
                                 tools.ajaxGetCount(data)
                                 }
                                 }
                                 treeNode.icon = "";
                                 var displayDomId = treeNode.id;
                                 var treeOnClickObj = $.fn.zTree.getZTreeObj("treeDemo");
                                 if(treeNode.children){
                                 var treeArr = treeOnClickObj.getNodesByParamFuzzy("tId","treeDemo",treeNode);
                                 var getFirstNodeArray = [];
                                 for(var i=0,len=treeArr.length;i<len;i++){
                                 if(!treeArr[i].isParent && treeArr[i].isFirstNode){
                                 getFirstNodeArray.push(treeArr[i])
                                 }
                                 }
                                 displayDomId = getFirstNodeArray[0].id;//返回的id
                                 }

                                 $.each($("#main .template:not(:first)"),function(i,n){
                                 if($(n).attr("data-id") == displayDomId){
                                 $(n).show();
                                 }else{
                                 $(n).hide();
                                 }
                                 });
                                 }
                                 })*/
                                break;
                            }else{
                                break;
                            }
                        }
                    }
                }
            }
        };

        var zNodes =[//ztree的数据格式
            /*{ id:1, pId:0, name:"概述", open:true},
             { id:111, pId:1, name:"封面"},
             { id:112, pId:1, name:"目录"},
             { id:113, pId:1, name:"修改记录"},
             { id:114, pId:1, name:"述点1"},
             { id:115, pId:1, name:"述点2"},
             { id:116, pId:1, name:"述点3"},
             { id:117, pId:1, name:"述点4"},
             { id:118, pId:1, name:"述点5"},
             { id:119, pId:1, name:"述点6"},
             { id:121, pId:1, name:"述点7"},
             { id:122, pId:1, name:"述点8"},
             { id:123, pId:1, name:"述点9"},
             { id:124, pId:1, name:"述点10"},
             { id:125, pId:1, name:"述点11"},
             { id:2, pId:0, name:"详解"},
             { id:21, pId:2, name:"详细内容1", open:true},
             { id:211, pId:21, name:"具体内容1"},
             { id:212, pId:21, name:"具体内容2"},
             { id:213, pId:21, name:"具体内容3"},
             { id:214, pId:21, name:"具体内容4"},
             { id:22, pId:2, name:"详细内容2"},
             { id:221, pId:22, name:"具体内容1"},
             { id:222, pId:22, name:"具体内容2"},
             { id:223, pId:22, name:"具体内容3"},
             { id:224, pId:22, name:"具体内容4"},
             { id:23, pId:2, name:"详细内容3"},
             { id:231, pId:23, name:"叶子节点231"},
             { id:232, pId:23, name:"叶子节点232"},
             { id:233, pId:23, name:"叶子节点233"},
             { id:234, pId:23, name:"叶子节点234"},
             { id:3, pId:0, name:"结语", isParent:true}*/
        ];
        $("#treeDemo").block({message:"正在加载，请稍后......."});
        $("#main").block({message:"正在加载，请稍后......."});
        $.ajax({
            url:ROOT+"node/findAllNodes.do",
            method:"post",
            success: function(data){
                var server = data.data?data.data:0;
                for(var i=0,len=server.length;i<len;i++){
                    var treeObj = {};
                    treeObj.id = server[i].id;
                    treeObj.pId = server[i].fatherId;
                    treeObj.name = server[i].nodeName;
                    makeDom.produceDom(server[i].id)//带删除长度和idnex
                    zNodes.push(treeObj);
                }
                var treeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                tools.findNodeCount(1)
                $("#treeDemo").unblock();
                $("#main").unblock();
            }
        })
    },
    makeTreeOther:function(){
        $("#wrap li").on("click",function(){//点击隐藏操作器
            $("#wrap").hide();
        });
    }
};
var makeDom = {
    produceDom:function(id){
        var dom =  $("#main .template:first").clone(true);
        // $(dom).html(count)
        $(dom).attr("data-id",id)
        $(dom).hide();
        $("#main").append(dom)
    },
    editBox:function(){
        tools.markDownEObj = UE.getEditor('editor',{
            autoHeightEnabled:false,
            focus:true
        });
        // $("p").css("margin:",0);
        $("body").css("margin",0)
        $("#editor-test").on("click",function(){
            var content = tools.markDownEObj.getAllHtml()
            $.each($("#main .template:not(:first)"),function(i,n){
                if($(n).attr("data-id") == (tools.treeAdd.id || tools.treeModify.id)){
                    $(n).html(content);
                }
            })
        });
        $("#edit .submitBtn").on("click",function(){
            var content = tools.markDownEObj.getAllHtml();
            var startIndex = content.indexOf("<body >");
            var subStr1 = content.substring(startIndex+7,content.length);
            var endIndex = subStr1.indexOf("</body>");
            var useContent = subStr1.substring(0,endIndex);
            console.log(useContent)
            if(tools.addOrModify === "modify"){
                var modifyUpLoad = {};
                modifyUpLoad.id = Number(tools.treeModify.id);
                modifyUpLoad.fatherId = Number(tools.treeModify.fatherId);
                modifyUpLoad.context = useContent;
                modifyUpLoad.nodeName = $("#edit .title").val();
                modifyUpLoad.userId = 1111;
                modifyUpLoad.userName  = "admin";
                $.ajax({
                    url:ROOT+"node/updateNode.do",
                    data:modifyUpLoad,
                    method:"post",
                    success:function(data){
                        alert(data.msg)
                    },
                    error:function(data){
                        alert(data.msg)
                    }
                })
            }else if(tools.addOrModify === "add"){
                var addUpLoad = {};
                addUpLoad.id = Number(tools.treeAdd.id);
                addUpLoad.context = useContent;
                addUpLoad.nodeName = $("#edit .title").val();
                addUpLoad.userId = 1111;
                addUpLoad.userName  = "admin";
                var addZtreeObj = $.fn.zTree.getZTreeObj("treeDemo");
                var addFatherNode = addZtreeObj.getNodesByFilter(function(node){
                    return node.id == tools.treeAdd.id
                },true).getParentNode();
                addUpLoad.fatherId = Number(addFatherNode.id);
                addUpLoad.hasChild = tools.treeAdd.isParent;
                $.ajax({
                    url:ROOT+"node/addNode.do",
                    data:addUpLoad,
                    method:"post",
                    success:function(data){
                        alert(data.msg)
                    },
                    error:function(data){
                        alert(data.msg)
                    }
                })
            }
        });
        tools.markDownEObj.addListener( 'contentChange', function( editor ) {
            $("#edit .prevew").html(tools.markDownEObj.getAllHtml());
            $("p").css("margin:",0);
            $("body").css("margin",0);
            tools.markDownEObj.setHeight(419);
        } );
    }
}