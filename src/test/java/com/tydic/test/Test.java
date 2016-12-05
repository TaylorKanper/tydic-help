package com.tydic.test;

import java.sql.Date;
import java.util.List;

import javax.annotation.Resource;

import com.tydic.bean.NodeBean;
import com.tydic.service.INodeService;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.tydic.common.Response;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:applicationContext-base.xml" })
public class Test {
	@Resource
	private INodeService nodeService;

	@org.junit.Test
	public void test() {
		try {
//			insertNode();
			delNode(2);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private void insertNode(){
		NodeBean bean = new NodeBean();
		bean.setContext("##hello");
		bean.setEffective(1);
		bean.setFatherId(1);
		bean.setInsertTime(new Date(System.currentTimeMillis()));
		bean.setUserId(1);
		bean.setUserName("admin");
		Response<Boolean> res = nodeService.insertNode(bean);
		System.out.print(res);
	}
	private void delNode(int id){
		nodeService.delNode(id);
	}
}
