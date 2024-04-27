const path = require('path');
module.exports = (_page='./src/fdconnect.html', _showTitlebar=true, width=800, height=600, isUrl=false) => {
  const {app, BrowserWindow} = require('electron');
  app.on('ready', () => {
    const mainWindow = new BrowserWindow({
      width,
      height,
      frame: _showTitlebar,
      icon: path.resolve('./assets/logo_big.ico'),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });
    console.log('Here we go!');
    if (!isUrl) mainWindow.loadFile(path.resolve(_page));
    else mainWindow.loadURL(_page);
  });

  app.on('window-all-closed', (e) => {
    console.log('Exiting Freedeck!');
    process.exit(0);
  });

  return app;
};
