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
    this.view.addTile(this.model.getTileValue(), this.model.getTileLocation());
    this.model.updateTileLocations();
    this.view.addTile(this.model.getTileValue(), this.model.getTileLocation());
  },
  addKeyListener: function() {
    document.addEventListener("keyup", this.moveBoard.bind(this));
  },
  moveBoard: function(key) {
    if (key.keyIdentifier === "Up" || key.keyIdentifier === "Down" || key.keyIdentifier === "Left" || key.keyIdentifier === "Right" ) {
      this.shiftTiles(key.keyIdentifier);
      this.model.updateTileLocations();
      this.checkBoard();
      this.view.addTile(this.model.getTileValue(), this.model.getTileLocation());
    }
  },
  shiftTiles: function( direction ) {
    switch( direction ) {
      case "Left":
      this.view.shiftRowOrColumn( "r", "northWest" );
      break;
      case "Right":
      this.view.shiftRowOrColumn( "r", "southEast" );
      break;
      case "Up":
      this.view.shiftRowOrColumn( "c", "northWest" );
      break;
      case "Down":
      this.view.shiftRowOrColumn( "c", "southEast" );
      break;
    }
  },
  checkBoard: function() {
    var tiles = document.getElementsByClassName(this.view.tileClass);
    for (var i = 0; i < 16; i ++) {
      if (tiles[i].textContent === "2048") {
        this.view.alertPlayer( "You win!" );
      }
    }

    if (this.model.tileLocations.length === 0) {
      this.view.alertPlayer( "You lose!" );
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
  shiftRowOrColumn: function(refLetter, direction) {
    for (var i = 0; i < 4; i++) {
      var divClass = refLetter + i;
      var selectedDivs = document.getElementsByClassName(divClass);
      var orderValues = this.orderValues(selectedDivs, direction);
      var combinedValues = this.combineTiles(orderValues, direction);
      this.displayNewRowOrCol(selectedDivs,combinedValues);

      var newValues = this.orderValues(selectedDivs, direction);
      this.displayNewRowOrCol(selectedDivs,newValues);
    }
  },
  displayNewRowOrCol: function(selectedDivs, divValues) {
    for (var i = 0; i < 4; i++) {
      selectedDivs[i].textContent = divValues[i];
    }
  },
  orderValues: function(selectedDivs, direction) {
    var divEmpties = [];
    var divValues = [];
    for (var i = 0; i < 4; i++) {
      if ( selectedDivs[i].textContent !== "" ) {
        divValues.push(selectedDivs[i].textContent);
      } else {
        divEmpties.push("");
      }
    }

    if (direction === "northWest") {
      return divValues.concat(divEmpties);
    } else if (direction === "southEast") {
      return divEmpties.concat(divValues);
    }

  },
  combineTiles: function(values, direction) {
    if (direction === "northWest") {
      for (var i = 0; i < 4; i++) {
        if (values[i] === values[i+1] && values[i] !== "" ) {
          values[i] = 2*values[i];
          values[i+1] = "";
        }
      }
    } else if (direction === "southEast") {
      for (var i = 3; i >= 0; i--) {
        if (values[i] === values[i-1] && values[i] !== "" ) {
          values[i] = 2*values[i];
          values[i-1] = "";
        }
      }
    }
    return values;
  },
  alertPlayer: function(message) {
    alert(message);
  }

}

window.onload = function() {
  var view = new View();
  var model = new Model();
  var controller = new Controller(view, model);
  controller.addListeners();
  controller.startNewGame();
}