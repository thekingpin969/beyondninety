import { config } from 'dotenv';
config({ path: './.env' })

import GetReel from "./helper/getReel.js";
import GetUrl from "./helper/getUrl.js";
import UploadToInstagram from "./helper/uploadToInstagram.js";
import UpdateReelStatus from './helper/updateReelStatus.js';
import { schedule } from "node-cron";
import { readFileSync } from 'fs';
import axios from 'axios';
import CreateCompleteVideo from './helper/createComepleteVideo.js';
import UploadToTelegram from './helper/uploadToTelegram.js';
import DownloadVideo from './helper/downloadVideo.js';
import express from 'express'
import reportErrorToTg from './utils/reportError.js';

const app = express()
const port = process.env.PORT || 3000

let retryCount = 0;

async function handleReelProcess() {
    try {
        const { video: { file_id }, id } = GetReel()
        const { url } = await GetUrl(file_id)
        const caption = 'please follow and support ❤️';

        // await DownloadVideo(url)
        // await CreateCompleteVideo()
        // const { url: uploadUrl, fileId } = await UploadToTelegram()

        await UploadToInstagram(url, caption + '...')

        UpdateReelStatus(id, null)
        retryCount = 0;
        const message = 'new reel uploaded on beyondninety_'
        await axios.get(`http://xdroid.net/api/message?k=k-7c2c2c6b4e68&t=upload+success+😍&c=${message}&u=`)
    } catch (error) {
        const message = error.message || error.responce.message || 'something went wrong!'
        console.log(message)
        const repUrl = await reportErrorToTg('beyondninety_', error)
        await axios.get(`http://xdroid.net/api/message?k=k-7c2c2c6b4e68&t=error+on+gearglitch&c=${message}&u=${repUrl}`)

        if (retryCount < 5) {
            retryCount++;
            console.log(`Retrying... Attempt ${retryCount}`);
            await handleReelProcess();
        }
    }
}

function SchedulePost() {
    console.log('auto post started...')

    schedule('0 10,18 * * *', async () => {
        try {
            await handleReelProcess();
        } catch (error) {
            console.error("Error in scheduled task:", error);
            const repUrl = await reportErrorToTg('beyondninety_', error)
            const message = error.message || error.responce.message || 'something went wrong!'
            await axios.get(`http://xdroid.net/api/message?k=k-7c2c2c6b4e68&t=error+on+gearglitch&c=${message}&u=${repUrl}`)
        }
    });
}

handleReelProcess()

app.get('/', (req, res) => res.send('OK'))
app.listen(port, async () => {
    console.log(` Server running on port : port!`)
    SchedulePost()
})