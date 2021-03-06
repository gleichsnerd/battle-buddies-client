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
      timeout: 600000,
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

  start(name = "Bobby") {
    console.log("Starting server");

    return this.registerPlayer(name).then(player => {
      this.sendTurn(player, this.game);
    });
  }

  sendTurn(player, game) {
    let turn = this.turnManager.calculateTurn(player, game);

    return turn.then( response => {
      let content = this.parseResponse(response);
      this.game.updateFromJson(content.game);

      player.updatePlayer(content.game.player);

      if(player.isDead()) {
        return this.gameOver();
      }

      return this.sendTurn(player, game);
    }).catch( err => {
      console.error(err);
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

console.log(this);
let url = "http://localhost:8282";
let gameServer = new GameServer(url);
gameServer.start(process.argv[2]).catch( error => {
  console.error(error);
});
