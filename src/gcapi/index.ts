import { authorize } from "./auth";
import { uploadFile, uploadStringToFile } from "./uploadfile";
import { findFile, findFolder } from "./findfiles";
import { deleteFile } from "./deletefile";
import { google } from "googleapis";

export async function replaceFile(folderPath: string, uploadFileName: string, content: string) {
  const authClient = await authorize();
  // check if the folder exists
  if (!(await findFolder(authClient, folderPath))) {
    throw `Folder ${folderPath} not found.`;
  }

  // check if the file exists
  const file = await findFile(authClient, uploadFileName);
  if (file) {
    // delete the file if exist
    console.log(`File ${uploadFileName} found, will try to delete it before uploading the newest version`);
    const deletionSucceed = await deleteFile(authClient, file.id);
    if (!deletionSucceed) {
      throw `File ${uploadFileName} deletion failed.`;
    }
  }

  // upload the file
  console.log(`Uploading content to ${folderPath} as ${uploadFileName}...`);
  await uploadStringToFile(authClient, folderPath, uploadFileName, content);
}

export async function readBlobContent(uploadFileName: string) {
  try {
    const authClient = await authorize();
    const drive = google.drive({ version: 'v3', auth: authClient });
    const file = await findFile(authClient, uploadFileName);

    if (!file) {
      throw `File ${uploadFileName} not found.`;
    }

    const res = await drive.files.get({
      fileId: file.id,
      alt: 'media',
    });

    const data = res.data;
    return data;
  }
  catch (error) {
    throw error;
  }
}

export async function readGDocsHTML(uploadFileName: string): Promise<string> {
  try {
    const authClient = await authorize();
    const file = await findFile(authClient, uploadFileName);
    const drive = google.drive({ version: 'v3', auth: authClient });

    if (!file) {
      throw `File ${uploadFileName} not found.`;
    }

    const res = await drive.files.export({
      fileId: file.id,
      mimeType: 'text/html',
    });

    const data = res.data as string;
    return data.toString();
  } catch (error) {
    throw error;
  }
}
