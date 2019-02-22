// 发布（线上）环境
var configs = {
  name: 'Steward.Web',
  version: '1.0.0-beta.0',
  productName: '福禄管家-系统总管',
  productVersion: 'X1',
  clientId: '10000049', //通行证使用的appid(一般与appid保持一致，目前只有erp的与appid不一样)
  authorId: '10000049', //当前应用对应的appid
  accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE3OEJBNEJGMDZGQzkzMDY1QUEyNTgyRjU1QzcyMkE2IiwiY2xpZW50X2lkIjoiMTAwMDAwMDMiLCJuYW1lIjoiODAwMSIsIm5pY2tuYW1lIjoi56ym54aZIiwicGhvbmVfbnVtYmVyIjoiMTg2MjcxMTU2NTciLCJlbWFpbCI6Ijc3NTE0NTU0QHFxLmNvbSIsInJvbGUiOiJVc2VyIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDoxNTMxIiwiYXVkIjoiYXBpIiwiZXhwIjoxNTIxNzcyNDYxLCJuYmYiOjE1MTY1ODg0NjF9.cfYs3h1KmMdExHPNevec1s2CLOSEcAuN1aIXiTiouhc',
  host: {
    passport: {
      'getUserInfo': 'http://10.0.0.138:8087', //获取用户信息，判断用户是否登录
      'authCode': 'http://dev.merchant.k8s.ichnb.com', //使用code换取access_token
      'auth': 'http://10.0.0.138:8090' // 通行证登录页 登录成功后会带上code跳转到回调地址
    },
    common: 'http://dev.merchant.k8s.ichnb.com', //左侧导航和头部导航 福禄管家通用接口
    log: 'http://10.0.0.189:10090', //日志管理 接口
    webapi: 'http://dev.openplatform.k8s.ichnb.com', //新接口的地址

    api: 'http://dev.merchant.k8s.ichnb.com', //api接口的地址
  }
};

// export default configs
