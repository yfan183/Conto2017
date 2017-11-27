var builder = require('botbuilder');
var category = require('./SpendingCategories');
var expense = require('./TotalExpenses');
exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/61c49a8a-a943-4025-885c-04c2fa5a4c05?subscription-key=457c14c5cff642e48617989b435160b9&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('spentCategories', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            //if (!isAttachment(session)) {

                if (results.response) {
                    session.conversationData["username"] = results.response;
                }

                session.send("Retrieving the things that you spend your money on...");
                category.displaySpendingCategories(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            //}
        }
    ]).triggerAction({
        matches: 'spentCategories'
    });

    bot.dialog('totalSpending', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            //if (!isAttachment(session)) {

                if (results.response) {
                    session.conversationData["username"] = results.response;
                }

                session.send("Retrieving your total spendings...");
                expense.displayExpenses(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            //}
        }
    ]).triggerAction({
        matches: 'totalSpending'
    });

    bot.dialog('GetCalories', function (session, args) {
        //if (!isAttachment(session)) {

            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

            // Checks if the for entity was found
            if (foodEntity) {
                session.send('Calculating calories in %s...', foodEntity.entity);
                // Insert logic here later

            } else {
                session.send("No food identified! Please try again");
            }
        //}
    }).triggerAction({
        matches: 'GetCalories'
    });

    bot.dialog('GetFavouriteFood', [
       // Insert favourite food logic here later
    ]).triggerAction({
        matches: 'GetFavouriteFood'
    });

    bot.dialog('LookForFavourite', [
        // Insert logic here later
    ]).triggerAction({
        matches: 'LookForFavourite'
    });
    

    bot.dialog('WelcomeIntent', [
        // Insert logic here later
    ]).triggerAction({
        matches: 'WelcomeIntent'
    });
}

// Function is called when the user inputs an attachment
function isAttachment(session) { 
    var msg = session.message.text;
    if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
        
        //call custom vision here later
        return true;
    }
    else {
        return false;
    }
}