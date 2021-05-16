const mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
    fullTitle: {
        type: String,
    },
    director: {
        type: String
    },
    categorie: {
        type: String
    },
    actor: {
        type: String
    }
});

mongoose.model('Movie', movieSchema);