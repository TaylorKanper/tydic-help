package com.tydic.bean;

import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class NodeBean implements Serializable {
    /**
     * 插入时间
     */
    private Date insertTime;
    /**
     * 更新时间
     */
    private Date updateTime;
    /**
     * 节点id
     */
    private int id;
    /**
     * 节点内容
     */
    private String context;
    /**
     * 父节点id
     */
    private int fatherId;
    /**
     * 节点名称
     */
    private String nodeName;
    /**
     * 用户id
     */
    private int userId;
    /**
     * 用户名称
     */
    private String userName;
    /**
     * 有效性
     */
    private int effective;
}
