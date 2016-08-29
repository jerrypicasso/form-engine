--死亡病例讨论记录
DROP TABLE CLOUD_EMR_SWBLTLJL;
CREATE TABLE CLOUD_EMR_SWBLTLJL(
	GUID VARCHAR2(32) NOT NULL,
	BRBH VARCHAR2(32),--病人编号
	JZXH varchar2(32),-- 就诊序号
	SWRQ VARCHAR2(20),--死亡日期
	SWYY NVARCHAR2(64),--死亡原因
	TLRQ VARCHAR2(20),--讨论日期
	JLZ VARCHAR2(32),--记录者
	CJTLRY VARCHAR2(2000),--参加讨论人员
	FYJL CLOB,--发言记录
	ZCRSQ VARCHAR2(32),--主持人审签
	JLZQM VARCHAR2(32),--记录者签名
	CREATE_ID VARCHAR2(32), 
	CREATE_TIME VARCHAR2(20), 
	MODIFY_ID VARCHAR2(32), 
	MODIFY_TIME VARCHAR2(20), 
	DEL_FLAG CHAR(1) DEFAULT '0', 
	PRIMARY KEY (GUID)
);

--输血治疗知情同意书*
DROP TABLE CLOUD_EMR_SXZLZQTYS;
CREATE TABLE CLOUD_EMR_SXZLZQTYS(
	GUID VARCHAR2(32) NOT NULL,
	BRBH VARCHAR2(32),--病人编号
	JZXH varchar2(32),-- 就诊序号
	LCZD NVARCHAR2(2000),--临床诊断
	SXMD NVARCHAR2(200),--输血目的
	XUEXING CHAR(1),--血型
	SXX NVARCHAR2(200),--输血史
	SXQJC VARCHAR2(300),--输血前检查（多选）
	JC_ALT VARCHAR2(10),--检查alt值
	JC_KHCV VARCHAR2(10),--检查KHCV
	JC_HIV VARCHAR2(10),--检查HIV
	JC_HBSAG VARCHAR2(10),--HBSAG
	JC_HBSAB VARCHAR2(10),--检查HBSAB值
	JC_HBEAG VARCHAR2(10),--检查HBEAG值
	JC_HBEAB VARCHAR2(10),--检查alt值
	JC_HBCAB VARCHAR2(10),--检查HBEAB值
	JC_MEIDU VARCHAR2(10),--检查MEIDU值
	NSXFA CHAR(1),--输血方案
	SXCF VARCHAR2(32),--输血成分
	QT VARCHAR2(32),--其他
	QTSX NVARCHAR2(200),--其他注意事项
	HZQM VARCHAR2(64),--患者签名
	QMRQ VARCHAR2(20),--签名日期
	YHZGX VARCHAR(32),--与患者关系
	CREATE_ID VARCHAR2(32),
	CREATE_TIME VARCHAR2(20), 
	MODIFY_ID VARCHAR2(32), 
	MODIFY_TIME VARCHAR2(20), 
	DEL_FLAG CHAR(1) DEFAULT '0', 
	PRIMARY KEY (GUID)
);

--新生儿听力筛查知情同意书*
DROP TABLE CLOUD_EMR_XSETLSCZQTYS;
CREATE TABLE CLOUD_EMR_XSETLSCZQTYS(
	GUID VARCHAR2(32) NOT NULL,
	BRBH VARCHAR2(32),--病人编号
	JZXH varchar2(32),-- 就诊序号
	CSRQ VARCHAR2(20),--出生日期
	CSTZ VARCHAR2(10),--出生体重
	TAILIN VARCHAR2(10),--胎龄
	BSLJ CHAR(1),--表示理解（接受，不接受）
	QSQM NVARCHAR2(64),--亲属签名
	YS VARCHAR2(32),--医师签名
	YXSRGX NVARCHAR2(32),--与新生儿关系
	JSQMRQ VARCHAR2(20),--签名日期
	YSQMRQ VARCHAR2(20)，--医生签名日期
	CREATE_ID VARCHAR2(32),
	CREATE_TIME VARCHAR2(20), 
	MODIFY_ID VARCHAR2(32), 
	MODIFY_TIME VARCHAR2(20), 
	DEL_FLAG CHAR(1) DEFAULT '0', 
	PRIMARY KEY (GUID)
);

--死亡记录
DROP TABLE CLOUD_EMR_SWJL;
CREATE TABLE CLOUD_EMR_SWJL(
	GUID VARCHAR2(32) NOT NULL,
	BRBH VARCHAR2(32),--病人编号
	JZXH varchar2(32),-- 就诊序号
	SSRQ VARCHAR2(20),--手术日期
	SSMC NVARCHAR2(200),--手术名称
	SWRI VARCHAR(20),--死亡日期
	ZYTS VARCHAR(10),--住院天数
	RYSQK CLOB,--入院情况
	ZLJG CLOB,--诊疗经过
	SWYY NVARCHAR2(2000),--死亡原因
	XGPH VARCHAR2(32),--X光片号
	CTH VARCHAR2(32),--CT号
	MRIH VARCHAR2(32),--MRI号
	BLH VARCHAR2(32),--病理号
	YSQM VARCHAR2(32),--医师签名
	SJYSQM VARCHAR2(32),--上级医师签名
	CREATE_ID VARCHAR2(32),
	CREATE_TIME VARCHAR2(20), 
	MODIFY_ID VARCHAR2(32), 
	MODIFY_TIME VARCHAR2(20), 
	DEL_FLAG CHAR(1), 
	PRIMARY KEY (GUID)
);

--麻醉知情同意书*
DROP TABLE CLOUD_EMR_MZZQTYS;
CREATE TABLE CLOUD_EMR_MZZQTYS(
	GUID VARCHAR2(32) NOT NULL,
	BRBH VARCHAR2(32),--病人编号
	JZXH varchar2(32),-- 就诊序号
	SSYY NVARCHAR2(64),--手术原因
	NSSRQ VARCHAR2(10),--手术日期
	SSMC VARCHAR2(64),--手术名称
	MZFA CHAR(1),--麻醉方案
	MZFAQT NVARCHAR2(64),--其他麻醉方案
	ZTBSY CHAR(1),--镇痛泵使用否
	BFZ VARCHAR2(8),--并发症
	HZQM NVARCHAR2(64),--患者签名
	MZYS VARCHAR2(32),--麻醉医生
	YHZGX NVARCHAR2(32),--与患者关系
	QMRI VARCHAR2(10),--签名日期
	YSQMRQ VARCHAR2(10),--医生签名日期
	CREATE_ID VARCHAR2(32),
	CREATE_TIME VARCHAR2(20), 
	MODIFY_ID VARCHAR2(32), 
	MODIFY_TIME VARCHAR2(20), 
	DEL_FLAG CHAR(1) DEFAULT '0', 
	PRIMARY KEY (GUID)
);

--出院记录
DROP TABLE CLOUD_EMR_CYJL;
CREATE TABLE CLOUD_EMR_CYJL(
	GUID VARCHAR2(32) NOT NULL,
	BRBH VARCHAR2(32),--病人编号
	JZXH varchar2(32),-- 就诊序号
	SSMC NVARCHAR2(64),--手术名称
	CYRQ VARCHAR2(32),--出院日期
	RYSQK CLOB,--入院时情况
	ZLJG CLOB,--诊疗经过
	CYQK CLOB,--出院情况
	SKYH CLOB,--伤口愈合
	CYYZ CLOB,--出院医嘱
	XGPH VARCHAR2(32),--X光片号
	CTH VARCHAR2(32),--CT号
	MRIH VARCHAR2(32),--MRI号
	BLH VARCHAR2(32),--病理号
	QSR NVARCHAR2(64),--签收人
	ZZYS VARCHAR2(32),--主治医师
	YS VARCHAR2(32),--医师签名
	CREATE_ID VARCHAR2(32),
	CREATE_TIME VARCHAR2(20), 
	MODIFY_ID VARCHAR2(32), 
	MODIFY_TIME VARCHAR2(20), 
	DEL_FLAG CHAR(1) DEFAULT '0', 
	PRIMARY KEY (GUID)
);

--手术信息
DROP TABLE CLOUD_EMR_SSXX;
CREATE TABLE CLOUD_EMR_SSXX (
	GUID VARCHAR2(32) NOT NULL, 
	TREE_ID VARCHAR2(32), 
	BRBH VARCHAR2(32), 
	JZXH varchar2(32),-- 就诊序号
	SSRQ VARCHAR2(20), 
	SSJB VARCHAR2(4), 
	SSZ VARCHAR2(32), 
	ZS1 VARCHAR2(32), 
	ZS2 VARCHAR2(320), 
	QKDJ VARCHAR2(4), 
	YHDJ VARCHAR2(4), 
	MZFS VARCHAR2(32),
	MZYS VARCHAR2(32), 
	CREATE_ID VARCHAR2(32), 
	CREATE_TIME VARCHAR2(20), 
	MODIFY_ID VARCHAR2(32), 
	MODIFY_TIME VARCHAR2(20), 
	DEL_FLAG CHAR(1) DEFAULT '0', 
	PRIMARY KEY (GUID)
);

--手术信息——手术
DROP TABLE CLOUD_EMR_SSXX_SS;
CREATE TABLE CLOUD_EMR_SSXX_SS (
	GUID VARCHAR2(32) NOT NULL, 
	PARENT_ID VARCHAR2(32), 
	BRBH VARCHAR2(32),
	JZXH varchar2(32),-- 就诊序号
	SSBM VARCHAR2(32), 
	SSMC VARCHAR2(60), 
	SSRQ VARCHAR2(20), 
	SSJB VARCHAR2(4), 
	SSZ VARCHAR2(32), 
	ZS1 VARCHAR2(32), 
	ZS2 VARCHAR2(32), 
	QKDJ VARCHAR2(4), 
	YHDJ VARCHAR2(4), 
	MZFS VARCHAR2(4), 
	MZYS VARCHAR2(32), 
	SEQ NUMBER, 
	CREATE_ID VARCHAR2(32), 
	CREATE_TIME VARCHAR2(20), 
	MODIFY_ID VARCHAR2(32), 
	MODIFY_TIME VARCHAR2(20), 
	DEL_FLAG CHAR(1) DEFAULT '0',
	PRIMARY KEY (GUID)
);

--手术知情同意书主表
DROP TABLE CLOUD_EMR_SSZQTYS;
CREATE TABLE CLOUD_EMR_SSZQTYS (
	 GUID VARCHAR2(32) NOT NULL,
	 TREE_ID VARCHAR2(32),--书节点id
	 BRBH VARCHAR2(32),--病人编号
	 JZXH varchar2(32),-- 就诊序号
	 ZD  VARCHAR2(32),--诊断名称
	 MZFF VARCHAR2(32),--麻醉方法
	 SSMC VARCHAR2(200),--手术名称
	 SSMD VARCHAR2(32),--手术目的（多选id）
	 QTSSMD VARCHAR2(100),--其他手术目的
	 FXGZ VARCHAR2(32),--风险告知（多选id）
	 QM VARCHAR2(32),--签名
	 HZGX VARCHAR(32),--与患者关系
	 QTZLFF VARCHAR2(32),--其他治疗方法
	 JZYSQM VARCHAR2(64),--经治医师签名
	 SSYSQM VARCHAR2(64),--手术医师签名
	 CREATE_ID VARCHAR2(32), 
	 CREATE_TIME VARCHAR2(20), 
	 MODIFY_ID VARCHAR2(32), 
	 MODIFY_TIME VARCHAR2(20), 
	 DEL_FLAG CHAR(1) DEFAULT '0', 
	 PRIMARY KEY (GUID)
);

--手术知情同意书子表
DROP TABLE CLOUD_EMR_SSZQTYS_FXGZ;
CREATE TABLE CLOUD_EMR_SSZQTYS_FXGZ(
	GUID VARCHAR2(32) NOT NULL,
	PARENT_ID VARCHAR2(32),
	SEQ NUMBER(10),
	CONTENT VARCHAR2(200),
	CREATE_ID VARCHAR2(32), 
	CREATE_TIME VARCHAR2(20), 
	MODIFY_ID VARCHAR2(32), 
	MODIFY_TIME VARCHAR2(20), 
	DEL_FLAG CHAR(1) DEFAULT '0', 
	PRIMARY KEY (GUID)
);

--术前小结
DROP TABLE CLOUD_EMR_SQXJ;
CREATE TABLE CLOUD_EMR_SQXJ(
	GUID VARCHAR2(32) NOT NULL,
	TREE_ID VARCHAR2(32),--树节点id
	BRBH VARCHAR2(32),--病人编号
	JZXH varchar2(32),-- 就诊序号
	BSZY VARCHAR2(4000),--病史摘要
	ZDYJ VARCHAR2(4000),--诊断依据
	SSZZBQPG VARCHAR2(4000),--手术指征及病情评估
	NXSS VARCHAR2(32), --拟行手术
	SSLB CHAR(1), --手术类别
	NSSSSJ VARCHAR2(20),--拟行手术时间
	SSJB VARCHAR2(4), --手术级别
	NSSZ VARCHAR2(32),--拟手术者
	NXMZ VARCHAR2(32),--拟行麻醉
	HB VARCHAR2(32), --Hb
	XX VARCHAR2(32),--血型
	BLXQ CHAR(1),--有无保留血清
	NXMYSJ VARCHAR2(20), --凝血酶原时间
	HHBFNXHMSJ VARCHAR2(20),--活化部分凝血活酶时间
	XXB VARCHAR2(32),--血小板
	GGN VARCHAR2(32),--肝功能
	HBSAG VARCHAR2(32),--HBsAg
	BUN VARCHAR2(32),--BUN
	CR VARCHAR2(32),--Cr
	XT VARCHAR2(32),--血糖
	KPLUS VARCHAR2(32),--K+
	NAPLUS VARCHAR2(32),--Na+
	CLMINUS VARCHAR2(32),--CL-
	XDT VARCHAR2(100),--心电图
	QTSYSJC VARCHAR2(500),--其他实验室有关检查
	PLKYPS VARCHAR2(32),--普鲁卡因皮试
	WGFZ CHAR(1),--胃管放置
	DLGFZ CHAR(1),--导尿管放置
	SQYSX VARCHAR2(32),--术前已输血
	SZBX VARCHAR2(32),--术中备血
	QTSQZB VARCHAR2(500),--其他术前准备
	TSSSSQTL CHAR(1), --特殊、四、三级术前讨论（已，未）
	ZQTYSQD CHAR(1),--手术知情同意书是否签订
	SQCKHZQK CHAR(1),--术前查看患者状况
	ZYSX VARCHAR2(2000),--注意事项
	ZZYS VARCHAR2(32),--主治医师
	ZYZS VARCHAR2(32),--住院医师
	CREATE_ID VARCHAR2(32), 
	CREATE_TIME VARCHAR2(20), 
	MODIFY_ID VARCHAR2(32), 
	MODIFY_TIME VARCHAR2(20), 
	DEL_FLAG CHAR(1) DEFAULT '0', 
	PRIMARY KEY (GUID)
);

--刨宫产手术记录
DROP TABLE CLOUD_EMR_PGCSSJL;
CREATE TABLE CLOUD_EMR_PGCSSJL (
	GUID VARCHAR2(32) NOT NULL,
	TREE_ID VARCHAR2(32), --树节点id
	BRBH VARCHAR2(32),--病人编号
	JZXH varchar2(32),-- 就诊序号
	KSSJ VARCHAR2(20),--开始时间
	JSSJ VARCHAR2(20),--结束时间
	HS VARCHAR2(32),--护士
	HQK VARCHAR2(16),--横切口
	ZGX VARCHAR2(10),--子宫旋转方向
	ZGXD CHAR(1),--子宫下段（1形成良好，2部分形成，3未形成）
	YCSNG CHAR(1),--右侧输卵管（正常，异常）
	ZCSNG CHAR(1),--左侧输卵管 （正常，异常）
	PGFMS VARCHAR2(10),--膀胱覆膜上
	ZGMCCD VARCHAR2(10),--足够分娩出长度
	ZXQK VARCHAR2(10),--纵形切口
	XL CHAR(1),--先露（高浮，半入，固定）
	YSL VARCHAR2(10),--羊水量
	QING CHAR(1),--清：I II III
	TOU VARCHAR2(10), --头位
	TOU2 VARCHAR2(10),--头位2
	TTNY CHAR(1),--胎头难易（容易，困难）
	TUN VARCHAR2(10),--臀位
	TAIZU CHAR(1),--胎足（左，右）
	TWNY CHAR(1),--臀位难易（容易，困难）
	XB CHAR(1),--性别
	TIZHONG VARCHAR2(10),--体重
	APGAR1 VARCHAR2(10),--1分钟Apgar评分
	APGAR5 VARCHAR2(10),--5分钟Apgar评分
	JIXING CHAR(1),--是否畸形
	TAIPAN CHAR(1),--胎盘（人工，自然剥离）
	TPZL CHAR(1),--胎盘种类（希氏，邓氏）
	TPXZ CHAR(1),--胎盘形状（完整，不完整，特殊形态）
	QDRJ VARCHAR2(10),--脐带绕颈圈数
	QDRZ VARCHAR2(10),--脐带绕足圈数
	QDCD VARCHAR2(10),--脐带长度
	QDQT VARCHAR2(100),--脐带其他
	GONGTI VARCHAR2(10),--宫体
	JINGZHU VARCHAR2(10),--静注
	ADSC VARCHAR2(10),--氨丁三醇
	MSQLC VARCHAR2(10),--米索前列醇
	GSJQT VARCHAR2(100),--宫缩剂其他
	ZGQK CHAR(1),--子宫切口（有，无）
	ZGQKCD VARCHAR2(10),--子宫切口长度
	ZGJX CHAR(1),--子宫有无畸形
	ZGGL CHAR(1),--子宫有无肿瘤
	FHFS CHAR(1),--缝合方式
	LXFH VARCHAR2(10),--连续缝合线号
	LXFHXZ VARCHAR2(10),--连续缝合线种
	DYC VARCHAR2(10),--第一层缝合线号
	DYCXZ VARCHAR2(10),--第一层线种
	DERC VARCHAR2(10),--第二层缝合线号
	DERCXZ VARCHAR2(10),--第二层线种
	PGFMFH CHAR(1),--膀胱覆膜反褶缝合（有，无）
	XUEZHONG CHAR(1),--有无血肿
	ZXFF VARCHAR2(32),--止血处理方法
	JRFH CHAR(1),--有无肌肉缝合
	FZJQQ CHAR(1),--腹直肌前鞘（0连续，1间断）
	PXZFFH CHAR(1),--有无皮下脂肪缝合
	PIFUX VARCHAR2(10),--皮肤
	PFXZ VARCHAR2(10),--皮肤线种
	SZNL VARCHAR2(10),--术中尿量
	CHUXUE VARCHAR2(10),--出血
	SHUYE VARCHAR2(10),--输液
	SHUXUE VARCHAR2(10),--输血
	SZQTYCCL VARCHAR(1000),--术中其他异常情况处理
	CREATE_ID VARCHAR2(32), 
	CREATE_TIME VARCHAR2(20), 
	MODIFY_ID VARCHAR2(32), 
	MODIFY_TIME VARCHAR2(20), 
	DEL_FLAG CHAR(1) DEFAULT '0', 
	PRIMARY KEY (GUID)
);

--手术安全核查表
DROP TABLE CLOUD_EMR_SSAQHCB;
CREATE TABLE CLOUD_EMR_SSAQHCB (
	GUID VARCHAR2(32) NOT NULL,
	TREE_ID VARCHAR2(32), --树节点id
	BRBH VARCHAR2(32),--病人编号
	JZXH varchar2(32),-- 就诊序号
	MZQ_HZXX CHAR(1),--麻醉前患者信息正确
	MZQ_SSFS CHAR(1),--麻醉前手术方式
	MZQ_SSBW CHAR(1),--麻醉前手术部位
	MZQ_SSZQTY CHAR(1),--麻醉前手术知情同意
	MZQ_MZFS CHAR(1),--麻醉前麻醉方式确认
	MZQ_MZSBAQ CHAR(1),--麻醉前麻醉设备检查完成
	MZQ_PFWZ CHAR(1),--麻醉前皮肤是否完整
	MZQ_SYPFZB CHAR(1),--麻醉前术野皮肤准备
	MZQ_JMTD CHAR(1),--麻醉前静脉通道准备
	MZQ_HZGMS CHAR(1),--麻醉前患者过敏史
	MZQ_PSJG CHAR(1),--麻醉前皮试结果
	MZQ_SQBX CHAR(1),--麻醉前术前被血
	MZQ_SHUYE CHAR(1),--麻醉前输液
	MZQ_TNZRW CHAR(1),--麻醉前体内植入物
	MZQ_YXXZL CHAR(1),--麻醉前影像学资料
	MZQ_QT VARCHAR2(100),--麻醉前其他
	SSQ_HZXX CHAR(1),--手术开始前患者信息正确
	SSQ_SSFS CHAR(1),--手术开始前手术方式
	SSQ_SSBW CHAR(1),--手术开始前手术部位
	SSQ_YJSSSJ CHAR(1),--手术开始前预计手术时间
	SSQ_YJSXL CHAR(1),--手术开始前预计失血量
	SSQ_SSGZD CHAR(1),--手术开始前手术关注点
	SSQ_YSCHQT CHAR(1),--手术开始前医师陈述其他
	SSQ_MZGZD CHAR(1),--手术开始前麻醉关注点
	SSQ_MZYSCSQT CHAR(1),--手术开始前麻醉医师陈述其他
	SSQ_WPMJ CHAR(1),--手术开始前物品灭菌
	SSQ_YQSB CHAR(1),--手术开始前仪器设备
	SSQ_TSYY CHAR(1),--手术开始前特殊用药
	SSQ_HSCSQT CHAR(1),--手术开始前护士陈述其他
	SSQ_SFXYYXZL CHAR(1),--手术开始前是否需要影像资料
	SSQ_QT VARCHAR2(100),--手术开始前其他
	HZLKQ_HZXX CHAR(1),--患者离开前患者信息正确
	HZLKQ_SSFS CHAR(1),--患者离开前手术方式正确
	HZLKQ_SSYY CHAR(1),--患者离开前手术用药正确
	HZLKQ_SSYW CHAR(1),--患者离开前手术用物清点
	HZLKQ_SSBB CHAR(1),--患者离开前手术标本
	HZLKQ_PFWZ CHAR(1),--患者离开前皮肤完整
	HZLKQ_ZXJM CHAR(1),--患者离开前中心静脉通路
	HZLKQ_DMTL CHAR(1),--患者离开前动脉通路
	HZLKQ_QGCG CHAR(1),--患者离开前患气管插管
	HZLKQ_SKYL CHAR(1),--患者离开前伤口引流
	HZLKQ_WG CHAR(1),--患者离开前胃管
	HZLKQ_NG CHAR(1),--患者离开前尿管
	HZLKQ_GLQT CHAR(1),--患者离开前管路其他
	HZLKQ_HZQX CHAR(1),--患者离开前患者去向
	HZLKQ_QT VARCHAR2(100),--患者离开前其他
 	CREATE_ID VARCHAR2(32), 
	CREATE_TIME VARCHAR2(20), 
	MODIFY_ID VARCHAR2(32), 
	MODIFY_TIME VARCHAR2(20), 
	DEL_FLAG CHAR(1) DEFAULT '0', 
	PRIMARY KEY (GUID)
);

--刮宫手术记录
DROP TABLE CLOUD_EMR_GGSSJL;
CREATE TABLE CLOUD_EMR_GGSSJL(
	GUID VARCHAR2(32) NOT NULL,
	TREE_ID VARCHAR2(32), --树节点id
	BRBH VARCHAR2(32),--病人编号
	JZXH varchar2(32),-- 就诊序号
	ZGW CHAR(1),--检查子宫位（前，中，后）
	ZGDX CHAR(1),--检查子宫大小
	FUJIAN CHAR(1),--附件（正常，异常）
	SQGQSD VARCHAR(20),--术前宫腔深度
	SHGQSD VARCHAR(20),--术前宫腔深度
	HGSKZGJ1 VARCHAR2(20),--海格氏扩张宫颈1
	HGSKZGJ2 VARCHAR2(20),--海格氏扩张宫颈2
	XIGUAN CHAR(1),--吸管6.7.8
	XICHUWU VARCHAR(32),--吸出物
	CXL VARCHAR2(32),--出血量
	ZZBJ CHAR(1),--组织病检（送，未送）
	CCS VARCHAR2(10),--催产素
	MJXN VARCHAR2(10),--麦角新殓
	GYFF CHAR(1),--给药方法（宫颈，肌肉，静脉）
	GYSJ CHAR(1),--给药时间（术前，术中，术后）
	JYQHH VARCHAR2(16),--节育器环号
	LIUWEI CHAR(1),--留尾（有，无）
	MZND VARCHAR2(16),--麻醉浓度
	CHANGDU VARCHAR2(32),--麻醉长度
	SSSJNC VARCHAR2(64),--手术所见暖巢
	SSSJSNG VARCHAR2(64),--手术所见输卵管
	SSFF CHAR(1),--手术方法（行近端包埋法、繖端切除法、结扎切断法、）
	SSFFQT VARCHAR2(64),--手术方法其他
	SSGJ CHAR(1),--手术经过（顺利，易取，困难）
	CXL2 VARCHAR2(32),--出血量2
	ZZBJ2 CHAR(1),--组织病检2（2）
	SZTSQK VARCHAR2(256),--术中特殊情况
	CREATE_ID VARCHAR2(32), 
	CREATE_TIME VARCHAR2(20), 
	MODIFY_ID VARCHAR2(32), 
	MODIFY_TIME VARCHAR2(20), 
	DEL_FLAG CHAR(1) DEFAULT '0', 
	PRIMARY KEY (GUID)
);

--剖宫产手术同意书
DROP TABLE CLOUD_EMR_GGCSSTYS;
CREATE TABLE CLOUD_EMR_GGCSSTYS (
	GUID VARCHAR2(32) NOT NULL,
	TREE_ID VARCHAR2(32), --树节点id
	BRBH VARCHAR2(32),--病人编号
	JZXH varchar2(32),-- 就诊序号
	SSRI VARCHAR(20),--拟手术日期
	SSZZ VARCHAR(32),--手术指征
	HZDLRQZ VARCHAR2(43),--患者签字
	CREATE_ID VARCHAR2(32), 
	CREATE_TIME VARCHAR2(20), 
	MODIFY_ID VARCHAR2(32), 
	MODIFY_TIME VARCHAR2(20), 
	DEL_FLAG CHAR(1) DEFAULT '0', 
	PRIMARY KEY (GUID)
);



--24小时内入院死亡记录
DROP TABLE CLOUD_EMR_24XSNRYSWJL;
CREATE TABLE CLOUD_EMR_24XSNRYSWJL
(
	GUID varchar2(32) NOT NULL,-- 主键
	BRBH varchar2(32),--病人编号
	JZXH varchar2(32),-- 就诊序号
	-- 供史者
	GSZ varchar2(100),
	-- 记录日期
	JLRQ varchar2(10),
	-- 主诉
	ZS nvarchar2(40),
	-- 入院情况
	RYQK nvarchar2(2000),
	-- 诊疗经过
	ZLJG nvarchar2(2000),
	-- 死亡原因
	SWYY nvarchar2(2000),
	-- 医师签名
	YSBH varchar2(32),
	-- 主治医师
	ZZYS varchar2(32),
	CREATE_ID varchar2(32),
	CREATE_TIME varchar2(20),
	MODIFY_ID varchar2(32),
	MODIFY_TIME varchar2(20),
	DEL_FLAG char(1) DEFAULT '0',
	PRIMARY KEY (GUID)
);

--24小时内出入院记录
DROP TABLE CLOUD_EMR_24XSNCRYJL;
CREATE TABLE CLOUD_EMR_24XSNCRYJL
(
	-- 主键
	GUID varchar2(32) NOT NULL,
	BRBH varchar2(32),--病人编号
	-- 就诊序号
	JZXH varchar2(32),
	-- 供史者
	GSZ varchar2(100),
	-- 记录日期
	JLRQ varchar2(10),
	-- 主诉
	ZS nvarchar2(40),
	-- 入院情况
	RYQK nvarchar2(2000),
	-- 诊疗经过
	ZLJG nvarchar2(2000),
	-- 出院情况
	CYQK nvarchar2(2000),
	-- 出院医嘱
	CYZY nvarchar2(2000),
	-- MRI号
	MRIH nvarchar2(100),
	-- X光片号
	XGPH nvarchar2(100),
	-- CT号
	CTH nvarchar2(100),
	-- 病理号
	BLH nvarchar2(100),
	-- 主治医师
	ZZYS varchar2(32),
	-- 医师签名
	YSBH varchar2(32),
	CREATE_ID varchar2(32),
	CREATE_TIME varchar2(20),
	MODIFY_ID varchar2(32),
	MODIFY_TIME varchar2(20),
	DEL_FLAG char(1) DEFAULT '0',
	PRIMARY KEY (GUID)
);

--中医入院记录
DROP TABLE CLOUD_EMR_ZYRYJL;
CREATE TABLE CLOUD_EMR_ZYRYJL
(
	-- 主键
	GUID varchar2(32) NOT NULL,
	BRBH varchar2(32),--病人编号
	-- 就诊序号
	JZXH varchar2(32),
	-- 供史者
	GSZ varchar2(100),
	-- 记录日期
	JLRQ varchar2(10),
	-- 发病节气
	FBJQ varchar2(32),
	-- 主诉
	ZS nvarchar2(40),
	-- 现病史
	XBS nvarchar2(2000),
	-- 既往史
	JWS nvarchar2(2000),
	-- 家族史
	JZS nvarchar2(2000),
	-- 有无血吸虫疫水接触史
	XXCYSJCS char(1),
	-- 有无嗜烟
	SFSY char(1),
	-- 嗜烟量(天)
	SYL_T char(3),
	-- 有无嗜酒
	SFSJ char(1),
	-- 嗜酒量（两/天）
	SJL_LT char(4),
	-- 吸毒史
	SFXDS char(1),
	-- 有无冶游史
	YYS char(1),
	-- 望闻问切诊
	WWWQZ nvarchar2(2000),
	-- 专科检查
	-- 
	ZKJC nvarchar2(2000),
	-- 体温
	TW char(5),
	-- 脉搏
	MB char(3),
	-- 呼吸
	HX char(2),
	-- 舒张压 
	SZY char(3),
	-- 收缩压
	SSY char(3),
	-- 辅助检查
	FZJC nvarchar2(2000),
	-- 体格检查
	TGJC nvarchar2(2000),
	-- 婚育史
	HYS nvarchar2(2000),
	-- 月经史
	YJS nvarchar2(2000),
	-- CREATE_ID
	CREATE_ID varchar2(32),
	-- CREATE_TIME
	CREATE_TIME varchar2(20),
	-- MODIFY_ID
	MODIFY_ID varchar2(32),
	-- MODIFY_TIME
	MODIFY_TIME varchar2(20),
	DEL_FLAG char(1) DEFAULT '0',
	PRIMARY KEY (GUID)
);

--术前讨论记录
DROP TABLE CLOUD_EMR_SQTLJL;
CREATE TABLE CLOUD_EMR_SQTLJL
(
	-- 主键
	GUID varchar2(32) NOT NULL,
	BRBH varchar2(32),--病人编号
	-- 就诊序号
	JZXH varchar2(32),
	-- 讨论日期
	TLRQ varchar2(20),
	-- 主持人
	ZCR varchar2(32),
	-- 主持人职称
	ZCR_ZC varchar2(32),
	-- 姓名
	XM varchar2(32),
	-- 姓名职称
	XM_ZC varchar2(32),
	-- 汇报病史
	HBBS nvarchar2(2000),
	-- 护理人员发言
	HLRYFY clob,
	-- 主持人总结发言
	ZCRZJ clob,
	-- 主持人签名
	ZRCQM varchar2(32),
	-- 记录人签名
	JLRQM varchar2(32),
	CREATE_ID varchar2(32),
	CREATE_TIME varchar2(20),
	MODIFY_ID varchar2(32),
	MODIFY_TIME varchar2(20),
	DEL_FLAG char(1) DEFAULT '0',
	PRIMARY KEY (GUID)
);

--术前讨论记录发言
DROP TABLE CLOUD_EMR_SQTLJL_FY;
CREATE TABLE CLOUD_EMR_SQTLJL_FY
(
	-- 主键
	GUID varchar2(32) NOT NULL,
	-- 发言者姓名
	FYZXM varchar2(32),
	-- 发言者职称
	FYZZC varchar2(32),
	-- 发言内容
	FYZNR clob,
	-- 父表ID
	PARENT_ID varchar2(32) NOT NULL,
	CREATE_ID varchar2(32),
	CREATE_TIME varchar2(20),
	MODIFY_ID varchar2(32),
	MODIFY_TIME varchar2(20),
	DEL_FLAG char(1) DEFAULT '0',
	PRIMARY KEY (GUID)
);

--妇科入院记录
DROP TABLE CLOUD_EMR_FKRYJL;
CREATE TABLE CLOUD_EMR_FKRYJL
(
	-- 主键
	GUID varchar2(32) NOT NULL,
	BRBH varchar2(32),--病人编号
	-- 就诊序号
	JZXH varchar2(32),
	-- 供史者
	GSZ varchar2(100),
	-- 记录日期
	JLRQ varchar2(10),
	-- 主诉
	ZS nvarchar2(40),
	-- 现病史
	XBS nvarchar2(2000),
	-- 既往史
	JWS nvarchar2(2000),
	-- 有无血吸虫疫水接触史
	XXCYSJCS char(1),
	-- 有无嗜烟
	SFSY char(1),
	-- 嗜烟量(天)
	SYL_DAY char(3),
	-- 有无冶游史
	YYS char(1),
	-- 有无嗜酒
	SFSJ char(1),
	-- 嗜酒量（两/天）
	SJL char(4),
	-- 治游史
	SFZYS char(1),
	-- 吸毒史
	SFXDS char(1),
	-- 初潮年龄
	YJS_CHNL char(2),
	-- 月经
	YJS_YJ varchar2(64),
	-- 周期
	YJS_ZQ varchar2(16),
	-- 绝经年龄
	YJS_JZNL char(2),
	-- 月经量
	YJS_YJL char(1),
	-- 有无痛经
	YJS_YWTJ char(1),
	-- 末次月经
	YJS_MCYJ varchar2(16),
	-- 前次月经
	YJS_QCYJ varchar2(16),
	-- 白带量
	YJS_BDL char(1),
	-- 性状
	YJS_XZ char(1),
	-- 异味
	YJS_YW char(1),
	-- 结婚年龄
	HYS_JHNL char(2),
	-- 丈夫健康状况
	HYS_ZFJKZK varchar2(64),
	-- 再婚
	HYS_ZH char(1),
	-- 再婚年龄
	HYS_ZHNL char(3),
	-- 性生活情况
	HYS_XSHQK varchar2(64),
	-- 婚后未孕时间(年)
	HHWYSJ char(2),
	-- 流产
	FMS_LC char(1),
	-- 流产后未孕时间(年)
	LCHWYSJ char(2),
	-- 足月产
	ZYC char(2),
	-- 早产
	ZC char(3),
	-- 流产数
	LC char(3),
	-- 现存子女
	XCZN char(1),
	-- 异常妊娠
	YCRS varchar2(64),
	-- 异常妊娠结局
	YCRSJJ varchar2(64),
	-- 避孕
	FMS_BY char(1),
	-- 家族史
	JZS nvarchar2(2000),
	-- 体温
	TW char(5),
	-- 脉搏
	MB char(3),
	-- 呼吸
	HX char(2),
	-- 收缩压
	SSY char(3),
	-- 舒张压 
	SZY char(3),
	-- 发育
	YBQK_FY varchar2(16),
	-- 营养
	YBQK_YY varchar2(16),
	-- 神志
	YBQK_SZ varchar2(16),
	-- 面容
	YBQK_MR varchar2(16),
	-- 体位
	YBQK_TW varchar2(32),
	-- 步态
	YBQK_BT varchar2(32),
	-- 检查合作程度
	YBQK_JCHZCD varchar2(64),
	-- 皮肤黏膜
	PFNM varchar2(64),
	-- 淋巴结
	LBJ varchar2(64),
	-- 乳房发育情况
	RFFYQK char(1),
	-- 乳房肿块
	RFZK char(1),
	-- 肺部视诊
	F_SZ varchar2(64),
	-- 肺部触诊
	F_CZ varchar2(64),
	-- 肺部叩诊
	F_KZ varchar2(64),
	-- 肺部听诊
	F_TZ varchar2(64),
	-- 心听诊
	X_TZ varchar2(64),
	-- 心视诊
	X_SZ varchar2(64),
	-- 心触诊
	X_CZ varchar2(64),
	-- 心叩诊
	X_KZ varchar2(64),
	-- 腹部触诊
	FB_CZ varchar2(64),
	-- 腹部视诊
	FB_SZ varchar2(64),
	-- 腹部叩诊
	FB_KZ varchar2(64),
	-- 腹部听诊
	FB_TZ varchar2(64),
	-- 手术瘢痕
	SSBH char(1),
	-- 手术瘢痕部位
	SSBHBW varchar2(32),
	-- 肛门直肠
	GMZC varchar2(64),
	-- 脊椎四肢
	JZSZ varchar2(64),
	-- 神经系统
	SJXT varchar2(64),
	-- 外阴发育
	WYFY char(1),
	-- 皮肤黏膜色泽
	PFNMSZ char(1),
	-- 其他（外阴）
	WYQT varchar2(64),
	-- 阴道粘膜
	YDNM char(1),
	-- 伸展
	SZZK char(1),
	-- 分泌物
	FMW char(1),
	-- 分泌物量(度)
	FMWL varchar2(16),
	-- 前壁膨出
	QBPC char(1),
	-- 前壁膨出量(度)
	QBPCL varchar2(16),
	-- 后壁膨出
	HBPC char(1),
	-- 后壁膨出量(度)
	HBPCL varchar2(16),
	-- 宫颈
	GJ char(1),
	-- 宫颈(度)
	GJD varchar2(16),
	-- 宫颈型
	GJXZ char(1),
	-- 有无赘生物
	ZSW char(1),
	-- 有无囊肿
	NZ char(1),
	-- 有无接触性出血
	JCXCX char(1),
	-- 举痛
	JT char(1),
	-- 宫体位置
	GTW char(1),
	-- 宫体大小
	GTDX char(1),
	-- 质地
	GTZD varchar2(32),
	-- 形状
	GTXZ char(1),
	-- 活动性
	GTHDX char(1),
	-- 压痛
	GTYT char(1),
	-- 骶韧带节骨
	DRDJG char(1),
	-- 肿块
	GTZK char(1),
	-- 肿块(附件)
	FJZK char(1),
	-- 左/右侧
	ZKWZ char(1),
	-- 肿块大小
	ZKDX varchar2(16),
	-- 活动性
	FJHDX char(1),
	-- 质地
	FJZD char(1),
	-- 压痛
	FJYT char(1),
	-- 光滑
	FJGH char(1),
	-- 与子宫界限
	YZGJX char(1),
	-- 妇科B超检查结果
	FKBCJCJG nvarchar2(200),
	-- 病理检查结果
	BLJCJG nvarchar2(200),
	-- 主治医师签名
	ZZYSQM varchar2(32),
	-- 签字日期
	QZRQ varchar2(50),
	-- CREATE_ID
	CREATE_ID varchar2(32),
	-- CREATE_TIME
	CREATE_TIME varchar2(20),
	-- MODIFY_ID
	MODIFY_ID varchar2(32),
	-- MODIFY_TIME
	MODIFY_TIME varchar2(20),
	DEL_FLAG char(1) default '0',
	PRIMARY KEY (GUID)
);

--住院病历
DROP TABLE CLOUD_EMR_ZYBL;
CREATE TABLE CLOUD_EMR_ZYBL
(
	-- 主键
	GUID varchar2(32) NOT NULL,
	BRBH varchar2(32),--病人编号
	-- 就诊序号
	JZXH varchar2(32),
	-- 供史者
	GSZ varchar2(100),
	-- 记录日期
	JLRQ varchar2(10),
	-- 主诉
	ZS nvarchar2(40),
	-- 现病史
	XBS nvarchar2(2000),
	-- 既往史平素健康状况
	JWS_PSJKZK char(4),
	-- 既往史曾患疾病和传染病史
	JWS_CHJBHCRBS char(1),
	-- 既往史预防接种史
	JWS_YFJZS char(1),
	-- 既往史过敏史
	JWS_GMS char(1),
	-- 既往史过敏源
	JWS_GMY nvarchar2(200),
	-- 既往史临床表现
	JWS_LCBX nvarchar2(200),
	-- 系统回顾-内分泌与代谢系统
	XTHG_NFMYDXXT varchar2(16),
	-- 既往史是否有外伤史
	JWS_WSS char(1),
	-- 既往史是否有手术史
	JWS_SSS char(1),
	-- 既往史是否有输血史
	JWS_SXS char(1),
	-- 系统回顾-呼吸系统-其他
	XTHG_HXXT_QT varchar2(32),
	-- 系统回顾-呼吸系统
	XTHG_HXXT varchar2(16),
	-- 系统回顾-循环系统
	XTHG_XHXT varchar2(16),
	-- 系统回顾-消化系统
	XTHG_XHXIT varchar2(16),
	-- 系统回顾-泌尿生殖系统
	XTHG_MNSZXT varchar2(16),
	-- 系统回顾-造血系统
	XTHG_ZXXT varchar2(16),
	-- 系统回顾-肌肉骨骼系统
	XTHG_JRGGXT varchar2(16),
	-- 系统回顾-神经系统
	XTHG_SJXT varchar2(16),
	-- 个人史_出生地
	GRS_CSD varchar2(64),
	-- 个人史_从事何种工作
	GRS_CSHZGZ varchar2(32),
	-- 个人史-地方病地区居住情况
	GRS_DFBDQJZQK nvarchar2(100),
	-- 个人史-冶游史
	GRS_YYS varchar2(128),
	-- 个人史-嗜烟
	GRS_SY char(1),
	-- 个人史-嗜烟(约_年）
	GRS_SY_YEAR char(3),
	-- 个人史-嗜烟(平均_支/日）
	GRS_SY_DAYNUM char(2),
	-- 个人史-戒烟
	GRS_JY char(1),
	-- 个人史-戒烟(约_年）
	GRS_JY_YEAR char(3),
	-- 个人史-嗜酒
	GRS_SJ char(4),
	-- 个人史-嗜酒(约_年)
	GRS_SJ_YEAR char(3),
	-- 个人史-嗜酒(平均_克酒精/日)
	GRS_SJ_DAYWEIGHT char(4),
	-- 个人史-嗜酒(其他)
	GRS_SJ_QT varchar2(32),
	-- 婚育史、月经史（婚姻情况）
	HYYJS_HYQK varchar2(16),
	-- 婚育史、月经史(结婚年龄）
	HYYJS_JHNL char(5),
	-- 婚育史、月经史（配偶情况）
	HYYJS_POQK varchar2(16),
	-- 婚育史、月经史（有无子女）
	HYYJS_YWZN char(1),
	-- 婚育史、月经史（妊娠次数）
	HYYJS_RSCS char(2),
	-- 婚育史、月经史（顺产几胎）
	HYYJS_SCJT char(2),
	-- 婚育史、月经史（流产几胎）
	HYYJS_LCJT char(2),
	-- 婚育史、月经史（早产几胎）
	HYYJS_ZCJT char(2),
	-- 婚育史、月经史（死产几胎）
	HYYJS_SCJC char(2),
	-- 婚育史、月经史（难产及病情）
	HYYJS_NCJBQ varchar2(256),
	-- 婚育史、月经史（初潮年龄) 
	HYYJS_CCNL char(2),
	-- 婚育史、月经史（行经期）
	HYYJS_XJQ char(2),
	-- 婚育史、月经史（月经周期）
	HYYJS_YJZQ char(2),
	-- 婚育史、月经史（目次月经日期）
	HYYJS_MCYJRQ varchar2(32),
	HYYJS_JJNL char(2),
	-- 婚育史、月经史（经量）
	HYYJS_JL char(2),
	-- 婚育史、月经史（痛经）
	HYYJS_TJ char(1),
	-- 婚育史、月经史（经期）
	HYYJS_JQ char(3),
	JZS_FATHER char(1),
	JZS_FATHER_SY nvarchar2(100),
	JZS_MOTHER char(1),
	JZS_MOTHER_SY nvarchar2(100),
	JZS_BROTHERSANDSISTERS nvarchar2(100),
	JZS_CHILDRENANDOTHERS nvarchar2(100),
	-- 专科检查
	-- 
	ZKJC nvarchar2(2000),
	-- 实验室及器械检查
	SYSJQXJC nvarchar2(2000),
	-- 病历摘要
	BLZY nvarchar2(2000),
	CREATE_ID varchar2(32),
	CREATE_TIME varchar2(20),
	MODIFY_ID varchar2(32),
	MODIFY_TIME varchar2(20),
	DEL_FLAG char(1) DEFAULT '0',
	PRIMARY KEY (GUID)
);

--住院病历体格检查
DROP TABLE CLOUD_EMR_ZYBLTGJC;
CREATE TABLE CLOUD_EMR_ZYBLTGJC
(
	-- 主键
	GUID varchar2(32) NOT NULL,
	-- 体温
	TW char(4),
	-- 脉搏
	MB char(3),
	-- 呼吸
	HX char(2),
	-- 舒张压 
	SZY char(3),
	-- 收缩压
	SSY char(3),
	-- 一般情况（发育）
	YBQK_FY char(1),
	-- 一般情况（营养）
	YBQK_YY char(1),
	-- 一般情况（神志）
	YBQK_SZ char(1),
	-- 一般情况（面容）
	YBQK_MR char(1),
	-- 一般情况（面容其他）
	YBQK_MR_QT varchar2(32),
	-- YBQK_BQ
	YBQK_BQ char(1),
	-- 一般情况（体位）
	YBQK_TW char(1),
	-- 一般情况（体位-其他）
	YBQK_TW_QT varchar2(32),
	-- 一般情况（步态）
	YBQK_BT char(1),
	-- 一般情况（步态-其他）
	YBQK_BT_QT varchar2(32),
	-- 一般情况（配合情况）
	YBQK_PHQT char(1),
	-- 皮肤黏膜（色泽）
	PFNM_SZ char(1),
	-- 皮肤黏膜（皮疹）
	PFNM_PZ char(1),
	-- 皮肤黏膜（皮疹-类型及分布）
	PFNM_PZ_LXJFB varchar2(64),
	-- 皮肤黏膜（皮下出血）
	PFNM_PXCX char(1),
	-- 皮肤黏膜（皮下出血-类型及分布）
	PFNM_PXCX_LXJFB varchar2(64),
	-- 皮肤黏膜（毛发分布）
	PFNM_MFFB char(1),
	-- 皮肤黏膜（毛发分布-部位）
	PFNM_MFFB_BW varchar2(32),
	-- 皮肤黏膜（温度与湿度）
	PFNM_WDYSD char(1),
	-- 皮肤黏膜（弹性）
	PFNM_TX char(1),
	-- 皮肤黏膜（水肿）
	PFNM_SZ_ char(1),
	-- 皮肤黏膜（水肿-部位及程度）
	PFNM_SZ_BWJCD varchar2(64),
	-- 皮肤黏膜（肝掌）
	PFNM_GZ char(1),
	-- 皮肤黏膜（蜘蛛痣）
	PFNM_ZZZ char(1),
	-- 皮肤黏膜（蜘蛛痣-部位）
	PFNM_ZZZ_BW varchar2(32),
	-- 皮肤黏膜（蜘蛛痣-数目）
	PFNM_ZZZ_SM varchar2(8),
	-- 皮肤黏膜（其他）
	PFNM_ZT varchar2(64),
	-- 淋巴结（全身浅表淋巴结）
	LBJ_QSQBLBJ char(1),
	-- 淋巴结（全身浅表淋巴结-部位及特征）
	LBJ_QSQBLBJ_BWJTZ varchar2(64),
	TB_TLDX char(1),
	TB_TLJX char(1),
	TB_TLQTYC char(1),
	TB_TLQTYC_BW varchar2(64),
	TB_Y_MMXS char(1),
	TB_Y_TL char(1),
	TB_Y_DJ char(1),
	TB_Y_YJ char(1),
	TB_Y_JM char(1),
	TB_Y_YQ char(1),
	TB_Y_YQ_ZY char(1),
	TB_Y_GMHR char(1),
	TB_Y_JM_ char(1),
	-- 头部（眼-左右角膜）
	TB_Y_JM_ZY char(1),
	-- 头部（眼-瞳孔）
	TB_Y_TK char(1),
	-- 头部（眼-瞳孔-左大小）
	TB_Y_TKL char(2),
	-- 头部（眼-瞳孔-右大小）
	TB_Y_TKR char(2),
	-- 头部（眼-对光反射）
	TB_Y_DGFS char(1),
	-- 头部（眼-对光发射-左/右眼迟钝）
	TB_Y_DGFS_CD char(1),
	-- 头部（眼-对光反射-左/右眼消失）
	TB_Y_DGFS_XS char(1),
	-- 头部（眼-其他）
	TB_Y_QT varchar2(64),
	-- 头部（耳-耳廓）
	TB_E_EK char(1),
	-- 头部（耳-其他左右）
	TB_E_QT char(1),
	-- 头部（耳-外耳道分泌物）
	TB_E_WEDFMW char(1),
	-- 头部（耳-外耳道分泌物-左右）
	TB_E_WEDFMW_ZY char(1),
	-- 头部（耳-外耳道分泌物-性质）
	TB_E_WEDFMW_XZ varchar2(32),
	-- 头部（耳-乳突压痛）
	TB_E_RTYT char(1),
	-- 头部（耳-乳突压痛-左右）
	TB_E_RTYT_ZY char(1),
	-- 头部（耳-听力粗试障碍）
	TB_E_TLCSZA char(1),
	-- 头部（耳）
	TB_E_TLCSZA_ZY char(1),
	-- 头部（鼻-外形）
	TB_B_WX char(1),
	-- 头部（鼻-外形异常）
	TB_B_WXYC varchar2(32),
	-- 头部（鼻-其他异常）
	TB_B_QTYC char(1),
	-- 头部（鼻-鼻翼压痛）
	TB_B_BDYT char(1),
	-- 头部（鼻-外形）
	TB_B_BDYTBW varchar2(32),
	-- 头部（口腔-口唇）
	TB_KQ_KC char(1),
	-- 头部（口腔-黏膜）
	TB_KQ_NM char(1),
	-- 头部（口腔-腮腺导管开口）
	TB_KQ_SXDGKK char(1),
	-- 头部（口腔-腮腺导管开口异常情况）
	TB_KQ_SXDGKK_YC char(1),
	-- 头部（口腔-舌情况）
	TB_KQ_S char(1),
	-- 头部（口腔-齿龈）
	TB_KQ_CY char(1),
	-- 头部（口腔齿列）
	TB_KQ_CL char(1),
	-- 头部（口腔-扁桃体情况）
	TB_KQ_BTT char(1),
	-- 头部（口腔扁桃体肿胀情况）
	TB_KQ_BTTZT char(1),
	-- 头部（口腔-舌异常）
	TB_KQ_SYC char(1),
	-- 头部（口腔-咽部情况）
	TB_KQ_Y varchar2(32),
	-- 头部（口腔）
	TB_KQ_SY char(1),
	-- 颈部（抵抗感）
	JB_DKG char(1),
	-- 颈部（颈动脉）
	JB_JDM char(1),
	-- 颈部（颈动脉-一侧减弱左右）
	JB_JDM_YCJR char(1),
	-- 颈部（颈静脉）
	JB_JJM char(1),
	-- 颈部（气管）
	JB_QG char(1),
	-- 颈部（气管偏移左右）
	JB_QG_PY char(1),
	-- 颈部（肝颈静脉回流征）
	JB_GJJMHLZ char(1),
	-- 颈部（甲状腺）
	JB_JZX char(1),
	-- 颈部（侧为主）
	JB_CWZ char(1),
	-- 颈部（侧为主-结节性）
	JB_CWZ_JJX char(1),
	-- 颈部（其他异常）
	JB_QTYC char(1),
	-- 胸部（胸廓情况）
	XB_XK char(1),
	-- 胸部（胸廓-膨隆或凹陷左右）
	XB_XK_PLHAX char(1),
	-- 胸部（胸廓-其他）
	XB_XK_QT varchar2(64),
	-- 胸部（乳房情况）
	XB_RF char(1),
	-- 胸部（乳房-异常左右）
	XB_RF_YCZY char(1),
	-- 胸部（乳房-异常症状）
	XB_RF_YCZZ char(1),
	-- 肺（视诊）
	F_SZ char(1),
	-- 肺（视诊-呼吸运动异常左右）
	F_SZ_HXYDYCZY char(1),
	-- 肺（视诊-呼吸运动异常情况）
	F_SZ_HXYDYCQK char(1),
	-- 肺（视诊-肋间隙-变窄部位）
	F_SZ_LJX_BZBW varchar2(64),
	-- 肺（触诊）
	F_CZ char(1),
	-- 肺（触诊-语颤）
	F_CZ_YC char(1),
	-- 肺（触诊-语颤增强-左右）
	F_CZ_YCZQ_ZY char(1),
	-- 肺（触诊-语颤减弱-左右）
	F_CZ_YCJR_ZY char(1),
	-- 肺（触诊-胸膜摩擦感）
	F_CZ_XMMCG char(1),
	-- 肺（触诊-皮下捻发感）
	F_CZ_PXNFG char(1),
	-- 肺（叩诊）
	F_KZ char(1),
	-- 肺（肩胛下角线-右）
	F_KZ_JJXJX_Y varchar2(16),
	-- 肺（叩诊-肩胛下角线-左）
	F_KZ_JJXJX_Z varchar2(16),
	-- 肺（叩诊-移动度-右）
	F_KZ_YDD_Y varchar2(8),
	-- 肺（叩诊-移动度-左）
	F_KZ_YDD_Z varchar2(8),
	-- 肺（听诊-呼吸）
	F_TZ_HX char(1),
	-- 肺（听诊-呼吸音）
	F_TZ_HXY char(1),
	-- 肺（啰音情况）
	F_LY char(1),
	-- 肺（啰音-水泡音）
	F_LY_SPY char(1),
	-- 肺（啰音部位）
	F_LY_BW varchar2(16),
	-- 肺（呼吸延长）
	F_TZ_HXYC char(1),
	-- 肺（呼吸延长-语音传导-增强左右）
	F_TZ_HXYC_YYCD_ZQZY char(1),
	-- 肺（呼吸延长-语音传导-减弱左右）
	F_TZ_HXYC_YYCD_ZRZY char(1),
	-- 心（视诊）
	X_SZ char(1),
	-- 心（视诊-心尖搏动）
	X_SZ_XJBD char(1),
	-- 心（视诊-心尖搏动位置）
	X_SZ_XJBDWZ char(1),
	-- 心（视诊-心尖搏动位置-移位距离）
	X_SZ_XJBDWZ_YWJL varchar2(8),
	-- 心（触诊-心尖搏动）
	X_CZ_XJBD char(1),
	-- 心（触诊-震颤）
	X_CZ_ZC char(1),
	-- 心（触诊-震颤-部位）
	X_CZ_ZCBW varchar2(32),
	-- 心（触诊-震颤-时期）
	X_CZ_ZCSQ varchar2(32),
	-- 心（叩诊-肋间）
	X_KZ_LJ char(1),
	-- 心（叩诊-肋间-左）
	X_KZ_LJZ varchar2(8),
	-- 心（叩诊-肋间-右）
	X_KZ_LJY varchar2(8),
	-- 心（听诊-心率次/分）
	X_TZ_XLC varchar2(8),
	-- 心（听诊-心率）
	X_TZ_XL char(1),
	X_TZ_XYS1 char(1),
	X_TZ_XYS2 char(1),
	X_TZ_XYS3 char(1),
	X_TZ_XYS4 char(1),
	-- 心（听诊-额外心音）
	X_TZ_EWXY char(1),
	-- 心（听诊-额外心音-奔马律）
	X_TZ_EWXY_BML char(1),
	-- 心（听诊-杂音）
	X_TZ_ZY char(1),
	-- 心（听诊-心包摩擦音）
	X_TZ_XBMCY char(1),
	-- 心（听诊-心包摩擦音-部位）
	X_TZ_XBMCY_BW varchar2(16),
	-- 心（听诊-心包摩擦音-时期）
	X_TZ_XBMCY_SQ varchar2(16),
	-- 心（听诊-周围血管-无异常血管征）
	X_TZ_ZWXG_WYCXGZ char(1),
	-- 心（听诊-脉搏短绌）
	X_TZ_ZWXG_MBDC char(1),
	-- 心（听诊-脉搏短绌-其他）
	X_TZ_ZWXG_MBDCQT varchar2(32),
	-- 腹部（视诊-外形）
	FB_SZ_WX char(1),
	-- 腹部（视诊-外形-蛙腹腹围）
	FB_SZ_WX_WFFW varchar2(8),
	-- 腹部（视诊-蠕动波）
	FB_SZ_RDB char(1),
	-- 腹部（视诊-蠕动波-腹式呼吸）
	FB_SZ_RDB_FSWX char(1),
	-- 腹部（视诊-蠕动波脐）
	FB_SZ_RDB_Q char(1),
	-- 腹部（视诊-其他异常）
	FB_SZ_QTYC char(1),
	-- 腹部（触诊-柔软）
	FB_CZ_RR varchar2(16),
	-- 腹部（触诊-腹肌紧张）
	FB_CZ_FJJZBW varchar2(32),
	-- 腹部（触诊-压痛）
	FB_CZ_YT char(1),
	-- 腹部（触诊-反跳痛）
	FB_CZ_FTT char(1),
	-- 腹部（触诊-振水声）
	FB_CZ_ZSS char(1),
	-- 腹部（触诊-液波震颤）
	FB_CZ_YBZC char(1),
	-- 腹部（触诊-腹部包块）
	FB_CZ_FBBK char(1),
	-- 腹部（触诊-腹部包块部位）
	FB_CZ_FBBK_BW varchar2(16),
	-- 腹部（触诊-特征描述）
	FB_CZ_TZMS nvarchar2(100),
	-- 腹部（肝）
	FB_G char(1),
	-- 腹部（肝-可触及肋下）
	FB_G_KCJLX varchar2(8),
	-- 腹部（肝-可触及剑突下）
	FB_G_KCJJTX varchar2(8),
	-- 腹部（肝-特征描述）
	FB_G_TZMS nvarchar2(100),
	-- 腹部（胆囊）
	FB_DN char(1),
	-- 腹部（胆囊-可触及大小）
	FB_DN_KCJDX varchar2(8),
	-- 腹部（胆囊-是否压痛）
	FB_DN_YT char(1),
	-- 腹部（脾）
	FB_P char(1),
	-- 腹部（脾-可触及肋下距离）
	FB_P_KCJLX varchar2(8),
	-- 腹部（脾-特征描述）
	FB_P_TZMS nvarchar2(100),
	-- 腹部（肾情况）
	FB_S char(1),
	-- 腹部（肾-可触及大小）
	FB_S_KCJDX varchar2(8),
	-- 腹部（肾-可触及硬度）
	FB_S_KCJYD varchar2(32),
	-- 腹部（肾-可触及压痛）
	FB_S_KCJYT varchar2(32),
	-- 腹部（肾-可触及移动度）
	FB_S_KCJYDD varchar2(64),
	-- 腹部（肾-输尿管压痛点）
	FB_S_SNGYTD char(1),
	-- 腹部（肾-输尿管压痛点部位）
	FB_S_SNGYTD_BW varchar2(32),
	-- 腹部（叩诊-肝浊音界）
	FB_KZ_KZYJ char(1),
	-- 腹部（叩诊-肝上间位于右锁骨中线）
	FB_KZ_KSJWYZSGZX varchar2(32),
	-- 腹部（叩诊-移动性浊音）
	FB_KZ_YDXZY char(1),
	-- 腹部（叩诊-肾区叩痛）
	FB_KZ_SQKT char(1),
	-- 腹部（听诊-肠鸣音）
	FB_TZ_CMY char(1),
	-- 腹部（听诊-气过水声）
	FB_TZ_QGSS char(1),
	-- 腹部（听诊-血管杂音）
	FB_TZ_XGZY char(1),
	-- 腹部（听诊-血管杂音部位）
	FB_TZ_XGZYBW varchar2(32),
	-- 肛门直肠情况
	GMZC char(1),
	-- 肝门直肠异常
	GMZC_YC nvarchar2(100),
	-- 生殖器情况
	SZQ char(1),
	-- 生殖器异常
	SZQ_YC nvarchar2(100),
	-- 脊柱四肢（脊柱）
	JZSZ_JZ char(1),
	-- 脊柱四肢（脊柱畸形）
	JZSZ_JZJX char(1),
	-- 脊柱四肢（棘突）
	JZSZ_JT char(1),
	-- 脊柱四肢（棘突部位）
	JZSZ_JTBW varchar2(32),
	-- 脊柱四肢（活动度）
	JZSZ_HDD char(1),
	-- 脊柱四肢（四肢）
	JZSZ_SZ char(1),
	-- 脊柱四肢（四肢-杵状指趾）
	JZSZ_CZZCBWJTZ nvarchar2(100),
	-- 神经系统（腹壁反射）
	SJXT_FBFS char(1),
	-- 神经系统（肌张力）
	SJXT_JZL char(1),
	-- 神经系统（肌力）
	SJXT_JL varchar2(8),
	-- 神经系统（肢体瘫痪）
	SJXT_ZTTH char(1),
	-- 神经系统（弘二头肌反射-左）
	SJXT_HETJFS_Z char(1),
	-- 神经系统（弘二头肌反射-右）
	SJXT_HETJFS_Y char(1),
	-- 神经系统（弘二头肌反射）
	SJXT_HETJFS char(1),
	-- 神经系统（膝腱反射）
	SJXT_XJFS char(1),
	-- 神经系统（膝腱反射-左）
	SJXT_XJFS_Z char(1),
	-- 神经系统（膝腱反射-左）
	SJXT_XJFS_Y char(1),
	-- 神经系统（跟腱反射）
	SJXT_GJFS char(1),
	-- 神经系统（跟腱反射-左）
	SJXT_GJFS_Z char(1),
	-- 神经系统（跟腱反射-右）
	SJXT_GJFS_Y char(1),
	CREATE_ID varchar2(32),
	CREATE_TIME varchar2(20),
	MODIFY_ID varchar2(32),
	MODIFY_TIME varchar2(20),
	-- 父表ID
	PARENT_ID varchar2(32),
	DEL_FLAG char(1) DEFAULT '0',
	PRIMARY KEY (GUID)
);

--入院记录
DROP TABLE CLOUD_EMR_RYJL;
CREATE TABLE CLOUD_EMR_RYJL
(
	-- 主键
	GUID varchar2(32) NOT NULL,
	BRBH varchar2(32),--病人编号
	-- 就诊序号
	JZXH varchar2(32),
	-- 供史者
	GSZ varchar2(100),
	-- 记录日期
	JLRQ varchar2(10),
	-- 主诉
	ZS nvarchar2(40),
	-- 现病史
	XBS nvarchar2(2000),
	-- 既往史
	JWS nvarchar2(2000),
	-- 个人史
	GRS nvarchar2(2000),
	-- 家族史
	JZS nvarchar2(2000),
	-- 体格检查
	-- 
	TGJC nvarchar2(2000),
	-- 专科检查
	-- 
	ZKJC nvarchar2(2000),
	-- 实验室及器械检查
	SYSJQXJC nvarchar2(2000),
	-- 体温
	TW char(4),
	-- 脉搏
	MB char(3),
	-- 呼吸
	HX char(2),
	-- 舒张压 
	SZY char(3),
	-- 收缩压
	SSY char(3),
	CREATE_ID varchar2(32),
	CREATE_TIME varchar2(20),
	MODIFY_ID varchar2(32),
	MODIFY_TIME varchar2(20),
	DEL_FLAG char(1) DEFAULT '0',
	PRIMARY KEY (GUID)
);

--产科入院记录
DROP TABLE CLOUD_EMR_CKRYJL;
CREATE TABLE CLOUD_EMR_CKRYJL
(
	-- 主键
	GUID varchar2(32) NOT NULL,
	BRBH varchar2(32),--病人编号
	-- 就诊序号
	JZXH varchar2(32),
	-- 供史者
	GSZ varchar2(100),
	-- 记录日期
	JLRQ varchar2(10),
	-- 主诉
	ZS nvarchar2(40),
	-- 现病史
	XBS nvarchar2(2000),
	-- 心、肺、肾疾病
	X_F_S_JB char(1),
	-- 心、肺、肾疾病_病名
	X_F_SJB_BM varchar2(64),
	-- 药物过敏史
	YWGMS char(1),
	-- 药物过敏史_药名
	YWGMX_YM varchar2(64),
	-- 手术史
	SSS char(1),
	-- 手术史_术式
	SSS_SS varchar2(64),
	-- 预防接种史
	YFJZS char(1),
	-- 传染病史
	CRBS char(1),
	-- 癫痫病史
	DXBS char(1),
	-- 烟、酒、毒麻药嗜好
	YJD_MYSH char(1),
	-- 治病史
	ZBS char(1),
	-- 疫水接触史
	YSJCS char(1),
	-- 初潮年龄
	CCNL char(6),
	-- 行经天数
	XJTS char(6),
	-- 月经天数
	YJTS char(6),
	-- 月经量
	YJ_YJL char(1),
	-- 痛经
	YJ_TJ char(1),
	-- 白带量
	YJ_BDL char(1),
	-- 性状
	YJ_XZ varchar2(64),
	-- 异味
	YJ_YW varchar2(64),
	-- 结婚年龄
	JHNL char(6),
	-- 近亲婚配
	JQHP char(1),
	-- 丈夫姓名
	ZF_XM varchar2(32),
	-- 丈夫年龄
	ZF_NL char(6),
	-- 丈夫职业
	ZF_ZY varchar2(32),
	-- 丈夫健康状况
	ZF_JKZK varchar2(32),
	-- 足月产
	RC_ZYC char(6),
	-- 早产
	RC_ZC char(6),
	-- 流产
	RC_LC char(6),
	-- 现存子女
	XC_ZN char(1),
	-- 末次生（流）产时间
	MCSLCSJ varchar2(64),
	-- 异常孕产情况
	YCYCQK nvarchar2(100),
	-- 家族史
	JZS nvarchar2(2000),
	-- 体温
	TW char(5),
	-- 脉搏
	MB char(3),
	-- 呼吸
	HX char(2),
	-- 舒张压 
	DBP char(3),
	-- 收缩压
	SBP char(3),
	-- 身高
	SG char(4),
	-- 体重
	TZ char(4),
	-- 水肿
	SZ char(1),
	-- 发育
	YB_FY varchar2(16),
	-- 营养
	YB_YY varchar2(16),
	-- 神志
	YB_SZ varchar2(16),
	-- 面容
	YB_MR varchar2(16),
	-- 体位
	YB_TW char(1),
	-- 步态
	YB_BT varchar2(32),
	-- 检查合作程度
	JCHZCD varchar2(64),
	-- 皮肤黏膜
	PFNM varchar2(64),
	-- 淋巴结
	LBJ varchar2(64),
	-- 头颈部
	TJB varchar2(64),
	-- 胸廓
	XB_XK varchar2(64),
	-- 乳房
	XB_RF varchar2(64),
	-- 肺_视诊
	F_SZ varchar2(64),
	-- 肺_触诊
	F_CZ varchar2(64),
	-- 肺_叩诊
	F_KZ varchar2(64),
	-- 肺_听诊
	F_TZ varchar2(64),
	-- 心_视诊
	X_SZ varchar2(64),
	-- 心_触诊
	X_CZ varchar2(64),
	-- 心_叩诊
	X_KZ varchar2(64),
	-- 心_听诊
	X_TZ varchar2(64),
	-- 腹部_视诊
	FB_SZ varchar2(64),
	-- 腹部_触诊
	FB_CZ varchar2(64),
	-- 腹部_叩诊
	FB_KZ varchar2(64),
	-- 腹部_听诊
	FB_TZ varchar2(64),
	-- 痔核
	GM_ZH char(1),
	-- 外阴_瘢痕
	WY_BH char(1),
	-- 外阴_水肿
	WY_SZ char(1),
	-- 外阴_静脉曲张
	WY_JMQZ char(1),
	-- 脊柱四肢
	JZSZ varchar2(64),
	-- 神经系统
	SJXT varchar2(64),
	-- 宫高
	CK_GG char(4),
	-- 腹围
	CK_FW char(4),
	-- 估计胎儿大小
	GJTEDX char(5),
	-- 胎方位
	CK_TFW varchar2(32),
	-- 胎心
	CK_TX char(4),
	-- 胎心位置
	TX_WZ varchar2(16),
	-- 强度
	CK_QD varchar2(16),
	-- 先露
	CK_XL varchar2(16),
	-- 位置
	CK_WZ varchar2(16),
	-- 衔接
	CK_XJ varchar2(16),
	-- 胎膜
	CK_TM varchar2(16),
	-- 宫颈质地
	GJZD char(1),
	-- 宫颈位置
	GJWZ char(1),
	-- 宫颈长度
	GJCD char(4),
	-- 宫颈扩张
	GJKZ varchar2(32),
	-- 宫缩
	GJ_GS varchar2(32),
	-- 髂前上棘间径
	QQSJJJ char(4),
	-- 髂嵴间径
	QJJJ char(4),
	-- 髂耻外径
	QCWJ char(4),
	-- 坐骨结节间径
	ZGJJJJ char(4),
	-- 高危因素记录
	GWYSJL char(1),
	-- 建围产大卡
	JWCDK char(1),
	-- 建围产大卡（院）
	JWCDK_Y char(1),
	-- 实验室及器械检查
	SYSJQXJC nvarchar2(2000),
	-- 医师签名
	YSBH varchar2(32),
	-- 签名时间
	QMSJ varchar2(50),
	-- CREATE_ID
	CREATE_ID varchar2(32),
	-- CREATE_TIME
	CREATE_TIME varchar2(20),
	-- MODIFY_ID
	MODIFY_ID varchar2(32),
	-- MODIFY_TIME
	MODIFY_TIME varchar2(20),
	DEL_FLAG char(1) DEFAULT '0',
	PRIMARY KEY (GUID)
);

--手术记录
DROP TABLE CLOUD_EMR_SSJL;
CREATE TABLE CLOUD_EMR_SSJL
(
	-- 主键
	GUID varchar2(32) NOT NULL,
	TREE_ID VARCHAR2(32), --树节点id
	BRBH varchar2(32),--病人编号
	-- 就诊序号
	JZXH varchar2(32),
	-- 手术开始时间
	SSKSSJ varchar2(20),
	-- 手术结束时间
	SSJSSJ varchar2(20),
	-- 手术记录护士
	SSJLHS varchar2(256),
	-- 手术体位
	SSTW varchar2(20),
	-- 皮肤消毒
	PFXD varchar2(100),
	-- 切口部位、方向、长度
	QK_BW_FX_CD varchar2(200),
	-- 是否改变手术方式
	SZGBSSFS char(1),
	-- 是否改变手术方式理由
	SZGBSSFSLY nvarchar2(2000),
	-- 是否签署知情同意书
	QSZQTYS char(1),
	-- 引流材料名称
	YLCLMC varchar2(384),
	-- 引流材料数目
	YLCLSM char(6),
	-- 引流材料防止部位
	YLCLFZBW varchar2(100),
	-- 送验标本名称
	SYBBMC varchar2(384),
	-- 术中用药
	SZYY varchar2(384),
	-- 是否输血
	SFSX char(1),
	-- 输血量
	SXL char(5),
	-- 手术者签名
	SSZQM varchar2(32),
	CREATE_ID varchar2(32),
	CREATE_TIME varchar2(20),
	MODIFY_ID varchar2(32),
	MODIFY_TIME varchar2(20),
	DEL_FLAG char(1) DEFAULT '0',
	PRIMARY KEY (GUID)
);

--儿科入院记录
DROP TABLE CLOUD_EMR_EKRYJL;
CREATE TABLE CLOUD_EMR_EKRYJL
(
	-- 主键
	GUID varchar2(32) NOT NULL,
	BRBH varchar2(32),--病人编号
	-- 就诊序号
	JZXH varchar2(32),
	-- 供史者
	GSZ varchar2(100),
	-- 记录日期
	JLRQ varchar2(10),
	-- 主诉
	ZS nvarchar2(40),
	-- 既往史
	JWS nvarchar2(2000),
	-- 现病史
	XBS nvarchar2(2000),
	-- 个人史
	GRS nvarchar2(2000),
	-- 家族史
	JZS nvarchar2(2000),
	-- 实验室及器械检查
	SYSJQXJC nvarchar2(2000),
	-- 医师签名
	YSBH varchar2(32),
	-- 签名时间
	QMSJ varchar2(50),
	-- CREATE_ID
	CREATE_ID varchar2(32),
	-- CREATE_TIME
	CREATE_TIME varchar2(20),
	-- MODIFY_ID
	MODIFY_ID varchar2(32),
	-- MODIFY_TIME
	MODIFY_TIME varchar2(20),
	DEL_FLAG char(1) DEFAULT '0',
	PRIMARY KEY (GUID)
);

--儿科入院记录体格检查
DROP TABLE CLOUD_EMR_EKRYJLTGJC;
CREATE TABLE CLOUD_EMR_EKRYJLTGJC
(
	-- 主键
	GUID varchar2(32) NOT NULL,
	-- 体温
	TW char(5),
	-- 脉搏
	MB char(3),
	-- 舒张压 
	SZY char(3),
	--收缩压
	SSY char(3),
	-- 呼吸
	HX char(2),
	-- 体重
	TZ char(4),
	-- 体位
	YB_TW char(1),
	-- 体位_其他
	TW_QT varchar2(32),
	-- 发育
	YB_FY char(1),
	-- 神志
	YB_SZ char(1),
	-- 精神
	YB_JS char(1),
	-- 营养
	YB_YY char(1),
	-- 全身中毒症状
	QSZDZZ char(1),
	-- 呼吸
	YB_HX char(1),
	-- 面色
	YB_MS char(1),
	-- 唇
	YB_C char(1),
	-- 失水貌
	YB_SSM char(1),
	-- 贫血症
	YB_PXZ char(1),
	-- 贫血程度
	PX_CD varchar2(32),
	-- 皮肤黏膜_色泽
	PFNM_SZE char(1),
	-- 弹性
	PN_TX char(1),
	-- 粗糙
	PN_CC char(1),
	-- 皮下脂肪
	PXZF char(1),
	-- 四肢末端厥冷
	SJMDJL char(1),
	-- 皮疹
	PN_PZ char(1),
	-- 皮疹_类型及分布
	PZ_LXJFB varchar2(64),
	-- 皮下出血
	PXCX char(1),
	-- 皮下出血_类型及分布
	PXCX_LXJFB varchar2(64),
	-- 水肿
	PN_SZ char(1),
	-- 水肿_部位
	SZ_BW varchar2(32),
	-- 水肿_性质及程度
	SZ_XZJCD varchar2(64),
	-- 浅表淋巴结
	QBLBJ varchar2(512),
	-- 头面部_头型
	TMB_TX char(1),
	-- 头面部_头发
	TMB_TF char(1),
	-- 颅骨软化
	LGRH char(1),
	-- 前囟
	TMB_QX char(1),
	-- 前囟大小_长
	QX_C char(4),
	-- 前囟大小_宽
	QX_K char(4),
	-- 颅缝
	TMB_LF char(1),
	-- 结膜
	TMB_JIM char(1),
	-- 巩膜黄染
	GMHR char(1),
	-- 巩膜黄染程度
	GMHR_Y char(1),
	-- 角膜
	TMB_JAM char(1),
	-- 瞳孔
	TMB_TK char(1),
	-- 瞳孔_等大
	TK_DD char(3),
	-- 瞳孔_不等大_左
	TK_BDD_Z char(3),
	-- 瞳孔_不等大_右
	TK_BDD_Y char(3),
	-- 对光反应
	DGFY char(1),
	-- 耳廓
	TMB_EK char(1),
	-- 耳廓_畸形
	EK_JX varchar2(32),
	-- 外耳道
	TMB_WED char(1),
	-- 分泌物
	TMB_FMW char(1),
	-- 分泌物性状
	FMW_Y char(1),
	-- 分泌物位置
	FMW_WZ char(1),
	-- 疖肿
	TMB_JZ char(1),
	-- 疖肿位置
	JZ_WZ char(1),
	-- 鼻扇
	TMB_BS char(1),
	-- 牙齿
	TMB_YC char(1),
	-- 牙齿_萌出
	YC_MC char(3),
	-- 牙龈
	TMB_YY char(1),
	-- 舌
	TMB_S char(1),
	-- 舌系带
	TMB_SXD char(1),
	-- 口腔黏膜
	KQNM char(1),
	-- 腭
	TMB_E char(1),
	-- 咽
	TMB_Y char(1),
	-- 扁桃体
	TMB_BTT char(1),
	-- 扁桃体_肿大
	BTT_ZD char(1),
	-- 扁桃体_脓性分泌物位置
	BTT_NXFMW char(1),
	-- 颈部
	TMB_JB char(1),
	-- 气管
	TMB_QG char(1),
	-- 气管_偏移
	QG_PY char(1),
	-- 颈静脉怒张
	JJMNZ char(1),
	-- 甲状腺情况
	JZXQK char(1),
	-- 胸廓
	XB_XK char(1),
	-- 肋串珠
	XB_LCZ char(1),
	-- 赫氏沟
	XB_HSG char(1),
	-- 语颤
	XB_YC char(1),
	-- 语颤_增强
	YC_ZQ char(1),
	-- 语颤_减弱
	YC_JR char(1),
	-- 肺部叩诊
	FBKZ char(1),
	-- 肺部叩诊_过轻音
	FBKZ_GQY varchar2(32),
	-- 肺部听诊
	FBTZ nvarchar2(200),
	-- 心前区隆起
	XQQLQ char(1),
	-- 心尖搏动位置
	XJBDWZ varchar2(32),
	-- 震颤
	XB_ZC char(1),
	-- 心界大小
	XJDX char(1),
	-- 心界增大
	XJZD char(1),
	-- 心界增大长度
	XJZD_CD char(3),
	-- 心率频率
	XLPL char(3),
	-- 心率状态
	XLZT char(1),
	-- 心率不整
	XLBZ varchar2(32),
	-- 心音
	XB_XY char(1),
	-- 杂音
	XB_ZY char(1),
	-- 杂音部位
	ZY_BW varchar2(32),
	-- 杂音性质
	ZY_XZ varchar2(32),
	-- 杂音强度
	ZY_QD varchar2(32),
	-- 腹部_外形
	FB_WX char(1),
	-- 腹部_触诊
	FB_CZ char(1),
	-- 腹部_压痛
	FB_YT char(1),
	-- 压痛部位
	YTBW varchar2(32),
	-- 反跳痛
	FB_FTT char(1),
	-- 移动性浊音
	FB_YDXZY char(1),
	-- 包块
	FB_BK char(1),
	-- 包块部位
	BK_BW varchar2(32),
	-- 包块大小
	BK_DX varchar2(32),
	-- 包块触痛
	BK_CT varchar2(32),
	-- 肝脏右肋下
	GZYLX char(4),
	-- 肝脏剑下
	GZJX char(4),
	-- 肝脏质地
	GZZD char(1),
	-- 脾脏肋下
	PZLX char(4),
	-- 脾脏质地
	PZZD char(1),
	-- 叩诊_鼓音
	KZ_GY char(1),
	-- 叩诊_移动性浊音
	KZ_YDXZY char(1),
	-- 听诊_肠鸣音
	TZ_CMY char(1),
	-- 肛门及外生殖器
	GMJWSZQ varchar2(512),
	-- 脊柱及四肢
	JZJSZ char(1),
	-- 脊柱及四肢畸形
	JZJSZ_JX varchar2(32),
	-- 骨骺端肥大
	GHDFD char(1),
	-- 杵状指（趾）
	JZJSZ_CZZ char(1),
	-- 关节红肿
	GJHZ char(1),
	-- 关节红肿部位
	GJHZ_BW varchar2(32),
	-- 压痛
	JZJSZ_YT char(1),
	-- 压痛部位
	JZJSZ_YTBW varchar2(32),
	-- 强直
	JZJSZ_QZ char(1),
	-- 强直部位
	JZJSZ_QZBW varchar2(32),
	-- 水肿
	JSJSZ_SZ char(1),
	-- 水肿部位
	JSJSZ_SZBW varchar2(32),
	-- 肌肉萎缩
	JSJSZ_JRWS char(1),
	-- 肌肉萎缩部位
	JSJSZ_JRWSBW varchar2(32),
	-- 活动度
	JSJSZ_HDD char(1),
	-- 活动度受限
	JSJSZ_HDDSX varchar2(32),
	-- 神经反射kernig征
	SJFS_K char(1),
	-- Babinski征
	SJFS_B char(1),
	-- Brudzinski征
	SJFS_BR char(1),
	-- 膝反射
	SJFS_XFS char(1),
	-- 肌张力
	SJFS_JZL char(1),
	-- 父表ID
	PARENT_ID varchar2(32),
	CREATE_ID varchar2(32),
	CREATE_TIME varchar2(20),
	MODIFY_ID varchar2(32),
	MODIFY_TIME varchar2(20),
	DEL_FLAG char(1) DEFAULT '0',
	PRIMARY KEY (GUID)
);
