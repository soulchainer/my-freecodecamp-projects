(function(){
    /** @constant {String} EMPTY - Represent an EMPTY square in the board */
    const EMPTY = '*';
    /** @constant {String} X - The X token for the board*/
    const X = 'X';
    /** @constant {String} O - The O token for the board */
    const O = 'O';
    /**
     * @constant {Number} TOP - The maximum value to be used by the search
     * tree algorithm.
     */
    const TOP = 100;

    /**
     * Answer if the row isn't empty and all their elements are equal.
     * @param {String[]} row - Array of tokens of one winning line.
     * @returns {Boolean} True if all line elements are equal and not the
     * empty token, false otherwise.
     */
    function threeInARow(row) { // return true if all row elements are equal
        let token = row[0];
        if (token !== EMPTY) {
            return row.every(element => element === token);
        }
    }

    /** Class representing a board. */
    class Board {
        /** Create a board. */
        constructor() {
            this.squares = Array(9).fill(EMPTY);
        }

        /** Draw the game board. */
        draw() {
            let board = '';
            for (let [index, value] of this.squares.entries()) {
                board += (index % 3)? value: `\n${value}`;
            }
            console.log(board);
        }

        /**
         * Place the token of a player in the board.
         * @param {Number} move - The position where the token will be placed.
         * @param {String} player - The token of the player.
         */
        makeMove(move, player) {
            this.squares[move] = player;
        }

        /**
         * Remove the player token in the given position of the board.
         * @param {Number} move - The position of the token to be erased.
         */
        undoMove(move) {
            this.makeMove(move, EMPTY);
        }
    }

    /** Class representing a Tic Tac Toe game */
    class TicTacToe {
        /**
         * Create a Tic Tac Toe game.
         * @property {Board} board - The board where the game is played.
         * @property {Object.<String, String>} - Pairs each token with their
         * opposite, for easy switching between player tokens.
         * @property {Number} turn - The actual turn of the game.
         * @property {Array[]} lines - Array of winning lines in a Tic Tac Toe
         * game.
         */
        constructor() {
            this.board = new Board();
            this.rival = {'O': 'X', 'X': 'O'};
            this.turn = 0;
            this.lines= [[0,1,2], [3,4,5], [6,7,8], // vertical
                        [0,3,6], [1,4,7], [2,5,8], // horizontal
                        [0,4,8],[2,4,6]];          // diagonal
        }

        /**
         * Get squares still available (empty) in the board.
         * @returns {Number[]} List of empty squares in the board.
         */
        getValidMoves() {
            let squares = this.board.squares;
            let emptySquare = function(element, index) {
                return squares[index] === EMPTY;
            };
            return [...squares.keys()].filter(emptySquare.bind(this));
        }

        /**
         * Answer if the game has come to an end.
         * @returns {Boolean} True or false if game has come to an end or not.
         */
        isGameOver() {
            return this.getWinner() || !this.getValidMoves().length;
        }

        /**
         * Get the token of the winner player.
         * @returns {?String} The token of the actual winner. null means a tie.
         */
        getWinner() {
            for (let line of this.lines) {
                let row = line.map(element => this.board.squares[element]);
                if (threeInARow(row)) {
                    return row[0];
                }
            }
            return null;
        }

        /**
         * Evaluate (score) the state of the player at the end of a game.
         * The possible states are: «Win» (a positive number),
         * «Lose» (a negative) or «Tie» (zero).
         * Take the number of moves done (depth) into account. Not taking that
         * into account leads to a CPU playing awfully: a win in 4 moves is
         * more valuable that one achieved in 6.
         * @param {String} player - The token of the player which state is
         * being evaluated.
         * @param {Number} depth - The number of moves done to reach the actual
         * state of the game.
         *
         * @returns {Number} The score of the actual state from the player
         * perspective.
         */
        evalFinalState(player, depth) {
            let winner = this.getWinner();
            if (winner === player) {
                return TOP - depth;
            } else if (winner === this.rival[player]) {
                return -TOP + depth;
            }
            return 0;
        }

        /**
         * Check if the game can continue or not and act according to that.
         * If game can continue, run the next player turn.
         * If not, draw the final status of the game
         * @param {String} player - The token of the actual player.
         * @param {Function} playerFunction - The function to execute if the
         * game should continue.
         */
        continueGame(player, playerFunction) {
            if (this.isGameOver()) {
                this.board.draw();
                let winner = this.getWinner();
                console.log((winner)? `Player ${winner} won.`: 'It was a tie.');
            } else {
                playerFunction.bind(this)(this.rival[player]);
            }
        }

        /**
         * Implement search of the best move to execute next in the game.
         * Use MiniMax algorithm enhanced with alpha-beta pruning.
         * @returns {Number} bestMove - Best move to do next to play perfectly.
         */
        minimax(player, depth) {
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

        /**
         * Evaluate the given position and get the best result the player could
         * achieve from that.
         * @param {Number} move - The token position being evaluated.
         * @param {Number} depth - The number of moves done to reach the
         * actual state of the game.
         * @param {String} player - The token of the player movement being
         * evaluated.
         * @param {Number} α - Best result possible till the moment for the
         * player.
         * @param {Number} β - Best result possible till the moment for the
         * opponent.
         * @returns {Number} Best situation the player could achieve from the
         * given position.
         */
        maxValue(move, depth, player, α, β) {
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

        /**
         * Evaluate the given position and get the worst result for the player
         * opponent (the best for the player).
         * @param {Number} move - The token position being evaluated.
         * @param {Number} depth - The number of moves done to reach the
         * actual state of the game.
         * @param {String} player - The token of the player movement being
         * evaluated.
         * @param {Number} α - Best result possible till the moment for the
         * player.
         * @param {Number} β - Best result possible till the moment for the
         * opponent.
         * @returns {Number} Worst situation the opponent player could achieve
         * from the given position.
         */
        minValue(move, depth, player, α, β) {
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

        /**
         * Run cpu player turn.
         * @param {String} player - Token for the actual player.
         */
        cpuPlayer(player) {
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

        /**
         * Run human player turn.
         * @param {String} player - Token for the actual player.
         */
        humanPlayer(player) {
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

        /**
         * Start the Tic Tac Toe game.
         * @param {String} [playerOne='cpu'] - Player one (starts the game).
         * @param {String} [token='X'] - Token of the player one.
         */
        start(playerOne='cpu', token='X') {
            if (playerOne === 'cpu') {
                this.cpuPlayer(token);
            } else {
                this.humanPlayer(token);
            }
        }
    }

    /**
     * Create and launch a Tic Tac Toe game.
     */
    function game(){
        let ttt = new TicTacToe();
        ttt.start();
    }

    game();
})();