var builder = require('botbuilder');
var category = require('./SpendingCategories');
var expense = require('./TotalExpenses');
var post = require('./PostExpenses');
var del = require('./DeleteCategories');

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

    bot.dialog('purchase', [
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
                // Pulls out the number and category entity from the session if it exists
                var numberEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'amount');
                var categoryEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'category');
                // Checks if the entities were found
                if (categoryEntity && numberEntity) {
                    session.send('Logged %s spent on %s', numberEntity.entity, categoryEntity.entity);
                    post.sendExpenses(session, session.conversationData["username"], numberEntity.entity, categoryEntity.entity); // <-- LINE WE WANT
    
                } else {
                    session.send("No category of expense nor amount identified.");
                    
                }
            //}
        }
    ]).triggerAction({
        matches: 'purchase'
    });

    bot.dialog('deleteCategory', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
        //if (!isAttachment(session)) {
            if (results.response){
                session.conversationData["username"] = results.response;
            }
            //session.send("You want to delete one of your favourite foods.");

            // Pulls out the food entity from the session if it exists
            var categoryEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'category');

            // Checks if the for entity was found
            if (categoryEntity) {
                session.send('Deleting \'%s\' expenses...', categoryEntity.entity);
                del.deleteCategories(session,session.conversationData['username'],categoryEntity.entity); //<--- what we need
                session.send('Deletion complete.')
            } else {
                session.send("No category identified! Please try again");
            }
        //}

    }]).triggerAction({
        matches: 'deleteCategory'
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