let request = require('request');
let Player = require('./player');

let url = "http://localhost:8282/";

console.log("Starting server")

let addPlayerParams = {
  url: `${url}player`,
  form: {
    name: "Adam"
  }
};

request.post(addPlayerParams, function(err, res, body) {
  let msg = JSON.parse(body);
  this.player = new Player(msg.content);
  console.log(`Player registered! Name: ${this.player.getName()} Id: ${this.player.getId()}`)

  let moveRightParams = {
    url: `${url}game/turn`,
    form: {
      player_id: this.player.getId(),
      action: "move",
      direction: "right"
    }
  }

  request.post(moveRightParams, function(err, res, body) {
    console.log(body);
  });
});
