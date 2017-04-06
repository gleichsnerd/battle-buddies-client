let request = require('request-promise-native');
let EventEmitter = require('events');

class TurnManager extends EventEmitter {
  
  constructor(url) {
    super();
    this.url = url;
  }

  getBoard() {
    let displayParams = {
      url: `${this.url}/`
    }
  }

  calculateTurn(player, game) {
    let pid = player.getId();
    let body = this.randomWalkParams(pid);
    let params = {
      method: 'POST',
      uri: this.turnUrl(),
      form: body
    }


    return request(params);
  }

  randomWalkParams(pid) {
    let r = Math.ceil(Math.random() * 4);
    let dir = "";

    if(r === 1) {
      dir = "up";
    } else if(r === 2) {
      dir = "down";
    } else if(r === 3) {
      dir = "left";
    } else {
      dir = "right";
    }

    return {
      player_id: pid,
      action: "move",
      direction: dir
    }
  }

  makeTurn(pid, action, direction) {
    let turnParams = {
      method: 'POST',
      uri: this.turnUrl(),
      form: {
        player_id: pid,
        action: action,
        direction: direction
      }
    }

    return request(turnParams).then( body => {
      
    }).catch( error => {
      console.error(`Unable to play turn: ${error}`);
    });
  }

  turnUrl() {
    return `${this.url}/game/turn`;
  }

}

module.exports = TurnManager