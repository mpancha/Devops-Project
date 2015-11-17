// deployment infrastructure code
var express = require('express')
var redis = require('redis')
var bodyParser = require('body-parser')
var mailin = require('mailin');
var Ansible = require('node-ansible')
var http      = require('http');
var httpProxy = require('http-proxy');

var pserver,infra;
var infrastructure = {
  setup: function(){
     var client = redis.createClient(6379, '127.0.0.1', {});
     var CANARY = client.get('canary');
     var PRODUCTION = client.get('production');
     var count = 0;
     var app = express()
     var reload_production = new Ansible.Playbook().playbook('production').inventory('inventory_production');
     var reload_canary = new Ansible.Playbook().playbook('canary').inventory('inventory_canary');
     var prod_only = false;

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
    
     // start alert reciever
     mailin.start({
        port: 25,
        disableWebhook: true // Disable the webhook posting.
     });
    /* Access simplesmtp server instance. */
mailin.on('authorizeUser', function(connection, username, password, done) {
  if (username == "johnsmith" && password == "mysecret") {
    done(null, true);
  } else {
    done(new Error("Unauthorized!"), false);
  }
});

/* Event emitted when a connection with the Mailin smtp server is initiated. */
mailin.on('startMessage', function (connection) {
  /* connection = {
      from: 'sender@somedomain.com',
      to: 'someaddress@yourdomain.com',
      id: 't84h5ugf',
      authentication: { username: null, authenticated: false, status: 'NORMAL' }
    }
  }; */
  console.log(connection);
});

    /* Event emitted after a message was received and parsed. */
     mailin.on('message', function (connection, data, content) {
        console.log(data);
        console.log('Stopping canary');
        prod_only = true;
     });

     pserver  = http.createServer(function(req, res) {
       count++;
       if(prod_only == false && count % 10 == 1){
          proxy.web( req, res, {target: CANARY } );
       } else {
          proxy.web( req, res, {target: PRODUCTION } );
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
