var action = require("./action");

class ResponseHandler {

  constructor(crypto, dataOptions) {
    this.crypto = crypto;
    this.dataOptions = dataOptions;
  }

  async getResponse(req, res) {
    
      // console.log("/rocket/profile ", req.body);
      if (typeof req.body.token !== 'undefined') {
                
        var user = {
          token: req.body.token,
          email: req.body.email,
          mapName: req.body.mapName,
          myIp: req.connection.remoteAddress
        };
        
        var responseFlag = await action.getProfileID(user, this.dataOptions)
        console.log("/rocket/wanna-play", responseFlag.status);
        if (responseFlag.status == "ACTIVE_LIST_PASSED") {
        
          res.status(200).json({
            message: "You are added to active server list.",
            rocketStatus: responseFlag.status,
            user: responseFlag.user
          });

        } else if (responseFlag.status == "ALREADY_IN_ACTIVE_LIST") {

          res.status(200).json({
            message: "Hi there, you are already in the active game list.",
            rocketStatus: responseFlag.status,
            user: responseFlag.user
          });

        } else {
          res.status(401).json({
            message: "NO AUTHORIZED",
            rocketStatus: "Very Bad Request"
          });
        }
        
      } else {
        console.log("/rocket/register There is no exspected props in request body.");
        res.status(400).json({
          message: "There is no exspected props in request body.",
          rocketStatus: "Bad request"
        });
        return;
      }
  }
 
  async getServerListResponse(req, res) {
  
    console.log("active-games/ ", req.body);
    if (typeof req.body.token !== 'undefined') {
              
      var user = {
        token: req.body.token,
        email: req.body.email,
        myIp: req.connection.remoteAddress
      };
    
      console.log( "WHAT R F >>", req.connection.remoteAddress)
      
      var responseFlag = await action.getActiveList(user, this.dataOptions)
      console.log("/rocket/active-games/", responseFlag.status);
      if (responseFlag.status == "DB_QUERY_ACTIVE_LIST_PASSED") {
      
        res.status(200).json({
          message: "Rocket crafting server - active games list [] ",
          rocketStatus: responseFlag.status,
          activeList: responseFlag.activelist
        });

      } else if (responseFlag.status == "RESULT_NULL") {

        res.status(201).json({
          message: "Rocket crafting server -  RESULT_NULL",
          rocketStatus: responseFlag.status,
          activeList: null
        });

      } else {
        res.status(401).json({
          message: "NO AUTHORIZED",
          rocketStatus: "very bad request",
          activeList: null
        });
      }
      
    } else {
      console.log("/rocket/register There is no exspected props in request body.");
      res.status(400).json({
        message: "There is no exspected props in request body.",
        rocketStatus: "Bad request"
      });
      return;
    }
}
}

module.exports = ResponseHandler
