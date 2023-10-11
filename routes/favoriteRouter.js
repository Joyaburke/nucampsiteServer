const express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Favorite = require('../models/favorite');

const favoriteRouter = express.Router()


favoriteRouter.route('/')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Favorite.find()
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        console.log('req', req.body)
        Favorite.create(req.body)
        .then(favorites => {
            console.log('Favorite Create ', favorites);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        })
        .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.deleteMany()
        .then(favorites => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        })
        .catch(err => next(err));
    });




favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Favorite.findById(req.params.campsiteId)
    .then(partner => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json')
        res.end (`Get operation not support on /favorites/${req.params.campsiteId}`)
    })
    .catch(err => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const campsiteId = req.params.campsiteId;
    const userId = req.user._id;

    Favorite.findOne({ user: userId })
    .then ((favorite) => {
        if(!favorite) {
            return Favorite.create({
                user: userId,
                campsites: [campsiteId],
            });
        } else if (favorite.campsites.includes(campsiteId)) {
            err.status = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("That campsite is already in the list of favorites!")
        } else {
            favorite.campsites.push(campsiteId);
            return favorite.save();
        }
    })
    .then((favorite) => {
        res.status.code = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
    })
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.setHeader("Content-Type", "application/json");
   res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}\n`);
})
   
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Favorite.findOne( {user: userId})
    .then((favorite) => {
        if(favorite) {
            const index = favorite.campsite.indexOf(req.params.campsiteId);
            if(index >= 0) {
                favorite.campsite.splice(index, 1);
                favorite.save()
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.json(favorite);
                    })
                    .catch((err) => next(err))
            } else {
                set.statusCode = 200;
                res.setHeader("Content-Type", "text/plain");
                res.end("Campsite not found.");
            } 
        } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("You do not have any favorites.");
        }
    })
    .catch((err) => next(err));
});

module.exports = favoriteRouter;