var rest = require('../API/Restclient');

exports.displayExpenses = function getExpenses(session, username){
    var url = 'http://cconto.azurewebsites.net/tables/Bitcoin';
    rest.getExpenses(url, session, username, handleExpensesResponse)
};

function handleExpensesResponse(message, session, username) {
    var expensesResponse = JSON.parse(message);
    var totalExpenses = 0;
    for (var i in expensesResponse) {
        var usernameReceived = expensesResponse[i].username;
        var expenses = expensesResponse[i].expense;

        //Remove input case sensitivity
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            totalExpenses = totalExpenses + expenses;
        }        
    }
    
    //Print total
    session.send("%s, your total amount of transaction going out through us is $" + totalExpenses.toFixed(2), username);           
    // session.send("hi");     
    
}