'use strict';

var ember = require('../helpers/ember');
var assert = require('assert');
var walkSync = require('../../lib/utilities/walk-sync').walkSync;
var path = require('path');
var tmp = require('../helpers/tmp');
var root = process.cwd();
var util = require('util');

describe('Acceptance: ember init', function(){
  beforeEach(function(){
    tmp.setup('./tmp');
    process.chdir('./tmp');
  });

  afterEach(function(){
    tmp.teardown('./tmp');
  });

  function confirmBlueprinted() {
    var blueprintPath = path.join(root, 'blueprint');

    function installables(path) {
      return !/node_modules|vendor|tmp/.test(path);
    }

    var expected = walkSync(blueprintPath).sort().filter(installables);
    var actual = walkSync('.').sort().filter(installables);

    assert.deepEqual(expected, actual, '\n expected: ' +  util.inspect(expected) +
                     '\n but got: ' +  util.inspect(actual));
  }

  it('ember init,', function() {
    return ember([
      'init',
      '--skip-npm-install'
    ]).then(confirmBlueprinted);
  });

  it('init an already init\'d folder', function() {
    this.timeout(1200000);
    return ember([
      'init',
      '--skip-npm-install'
    ]).then(function() {
      return ember([
        'init',
        '--skip-npm-install'
      ]).then(confirmBlueprinted);
    });
  });
});