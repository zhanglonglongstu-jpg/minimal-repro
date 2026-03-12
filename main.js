const { app, BrowserWindow, screen } = require('electron')
const path = require('path')

function createWindow () {
  const { width, height } = screen.getPrimaryDisplay().bounds
  const mainWindow = new BrowserWindow({
    width, height,
    fullscreen: true,       // 全屏
    frame: false,           // 无边框
    alwaysOnTop: true,      // 置顶
    skipTaskbar: true,      // 不在任务栏显示
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  })

  mainWindow.loadFile('index.html')

  // 核心：监控用户操作，一旦有动静就关闭程序（屏保特性）
  const exitOnAction = `
    let moved = false;
    window.onmousemove = (e) => {
      if (!moved) { moved = true; return; } // 忽略初始触发
      window.close();
    };
    window.onkeydown = () => window.close();
    window.onmousedown = () => window.close();
  `;
  mainWindow.webContents.executeJavaScript(exitOnAction);
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())
