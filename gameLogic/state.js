const Room = require('./Room');

const state = {
  lastRoomId: 4,
  rooms: [
    new Room(1, () => state.closeRoom(1)),
    new Room(2, () => state.closeRoom(2)),
    new Room(3, () => state.closeRoom(3)),
    new Room(4, () => state.closeRoom(4)),
  ],
  getRoomById(id) {
    return state.rooms.filter(room => room.id == id)[0];
  },
  closeRoom(id) {

    state.rooms.some((room, index) => {
      if(room.id == id) {
        state.rooms.splice(index, 1);
        return true;
      }
      return false;
    });
  },
  manageRooms() {
    const fullRooms = this.rooms.filter(room => {
      if(room.players.length > 0 || room.queue.players.length > 0)
        return true;
    })

    if(this.rooms.length - fullRooms.length < 2) {
      // this.rooms.push(new Room(++this.lastRoomId));
      let lowestId = 1;
      this.rooms.forEach(room => lowestId == room.id && lowestId++);
      this.rooms.some((room, index) => {
        if(this.rooms[index+1] == undefined) {
          this.rooms.push(new Room(lowestId));
          return true;
        }

        if(this.rooms[index].id < lowestId)
          return false;
        
        this.rooms.splice(index, 0, new Room(lowestId))
        return true;
      })
    }
  }
}

module.exports = state;