'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');

let mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 500, height: 250});

  mainWindow.loadURL('file://' + __dirname + '/dist/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
