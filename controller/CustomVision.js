var request = require('request'); //this file was not actually used as the idea was scraped, just left it here.
exports.retreiveMessage = function (session){

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/279ae65a-c1f8-4eb0-a4d8-03a3234bc023/url?iterationId=bcfb842f-df51-47e3-8ba4-c90209a16003',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': 'c318d58e642d4da0a94252bbbd87a76e'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        if (error){
            console.log(error);
        }
        
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Oops, please try again! Something is wrong with custom vision.');
    }
}