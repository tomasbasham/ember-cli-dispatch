import Ember from 'ember';
import computedReduce from '../../../utils/computed-reduce';
import { module, test } from 'qunit';

const {
  get
} = Ember;

module('Unit | Utility | computed reduce');

test('it returns a default value', function(assert) {
  let subject = Ember.Object.extend({
    dataProperty: Ember.A([1, 2, 3, 4, 5]),
    myProperty: computedReduce('dataProperty', function() {
      return new Ember.RSVP.Promise();
    }, 'default')
  }).create();

  assert.equal(get(subject, 'myProperty'), 'default');
});

test('it returns a reduced value', function(assert) {
  let subject = Ember.Object.extend({
    dataProperty: Ember.A([1, 2, 3, 4, 5]),
    myProperty: computedReduce('dataProperty', function(cumulativeValue, value) {
      return cumulativeValue + value;
    }, 'default')
  }).create();

  const done = assert.async();

  get(subject, 'myProperty'); // Fire the computed property.
  get(subject, 'myPropertyPromise').then(function(value) {
    assert.equal(value, 15);
    done();
  });
});
