import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import * as path from 'path';
import Datastore from 'nedb-promises';
//import { stageNames } from './stageNames';

// データベースの作成と初期データの挿入
async function initializeDatabase() {
  const db = Datastore.create({
    //filename: path.join(app.getPath('userData'), 'data.db'),
    filename: 'data.db',
    autoload: true,
  });

  //初期データ作成
  let initialData = [];
  for (let i=0; i<100; i++) {
    initialData[i] = {
      stageNumber: i+1, isLocked: false, clearTime: 0
    }
  }
  initialData[0].isLocked = true;
  //console.log(initialData);

  try {
    // 既にデータが存在するか確認
    const existingData = await db.find({});
    
    if (existingData.length === 0) {
      // データベースが空の場合、初期データを挿入
      const insertedData = await db.insert(initialData);
      console.log('Initial data inserted:', insertedData);
    } else {
      console.log('Database already contains data. Skipping initialization.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
  const allData = await db.find({});
  console.log('All data in the database:', allData);
}

// 初期化関数を実行
initializeDatabase();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Code Dungeon',
    icon: path.join(__dirname, '../dist/necromancer_anim_f0.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.bundle.js'),
      //nodeIntegration: true
    }
  })

  Menu.setApplicationMenu(null);
  //win.loadFile('title.html');
  //win.loadFile(path.join(__dirname, '../dist/title.html'));
  win.loadURL(`file://${path.join(__dirname, '../dist/title.html')}`);
  //win.webContents.openDevTools(); //開発者用ツール
  win.maximize();
  win.setAspectRatio(16/9);

  // データベースクエリの処理（実装途中）
  /*
  ipcMain.handle('query-database', async (event, query) => {
    try {
      const db = Datastore.create({
        filename: 'data.db',
        autoload: true,
      })
      const result = await db[query.type](query.query).execute();
      return result;
    } catch (error) {
      console.error('Error executing database query: ', error);
      throw error;
    }
  });
  */
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
