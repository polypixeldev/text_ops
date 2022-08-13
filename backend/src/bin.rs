use clap::{Parser, CommandFactory, ValueEnum};
use text_ops_lib::TextOps;

#[derive(Parser, Debug)]
#[clap(name = "TextOps")]
#[clap(version = "1.0.0")]
#[clap(about = "Performs various operations on a given string")]
struct CliArgs {
    message: String,
    #[clap(arg_enum, multiple_values = true, value_delimiter = ',')]
    ops: Vec<Ops>
}

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

fn main() {
    let cmd = CliArgs::command();
    let matches = cmd.get_matches();
    let ops = matches.get_many::<String>("ops").unwrap_or_default();

    let mut transformed_message = matches.get_one::<String>("message").unwrap().to_string();

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
}