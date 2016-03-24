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
