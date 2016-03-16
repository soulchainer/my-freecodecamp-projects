(function(){
    /** Library imports for Browserify */
    let $ = require('jbone');

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
     * @constant {picoModal} MODAL - Modal for choose token and player one of
     * the game.
     */
    // const MODAL = ;

    /**
     * Answer if the row isn't empty and all their elements are equal.
     * @param {String[]} row - Array of tokens of one winning line.
     * @returns {Boolean} True if all line elements are equal and not the
     * empty token, false otherwise.
     */
    function threeInARow(row) {
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
            this.getReady();
        }

        /** Clear and prepare the board for a new game */
        getReady() {
            for (let i = 0; i < 9; i++) {
                this[`$square${i}`] = $(`#square${i}`);
                this[`$square${i}`].html('').removeAttr('disabled');
            }
        }

        /**
         * Place the token of a player in the board.
         * @param {Number} move - The position where the token will be placed.
         * @param {String} player - The token of the player.
         * @param {Boolean} [realMove=false] - If the move is a real move in
         * the board, not a move done by the search tree algorithm.
         */
        makeMove(move, player, realMove=false) {
            this.squares[move] = player;
            if (realMove) {
                let tokenAlt = (player === 'X')? 'Cross': 'Circle';
                let token = `<img class="token-img" src="assets/images/${player}.svg" alt="${tokenAlt}">`;
                this[`$square${move}`].html(token).attr('disabled', '');
            }
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

            this.cacheDom();
            this.bindEvents();
        }

        /** Cache the DOM elements of the board */
        cacheDom() {
            this.$board = $('#board');
            this.$square = $('.square');
            this.$modal = $('.modal');
        }

        /** Bind events to DOM elements */
        bindEvents() {
            this.$square.on('click', this.handleMove.bind(this));
        }

        /** Enable the board, making it clickable. */
        enableBoard() {
            this.$board.removeClass('disabled');
        }

        /** Disable the board, making it unclickable. */
        disableBoard() {
            this.$board.addClass('disabled');
        }

        /**
         * Handle an user move try.
         * @param {Object} event - The event associated to a click
         * in a board square (a move) made by the user.
         */
        handleMove(event) {
            let move = Number(event.currentTarget.dataset.square);
            this.board.makeMove.bind(this.board)(move, this.humanToken, true);
            this.continueGame(this.humanToken, this.cpuPlayer);
        }

        /**
         * Check if the game can continue or not and act according to that.
         * If game can continue, run the next player turn.
         * If not, announce the result, reset the game and show the modal.
         * @param {String} player - The token of the actual player.
         * @param {Function} playerFunction - The function to execute if the
         * game should continue.
         */
        continueGame(player, playerFunction) {
            if (this.isGameOver()) {
                let winner = this.getWinner();
                console.log((winner)? `Player ${winner} won.`:'It was a tie.');
                window.setTimeout(this.reset.bind(this), 800);
            } else {
                playerFunction.bind(this)(this.rival[player]);
            }
        }

        /**
         * Reset a Tic Tac Toe Game.
         */
        reset() {
            this.board = new Board();
            this.turn = 0;
            this.$modal.removeClass('hidden');
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
            this.disableBoard();
            let move;
            if (this.turn) {
                move = this.minimax(player, this.turn);
            } else {
                move = Math.floor(Math.random() * this.getValidMoves().length);
            }
            this.board.makeMove(move, player, true);
            console.timeEnd('cpu move');
            this.continueGame(player, this.humanPlayer);
        }

        /**
         * Run human player turn.
         * @param {String} player - Token for the actual player.
         */
        humanPlayer(player) {
            this.turn++;
            this.enableBoard();
        }

        /**
         * Start the Tic Tac Toe game.
         * An OptionsModal should be instantiated for this to work.
         */
        start() {
            if (this.playerOne === 'human') {
                this.humanPlayer(this.humanToken);
            } else {
                this.cpuPlayer(this.rival[this.humanToken]);
            }
        }
    }

    /** Class representing an options modal window for the game. */
    class OptionsModal {
        /**
         * Create a modal for a Tic Tac Toe game.
         * @param {Object} game - A TicTacToe instance.
         */
        constructor(game) {
            this.game = game;
            this.cacheDom();
            this.bindEvents();
        }

        /** Cache the DOM elements of the modal */
        cacheDom() {
            this.$tokens = $('.token');
            this.$players = $('.player');
            this.$start = $('#start-btn');
            this.$modal = $('.modal');
        }

        /** Bind events to DOM elements */
        bindEvents() {
            this.$tokens.on('click', this.handleTokenSelection.bind(this));
            this.$players.on('click', this.handlePlayerSelection.bind(this));
            this.$start.on('click', this.handleStart.bind(this));
        }

        /**
         * Handle the token selection by the user.
         * @param {Object} event - The event associated to a click
         * in a token button made by the user, choosing their token.
         */
        handleTokenSelection(event) {
            let $this = $(event.currentTarget);
            if ($this.hasClass('unselected')) {
                this.$tokens.toggleClass('unselected');
                this.token = $this.attr('data-token');
            }
        }

        /**
         * Handle the selection of player one by the user.
         * @param {Object} event - The event associated to a click
         * in a player button made by the user, choosing which player
         * will start the game.
         */
        handlePlayerSelection(event) {
            let $this = $(event.currentTarget);
            if ($this.hasClass('unselected')) {
                this.$players.toggleClass('unselected');
                this.playerOne = $this.attr('data-playerone');
            }
        }

        /**
         * Handle the click in the modal start button by the user.
         * @param {Object} event - The event associated to a click
         * in the start button made by the user, for starting the game.
         */
        handleStart(event) {
            this.game.playerOne = this.playerOne || 'human';
            this.game.humanToken = this.token || 'X';
            this.$modal.addClass('hidden');
            this.game.start();
        }
    }

    /** Create and launch a Tic Tac Toe game. */
    function newGame(){
        let ttt = new TicTacToe();
        let modal = new OptionsModal(ttt);
    }

    newGame();
})();