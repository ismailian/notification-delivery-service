const crypto = require('crypto');

module.exports = {
    /**
     * sign payload with a secret 
     * 
     * @param {*} payload 
     * @param {*} secret 
     */
    sign: (payload, secret) => {
        return crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(payload))
            .digest('hex');
    },
};