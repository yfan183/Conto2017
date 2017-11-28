var rest = require('../API/Restclient');

exports.deleteCategories = function deleteDeleteCategories(session,username,category){
    var url = 'http://cconto.azurewebsites.net/tables/Bitcoin';


    rest.getSpendingCategories(url,session, username,function(message,session,username){
     var allCategories = JSON.parse(message);

        for(var i in allCategories) {

            if (allCategories[i].category === category && allCategories[i].username === username) {

                console.log(allCategories[i]);

                rest.deleteCategory(url,session,username,category, allCategories[i].id ,handleDeletedCategoryResponse)

            }
        }


    });


};

function handleDeletedCategoryResponse(body, session, username, category){
    console.log("done");
}