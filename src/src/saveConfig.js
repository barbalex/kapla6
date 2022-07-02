import { fs, path } from '@tauri-apps/api'

const saveConfig = async (data) => {
	console.log('saveConfig', { data })
	const userPath = await path.appDir() // C:\Users\alexa\AppData\Roaming\Kapla\
	const contents = JSON.stringify(data, null, 2)
	const _path = `${userPath}kaplaConfig.json`

	console.log('saveConfig', { userPath, path: _path, contents })

	try {
		await fs.writeTextFile({
			contents,
			path: _path,
		})
	} catch (error) {
		console.log('saveConfig, error writing config:', error)
	}

	return
}

export default saveConfig
