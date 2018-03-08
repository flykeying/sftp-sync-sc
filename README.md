# sftp-sync-sc

模块提供基于node，利用sftp模式，同步服务端与客户端的文件夹。

```javascript
const sync = require("sftp-sync-sc")

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

## 注意

创建文件并不触发上传，只有保存后才进行上传