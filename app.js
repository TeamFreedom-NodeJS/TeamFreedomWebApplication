/* globals require console */
"use strict";

const config = require("./config");

let data = require("./data")(config.connectionString["development"]);

const app = require("./config/application")({ data });

require("./routers")({ app, data });

app.listen(config.port, () => console.log(`Cooking Web App running at :${config.port}`));