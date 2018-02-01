/*
SnapLogic - Data Integration

Copyright (C) 2013-2017, SnapLogic, Inc.  All rights reserved.

This program is licensed under the terms of
the SnapLogic Commercial Subscription agreement.

'SnapLogic' is a trademark of SnapLogic, Inc.

Title: SnapLogic Lambda Template for Alexa Skill
Author: Jump Thanawut
Last Updated Date: Jan 26, 2017
*/

// Skill information.
const APP_ID = 'amzn1.ask.skill.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; // Replace with your Alexa Application Id.
const SKILL_NAME = 'MySkill'; // Replace with your Alexa Skill Name.

// Load libraries.
const Alexa = require('alexa-sdk');
const https = require('https');

// Initialize skill.
exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

// This section contains common messages that will be use in your skill.
const messages = {
    welcome:                    ['My name is Iris. What can I help you with?',
                                'My name is Iris. What can I help you with today?',
                                'My name is Iris. What would you like to do?',
                                'My name is Iris. What would you like to do today?',
                                'My name is Iris. What can I do for you?',
                                'My name is Iris. What can I do for you today?'],
    ask_for_more_command:       ['What else can I help you with?',
                                'What else can I help you with today?',
                                'Anything else I can help you with?',
                                'Anything else I can help you with today?',
                                'What else can I do for you?',
                                'What else can I do for you today?'],
    command_reprompt:           ['Please say again.',
                                'Please try again',
                                'Please repeat.',
                                'Sorry, I can\'t hear that.',
                                'Sorry, please say again.',
                                'Sorry, I didn\'t get that',
                                'I didn\'t get that, please try again'],
    goodbye:                    ['It\'s my pleasure.',
                                'Have a nice day.',
                                'Goodbye!',
                                'Bye Bye!',
                                'Hope to see you again.',
                                'Hope to see you again soon.',
                                'See you later.'],
    help_menu:                  'Welcome to SnapLogic Iris skill! From now on, you can easily build your own Alexa skill using SnapLogic as a platform. \
                                All commands in this demo skill are backed with real SnapLogic pipelines. We have implemented simple greeter and tweet searcher. \
                                Try saying, "Hello World", or "Get tweet about Taylor Swift"',
    https_timeout:              'Sorry, I cannot get the result within 6 seconds time limit. Please try again later.',
    https_error:                'Sorry, the pipeline did not return expected result. Please check the pipeline.'
}

// Define handlers. The name of handlers are matched with intents definded in Alexa developer console.
// You will add handlers for your intents in this section.
const handlers = {
    
    // Start skill with launch commands: open, launch, start, etc.
    'LaunchRequest': function () {
        // Tell welcome message and wait for user's command.
        // Ask will wait for user's response, if there is no valid command within 5 seconds, it will reprompt and wait another 5 seconds.
        this.response.speak(getRandomElementInList(messages.welcome))
                        .listen(getRandomElementInList(messages.command_reprompt));
        this.emit(':responseReady');
    },
    
    // Get help.
    'AMAZON.HelpIntent': function () {
        this.response.speak(messages.help_menu)
                        .listen(getRandomElementInList(messages.command_reprompt));
        this.emit(':responseReady');
    },
    
    // Cancel.
    'AMAZON.CancelIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
    
    // Stop.
    'AMAZON.StopIntent': function () {
        this.response.speak(getRandomElementInList(messages.goodbye))
        this.emit(':responseReady');
    },
    
    // Unhandled
    'Unhandled': function() {
        this.emit('AMAZON.HelpIntent');
    },
    
    // Add your handlers for your intents here.
    'HelloWorld': function() {
        var intent = 'HelloWorld'
        console.log('Intent Handler: ' + intent)
        var filledSlots = delegateSlotCollection.call(this);
        var self = this;
        sendRequest(self, tasks[intent], function(resp_text) {
            var resp_json = parsePipelineResponse(resp_text);
            var speechOutput;
            if (resp_json.error != null) {
                if (resp_json.error == 'timeout') speechOutput = messages.https_timeout;
                else speechOutput = messages.https_error;
            }
            else if (resp_json.result == null) {
                speechOutput = messages.https_error;
            }
            else {
                speechOutput = resp_json.result;
            }
            speechOutput = escapeVoice(speechOutput);
            self.response.speak(speechOutput + '<break time="1s"/>' + getRandomElementInList(messages.ask_for_more_command))
                         .listen(getRandomElementInList(messages.command_reprompt));
            self.emit(':responseReady');
            }
        )
    },
    'GetTweetAboutPerson': function() {
        var intent = 'GetTweetAboutPerson'
        console.log('Intent Handler: ' + intent)
        var filledSlots = delegateSlotCollection.call(this);
        var self = this;
        sendRequest(self, tasks[intent], function(resp_text) {
            var resp_json = parsePipelineResponse(resp_text);
            var speechOutput;
            if (resp_json.error != null) {
                if (resp_json.error == 'timeout') speechOutput = messages.https_timeout;
                else speechOutput = messages.https_error;
            }
            else if (resp_json.result == null) {
                speechOutput = messages.https_error;
            }
            else {
                speechOutput = resp_json.result;
            }
            speechOutput = escapeVoice(speechOutput);
            self.response.speak(speechOutput + '<break time="1s"/>' + getRandomElementInList(messages.ask_for_more_command))
                         .listen(getRandomElementInList(messages.command_reprompt));
            self.emit(':responseReady');
            }
        )
    },

};

// Add SnapLogic tasks here.
const tasks = {
    'HelloWorld': {
        task_info: {name: 'HelloWorld Task'},
        cloud_url: 'https://cloud-dev-fm.snaplogic.io/api/1/rest/feed-master/queue/snaplogic/projects/Alexa/HelloWorld%20Task',
        method: 'GET',
        headers: {Authorization: 'Authorization: Bearer kozxPAudHxKlhhP2ZGK5NrOAQPs6ORlx'},
        slot_param_map: {}
    },
    'GetTweetAboutPerson': {
        task_info: {name: 'GetTweetAboutPerson Task'},
        cloud_url: 'https://cloud-dev-fm.snaplogic.io/api/1/rest/feed-master/queue/snaplogic/projects/Alexa/AlexaGetTweetAboutPerson%20Task',
        method: 'GET',
        headers: {Authorization: 'Authorization: Bearer iLsFLzOZph7XLhFM0lqHcitbugZV5OUA'},
        slot_param_map: {'person': {'param': 'person', 'default_value': ''}}
    },
}

// Send https request to a SnapLogic pipeline.
// The default https timeout is set to 6 seconds. This is required since Alexa has 7 seconds time limit. 
function sendRequest(request, task, callback) {
    // Extract host and base path from cloud url.
    task.host = task.cloud_url.substring(0, task.cloud_url.indexOf('/api/'));
    task.base_path = task.cloud_url.substring(task.cloud_url.indexOf('/api/'));
    // Ignore protocol in host.
    if (task.host.indexOf('https://') == 0) {
        task.host = task.host.substring(8);
    }
    // Ignore port number in host.
    if (task.host.indexOf(':') >= 0) {
        task.host = task.host.substring(0,task.host.lastIndexOf(':'));
    }
    // Ignore "Authorization: " in token.
    if (task.headers.Authorization.indexOf('Authorization: ') == 0) {
        task.headers.Authorization = task.headers.Authorization.substring(15);
    }
    // Construct full url.
    task.path =  decodeURI(task.base_path);
    var paramIndex = 0
    for (var slot in task.slot_param_map) {
        var param = task.slot_param_map[slot].param;
        var defaultValue = task.slot_param_map[slot].default_value;
        var slotValue = null;
        if (request.event.request.intent.slots[slot] == null) slotValue = defaultValue;
        else slotValue = request.event.request.intent.slots[slot].value;
        if (paramIndex == 0) task.path += '?' + param + '=' + slotValue;
        else task.path += '&' + param + '=' + slotValue;
        paramIndex += 1;
    }
    task.path = encodeURI(task.path)
    console.log('Request URL: ' + task.host + task.path)
    // Send https request.
    https.get(task, function(res) {
        if (res.statusCode != 200) {
            console.log('Error: ' + res.statusCode);
            return callback('{"error": "' + res.statusCode + '"}');
        }
        console.log('Response Status: ' + res.statusCode);
        res.on('data', function(chunk) {
            console.log('Response Content: ' + chunk);
            return callback(chunk);
        });
    }).setTimeout( 6000, function() {
        console.log('Timeout: 6s')
        return callback('{"error": "timeout"}')
    }).on('error', function(e) {
        console.log('Error: ' + e.message);
        return callback('{"error": "' + e.message + '"}');
    });
}

// Escape general xml string.
function escapeXml(unsafeString) {
    return unsafeString.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

// Escape xml string for Alexa's voice.
function escapeVoice(unsafeString) {
    return unsafeString.replace(/[<>&]|\\n|\\\"/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return ' and ';
            case '\\n': return ' ';
            case '\\\"': return '\"';
        }
    });
}

// Get an element from input list randomly.
function getRandomElementInList(myList) {
    return myList[Math.floor(Math.random()*myList.length)];
}

// Parse data from snaplogic pipelines.
function parsePipelineResponse(resp_txt) {
    var resp = JSON.parse(resp_txt);
    if (isArray(resp)) {
        resp = resp[0];
    }
    return resp;
}

// Returns if a value is an array
function isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array;
};

// Delegate is needed for Alexa to collect all required slots.
function delegateSlotCollection(){
    console.log('in delegateSlotCollection');
    console.log('current dialogState: ' + this.event.request.dialogState);
    if (this.event.request.dialogState === 'STARTED') {
        console.log('in Beginning');
        var updatedIntent=this.event.request.intent;
        //optionally pre-fill slots: update the intent object with slot values for which
        //you have defaults, then return Dialog.Delegate with this updated intent
        // in the updatedIntent property
        this.emit(':delegate', updatedIntent);
    } else if (this.event.request.dialogState !== 'COMPLETED') {
        console.log('in not completed');
        // return a Dialog.Delegate directive with no updatedIntent property.
        this.emit(':delegate');
    } else {
        console.log('in completed');
        console.log('returning: '+ JSON.stringify(this.event.request.intent));
        // Dialog is now complete and all required slots should be filled,
        // so call your normal intent handler.
        return this.event.request.intent;
    }
}