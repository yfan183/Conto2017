var rest = require('../API/Restclient');

exports.displaySpendingCategories = function getSpendingCategories(session, username){
    var url = 'http://cconto.azurewebsites.net/tables/Bitcoin';
    rest.getSpendingCategories(url, session, username, handleSpendingCategoriesResponse)
};

function handleSpendingCategoriesResponse(message, session, username) {
    var spendingCategoriesResponse = JSON.parse(message);
    var allCategories = [];
    var freq = []; //frequency array
    for (var i in spendingCategoriesResponse) {
        var usernameReceived = spendingCategoriesResponse[i].username;
        var spendingCategories = spendingCategoriesResponse[i].category;

        //Convert all to lower case removes case sensitivity so user don't have to worry about cases
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            //Add a comma after each category except for the last one
            if(spendingCategoriesResponse.length - 1) {
                if (allCategories.indexOf(spendingCategories) === -1){
                    allCategories.push(spendingCategories);
                }
            }
            else {
                if (allCategories.indexOf(spendingCategories) === -1){
                    allCategories.push(spendingCategories + ', ');
                }
            }
            freq.push(spendingCategories); //accumulate frequency
        }        
    }
    
    //Get all categories of stuff that the user spent on
    if (allCategories.length > 0){
        var frequency = {};  // array of frequency.
        var max = 0;  // holds the max frequency.
        var result;   // holds the max frequency element.
        for(var v in freq) {
                frequency[freq[v]]=(frequency[freq[v]] || 0)+1; // increment frequency.
                if(frequency[freq[v]] > max) { // is this frequency > max so far ?
                        max = frequency[freq[v]];  // update max.
                        result = freq[v];          // update result.
                }
        }

        session.send("%s, you spent your money on: %s", username, allCategories);
        if (max >1){
            session.send("You seem to spend on %s the most frequent, you've spend money on it on %s occasions. Spend wisely.", result, max);
        }                
    }else{
        session.send("%s, we did not detect any transactions from you", username);
    }
}