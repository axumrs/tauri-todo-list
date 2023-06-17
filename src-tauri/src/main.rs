// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct Todo {
    pub id: i64,
    pub title: String,
    pub is_done: bool,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn add_item(title: &str) -> Result<i64, String> {
    let conn = get_conn().await.map_err(|e| e.to_string())?;
    let id = sqlx::query("INSERT INTO todos (title,is_done) VALUES (?,?)")
        .bind(title)
        .bind(false)
        .execute(&conn)
        .await
        .map_err(|e| e.to_string())?
        .last_insert_rowid();
    Ok(id)
}

#[tauri::command]
async fn list() -> Result<Vec<Todo>, String> {
    let conn = get_conn().await.map_err(|e| e.to_string())?;
    let data = sqlx::query_as("SELECT * FROM todos ORDER BY id DESC")
        .fetch_all(&conn)
        .await
        .map_err(|e| e.to_string())?;
    Ok(data)
}

#[tauri::command]
async fn edit(item: Todo) -> Result<u64, String> {
    let conn = get_conn().await.map_err(|e| e.to_string())?;
    let aff = sqlx::query("UPDATE todos SET title=? WHERE id=?")
        .bind(&item.title)
        .bind(&item.id)
        .execute(&conn)
        .await
        .map_err(|e| e.to_string())?
        .rows_affected();
    Ok(aff)
}

#[tauri::command]
async fn del(id: i64) -> Result<u64, String> {
    let conn = get_conn().await.map_err(|e| e.to_string())?;
    let aff = sqlx::query("DELETE FROM todos WHERE id=?")
        .bind(id)
        .execute(&conn)
        .await
        .map_err(|e| e.to_string())?
        .rows_affected();
    Ok(aff)
}

#[tauri::command]
async fn check(id: i64) -> Result<u64, String> {
    let conn = get_conn().await.map_err(|e| e.to_string())?;
    let aff = sqlx::query("UPDATE todos SET is_done=(NOT is_done) WHERE id=?")
        .bind(id)
        .execute(&conn)
        .await
        .map_err(|e| e.to_string())?
        .rows_affected();
    Ok(aff)
}

#[tauri::command]
async fn del_done() -> Result<u64, String> {
    let conn = get_conn().await.map_err(|e| e.to_string())?;
    let aff = sqlx::query("DELETE FROM todos WHERE is_done=?")
        .bind(true)
        .execute(&conn)
        .await
        .map_err(|e| e.to_string())?
        .rows_affected();
    Ok(aff)
}

#[tauri::command]
async fn check_all(is_done: bool) -> Result<u64, String> {
    let conn = get_conn().await.map_err(|e| e.to_string())?;
    let aff = sqlx::query("UPDATE todos SET is_done=?")
        .bind(is_done)
        .execute(&conn)
        .await
        .map_err(|e| e.to_string())?
        .rows_affected();
    Ok(aff)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            add_item, list, edit, del, check, del_done, check_all
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn get_conn() -> std::result::Result<sqlx::SqlitePool, sqlx::Error> {
    let db_path = std::env::var("TODO_DB").unwrap_or("todo.db".to_string());
    let db_url = format!("sqlite://{}", db_path);
    sqlx::sqlite::SqlitePoolOptions::new()
        .connect(&db_url)
        .await
}
