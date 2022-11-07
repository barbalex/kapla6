<<<<<<< HEAD
import { invoke } from '@tauri-apps/api/tauri'

const existsFile = async (path) => await invoke('exists_file', { path })

export default existsFile
=======
import { tauri } from '@tauri-apps/api'

const existsFile = async (path) => await tauri.invoke('exists_file', { path })

export default existsFile 
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
