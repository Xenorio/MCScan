# MCScan
Scans the internet for Minecraft servers

### Requirements
- NodeJS
- MongoDB

### Setup
Just install dependencies with ``npm install``

### Usage
Simply set your database information in ``config.js`` and start the script with ``npm start``

It will now start scanning the entire internet for IPs with an open port 25565, then try to get Minecraft query information and save it to the database. How you use that data is up to you.

The number between brackets you see in log outputs is the current amount of found servers
