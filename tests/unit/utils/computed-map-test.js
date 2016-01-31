import Ember from 'ember';
import computedMap from '../../../utils/computed-map';
import { module, test } from 'qunit';

const {
  get
} = Ember;

module('Unit | Utility | computed map');

test('it returns a default value', function(assert) {
  let subject = Ember.Object.extend({
    dataProperty: Ember.A([1, 2, 3, 4, 5]),
    myProperty: computedMap('dataProperty', function() {
      return new Ember.RSVP.Promise();
    }, 'default')
  }).create();

  assert.equal(get(subject, 'myProperty'), 'default');
});

test('it returns a mapped value', function(assert) {
  let subject = Ember.Object.extend({
    dataProperty: Ember.A([1, 2, 3, 4, 5]),
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
