#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri_plugin_sql::TauriSql;

#[tauri::command]
fn get_username() -> String {
    whoami::username()
}

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![get_username])
  .plugin(TauriSql::default())
    .run(tauri::generate_context!())
     .expect("error while running tauri application");
}
