import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu
} from 'electron';
import {
  autoUpdater
} from 'electron-updater';
import Store from 'electron-store';
import log from 'electron-log';
import MenuBuilder from './menu';
import {
  resolveHtmlPath
} from './util';
import { mac } from 'address';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const store = new Store();
// store.set('valid', false);
// store.set('data', '')  


let mainWindow: BrowserWindow | null = null;
const authWindowSize = [500, 210]
const mainWindowSize = [1280, 728]

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async (w: number, h: number) => {
  if (isDebug) {
    // await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged ?
    path.join(process.resourcesPath, 'assets') :
    path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };


  mainWindow = new BrowserWindow({
    show: false,
    width: w,
    height: h,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar: true,
    resizable: app.isPackaged ? false : true,
    webPreferences: {
      devTools: app.isPackaged ? false : true,
      preload: app.isPackaged ?
        path.join(__dirname, 'preload.js') :
        path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return {
      action: 'deny'
    };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  store.get('valid') && new AppUpdater();
};
/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('check-auth', (event, args) => {
  event.reply('check-auth', store.get('valid'));
  if (args) {
    store.set('valid', args)
    event.reply('check-auth', args);
  }
});

ipcMain.on('get-data-user', (event, args) => {
  event.reply('get-data-user', store.get('data'));
});

ipcMain.on('logout', (event, args) => {
  store.set('valid', false);
  store.set('data', '');
  event.reply('check-auth', false);
  handleWindow(false)
});

let macs = '';
mac(function (err, addr) {
  macs = addr as string;
});

ipcMain.on('get-mac', (event, args) => {
  event.reply('get-mac', macs);
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    handleWindow(store.get('valid') as boolean);
  }
});


// [BUG] => RESIZE WINDOW
function handleWindow(valid: boolean) {
  if (valid) {
    mainWindow?.setSize(mainWindowSize[0], mainWindowSize[1]);
    mainWindow?.center();
  } else {
    mainWindow?.setSize(authWindowSize[0], authWindowSize[1]);
    mainWindow?.center();
  }
}

ipcMain.on('re-session', (event, args) => {
  event.reply('re-session', store.get('data'));
}); 

app
  .whenReady()
  .then(() => {
    if (store.get('valid')) {
      createWindow(mainWindowSize[0], mainWindowSize[1]);
    } else {
      createWindow(authWindowSize[0], authWindowSize[1]);
    }

    ipcMain.on('activate-main-apps', (event, args) => {
      handleWindow(true)
      store.set('data', JSON.stringify(args))
      event.reply('get-data-user');
    });
  })
  .catch(console.log);

