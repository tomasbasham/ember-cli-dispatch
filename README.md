# ember-cli-dispatch [![Build Status](https://travis-ci.org/tomasbasham/ember-cli-dispatch.svg?branch=master)](https://travis-ci.org/tomasbasham/ember-cli-dispatch)

An [Ember CLI](https://ember-cli.com/) addon to extend computed properties with
asynchronous values.

Computed properties are really handy for taking one or more static properties,
or in fact other computed properties, and transforming their values. However it
is often the case that a value is not immediately present and may need to be
fetch asynchronously. This prevents us from using computed properties because
we cannot return a future value. To accomplish this currently we could return a
promise from a computed property and create, potentially, a long chain of
`then`'s and `catch`'s to then finally compute the value. This is very
cumbersome and will not lend itself well if required within template logic.

This addon implements a computed property macro that works internally with
promises. Each computed property can be assigned a default value that will be
used until the promise resolves and the computed property's value is updated.

## Installation

From within your Ember CLI project directory run:
```
ember install ember-cli-dispatch
```

## Usage

This addon implements a utility function wrapping a promise object, which once
resolved will set the value of a computed property to that returned by the
promise.

### Computed Promise

In order to create an asynchronous computed property you must import the
`computedPromise` macro included in this addon. The macro accepts a property
function, that may return a promise, and optionally a default value that will
be used until the internal promise resolves.

##### Computed Promise Example

```JavaScript
// app/controllers/application.js
import Controller from '@ember/controller';
import $ from 'jquery';

import computedPromise from 'ember-cli-dispatch/utils/computed-promise';

export default Controller.extend({
  serverResponse: computedPromise(function() {
    return $.getJSON('https://www.example.com/response.json')
  }, 'fetching...')
});
```

This will create a computed property named `serverResponse` that will take on
the value `fetching...` until the result of the promise returned from jQuery's
`getJson` method is resolved. Once resolved the computed property will equal
the value returned by the promise.

### Bundled Macros

In addition to the `computedPromise` macro this addon includes a couple of
utility macros that make use of wrapping computationally expensive operations
within promises. The first of these utility macros is `map` which transforms
every value within an array; and the second is `reduce` which applies a
function against an accumulator for each value of an array (from left-to-right)
to reduce it to a single value.

##### Computed Map Example

```JavaScript
// app/controllers/application.js
import Controller from '@ember/controller';
import computedMap from 'ember-cli-dispatch/utils/computed-map';

export default Controller.extend({
  scores: [1, 2, 3, 4, 5],

  doubleScores: computedMap('scores', function(score) {
    return score * 2;
  }, 'computing...')
});
```

This is a contrived example to create a computed property that doubles each of
the values within the `scores` array.

##### Computed Reduce Example

```JavaScript
// app/controllers/application.js
import Controller from '@ember/controller';
import computedReduce from 'ember-cli-dispatch/utils/computed-reduce';

export default Controller.extend({
  scores: [1, 2, 3, 4, 5],

  totalScores: computedReduce('scores', function(cumulativeTotal, score) {
    return cumulativeTotal + score;
  }, 'computing...')
});
```

This is a contrived example to create a computed property that totals up the
values within the `scores` array.

### Custom Macro

It is also possible to create your own asynchronous computed property macros.
To do this you need to import the `computedPromise` macro.

##### Custom Macro Example

```JavaScript
// app/utils/computed-macro.js
import computedPromise from 'ember-cli-dispatch/utils/computed-promise';
import { get } from '@ember/object';

export default function computedMacro(propertyName, defaultValue) {
  return computedPromise(`${propertyName}.[]`, function() {
    return get(this, propertyName);
  }, defaultValue);
};
```

This shows a very basic implementation of a computed property macro that passes
back the value of the specified property. This of course can be extended to
perform whatever operation is required by your applications.

## Development

### Installation

* `git clone <repository-url>` this repository
* `cd ember-cli-dispatch`
* `npm install`

### Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember
  versions)
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit
[https://ember-cli.com/](https://ember-cli.com/).
