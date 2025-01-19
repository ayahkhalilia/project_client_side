// src/main.js (Electron's main file)
import { app, BrowserWindow } from 'electron';
import path from 'path';

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
  
    },
    autoHideMenuBar: true,
  });

  // Make sure to load the built React app
  mainWindow.loadURL(path.join('file://', __dirname, '../build/index.html'));

  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
