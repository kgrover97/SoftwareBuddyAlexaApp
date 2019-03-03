// import {expect} from 'chai';
// import chai = require("chai");
// import chaiAsPromised = require("chai-as-promised");
// import WebSocket = require("ws");
// import WebSocketServer from "../src/webSocketServer";
// import {Timer} from "../src/timer.js";
//
// chai.use(chaiAsPromised);
//
// describe("WebSocketServer", () => {
//   let port = 11500;
//   let user = "user1";
//   let wss: WebSocketServer;
//   let ws: WebSocket;
//
//   before(async () => {
//     wss = new WebSocketServer(port);
//     return await wss.start();
//   });
//
//   after(async () => {
//     return await wss.stop();
//   });
//
//   it("should throw exception if two servers are started on the same port.", async () => {
//     return expect(wss.start()).to.be.rejectedWith(/EADDRINUSE/);
//   });
//
//   it("should not send messages before any user connects.", () => {
//     return expect(wss.send(user, {})).to.be.rejectedWith(/Failed to send message/);
//   });
//
//   it("should notify when user connects if requested.", async () => {
//     ws = new WebSocket("ws://localhost:"+port, {headers: {"user": "user1"}});
//     return expect(wss.userReady("user1")).to.be.fulfilled;
//   });
//
//   it("should return true if user is ready.", () => {
//     return expect(wss.isUserReady(user)).to.be.true;
//   });
//
//   // send messages
//   it("should be able to send an empty message to a user that is ready.", async () => {
//     let msg = {};
//     ws.on("message", (data) => {
//       ws.send(data);
//     });
//     return expect(wss.send(user, msg)).to.become(JSON.stringify(msg));
//   });
//   // TODO send other types of messages
//
//
//   // disconnect user here
//
//   it("should return false if user has disconnected.", async () => {
//     ws.close(1000, "Reason for closing connection.");
//     await new Timer().wait(1);  // pause briefly to let the close event fire
//     return expect(wss.isUserReady(user)).to.be.false;
//   });
//
//   it("should not be able to send a message after user has disconnected.", async () => {
//     return expect(wss.send(user, {})).to.be.rejectedWith(/Failed to send message/);
//   });
//
// });
