
import { google, Auth } from 'googleapis';

export async function printFolders(authClient: Auth.OAuth2Client) {
  const folders = await getFiles(authClient, 'mimeType = \'application/vnd.google-apps.folder\'');
  console.log('Folders:');
  folders?.forEach((file) => {
    console.log(`${file.name} (${file.id})`);
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
export async function getFiles(authClient: Auth.OAuth2Client, query: string = '') {
  const drive = google.drive({ version: 'v3', auth: authClient });
  const res = await drive.files.list({
    pageSize: 10,
    q: query,
    fields: 'nextPageToken, files(id, name)',
  });
  const result = res.data.files;
  if (result?.length === 0) {
    return null;
  }

  return result;
}

export async function findFolder(authClient: Auth.OAuth2Client, folderName: string) {
  const folders = await getFiles(authClient, 'mimeType = \'application/vnd.google-apps.folder\'');
  const result = folders?.find((file) => { return file.name === folderName });

  if (!result) {
    return null;
  }

  return {
    name: result?.name,
    id: result?.id,
  }
}

export async function findFile(authClient: Auth.OAuth2Client, fileName: string) {
  const files = await getFiles(authClient, `name = '${fileName}'`);

  if (!files || files.length === 0) {
    return null;
  }

  const file = files[0];
  if (!file.name || !file.id) {
    return null;
  }

  return {
    name: file.name,
    id: file.id,
  }
}
