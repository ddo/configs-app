var app = require('app'); // Module to control application life.
var BrowserWindow = require('browser-window'); // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 480,
        height: 660
    });

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});

app.on('window-all-closed', function() {
    app.quit();
});

var path   = require('path');
var dialog = require('dialog');
var ipc    = require('ipc');

var CSGO = require('configs-csgo');

var csgo = CSGO();

ipc.on('dialog', function(event, arg) {
    dialog.showOpenDialog({properties: ['openDirectory']}, function(dir_array) {
        if(!dir_array) {
            return app.quit();
        }

        var dir = dir_array[0];
        csgo.path = path.join(dir, 'steamapps/common/Counter-Strike Global Offensive');

        csgo.checkDir(function(exists) {
            event.sender.send('checkDir', exists);
        });
    });
});

ipc.on('checkDir', function(event, arg) {
    csgo.checkDir(function(exists) {
        event.sender.send('checkDir', exists);
    });
});

ipc.on('run', function(event, arg) {
    csgo.run();
});

ipc.on('show_dmg', function(event, arg) {
    var commands = [
        'developer "1";',
        'con_filter_text "Damage";',
        'con_filter_text_out "Player:";',
        'con_filter_enable "2";'
    ];
    
    csgo.autoexec.set(commands, function(err){
        event.sender.send('show_dmg', err);
    });
});

ipc.on('autobuy', function(event, weapons) {
    csgo.autobuy.set(weapons, function(err){
        event.sender.send('autobuy', err);
    });
});
