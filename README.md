# example-layered-express-server

## Overview

This server is example of usage layered architecture, means devote
each part of functionality to its own layer. Layers are: models,
repositories (db dependent layers), services (business logic) and
endpoints (API). 

This exmaple using mongoose ORM to connect to MongoDB, move to 
another DB requires to rewrite only db dependent layers.

Also this server features number of tweeks and features I used to
add over the years. One of them is usage of jwt auth.

Server does not require any building and can be started and deployed
in seconds.

## Requirements

NodeJS LTS
MongDB
ssh-keygen

## Installation

Clone repository and enter its folder
npm i
Now need to generate pairs of RSA keys with ssh-keygen
name them server-key and server-key.pub and put to project root 
After this create .env file with folloding env vars:
PORT=3000
MONGODB_URL="mongodb://127.0.0.1:27017/dbName"
ALLOWED_ORIGINS="localhost:3001;localhost:3002;"
HEADERS_X_NAME="MY"
PING_BASIC_LOGIN_PASS="login pass"
JWT_PRIVATE_KEY_PATH="/path/to/private/key"
JWT_PUBLIC_KEY_PATH="/path/to/public/key.pub"

npm start

For production
npm run start-prod

## License

MIT License

Copyright (c) 2019 Ivan Cherviakov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
