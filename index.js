const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const Twitter = require('twitter')

dotenv.config()


const auth = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret,
}

const client = new Twitter(auth)

//sends a tweet by sending a http request to the twitter api. 
function sendTweet(tweet) {
    const params = {
        status: tweet, 
    }

    const callback = function(errors, data, response) {
        if (errors) {
            console.log(errors)
        }
    }

    client.post('statuses/update', params, callback)
}

function tweetHandler(request, response) {
    //get form data (the tweet) that was in the browser
    //send it back to the twitter api
    const tweet = request.body.tweet
    if (tweet.length > 3) {
        sendTweet(tweet)
        response.redirect('https://twitter.com/bog_bot')
    } else {
        //send out a response code telling the user of the issue.
        response.status(400)
        response.send()
        return
    }
    
}

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended: true}))

app.post('/tweet', tweetHandler)
app.listen(3000)