import * as express from 'express';
import Author from '../models/author';
import Thread from '../models/thread';
import Message from '../models/message';

let router = express.Router();

/* GET Threads */
router.get('/thread', function(req, res, next) {
    Thread
        .find()
        .populate('participants')
        .populate({
            path: 'messages',
            options: { sort: { created_at: 1 } },
            populate: { path: 'author' }
        })
        .populate({
            path: 'messages',
            options: { sort: { created_at: 1 } },
            populate: { path: 'recipient' }
        })
        .exec(function(err, threads) {
            threads.sort((a, b) => {
                const aUpdated = a.updated_at.getTime();
                const bUpdated = b.updated_at.getTime();

                if (aUpdated < bUpdated) {
                    return 1;
                }
                if (aUpdated > bUpdated) {
                    return -1;
                }

                return 0;
            });
            if (!err) {
                res.send(threads);
            }
        });
});
/* GET Thread by ID */
router.get('/thread/:id', function(req, res, next) {
    Thread
        .findById(req.params.id)
        .populate('participants')
        .populate({
            path: 'messages',
            options: { sort: { created_at: 1 } },
            populate: { path: 'author' }
        })
        .populate({
            path: 'messages',
            options: { sort: { created_at: 1 } },
            populate: { path: 'recipient' }
        })
        .exec(function(err, thread) {
            if (!err) {
                res.send(thread);
            }
        });
});

router.delete('/thread/:id', async function(req, res, next) {
    await Thread.findByIdAndRemove(req.params.id);
    res.send(200);
});

/* SEND Messages */
router.post('/send', async function(req, res, next) {
    const messageToSend = req.body;
    const sender = await Author.findOne({ email: messageToSend.from.email });
    const recipient = await Author.findOne({ email: messageToSend.to.email });

    // get the thread or make a new one
    let thread;
    if (messageToSend.threadId) {
        thread = await Thread.findById(messageToSend.threadId);
    } else {
        thread = new Thread({
            participants: [
                sender,
                recipient
            ]
        });
    }

    const message = new Message({
        unread: false,
        subject: messageToSend.subject,
        body: messageToSend.body,
        snippet: messageToSend.body.substring(0, 50),
        recipient: recipient,
        thread: thread,
        author: sender
    });

    // save the message
    const saved = await message.save();

    // update the trhead
    thread.messages.push(message);
    const savedThread = await thread.save();

    res.send(saved);
});

export default router;
