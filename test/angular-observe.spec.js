describe('Observe', function() {

	beforeEach(function()
	{
		module('tinydesk.observe');
	});

	var Observe;
	beforeEach(inject(['Observe', function(_Observe_)
	{
		Observe = _Observe_;
	}]));

	describe('property', function() {

		it('does not modify an existing value', function() {
			var x = { a: 3 };
			Observe.property(x, 'a', function() {});
			expect(x.a).toEqual(3);
		});

		it('triggers the callback when the value changes', function() {
			var x = { a: 3 };
			var cb = jasmine.createSpy('callback');
			Observe.property(x, 'a', cb);
			x.a = 4;
			expect(cb).toHaveBeenCalledWith(4, 3);
		});

		it('does not trigger the callback when the value does not change', function() {
			var x = { a: 3 };
			var cb = jasmine.createSpy('callback');
			Observe.property(x, 'a', cb);
			expect(cb).not.toHaveBeenCalled();
		});

		it('does not trigger the callback when the value does change but the reference stays the same', function() {
			var x = { a: { y: 3 } };
			var cb = jasmine.createSpy('callback');
			Observe.property(x, 'a', cb);
			x.a.y = 2;
			expect(cb).not.toHaveBeenCalled();
		});

	});

	describe('properties', function() {

		it('does not modify an existing value', function() {
			var x = { a: { b: 3, c: 'x', d: false } };
			Observe.properties(x, [ 'a.b', 'a.c' ], function() {});
			expect(x.a.b).toEqual(3);
			expect(x.a.c).toEqual('x');
			expect(x.a.d).toEqual(false);
		});

		it('triggers the callback when the value changes one level deeper', function() {
			var x = { a: { b: 3, c: 'x', d: false } };
			var cb = jasmine.createSpy('callback');
			Observe.properties(x, [ 'a.b', 'a.c' ], cb);
			x.a.b = 4;
			x.a.c = 'y';
			x.a.d = true;
			x.a = {
				b: 3,
				c: 'x',
				d: false
			};
			x.a.b = 4;
			x.a.c = 'y';
			x.a.d = true;
			expect(cb).toHaveBeenCalledTimes(5);
		});

		it('triggers the callback when the value changes two levels deeper', function() {
			var x = { a: { b: 3, c: { e: 9, f: 'x' }, d: false } };
			var cb = jasmine.createSpy('callback');
			Observe.properties(x, [ 'a.b', 'a.c.e' ], cb);
			x.a.b = 4;
			x.a.c.e = 10;
			x.a.c.f = 'y';
			x.a.d = true;
			x.a = {
				b: 3,
				c: { e: 9, f: 'x' },
				d: false
			};
			x.a.b = 4;
			x.a.c.e = 10;
			x.a.c.f = 'y';
			x.a.d = true;
			expect(cb).toHaveBeenCalledTimes(5);
		});

		it('does not trigger the callback when the value does not change', function() {
			var x = { a: { b: 3, c: 'x', d: false } };
			var cb = jasmine.createSpy('callback');
			Observe.properties(x, [ 'a.b', 'a.c' ], cb);
			expect(cb).not.toHaveBeenCalled();
		});

	});
	
});