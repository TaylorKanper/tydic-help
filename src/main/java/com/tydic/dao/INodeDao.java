package com.tydic.dao;

import com.tydic.bean.NodeBean;
import com.tydic.common.Response;
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

    /**
     * 查询所有父节点下的所有子节点
     * @param fid 父节点id
     * @return 所有子节点
     */
    List<NodeBean> findNodesByFather(int fid);

    /**
     * @param fid 父id
     * @return 父id下最大的子id
     */
    int findParentNodeLastId(int fid);
}
