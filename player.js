/*
 * Player
 */

class Player {

  constructor(params) {
    console.log(params)
    this.name = params.name; 
    this.id = params.id;
    this.hp = params.hp;
    this.position = params.pos;
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

  getPosition() {
    return this.position;
  }

  updatePlayer(params) {
    console.log(`params ${params}`)
    this.position = params.pos;
  }

}

module.exports = Player;