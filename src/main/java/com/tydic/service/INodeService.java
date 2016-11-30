package com.tydic.service;

import com.tydic.bean.NodeBean;
import com.tydic.common.Response;

import java.util.List;

/**
 * Created by hp on 2016/11/30.
 * 节点接口
 */
public interface INodeService {
    /**
     * 获取所有节点信息，不包括节点内容
     *
     * @return 所有的节点信息
     */
    Response<List<NodeBean>> findAllNodes();

    /**
     * 根据节点id，和父节点id获取该节点的详细内容
     *
     * @param id       节点id
     * @param fatherId 父节点id
     * @return 该节点的详细内容
     */
    Response<NodeBean> findNodes(int id, int fatherId);

    /**
     * 向数据库插入节点
     *
     * @param bean 节点实体
     * @return 是否插入成功
     */
    Response<Boolean> insertNode(NodeBean bean);
}
