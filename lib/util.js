// Various utility functions, mostly based of jQuery

// This lib should contain no Ti related code

function TUUtil() {

    var debug_counter = 0;

    this.debug = function(msg) {
        debug_counter += 1;
        Ti.API.info(debug_counter + " " + msg);
    };

    // Misc formatting / cleaning functions
    this.formatCurrency = function(n) {
        // remove sign and comma
        n = n.toString().replace(/£|,/g, '');
        if (isNaN(n)) {
            n = "0";
        }
        sign = (n == (n = Math.abs(n)));
        // round up
        n = Math.floor(n * 100 + 0.50000000001);
        n = Math.floor(n / 100).toString();
        for (var i = 0; i < Math.floor((n.length - (1 + i)) / 3); i++) {
            n = n.substring(0, n.length - (4 * i + 3)) + ',' + n.substring(n.length - (4 * i + 3));
        }
        return (((sign) ? '': '-') + n);
    };

    this.priceOut = function(value) {
        return "£" + this.formatCurrency(value);
    };
    
    this.isFunction = function( obj ) {
		return Object.prototype.toString.call(obj) === "[object Function]";
	};
	
	this.isArray = function( obj ) {
    		return Object.prototype.toString.call(obj) === "[object Array]";
    };

	this.isPlainObject = function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || Object.prototype.toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor && 
		    !Object.prototype.hasOwnProperty.call(obj, "constructor") && 
		    !Object.prototype.hasOwnProperty.call(obj.constructorprototype, "isPrototypeOf") ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || Object.prototype.hasOwnProperty.call( obj, key );
	};
    
    this.each = function( object, callback, args ) {
             var name, i = 0,
                 length = object.length,
                 isObj = length === undefined || this.isFunction(object);
    
             if ( args ) {
                 if ( isObj ) {
                     for ( name in object ) {
                         if ( callback.apply( object[ name ], args ) === false ) {
                             break;
                         }
                     }
                 } else {
                     for ( ; i < length; ) {
                         if ( callback.apply( object[ i++ ], args ) === false ) {
                             break;
                         }
                     }
                 }
    
             // A special, fast, case for the most common use of each
             } else {
                 if ( isObj ) {
                     for ( name in object ) {
                         if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
                             break;
                         }
                     }
                 } else {
                     for ( var value = object[0];
                         i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
                 }
             }
    
             return object;
    };
	
	this.extend = function() {
    	// copy reference to target object
    	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

    	// Handle a deep copy situation
    	if ( typeof target === "boolean" ) {
    		deep = target;
    		target = arguments[1] || {};
    		// skip the boolean and the target
    		i = 2;
    	}

    	// Handle case when target is a string or something (possible in deep copy)
    	if ( typeof target !== "object" && !this.isFunction(target) ) {
    		target = {};
    	}

    	for ( ; i < length; i++ ) {
    		// Only deal with non-null/undefined values
    		if ( (options = arguments[ i ]) != null ) {
    			// Extend the base object
    			for ( name in options ) {
    				src = target[ name ];
    				copy = options[ name ];

    				// Prevent never-ending loop
    				if ( target === copy ) {
    					continue;
    				}

    				// Recurse if we're merging object literal values or arrays
    				if ( deep && copy && ( this.isPlainObject(copy) || this.isArray(copy) ) ) {
    					var clone = src && ( this.isPlainObject(src) || this.isArray(src) ) ? src
    						: this.isArray(copy) ? [] : {};

    					// Never move original objects, clone them
    					target[ name ] = this.extend( deep, clone, copy );

    				// Don't bring in undefined values
    				} else if ( copy !== undefined ) {
    					target[ name ] = copy;
    				}
    			}
    		}
    	}

    	// Return the modified object
    	return target;
    };


    this.param_add = function ( s, key, value ) {
		// If value is a function, invoke it and return its value
		value = this.isFunction(value) ? value() : value;
		s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
	}
	
    
	this.buildParams = function( s, prefix, obj ) {
		if ( this.isArray(obj) ) {
			// Serialize array item.
			this.each( obj, function( i, v ) {
				if ( /\[\]$/.test( prefix ) ) {
					// Treat each array item as a scalar.
					this.param_add( s, prefix, v );
				} else {
					// If array item is non-scalar (array or object), encode its
					// numeric index to resolve deserialization ambiguity issues.
					// Note that rack (as of 1.0.0) can't currently deserialize
					// nested arrays properly, and attempting to do so may cause
					// a server error. Possible fixes are to modify rack's
					// deserialization algorithm or to provide an option or flag
					// to force array serialization to be shallow.
					this.buildParams( s, prefix + "[" + ( typeof v === "object" || this.isArray(v) ? i : "" ) + "]", v );
				}
			});

		} else if ( obj != null && typeof obj === "object" ) {
			// Serialize object item.
			this.each( obj, function( k, v ) {
				this.buildParams( s, prefix + "[" + k + "]", v );
			});

		} else {
			// Serialize scalar item.
			this.param_add( s, prefix, obj );
		}
	}

    // needed for regex below
    var r20 = /%20/g;
    
    this.param = function( a ) {
        
        var s = [];
		// If an array was passed in, assume that it is an array of form elements.
		if ( this.isArray(a) || a.jquery ) {
			// Serialize the form elements
			this.each( a, function() {
				this.param_add( s, this.name, this.value );
			});
			
		} else {

			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				this.buildParams( s, prefix, a[prefix] );
			}
		}
		// Return the resulting serialization
		return s.join("&").replace(r20, "+");

	};
    
}
