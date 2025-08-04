const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 800
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'build', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
}

app.whenReady().then(createWindow);
