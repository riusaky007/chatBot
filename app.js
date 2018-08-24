var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

const APP_TOKEN = 'tu app token';

var app = express();
app.use(bodyParser.json());

app.listen(3000, function () {
    console.log("El servidor se encuentra en el puerto 3000");
});

app.get('/', function (req, res) {
    res.send('Welcome to class');
});
//pa validar servidor
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Tu no tienes permiso');
    }
});
//pa validar los eventos
app.post('/webhook', function (req, res) {
    var data = req.body;
    console.log(data);
    if (data.object == 'page') {
        data.entry.forEach(function (pageEntry) {
            pageEntry.messaging.forEach(function (messagingEvent) {
                if (messagingEvent.message) {
                    receiveMessage(messagingEvent);
                }
            });
        });
        res.sendStatud(200);
    }
});

function receiveMessage(event) {
    console.log(event);
    var senderID = event.sender.id;
    var messateText = event.message.text;
    console.log(senderID);
    console.log(messateText);
    evaluateMessage(messateText, senderID);
}

function evaluateMessage(message, recipientId) {
    var finalMessage = '';
    if (isContain(message, 'ayuda')) {
        finalMessage = 'No te puedo ayudar';
    } else {
        finalMessage = 'Solo se repetir ' + message;
    }
    sendMessageText(finalMessage, recipientId);
}

function isContain(sentence, word) {
    return sentence.indexOf(word) > -1;
}

function sendMessageText(message, recipiendId) {
    var messageData = {
        recipient: {
            id: recipiendId
        },
        message: {
            text: message
        }
    };
    callSendApi(messageData);
}

function callSendApi(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: API_TOKEN},
        method: 'POST',
        json: messageData
    }, function (error, response, data) {
        if (error) {
            console.log('nose puede neviar mensaje');
        } else {
            console.log('se envio el mensaje');
        }
    });
}

function sendMessageImage(recipientId) {
    var messageData = {
        recipient: {
            id: recipiendId
        },
        message: {
            attachment: {
                type: 'image',
                payload: {
                    url: 'tu.imagen.com'
                }
            }
        }
    };
    //usar API impur
    callSendApi(messageData);
}

function sendMessageTemplate(recipientId) {
    var messageData = {
        recipient: {
            id: recipiendId
        },
        message: {
          attachment : {
              type : "template",
              payload : {
                  template_type : "generic",
                  elements : [elementTemplate()]
              }
          }
        }
    };
    callSendApi(messageData);
}

function elementTemplate() {
    return {
        title : "Title",
        subtitle: "subtitle",
        item_url : "www.google.com",
        imate_url : "tuimage.com",
        buttons : [buttonTemplate()],
    }

}
 function buttonTemplate() {
     return {
         type : "web_url",
         url : "facebook.com",
         title : "tu titulo button"
     }
 }