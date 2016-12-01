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


}
