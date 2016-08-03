package com.neusoft.hit.fe.ext.diagnosis;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 诊断模板对象
 * Created by Administrator on 2016/7/31 0031.
 */
public class DiagnosisModel implements Serializable {

    private static final long serialVersionUID = 1L;


    private String id;
    private String lr;
    private String icd_10;
    private String  pid;
    private Integer createId;
    private Date createTime;
    private Integer modifyId;
    private Date modifyTime;
    private List<DiagnosisModel> children;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLr() {
        return lr;
    }

    public void setLr(String lr) {
        this.lr = lr;
    }

    public String getIcd_10() {
        return icd_10;
    }

    public void setIcd_10(String icd_10) {
        this.icd_10 = icd_10;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public Integer getCreateId() {
        return createId;
    }

    public void setCreateId(Integer createId) {
        this.createId = createId;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Integer getModifyId() {
        return modifyId;
    }

    public void setModifyId(Integer modifyId) {
        this.modifyId = modifyId;
    }

    public Date getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }

    public List<DiagnosisModel> getChildren() {
        return children;
    }

    public void setChildren(List<DiagnosisModel> children) {
        this.children = children;
    }
}
