import { readFileSync } from "fs";

function GetReel() {
    try {
        const reels = JSON.parse(readFileSync('./reels_data.json', 'utf-8') || '[]') || []

        const new_reel = reels.filter(reel => !reel.uploaded);
        const randomIndex = new_reel.length > 0 ? Math.floor(Math.random() * new_reel.length) : -1;
        const selected_reel = randomIndex !== -1 ? new_reel[randomIndex] : false;

        if (!selected_reel) {
            console.log('no reels remaining...!')
            return false
        }
        const {
            id,
            video: { file_id, duration, file_size },
            title: caption, chat
        } = selected_reel

        return {
            id,
            video: { file_id, duration, file_size, chat },
            caption
        }
    } catch (error) {
        console.error("Error in GetReel:", error);
        throw new Error('Error fetching reel: ' + error.message);
    }
}

// GetReel()

export default GetReel