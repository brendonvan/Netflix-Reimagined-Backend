require("../config/db.connection");

module.exports = {
    User: require('./User'),
    Movie: require('./Movie'),
    Watchlist: require('./Watchlist')
}