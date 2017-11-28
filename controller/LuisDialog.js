var builder = require('botbuilder');
var category = require('./SpendingCategories');
var expense = require('./TotalExpenses');
var post = require('./PostExpenses');
var del = require('./DeleteCategories');
var bank = require('./BankCard');
//var customVision = require('./CustomVision');
var qna = require('./QnAMaker');

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
            // if (!isAttachment(session)) {

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
            // if (!isAttachment(session)) {

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
            // if (!isAttachment(session)) {

                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                // Pulls out the number and category entity from the session if it exists
                var numberEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'amount');
                var categoryEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'category');
                // Checks if the entities were found
                if (categoryEntity && numberEntity) {
                    session.send('Logged $%s spent on %s', numberEntity.entity, categoryEntity.entity);
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
        // if (!isAttachment(session)) {
            if (results.response){
                session.conversationData["username"] = results.response;
            }
            //

            // Pulls out the entity from the session if it exists
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


    bot.dialog('LookForBank', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["city"]) {
                builder.Prompts.text(session, "Please enter your current city to setup your location.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        
        function (session, results, next) {
        
        // if (!isAttachment(session)) {
            
            if(results.response){
                session.conversationData["city"] = results.response;
            }
                session.send('Looking for banks in your city...');
                bank.displayBankCards("bank", session.conversationData["city"], session);
            
        //}
        
    }]).triggerAction({
        matches: 'LookForBank'
    });
    
    bot.dialog('QnA', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            builder.Prompts.text(session, "Do you have a question?");
        },
        function (session, results, next) {
            qna.talkToQnA(session, results.response);
        }
    ]).triggerAction({
        matches: 'QnA'
    });

    bot.dialog('WelcomeIntent', function (session){
        session.send("Hi I'm Conto, your transaction tracker. The services I offer includes: \n\n \n\n 1.Track how much you have spend through the transaction through us. \n\n 2.See what kind of things you spent your money on. \n\n 3.Edit your transaction logs if necessary. \n\n 4.Find your nearest bank. \n\n \n\n If you are confused, please let me know. ");
    }).triggerAction({
        matches: 'WelcomeIntent'
    });
}

// Function is called when the user inputs an attachment
// Scraped the idea, a lot of weird bugs going on when using custom vision
// function isAttachment(session) { 
//     var msg = session.message.text;
//     if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
        
//         customVision.retreiveMessage(session);
        
//         return true;
//     }
//     else {
//         return false;
//     }
// }