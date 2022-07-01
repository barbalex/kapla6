import { tauri } from '@tauri-apps/api'

const existsFile = async (path) => await tauri.invoke('exists_file', { path })

export default existsFile 
