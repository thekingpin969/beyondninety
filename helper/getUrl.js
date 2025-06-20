import axios from "axios";


async function GetUrl(file_id) {
    const BOT_TOKEN = process?.env?.BOT_TOKEN
    try {
        const getFileRes = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${file_id}`);
        const filePath = getFileRes.data.result.file_path;
        const downloadLink = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
        return { url: downloadLink, filePath }
    } catch (error) {
        console.log(error)
        throw new Error('Error fetching file URL: ' + (error));
    }
}

// GetUrl('BAACAgEAAx0EZjUIowADXWfxSp4Q14VfuAg1ypKBFIT6-i3GAAKABAACQCiIRxmdrbjb36IyNgQ').then()

export default GetUrl
