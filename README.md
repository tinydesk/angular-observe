![](https://badge-size.herokuapp.com/tinydesk/angular-observe/master/angular-observe.js.svg?compression=gzip)

# angular-observe

Observe properties on arbitrary javascript objects, similar to the $watch mechanism but more efficient.

## Getting Started

Install bower dependency:
```
bower install angular-observe --save
```

Add angular dependency:
```javascript
angular.module('app', ['tinydesk.observe']);
```

Inject where needed:
```javascript
.factory('MyService', ['Observe', function(Observe) { ... }]);
```

Watch properties on objects:
```javascript
var obj = {
  x: 2,
  y: 'name',
  z: {
    a: 1,
    b: 2
  }
};

// watch a single property
Observe.property(obj, 'x', function(newValue, oldValue) {
  console.log(newValue, oldValue);
});

obj.x = 3; // triggers callback
obj = {...} // does not trigger callback

// watch nested properties
Observe.properties(obj, 'z.a', function() {
  // does not support parameters at the moment
  console.log(obj.z.a);
});

obj.z.a = 3; // triggers callback
obj.z = { ... }; // triggers callback

// watch multiple (nested) properties
Observe.properties(obj, ['z.a', 'x'], function() {
  console.log(obj.z.a + obj.x);
});

obj.z.a = 3; // triggers callback
obj.z = {...}; // triggers callback
obj.x = 2; // triggers callback

```

## Motivation

AngularJS is a great framework for creating interactive client-side web applications. However, when screens get very complex, the number of watchers increases and performance degrades. This is especially true, when expressions are complicated and cannot be represented by a watch on a property but rather need to be evaluated on every tick. A common scenario where this might be encountered is hierarchical data. One has to choose between the two suboptimal options of either deeply watching the whole data structure, or executing functions on every digest, including the regular tick.

This library provides a solution to this problem while keeping a syntactic similarity to the watch paradigm. It has two major advantages, compared to `$watch`:

- It does not need a `$scope` object to work. This means it can be used inside model objects to aggregate complex data whenever critical properties change. The aggregated data can then be accessed by angular via the normal watch mechanism.
- It uses `Object.defineProperty` which is a native java script feature. The overhead introduced by watching a property is equal to the overhead introduced by using a setter on the property.
