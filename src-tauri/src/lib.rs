#[tauri::command]
fn start_multi_wechat() -> bool {
    return true
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![start_multi_wechat])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
