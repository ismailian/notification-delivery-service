const QueueManager = require('./app/helpers/Queue');

(async () => {

    /**
     * initialize queue listener
     */
    await QueueManager.pull('nds:notifications');

})();