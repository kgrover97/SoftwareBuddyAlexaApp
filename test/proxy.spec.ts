// import {expect} from 'chai';
// import chai = require("chai");
// import chaiAsPromised = require("chai-as-promised");
// import chaiHttp = require('chai-http');
// import fs = require("fs");
// import WebSocket = require("ws");
// import Proxy from "../src/proxy";
//
// chai.use(chaiAsPromised);
// chai.use(chaiHttp);
//
// // Ignore certificate errors
// // TODO Fix certificate errors
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//
// describe("Proxy", () => {
//   let restPort = 443;
//   let wssPort = 11500;
//   let proxy: Proxy;
//   let ws: WebSocket;
//
//   let host = "https://localhost:" + restPort;
//   let requests = JSON.parse(fs.readFileSync("./test/sampleAlexaRequests.js", "UTF-8"));
//
//   before(async () => {
//     proxy = new Proxy(restPort, wssPort);
//     await proxy.init();
//     return proxy.forwardAlexaMessages();
//   });
//
//   it("should forward an Alexa request if the user is connected.", function(done) {
//     let request = requests[0];
//     let user = request.session.user.userId;
//
//     ws = new WebSocket("ws://localhost:"+wssPort, {headers: {"user": user}});
//     ws.on("open", () => {
//       ws.on("message", (data) => {
//         ws.send(data);
//       });
//       chai.request(host)
//         .post("/alexa/devy")
//         .send(request)
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           ws.close();
//           done();
//         });
//     });
//   });
//
//   it("should fail to  forward an Alexa request if the client isn't connected.", function (done) {
//     this.timeout(10000);
//     chai.request(host)
//       .post("/alexa/devy")
//       // .field("Content-Type", "application/json;charset=UTF-8")
//       // .field("Host", "localhost")
//       .send(requests[0])
//       .end((err, res) => {
//         expect(res).to.have.status(500);
//         done();
//       });
//   });
// })
