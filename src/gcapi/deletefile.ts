import { Auth, google } from "googleapis";

export async function deleteFile(authClient: Auth.OAuth2Client, fileID: string) {
  const drive = google.drive({ version: 'v3', auth: authClient });
  const res = await drive.files.delete({ fileId: fileID });
  // console.log("response status", res.status);
  return res.status <= 300;
}