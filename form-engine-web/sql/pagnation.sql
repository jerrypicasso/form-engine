CREATE TABLE PAGANATION_MANAGE(
  GUID VARCHAR2(32),
  CATEGORY VARCHAR2(256),
  BRBH VARCHAR2(32),
  JZXH VARCHAR2(32),
  SEQ VARCHAR2(10),
  CREATE_ID varchar2(32),
  CREATE_TIME varchar2(20),
  MODIFY_ID varchar2(32),
  MODIFY_TIME varchar2(20),
  DEL_FLAG char(1) DEFAULT '0',
  PRIMARY KEY (GUID)
);