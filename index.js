// Controller
function Controller(view, model) {
  this.view = view;
  this.model = model;
}

Controller.prototype = {
  addListener: function() {
    var button = this.view.getButton();
    button.addEventListener("click", this.startNewGame.bind(this));
  },
  startNewGame: function() {
    // this.view.resetBoard(); ??
    // this.model.resetTileLocations(); ??
    var value = this.model.getTileValue();
    var location = this.model.getTileLocation();
    this.view.addTile(value, location);
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
    return tileLocations[Math.floor(Math.random()*tileLocations.length)]
  }
}

// View
function View(buttonElement) {
  this.startButton = buttonElement;
}

View.prototype = {
  getButton: function() {
    return document.getElementById(this.startButton);
  },
  addTile: function(value, location) {
    console.log("value: "+value+" location: "+location);
    document.getElementById(location).innerHTML = value;
  }
}

window.onload = function() {
  var view = new View("start");
  var model = new Model();
  var controller = new Controller(view, model);
  controller.addListener();
}