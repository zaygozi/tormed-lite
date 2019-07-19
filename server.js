const WebTorrent = require('webtorrent');
const express = require('express');
const bodyParser = require('body-parser');

const {serverNotif} = require('./mailer');

const app = express();
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({extended:true}));
const port = process.env.PORT || 8080;

app.post('/murl', (req,res) => {
    let magnet = req.body.mag;
    console.log(`New MagnetUrl received : ${magnet}`);
    let client = new WebTorrent();
    client.add(magnet, {path:`${__dirname}/downloads`}, (torrent) => {
        console.log(`Downloading : ${torrent.name}`);
        torrent.on('done', () => {
            console.log('Torrent successfully downloaded to server!');
            serverNotif(torrent.name);  //Sends notification email
            client.destroy();
        });
    });
});

app.listen(port,(err) => {
    if (err) throw err;
    console.log(`Server started on port ${port}`);
});