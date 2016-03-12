(function(){
    const EMPTY = '*';
    const X = 'X';
    const O = 'O';
    const TOP = 100;

    function threeInARow(row) { // return true if all row elements are equal
        let token = row[0];
        if (token !== EMPTY) {
            return row.every(element => element === token);
        }
    }

    class Board {
        constructor() { // initialize the board
            this.squares = Array(9).fill(EMPTY);
        }

        draw() { // draw the game board
            let board = '';
            for (let [index, value] of this.squares.entries()) {
                board += (index % 3)? value: `\n${value}`;
            }
            console.log(board);
        }

        makeMove(move, player) { // make a move
            this.squares[move] = player;
        }

        undoMove(move) { // undo a move
            this.makeMove(move, EMPTY);
        }
    }

    class TicTacToe {
        constructor() {
            this.board = new Board();
            this.rival = {'O': 'X', 'X': 'O'};
            this.turn = 0;
            this.lines= [[0,1,2], [3,4,5], [6,7,8], // vertical
                        [0,3,6], [1,4,7], [2,5,8], // horizontal
                        [0,4,8],[2,4,6]];          // diagonal
        }

        getValidMoves() { // return valid moves still available (empty) in board
            let squares = this.board.squares;
            let emptySquare = function(element, index) {
                return squares[index] === EMPTY;
            };
            return [...squares.keys()].filter(emptySquare.bind(this));
        }

        isGameOver() { // return true if game ended (someone won or board full)
            return this.getWinner() || !this.getValidMoves().length;
        }

        getWinner() { // return the winner: X, O  or null (tie)
            for (let line of this.lines) {
                let row = line.map(element => this.board.squares[element]);
                if (threeInARow(row)) {
                    return row[0];
                }
            }
            return null;
        }

        evalFinalState(player, depth) {
        // eval state at the end of the game for player
        // 0 is a tie, positive values, winner states and negative, loser ones
        // A status value depends of the depth when you reach it: a winner
        // status reached sooner is better than one reached later
        // If we don't have depth into account, cpu plays awfully
            let winner = this.getWinner();
            if (winner === player) {
                return TOP - depth;
            } else if (winner === this.rival[player]) {
                return -TOP + depth;
            }
            return 0;
        }

        continueGame(player, playerFunction) {
        // check if the game continues or not
        // if game can continue, run the next player turn
        // if not, draw the final status of the game
            if (this.isGameOver()) {
                this.board.draw();
                let winner = this.getWinner();
                console.log((winner)? `Player ${winner} won.`: 'It was a tie.');
            } else {
                playerFunction.bind(this)(this.rival[player]);
            }
        }

        minimax(player, depth) {
        // return the best move to do from the actual game state
        // use alpha-beta pruning algorithm, an improvement of minimax one
            let bestMove,
                currentMax,
                max = -TOP;
            for (let move of this.getValidMoves()) {
                currentMax = this.minValue(move, depth, this.rival[player],
                                           -TOP, TOP);
                if (currentMax > max) {
                    max = currentMax;
                    bestMove = move;
                }
            }
            return bestMove;
        }

        maxValue(move, depth, player, α, β) {
        // maximizer function
        // return a integer with the calculated value of the best
        // situation that «move» could lead the player
        // Bigger value means more chance to win
            try {
                this.board.makeMove(move, player);
                if (this.isGameOver()) {
                    return this.evalFinalState(player, depth);
                }
                for (let move of this.getValidMoves()) {
                    α = Math.max(α,
                                 this.minValue(move, depth + 1,
                                               this.rival[player], α, β));
                    if (α >= β) {
                        return β;
                    }
                }
                return α;
            }
            finally {
                this.board.undoMove(move);
            }
        }

        minValue(move, depth, player, α, β) {
        // minimizer function
        // return a integer with the calculated value of the best
        // situation that «move» could lead to rival
        // Smaller value means more chance to win for the rival
        // (and more chance to lose to the player)
            try {
                this.board.makeMove(move, player);
                if (this.isGameOver()) {
                    return this.evalFinalState(player, depth);
                }
                for (let move of this.getValidMoves()) {
                    β = Math.min(β,
                                 this.maxValue(move, depth + 1,
                                               this.rival[player], α, β));
                    if (α >= β) {
                        return α;
                    }
                }
                return β;
            }
            finally {
                this.board.undoMove(move);
            }
        }

        cpuPlayer(player) { // run cpu player turn
            console.time('cpu move');
            this.board.draw();
            let move;
            if (this.turn) {
                move = this.minimax(player, this.turn);
            } else {
                move = Math.floor(Math.random() * this.getValidMoves().length);
            }
            console.log(`Cpu moves ${move}`);
            console.timeEnd('cpu move');
            this.board.makeMove(move, player);

            this.continueGame(player, this.humanPlayer);
        }

        humanPlayer(player) { // run human player turn
            this.turn++;
            console.log(`Turn ${this.turn}`);
            this.board.draw();
            let validMoves = this.getValidMoves();

            function askMove() { // print moves available
                console.log(`Moves available: ${validMoves}`);
                // ask player for their next move
                let move = Number(prompt('Give me your move: '));

                if (validMoves.indexOf(move) !== -1) {
                    return move;
                }
                console.log(`${move} isn't a valid move. Try again.`);
                return askMove();
            }

            let move = askMove();
            this.board.makeMove(move, player);
            this.continueGame(player, this.cpuPlayer);
        }

        start(playerOne='cpu', token='X') { // start the game
            if (playerOne === 'cpu') {
                this.cpuPlayer(token);
            } else {
                this.humanPlayer(token);
            }
        }
    }


    function game(){
        let ttt = new TicTacToe();
        ttt.start();
    }

    game();
})();