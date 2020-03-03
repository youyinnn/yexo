exports.init = () => {
    $(function() {
        var win = require('electron').remote.getGlobal('share').win

        // ANCHOR frame size control
        if (win.isMaximized()) {
            $('#winmaximize').find('i').addClass('fa-window-restore')
        } else {
            $('#winmaximize').find('i').addClass('fa-window-maximize')
        }

        $('.pbtn').click(function() {
            let ts = $(this)
            let id = ts.attr('id')
            if (id === 'winclose') {
                win.close()
            } else if (id === 'winmaximize') {
                if (!win.isMaximized()) {
                    win.maximize()
                } else {
                    win.restore()
                }
            } else if (id === 'winminimize') {
                win.minimize()
            }
        })

        $(window).resize(function() {
            let wm = $('#winmaximize')
            if (win.isMaximized()) {
                wm.find('i').removeClass('fa-window-maximize')
                wm.find('i').addClass('fa-window-restore')
            } else {
                wm.find('i').removeClass('fa-window-restore')
                wm.find('i').addClass('fa-window-maximize')
            }
        })

        $('#apptitle').text(process.env.APPNAME)

        var git = require('./git')

        git.gitInit()
    })
}