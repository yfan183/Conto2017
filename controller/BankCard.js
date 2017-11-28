var rest = require('../API/Restclient');
var builder = require('botbuilder');

//Calls 'getYelpData' in RestClient.js and returns a JSON of bank data
exports.displayBankCards = function getBankData(bank, location, session){
    var url ='https://api.yelp.com/v3/businesses/search?term='+bank+'&location='+location + '&limit=5';
    var auth ='iB3uc4JFleidkO9jli0b4YLV7f10nwu0Xkcgba_g2ScdsVrhuTOJuP82VKZkDZV59fKRFxhnuqzRtaQOkQZrjtVgSINUX2AQFS-gdNuTCTzrgwgEUkbAaZLOvxEWWnYx';
    rest.getYelpData(url,auth,session,displayBankCards);
}

function displayBankCards(message, session) {
    var attachment = [];
    var banks = JSON.parse(message);
    
    //For each bank, add herocard with name, address, image and url in attachment
    for (var i in banks.businesses) {
        var bank = banks.businesses[i];
        var name = bank.name;
        var imageURL = bank.image_url;
        var url = bank.url;
        var address = bank.location.address1 + ", " + bank.location.city;

        var card = new builder.HeroCard(session)
            .title(name)
            .text(address)
            .images([
                builder.CardImage.create(session, imageURL)])
            .buttons([
                builder.CardAction.openUrl(session, url, 'More Information')
            ]);
        attachment.push(card);

    }

    //Displays restaurant hero card carousel in chat box 
    var message = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(attachment);
    session.send(message);
}