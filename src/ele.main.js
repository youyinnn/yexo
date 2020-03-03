const {
    app,
    BrowserWindow,
    globalShortcut,
    dialog
} = require('electron');
const path = require('path');
let win
let createWindow

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到myWindow这个窗口
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
            dialog.showMessageBoxSync(win, {
                type: 'info',
                title: '提示',
                buttons: ['知道了'],
                message: '程序已经存在',
                detail: '请不要重复启动',
            })
        }
    })

    function isDev() {
        let rs = process.argv[2] === '--dev'
        process.env.APPENV = rs ? 'DEV' : 'PROD'
        return rs
    }

    if (isDev()) {
        require('electron-nice-auto-reload')({
            rootPath: path.join(process.cwd(), 'src'),
            rules: [{
                    action: 'script',
                    target: '.*\.less',
                    script: 'npm run less'
                },
                {
                    action: 'script',
                    target: '.*\.js',
                    script: 'npm run wp'
                },
                {
                    action: 'app.relaunch',
                    target: 'ele.main.js'
                },
                {
                    action: 'app.reload',
                    target: 'bundle.js'
                }
            ],
            log: true,
            devToolsReopen: true
        })

        createWindow = () => {
            // Create the browser window.
            win = new BrowserWindow({
                width: 400,
                height: 600,
                webPreferences: {
                    nodeIntegration: true,
                },
                autoHideMenuBar: true,
                frame: false,
                // resizable: false,
                x: 180,
                y: 100,
                show: false
            });

            // and load the index.html of the app.
            win.loadFile(path.join(__dirname, 'index.html'));

            // Open the DevTools.
            win.webContents.openDevTools();
            win.on('closed', () => {
                win = null
            })
            win.once('ready-to-show', () => {
                setTimeout(() => {
                    win.show()
                }, 200);
            })
            global.share = {
                win: win,
                isDev: isDev,
            }
            globalShortcut.register('CommandOrControl+O', () => {
                if (win.webContents.isDevToolsOpened()) {
                    win.webContents.closeDevTools()
                } else {
                    win.webContents.openDevTools()
                }
            })
            globalShortcut.register('CommandOrControl+Shift+C', () => {
                app.quit()
            })
        }
    } else {

    }

    app.on('ready', createWindow)

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
}