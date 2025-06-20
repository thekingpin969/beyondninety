import axios from 'axios'
import FormData from 'form-data';
import { config } from "dotenv";
import fs from 'fs'

config({ path: "./.env" })

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHANNEL_ID;

async function sendVideoFromUrl(videoUrl, caption = '') {
    try {
        const videoStream = await axios({
            url: videoUrl,
            method: 'GET',
            responseType: 'stream',
        });

        const totalLength = videoStream.headers['content-length'];
        let downloaded = 0;

        // Add error handler to the stream
        videoStream.data.on('error', err => {
            console.error('❌ Stream error:', err.message);
        });

        videoStream.data.on('data', chunk => {
            downloaded += chunk.length;
            const progress = ((downloaded / totalLength) * 100).toFixed(2);
            process.stdout.write(`Downloading: ${progress}%\r`);
        });

        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('caption', caption);
        form.append('video', videoStream.data, {
            filename: 'video.mp4',
            contentType: 'video/mp4',
        });

        const response = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`,
            form,
            { headers: form.getHeaders() }
        );

        console.log('✅ Video uploaded successfully!');
        return response.data;
    } catch (error) {
        console.error('❌ Upload error:', error.message);
        if (error.response?.data) {
            console.error('Telegram API error:', error.response.data);
        }
        // throw error; // Rethrow to allow caller to handle
    }
}

async function handleUpload() {
    const reels = JSON.parse(fs.readFileSync('./reels.json', 'utf-8')) || []

    for (const { result: { url, title, duration, medias: [media] } } of reels) {
        console.log(url, title, duration, media)
        const id = crypto.randomUUID()

        try {
            const { result } = await sendVideoFromUrl(media.url, title)
            await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
            const reelRef = JSON.parse(fs.readFileSync('./reels_ref.json', 'utf-8') || '[]') || []
            reelRef.push({ url, title, duration, media, ...result, })
            fs.writeFileSync('./reels_ref.json', JSON.stringify(reelRef))

            const filteredArray = reels.filter(item => item.id != id)
            fs.writeFileSync('./reels.json', JSON.stringify(filteredArray))
            console.log(filteredArray.length)
        } catch (error) {
            console.error(error)
            continue
        }
    }

    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('caption', '📁 Uploaded JSON from file');
    form.append('document', fs.createReadStream('./reels_ref.json'), {
        filename: 'data.json',
        contentType: 'application/json',
    });

    axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, form, {
        headers: form.getHeaders(),
    })
    return true
}

// console.log('🤖 Bot is running...');
// await sendVideoFromUrl('https://scontent-ord5-2.cdninstagram.com/o1/v/t16/f2/m86/AQOfgLj77_nyyEK9sqXDs7t68y9H6Tx6EiGeaxusz85h_kmHejll83JAsvuUdvaKwPN7t1zTl4l0lgse5cDiAPpGVjlvmQNyicR8h20.mp4?stp=dst-mp4&efg=eyJxZV9ncm91cHMiOiJbXCJpZ193ZWJfZGVsaXZlcnlfdnRzX290ZlwiXSIsInZlbmNvZGVfdGFnIjoidnRzX3ZvZF91cmxnZW4uY2xpcHMuYzIuNzIwLmJhc2VsaW5lIn0&_nc_cat=105&vs=637377922404911_3369646884&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC8yRDQzNzcwMUY1MUUxODU1NjYwM0E1N0MxQjk2MzJBNF92aWRlb19kYXNoaW5pdC5tcDQVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dMWjhzQnpIc0pMcGUwY0NBRlRfNkM1TWZMZzJicV9FQUFBRhUCAsgBACgAGAAbABUAACawrOXEp7jHPxUCKAJDMywXQDGAAAAAAAAYEmRhc2hfYmFzZWxpbmVfMV92MREAdf4HAA%3D%3D&_nc_rid=4e2aaab80b&ccb=9-4&oh=00_AYEZYseeB4-Mo8OgGDieOegbuV92JM4LyYv-_9hzfFk-9g&oe=67F2CA31&_nc_sid=10d13b')
//     .then(console.log)


handleUpload().then().catch(e => console.error(e))