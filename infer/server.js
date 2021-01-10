/*jshint esversion:6*/

const express = require("express");
const app = express();
const port = 5000;

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const async = require("async");
const _ = require("lodash");
const moment = require("moment");
const rimraf = require("rimraf");
const Nest = require("nest-cam");

const ROBOFLOW_CONFIG = JSON.parse(fs.readFileSync(path.join(
    __dirname,
    "..",
    "roboflow-config.json"
)));

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

app.use(express.static(path.join(__dirname, "public")));

var currentImage = null;
var getCurrentImage = function(cb) {
    return new Promise(function(resolve) {
        if(currentImage) return resolve(currentImage);
        setTimeout(function() {
            getCurrentImage().then(resolve);
        }, 100);
    });
};

var infer = function(imagePath) {
    return new Promise(function(resolve) {
        const image = fs.readFileSync(imagePath, {
            encoding: "base64"
        });

        axios({
            method: "POST",
            url: "https://infer.roboflow.com/" + ROBOFLOW_CONFIG.modelId,
            params: {
                access_token: ROBOFLOW_CONFIG.apiKey,
                format: "image",
                stroke: "5",
                labels: "on"
            },
            data: image,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            responseType: "arraybuffer"
        })
        .then(function(response) {
            resolve(response.data);
        })
        .catch(function(error) {
            console.log(error);
        });
    });
};

app.get("/image", function(req, res) {
    getCurrentImage().then(function(imagePath) {
        infer(imagePath).then(function(image) {
            res.send(image);
        });
    });
});

app.get("/", function(req, res) {
    res.sendfile(path.join(
        __dirname,
        "public/index.html"
    ));
});

rimraf("assets/*.jpg", function() {
nest.init().then(function() {
    nest.subscribe("snapshot", function(imagePath) {
        if(currentImage) {
            // delete the previous image if it exists
            // and save a reference to the new one's path
            rimraf(currentImage, function() {
                currentImage = imagePath;
            });
        } else {
            // first time loading, no need to clean
            currentImage = imagePath;
        }
    });

    app.listen(port);
});
});
