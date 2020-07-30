/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50715
Source Host           : localhost:3306
Source Database       : goujiuwang

Target Server Type    : MYSQL
Target Server Version : 50715
File Encoding         : 65001

Date: 2020-07-16 19:28:50
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `shoppingcar`
-- ----------------------------
DROP TABLE IF EXISTS `shoppingcar`;
CREATE TABLE `shoppingcar` (
  `cId` int(10) NOT NULL AUTO_INCREMENT,
  `gId` int(10) NOT NULL,
  `uId` int(10) NOT NULL,
  `gImg` varchar(100) NOT NULL COMMENT '商品图片',
  `gName` varchar(100) NOT NULL COMMENT '商品名称',
  `gPrice` float NOT NULL COMMENT '单价',
  `gNum` int(11) NOT NULL COMMENT '数量',
  `gTotal` varchar(10) DEFAULT NULL COMMENT '总金额',
  `gStatus` varchar(1) NOT NULL DEFAULT '1' COMMENT '状态 ：1,可用；0,不可用',
  `gTime` datetime DEFAULT NULL,
  PRIMARY KEY (`cId`),
  UNIQUE KEY `cId` (`cId`),
  KEY `uId` (`uId`),
  CONSTRAINT `shoppingcar_ibfk_1` FOREIGN KEY (`uId`) REFERENCES `vip` (`uId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of shoppingcar
-- ----------------------------
INSERT INTO `shoppingcar` VALUES ('4', '1', '17', './images/ia_300000090.jpg', '53度茅台贵州大曲酒70年代(2020年产)500ml', '438', '5', '2190', '1', '2020-07-16 09:01:05');
INSERT INTO `shoppingcar` VALUES ('5', '8', '17', './images/ia_300000097.jpg', '53度茅台仁酒丹青殊荣（2017年产）500ml*6瓶【整箱装】', '3088', '3', '9264', '0', '2020-07-16 09:01:46');
INSERT INTO `shoppingcar` VALUES ('6', '5', '17', './images/ia_300000094.jpg', '53度茅台仁酒（2019年产）500ml', '468', '2', '936', '0', '2020-07-16 09:54:16');
INSERT INTO `shoppingcar` VALUES ('14', '6', '17', './images/ia_300000095.jpg', '53度茅台赖茅金樽（2018年产）500ml', '419', '3', '1257', '0', '2020-07-16 10:35:58');
INSERT INTO `shoppingcar` VALUES ('15', '6', '17', './images/ia_300000095.jpg', '53度茅台赖茅金樽（2018年产）500ml', '419', '5', '2095', '1', '2020-07-16 10:36:31');
INSERT INTO `shoppingcar` VALUES ('16', '2', '17', './images/ia_300000091.jpg', '53度茅台王子戊戌狗年酒(2018年产)500ml', '588', '2', '1176', '0', '2020-07-16 11:26:04');
INSERT INTO `shoppingcar` VALUES ('17', '2', '17', './images/ia_300000091.jpg', '53度茅台王子戊戌狗年酒(2018年产)500ml', '588', '1', '588', '1', '2020-07-16 11:37:41');
INSERT INTO `shoppingcar` VALUES ('18', '5', '17', './images/ia_300000094.jpg', '53度茅台仁酒（2019年产）500ml', '468', '3', '1404', '0', '2020-07-16 16:23:46');
INSERT INTO `shoppingcar` VALUES ('19', '1', '22', './images/ia_300000090.jpg', '53度茅台贵州大曲酒70年代(2020年产)500ml', '438', '4', '1752', '1', '2020-07-16 19:08:53');
INSERT INTO `shoppingcar` VALUES ('20', '8', '22', './images/ia_300000097.jpg', '53度茅台仁酒丹青殊荣（2017年产）500ml*6瓶【整箱装】', '3088', '2', '6176', '1', '2020-07-16 19:11:08');

-- ----------------------------
-- Table structure for `vip`
-- ----------------------------
DROP TABLE IF EXISTS `vip`;
CREATE TABLE `vip` (
  `uId` int(11) NOT NULL AUTO_INCREMENT,
  `uName` varchar(50) NOT NULL,
  `uPwd` varchar(50) NOT NULL,
  `uDate` date DEFAULT NULL COMMENT '注册日期',
  `uStatus` varchar(1) NOT NULL DEFAULT '1' COMMENT '状态：1,可用；2，不可用',
  PRIMARY KEY (`uId`),
  UNIQUE KEY `uId` (`uId`) USING BTREE,
  UNIQUE KEY `uName` (`uName`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of vip
-- ----------------------------
INSERT INTO `vip` VALUES ('17', 'xayah5', 'e10adc3949ba59abbe56e057f20f883e', '2020-07-15', '1');
INSERT INTO `vip` VALUES ('18', 'kahan5', 'e10adc3949ba59abbe56e057f20f883e', '2020-07-15', '1');
INSERT INTO `vip` VALUES ('19', 'abc123', 'e10adc3949ba59abbe56e057f20f883e', '2020-07-15', '1');
INSERT INTO `vip` VALUES ('20', 'gjwcom', 'e10adc3949ba59abbe56e057f20f883e', '2020-07-16', '1');
INSERT INTO `vip` VALUES ('22', 'liuzhaohui', 'e10adc3949ba59abbe56e057f20f883e', '2020-07-16', '1');
