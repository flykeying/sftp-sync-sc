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

		  			function changeSft(){
		  				var sftpUpdate = sftp.put(config.localFilePath + path, config.remoteFilePath + path)
						sftpUpdate.catch((err)=>{}) // 禁止删除服务器没有的文件报错
						console.log("\033[44;32m [sftp] \033[0m Upload " + config.remoteFilePath + path  )
		  			}

		  			if (sftp.client._eventsCount == 0 ){
			  			sftp.connect(server).then(() => {
						    changeSft()
						}).catch((err) => {
						    console.log("\033[41;33m Upload error \033[0m " + err)
						    sftpUpdate = null
						});
		  			}else{
		  				changeSft()
		  			}


		  		}
			})
			.on('unlink', (path) => {
		  		if (ready == true && ignoredCheck(path) == true) {
		  			path = path.replace(/\\/g,"/")

		  			function unlinkSft(){
		  				var sftpDelete = sftp.delete( config.remoteFilePath + path)
						sftpDelete.catch((err)=>{}) // 禁止删除服务器没有的文件报错
					    console.log("\033[44;35m [sftp] \033[0m Delete " + config.remoteFilePath + path  )
		  			}
		  			if (sftp.client._eventsCount == 0 ){
						sftp.connect(server).then(() => {
							unlinkSft()
						}).catch((err) => {
						    console.log("\033[41;33m Upload error \033[0m " + err)
						});
		  			}else{
		  				unlinkSft()
		  			}
		  			
		  		}
			})
			.on('addDir', (path) => {
		  		if (ready == true && ignoredCheck(path) == true) {
		  			path = path.replace(/\\/g,"/")

		  			function addDirSft(){
		  				var sftpMkdir = sftp.mkdir( config.remoteFilePath + path)
						sftpMkdir.catch((err)=>{}) // 禁止删除服务器没有的文件报错
					    console.log("\033[44;32m [sftp] \033[0m Mkdir " + config.remoteFilePath + path  )
		  			}
		  			if (sftp.client._eventsCount == 0 ){
			  			sftp.connect(server).then(() => {
							addDirSft()
						}).catch((err) => {
						    console.log("\033[41;33m Mkdir error \033[0m " + err)
						});
		  			}else{
		  				addDirSft()
		  			}
		  		}
			})
			.on('unlinkDir', (path) => {
		  		if (ready == true && ignoredCheck(path) == true) {
		  			path = path.replace(/\\/g,"/")
		  			function unlinkDirSft(){
		  				var sftpRmdir = sftp.rmdir( config.remoteFilePath + path, true)
						sftpRmdir.catch((err)=>{}) // 禁止删除服务器没有的文件报错
					    console.log("\033[44;35m [sftp] \033[0m Rmdir " + config.remoteFilePath + path  )
		  			}
		  			if (sftp.client._eventsCount == 0 ){
			  			sftp.connect(server).then(() => {
							unlinkDirSft()
						}).catch((err) => {
						    console.log("\033[41;33m Rmdir error \033[0m " + err)
						});
		  			}else{
		  				unlinkDirSft()
		  			}
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