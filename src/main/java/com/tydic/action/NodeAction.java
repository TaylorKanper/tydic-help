package com.tydic.action;

import com.tydic.bean.NodeBean;
import com.tydic.common.ActionResult;
import com.tydic.common.Response;
import com.tydic.service.INodeService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by hp on 2016/12/1.
 * 节点控制器
 */
@Controller
@RequestMapping("/node")
public class NodeAction {
    @Resource
    private INodeService nodeService;

    /**
     * 获取所有节点信息
     *
     * @return 所有节点信息
     */
    @RequestMapping("findAllNodes")
    public ActionResult findAllNodes() {
        Response<List<NodeBean>> response = nodeService.findAllNodes();
        if (response.isOk()) {
            return ActionResult.success("成功", response.getResult());
        } else {
            return ActionResult.fail("获取所有节点数据失败");
        }

    }

    /**
     * 提供id获取该叶子节点信息
     *
     * @param id 叶子节点的id
     * @return 叶子节点的信息
     */
    @RequestMapping("findNode")
    public ActionResult findNode(int id) {
        Response<NodeBean> response = nodeService.findNodes(id);
        if (response.isOk()) {
            return ActionResult.success("成功", response.getResult());
        }
        return ActionResult.fail("查询失败");
    }

    /**
     * 通过id修改叶子节点信息
     *
     * @param bean 叶子节点实体
     * @return 是否修改成功
     */
    @RequestMapping("updateNode")
    public ActionResult updateNode(NodeBean bean) {
        Response<Boolean> response = nodeService.updateNode(bean);
        if (response.isOk()) {
            return ActionResult.success("修改成功");
        } else {
            return ActionResult.fail("修改失败");
        }
    }

    /**
     * 添加子节点
     *
     * @param bean 叶子节点实体
     * @return 是否添加成功
     */
    @RequestMapping("addNode")
    public ActionResult addNode(NodeBean bean) {
        Response<Boolean> response = nodeService.insertNode(bean);
        if (response.isOk()) {
            return ActionResult.success("添加成功");
        } else {
            return ActionResult.fail("添加失败");
        }
    }

    /**
     * 删除某个叶子节点
     * @param id 该叶子节点的id
     * @return 是否删除成功
     */
    @RequestMapping("delNode")
    public ActionResult delNode(int id){
        Response<Boolean> response = nodeService.delNode(id);
        if (response.isOk()) {
            return ActionResult.success("删除成功");
        } else {
            return ActionResult.fail("删除失败");
        }
    }
}
