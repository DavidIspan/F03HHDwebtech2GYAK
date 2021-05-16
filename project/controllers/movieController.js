const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');

router.get('/', (req, res) => {
    res.render("movie/add", {
        viewTitle: "Movie List"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var movie = new Movie();
    movie.fullTitle = req.body.fullTitle;
    movie.director = req.body.director;
    movie.categorie = req.body.categorie;
    movie.actor = req.body.actor;
    movie.save((err, doc) => {
        if (!err)
            res.redirect('movie/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("movie/add", {
                    viewTitle: "Movie List",
                    movie: req.body
                });
            }
            else
                console.log('Error during Movie insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Movie.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('movie/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("movie/add", {
                    viewTitle: 'Update Movie',
                    movie: req.body
                });
            }
            else
                console.log('Error during Movie update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Movie.find((err, docs) => {
        if (!err) {
            res.render("movie/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving Movie list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullTitle':
                body['fullTitleError'] = err.errors[field].message;
                break;
            case 'director':
                body['directorError'] = err.errors[field].message;
                break;
            case 'categorie':
                body['categorieError'] = err.errors[field].message;
                break;
            case 'actor':
                body['actorError'] = err.errors[field].message;
                break;    
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Movie.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("movie/add", {
                viewTitle: "Update Movie",
                employee: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Movie.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/movie/list');
        }
        else { console.log('Error in Movie delete :' + err); }
    });
});

module.exports = router;