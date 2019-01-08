
# iuap 前端开发框架脚手架（React）


> 需要提前安装全局的 Node 环境

默认访问地址：

```
单表查询: http://127.0.0.1:3000/iuap-pap-training-fe/singletable-query#/
行内编辑: http://127.0.0.1:3000/iuap-pap-training-fe/singletable-inline-edit#/
弹框编辑: http://127.0.0.1:3000/iuap-pap-training-fe/singletable-popup-edit#/
多功能树: http://127.0.0.1:3000/iuap-pap-training-fe/tree#/
一主一子: http://127.0.0.1:3000/iuap-pap-training-fe/masterdetail-one#/
一主多子: http://127.0.0.1:3000/iuap-pap-training-fe/masterdetail-many#/
```

```
$ git clone https://github.com/yonyou-iuap/iuap-pap-training-fe.git
$ cd iuap-pap-training-fe
$ npm i
$ npm run dev
```


代理服务配置，打开`uba.config.js`：

```
const proxyConfig = [
  // 后台开发服务
  {
    enable: true,//启动开关
    headers: {
      "Referer": "http://0.0.0.0:0000"//后端服务校验的referer地址，和url地址一致
    },
    router: [
      '/iuap-pap-training-be'//代理到对方服务器的路由
    ],
    url: 'http://0.0.0.0:0000'//修改为自己的后端服务地址
  }
];
```

关于服务配置启动的说明请参考：https://github.com/iuap-design/tinper-uba



