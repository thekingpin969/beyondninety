import { Client, GetContainerRequest, PostPageReelMediaRequest, PostPublishMediaRequest } from 'instagram-graph-api';

async function UploadToInstagram(videoUrl, caption) {

    const ACCESS_TOKEN = process.env.ACCESS_TOKEN
    const PAGE_ID = process.env.PAGE_ID

    try {
        // const client = new Client(ACCESS_TOKEN, PAGE_ID);

        const reelRequest = new PostPageReelMediaRequest(ACCESS_TOKEN, PAGE_ID, videoUrl, caption, undefined, true);
        const containerId = (await reelRequest.execute()).getId();

        let status = '';
        while (status !== 'FINISHED') {
            const containerStatusRequest = new GetContainerRequest(ACCESS_TOKEN, containerId);
            status = (await containerStatusRequest.execute()).getContainerStatusCode();
            if (status == 'ERROR ') {
                throw Error('error while uploading to instagram')
            }
            if (status !== 'FINISHED') {
                console.log(status)
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        const publishRequest = new PostPublishMediaRequest(ACCESS_TOKEN, PAGE_ID, containerId);
        const media = await publishRequest.execute();

        console.log(media.getData())

        console.log('Reel uploaded and published successfully!');

    } catch (error) {
        console.log(error, 'instagram upload error')
        throw new Error('Error uploading reel to Instagram: ' + error.message);
    }
}

export default UploadToInstagram