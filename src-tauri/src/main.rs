#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri_plugin_sql::TauriSql;

#[tauri::command]
fn get_username() -> String {
    whoami::username()
}

#[tauri::command]
fn exists_file(path: &str) -> bool {
  println!("exists_file running, path: {}", path);
  let some_file = std::path::Path::new(path);
  let exists = some_file.exists();
  println!("exists_file running, exists: {}", exists);
  return exists;
}

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![get_username, exists_file])
  .plugin(TauriSql::default())
    .run(tauri::generate_context!())
     .expect("error while running tauri application");
}
