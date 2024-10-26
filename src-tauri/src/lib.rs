use tauri::AppHandle;
use tauri_plugin_shell::ShellExt;

#[tauri::command]
fn start_multi_wechat(app_handle: AppHandle, path: &str, num: i32) {
    let shell = app_handle.shell();
    tauri::async_runtime::block_on(async move {
        let mut args = vec![];
        args.push("/c".to_string());
        for i in 0..num {
            args.push("start".to_string());
            let str = format!("{}", path);
            args.push(str);
            if i != num - 1 {
                args.push("&&".to_string());
            }
        }
        shell.command("cmd").args(&args).spawn().expect("启动失败");
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![start_multi_wechat])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
