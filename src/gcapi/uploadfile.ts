import * as fs from 'fs';
import * as path from 'path'
import { google, Auth } from 'googleapis';
import { findFolder } from './findfiles';

import { Readable } from 'stream'

class ReadableString extends Readable {
  private sent = false

  constructor(private str: string) {
    super();
  }

  _read() {
    if (!this.sent) {
      this.push(Buffer.from(this.str));
      this.sent = true
    }
    else {
      this.push(null)
    }
  }
}

export async function uploadFile(authClient: Auth.OAuth2Client, folderName: string, fileName: string, localFilepath: string) {
  const folder = await findFolder(authClient, folderName);
  if (!folder) {
    throw `Folder ${folderName} not found, please check google drive.`;
  }

  const requestBody = {
    name: fileName,
    parents: [folder.id],
  } as any;

  const absolutePath = path.join(path.resolve("."), localFilepath);
  const media = {
    mimeType: 'text/plain',
    body: fs.createReadStream(absolutePath),
  };

  const drive = google.drive({ version: 'v3', auth: authClient });
  const res = await drive.files.create({ requestBody: requestBody as any, media });
  if (res.status !== 200) {
    console.log(`Failed to upload ${localFilepath} to ${folder.name}.`);
    return;
  }
}

export async function uploadStringToFile(authClient: Auth.OAuth2Client, folderName: string, fileName: string, content: string) {
  const folder = await findFolder(authClient, folderName);
  if (!folder) {
    throw `Folder ${folderName} not found, please check google drive.`;
  }

  const requestBody = {
    name: fileName,
    parents: [folder.id],
  };

  const media = {
    mimeType: 'text/plain',
    body: new ReadableString(content),
  };

  const drive = google.drive({ version: 'v3', auth: authClient });
  const res = await drive.files.create({ requestBody: requestBody as any, media });
  if (res.status !== 200) {
    console.log(`Failed to upload content to ${folder.name}.`);
    return;
  }
}

