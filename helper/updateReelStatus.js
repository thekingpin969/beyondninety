import { readFileSync, writeFileSync } from "fs"

function UpdateReelStatus(id, fileId) {
    try {
        const reels = JSON.parse(readFileSync('./reels_data.json', 'utf-8') || '[]')

        const index = reels.findIndex(reel => reel.id == id)
        if (index === -1) {
            console.log(`Reel with id ${id} not found.`)
            return
        }

        reels[index].uploaded = true
        reels[index].uploadedFileId = fileId

        writeFileSync('./reels_data.json', JSON.stringify(reels, null, 2))

        const formData = new FormData()
        formData.append("chat_id", process?.env?.CHANNEL_ID)
        const fileBuffer = readFileSync("./reels_data.json")
        const file = new Blob([fileBuffer], { type: "application/json" })
        formData.append("document", file, "reels_data.json")

        fetch(`https://api.telegram.org/bot${process?.env?.BOT_TOKEN}/sendDocument`, {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (!data.ok) {
                    console.log("Failed to send file to Telegram:", data)
                }
            })
            .catch(err => {
                console.log("Error sending file to Telegram:", err)
            })

    } catch (error) {
        console.log('Error updating reel status:', error)
    }
}

export default UpdateReelStatus
