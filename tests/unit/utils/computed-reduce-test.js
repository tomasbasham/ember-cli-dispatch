import EmberObject from '@ember/object';

import computedReduce from 'dummy/utils/computed-reduce';

import { A } from '@ember/array';
import { get } from '@ember/object';
import { module, test } from 'qunit';
import { Promise } from 'rsvp';

module('Unit | Utility | computed reduce', function() {
  test('it returns a default value', function(assert) {
    let subject = EmberObject.extend({
      dataProperty: A([1, 2, 3, 4, 5]),
      myProperty: computedReduce('dataProperty', function() {
        return new Promise();
      }, 'default')
    }).create();

    assert.equal(get(subject, 'myProperty'), 'default');
  });

  test('it returns a reduced value', function(assert) {
    let subject = EmberObject.extend({
      dataProperty: A([1, 2, 3, 4, 5]),
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
});
