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
    public Response<NodeBean> findNodes(int id) {

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
            bean.setEffective(1);
            return nodeDao.insertNode(bean) >= 1 ? Response.ok(true) : Response.ok(false);
        } catch (Exception e) {
            e.printStackTrace();
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
            return Response.fail(e.getMessage());
        }

    }

    @Override
    public Response<Boolean> delNode(int id) {
        try {
            NodeBean bean = nodeDao.findNode(id);
            bean.setEffective(-1);
            bean.setUpdateTime(new Date(System.currentTimeMillis()));
            return nodeDao.updateNode(bean) >= 1 ? Response.ok(true) : Response.ok(false);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail(e.getMessage());
        }
    }
}
