/*
 * Player
 */

class Player {

  constructor(params) {
    console.log(params)
    this.name = params.name; 
    this.id = params.id;
    this.hp = params.hp;
  }
  
  getName() {
    return this.name;
  }

  getId() {
    return this.id;
  }

  getHp() {
    return this.hp;
  }

  updatePlayer(params) {
    this.hp = params.hp;
    this.position = params.position;
  }

}

module.exports = Player;