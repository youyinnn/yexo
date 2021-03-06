import fs from 'fs'
import path from 'path'
import os from 'os'
export default () => {
    if (process.env.APPENV !== 'DEV') {
        let yc_location
        if (os.type() == 'Windows_NT') {
            //windows
            yc_location = path.join(process.cwd(), '..', '..', '.yexo_check')
        } else if (os.type() == 'Darwin') {
            // mac
            yc_location = path.join(process.env.HOME, '.yexo_check')
        } else if (os.type() == 'Linux') {
            //Linux
        }
        if (yc_location !== undefined) {
            if (!fs.existsSync(yc_location)) {
                localStorage.clear()
                fs.writeFileSync(yc_location, `check at ${new Date()}`);
            }
        }
    }
}