require('dotenv').config()
const { google } = require('googleapis');
const { IncomingWebhook } = require('@slack/webhook');

const ytApi = google.youtube({
    version: 'v3',
    auth: process.env.API_KEY
})

const slackURL = process.env.SLACK_WEBHOOK_URL; // Replace with your own Slack webhook URL in .env
const webhook = new IncomingWebhook(slackURL);


// Search for the videos
ytApi.search.list({
    // The *part* parameter specifies a comma-separated list of one or more search resource properties that the API response will include. Set the parameter value to snippet.
    part: 'id, snippet',
    // Textual search terms to match.
    q: process.env.KEYWORDS,
    // Restrict results to a particular set of resource types from One Platform.
    type: 'video',
    maxResults: process.env.MAX_RESULTS
}, (err, res) => {
    if (err) {
        console.log(`Error searching keywords ${process.env.KEYWORDS}: ${err}`);
        return;
    }

    // Loop through the search results and combine them into a numbered text list
    const { items } = res.data;
    let consoleText = `Found ${items.length} search results of "${process.env.KEYWORDS}":\n`;
    items.forEach((video, index) => {
        consoleText += `[${index + 1}] ${video.snippet.title} (${video.id.videoId})\n`
    });

    // Display final search results to console
    console.log(consoleText);

    // Send final search results to slack webhook
    if (consoleText.length) {
        try {
            (async () => {
                await webhook.send({
                    text: consoleText,
                });
            })();
            console.log('--- Successfully sent search results to slack. ---')
        } catch (error) {
            console.error(error);
            console.log('--- Failed to send search results to slack. ---')

        }
    }
});