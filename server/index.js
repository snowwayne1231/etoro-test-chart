var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var axios = require('axios');
var fs = require('fs');

const client_request_id = 'bb89dbeb-cc1a-4b22-a4c2-a28321d9a1b0';
const SPX_index_code = 27;
var timer = 0;

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/../dist/index.html');
// });

app.use(express.static('dist'));

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
  intervalOnServer();
  timer = setInterval(intervalOnServer, 60 * 60 * 1000);
});

function intervalOnServer() {
    getEtoroDataByCode(SPX_index_code);
}


function getEtoroDataByCode(code) {
    
    const url = `https://www.etoro.com/sapi/candles/candles/desc.json/OneMinute/2880/${code}?client_request_id=${client_request_id}`;
    axios.get(url).then(res => {
        const data = res.data;
        const todayUTCdate = new Date().toUTCString();
        console.log('todayUTCdate: ', todayUTCdate);
        if (data) {
            let candles = (data.Candles || []);
            candles = candles[0] ? candles[0].Candles : null;

            if (candles) {

                let map_date_candles = {};
                
                candles = candles.filter(e => {
                    return 
                }).map(e => {
                    let datetime = e.FromDate;
                    map_date_candles[datetime] = true;
                    return {
                        datetime,
                        open: e.Open,
                        high: e.High,
                        low: e.Low,
                        close: e.Close,
                    };
                });

                let fileName = `${code}-${candles[0].datetime.split('T')[0]}.json`;
                let fullPath = `public/data/${fileName}`;

                if (fs.existsSync(fullPath)) {
                    let old_candles = fs.readFileSync(fullPath);
                    old_candles = JSON.parse(old_candles);
                    old_candles.map(e => {
                        if (!map_date_candles[e.datetime]) {
                            candles.push(e);
                        }
                    });
                }

                candles.sort((a, b) => {
                    return new Date(a.datetime) - new Date(b.datetime);
                });

                
                // console.log(candles.length);
                // console.log(candles.slice(0,3));
                

                fs.writeFile(fullPath, JSON.stringify(candles), function(){
                    console.log('Download Data From Etoro Done.', new Date());
                });
                return res;
            }
            
        }

        throw "Etoro Data Format Wrong!!.";

    }).catch(err => {
        console.log('Etoro Api failed.');
        console.log(err);
        console.log(new Date());
    });
}