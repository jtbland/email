import * as express from 'express';
const uuidV1 = require('uuid/v1');

let router = express.Router();
// MAIL API
let messages = [
  {
    "id": 1,
    "thread_id": 1,
    "from": {
      "first_name": "Nicole",
      "last_name": "Bland",
      "email": "nicole.bland@gmail.com"
    },
    "to": [{
      "first_name": "Jeff",
      "last_Name": "Bland",
      "email": "blandt.jeff@gmail.com"
    }],
    "sent": false,
    "unread": false,
    "subject": "Shopping List",
    "snippet": "Blueberries, Milk, Eggs, Strawberries, Diapers.",
    "body": "<p>Blueberries, Milk, Eggs, Strawberries, Diapers.</p>",
    "created_at": 1409068800000
  },{
    "id": 2,
    "thread_id":1,
    "from": {
      "first_name": "Jeff",
      "last_Name": "Bland",
      "email": "blandt.jeff@gmail.com"
    },
    "to": [{
      "first_name": "Nicole",
      "last_name": "Bland",
      "email": "nicole.bland@gmail.com"
    }],
    "sent": true,
    "unread": false,
    "subject": "RE: Utility Bill",
    "snippet": "Pay this today, its due.",
    "body": "<p>Pay this today, its due.</p>",
    "created_at": 1409068800000
  }
];

/* GET Messages */
router.get('/', function(req, res, next) {
  res.send(messages);
});

/* SEND Messages */
router.post('/send', function(req, res, next) {
  const message = req.body;
  // TODO maybe send using SMTP
  const toSend = {
      "id": uuidV1(),
      "thread_id": message.thread_id || uuidV1(),
      "from": {
        "first_name": "",
        "last_Name": "",
        "email": message.from
      },
      "to": [{
        "first_name": "",
        "last_name": "",
        "email": message.to
      }],
      "sent": true,
      "subject": message.subject,
      "snippet": message.body.substring(0, 144),
      "body": message.body,
      "created_at": Date.now()
  };
  messages.push(toSend);
  res.send(toSend);
});

export default router;
