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

//use sqlx::sqlite::SqlitePoolOptions;

// use tauri::State for database pool?
// see: https://tauri.studio/docs/guides/command/#complete-example

// #[derive(serde::Serialize)]
// struct IdGeschaeft {
//   idGeschaeft: std::option::Option<i32>,
// }

// https://github.com/launchbadge/sqlx/issues/1637#issuecomment-1020651529
// #[tauri::command]
// async fn fts_search(
//   db_path: String,
//   search_text: Option<String>,
// ) -> Result<Vec<IdGeschaeft>, String> {
//   let connection_string = format!("sqlite:///{}", db_path);
//   let pool = SqlitePoolOptions::new()
//     .max_connections(5)
//     .connect(&connection_string)
//     .await
//     .map_err(|e| e.to_string())
//     .expect("error building connection pool");
//   // TODO: need to return if this errors
//   // But following does not work because error returned is not a string
//   // match pool {
//   //   Ok(pool) => pool,
//   //   Err(error) => return Err(error.to_string()),
//   // }
//   // match pool {
//   //   Ok(pool) => pool,
//   //   Err(error) => return Err(error),
//   // }

//   let rows = sqlx::query_as!(
//     IdGeschaeft,
//     "select idGeschaeft from fts where value match 'natur*'"
//   )
//   .fetch_all(&pool)
//   .await
//   .map_err(|e| e.to_string())
//   .expect("Error querying from fts");

//   // rows.into()

//   // match search_text {
//   //   NONE => {
//   //     let rows = sqlx::query_as!(IdGeschaeft, "select idGeschaeft from fts")
//   //     .fetch_all(&pool).await.map_err(|e| e.to_string());
//   //     rows.into()
//   //   }
//   //   Some(search_text) => {
//   //     let rows = sqlx::query_as!(IdGeschaeft, "select idGeschaeft from fts where value match (? || '*')", search_text)
//   //     .fetch_all(&pool).await.map_err(|e| e.to_string());
//   //     rows.into()
//   //   }
//   // }
// }

fn main() {
  let context = tauri::generate_context!();
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_username, exists_file])
    .plugin(TauriSql::default())
    .menu(if cfg!(target_os = "macos") {
      tauri::Menu::os_default(&context.package_info().name)
    } else {
      tauri::Menu::default()
    })
    .run(context)
    .expect("error while running tauri application");
}
