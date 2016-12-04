/* globals describe it */
"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

let expect = chai.expect;

describe("Authentication Router Tests", () => {

    it("Should return 200 OK GET /login route", (done) => {
        let app = require("../../config/application")({ data: {} });
        require("../../routers/authentication-router")({ app });

        chai.request(app)
            .get("/login")
            .end((req, res) => {
                expect(res.status).equals(200);
                done();
            });
    });

    const INVALID_URL = "/peshogosho";
    it(`Should return 404 Bad Request GET ${INVALID_URL} route`, (done) => {
        let app = require("../../config/application")({ data: {} });

        chai.request(app)
            .get(INVALID_URL)
            .end((req, res) => {
                expect(res.status).equals(404);
                done();
            });
    });

    it("Should return 200 OK GET /register route", (done) => {
        let app = require("../../config/application")({ data: {} });
        require("../../routers/authentication-router")({ app });

        chai.request(app)
            .get("/register")
            .end((req, res) => {
                expect(res.status).equals(200);
                done();
            });
    });

    it("Should return 200 OK GET /register route", (done) => {
        let app = require("../../config/application")({ data: {} });
        require("../../routers/authentication-router")({ app });

        chai.request(app)
            .get("/register")
            .end((req, res) => {
                expect(res.status).equals(200);
                done();
            });
    });
});