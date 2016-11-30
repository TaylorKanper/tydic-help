package com.tydic.bean;

import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class NodeBean implements Serializable{
    private Date insertTime;
    private Date updateTime;
    private int id;
    private String context;
    private int fatherId;
    private String nodeName;
    private int userId;
    private String userName;
}
