// const redis = require('redis');
// const client = redis.createClient();

// client.on();

// client.set("my_key", "hello world");

// client.get("my_key", (err, reply) => console.log(reply));

// client.quit();



const {createClient } = require("redis");
const client = createClient();

client.on('error', err => console.log('Redis client error: ', err));

client.connect()
  .then( () => client.set('my_key', 'Hello world') )
  .then( () => client.get('my_key') )
  .then( (value) => console.log(value) )
  // .then( () => client.mSet('header',5,'left',5,'article',5,'footer',5) )
  .then( () => client.set('header', 0) )
  .then( () => client.set('left', 0) )
  .then( () => client.set('article', 0) )
  .then( () => client.set('footer', 0) )
  .then( () => client.mGet(['header','left','article','footer']) )
  .then( (value) => console.log(value) )
  .then( () => client.disconnect() )
;
