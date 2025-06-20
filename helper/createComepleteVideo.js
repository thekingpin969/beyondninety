import { exec } from "child_process"
import { existsSync } from "fs"
import util from "util"

const asyncExec = util.promisify(exec)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function CreateCompleteVideo() {
    try {
        await asyncExec(
            'ffmpeg -i ./videos/video.mp4 -i ./videos/outdraw.mp4 -filter_complex "[0:v:0][0:a:0][1:v:0][1:a:0] concat=n=2:v=1:a=1[outv][outa]" -map "[outv]" -map "[outa]" ./videos/output.mp4 -y'
        )

        await sleep(5000)
        const fileCreated = existsSync('./videos/output.mp4')
        return fileCreated
    } catch (error) {
        console.error('FFmpeg error:', error)
        throw error
    }
}

export default CreateCompleteVideo
