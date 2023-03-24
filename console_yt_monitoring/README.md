// Before running the sample, to get the API key and enable youtube on it:
// - Enable the API at:
//   https://console.developers.google.com/apis/api/youtube.googleapis.com

1. `npm install`
2. Enter the google api key into .env file: `"API_KEY="`
3. Enter the slack webhook url from your app (https://api.slack.com/messaging/webhooks): `"SLACK_WEBHOOK_URL="`
4. Enter the keywords to search for, comma separated if one video has to match all: `"KEYWORDS="`
5. Enter how many results you want to list at once: `"MAX_RESULTS="`
7. Run application with npm run start



(OPTIONAL)
1. To set-up monitoring, use cron-jobs (linux-based only):
   - 1. Type "crontab -e" into console, 
   - 2. Select proper syntax from (https://cron.help/every-minute) "* * * * * root node /path/to/your/script.js"
   - 3. Save file, and cronjob should run