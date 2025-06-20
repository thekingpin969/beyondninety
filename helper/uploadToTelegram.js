import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import GetUrl from './getUrl.js';

const UploadToTelegram = async () => {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHANNEL_ID;
    const localVideoPath = './videos/output.mp4';
    const caption = '';
    try {
        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('caption', caption);
        form.append('video', fs.createReadStream(localVideoPath), {
            filename: 'video.mp4',
            contentType: 'video/mp4',
        });
        const sendResponse = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, form, { headers: form.getHeaders() });
        const fileId = sendResponse.data.result.video.file_id;
        const { url: fileUrl } = await GetUrl(fileId);
        return { url: fileUrl, fileId };
    } catch (error) {
        console.error('❌ Error uploading video:', error.message);
        if (error.response?.data) {
            console.error('Telegram API error:', error.response.data);
        }
        throw error;
    }
};

export default UploadToTelegram;