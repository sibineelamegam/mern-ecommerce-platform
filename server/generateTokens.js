import crypto from "crypto";
import { appendFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get current file location (ESM-safe __dirname & __filename)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to .env (explicit ./)
const envPath = path.join(__dirname, "./.env");

// Generate secrets
const accessTokenSecret = crypto.randomBytes(64).toString("hex");
const refreshTokenSecret = crypto.randomBytes(64).toString("hex");

// Format new entries
const envEntry = `\nACCESS_TOKEN_SECRET=${accessTokenSecret}\nREFRESH_TOKEN_SECRET=${refreshTokenSecret}\n`;

async function main() {
  try {
    await appendFile(envPath, envEntry);
    console.log("✅ Secrets generated and added to .env");
    console.log("ACCESS_TOKEN_SECRET:", accessTokenSecret);
    console.log("REFRESH_TOKEN_SECRET:", refreshTokenSecret);
  } catch (err) {
    console.error("❌ Failed to write secrets to .env:", err);
  }
}

main();

/*
| Variable     | Holds this value                                         |
| ------------ | --------------------------------------------- |
| `__filename` | Full path to the current file                 |
| `__dirname`  | Full path to the folder containing this file  |

__filename = "/Users/flare/Projects/blog/server/generateTokens.js"
__dirname = "/Users/flare/Projects/blog/server"


10011111 (8 bits,base 2)
   ↓
9f (one byte,base 16)
   ↓
0x9f (hexadecimal numeric notation)
   ↓
"9f" (string with 2 characters)

*/
