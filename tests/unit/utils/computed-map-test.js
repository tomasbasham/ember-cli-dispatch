import EmberObject from '@ember/object';

import computedMap from 'dummy/utils/computed-map';

import { A } from '@ember/array';
import { get } from '@ember/object';
import { module, test } from 'qunit';
import { Promise } from 'rsvp';

module('Unit | Utility | computed map');

test('it returns a default value', function(assert) {
  let subject = EmberObject.extend({
    dataProperty: A([1, 2, 3, 4, 5]),
    myProperty: computedMap('dataProperty', function() {
      return new Promise();
    }, 'default')
  }).create();

  assert.equal(get(subject, 'myProperty'), 'default');
});

test('it returns a mapped value', function(assert) {
  let subject = EmberObject.extend({
    dataProperty: A([1, 2, 3, 4, 5]),
    myProperty: computedMap('dataProperty', function(value) {
      return value * 2;
    }, 'default')
  }).create();

  const done = assert.async();

  get(subject, 'myProperty'); // Fire the computed property.
  get(subject, 'myPropertyPromise').then(function(value) {
    assert.deepEqual(value, [2, 4, 6, 8, 10]);
    done();
  });
});
