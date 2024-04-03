const router = require('express').Router();
const cacheService = require('express-api-cache');
const { body, validationResult } = require('express-validator');
const QueueManager = require('../helpers/Queue');

const cache = cacheService.cache;

/**
 * POST /v1/jobs/dispatch
 */
router.post('/dispatch',
    body('data').isObject({ strict: true }).notEmpty(),
    body('subscribers.*.id').isNumeric(),
    body('subscribers.*.url').isURL({ protocols: ['https'] }),
    body('subscribers.*.secret').optional(),
    async (req, res) => {

        /** return errors (if any) */
        const errors = validationResult(req).array();
        if (errors?.length) {
            return res.status(400).json({
                status: false,
                errors: errors.map(e => ({ [e.path]: e.msg })).reduce((result, obj) => {
                    for (let k in obj) {
                        result[k] = obj[k];
                    }
                    return result;
                })
            });
        }

        /** check if data object is empty */
        if (!Object.keys(req.body?.data).length) {
            return res.status(400).json({
                status: false,
                errors: {
                    data: "data object cannot be empty!"
                }
            });
        }

        /** add jobs to queue */
        const jobs = [];
        const json = req.body;
        for (let i = 0; i < json.subscribers.length; i++) {
            jobs.push(parseInt(
                await QueueManager.push(
                    'nds:notifications', {
                    ...json.subscribers[i], payload: json.data
                })
            ))
        }

        return res.status(200).json({ status: true, jobs });
    });

/**
 * GET /v1/jobs/{job_id}
 */
router.get('/:id', cache('10 minutes'), async (req, res) => {
    let result = 'pending';
    const job = await QueueManager.find('nds:notifications', req.params.id);
    if (!job) {
        return res.status(400).json({
            status: false,
            error: 'invalid job'
        });
    }

    if (await job.isCompleted()) result = 'completed';
    if (await job.isDelayed()) result = 'delayed';
    if (await job.isWaiting()) result = 'waiting';
    if (await job.isPaused()) result = 'paused';
    if (await job.isStuck()) result = 'stuck';
    if (await job.isFailed()) {
        result = {
            status: 'failed',
            error: job.failedReason
        }
    }

    return res.status(200).json({
        status: true,
        job_status: result
    });
});

module.exports = router;