require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

/** initialize new express app */
const app = express();
app.set('trust proxy', '127.0.0.1');

const limiter = rateLimit({
    windowMs: 1000 * 60,
    max: 255,
    standardHeaders: true,
    legacyHeaders: false,
});

/** express configurations */
app.use(cors());
app.use(limiter);
app.use(express.json());

/**
 * TODO:
 * add authentication layer
 * e.g: JWT or an API key that rotates periodically.
 */

app.use('/v1', require('./routes/v1'));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('[+]', 'service is running on:', port));