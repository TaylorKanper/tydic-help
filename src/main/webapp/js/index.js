/**
 * Created by xiaocai on 2016/11/14.
 */
$(function(){
    tools.clickOtherNone();
    makeTree.makeT();
    makeTree.makeTreeOther();
    makeDom.editBox();
    makeDom.signEdit();
    makeDom.webpreview();
    makeDom.inEdit();
})
var tools = {
    clickOtherNone:function(){
        $("#wrap").click(function(e){
            $("#wrap").show();
            var ev = e || window.event;
            if(ev.stopPropagation){
                ev.stopPropagation();
            } else if(window.event){
                window.event.cancelBubble = true;//兼容IE
            }
        })
        document.onclick = function(){
            $("#wrap").hide();
        }
        $("#wrap").click(function(e){
            var ev = e || window.event;
            if(ev.stopPropagation){
                ev.stopPropagation();
            }
            else if(window.event){
                window.event.cancelBubble = true;//兼容IE
            }
        })
    },
    setPreviewCount:function(eventObj,dom){
        var content = eventObj.parseContent();
        if (content === '') dom.show();
        else dom.show().find('#comment-md-preview').html(content).find('table').addClass('table table-bordered table-striped table-hover');
    },
    ajaxGetCount:[{id:123,count:"这里的内容是模拟的从后面获取得到的"}],
};
var makeTree = {
    makeT:function(){
        var setting = {
            view: {
                addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom,
                selectedMulti: false
            },
            edit: {
                enable: true,
                editNameSelectAll: true,
                showRemoveBtn: true,
                showRenameBtn: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                beforeDrag: beforeDrag,
                beforeEditName: beforeEditName,
                beforeRemove: beforeRemove,
                beforeRename: beforeRename,
                onRemove: onRemove,
                onRename: onRename,
                onClick:function(event, treeId, treeNode){
                    $.each($("#main .template:not(:first)"),function(i,n){
                        if($(n).attr("data-id") == treeNode.id){
                            $(n).show();
                        }else{
                            $(n).hide();
                        }
                    })
                }
            }
        };
        var log, className = "dark";
        function beforeDrag(treeId, treeNodes) {
            return true;
        }
        function beforeEditName(treeId, treeNode) {
            className = (className === "dark" ? "":"dark");
            showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.selectNode(treeNode);
            setTimeout(function() {
                if (confirm("您确定要对 '" + treeNode.name + "'节点进行修改吗?")) {
                    setTimeout(function() {
                        zTree.editName(treeNode);
                        $("#edit").show();
                    }, 0);

                }
            }, 0);
            return false;
        }
        function beforeRemove(treeId, treeNode) {
            className = (className === "dark" ? "":"dark");
            showLog("[ "+getTime()+" beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.selectNode(treeNode);
            var removeBool = confirm("您确定要删除 '" + treeNode.name + "'节点吗?");
            if(removeBool){
                $.each($("#main .template:not(:first)"),function(i,n){
                    if($(n).attr("data-id") == treeNode.id){
                        $(n).detach();
                    }
                })
            }
            return removeBool;
        }
        function onRemove(e, treeId, treeNode) {
            showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
        }
        function beforeRename(treeId, treeNode, newName, isCancel) {
            className = (className === "dark" ? "":"dark");
            showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
            if (newName.length == 0) {
                setTimeout(function() {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    zTree.cancelEditName();
                    alert("Node name can not be empty.");
                }, 0);
                return false;
            }
            return true;
        }
        function onRename(e, treeId, treeNode, isCancel) {
            showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
        }
        /*function showRemoveBtn(treeId, treeNode) {
            return !treeNode.isFirstNode;
        }*/
        /*function showRenameBtn(treeId, treeNode) {
            console.log(treeNode)
            return !treeNode.isLastNode;
        }*/
        function showLog(str) {
            if (!log) log = $("#log");
            log.append("<li class='"+className+"'>"+str+"</li>");
            if(log.children("li").length > 8) {
                log.get(0).removeChild(log.children("li")[0]);
            }
        }
        function getTime() {
            var now= new Date(),
                h=now.getHours(),
                m=now.getMinutes(),
                s=now.getSeconds(),
                ms=now.getMilliseconds();
            return (h+":"+m+":"+s+ " " +ms);
        }
        var newCount = 1;
        function addHoverDom(treeId, treeNode) {
            var sObj = $("#" + treeNode.tId + "_span");
            if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
            var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                + "' title='add node' onfocus='this.blur();'></span>";
            sObj.after(addStr);
            var btn = $("#addBtn_"+treeNode.tId);
            if (btn) btn.bind("click", function(){
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                var appendDom = $("#main .template:first").clone(true);
                appendDom.attr("data-id",(100 + newCount));
                appendDom.text("new node" + (newCount));
                appendDom.show().siblings().hide();
                $("#main").append(appendDom);
                zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
                return false;
            });
        };
        function removeHoverDom(treeId, treeNode) {
            $("#addBtn_"+treeNode.tId).unbind().remove();
        };
        function selectAll() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
        };
    var zNodes =[//ztree的数据格式
        { id:1, pId:0, name:"概述", open:true},
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
        { id:3, pId:0, name:"结语", isParent:true}
    ];
    var treeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    var allNodes = zNodes;
        for(var i=0,len=allNodes.length;i<len;i++){
                makeDom.produceDom(allNodes[i].id,allNodes[i].name)
        }
},
    makeTreeOther:function(){
        $("#wrap li").on("click",function(){//点击隐藏操作器
            $("#wrap").hide();
        });
    }
};
var makeDom = {
        produceDom:function(id,count){
           var dom =  $("#main .template:first").clone(true);
            $(dom).html(count)
            $(dom).attr("data-id",id)
            $(dom).hide();
            $("#main").append(dom)
        },
        editBox:function(){
            var $previewContainer = $('#comment-md-preview-container');
            $previewContainer.hide();
            var $md = $("#comment-md").markdown({
                autofocus: false,
                height: 510,
                width:600,
                iconlibrary: 'fa',
                onShow: function(e) {
                    var addConunt = "#后面加入的内容测试初始化"//在这里把请求来的数据 格式化为html
                    e.change(e);
                    //string content
                    e.setContent(addConunt)
                   // $("#main .template").eq(0).html(e.parseContent());//初始化在页面的格式
                    tools.setPreviewCount(e,$previewContainer)
                },
                onPreview: function(e) {//预览时
                  //  console.log(e.$textarea[0].disabled)
                    $("#edit").hide();
                    $("#inedit").show();
                    $("#main .template").eq(0).html(e.parseContent());
                },
                onChange: function(e) {
                    tools.setPreviewCount(e,$previewContainer)
                },
                footer: function(e) {
                    return '\
					<span class="text-muted">\
						<span data-md-footer-message="err">\
						</span>\
						<span data-md-footer-message="default">\
							通过拖拽图片到当前窗口或者 \
							<a class="btn-input">\
								从电脑中选取\
								<input type="file" multiple="" id="comment-images" />\
							</a>\
						</span>\
						<span data-md-footer-message="loading">\
							正在上传你的文件...\
						</span>\
					</span>';
                }
            });
            var $mdEditor = $('.md-editor'),msgs = {};
            $mdEditor.find('[data-md-footer-message]').each(function() {
                msgs[$(this).data('md-footer-message')] = $(this).hide();
            });
            msgs.default.show();
            $mdEditor.filedrop({
                binded_input: $('#comment-images'),
                url: "/markdown/file/static-uploads.do",
                fallbackClick: false,
                beforeSend: function(file, i, done) {
                    msgs.default.hide();
                    msgs.err.hide();
                    msgs.loading.show();
                    done();
                },
                maxfilesize: 15,
                error: function(err, file) {
                    switch (err) {
                        case 'BrowserNotSupported':alert('browser does not support HTML5 drag and drop')
                            break;
                        case 'FileExtensionNotAllowed':break;
                        default:break;
                    }
                    var filename = typeof file !== 'undefined' ? file.name : '';
                    msgs.loading.hide();
                    msgs.err.show().html('<span class="text-danger"><i class="fa fa-times"></i> 错误 上传 ' + filename + ' - ' + err + '</span>');
                },
                dragOver: function() {
                    $(this).addClass('active');
                },
                dragLeave: function() {
                    $(this).removeClass('active');
                },
                progressUpdated: function(i, file, progress) {
                    msgs.loading.html('<i class="fa fa-refresh fa-spin"></i> 上传 <span class="text-info">' + file.name + '</span>... ' + progress + '%');
                },
                afterAll: function() {
                    msgs.default.show();
                    msgs.loading.hide();
                    msgs.err.hide();
                },
                uploadFinished: function(i, file, response, time) {
                    $md.val($md.val() + "![" + file.name + "](http://127.0.0.1:8080/markdown/img/"+file.name+")\n").trigger('change');
                }
            });
        },
        signEdit:function(event){
            $("#edit .drop-out").on("click",function(){
                $("#edit").hide();
                return false;
            })
        },
        webpreview:function(){
            $(".webpreview").on("click",function(){
               $("#edit").hide();
               $("#inedit").show();
                return false;
            })
        },
        inEdit:function(){
          $("#inedit").on("click",function(){
              $("#edit").show();
              $("#inedit").hide();
              return false;
          })
        }
}