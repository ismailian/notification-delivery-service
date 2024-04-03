const axios = require("axios");
const Queue = require("bull");
const { sign } = require('./Signify');

require('dotenv').config();

class QueueManager {

    /** default constructor */
    constructor() { }

    /**
     * find job by id
     * 
     * @param {*} queueName 
     * @param {*} id 
     */
    static find = async (queueName, id) => {
        return await (new Queue(queueName)).getJob(id);
    };

    /**
     * add new job to queue
     *  
     * @param {*} queueName 
     * @param {*} data 
     * @returns {Number} returns job id
     */
    static push = async (queueName, data) => {
        return (await new Queue(queueName).add(data, {
            attempts: 3,
            backoff: 1000,
            timeout: 10000,
        })).id;
    }

    /**
     * start queue listener
     * 
     * @param {*} queueName 
     */
    static pull = async (queueName) => {
        await new Queue(queueName).process(async (job, callback) => {
            try {
                const { data } = job;
                const headers = {
                    "Content-Type": "application/json",
                    "User-Agent": process.env.USER_AGENT
                };

                /** sign payload if a secret is provided */
                if (data?.secret) {
                    headers['X-NDS-Signature'] = sign(data.payload, data?.secret);
                }

                await axios.post(data.url, data.payload, { headers });                
                callback();
            } catch ({ response }) {
                callback({
                    name: response.status,
                    message: response.statusText
                });
            }
        });
    }

}

module.exports = QueueManager;