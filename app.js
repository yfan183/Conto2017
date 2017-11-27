var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
//comment used to test branch changes
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "3579d48b-c4a2-45a1-91cb-d34c89c927d4",
    appPassword: "mnMT6644gckijTGPPH3_!^:"
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Oops, something went wrong.");
    
});

luis.startDialog(bot);