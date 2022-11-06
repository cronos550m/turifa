const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = (timeStamp) => {
    return format(timeStamp);
}

module.exports = helpers;