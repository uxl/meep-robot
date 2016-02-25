/*
var five = require("johnny-five");
var Raspi = require("raspi-io");

var PusherClient = require('./lib/pusher-node-client').PusherClient;

var board = new five.Board({
      io: new Raspi()
});

board.on("ready", function() {
      var led = new five.Led("P1-13");
        //led.blink();
});
*/

///
var Pusher = require('pusher');
var $ = require('jquery');

var pusher = new Pusher({
  appId: '164938',
  key: '910ee7fee2ccbc67ac43',
  secret: '134cdfdccde66f75f327',
  encrypted: true
});
pusher.port = 443;

pusher.trigger('test_channel', 'my_event', {
  "message": "server online"
});
setTimeout(function () {
  console.log('woo');
}, 10);

///
/*pusher_client = new PusherClient
  appId: (process.env.PUSHER_APP_ID or app_id)
  key: (process.env.PUSHER_KEY or pusher_key)
  secret: (process.env.PUSHER_SECRET or pusher_secret)

pres = null
pusher_client.on 'connect', () ->
  pres = pusher_client.subscribe("presence-users", {user_id: "system"})

  pres.on 'success', () ->

    pres.on 'pusher_internal:member_removed', (data) ->
      console.log "member_removed"


    pres.on 'pusher_internal:member_added', (data) ->
      console.log "member_added"

pusher_client.connect()
*/
