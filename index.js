// Controller
function Controller(view, model) {
  this.view = view;
  this.model = model;
}

Controller.prototype = {
  addListeners: function() {
    this.addStartListener();
    this.addKeyListener();
  },
  addStartListener: function() {
    var button = this.view.getButton();
    button.addEventListener("click", this.startNewGame.bind(this));
  },
  startNewGame: function() {
    this.view.resetBoard();
    this.model.resetTileLocations();
    var value = this.model.getTileValue();
    var location = this.model.getTileLocation();
    this.view.addTile(value, location);
  },
  addKeyListener: function() {
    document.addEventListener("keyup", this.moveBoard.bind(this));
  },
  moveBoard: function(key) {
    if (key.keyIdentifier === "Up" || key.keyIdentifier === "Down" || key.keyIdentifier === "Left" || key.keyIdentifier === "Right" ) {
      this.view.shiftTiles(key.keyIdentifier);
      var value = this.model.getTileValue();
      var location = this.model.getTileLocation();
      this.view.addTile(value, location);
    }
  }
}

// Model
function Model() {
  this.tileValues = [2,4];
  this.tileLocations = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
}

Model.prototype = {
  getTileValue: function() {
    var tileValues = this.tileValues;
    return tileValues[Math.floor(Math.random()*tileValues.length)]
  },
  getTileLocation: function() {
    var tileLocations = this.tileLocations;
    return tileLocations.splice(Math.floor(Math.random()*tileLocations.length),1)
  },
  resetTileLocations: function() {
    this.tileLocations = []
    for (var i = 1; i <= 16; i++) {
      this.tileLocations.push(i);
    }
  }
}

// View
function View() {
  this.startButton = "start";
  this.tileClass = "tile";
}

View.prototype = {
  getButton: function() {
    return document.getElementById(this.startButton);
  },
  addTile: function(value, location) {
    document.getElementById(location).innerHTML = value;
  },
  resetBoard: function() {
    var tiles = document.getElementsByClassName(this.tileClass);
    for (var i = 0; i < tiles.length; i++ ) {
      tiles[i].innerHTML = "";
    }
  },
  shiftTiles: function(direction) {

  }
}

window.onload = function() {
  var view = new View();
  var model = new Model();
  var controller = new Controller(view, model);
  controller.addListeners();
}