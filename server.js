let request = require('request-promise-native');
let EventEmitter = require('events');

let Player = require('./player');
let TurnManager = require('./turnManager');
let Game = require('./game');

class GameServer extends EventEmitter {

  constructor(url) {
    super();
    this.url = url;
    this.running = false;

    this.turnManager = new TurnManager(url);
    this.game = new Game();
  }

  registerPlayer(name) {
    let addPlayerParams = {
      method: 'POST',
      uri: `${this.url}/player`,
      form : {
        name: name
      }
    }

    console.log(`Attempting to register player with the name of ${name}`);
    return request(addPlayerParams).then(
      body => {
        let msg = JSON.parse(body);
        
        this.player = new Player(msg.content);
        console.log(`Player registered! Name: ${this.player.getName()} Id: ${this.player.getId()}`)

        return this.player;
      }, 
      error => {
        throw new Error(`Unable to register player: ${error.message}`);
      }
    );
  }

  start() {
    this.running = true;
    console.log("Starting server");

    return this.registerPlayer("Adam").then(player => {
      this.sendTurn(player, this.game);
    });
  }

  sendTurn(player, game) {
    let turn = this.turnManager.calculateTurn(player, game);

    return turn.then( response => { 
      let content = this.parseResponse(response);
      this.game.updateFromJson(content.game);

      return this.sendTurn(player, game);
    });
  }

  getBoard() {
    this.turnManager.getBoard();
  }

  gameOver() {
    console.log("Game over!");
  }

  parseResponse(response) {
    let json = JSON.parse(response);

    return json.content;
  }
}

let url = "http://localhost:8282";
let gameServer = new GameServer(url);
gameServer.start().catch( error => {
  console.error(error);
});




// console.log("Starting server")

// let addPlayerParams = {
//   url: `${url}player`,
//   form: {
//     name: "Adam"
//   }
// };

// request.post(addPlayerParams, function(err, res, body) {
  

//   let moveRightParams = {
//     url: `${url}game/turn`,
//     form: {
//       player_id: this.player.getId(),
//       action: "move",
//       direction: "right"
//     }
//   }

//   request.post(moveRightParams, function(err, res, body) {
//     console.log(body);
//   });
// });
