class Jugador {
    constructor(nom) {
        this.nom = nom;
        this.puntuacio = 0;
    }
}

class Partida {
    constructor(nom, tamany) {
        this.jugador = new Jugador(nom);
        this.tamany = tamany;
        this.gameBoard = [];
        this.squareSize = 50;
        this.jugadors = [];
        this.jugadors.push(this.jugador);
        this.torn = false;
        this.getGameboard();
        this.initGame();
    }
    getGameboard() {
        this.rows = this.tamany;
        this.cols = this.tamany;
        if (this.tamany == 5) {
            this.gameBoard = [
                [0, 1, 1, 1, 1],
                [1, 0, 0, 0, 0],
                [1, 0, 1, 0, 0],
                [1, 0, 1, 0, 0],
                [0, 0, 0, 0, 0]
            ];
        } else if (this.tamany == 7) {
            this.gameBoard = [
                [0, 1, 1, 1, 1, 0, 0],
                [1, 0, 0, 0, 0, 0, 0],
                [1, 0, 1, 0, 0, 0, 0],
                [1, 0, 1, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0]
            ];
        } else if (this.tamany == 10) {
            this.gameBoard = [
                [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
        }
    }

    initGame() { 
        // get the container element
        var mainDiv = document.getElementById("clicktable");
        var ddtable = document.getElementById("ddtable");
        var gameboardDiv = document.getElementById("gameboard");
        var gameboardDiv2 = document.getElementById("gameboard2");

        if (gameboardDiv || gameboardDiv2) {
            document.getElementById("gameboard").remove();
            document.getElementById("gameboard2").remove();
        }

        var gameBoardContainer = document.createElement("div");
        var gameBoardContainer2 = document.createElement("div");
        gameBoardContainer.setAttribute("id", "gameboard");
        gameBoardContainer2.setAttribute("id", "gameboard2");
        mainDiv.appendChild(gameBoardContainer);
        ddtable.appendChild(gameBoardContainer2);

        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                // create a new div HTML element for each grid square and make it the right size
                var square = document.createElement("div");
                var square2 = document.createElement("div");
                square2.setAttribute("ondrop", "drop(event)");
                square2.setAttribute("ondragover", "allowDrop(event)");
                gameBoardContainer.appendChild(square);
                gameBoardContainer2.appendChild(square2);

                // give each div element a unique id based on its row and column, like "s00"
                square.id = 's' + j + i;
                square2.className = 'td';
                square2.id = 'td' + j + i;
                // set each grid square's coordinates: multiples of the current row or column number
                var topPosition = j * this.squareSize;
                var leftPosition = i * this.squareSize;

                // use CSS absolute positioning to place each grid square on the page
                square.style.top = topPosition + 'px';
                square.style.left = leftPosition + 'px';
                square2.style.top = topPosition + 'px';
                square2.style.left = leftPosition + 'px';
            }
        }
    


        /* lazy way of tracking when the game is won: just increment hitCount on every hit
           in this version, and according to the official Hasbro rules (http://www.hasbro.com/common/instruct/BattleShip_(2002).PDF)
           there are 17 hits to be made in order to win the game:
              Carrier     - 5 hits
              Battleship  - 4 hits
              Destroyer   - 3 hits
              Submarine   - 3 hits
              Patrol Boat - 2 hits
        */
        var hitCount = 0;

        /* create the 2d array that will contain the status of each square on the board
           and place ships on the board (later, create function for random placement!)
           0 = empty, 1 = part of a ship, 2 = a sunken part of a ship, 3 = a missed shot
        */

        // set event listener for all elements in gameboard, run fireTorpedo function when square is clicked
        var fireTorpedo;
        fireTorpedo.gameBoard = this.gameBoard;
        gameBoardContainer.addEventListener("click", fireTorpedo, false);

        // initial code via http://www.kirupa.com/html5/handling_events_for_many_elements.htm:
        function fireTorpedo(e) {
            // if item clicked (e.target) is not the parent element on which the event listener was set (e.currentTarget)
            if (e.target !== e.target.myParam) {
                // extract row and column # from the HTML element's id
                var row = e.target.id.substring(1, 2);
                var col = e.target.id.substring(2, 3);
                //alert("Clicked on row " + row + ", col " + col);
                // if player clicks a square with no ship, change the color and change square's value
                if (fireTorpedo.gameBoard[row][col] == 0) {
                    e.target.style.background = '#bbb';
                    // set this square's value to 3 to indicate that they fired and missed
                    fireTorpedo.gameBoard[row][col] = 3;

                    // if player clicks a square with a ship, change the color and change square's value
                } else if (fireTorpedo.gameBoard[row][col] == 1) {
                    e.target.style.background = 'red';
                    // set this square's value to 2 to indicate the ship has been hit
                    fireTorpedo.gameBoard[row][col] = 2;

                    // increment hitCount each time a ship is hit
                    hitCount++;
                    // this definitely shouldn't be hard-coded, but here it is anyway. lazy, simple solution:
                    if (hitCount == 17) {
                        alert("All enemy battleships have been defeated! You win!");
                    }

                    // if player clicks a square that's been previously hit, let them know
                } else if (fireTorpedo.gameBoard[row][col] > 1) {
                    alert("Stop wasting your torpedos! You already fired at this location.");
                }
            }
            e.stopPropagation();
        }

        var tds = document.querySelectorAll(".td");
        [].forEach.call(tds, function (item) {
            item.addEventListener('dragover', allowDrop, false);
            item.addEventListener('drop', drop, false);

        });

        var imatges = document.querySelectorAll('img');
        [].forEach.call(imatges, function (item) {
            item.addEventListener('dragstart', dragStart, false);

        });

        function allowDrop(ev) {
            console.log(ev);
            ev.preventDefault();
        }

        function dragStart(ev) {
            // console.log("inici drag");
            // console.log("ev.target.id: " + ev.target.id);
            ev.dataTransfer.setData("imatge", ev.target.id);
        }

        function drop(ev) {
            //console.log(ev);
            ev.preventDefault();
            var data = ev.dataTransfer.getData("imatge");
            ev.target.appendChild(document.getElementById(data));
            
        }
    }
}

