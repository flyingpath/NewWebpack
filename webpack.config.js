function buildConfig(env) {
  if(env.type === 'pro'){
		const rtn = require('./pro.js')(env)
		return rtn
	}else{
		const rtn = require('./dev.js')(env)
		return rtn
	}
}
module.exports = buildConfig;