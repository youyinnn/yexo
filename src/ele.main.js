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
        }
    })

    function isDev() {
        let rs = process.argv[2] === '--dev'
        process.env.APPENV = rs ? 'DEV' : 'PROD'
        return rs
    }

    var browserWindowOptions = {
        width: 400,
        height: 580,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        autoHideMenuBar: true,
        frame: false,
        resizable: false,
        x: 180,
        y: 100,
        show: false,
    }

    if (isDev()) {
        require('electron-nice-auto-reload')({
            rootPath: path.join(process.cwd(), 'src'),
            rules: [{
                    action: 'script',
                    target: '.*\\.less',
                    script: 'npm run less'
                },
                {
                    action: 'script',
                    target: '.*\\.js|.*\\.vue',
                    script: 'npm run devwp'
                },
                {
                    action: 'app.relaunch',
                    target: 'ele\\.main\\.js'
                },
                {
                    action: 'app.reload',
                    target: 'bundle\\.js'
                }
            ],
            log: true,
            devToolsReopen: true
        })

        createWindow = () => {
            // Create the browser window.
            win = new BrowserWindow(browserWindowOptions);

            // and load the index.html of the app.
            win.loadFile(path.join(__dirname, 'index.html'));

            // Open the DevTools.
            // https://github.com/SimulatedGREG/electron-vue/issues/389
            win.webContents.on("did-frame-finish-load", () => {
                win.webContents.once("devtools-opened", () => {
                    win.focus()
                })
                win.webContents.openDevTools()
            })
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
            const os = require('os');
            if (os.type() == 'Windows_NT') {
                //windows

                // BrowserWindow.addDevToolsExtension(path.join(process.env.LOCALAPPDATA, 'Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.3.3_0', ))
            } else if (os.type() == 'Darwin') {
                //mac
                // BrowserWindow.addDevToolsExtension('/Users/yinnnyou/Library/ApplicationSupport/Google/Chrome/Profile 1/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.3.3_0')
            } else if (os.type() == 'Linux') {
                //Linux
            }
        }
    } else {
        createWindow = () => {
            // Create the browser window.
            win = new BrowserWindow(browserWindowOptions);

            // and load the index.html of the app.
            win.loadFile(path.join(__dirname, 'index.html'));

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
    }

    exports.win = win

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