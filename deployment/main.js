// deployment infrastructure code
var express = require('express')
var redis = require('redis')
var bodyParser = require('body-parser')
var Ansible = require('node-ansible')
var http      = require('http');
var httpProxy = require('http-proxy');
var request = require("request");

var pserver,infra;
var infrastructure = {
  setup: function(){
     var client = redis.createClient(6379, '127.0.0.1', {});
     var proxy   = httpProxy.createProxyServer({});
     var count = 0;
     var app = express()
     var reload_production = new Ansible.Playbook().playbook('production').inventory('inventory_production');
     var reload_canary = new Ansible.Playbook().playbook('canary').inventory('inventory_canary');
     var prod_only = false;

     // Process POST from webhooks to deploy to production
     app.use(bodyParser.json())
     app.use(bodyParser.urlencoded({ extended: true }))
     app.post('/alert',function(req,res){
        console.log('alert recieved... Cut off canary traffic');
        prod_only = false;
        res.send(204);
       });
     app.post('/job/release/build',function(req, res){
        if(req.body && req.body.ref) {
          if(req.body.ref.indexOf('release') > -1) {
             console.log('Trigger Build process for release (check jenkins)')
             request("http://52.33.151.4:8080/job/release/build", function(error, response, body){});
          }
        }
        res.status(204).end()
     });
     app.post('/deploy', function(req, res){
        console.log('/deploy called for ref')
        console.log(req.body.ref) // form fields
        if(req.body && req.body.ref) {
          if(req.body.ref.indexOf('release') > -1) {
             console.log('deploying production (release)')
             var deploy = reload_production.exec();
             deploy.then(function(success){console.log(success.output)}, function(error){console.error(error);})
          };
          if(req.body.ref.indexOf('dev') > -1) {
             console.log('deploying canary (canary)')
             var deploy = reload_canary.exec();
             deploy.then(function(success){console.log(success.output)}, function(error){console.error(error);})
          };
        }
        res.status(204).end()
     });
    
     pserver  = http.createServer(function(req, res) {
       count++;
       if(prod_only == false && count % 10 == 1){
          console.log('proxy:Diverting 10% traffic to canary')
          client.get('canary',function(err, value){
            console.log('redirecting to.. ');
            console.log(value);
            proxy.web( req, res, {target: value })
          } );
       } else {
          console.log('proxy:Diverting 90% traffic to production')
          client.get('production',function(err, value){
            console.log('redirecting to.. ');
            console.log(value);
            proxy.web( req, res, {target: value })
          } );
       }
     }).listen(3000);
     infra = app.listen(8000);
  },

  teardown: function() {
     pserver.close();
     infra.close();
     //exec('./configure.py clean', function(){
     //    console.log("Infrastructure shutdown\n");
     // }
  },
}
infrastructure.setup();
// Clean Up
//process.on('exit', function(){infrastructure.teardown();} );
//process.on('SIGINT', function(){infrastructure.teardown();} );
//process.on('uncaughtException', function(err){
//  console.error(err);
//  infrastructure.teardown();} );
