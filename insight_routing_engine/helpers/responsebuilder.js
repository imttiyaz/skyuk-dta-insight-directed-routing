const COMMON = require("../../common");
const CONSOLELOGS = require('./consolelogs');


var responseBuilder = (req,result, resultType, routingRecommendation, modelExecuted) => {
    if (routingRecommendation) {
        var response =  {
            "result": result,
            "resultType": resultType,
            "routingRecommendation": routingRecommendation,
            "modelExecuted": modelExecuted
        }
        CONSOLELOGS.logData(`${req.uniqueID} Response : ${JSON.stringify(response)}`);
        return response;
    }
    var response = {
        "result": result,
        "resultType": resultType,
        "modelExecuted": modelExecuted
    }
    CONSOLELOGS.logData(`${req.uniqueID} Response : ${JSON.stringify(response)}`);
    return response;
}

module.exports = responseBuilder;