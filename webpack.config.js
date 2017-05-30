function buildConfig(env) {
  if(env === 'pro'){
		const rtn = require('./' + env + '.js')
		return rtn
	}else{
		const rtn = require('./dev.js')
		return rtn
	}
}
module.exports = buildConfig;