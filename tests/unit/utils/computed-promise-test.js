import EmberError from '@ember/error';
import EmberObject from '@ember/object';

import computedPromise from 'dummy/utils/computed-promise';

import { get } from '@ember/object';
import { module, test } from 'qunit';
import { Promise } from 'rsvp';

module('Unit | Utility | computed promise');

test('it throws an exception if a function is not present', function(assert) {
  assert.throws(computedPromise, EmberError, 'Computed Promise declared without a property function');
});

test('it returns a default value', function(assert) {
  let object = EmberObject.extend({
    myProperty: computedPromise(function() {
      return new Promise();
    }, 'default')
  }).create();

  assert.equal(get(object, 'myProperty'), 'default');
});
