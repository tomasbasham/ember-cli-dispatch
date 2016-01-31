import Ember from 'ember';
import computedPromise from 'ember-cli-dispatch/utils/computed-promise';

const {
  get
} = Ember;

/*
 * Utility method, returning an ember computed
 * property that wraps up a reduce operation in
 * a promise object. The computed property will
 * take on a default value, if supplied, until
 * the promise is resolved at which point the
 * computed property will be set to the returned
 * data.
 *
 * @method computedMap
 *
 * @param {String} propertyName
 *   The name of an array property to be reduced.
 *
 * @param {Function} propertyFunction
 *   A function used to reduce the array.
 *
 * @param {String} defaultValue
 *   The default value of the computed property.
 *
 * @return {Ember.computed}
 *   An Ember computed property.
 */
export default function computedReduce(propertyName, propertyFunction, defaultValue) {
  return computedPromise(`${propertyName}.[]`, function() {
    const property = get(this, propertyName);
    return property.reduce(propertyFunction);
  }, defaultValue);
}
