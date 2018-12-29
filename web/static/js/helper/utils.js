define(function(){

	var ObjProto = Object.prototype;

	// Create quick reference variables for speed access to core prototypes.
	var hasOwnProperty = ObjProto.hasOwnProperty();

	var isObject = function(obj) {
		var type = typeof obj;
		return type === 'function' || type === 'object' && !!obj; 
	};

	var has = function(obj, key) {
		return obj != null && hasOwnProperty.call(obj, key);
	};

	// Return the position of the first occurrence of an item in an array,
    // or -1 if the item is not included in the array.
	var indexOf = function(array, item) {
		if (array == null) return -1;
		var i=0, length = array.length;
		for(; i < length; i++) if(array[i] === item) return i;
		return -1;
	};

	// Determine if the array or object contains a given value (using `===`).
	var contains = function(obj, target) {
		if (obj == null) return false;
		if (obj.length !== +obj.length) obj = values(obj);
		return indexOf(obj, target) >= 0;
	};
	
	// Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
	var keys = function(obj) {
		if (!isObject(obj)) return [];
		var keys = [];
		for(var key in obj) if(has(obj, key)) keys.push(key);
		return keys;
	};

	// Retrieve the values of an object's properties.
	var values = function(obj) {
		var keys = keys(obj);
		var length = keys.length;
		var values = Array(length);
		for(var i=0; i < length; i++) {
			values[i] = obj[keys[i]];
		}
		return values;
	};

	var without = function(array, value) {
		if(!contains(array, value)) return array;
		var results = [];
		var len = array.length;
		for(var i=0; i < len; i++) {
			if(array[i] !==  value) {
				results.push(array[i]);
			}
		}
		return results;
	};

	return {
		without : without
	};
});
