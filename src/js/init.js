import fs from 'fs'
import path from 'path'
export default () => {
    try {
        fs.readFileSync(path.join(process.cwd(), '_check'))
    } catch (error) {
        console.log('localStorage clear')
        localStorage.clear()
        fs.writeFileSync(path.join(process.cwd(), '_check'), `check at ${new Date()}`)
    }
}