(function(){
  var angular = require('angular');
  var decimal = require('decimal.js');

  var app = angular.module('js-calc', []);
  // Set the default precision to 50 significant digits. Max. fixed to 500
  decimal.config({ precision: 50 });

  var ans;
  var altFunctions = {
    'ln': {'value': 'e', 'label': 'e˟'},
    '×': {'value': '%', 'label': '%'},
    '^': {'value': '˟√', 'label': '˟√'},
  };
  var operators = {
    'acos': {"op": acos, "precedence": 6, "arity": 1, "associativity": "left"},
    'acosh': {"op": acosh, "precedence": 6, "arity": 1, "associativity": "left"},
    'asin': {"op": asin, "precedence": 6, "arity": 1, "associativity": "left"},
    'asinh': {"op": asinh, "precedence": 6, "arity": 1, "associativity": "left"},
    'atan': {"op": atan, "precedence": 6, "arity": 1, "associativity": "left"},
    'atanh': {"op": atanh, "precedence": 6, "arity": 1, "associativity": "left"},
    'cos': {"op": cos, "precedence": 6, "arity": 1, "associativity": "left"},
    'cosh': {"op": cosh, "precedence": 6, "arity": 1, "associativity": "left"},
    'log': {"op": log, "precedence": 6, "arity": 1, "associativity": "right"},
    'ln': {"op": ln, "precedence": 6, "arity": 1, "associativity": "right"},
    'sin': {"op": sin, "precedence": 6, "arity": 1, "associativity": "left"},
    'sinh': {"op": sinh, "precedence": 6, "arity": 1, "associativity": "left"},
    'tan': {"op": tan, "precedence": 6, "arity": 1, "associativity": "left"},
    'tanh': {"op": tanh, "precedence": 6, "arity": 1, "associativity": "left"},
    '-': {"op": negative, "precedence": 5, "arity": 1, "associativity": "right"},
    // implied multiplication
    '·': {"op": multiply, "precedence": 4, "arity": 2, "associativity": "left"},
    'E': {"op": exponent, "precedence": 4, "arity": 2, "associativity": "left"},
    'e': {"op": exponential, "precedence": 4, "arity": 1, "associativity": "right"},
    '%': {"op": percent, "precedence": 4, "arity": 2, "associativity": "right"},
    '^': {"op": power, "precedence": 3, "arity": 2, "associativity": "left"},
    '√': {"op": sqrt, "precedence": 3, "arity": 1, "associativity": "right"},
    '˟√': {"op": nthRoot, "precedence": 3, "arity": 2, "associativity": "right"},
    '÷': {"op": divide, "precedence": 2, "arity": 2, "associativity": "left"},
    '×': {"op": multiply, "precedence": 2, "arity": 2, "associativity": "left"},
    '+': {"op": add, "precedence": 1, "arity": 2, "associativity": "left"},
    '−': {"op": subtract, "precedence": 1, "arity": 2, "associativity": "left"}
  };
  var postfix = '';
  var result = document.getElementById("result");
  var parentizedFunctions = 'asinhacoshatanhlogln';

  // Regular expression for first test of expression entered
  var arity1 = '([(]*((((a?(sin|cos|tan)h?)|log|ln)[(])|√|-|e))';
  var operand = '([(]*(((\\d+\\.?\\d*)(Ans|π)*)|(Ans|π)+)(E\\d+)?[)]*)';
  var arity2 = '(%|\\^|˟√|÷|×|\\+|−)';
  var expChecker = new RegExp("^(" + arity1 + "*" + operand +
                      "(" + arity2 + arity1 + "*" + operand + ")*)$");

// Constants
  var E = exponential();
  // first 500 digits of PI
  var PI = new decimal('3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491');

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
    return x.times(decimal.pow(10, y));
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
  // Trigonometry
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
        switch (value) {
          case "Ans":
            value = new decimal(ans);
            break;
          case "π":
            value = PI;
            break;
          default:
            value = new decimal(value);
        }
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
    var output = outputStack.join("");

    function specialCases(match, string) {
      return (match === "NaN")? "Math ERROR": match;
    }

    output = output.replace(/Infinity|NaN/, specialCases);
    return output;
  }

  app.controller('CalcController', ['$scope', function($scope){
    ans = "";
    $scope.expression = []; // Array with the elements of the expression
    $scope.previousButton = ''; // String with type of previous button pressed
    $scope.displayExpression = '';
    $scope.displayResult = '0';
    $scope.hideCursor = false;
    $scope.shiftOn = false;
    $scope.hypOn = false;
    $scope.precision = 50;

    $scope.clear = function(event) {
      if (event) {
        if ($scope.hideCursor) {
          $scope.hideCursor = false;
        }
        $scope.displayExpression = '';
        $scope.displayResult = '0';
        if ($scope.error) {
          $scope.error = false;
          ans = "";
        }
      }
      $scope.expression = [];
      $scope.previousButton = 'equal';
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
    $scope.changeConfiguration = function() {
      decimal.config({ precision: $scope.precision });
      $scope.showConfiguration(false);
    };
    $scope.showConfiguration = function(show) {
      var modalContainer = document.getElementById("modal-container");
      var overlay = document.getElementById("overlay");
      angular.element(modalContainer).css('visibility', (show)? 'visible': 'hidden');
      angular.element(overlay).css('visibility', (show)? 'visible': 'hidden');
    };
    $scope.addToExpression = function(event) {
      var element = event.target;
      var type = element.dataset.type;
      var value = element.value;
      var prev = $scope.previousButton;
      var noRepeatedDot = !((value === '.') && $scope.expression.length &&
      ($scope.expression[$scope.expression.length -1].value.indexOf(value) !==
      -1));
      if ($scope.hideCursor) {
        $scope.hideCursor = false;
      }
      if (prev === 'operand' && type === prev) {  // in progress number
        if (value === 'Ans') {  // an implicit multiplication with Ans found
          $scope.expression.push({'type': 'operator', 'value': '·'},
                                 {'type': type, 'value': value});
        } else if (noRepeatedDot) {
          // No repeated dot, so add new operand to the in-progress number
          $scope.expression[$scope.expression.length -1].value += value;
        }
      } else {  // Not an in progress number
        if (prev === "equal" || !prev) {
          if (type === "operator" && operators[value].arity === 2) {
            $scope.expression.push({'type': "operand", 'value': "Ans"});
            $scope.displayExpression = "Ans";
          } else {
            $scope.displayExpression = "";
          }
        }
        $scope.expression.push({'type': type, 'value': value});
        if (parentizedFunctions.indexOf(value) !== -1) {
          $scope.expression.push({'type': "parenthesis", 'value': "("});
          value += "(";
        }
      }
      $scope.previousButton = type;
      if (noRepeatedDot) {
        $scope.displayExpression += value;
      }
      console.log($scope.expression);
    };
    $scope.deleteLastToken = function() {
      if ($scope.expression.length) {
        console.log($scope.expression);
        var token = $scope.expression.pop();
        var value = token.value;
        var isANumber = (token.type === "operand") && (value !== "Ans");
        if (isANumber && (value.length > 1)) {
          token = {type: "operand", value: value.slice(0, value.length - 1)};
          $scope.expression.push(token);
          $scope.displayExpression = $scope.displayExpression.slice(0, $scope.displayExpression.length - 1);
        } else {
          $scope.displayExpression = $scope.displayExpression.slice(0, $scope.displayExpression.lastIndexOf(value));
          if (value === "(" && $scope.expression.length &&
              parentizedFunctions.indexOf[$scope.expression[$scope.expression.length - 1].value] !== -1) {
            var parentizedFunction = $scope.expression.pop();
            $scope.displayExpression = $scope.displayExpression.slice(0, $scope.displayExpression.lastIndexOf(parentizedFunction.value));
          }
        }
        $scope.previousButton = ($scope.expression.length)? $scope.expression[$scope.expression.length - 1].type: "";
      }
    };
    $scope.evalExpression = function() {
      $scope.hideCursor = true;
      if (!$scope.expression.length) {
        return;
      }
      if (expChecker.test($scope.displayExpression)) {
        console.log("test passed");
        try {
          ans = evaluate($scope.expression);
          console.log($scope.expression);
        } catch(err) {
          console.log(err);
          ans = "Syntax ERROR";
        }
      } else {
        ans = "Syntax ERROR";
      }

      if ((ans === "Math ERROR") || (ans === "Syntax ERROR")) {
        $scope.displayExpression = ans;
        ans = "";
        $scope.error = true;
      }
      $scope.displayResult = ans;
      $scope.clear();
      console.log("Postfix: " + postfix);
      postfix = '';
    };
  }]);
})();
