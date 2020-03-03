// jquery in electron
window.$ = window.jQuery = require('../../node_modules/jquery/dist/jquery.js');
// bootstrap bundle
require('../../node_modules/bootstrap/dist/js/bootstrap.bundle')

// my init
var init = require('./init')
init.init()

// Global Constant
process.env.APPNAME = 'Yexo'
