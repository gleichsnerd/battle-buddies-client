/*
 * Player
 */

class Player {

  constructor(params) {
    this.name = params.name; 
    this.id = params.id;
    this.publicId = params.public_id;
    this.hp = params.hp;
    this.defence = params.defence;
    this.position = params.pos;
    this.turns = params.turns;
  }
  
  getName() {
    return this.name;
  }

  getId() {
    return this.id;
  }

  getPublicId() {
    return this.publicId;
  }

  getHp() {
    return this.hp;
  }

  getDefence() {
    return this.defence;
  }

  getPosition() {
    return this.position;
  }

  updatePlayer(params) {
    this.position = params.pos;
    this.hp = params.hp;
    this.defence = params.defence;
    this.turns = params.turns;
  }

  getLatestTurn() {
    let turns = this.turns;
    if(turns != null) {
      return turns[turns.length - 1];
    }
    return {};
  }

  wasAttacked() {
    let turn = this.getLatestTurn();

    turn.events.forEach(event => {
      if(event.action == "attacked" && event.success = false) {
        return true;
      }
    });

    return false;
  }

  isDead() {
    return this.getHp() <= 0;
  }

}

module.exports = Player;