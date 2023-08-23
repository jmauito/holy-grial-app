var express = require('express');
var app = express();
var redis = require("redis");
var client = redis.createClient();

// serve static files from public directory
app.use(express.static('public'));

// init values
client.on('error', err => console.log('Redis client error: ', err));

client.connect()
    .then(() => client.set('my_key', 'Hello world'))
    .then(() => client.get('my_key'))
    .then((value) => console.log(value))
    .then(() => client.set('header', 1))
    .then(() => client.set('left', 2))
    .then(() => client.set('article', 3))
    .then(() => client.set('right', 4))
    .then(() => client.set('footer', 5))
    .then(() => client.mGet(['header', 'left', 'article', 'footer']))
    .then((value) => console.log(value))
    ;


async function data() {
    const result = await client.mGet(['header', 'left', 'article', 'right', 'footer']);
    return {
        'header': Number(result[0]),
        'left': Number(result[1]),
        'article': Number(result[2]),
        'right': Number(result[3]),
        'footer': Number(result[4])
    };

}

// get key data
app.get('/data', function (req, res) {
    data()
        .then(data => {
            console.log(data);
            res.send(data);
        });
});


// plus
app.get('/update/:key/:value', async function (req, res) {
    const key = req.params.key;
    let value = Number(req.params.value);
    const currentValue = await client.get(key);
    const newValue = Number(currentValue) + value;
    await client.set(key, newValue);
    data()
        .then(data => {
            console.log(data);
            res.send(data);
        });
});

app.listen(3000, () => {
    console.log('Running on 3000');
});

process.on("exit", function () {
    client.quit();
});