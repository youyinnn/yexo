import fs from 'fs'
import path from 'path'
export default () => {
    if (process.env.APPENV !== 'DEV') {
        try {
            fs.readFileSync(path.join(process.cwd(), '..', '.yexo_check'))
        } catch (error) {
            console.log('localStorage clear')
            localStorage.clear()
            fs.writeFileSync(path.join(process.cwd(), '..', '.yexo_check'), `check at ${new Date()}`);
        }
    }
}