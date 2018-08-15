# MoonActive TT
Simple API for scheduling messages to be printed in the future.

## Prerequisites

Node version 8 or higher.
This project requires Redis 2.8 to be installed and set up. 
Redis Keyspace Notifications also must be enabled:
```bash
redis-cli config get notify-keyspace-events
# 1) "notify-keyspace-events"
# 2) ""
redis-cli config set notify-keyspace-events Ex
# OK

```  
 
If process.env.NODE_ENV !== 'production', then following environment variables must be filled in:
```js
process.env.MA_SERVER_PORT
process.env.REDIS_HOST,
process.env.REDIS_PORT
```
Otherwise please add these values int [config/dev](https://github.com/oshykun/ma-tt/blob/master/config/dev.js) file 

### Build

Before starting the service we need to install all npm packages:
```
npm i
```

### Run

To start service simply run following command:
```
npm start
```
It will start API at http://localhost:8080/

## API Documentation
To view API documantation open:
http://localhost:8080/v1.0/docs
After starting service.

## Schedule message:

To schedule a message you should sent an http **POST** request to /echoAtTime, please see [API documentation](http://localhost:8080/v1.0/docs/) after start, in **Models** section for detailed info.   
Body example:
```JSON
{
  "message": "Really important message to be printed",
  "datetime": "2018-08-15T08:17:05Z"
}
```

## Built With

* [Express](https://expressjs.com/) - The web framework designed for building web applications and APIs.
* [Infuse.js](https://github.com/soundstep/infuse.js/blob/master/README.md) - Inversion of Control library
* [Swagger Tools](https://swagger.io/tools/) - Used to build and document RESTful API.
* [Redis Keyspace Notifications](https://redis.io/topics/notifications) - Used to scheduling messages. 
