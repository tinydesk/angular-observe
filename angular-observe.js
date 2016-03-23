/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
	module.exports = 'tinydesk.observe';
}

(function (window, angular) {
	/*jshint globalstrict:true*/
	/*global angular:false*/
	'use strict';

	/**
	 * @ngdoc overview
	 * @name tinydesk.observe
	 *
	 * @description
	 *
	 * 
	 */
	var mod = angular.module('tinydesk.observe', []);

	/**
	 * @ngdoc service
	 * @name tinydesk.observe.service:Observe
	 *
	 * @description
	 *
	 * A service that allows to watch changes on arbitrary javascript objects similar to the $watch mechanism. It uses
	 * `Object.defineProperty` in the background and as a result does not put more burden on angulars $digest cycles which can
	 * help in applications that have a lot of watchers.
	 *
	 */
	mod.service('Observe', [function() {

		var self = this;

		/**
		 * @ngdoc function
		 * @name property
		 * @methodOf tinydesk.observe.service:Observe
		 *
		 * @description
		 *
		 * Watches a single property on the target object and call the callback if the value changes. This method behaves very
		 * similar to the standard angular $watch. In particular, it is only triggered, if the property value is replaced with a
		 * new reference or primitive value.
		 *
		 * @param {object} target An arbitrary javascript object.
		 * @param {string} prop The name of the property that should be observed. Note that nested property references are not
		 * supported with this method.
		 * @param {function} cb A callback method that is invoked, when the property changes. It is provided with the new and the
		 * old value.
		 */
		self.property = function(target, prop, cb) {
			var value = target[prop];
			Object.defineProperty(target, prop, {
				get: function() {
					return value;
				},
				set: function(v) {
					var oldValue = value;
					value = v;
					cb(value, oldValue);
				}
			});
		};

		/**
		 * @ngdoc function
		 * @name properties
		 * @methodOf tinydesk.observe.service:Observe
		 *
		 * @description
		 *
		 * Watches multiple, possibly nested, properties.
		 *
		 * @param {object} target An arbitrary javascript object.
		 * @param {Array} prop An array of property names. If a property name includes one or more dot characters this is interpreted
		 * as a nested path.
		 * @param {function} cb A callback method that is invoked, when the property changes. Note that it is not provided with a
		 * parameter at this point.
		 */
		self.properties = function(obj, prop, cb) {
			if (!_.isArray(prop)) {
				// normalize:
				prop = [ prop ];
			}

			if (prop.length === 0) {
				return;
			}

			var paths = _.map(prop, function(p) {
				return (!_.isArray(p)) ? p.split('.') : p;
			});
			var groupedPaths = _.mapValues(
				_.groupBy(paths, '[0]'),
				function(paths) {
					return _.map(paths, function(path) {
						return _.drop(path, 1);
					});
				}
			);

			_.forIn(groupedPaths, function(paths, prop) {
				var nonEmptyPaths = _.filter(paths, function(p) { return p.length > 0; });
				self.property(obj, prop, function(newValue, oldValue) {
					cb();
					self.properties(newValue, nonEmptyPaths, cb);
				});

				if (obj[prop] !== undefined) {
					self.properties(obj[prop], nonEmptyPaths, cb);
				}
			});
		};

	}]);

})(window, window.angular);
