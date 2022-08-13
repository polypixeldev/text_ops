#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use text_ops_lib::TextOps;

#[tauri::command]
fn transform(message: String, ops: Vec<String>) -> String {
  let mut transformed_message = message;

  for op in ops {
    transformed_message = match op.as_str() {
      "reverse" => transformed_message.reverse(),
      "weirdify" => transformed_message.weirdify(),
      "capitalize" => transformed_message.capitalize(),
      "uncapitalize" => transformed_message.uncapitalize(),
      "owoify" => transformed_message.owoify(),
      "uwuify" => transformed_message.uwuify(),
      "uvuify" => transformed_message.uvuify(),
      _ => transformed_message
    }.to_string()
  }

  transformed_message
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![transform])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
