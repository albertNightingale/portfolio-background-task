import * as path from "path";

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(path.resolve("."), "chrome_auth", 'token.json');
const CREDENTIALS_PATH = path.join(path.resolve("."), "chrome_auth", 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

export {
  TOKEN_PATH,
  CREDENTIALS_PATH,
  SCOPES
};