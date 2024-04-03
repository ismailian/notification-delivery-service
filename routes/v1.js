const router = require('express').Router();

router.use('/jobs', require('../app/handlers/Jobs'));

/** export */
module.exports = router;