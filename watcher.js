/* watcher.js, by dandavis 2014 - [CCBY4.0]
 Watches an object path for changes, notificies in the style of Object.watch(), but handlers all browsers using Object.observe, Object.watch, Objct.defineProperty, and polling.

Usage:

watcher(
	window.myClass.myObject, 	// path
	"myProperty", 		// key to watch
	function(key, value, was){  // callback function
		alert(key+" changed from "+was+" to " + value); 
	}
);


watcher.tee( // no callback, just push a value from one object to another, in this case an object prop to the page title:
	"window.myClass.myObject.myProperty", 	// path to watch
	"document.title", 				// path to push values to

);

*/


;(function(name, global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports'], factory); 
	} else {
               factory(typeof exports === "object" && exports || global );
	}
}("watcher", this, function _watcher(obj){

	function normalize(path) {
		if (Array.isArray(path)) {
			path = path.join(".");
		}
		return path.split(/['"\[\].]+/).filter(Boolean).filter(function(a) {
			return !{
				window: 1,
				self: 1,
				this: 1
			}[a];
		});
	}

	function resolve(path) {
		if (typeof path === 'object' && path) return path;
		if (typeof path === 'function') {
			return path();
		}
		var r = normalize(path).map(function(a, b) {
			return this[0] = this[0][a] || this[0];
		}, [self]);

		return r.pop();
	}

	watcher.tee=function(strPathFrom, strPathTo ){
		var a=arguments, 
		f=normalize(a[0]), 
		t=normalize(a[1]),
		keyF=f.pop(),
		keyT=t.pop();
		t=resolve(t.join("."));
		f=resolve(f.join("."));
		t[keyT]=f[keyF];
		
		return watcher( f, keyF, function(a,b,val){
			console.info("wat", a,b,val)
			t[keyT]=val;
		});
		
	};


	function watcher(base, key, callBack) {
		if (!callBack || !callBack.call) {
			throw new TypeError("callBack must be function");
		}
		
		var interval = +watcher.interval || 50,
		         b = resolve(base),
			val = b[key];

		function poller() {
			var b = resolve(base),
				v = b[key];
			if (v != val) {
				callBack.call(b, key, val, v);
				val = v;
			}
		}

		function setter(v) {
			callBack.call(b, key, val, v);
			val = v;
		}

		function getter() {
			return val;
		}



		function observer(changes) {
			changes.forEach(function(change, i) {
				callBack.call(b, key, val, b[key]);
			});
			val = b[key];
		}


		//use object.watch, object.observe, ODP, or polling as available:


			if (Object.observe) {
				Object.observe(b, observer, ['update']);
				return function() {
					Object.unobserve(b, observer);
				};
			}

			if (Object.watch) {
				base.watch(key, callBack);
				return function() {
					base.unwatch(key, callBack);
				};
			}

			if (Object.defineProperty && (delete b[key]) ) {
			
				Object.defineProperty(b, key, {
					enumerable: true,
					configurable: true,
					get: getter,
					set: setter
				});
				return function() {
					Object.defineProperty(b, key, {
						value: val
					});
				};

			} //end if ODP?

			 b[key]=val;        

		return clearInterval.bind(window, setInterval(poller, interval));

	} //end watcher()

	return obj.watcher=watcher;

}));//end moduleWrapper


