/* globals require describe it */
"use strict";

const chai = require("chai");
const sinon = require("sinon");
let expect = chai.expect;
const User = require("../../models/user-model");

describe("User Tests", () => {
    it("Should create a new user", (done) => {
        const UserMock = sinon.mock(new User({ email: "telerikAcademy@gmail.com", password: "passwordyo" }));
        const user = UserMock.object;

        UserMock
            .expects("save")
            .yields(null);

        user.save(function(err) {
            UserMock.verify();
            UserMock.restore();
            expect(err).to.be.null;
            done();
        });
    });

    it("Should return an error if user is not created", (done) => {
        const UserMock = sinon.mock(new User({ email: "telerikAcademy@gmail.com", password: "passwordyo" }));
        const user = UserMock.object;
        const expectedError = {
            name: "ValidationError"
        };

        UserMock
            .expects("save")
            .yields(expectedError);

        user.save((err, result) => {
            UserMock.verify();
            UserMock.restore();
            expect(err.name).to.equal("ValidationError");
            expect(result).to.be.undefined;
            done();
        });
    });

    it("Should not create a user with the unique email", (done) => {
        const UserMock = sinon.mock(User({ email: "telerikAcademy@gmail.com", password: "passwordyo" }));
        const user = UserMock.object;
        const expectedError = {
            name: "MongoError",
            code: 11000
        };

        UserMock
            .expects("save")
            .yields(expectedError);

        user.save((err, result) => {
            UserMock.verify();
            UserMock.restore();
            expect(err.name).to.equal("MongoError");
            expect(err.code).to.equal(11000);
            expect(result).to.be.undefined;
            done();
        });
    });

    it("Should find user by email", (done) => {
        const userMock = sinon.mock(User);
        const expectedUser = {
            _id: "5700a128bd97c1341d8fb365",
            email: "telerikAcademy@gmail.com"
        };

        userMock
            .expects("findOne")
            .withArgs({ email: "telerikAcademy@gmail.com" })
            .yields(null, expectedUser);

        User.findOne({ email: "telerikAcademy@gmail.com" }, (err, result) => {
            userMock.verify();
            userMock.restore();
            expect(result.email).to.equal("telerikAcademy@gmail.com");
            done();
        });
    });

    it("Should remove user by email", (done) => {
        const userMock = sinon.mock(User);
        const expectedResult = {
            nRemoved: 1
        };

        userMock
            .expects("remove")
            .withArgs({ email: "telerikAcademy@gmail.com" })
            .yields(null, expectedResult);

        User.remove({ email: "telerikAcademy@gmail.com" }, (err, result) => {
            userMock.verify();
            userMock.restore();
            expect(err).to.be.null;
            expect(result.nRemoved).to.equal(1);
            done();
        });
    });
});