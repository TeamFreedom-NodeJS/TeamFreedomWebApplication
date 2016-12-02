/*globals describe it*/
"use strict";

const expect = require("chai").expect,
    sinon = require("sinon");

describe("Tests", () => {
    describe("Dummy test", () => {
        it("expect 1 to equal 1", function() {
            expect(1).to.equal(1);
        });
    });
});