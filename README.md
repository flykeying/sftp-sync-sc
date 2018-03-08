# sftp-sync-sc

模块提供基于node，利用sftp模式，同步服务端与客户端的文件夹。

```javascript
const sync = require("./modules/dev.js")

sync({
		host:'ip地址',
		port:'端口一般是22',
		username:'sftp用户名',
		password:'sftp密码',
		ignored:["node_modules",".log"],
		remoteFilePath:"服务端路径地址",
		localFilePath:__dirname +"\\"
})
```

