import fs from 'fs'
import path from 'path'
export default () => {
    if (process.env.APPENV !== 'DEV') {
        if (!fs.existsSync(path.join(process.cwd(), '..', '..', '.yexo_check'))) {
            localStorage.clear()
            fs.writeFileSync(path.join(process.cwd(), '..', '..', '.yexo_check'), `check at ${new Date()}`);
        }
    }
}