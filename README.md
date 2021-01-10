# roboflow-nest
Using Roboflow with the Nest camera API

## Obtaining Roboflow Credentials
[Get your API key](https://app.roboflow.com/account/api)
from your Roboflow Settings.

## Obtaining Nest Security Credentials
It's unfortunately a little bit of a chore to connect with your camera since
Google has deprecated the official Nest API. You'll need to intercept your keys
from the Nest app. Follow the instructions
[from @cbartram's Node.js nest-cam repo](https://github.com/cbartram/Nest#obtaining-nest-security-credentials)
to proxy the traffic so you can grab the credentials you need to impersonate
the official app.

## Setup
Use the format from `roboflow-config.sample.json` and `nest-config.sample.json` to
save your credentials to `roboflow-config.json` and `nest-config.json`. These
should be kept secret so they are included in `.gitignore` and are not commited
to your repo by default.

Run `npm install` to install the dependencies. The root `node_modules` directory
is symlinked from both the `collect` and `infer` subdirectories.
