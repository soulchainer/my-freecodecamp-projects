(function(){
  var angular = require('angular');
  var decimal = require('decimal.js');

  var app = angular.module('js-calc', []);
  // Set the default precision to 50 significant digits
  decimal.config({ precision: 50 });

  var ans;
  var altFunctions = {
    'EE': {'type': 'constant', 'value': 'π', 'label': 'π'},
    'ln': {'value': 'e', 'label': 'e˟'},
    '×': {'value': '%', 'label': '%'},
    '^': {'value': '˟√', 'label': '˟√'},
  };
  var operators = {
    '-': {"op": negative, "precedence": 6, "arity": 1, "associativity": "right"},
    // implied multiplication
    '·': {"op": multiply, "precedence": 5, "arity": 2, "associativity": "left"},
    'E': {"op": exponent, "precedence": 5, "arity": 2, "associativity": "left"},
    'e': {"op": exponential, "precedence": 5, "arity": 1, "associativity": "right"},
    '%': {"op": percent, "precedence": 5, "arity": 2, "associativity": "right"},
    '^': {"op": power, "precedence": 4, "arity": 2, "associativity": "left"},
    '√': {"op": sqrt, "precedence": 4, "arity": 1, "associativity": "right"},
    '˟√': {"op": nthRoot, "precedence": 4, "arity": 2, "associativity": "right"},
    'acos': {"op": acos, "precedence": 3, "arity": 1, "associativity": "left"},
    'acosh': {"op": acosh, "precedence": 3, "arity": 1, "associativity": "left"},
    'asin': {"op": asin, "precedence": 3, "arity": 1, "associativity": "left"},
    'asinh': {"op": asinh, "precedence": 3, "arity": 1, "associativity": "left"},
    'atan': {"op": atan, "precedence": 3, "arity": 1, "associativity": "left"},
    'atanh': {"op": atanh, "precedence": 3, "arity": 1, "associativity": "left"},
    'cos': {"op": cos, "precedence": 3, "arity": 1, "associativity": "left"},
    'cosh': {"op": cosh, "precedence": 3, "arity": 1, "associativity": "left"},
    'log': {"op": log, "precedence": 3, "arity": 1, "associativity": "right"},
    'ln': {"op": ln, "precedence": 3, "arity": 1, "associativity": "right"},
    'sin': {"op": sin, "precedence": 3, "arity": 1, "associativity": "left"},
    'sinh': {"op": sinh, "precedence": 3, "arity": 1, "associativity": "left"},
    'tan': {"op": tan, "precedence": 3, "arity": 1, "associativity": "left"},
    'tanh': {"op": tanh, "precedence": 3, "arity": 1, "associativity": "left"},
    '÷': {"op": divide, "precedence": 2, "arity": 2, "associativity": "left"},
    '×': {"op": multiply, "precedence": 2, "arity": 2, "associativity": "left"},
    '+': {"op": add, "precedence": 1, "arity": 2, "associativity": "left"},
    '−': {"op": subtract, "precedence": 1, "arity": 2, "associativity": "left"}
  };
  var postfix = '';

// Constants
  var PI = new decimal('3.14159265358979323846264338327950288419716939937510');
// Operations
  // Arithmetic
  function add(x, y) {
    return x.plus(y);
  }

  function divide(x, y) {
    return x.div(y);
  }

  function exponential(x) {
    return (x || new decimal(1)).exp();
  }

  function exponent(x, y) {
    return (x || new decimal(1)).times(decimal.pow(10, y));
  }

  function log(x) {
    return x.log();
  }

  function ln(x) {
    return x.ln();
  }

  function multiply(x, y) {
    return x.times(y);
  }

  function negative(x) {
    return x.neg();
  }

  function nthRoot(x, y) {
    return y.pow(new decimal(1).div(x));
  }
  function percent(x, y) {
    var perc = x.div(100);
    return y.times(perc);
  }

  function power(x, y) {
    return x.pow(y);
  }

  function sqrt(x) {
    return x.sqrt();
  }

  function subtract(x, y) {
    return x.minus(y);
  }
  // Trygonometry
  function sin(x) {
    return new decimal(String(Math.sin(x.toNumber())));
  }
  function asin(x) {
    return atan(x.div(x.pow(2).neg().plus(1).sqrt()));
  }
  function sinh(x) {
    return (E.pow(x).minus(E.pow(x.neg()))).div(2);
  }
  function asinh(x){
    return x.plus(x.pow(2).plus(1).sqrt()).ln();
  }
  function cos(x) {
    return sin(PI.div(2).plus(x));
  }
  function acos(x) {
    return atan((x.neg()).div(x.pow(2).neg().plus(1).sqrt())).plus(atan(new decimal(1)).times(2));
  }
  function cosh(x) {
    return (E.pow(x).plus(E.pow(x.neg()))).div(2);
  }
  function acosh(x){
    return x.plus(x.pow(2).minus(1).sqrt()).ln();
  }
  function tan(x) {
    return sin(x).div(cos(x));
  }
  function atan(x) {
    return new decimal(String(Math.atan(x.toNumber())));
  }
  function tanh(x) {
    return sinh(x).div(cosh(x));
  }
  function atanh(x){
    return x.plus(1).div(x.neg().plus(1)).ln().times(0.5);
  }

  function partialEvaluation(stack, outputStack) {
    var op = stack.pop();
    var arity = operators[op].arity;
    var operation = operators[op].op;
    var x, y;
    if (arity === 2) {
      y = outputStack.pop();
    }
    x = outputStack.pop();
    outputStack.push(operation(x, y));
    postfix += op + " ";
  }
  function evaluate(expression) {
    var outputStack = [], stack = [];
    var tokens = expression.length;
    for (var i = 0; i < tokens; i++) {
      var token = expression[i];
      var type = token.type;
      var value = token.value;
      if (type === 'operand') {
        postfix += value + " ";
        value = new decimal((value !== 'Ans')? value: ans);
        outputStack.push(value);
        continue;
      }
      if (type === 'operator') {
        var leftAssociative = operators[value].associativity === "left";
        while(stack.length && ("()".indexOf(stack[stack.length-1]) === -1) &&
          ((leftAssociative && ( operators[value].precedence <= operators[stack[stack.length-1]].precedence)) ||
          (!leftAssociative && ( operators[value].precedence < operators[stack[stack.length-1]].precedence)))
        ) {
          partialEvaluation(stack, outputStack);
        }
        stack.push(value);
        continue;
      }
      if (value === '(') {
        stack.push(value);
        continue;
      }
      if (value === ')') {
        while (stack.length && (stack[stack.length-1] != "(")) {
          partialEvaluation(stack, outputStack);
        }
        stack.pop();
      }
    }
    while (stack.length) {
      partialEvaluation(stack, outputStack);
    }
    return outputStack;
  }

  app.controller('CalcController', ['$scope', function($scope){
    ans = 0;
    $scope.expression = []; // Array with the elements of the expression
    $scope.previousButton = ''; // String with type of previous button pressed
    $scope.shiftOn = false;
    $scope.hypOn = false;
    $scope.clear = function() {
      $scope.expression = [];
      $scope.previousButton = '';
    };
    $scope.shift = function() {
      $scope.shiftOn = !$scope.shiftOn;
      $scope.inv = ($scope.shiftOn)? 'a': '';
      $scope.alt = ($scope.shiftOn)? altFunctions: null;
    };
    $scope.hyperbolic = function() {
      $scope.hypOn = !$scope.hypOn;
      $scope.hyp = ($scope.hypOn)? 'h': '';
    };
    $scope.addToExpression = function(event) {
      var element = event.target;
      var type = element.dataset.type;
      var value = element.value;
      var prev = $scope.previousButton;
      if (prev === 'operand' && type === prev) {  // in progress number
        if (value === 'Ans') {  // an implicit multiplication with Ans found
          $scope.expression.push({'type': 'operator', 'value': '·'},
                                 {'type': type, 'value': value});
        } else if (!((value === '.') && ($scope.expression[$scope.expression.length -1].value.indexOf(value) !== -1)))
        {  // No repeated dots, so add new operand to the in progress number
          $scope.expression[$scope.expression.length -1].value += value;
        }
      } else {  // Not an in progress number, add the element to expression
        $scope.expression.push({'type': type, 'value': value});
      }
      $scope.previousButton = type;
      console.log($scope.expression);
    };
    $scope.evalExpression = function() {
      ans = evaluate($scope.expression);
      $scope.clear();
      console.log("Result: " + ans.join(""));
      console.log("Postfix: " + postfix);
      postfix = '';
    };
  }]);
})();
