/* globals module require */
"use strict";

const express = require("express"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    validator = require("express-validator"),
    flash = require("express-flash"),
    expressStatusMonitor = require("express-status-monitor"),
    path = require("path");

module.exports = function({ data }) {
    let app = express();

    app.set("view engine", "pug");
    app.set("views", path.join(__dirname, "../views"));
    app.use("/static", express.static(path.join(__dirname, "../public")));

    app.use(expressStatusMonitor());
    app.use("/static", express.static("public"));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(validator());
    app.use(cookieParser());
    app.use(session({ secret: "TeamFreedom Secretirino Yo", saveUninitialized: true, resave: true }));
    app.use(flash());
    require("./passport")({ app, data });


    return app;
};