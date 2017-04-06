let Player = require('./player');

class Game {
  
  constructor() {
    this.players = {};
  }

  updateFromJson(response) {
    this.board = response.board;
    console.log(`Players Array ${response.players}`);
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

    for(let pid in players) {
      let player = players[pid];

      console.log(`Enemy ${player.getName()}`);
      console.log(`Self ${self.getName()}`);


      if(pid !== self.getId()) {
        console.log("Enemy spotted");
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

    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  getDirectionTowardsPlayer(self, player) {
    let selfX = self.getPosition().x,
        selfY = self.getPosition().y, 
        pX = player.getPosition().x, 
        pY = player.getPosition().y;
    
    if (pX > selfX) {
      return "right";
    } else if (pX < selfX) {
      return "left";
    } else if (pY < selfY) {
      return "up";
    } else if (pY > selfY) {
      return "down";
    }

    return "none";
  }
}

module.exports = Game