import RestServer from "./restServer";
import WebSocketServer from "./webSocketServer";
import Log from "./log";
import AlexaUser from "./alexaUser";
import Timer from "./timer";
import restify = require('restify');

/**
 * Manages the REST server and the WebSocket Server. Provides methods to pass
 * HTTP requests to the WebSocket clients.
 */
export default class Proxy {
  private _restServer: RestServer;
  private _wss: WebSocketServer;

  constructor(restPort: number, wssPort: number) {
    try {
      this._restServer = new RestServer(restPort);
      this._wss = new WebSocketServer(wssPort, this._restServer.server);
    }
    catch (err) {
      throw new Error(`Failed to initialize servers. ${err}`);
    }
  }

  /**
   * @returns An instance of the REST server.
   */
  get restServer(): RestServer {
    return this._restServer;
  }

  /**
   * @returns An instance of the WebSocket server.
   */
  get wss(): WebSocketServer {
    return this._wss;
  }

  /**
   * Initialize the proxy.
   *
   * @returns A promise that resolves once both the REST server and the WebSocket
   * server have started.
   */
  public async init(): Promise<void> {
    try {
      await this._restServer.start();
      await this._wss.start();
    }
    catch(err) {
      throw new Error(`Failed to initialize proxy server. ${err}`);
    }
  }

  /**
   * Register the Alexa endpoint for Devy and add a callback to handle forwarding
   * the requests to the approriate client.
   */
  public forwardAlexaMessages() {
    this._restServer.registerListener("post", "/alexa/devy", this.alexaMessageHandler.bind(this));
  }

  private async alexaMessageHandler(req: restify.Request, res: restify.Response, next: restify.Next) {
    try {
      let body = req.body;
      let user = new AlexaUser(body.session.user.userId);
      let session = body.session.sessionId;
      let timedOut = false;
      let messageHandler = (response: any) => {
        // check the response here

        Log.info(`Proxy::alexaMessageHandler(...) - User ${user} responding on session ${session}.` + {
          type: "response",
          user: user.raw,
          session: session,
          status: 200,
          body: response
        });

        res.json(200, JSON.parse(response));
      };

      Log.info(`Proxy::alexaMessageHandler(...) - Got request for user ${user}.` + {
        type: "request",
        user: user.raw,
        session: session,
        method: req.method,
        path: req.url,
        body: req.body
      });

      // Forward the request if the user is connected and wait for their response
      if (await this._wss.isClientReady(user)) {
        //this._wss.setMessageHandler(user, messageHandler);
        let response: any = await this._wss.send(user, body);
        Log.info(`Proxy::alexaMessageHandler(...) - User ${user} responding on session ${session}.` + {
          type: "response",
          user: user.raw,
          session: session,
          status: 200,
          body: response
        });

        res.json(200, JSON.parse(response));
      }

      // The client isn't connected yet but give them a few seconds to connect before
      // declaring defeat. The 8 second timeout was chosen because the skill will
      // wait 10 seconds for a response. This gives the client 2 seconds to handle
      // the request and respond after connecting.
      else {
        let timeout = 8000;
        let timer = new Timer(timeout);
        Log.warn(`Proxy::alexaMessageHandler(...) - Client for user ${user} is not connected. Waiting ${timeout}ms for connection.`);

        timer.start().then(() => {
          // The client didn't connect in time
          timedOut = true;

          // this should be a full alexa response
          let resp = {
            "version": "1.0",
            "response": {
              "outputSpeech": {
                "type": "SSML",
                "ssml": "<speak> Sorry, I couldn't connect to your client app. Please try restarting it.  </speak>"
              },
              "shouldEndSession": true
            },
            "sessionAttributes": {}
          }
          Log.info(`Proxy::alexaMessageHandler(...) - Client for user ${user} did not connect. Unable to process request.` + {
            type: "response",
            user: user.raw,
            session: session,
            status: 200,
            body: resp
          });
          res.send(200, resp);
        });
        this._wss.isClientReady(user).then(async () => {
          if (!timedOut) {
            // The client connected before the timer expired
            timer.cancel();
            //this._wss.setMessageHandler(user, messageHandler);
            let response: any = await this._wss.send(user, body);
          }
        });
      }
    }
    catch (err) {
      Log.error(`Proxy::alexaMessageHandler(...) - There was an error handling a request from Alexa.` + err);
      res.send(500, err);
    }
  }
}
