package com.tydic.service.impl;

import com.tydic.bean.NodeBean;
import com.tydic.common.Response;
import com.tydic.dao.INodeDao;
import com.tydic.service.INodeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.sql.Date;
import java.util.List;

/**
 * Created by hp on 2016/11/30.
 */
@Service
@Slf4j
public class NodeServiceImpl implements INodeService {
    @Resource
    private INodeDao nodeDao;

    @Override
    public Response<List<NodeBean>> findAllNodes() {
        try {
            return Response.ok(nodeDao.findAll());
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return Response.fail(e.getMessage());
        }

    }

    @Override
    public Response<NodeBean> findNode(int id) {

        try {
            return Response.ok(nodeDao.findNode(id));
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return Response.fail(e.getMessage());
        }
    }

    @Override
    public Response<Boolean> insertNode(NodeBean bean) {
        try {
            bean.setInsertTime(new Date(System.currentTimeMillis()));
            bean.setEffective(1);
            return nodeDao.insertNode(bean) >= 1 ? Response.ok(true) : Response.ok(false);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return Response.fail(e.getMessage());
        }
    }

    @Override
    public Response<Boolean> updateNode(NodeBean bean) {
        try {
            bean.setUpdateTime(new Date(System.currentTimeMillis()));
            return nodeDao.updateNode(bean) >= 1 ? Response.ok(true) : Response.ok(false);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return Response.fail(e.getMessage());
        }

    }

    @Override
    public Response<Boolean> delNode(int id) {
        try {
            NodeBean bean = nodeDao.findNode(id);
            boolean isDel = delNodes(bean);
            return isDel ? Response.ok(true) : Response.ok(false);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return Response.fail(e.getMessage());
        }
    }

    @Override
    public Response<List<NodeBean>> findNodesByFather(int fid) {
        try {
            List<NodeBean> list = nodeDao.findNodesByFather(fid);
            return list.size() > 0 ? Response.ok(list) : Response.fail(list, "该父节点没有子节点");
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return Response.fail(e.getMessage());
        }
    }

    /**
     * 递归删除父节点下的所有节点
     *
     * @param bean 节点实体
     * @return 是否删除节点
     */
    private boolean delNodes(NodeBean bean) {
        List<NodeBean> list = nodeDao.findNodesByFather(bean.getId());
        if (list.size() == 0) {
            bean.setUpdateTime(new Date(System.currentTimeMillis()));
            bean.setEffective(-1);
            nodeDao.updateNode(bean);
            return true;
        } else {
            for (NodeBean b : list) {
                delNodes(b);//递归删除每一个节点
                bean.setUpdateTime(new Date(System.currentTimeMillis()));
                bean.setEffective(-1);
                nodeDao.updateNode(bean);//删除该节点
            }
            return true;
        }
    }
}
