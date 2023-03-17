const electron = require('electron')
const debug = require('../cliUtil')

const {
  app,
  BrowserWindow
} = electron

function createWindow () {
  const window = new BrowserWindow({
    width: 1280,
    height: 720
  })
  debug.log('Electron window created - loading server-side Companion')
  window.loadURL('http://localhost:3000/assets/companion/index.html')
}

app.whenReady().then(() => {
  debug.log('Electron window ready')
  createWindow()
})
