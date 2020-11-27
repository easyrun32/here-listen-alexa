const getRemoteData = require("../helpers/getRemoteData");
const invocationName = "here listen";
const LaunchRequest_Handler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "LaunchRequest";
  },
  async handle(handlerInput) {
    const {
      accessToken,
      userId,
    } = handlerInput.requestEnvelope.context.System.user;
    /*
      post is user registered?
      
      if yes then make a post request to see if they exist if they do  dont do anything
      if no then make a post request and register them
      
      
      */
    // const { userId } = handlerInput.requestEnvelope.context.System.user;
    let speechText = "";

    if (!accessToken) {
      speechText =
        "You must authenticate with your Amazon Account to use this skill. I sent instructions for how to do this in your Alexa App";
      return handlerInput.responseBuilder
        .speak(speechText)
        .withLinkAccountCard()
        .getResponse();
    } else {
      let url = `https://api.amazon.com/user/profile?access_token=${accessToken}`;
      await getRemoteData(url)
        .then((response) => {
          const data = JSON.parse(response);
          // invocationName is a variable
          speechText = `hi im testing ${data.name}. You are registered with ${data.email}. How can i help your team?`;
        })
        .catch((err) => {
          speechText = err.message;
        });
      let say = `say open ${invocationName}`;

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt("try again, " + say)
        .withStandardCard(
          "Welcome!",
          "Hello!\nThis is a card for your skill, " + invocationName,
          welcomeCardImg.smallImageUrl,
          welcomeCardImg.largeImageUrl
        )
        .getResponse();
    }
  },
};
exports.LaunchRequest_Handler = LaunchRequest_Handler;
