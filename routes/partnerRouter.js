const express = require('express');
const partnerRouter = express.Router();

//below - ALL of the campsites//

partnerRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send all the partners to you.`);
})
.post((req, res) => {
    res.end(`Will add the partner: ${req.body.name} with description: ${req.body.description}`)
})
.put((req, res) => {
    // res.write(`Updating the partner: ${req.params.partner}.`)
    // res.end(`Will update the partner: ${req.params.partner} with description: ${req.params.partner}`)
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})
.delete((req, res) => {
    res.end(`Deleting all partners.`);
});

//below - ONE of the campsites//

partnerRouter.route('/:partnerId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send all the partners to you.`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on / ${req.params.partnerId}.`);
})
.put((req, res) => {
    res.write(`Updating the partner: ${req.params.partnerId}\n`)
    res.end(`Will update the partner: ${req.params.partnerId}, with description: ${req.body.description}`)
    
})
.delete((req, res) => {
    res.end(`Deleting partners: ${req.params.partnerId}`);
});

module.exports = partnerRouter;