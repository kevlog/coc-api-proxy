import fs from "fs";
import readline from "readline";
import path from "path";

export default async function askQuestion() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (text) =>
    new Promise((resolve) => rl.question(text, resolve));

  const port = await question("Masukkan PORT: ");
  const apiKey = await question("Masukkan COC_API_KEY: ");
  rl.close();

  const envContent = `PORT=${port.trim()}\nCOC_API_KEY=${apiKey.trim()}\n`;
  fs.writeFileSync(path.resolve(".env"), envContent);
}
