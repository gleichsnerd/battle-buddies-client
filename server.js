let request = require('request-promise-native');
let EventEmitter = require('events');

let Player = require('./player');
let TurnManager = require('./turnManager');

class GameServer extends EventEmitter {

  constructor(url) {
    super();
    this.url = url;
    this.running = false;

    this.turnManager = new TurnManager(url);
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
    return request(addPlayerParams).then((body) => {
      let msg = JSON.parse(body);
      
      this.player = new Player(msg.content);
      console.log(`Player registered! Name: ${this.player.getName()} Id: ${this.player.getId()}`)
    }).catch( error => {
      console.error(`Unable to register player: ${error}`);
    });
  }

  start() {
    this.running = true;
    console.log("Starting server");
    this.registerPlayer("Mada").then(() => {
      this.sendTurn();
    });
  }

  sendTurn() {
    let turn = this.turnManager.calculateTurn(this.player.getId());

    turn.then(() => {
      this.sendTurn();
    });
  }

  getBoard() {
    this.turnManager.getBoard();
  }

  gameOver() {
    console.log("Game over!");
  }
}

let url = "http://localhost:8282";
let gameServer = new GameServer(url);
gameServer.start();




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
