let Player = require('./player');

class Game {
  
  constructor() {
    this.players = {};
  }

  updateFromJson(response) {
    this.board = response.board;
    this.players = this.parseBoardForPlayers(response.board);
  }

  parseBoardForPlayers(board) {
    let playerHash = {};
    
    board.grid.forEach( (column, x) => {
      column.forEach( (cell, y) => {
        if (cell != null) {
          cell.pos = { x : x, y : y };
          
          playerHash[cell.public_id] = new Player(cell);
        }
      })
    });

    return playerHash;
  }

  nearestPlayerTo(self) {
    let players = this.players;
    
    let dist = 10000;
    let closestPlayer;

    for(let pid in players) {
      let player = players[pid];

      if(pid !== self.getPublicId()) {
        let newDist = this.getDistanceBetweenPlayers(self, player);

        if(dist > newDist) {
          dist = newDist;
          closestPlayer = player;
          console.log(`Target acquired: ${closestPlayer.getName()} ${dist} spaces away`);
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