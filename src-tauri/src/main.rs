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
  let some_file = std::path::Path::new(path);
  let exists = some_file.exists();
  return exists;
}

// issue: sqlx returning null values when querying fts5
// https://github.com/launchbadge/sqlx/issues/1637
// Idea: query in rust, try to type the idGeschaeft column?
// use `try_get_unchecked`? https://github.com/launchbadge/sqlx/issues/1596#issue-1087723444
// querying sqlite in rust example: https://github.com/launchbadge/sqlx/issues/1596#issuecomment-1000574562


// #[tauri::command]
// fn inform_choose_db() {
//   tauri::api::dialog::message(
//     parent_window: Option::<tauri::Wry>::None,
//   title: "Datenbank-Datei wählen", 
//   message: "Bitte wählen Sie im nachfolgenden Dialog die passende Datenbank-Datei");
// }

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![get_username, exists_file])
  .plugin(TauriSql::default())
    .run(tauri::generate_context!())
     .expect("error while running tauri application");
}
