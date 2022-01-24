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
// https://github.com/launchbadge/sqlx#quickstart

use sqlx::sqlite::SqlitePoolOptions;
use async_std::task;

//#[async_std::main]
// #[tauri::command]
// async fn fts_search(dbpath: &str, searchtext: &str) -> Result<Vec<i64>, sqlx::Error> {
//   let connection_string = format!("sqlite://{}", dbpath);
//   let pool = SqlitePoolOptions::new()
//       .max_connections(5)
//       .connect(&connection_string).await?;

//   #[derive(sqlx::FromRow)]
//   struct IdGeschaeft { idGeschaeft: i64 }
//   let rows = sqlx::query_as::<_, IdGeschaeft>("select idGeschaeft from fts where value match '\"?\"*'")
//       .bind(searchtext)
//       .fetch_one(&pool);

//   while let Some(row) = rows.try_next().await? {
//     // map the row into a user-defined domain type
//     let idGeschaeft: i64 = row.try_get("idGeschaeft")?;
//   }
// }

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![get_username, exists_file])
  .plugin(TauriSql::default())
    .run(tauri::generate_context!())
     .expect("error while running tauri application");
}
