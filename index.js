const chokidar = require('chokidar')
const Client = require('ssh2-sftp-client')

module.exports = (cf) =>{
	let ready = false,
		sftp = new Client(),
		ignored = cf.ignored,
		config = {
			localFilePath:cf.localFilePath,
			remoteFilePath:cf.remoteFilePath
		},
		server = {
			host:cf.host,
			port:cf.port,
			username:cf.username,
			password:cf.password
		}
	chokidar.watch('.', {ignored: /(^|[\/\\])\../})
			.on('ready', () => {
		  		ready = true
		  		console.clear()
		  		console.log("\033[44;37m [start] \033[0m monitoring directorie ：" + config.localFilePath )
			})
			// .on('all',(event, path) => {
			//   console.log(event, path);
			// })
			.on('change', (path) => {
		  		if (ready == true && ignoredCheck(path) == true) {
		  			path = path.replace(/\\/g,"/")
		  			console.log("\033[44;37m [change] \033[0m " + config.localFilePath + path + " file is saved" )
		  			sftp.connect(server).then(() => {
		  				
					    var sftpUpdate = sftp.put(config.localFilePath + path, config.remoteFilePath + path)
						sftpUpdate.catch((err)=>{}) // 禁止删除服务器没有的文件报错
					    console.log("\033[44;32m [sftp] \033[0m Upload " + config.remoteFilePath + path  )
					}).catch((err) => {
					    console.log("\033[41;33m Upload error \033[0m " + err)
					});
		  		}
			})
			.on('unlink', (path) => {
		  		if (ready == true && ignoredCheck(path) == true) {
		  			path = path.replace(/\\/g,"/")
		  			sftp.connect(server).then(() => {
						var sftpDelete = sftp.delete( config.remoteFilePath + path)
						sftpDelete.catch((err)=>{}) // 禁止删除服务器没有的文件报错
					    console.log("\033[44;35m [sftp] \033[0m Delete " + config.remoteFilePath + path  )
					}).catch((err) => {
					    console.log("\033[41;33m Upload error \033[0m " + err)
					});
		  		}
			})
			.on('addDir', (path) => {
		  		if (ready == true && ignoredCheck(path) == true) {
		  			path = path.replace(/\\/g,"/")
		  			sftp.connect(server).then(() => {
						var sftpMkdir = sftp.mkdir( config.remoteFilePath + path)
						sftpMkdir.catch((err)=>{}) // 禁止删除服务器没有的文件报错
					    console.log("\033[44;35m [sftp] \033[0m Mkdir " + config.remoteFilePath + path  )
					}).catch((err) => {
					    console.log("\033[41;33m Mkdir error \033[0m " + err)
					});
		  		}
			})
			.on('unlinkDir', (path) => {
		  		if (ready == true && ignoredCheck(path) == true) {
		  			path = path.replace(/\\/g,"/")
		  			sftp.connect(server).then(() => {
						var sftpRmdir = sftp.rmdir( config.remoteFilePath + path, true)
						sftpRmdir.catch((err)=>{}) // 禁止删除服务器没有的文件报错
					    console.log("\033[44;35m [sftp] \033[0m Rmdir " + config.remoteFilePath + path  )
					}).catch((err) => {
					    console.log("\033[41;33m Rmdir error \033[0m " + err)
					});
		  		}
			})
			.on("error",()=>{})

	function ignoredCheck(path){
		for (let i in ignored){
			var reg = new RegExp(ignored[i],"gim")
			if ( path.search(reg) > -1){
				return false
			} 
		}
		return true
	}
}