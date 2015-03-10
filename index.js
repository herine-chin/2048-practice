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
    this.view.resetScore();
    this.model.updateTileLocations(this.view.tileClass);
    this.view.addTile(this.model.getTileValue(), this.model.getTileLocation());
    this.model.updateTileLocations(this.view.tileClass);
    this.view.addTile(this.model.getTileValue(), this.model.getTileLocation());
  },
  addKeyListener: function() {
    document.addEventListener("keyup", this.moveBoard.bind(this));
  },
  moveBoard: function(key) {
    if (key.keyIdentifier === "Up" || key.keyIdentifier === "Down" || key.keyIdentifier === "Left" || key.keyIdentifier === "Right" ) {
      var previousBoard = this.saveBoard();
      this.shiftTiles(key.keyIdentifier);
      this.view.displayScore();
      var currentBoard = this.saveBoard();
      this.model.updateTileLocations(this.view.tileClass);
      this.winCheck();

      if (currentBoard.toString() !== previousBoard.toString()) {
        this.view.addTile(this.model.getTileValue(), this.model.getTileLocation());
      }
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
  winCheck: function() {
    var tiles = document.getElementsByClassName(this.view.tileClass);
    for (var i = 0; i < 16; i ++) {
      if (tiles[i].textContent === this.model.winTile) {
        this.view.alertPlayer( "You win!" );
      }
    }

    if ( !this.checkBoardMatches() && this.model.tileLocations.length === 0) {
      this.view.alertPlayer( "You lose!" );
    }
  },
  saveBoard: function() {
    var tiles = document.getElementsByClassName(this.view.tileClass);
    var board = [];
    for (var i =0; i<16; i++) {
      board.push(tiles[i].textContent);
    }
    return board;
  },
  checkBoardMatches: function() {
    if ( this.checkForMatches( "c" ) || this.checkForMatches( "r" ) ) {
      return true;
    } else {
      return false;
    }
  },
  checkForMatches: function( refLetter ) {
    for (var i = 0; i < 4; i++) {
      var divClass = refLetter + i;
      var selectedDivs = document.getElementsByClassName(divClass);
      var orderValues = this.view.orderValues(selectedDivs, "northWest");
      var tempValues = orderValues.slice(0);

      for (var i = 0; i < 4; i++) {
        if (tempValues[i] === tempValues[i+1] && tempValues[i] !== "" ) {
          tempValues[i] = 2*tempValues[i];
          tempValues[i+1] = "";
        }
      }

      if ( orderValues.toString() !== tempValues.toString() ) {
        return true;
        break;
      }
    }
    return false;
  }
}

// Model
function Model() {
  this.winTile = "2048";
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
  updateTileLocations: function(tileClass) {
    this.tileLocations = [];
    var tiles = document.getElementsByClassName(tileClass);
    for (var i = 0; i < tiles.length; i++ ) {
      if (tiles[i].textContent === "") {
        this.tileLocations.push(tiles[i].id);
      }
    }
  }
}

// View
function View() {
  this.score = 0;
  this.scoreId = "score";
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
          this.updateScore(values[i]);
        }
      }
    } else if (direction === "southEast") {
      for (var i = 3; i >= 0; i--) {
        if (values[i] === values[i-1] && values[i] !== "" ) {
          values[i] = 2*values[i];
          values[i-1] = "";
          this.updateScore(values[i]);
        }
      }
    }
    return values;
  },
  alertPlayer: function(message) {
    alert(message);
  },
  displayScore: function() {
    var scoreDiv = document.getElementById(this.scoreId);
    scoreDiv.textContent = this.score;
  },
  updateScore: function(score) {
    this.score += parseInt(score,10);
  },
  resetScore: function() {
    this.score = 0;
    this.displayScore();
  }
}

window.onload = function() {
  var view = new View();
  var model = new Model();
  var controller = new Controller(view, model);
  controller.addListeners();
  controller.startNewGame();
}