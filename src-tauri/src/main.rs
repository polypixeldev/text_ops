#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use text_ops_lib::TextOps;
use clap::ValueEnum;

#[derive(Debug, Clone, ValueEnum)]
enum Ops {
    Reverse,
    Weirdify,
    Capitalize,
    Uncapitalize,
    Owoify,
    Uwuify,
    Uvuify,
    All
}

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
    .setup(|app| {
      match app.get_cli_matches() {
        Ok(matches) => {
          if !matches.args.is_empty() {
            if let Some(help_message) = matches.args.get("help") {
              println!("{}", help_message.value.as_str().unwrap());
              app.handle().exit(0);
            }
  
            let mut transformed_message = matches.args.get("message").unwrap().value.as_str().unwrap().to_string();
            let ops = matches.args.get("ops").unwrap().value.as_array().unwrap().iter().map(|v| v.as_str().unwrap());
  
            ops.for_each(|op| {
                let op_enum = Ops::from_str(op, true).expect(format!("Invalid operation: {}", op).as_str());
  
                transformed_message = match op_enum {
                    Ops::Reverse => transformed_message.reverse(),
                    Ops::Weirdify => transformed_message.weirdify(),
                    Ops::Capitalize => transformed_message.capitalize(),
                    Ops::Uncapitalize => transformed_message.uncapitalize(),
                    Ops::Owoify => transformed_message.owoify(),
                    Ops::Uwuify => transformed_message.uwuify(),
                    Ops::Uvuify => transformed_message.uvuify(),
                    Ops::All => transformed_message.reverse().weirdify().capitalize().uncapitalize().owoify().uwuify().uvuify()
                }
            });
  
            println!("{}", transformed_message);
            app.handle().exit(0);
          }
        },
        Err(_) => {}
      }

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![transform])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
