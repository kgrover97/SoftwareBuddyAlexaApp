import Log from "./log";
import Proxy from "./proxy";
//
// let restPort = Number.parseInt(process.env.PORT) || 443;
// let wssPort = Number.parseInt(process.env.WEBSOCKET_PORT) || 11500;

let restPort = 443;
let wssPort = 11500;

// main entry point
(async function() {
  try {
    let proxy = new Proxy(restPort, wssPort);
    await proxy.init();
    proxy.forwardAlexaMessages();
  }
  catch (err) {
    Log.error(`Failed to initialize appication.` + err);
  }
})();
