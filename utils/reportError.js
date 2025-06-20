async function reportErrorToTg(app, error) {
    try {
        const botToken = process.env.ERROR_BOT_TOKEN;
        const chatId = -1002844214228; // Replace with your actual group chat ID
        const msg = `<blockquote>${app}</blockquote>\n\n<pre>${error}</pre>`;

        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: msg,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            }),
        });
        const data = await res.json();

        // if (!data.ok) throw Error('message not send to telegram')
        console.log(data)
        const msgLink = `https://t.me/c/2844214228/${data.result.message_id}`
        return msgLink
    } catch (error) {
        console.error('Failed to send error report:', error);
    }
}


export default reportErrorToTg