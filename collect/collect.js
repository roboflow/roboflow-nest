/*jshint esversion:6*/

const fs = require("fs");
const path = require("path");
const async = require("async");
const _ = require("lodash");
const moment = require("moment");
const rimraf = require("rimraf");
const Nest = require("nest-cam");

const NEST_CONFIG = JSON.parse(fs.readFileSync(path.join(
    __dirname,
    "..",
    "nest-config.json"
)));

// Grab the first camera from the configuration file
const CAMERA_ID = _.values(NEST_CONFIG.cameras)[0];
const CAMERA_NAME = _.keys(NEST_CONFIG.cameras)[0];

const nest = new Nest({
    nestId: CAMERA_ID,
    refreshToken: NEST_CONFIG.refreshToken,
    apiKey: NEST_CONFIG.apiKey,
    clientId: NEST_CONFIG.clientId
});

// empty the images folder
rimraf(path.join(
    __dirname,
    "images",
    "*.jpg"
), function() {
    nest.init().then(function() {
        nest.saveLatestSnapshot(path.join(
            __dirname,
            "images",
            CAMERA_NAME + ".jpg"
        )).then(function() {
            console.log("Done!");
        });
    });
});
