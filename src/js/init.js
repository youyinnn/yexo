exports.init = () => {
    window.onload = () => {
        var win = require('electron').remote.getGlobal('share').win
    
        // ANCHOR frame size control
        var frame = require('./frame')
    
        frame.frameInit()
    }
}