var request = require("request");
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

    // if (event.session.application.applicationId !== "") {
    //     context.fail("Invalid Application ID");
    //  }
        //Intent de Alexa que podemos Manejar
        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {

}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    
}

function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};

}

//Funcion creada para leer
function handleGetInfoIntent(intent, session, callback){
        var speechOutput = "There is an Error";
        getJSON(function(data){
            //En caso de no haber devuelto mensaje con error
            //Devolvera el dato que se buscaba
            if(data != "ERROR"){
                var speechOutput = data;
            }
            //Al final mandara la respuesta final a AWSSSS
            callback(session.attributes,buildSpeechletResponseWithoutCard(speechOutput,"",true));
        })
}

function getJSON(callback){
    /** Ejemplo para Url HTTP
    request.get(url(), function(error,response,body){
            var d = JSON.parse(body);
            //La informacion que queremos de la query consultada
            var result = d.query.searchinfo.totalhits;
            if(result>0){
                //En caso de encontrar la informacion buscada en la query
                //Devolvera el resultado de la misma
                callback(result);
            }
            else{
                //En caso contrario mandara ERROR y sera manejado mas arriba
                callback("ERROR");
            }
    });
    */
   //Ejemplo para HTTPS
   request.get(url2(),function(error,response,body){
       var d = JSON.parse(body);
       var result = d.results
       if(!result.isEmpty){
           callback(result[0].book_details[0].title)
       }else{
           callback("ERROR");
       }
   });
}

// Solo devuelve un link que usaremos en la prueba
// Mas adelante se calculará para acceder al servidor personal de cada UsuarioS
function url(){
    return "http://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=Albert+Einstein";
}

//Metodo para el uso de una url mas compleja(HTTPS)
function url2(){
    return{
        url = "https://api.nytimes.com/svc/books/v3/lists.json",
        qs:{
            "api-key": asdfghjklzxcvbn,
            "list": "hardcover-fiction"
        }
    }
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye!", "", true));
}


// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
}