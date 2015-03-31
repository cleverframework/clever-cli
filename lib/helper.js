'use strict';

var inquirer = require('inquirer'),
  _ = require('lodash');

// callback must be in form of function(results)
module.exports = function(options, callback) {

  function required(value) {
    return !!value.trim() || 'Required';
  }

  var questions = [{
    type: 'input',
    name: 'name',
    message: 'What would you name your clever app?',
    default: options.name,
    validate: required
  }];

  inquirer.prompt(questions, function(results) {
    _.assign(options, results);
    callback(options);
  });
};
