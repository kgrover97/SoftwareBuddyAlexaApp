// import {expect} from 'chai';
// import chai = require("chai");
// import chaiAsPromised = require("chai-as-promised");
// import chaiHttp = require('chai-http');
// import RestServer from "../src/restServer";
//
// chai.use(chaiAsPromised);
// chai.use(chaiHttp);
//
// // Ignore certificate errors
// // TODO Fix certificate errors
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//
// describe("RestServer", () => {
//   let port = 443;
//   let rest: RestServer;
//
//   before(() => {
//     rest = new RestServer(port);
//   });
//
//   after(async () => {
//     await rest.stop();
//   });
//
//   it("should start.", async () => {
//     return expect(rest.start()).to.be.fulfilled;
//   });
//
//   it("should call a listener on a post event.", (done) => {
//     rest.registerListener("post", "/alexa/devy", (req, res, next) => {
//       res.json(200, "ok");
//     });
//
//     chai.request("https://localhost:"+port)
//       .post("/alexa/devy")
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.have.status(200);
//         done();
//       });
//   });
// });
