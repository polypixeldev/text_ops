#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::fmt;
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

impl fmt::Display for Ops {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self)
  }
}

#[tauri::command]
fn transform(message: String, ops: Vec<String>) -> String {
  let mut transformed_message = message;
  println!("{:?}", ops);

  for op in ops {
    transformed_message = match op.as_str() {
      "Reverse" => transformed_message.reverse(),
      "Weirdify" => transformed_message.weirdify(),
      "Capitalize" => transformed_message.capitalize(),
      "Uncapitalize" => transformed_message.uncapitalize(),
      "Owoify" => transformed_message.owoify(),
      "Uwuify" => transformed_message.uwuify(),
      "Uvuify" => transformed_message.uvuify(),
      "All" => transformed_message.reverse().weirdify().capitalize().uncapitalize().owoify().uwuify().uvuify(),
      _ => transformed_message
    }.to_string()
  }

  transformed_message
}

#[tauri::command]
fn get_ops() -> Vec<String> {
  let enum_variants = Ops::value_variants();
  enum_variants.iter().map(|v| v.to_string()).collect()
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
    .invoke_handler(tauri::generate_handler![transform, get_ops])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
