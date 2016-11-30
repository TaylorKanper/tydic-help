package com.tydic.service.impl;

import com.tydic.bean.NodeBean;
import com.tydic.common.Response;
import com.tydic.dao.INodeDao;
import com.tydic.service.INodeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
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
    public Response<NodeBean> findNodes(int id, int fatherId) {

        try {
            return Response.ok(nodeDao.findNode(id, fatherId));
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return Response.fail(e.getMessage());
        }
    }

    @Override
    public Response<Boolean> insertNode(NodeBean bean) {
        try {
            return nodeDao.insertNode(bean) >= 1 ? Response.ok(true) : Response.ok(false);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail(e.getMessage());
        }
    }
}
