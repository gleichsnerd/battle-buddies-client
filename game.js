let Player = require('./player');

class Game {
  
  constructor() {

  }

  updateFromJson(response) {
    this.board = response.board;
    this.players = this.parsePlayers(response.players);
  }

  parsePlayers(playerJsonArray) {
    let playerHash = {};
    
    playerJsonArray.forEach(playerJson => {
      playerHash[playerJson.id] = new Player(playerJson);
    });

    return playerHash;
  }

  nearestPlayerTo(self) {
    let players = this.players;
    
    let dist = 10000;
    let closestPlayer;

    for(let player in players) {
      if(player.getId() !== self.getId()) {
        let newDist = this.getDistanceBetweenPlayers(self, player);

        if(dist > newDist) {
          dist = newDist;
          closestPlayer = player;
        }
      }
    }

    return closestPlayer;
  }

  getDistanceBetweenPlayers(p1, p2) {
    let x1 = p1.getPosition().x;
    let y1 = p1.getPosition().y;
    let x2 = p2.getPosition().x;
    let y2 = p2.getPosition().y;

    return Math.sqrt((x2 - x1) ^ 2 + (y2 - y1) ^ 2);
  }

  getDirectionFromCoordinates(selfX, selfY, pX, pY) {
    if (pX > selfX) {
      return "right";
    } else if (pX < selfX) {
      return "left";
    } else if (pY > selfY) {
      return "up";
    } else if (pY < selfY) {
      return "down";
    }

    return "none";
  }
}

module.exports = Game