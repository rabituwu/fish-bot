//dependencies
const tmi = require('tmi.js');

// opts for tmi
const opts = {
    identity: {
        username: 'youusername', //username
        password: 'twitchtokengen' // OAuth token aka access token | google twitchtokengen
    },
    channels: [
        'chanel1', 'chanel2' //chanels the bot joins
    ]
};

const client = new tmi.Client(opts);

// for cooldown
let isPaused = false;
let cooldownTimeout;





// sending message
function sendGofishCommand() {
    if (isPaused) {
        console.log('Gofish command sending is currently paused.');
        return;
    }

    // Send the fishing command
    client.say('channelname', '!fishingcommand')
        .then(() => {
            console.log('Sent fish command to the chat!');
            scheduleNextGofishCommand();
        })
        .catch(err => {
            console.error('Error sending message:', err);
        });
}





// delay next message for bot cd
function scheduleNextGofishCommand() {
    const interval = 31000; // <-- 31 secponds
    console.log(`Next fishing command in ${(interval / 1000).toFixed(2)} seconds`); //logging when next message (optional)

    setTimeout(() => {
        sendGofishCommand(); //send the message agane
    }, interval);
}





client.on('message', (channel, tags, message, self) => {

    if (!tags || !tags.username) {
        console.error('Received message without valid tags:', message);
        return; 
    }


    // look for bot name only
    if (tags.username.toLowerCase() !== 'fishingbotname') {
        return;
    }
    

    // Check for the cooldown message from the bot
    if (tags.username.toLowerCase() === 'fishingbotname') {
        // look for specific cooldown phrase from bot
        if (message.includes('@username, Ready to fish in')) {
            console.log(`Detected fishing cooldown message from ${tags.username}.`);

            // cd
            if (!isPaused) {
                console.log('Cooldown initiated for 30 minutes.');
                isPaused = true;

                //cd reset
                cooldownTimeout = setTimeout(() => {
                    isPaused = false; 
                    console.log('Cooldown has ended. You can fish again!');
                    sendGofishCommand();
                }, 1800000); //<---- this is 30minutes
            }
        }

    }
});





client.connect()
    .then(() => {
        console.log('Connected to Twitch chat');
        sendGofishCommand();
    })
    .catch(console.error);
