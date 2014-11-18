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
    this.model.updateTileLocations();
    var value = this.model.getTileValue();
    var location = this.model.getTileLocation();
    this.view.addTile(value, location);
  },
  addKeyListener: function() {
    document.addEventListener("keyup", this.moveBoard.bind(this));
  },
  moveBoard: function(key) {
    if (key.keyIdentifier === "Up" || key.keyIdentifier === "Down" || key.keyIdentifier === "Left" || key.keyIdentifier === "Right" ) {
      this.shiftTiles(key.keyIdentifier);

      this.model.updateTileLocations();
      var value = this.model.getTileValue();
      var location = this.model.getTileLocation();
      this.view.addTile(value, location);
    }
  },
  shiftTiles: function(direction) {
    switch(direction) {
      case "Left":
      this.view.shiftLeft();
      break;
      case "Right":
      this.view.shiftRight();
      break;
      case "Up":
      this.view.shiftUp();
      break;
      case "Down":
      this.view.shiftDown();
      break;
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
  updateTileLocations: function() {
    this.tileLocations = []
    //way to dry this up? repeated in View
    var tiles = document.getElementsByClassName("tile");
    for (var i = 0; i < tiles.length; i++ ) {
      if (tiles[i].textContent === "") {
        this.tileLocations.push(tiles[i].id);
      }
    }
  }
}

// View
function View() {
  this.startButton = "start";
  this.tileClass = "tile";
  this.rowIds = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];
  this.columnIds = [[1,5,9,13],[2,6,10,14],[3,7,11,15],[4,8,12,16]];
}

View.prototype = {
  getButton: function() {
    return document.getElementById(this.startButton);
  },
  addTile: function(value, location) {
    document.getElementById(location).textContent = value;
  },
  resetBoard: function() {
    var tiles = document.getElementsByClassName(this.tileClass);
    for (var i = 0; i < tiles.length; i++ ) {
      tiles[i].textContent = "";
    }
  },
  shiftLeft: function() {
    for (var i = 0; i < 4; i++) {
      var rowClass = "r" + i;
      var rowDivs = document.getElementsByClassName(rowClass);
      var rowEmpties = [];
      var rowValues = [];
      for (var j = 0; j < 4; j++) {
        if (rowDivs[j].textContent === "") {
          rowEmpties.push("");
        } else {
          rowValues.push(rowDivs[j].textContent);
        }
      }
      var newValues = rowValues.concat(rowEmpties);
      this.shiftRowOrCol(rowDivs,newValues);
    }
  },
  shiftRight: function () {
    for (var i = 0; i < 4; i++) {
      var rowClass = "r" + i;
      var rowDivs = document.getElementsByClassName(rowClass);
      var rowEmpties = [];
      var rowValues = [];
      for (var j = 3; j >= 0; j--) {
        if (rowDivs[j].textContent === "") {
          rowEmpties.push("");
        } else {
          rowValues.push(rowDivs[j].textContent);
        }
      }
      var newValues = rowEmpties.concat(rowValues);
      this.shiftRowOrCol(rowDivs,newValues);
    }
  },
  shiftUp: function() {

  },
  shiftDown: function() {

  },
  shiftRowOrCol: function(rowDivs, rowValues) {
    for (var i = 0; i < 4; i++) {
      rowDivs[i].textContent = rowValues[i];
    }
  }
}

window.onload = function() {
  var view = new View();
  var model = new Model();
  var controller = new Controller(view, model);
  controller.addListeners();
}