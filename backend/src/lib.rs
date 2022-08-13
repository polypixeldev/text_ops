use owoify_rs::{Owoifiable, OwoifyLevel};

pub trait TextOps {
	fn reverse(&self) -> String;
	fn weirdify(&self) -> String;
	fn capitalize(&self) -> String;
	fn uncapitalize(&self) -> String;
	fn owoify(&self) -> String;
	fn uwuify(&self) -> String;
	fn uvuify(&self) -> String;
}

impl TextOps for String {
	fn reverse(&self) -> String {
		self.chars().rev().collect::<String>()
	}

	fn weirdify(&self) -> String {
		let mut chars = self.chars().collect::<Vec<char>>();
		chars = chars.iter().map(|c| c.to_ascii_lowercase()).collect::<Vec<char>>();
		let char_len = self.chars().count();
		let mut alphabetic_i = 0;
		
		for i in 0..char_len {
			let c = chars[i];
			
			if c.is_alphabetic() {
				alphabetic_i += 1;
				if alphabetic_i % 2 == 0 {
					if c.is_uppercase() {
						chars[i] = c.to_ascii_lowercase();
					} else {
						chars[i] = c.to_ascii_uppercase();
					}
				}
			}
		}
	
		chars.iter().collect::<String>()
	}

	fn capitalize(&self) -> String {
		self.to_ascii_uppercase()
	}

	fn uncapitalize(&self) -> String {
		self.to_ascii_lowercase()
	}

	fn owoify(&self) -> String {
		<Self as Owoifiable>::owoify(self, OwoifyLevel::Owo)
	}

	fn uwuify(&self) -> String {
		<Self as Owoifiable>::owoify(self, OwoifyLevel::Uwu)
	}

	fn uvuify(&self) -> String {
		<Self as Owoifiable>::owoify(self, OwoifyLevel::Uvu)
	}
}