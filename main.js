const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'build', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
}

// ... (Ihr bestehender Code für die Fenstererstellung)
ipcMain.handle('save-data', async (event, data) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Speichern unter',
      defaultPath: path.join(app.getPath('documents'), 'projektstand.json'),
      filters: [{ name: 'JSON-Dateien', extensions: ['json'] }],
    });
    if (filePath) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return { success: true, message: 'Projekt erfolgreich gespeichert!' };
    }
    return { success: false, message: 'Speichern abgebrochen.' };
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
    return { success: false, message: `Fehler beim Speichern: ${error.message}` };
  }
});
ipcMain.handle('load-data', async (event) => {
  try {
    const { filePaths } = await dialog.showOpenDialog({
      title: 'Projekt laden',
      properties: ['openFile'],
      filters: [{ name: 'JSON-Dateien', extensions: ['json'] }],
    });
    if (filePaths && filePaths.length > 0) {
      const filePath = filePaths[0];
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return { success: true, data: JSON.parse(fileContent) };
    }
    return { success: false, message: 'Laden abgebrochen.' };
  } catch (error) {
    console.error('Fehler beim Laden:', error);
    return { success: false, message: `Fehler beim Laden: ${error.message}` };
  }
});

app.whenReady().then(createWindow);
