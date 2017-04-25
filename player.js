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
    this.position = params.position;
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
  }

  isDead() {
    return this.getHp() <= 0;
  }

}

module.exports = Player;