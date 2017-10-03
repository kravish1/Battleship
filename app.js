var Battleship = (function(){
  var _instance,_game;

  function init(){
    _game = new Game();

    return {
      getGameBoard : function(){
        return _game.buildGUI();
      },
      resetGameBoard : function(){
        return _game.resetGame();
      },
      startFire : function(){
        return _game.fire();
      }

    }
  }

  function Game(){
    this.numShips = 1;
    this.shipsSunk = 0;
    this.boardSize = 5;
    this.shipLength = 3;
    this.shipsSunk = 0;
    this.guesses = 0;
    this.ships = [];

  }

  Game.prototype = {
    buildGUI : function(){
      var locations;
        for(var i=0;i<this.numShips;i++){
          this.ships.push({});
          this.ships[i].locations = [0,0,0];
          this.ships[i].hits = [];
          do{
            locations = this.generateLocations(this.ships[i]);
          }while(this.collision(locations));
          this.ships[i].locations = locations;
        }

        console.log(this.ships);
    },
    generateLocations : function(ship){
      var direction = Math.floor(Math.random() * 2),row,col,
      newLocation = [];
      if(direction === 1){
        row = Math.floor(Math.random() * this.boardSize);
        col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      }
      else{
        row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        col = Math.floor(Math.random() * this.boardSize);
      }

      for(var i=0;i<this.shipLength;i++){
        if(direction === 1){
          newLocation.push(row + '' + (col+i));
        }
        else{
          newLocation.push((row+i) + '' + col);
        }
      }

      return newLocation;
    },
    collision : function(loc){
      for(var i=0;i<this.numShips;i++){
        var ship = this.ships[i];
        for(var j=0;j<loc.length;j++){
          if(typeof ship !== 'undefined' && ship.locations.indexOf(loc[j]) >= 0){
            return true;
          }
        }
      }
      return false;
    },
    resetGame : function(){
      var guess = document.getElementById('guess'),
      message = document.getElementById('status'),
      fireBtn = document.getElementById('fire'),
      score = document.getElementById('score'),
      cell = document.querySelectorAll('[data]');
      cell.forEach(piece => {
        if(piece.classList.contains('ship')){
          piece.classList.remove('ship');
        }
      });

      message.innerHTML = '';
      score.innerHTML = '';
      fireBtn.disabled = false;
      guess.disabled = '';
      guess.disable
      this.ships = [];
      this.guesses = 0;
      this.shipsSunk = 0;
      this.buildGUI();
    },
    fire : function(){
      var guess = document.getElementById('guess'),
      message = document.getElementById('status'),
      fireBtn = document.getElementById('fire'),
      score = document.getElementById('score'),
      input,status,cell;
        input = this.processGuess(guess.value);
        guess.value = '';
        if(input){
          this.guesses++;
          status = this.checkForHit(input);

          if(this.shipsSunk === this.numShips){
            cell = document.querySelectorAll('[data=' + CSS.escape(input) +']');
            cell[0].classList.add('ship');
            message.innerHTML = 'You Won!!!';
            message.classList.add('hit');
            score.innerHTML = this.guesses + ' Guesses';
            guess.setAttribute('disabled','disabled');
            fireBtn.disabled = true;
          }
          else{
            score.innerHTML = this.guesses + '';
            if(status){
              message.innerHTML = 'HIT!';
              cell = document.querySelectorAll('[data=' + CSS.escape(input) +']');
              cell[0].classList.add('ship');
            }
            else{
              message.innerHTML = 'MISS!';
              message.classList.add('miss');
            }
          }

        }
        else{
          alert('Invalid Guess');
        }
    },
    processGuess : function(guess){
      var output;
      if(guess.length !== 2){
        return output;
      }

      var alphabet = ['A','B','C','D','E'],
      firstChar = guess.charAt(0).toUpperCase(),
      secondChar = guess.charAt(1);

      if(alphabet.indexOf(firstChar) >= 0 && ((secondChar >= 0) && (secondChar <= (this.boardSize - 1)))){
        output = alphabet.indexOf(firstChar) + '' + secondChar;
      }

      return output;
    },
    checkForHit : function(input){
      for(var i=0;i<this.numShips;i++){
        var ship = this.ships[i];
        if(ship.locations.indexOf(input) >= 0){
          if(ship.hits.length < 2){
            ship.hits.push('hit');
          }else{
            ship.hits.push('hit');
            this.shipsSunk++;
          }
          return true;
        }
      }
      return false;
    }
  }
  return {
    getInstance : function(){
      if(!_instance){
        _instance = init();
      }
      return _instance;
    }
  }
})();
