import axios from "axios";
import fs from "fs"



async function DownloadVideo(url) {
    try {
        const filePath = './videos/video.mp4';
        const writer = fs.createWriteStream(filePath);

        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream',
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log('✅ Download completed:', filePath);
                resolve(filePath);
            });
            writer.on('error', (err) => {
                console.error('❌ Download failed:', err);
                reject(err);
            });
        });
    } catch (err) {
        throw err
    }
}

export default DownloadVideo