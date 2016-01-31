import Ember from 'ember';

const {
  computed,
  get,
  set
} = Ember;

/*
 * Utility method, returning an ember computed
 * property that wraps up a promise object. The
 * computed property will take on a default
 * value, if supplied, until the promise is
 * resolved at which point the computed property
 * will be set to the returned data.
 *
 * @method computedPromise
 *
 * @param {Rest} args
 *   Dependent properties, function and default value.
 *
 * @return {Ember.computed}
 *   An Ember computed property.
 */
export default function computedPromise(...args) {
  let defaultValue = args.pop();
  let propertyFunction = null;

  // Grab the function and default value from the arguments.
  if (typeof defaultValue !== 'function') {
    propertyFunction = args.pop();
  } else {
    propertyFunction = defaultValue;
    defaultValue = null;
  }

  if (typeof propertyFunction !== 'function') {
    throw new Ember.Error('Computed Promise declared without a property function');
  }

  // The computed promise function.
  const computedPromiseWrapper = function(propertyName, value) {
    if (typeof value !== 'undefined') {
      return value;
    }

    // Convenience function to set the value of the property.
    const setProperty = (propertyName, value) => {
      if (value && get(this, propertyName) !== value) {
        set(this, propertyName, value);
      }
    };

    // Resolve a promise and catch any errors.
    const promise = new Ember.RSVP.Promise((resolve) => {
      resolve(propertyFunction.apply(this));
    }).then(function(data) {
      setProperty(propertyName, data);
      return data;
    }).catch(function(errors) {
      setProperty(propertyName, errors);
      return errors;
    });

    set(this, `${propertyName}Promise`, promise);
    return defaultValue;
  };

  args.push(computedPromiseWrapper);
  return computed.apply(this, args);
}
