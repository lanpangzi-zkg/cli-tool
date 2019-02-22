// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs-extra');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  mainWindow.loadURL(`file://${__dirname}/build/index.html`) //主窗口
  // mainWindow.loadURL('http://localhost:3000/')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('asynchronous-message', function (event, arg) {
  const pageParams = JSON.parse(arg);
  const { pageName, layoutConfig } = pageParams;
  const filePath = path.resolve(__dirname, 'template/basicPage.ejs');
  ejs.renderFile(filePath, { pageName, layoutConfig }, function (err, data) {
    const msgObj = {
      code: 1,
      info: '生成页面成功',
    };
    if(err) {
      msgObj.code = 0;
      msgObj.info = '页面生成失败:' + JSON.stringify(err);
      event.sender.send('asynchronous-reply', JSON.stringify(msgObj));
    } else {
      fs.ensureDir(`${process.cwd()}/sourceCode`);
      const codeSourcePath = path.resolve(process.cwd(), `sourceCode/${pageName}.js`);
      fs.writeFileSync(codeSourcePath, data);
      event.sender.send('asynchronous-reply', JSON.stringify(msgObj));
    }
  });
});
