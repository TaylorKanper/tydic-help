package com.tydic.dao;

import com.tydic.bean.NodeBean;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by hp on 2016/11/30.
 */
public interface INodeDao {
    /**
     * 查找所有的结点，不包括名称
     *
     * @return
     */
    List<NodeBean> findAll();

    /**
     * 查找获取节点信息
     *
     * @param id       节点id
     * @return 节点信息
     */
    NodeBean findNode(int id);

    /**
     * 插入节点
     * @param bean 节点实体
     * @return 插入条数
     */
    int insertNode(NodeBean bean);

    /**
     * 修改叶子节点信息
     * @param bean 叶子节点实体
     * @return 影响数据库条数
     */
    int updateNode(NodeBean bean);

}
