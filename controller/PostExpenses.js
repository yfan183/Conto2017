var rest = require('../API/Restclient');

exports.sendExpenses = function postExpenses(session, username, expenses, category){
    var url = 'http://cconto.azurewebsites.net/tables/Bitcoin';
    rest.postExpenses(url, username, expenses, category);
};