watcher
=======

**Object Property Change Notifications**

Watches an object path for changes, notificies in the style of Object.watch(), but handlers all browsers using Object.observe, Object.watch, Objct.defineProperty, and polling.

**Usage**

    watcher(
	  window.myClass.myObject, 	// path
	  "myProperty", 		// key to watch
	  function(key, value, was){ 	// callback function
	       alert( key+" changed from " + was + " to " + value ); 
	});


**Using the tee function to subscribe two paths**

// no callback, just push a value from one object to another, in this case an object prop to the page title:

     watcher.tee( 
         "window.myClass.myObject.myProperty", 	// path to watch
         "document.title", 				// path to push values to
     );

That All Folks!




