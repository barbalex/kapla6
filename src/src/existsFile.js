import { invoke } from '@tauri-apps/api/tauri'

const existsFile = async (path) => await invoke('exists_file', { path })

export default existsFile
