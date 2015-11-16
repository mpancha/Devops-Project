// deployment infrastructure code
var express = require('express')
var redis = require('redis')
var bodyParser = require('body-parser')
var app = express()
var lb = express()
var Ansible = require('node-ansible')
var reload_production = new Ansible.Playbook().playbook('production').inventory('inventory_production');
var reload_canary = new Ansible.Playbook().playbook('canary').inventory('inventory_canary');
var client = redis.createClient(6379, '127.0.0.1', {});
//var prod = reload_production.exec();
//var can = reload_canary.exec();
//can.then(function(successResult) {
//  console.log(successResult.code); // Exit code of the executed command 
//  console.log(successResult.output) // Standard output/error of the executed command 
//}, function(error) {
//  console.error(error);
//})
//prod.then(function(successResult) {
//  console.log(successResult.code); // Exit code of the executed command 
//  console.log(successResult.output) // Standard output/error of the executed command 
//}, function(error) {
//  console.error(error);
//})
// Process POST from webhooks to deploy to production
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.post('/deploy', function(req, res){
   console.log(req.body.ref) // form fields
   if(req.body.ref.indexOf('dev') > -1) {
       var deploy = reload_production.exec();
       deploy.then(function(success){console.log(success.output)}, function(error){console.error(error);})
   };
   if(req.body.ref.indexOf('release') > -1) {
       var deploy = reload_canary.exec();
       deploy.then(function(success){console.log(success.output)}, function(error){console.error(error);})
   };
   res.status(204).end()
});
console.log("Starting App at 8000")
app.listen(8000) 
