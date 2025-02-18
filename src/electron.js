const electron = require('electron')
// Module to control application life.
const { app, ipcMain } = require('electron')
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const { dialog } = require('electron')

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let helpWindow

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1025,
		height: 800,
		webPreferences: { nodeIntegration: true },
		titleBarStyle: 'hidden', //frameless
	})

	// and load the index.html of the app.
	const startUrl =
		process.env.ELECTRON_START_URL ||
		url.format({
			pathname: path.join(__dirname, '/../build/index.html'),
			protocol: 'file:',
			slashes: true,
		})
	mainWindow.loadURL(startUrl)

	// Open the DevTools.
	if (startUrl == process.env.ELECTRON_START_URL) {
		const {
			default: installExtension,
			REACT_DEVELOPER_TOOLS,
		} = require('electron-devtools-installer')
		mainWindow.webContents.openDevTools()

		// Install React Dev Tools for or Dev Session
		installExtension(REACT_DEVELOPER_TOOLS)
			.then((name) => {
				console.log(
					`Added Extension:  ${name}, to use extension reload election (Ctrl+R)`
				)
			})
			.catch((err) => {
				console.log('An error occurred: ', err)
			})
	}

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
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('synchronous-message', (event, arg) => {
	console.log(arg) // prints "ping"
	event.sender.send('synchronous-reply', 'pong')
	//const pathArray = dialog.showOpenDialog({properties: ['openDirectory']})
	//console.log(dialog.showOpenDialog({properties: ['openDirectory']}))
})
