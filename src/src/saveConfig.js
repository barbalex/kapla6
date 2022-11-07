<<<<<<< HEAD
import { appDir } from '@tauri-apps/api/path'
import { writeTextFile } from '@tauri-apps/api/fs'

const saveConfig = async (data) => {
  const userPath = await appDir() // C:\Users\alexa\AppData\Roaming\Kapla\

  return writeTextFile(
    `${userPath}kaplaConfig.json`,
    JSON.stringify(data, null, 2),
  )
=======
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
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
}

export default saveConfig
