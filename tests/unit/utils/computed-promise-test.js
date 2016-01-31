import Ember from 'ember';
import computedPromise from '../../../utils/computed-promise';
import { module, test } from 'qunit';

const {
  get
} = Ember;

module('Unit | Utility | computed promise');

test('it throws an exception if a function is not present', function(assert) {
  assert.throws(computedPromise, Ember.Error, 'Computed Promise declared without a property function');
});

test('it returns a default value', function(assert) {
  let object = Ember.Object.extend({
    myProperty: computedPromise(function() {
      return new Ember.RSVP.Promise();
    }, 'default')
  }).create();

  assert.equal(get(object, 'myProperty'), 'default');
});
