'use strict';

var shell = require('shelljs');
var fs = require('fs');
var chalk = require('chalk');
var utils = require('./utils');
var series = require('async-series');

var progress = new utils.Progress();

exports.init = function(options) {
  progress.start();

  series([
    checkPermissions,
    utils.checkNpmPermission,
    function(done) { cloneClever(options, done); },
    function(done) { installAndCompile(options, done); }
  ],function(err) {
    if (err){ throw err; }
    nextSteps(options.name);
  });

  progress.stop();

};

function checkPermissions(done){
  if (utils.isWin){
    console.log('On windows platform - Please check permissions independently');
    console.log('All permissions should be run with the local users permissions');
  }
  if (process.getuid) {
   var uid = process.getuid();
   if (  uid === 0){
     console.log(chalk.red('Installation of clever should not be done as root!'));
     throw('RUNNING AS ROOT');

   }
 }
  done();
}

function cloneClever(options, done) {

  // TODO - Possibly remove depdendency of git all together and download and optionally add a remote.
  if (!shell.which('git')) return console.log(chalk.red('Prerequisite not installed: git'));
  var name = options.name;
  var source = (options.git ? 'git@github.com:imperodesign/clever.git' : 'https://github.com/imperodesign/clever.git');

  // Allow specifying specific repo
  if (options.repo) {
    source = options.repo;
  }

  // If full clone is specified do a normal clone - default is a shallow --depth 1 clone"
  var shallow = (options.full ? '' : ' --depth 1 ');

  // Install the specified branch or the stableTag - No more MASTER!
  //var branch = options.branch ? options.branch : stableTag;
  var branch = options.branch;
  source = branch + ' ' + source + ' "' + name + '"';
  var gitCmd = 'git clone ' + shallow + ' -b' + source;
  console.log(chalk.green('Cloning branch: %s into destination folder:'), options.branch, name);
  console.log(chalk.green(gitCmd));

  // Running clone
  shell.exec(gitCmd , function(status, output) {
    if (status) {
      throw output;
    }
    console.log();
    done();
  });
}

function installAndCompile(options, done) {

  var BASE_PATH = process.cwd() + '/';
  var npmCmd = 'npm install';
  var bowerCmd = 'bower install';
  var gulpCmd = 'gulp';

  series([
    function rootNpm(cb) {
      console.log(chalk.green('Installing basic npm packages');

      // Running clone
      shell.exec('cd ' + BASE_PATH + options.name + '/app/packages/system && ' + npmCmd , function(status, output) {
        if (status) {
          throw output;
        }
        console.log();
        cb();
      });
    },

    function systemNpm(cb) {
      console.log(chalk.green('Installing system npm packages');

      // Running npm install
      shell.exec('cd ' + BASE_PATH + options.name + '/app/packages/system && ' + npmCmd , function(status, output) {
        if (status) {
          throw output;
        }
        console.log();
        cb();
      });
    },

    function systemBower(cb) {
      console.log(chalk.green('Installing system bower dependencies');

      // Running bower install
      shell.exec('cd ' + BASE_PATH + options.name + '/app/packages/system && ' + bowerCmd , function(status, output) {
        if (status) {
          throw output;
        }
        console.log();
        cb();
      });
    },

    function systemGulp(cb) {
      console.log(chalk.green('Compiling system');

      // Running gulp default
      shell.exec('cd ' + BASE_PATH + options.name + '/app/packages/system && ' + gulpCmd , function(status, output) {
        if (status) {
          throw output;
        }
        console.log();
        cb();
      });
    },

    function usersNpm(cb) {
      console.log(chalk.green('Installing users npm packages');

      // Running npm install
      shell.exec('cd ' + BASE_PATH + options.name + '/app/packages/users && ' + npmCmd , function(status, output) {
        if (status) {
          throw output;
        }
        console.log();
        cb();
      });
    },

    function usersBower(cb) {
      console.log(chalk.green('Installing users bower dependencies');

      // Running bower install
      shell.exec('cd ' + BASE_PATH + options.name + '/app/packages/users && ' + bowerCmd , function(status, output) {
        if (status) {
          throw output;
        }
        console.log();
        cb();
      });
    },

    function usersGulp(cb) {
      console.log(chalk.green('Compiling users');

      // Running gulp default
      shell.exec('cd ' + BASE_PATH + options.name + '/app/packages/users && ' + gulpCmd , function(status, output) {
        if (status) {
          throw output;
        }
        console.log();
        cb();
      });
    }] , function(err) {
      if (err){ done(err); }
      done(null);
    })

}

function nextSteps(name) {
  // show the next steps after the person has seen the start/help text so sleep 1 second.
  setTimeout(function(){
    console.log('  Run the app by running:');
    console.log('    $ ' + chalk.green('cd %s/app and then run..'), name);
    console.log('    $ '+ chalk.green('iojs --harmony server.js'));
    console.log();
  },1000);
}
