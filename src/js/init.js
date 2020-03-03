exports.init = () => {
    var git = require('./git')
    git.get()
    $(function() {
        $('[data-toggle="tooltip"]').tooltip()
    })
}