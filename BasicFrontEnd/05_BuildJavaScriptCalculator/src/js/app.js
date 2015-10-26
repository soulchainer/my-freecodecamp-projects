(function(){
  var angular = require('angular');
  var decimal = require('decimal.js');

  var app = angular.module('js-calc', []);

  var ans;
  var operators = {
    '-': {"op": negative, "precedence": 6, "arity": 1, "associativity": "right"},
    'E': {"op": exponent, "precedence": 5, "arity": 2, "associativity": "left"},
    '%': {"op": percent, "precedence": 5, "arity": 2, "associativity": "right"},
    '^': {"op": power, "precedence": 4, "arity": 2, "associativity": "left"},
    '√': {"op": sqrt, "precedence": 4, "arity": 1, "associativity": "right"},
    // implied multiplication
    '·': {"op": multiply, "precedence": 3, "arity": 2, "associativity": "left"},
    '÷': {"op": divide, "precedence": 2, "arity": 2, "associativity": "left"},
    '×': {"op": multiply, "precedence": 2, "arity": 2, "associativity": "left"},
    '+': {"op": add, "precedence": 1, "arity": 2, "associativity": "left"},
    '−': {"op": subtract, "precedence": 1, "arity": 2, "associativity": "left"}
  };
  var postfix = '';

  function add(x, y) {
    return x.plus(y);
  }

  function divide(x, y) {
    return x.dividedBy(y);
  }

  function exponent(x, y) {
    return x.times(decimal.pow(10, y));
  }

  function multiply(x, y) {
    return x.times(y);
  }

  function negative(x) {
    return x.neg();
  }

  function percent(x, y) {
    var perc = x.dividedBy(100);
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

  function partialEvaluation(stack, outputStack) {
    var op = stack.pop();
    var arity = operators[op].arity;
    var operation = operators[op].op;
    var x, y;
    if (arity === 2) {
      y = outputStack.pop();
      x = outputStack.pop();
    } else {
      x = outputStack.pop();
    }
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
    $scope.clear = function() {
      $scope.expression = [];
      $scope.previousButton = '';
    };
    $scope.addToExpression = function(event) {
      var element = event.target;
      var type = element.dataset.type;
      var value = element.value;
      var prev = $scope.previousButton;
      if (prev === 'operand' && type === prev) {
        if (value === 'Ans') {
          $scope.expression.push({'type': 'operator', 'value': '·'},
                                 {'type': type, 'value': value});
        } else if (!((value === '.') && ($scope.expression[$scope.expression.length -1].value.indexOf(value) !== -1)))
        {
          $scope.expression[$scope.expression.length -1].value += value;
        }
      } else {
        $scope.expression.push({'type': type, 'value': value});
      }
      $scope.previousButton = type;
      console.log($scope.expression);
    };
    $scope.evalExpression = function() {
      ans = evaluate($scope.expression);
      $scope.clear();
      console.log("Expression: " + ans.join(""));
      // console.log(ans.toString());
      console.log("Postfix: " + postfix);
      postfix = '';
    };
  }]);
})();
