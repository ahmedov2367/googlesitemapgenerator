// Copyright 2007 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview This class contains some utility functions.
 * @author chaiying@google.com (Ying Chai)
 */

/**
 * The utility module
 */
var Util = {};

/**
 * The console namespace, for msg/log output
 */
Util.console = {};

/**
 * The object namespace, for Object functions extension
 */
Util.object = {};

/**
 * The DOM namespace, for DOM functions extension
 */
Util.DOM = {};

/**
 * The array namespace, for Array functions extension
 */
Util.array = {};

/**
 * The CSS namespace, for CSS class utilities.
 */
Util.CSS = {};

/**
 * The event namespace, for event management utilities.
 */
Util.event = {};
/////////////////////////// report functions ////////////////////////////
/**
 * Reports to user.
 * @param {String} msg  The message to user
 */
Util.console.report = function(msg) {
  alert(msg);
};

/**
 * Logs to the debug window.
 * @param {String} msg  The debug message
 */
Util.console.log = function(msg) {
  return; // now it close
  if (!Util.console.log.window) {
    Util.console.log.window = window.open('', DEBUG_WINDOW_NAME,
                                  'resizable,scrollbars,status');
    Util.console.log.window.document.write('start debug...<br/>');
  }
  Util.console.log.window.document.write(msg + '<br/>');
};

/**
 * Reports to user and throws exception.
 * @param {String} msg  The error message
 */
Util.console.error = function(msg) {
  Util.console.report('Error: ' + msg);
  throw new Error(msg);
};

//////////////////////////// object function //////////////////////////
/**
 * Checks if the object has a property
 * @param {Object} obj  The object being checked
 * @param {String} prop  The property name
 * @return {Boolean} True if the object has the property
 */
Util.object.hasProperty = function(obj, prop) {
  if (prop in obj)
    return true;
  else
    return false;
};

/**
 * Checks if the object is an instance of 'classname' class
 * @param {Object} obj  The object to be checked
 * @param {Function} classname  The class constructor
 */
Util.object.isType = function(obj, classname) {
  return obj != null && typeof obj == 'object' && obj instanceof classname;
};

/**
 * Applies function to associated-array-like object.
 * @param {Object} obj  The associated-array-like object
 * @param {Function} func The function that applies to the items in the object
 */
Util.object.apply = function(obj, func) {
  var rets = [];
  for (var prop in obj)
    rets.push(func(obj[prop]));
  return rets;
};
///////////////////////// DOM function //////////////////////////
/**
 * Applies function to each node in the DOM tree.
 * @param {Node} root  The root of the DOM tree
 * @param {Function} func  The function that applies to the nodes
 * @param {Array?} opt_params  The params to the function
 */
Util.DOM.applyToDomTree = function(root, func, opt_params) {
  if (root.nodeType != Node.ELEMENT_NODE)
    return;
  if (opt_params)
    func(root, opt_params);
  else
    func(root);

  if (Util.object.hasProperty(root, 'childNodes')) {
    for (var i = 0; i < root.childNodes.length; i++) {
      if (root.nodeType == Node.ELEMENT_NODE)
        Util.DOM.applyToDomTree(root.childNodes[i], func, opt_params);
    }
  }
};
/**
 * Checks if the element has the attribute.
 * @param {Element} elem  The element to be checked
 * @param {String} attrname  The attribute name
 * @return {Boolean} If the element has the attribute
 */
Util.DOM.hasAttribute = function(elem, attrname) {
  /*
   * Notes:
   * For HTML node, 'if (elem.getAttribute)' can be used to judge if the
   * function exist, but for XML node, IE will throw an except that 'Wrong
   * number of arguments or invalid  property assignment'. The IE's
   * Element.getAttribute is also not a function, but an unknown object.
   */
  if (elem.hasAttribute) {
    return elem.hasAttribute(attrname);
  } else { // for IE
    return elem.getAttribute(attrname) != null;
  }
};
/**
 * Checks if the node is a text node.
 * @param {Node} node  The node to be checked
 * @return {Boolean} If the node is a text node
 */
Util.DOM.isTextNode = function(node) {
  return node && node.nodeType == Node.TEXT_NODE;
};

/**
 * Finds sub node(s) in the HTML container according to the params.
 * @param {HTMLElement} container  The root node of the searched tree
 * @param {String} tagName  The tag name of the nodes to be found
 * @param {String} type  The 'type' attribute value, for 'INPUT' element
 * @param {Boolean} onlyFirst  Find the first node or all nodes
 * @param {Boolean} deepSearch  If true, search all the sub elements under the
 * container, else, search only the direct sub elements.
 * @return {Array.<Element>|Element|null} The found node(s)
 * @private
 */
Util.DOM.getSubNodes_ = function(container, tagName, type, onlyFirst, 
                                 deepSearch){
  var uncheckElems; // elements that match tagname but not check type
  if (deepSearch) {
    uncheckElems = container.getElementsByTagName(tagName);
  } else {
    uncheckElems = Util.array.filter_(container.childNodes, function(node) {
      return Node.ELEMENT_NODE == node.nodeType && node.tagName == tagName;
    });
  }

  var elements;
  if (type == '') {
    elements = uncheckElems;
  } else {
    elements = Util.array.filter_(uncheckElems, function(elem) {
      return elem.type == type;
    });
  }

  return onlyFirst ? (elements.length == 0 ? null : elements[0]) : elements;
};

/**
 * Gets the first child in the container that have the tagname and the type
 * attribute value.
 * @param {Element} container  The parent container
 * @param {String} tagName  The tag name of the child to be found
 * @param {String} type  The type value of the child to be found
 * @return {Array.<Element>?} The found child node
 */
Util.DOM.getFirstChildrenByTagNameAndType = function(container, tagName, type) {
  return Util.DOM.getSubNodes_(container, tagName, type, true, false);
};

/**
 * Gets all the children in the container that have the tagname.
 * @param {Element} container  The parent container
 * @param {String} tagName  The tag name of the children to be found
 * @return {Array.<Element>?} The found children node(s)
 */
Util.DOM.getAllChildrenByTagName = function(container, tagName){
  return Util.DOM.getSubNodes_(container, tagName, '', false, false);
};

/**
 * Gets the first child in the container that have the tagname.
 * @param {Element} container  The parent container
 * @param {String} tagName  The tag name of the child to be found
 * @return {Array.<Element>?} The found child node
 */
Util.DOM.getFirstChildrenByTagName = function(container, tagName){
  return Util.DOM.getSubNodes_(container, tagName, '', true, false);
};

////////////

/**
 * Gets all the descentdant in the container that have the tagname and the type
 * attribute value.
 * @param {Element} container  The ancestor container
 * @param {String} tagName  The tag name of the descentdant to be found
 * @param {String} type  The type value of the descentdant to be found
 * @return {Array.<Element>?} The found descentdant node(s)
 */
Util.DOM.getAllDescentdantByTagNameAndType = function(container, tagName, type){
  return Util.DOM.getSubNodes_(container, tagName, type, false, true);
};

/**
 * Gets the first descentdant in the container that have the tagname and the
 * type attribute value.
 * @param {Element} container  The ancestor container
 * @param {String} tagName  The tag name of the descentdant to be found
 * @param {String} type  The type value of the descentdant to be found
 * @return {Array.<Element>?} The found descentdant node
 */
Util.DOM.getFirstDescentdantdantByTagNameAndType = function(container, tagName, 
                                                            type) {
  return Util.DOM.getSubNodes_(container, tagName, type, true, true);
};

/**
 * Gets all the descentdant in the container that have the tagname.
 * @param {Element} container  The ancestor container
 * @param {String} tagName  The tag name of the descentdant to be found
 * @return {Array.<Element>?} The found descentdant node(s)
 */
Util.DOM.getAllDescentdantByTagName = function(container, tagName){
  return Util.DOM.getSubNodes_(container, tagName, '', false, true);
};

////////////


/**
 * Remove all the DOM component in the 'container' node.
 * @param {Node} container  The container node
 */
Util.DOM.removeAllChildren = function(container) {
  if (Util.object.hasProperty(container, 'childNodes')) {
    for (var i = 0; i < container.childNodes.length;) {
      container.removeChild(container.childNodes[i]);
    }
  }
};

/////////////////////// assert function ///////////////////////////
/**
 * Asserts the value is not null and equal to Boolean value 'true', empty string
 * will be treated as true.
 * Exception will be thrown if the value is null or undefined.
 * @param {Object?} val  The value to be asserted
 * @param {String} opt_msg  The msg to be output if the assert is failed
 */
Util.assert = function(val, opt_msg) {
  var defMsg = 'assert failed!';
  if (val === null || val === false || val === undefined) {
    Util.console.error(opt_msg ? opt_msg : defMsg);
  }
};

/**
 * Asserts the element with the id exists.
 * Exception will be thrown if the value is null or undefined.
 * @param {Document} dom  The document where to find the element.
 * @param {String} id  The element's id
 * @param {String} opt_msg  The msg to be output if the assert is failed
 * @private
 */
Util.assertHtmlElementInDom_ = function(dom, id, opt_msg) {
  var defMsg = 'lack html element with id: ' + id;
  Util.assert(dom.getElementById(id) != null, opt_msg ? opt_msg : defMsg);
};

/////////////////////// check function ///////////////////////////

/**
 * Checks if the element with this id exists in current document, and return
 * the element. Exception will be thrown if the check fails.
 * @param {String} id  The element's id
 * @return {Element} The element that is found
 */
Util.checkElemExistAndReturn = function(id) {
  return Util.checkElemExistInDomAndReturn(document, id);
};

/**
 * Checks if the element with this id exists in the given document, and return
 * the element. Exception will be thrown if the check fails.
 * @param {Document} dom  The document where to find the element.
 * @param {String} id  The element's id
 * @return {Element} The element that is found
 */
Util.checkElemExistInDomAndReturn = function(dom, id) {
  Util.assertHtmlElementInDom_(dom, id); // cause 40 ms, should be remove when
                                        // release
  return dom.getElementById(id);
};

/**
 * Checks that the node has exact one element that the tag name is equal to
 * the 'tagName'. Exception will be thrown if the check fails. It will return
 * the element that is found,.
 *
 * @param {Node} node  The node to be checked
 * @param {String} tagName  The tag name for the element
 * @return {Element} The element that is found
 */
Util.checkUniqueAndReturn = function(node, tagName) {
  var subnode = node.getElementsByTagName(tagName);
  Util.assert(subnode.length == 1, 'Util.checkUniqueAndReturn '+tagName);
  return subnode[0];
};

/**
 * Checks that the node has at most one element that the tag name is equal to
 * the 'tagName'. Exception will be thrown if the check fails. It will return
 * the element that is found, or null if not found.
 *
 * @param {Node} node  The node to be checked
 * @param {String} tagName  The tag name for the element
 * @return {Element?} The element that is found, or null if not found
 */
Util.checkUniqueOrNullAndReturn = function(node, tagName) {
  var elements = node.getElementsByTagName(tagName);
  Util.assert(elements.length <= 1, 'Util.checkUniqueOrNullAndReturn');
  return elements.length == 0 ? null : elements[0];
};


///////////////////////// array function ////////////////
/**
 * Checks if the array contains the value, which means one of the array item
 * is equal to the value.
 * @param {Array} array  The array to be checked
 * @param {Object} val  The value for check
 * @return {Boolean} True if the array contains the value
 */
Util.array.contains = function(array, val) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == val) {
      return true;
    }
  }
  return false;
};

/**
 * Calls the 'func' function on each item in 'array', the item will be passed to
 * the applied function as the only parameter. It returns
 * the result array that contains the return values of the 'func' function.
 *
 * We assume that the applied function cannot access the array directly, and
 * will never change the array's length.
 *
 * @param {Array} array  The array to be processed
 * @param {Function} func  The function that apply to the array, it takes the
 *     array item as the parameter. The return value will be ignored
 * @return {Array} The array of the results that the function return for each
 *     item.
 */
Util.array.apply = function(array, func) {
  var rets = [];
  for (var i = 0; i < array.length; i++)
    rets.push(func(array[i]));
  return rets;
};

/**
 * Applies the function to array members, will stop applying to the remaining
 * members if the function return false to current member.
 * @param {Array} array  The array to be applied
 * @param {Function} func  The function that applies to the array
 */
Util.array.applyWithBreak = function(array, func) {
  for (var i = 0; i < array.length; i++)
    if (!func(array[i]))
      break;
};

/**
 * Applies the function to each item of these two arrays, if these two arrays
 * are not equal in size, the longer one will be trunc.
 *
 * @param {Array} arr1  The first array to be processed
 * @param {Array} arr2  The second array to be processed
 * @param {Function} func  The function that apply to these two arrays, it takes
 *      two parameters, the first one is an item of the first array, the second
 *      one is the item of the second array that has the same index of the first
 *      one. The return value will be ignored
 */
Util.array.applyToMultiple = function(arr1, arr2, func) {
  for (var i = 0; i < arr1.length && i < arr2.length; i++)
    func(arr1[i], arr2[i]);
};
/**
 * Removes the item from the array
 * @param {Array} array  The array
 * @param {Object} item  The item in the array that need to be removed
 * @param {Boolean} isUnique  If true, only remove the first in the 'array'
 * which is equal to the 'item', else, remove all that match.
 */
Util.array.remove = function(array, item, isUnique) {
  for (var i = array.length - 1; i >= 0; i--) {
    if (array[i] == item) {
      array.splice(i, 1);
      if (isUnique)
        break;
    }
  }
};
/**
 * Passes each element of the array a to the specified predicate function.
 * Return an array that holds the elements for which the predicate returns true.
 *
 * @param {Array} a  The array that need filter
 * @param {Function} predicate  Function that take the array item as the
 *     parameter and return Boolean result
 * @return {Array} The array that has been filtered
 * @private
 */
Util.array.filter_ = function(a, predicate) {
    var results = [];
    for (var i = 0; i < a.length; i++) {
        var element = a[i];
        if (predicate(element))
          results.push(element);
    }
    return results;
};

//////////////////////// className manipulator //////////////////
/**
 * Adds a CSS class to the element
 * @param {Element} elem  The HTML element
 * @param {String} name  The CSS class name
 */
Util.CSS.addClass = function(elem, name) {
  if (!elem.className) { // first set
    elem.className = name;
  } else if (Util.CSS.isClass(elem, name)) { // avoid add multiple times
    return;
  } else {
    newClassName = elem.className;
    newClassName += " ";
    newClassName += name;
    elem.className = newClassName;
  }
};
/**
 * Checks if the element has the CSS class.
 * @param {Element} elem  The HTML element
 * @param {String} name  The CSS class name
 * @return {Boolean} If the element has the CSS class
 */
Util.CSS.isClass = function(elem, name) {
  if (!elem.className)
    return false;

  var names = elem.className.split(/ /);
  for (var i = 0; i < names.length; i++) {
    if (names[i] == name)
      return true;
  }
  return false;
};
/**
 * Removes a CSS class from the element
 * @param {Element} elem  The HTML element
 * @param {String} name  The CSS class name
 */
Util.CSS.removeClass = function(elem, name) {
  if (!elem.className)
    return;

  var names = elem.className.split(/ /);
  Util.array.remove(names, name, false);
  elem.className = names.join(' ');
};
/**
 * Changes the element from one CSS class to another CSS class
 * @param {Element} elem  The HTML element
 * @param {String} oldname  The CSS class name to be replaced
 * @param {String} newname  The CSS class name to be applied to the element
 */
Util.CSS.changeClass = function(elem, oldname, newname) {
  Util.CSS.removeClass(elem, oldname);
  Util.CSS.addClass(elem, newname);
};

/**
 * Hides the element by using CSS.
 * @param {Element} elem  The HTML element
 */
Util.CSS.hideElement = function(elem) {
  Util.CSS.changeClass(elem, DISPLAY_CLASS, HIDDEN_CLASS);
};

/**
 * Shows the element by using CSS.
 * @param {Element} elem  The HTML element
 */
Util.CSS.showElement = function(elem) {
  Util.CSS.changeClass(elem, HIDDEN_CLASS, DISPLAY_CLASS);
};


////////////////


/**
 * Adds event handler to the element.
 * First add, first serve.
 * @param {Element} target  The element that the event handler attach to
 * @param {String} eventName  The event name
 * @param {Function} func  The event hanlder
 */
Util.event.add = function(target, eventName, func) {
  var handlerName = Util.event.check_(eventName);
  var oldHandler = target[handlerName];
  if (typeof oldHandler != 'function') {
    target[handlerName] = function(e) {
      func(e, target);
    }
  } else {
    target[handlerName] = function(e) {
      oldHandler(e, target);
      func(e, target);
    };
  }
};

/**
 * The events that these utilities in the namespace supported.
 */
Util.event.EVENTS = ['mouseover', 'mouseout', 'change', 'keydown', 'load',
                     'click'];
/**
 * Checks if the event is supported.
 * @param {String} eventName  The event name
 * @return {String} The event name that has 'on' prefix
 * @private
 */
Util.event.check_ = function(eventName) {
  var name = eventName.toLowerCase();
  if (!Util.array.contains(Util.event.EVENTS, name))
    Util.console.error('invalid event - \'' + name + '\'');
  return 'on' + name;
};

/**
 * Triggers event.
 * @param {String} eventname  The event name
 * @param {Element} target  The target element
 * @supported IE6 and Firefox2
 */
Util.event.send = function(eventname, target) {
  if (typeof target == 'string')
    target = Util.checkElemExistAndReturn(target);

  if (document.createEvent) {
    var e = document.createEvent('Events');
    e.initEvent(eventname, true, false);
  } else if (document.createEventObject) {
    var e = document.createEventObject();
  } else {
    Util.console.error('The browser do not support event create!');
  }

  if (target.dispatchEvent)
    target.dispatchEvent(e);
  else if (target.fireEvent)
    target.fireEvent('on' + eventname, e);
};

/**
 * Adds onReturnKey event to the element.
 * @param {Element} target  The target element
 * @param {Function} func  The event handler
 */
Util.event.addEnterKey = function(target, func) {
  // Using 'keyup' will cause trouble when user use keyboard
  // to confirm the alert popup window.
  if (typeof target == 'string') {
    target = Util.checkElemExistAndReturn(target);
  }
  Util.event.add(target, 'keydown', function(event) {
    // Get the event object and character code in a portable way
    var e = event || window.event;         // Key event object
    var code = e.charCode || e.keyCode;    // What key was pressed
    if (code == 13) {
      func();
    }
  });
};

//////////////////////////////////////////
/**
 * The performance monitor class.
 * @constructor
 * var perf = new Perf(); // start perf, record the start time.
 * perf.check(msg); // record the current point time.
 * perf.checkAndDebug(max,msg);// record the current point time, if the last
 *                             // time duration is longer than max, trigger
 *                             // debugger.
 * perf.report(); // show the perf data
 * @param {string} opt_name  The name of the perf instance
 */
function Perf(opt_name) {
  this.name_ = opt_name ? opt_name : '';
  this.times = [];
  this.check('start point');
}
/**
 * The enable flag of performance monitor.
 * @type {Boolean}
 * @private
 */
Perf.enable_ = false;

/**
 * The global DB for named perf instances, which can be shared among functions.
 */
Perf.perfs = {};

/**
 * Gets a perf instance in global DB by name.
 * @param {String} name  The name of the perf
 * @return {Perf} The perf instance
 */
Perf.getPerf = function(name) {
  if (!Perf.perfs[name]) {
    Perf.perfs[name] = new Perf(name);
  }
  return Perf.perfs[name];
};
/**
 * The internal class used by perf to record the check point information
 * @param {String} id  The identifier of the check point
 * @param {Number} time  The time of the check point, in milliseconds
 * @private
 */
Perf.CheckPoint_ = function(id, time) {
  this.id = id;
  this.time = time;
};

/**
 * Records the current point time
 * @param {String} msg  The message that discribes the check point
 */
Perf.prototype.check = function(msg) {
  if (Perf.enable_)
    this.times.push(new Perf.CheckPoint_(msg, (new Date()).getTime()));
};
/**
 * Reports to user the perf summary.
 */
Perf.prototype.report = function() {
  if (Perf.enable_)
    alert(this.toString());
};
/**
 * Gets the perf summary
 * @return {String} The perf summary
 */
Perf.prototype.toString = function() {
  var interval = [];
  var len = this.times.length;
  var times = this.times;
  for (var i = 1; i < len; i++) {
    var prev = times[i - 1];
    var curr = times[i];
    interval.push(curr.id + ': ' + (curr.time - prev.time).toString());
  }
  if (len > 2)
    interval.push('Total: ' +
        (times[len - 1].time - times[0].time).toString());

  return this.name_ + ':\n' + interval.join('\n');
};
/**
 * Records the current point time, checks its duration, debug if it costs too 
 * much time.
 * @param {Number} max  The max duration, in milliseconds
 * @param {String} opt_msg  The optional message for the check point
 */
Perf.prototype.checkAndDebug = function(max, opt_msg) {
  if (!Perf.enable_)
    return;
  var time = (new Date()).getTime();
  var msg = opt_msg ? opt_msg : '';
  this.times.push(new Perf.CheckPoint_(msg, time));
  var prev = this.times[this.times.length - 1].time;
  if (time - prev > max) debugger;
};

/**
 * Adds a perf instance to global DB.
 * @param {Perf} perf  The perf instance
 */
Perf.addPerf = function(perf) {
  if (!Perf.perfs)
    Perf.perfs = [];
  Perf.perfs.push(perf);
};
/**
 * Reports all the perfs' summaries in global DB.
 * @param {Perf} perf  The perf instance
 */
Perf.report = function(perf) {
  if (!Perf.enable_)
    return;
  var res = [];
  Util.array.apply(Perf.perfs, function(perf) {
    res.push(perf.toString());
  });
  alert(res.join('\n'));
};
///////////////// Build-in object extension ///////////////////
/**
 * Extends the Function object for object inheritance.
 * Makes one class inherit from another class
 * @param {Function} parent  The ancestor class to be inherited
 * @return {Function} The successor class
 */
Function.prototype.inheritsFrom = function(parent) {
  this.prototype = new parent('inheritsFrom');
  this.prototype.constructor = this;
  this.prototype.parent = parent.prototype;
	return this;
};

///////////// Cookie ////////////////////
/**
 * Copy from JavaScript - The Definitive Guide, 5th Edition
 * This is the Cookie( ) constructor function.
 *
 * This constructor looks for a cookie with the specified name for the
 * current document. If one exists, it parses its value into a set of
 * name/value pairs and stores those values as properties of the newly created
 * object.
 *
 * To store new data in the cookie, simply set properties of the Cookie
 * object. Avoid properties named "store" and "remove", since these are
 * reserved as method names.
 *
 * To save cookie data in the web browser's local store, call store( ).
 * To remove cookie data from the browser's store, call remove( ).
 *
 * The static method Cookie.enabled( ) returns true if cookies are
 * enabled and returns false otherwise.
 * @param {String} name  The cookie name
 */
function Cookie(name) {
    this.$name = name;  // Remember the name of this cookie

    // First, get a list of all cookies that pertain to this document.
    // We do this by reading the magic Document.cookie property.
    // If there are no cookies, we don't have anything to do.
    var allcookies = document.cookie;
    if (allcookies == "") return;

    // Break the string of all cookies into individual cookie strings
    // Then loop through the cookie strings, looking for our name
    var cookies = allcookies.split(';');
    var cookie = null;
    for (var i = 0; i < cookies.length; i++) {
        // Does this cookie string begin with the name we want?
        if (cookies[i].substring(0, name.length + 1) == (name + "=")) {
            cookie = cookies[i];
            break;
        }
    }

    // If we didn't find a matching cookie, quit now
    if (cookie == null) return;

    // The cookie value is the part after the equals sign
    var cookieval = cookie.substring(name.length + 1);

    // Now that we've extracted the value of the named cookie, we
    // must break that value down into individual state variable
    // names and values. The name/value pairs are separated from each
    // other by ampersands, and the individual names and values are
    // separated from each other by colons. We use the split( ) method
    // to parse everything.
    var a = cookieval.split('&'); // Break it into an array of name/value pairs
    for (var i = 0; i < a.length; i++)  // Break each pair into an array
        a[i] = a[i].split(':');

    // Now that we've parsed the cookie value, set all the names and values
    // as properties of this Cookie object. Note that we decode
    // the property value because the store( ) method encodes it.
    for (var i = 0; i < a.length; i++) {
        this[a[i][0]] = decodeURIComponent(a[i][1]);
    }
}

/**
 * This function is the store( ) method of the Cookie object. *
 * @param {Number} daysToLive  The lifetime of the cookie, in days. If you set
 *     this to zero, the cookie will be deleted. If you set it to null, or
 *     omit this argument, the cookie will be a session cookie and will
 *     not be retained when the browser exits. This argument is used to
 *     set the max-age attribute of the cookie.
 * @param {String} path  The value of the path attribute of the cookie
 * @param {String} domain  The value of the domain attribute of the cookie
 * @param {Boolean} secure  If true, the secure attribute of the cookie will be 
 *     set
 */
Cookie.prototype.store = function(daysToLive, path, domain, secure) {
    // First, loop through the properties of the Cookie object and
    // put together the value of the cookie. Since cookies use the
    // equals sign and semicolons as separators, we'll use colons
    // and ampersands for the individual state variables we store
    // within a single cookie value. Note that we encode the value
    // of each property in case it contains punctuation or other
    // illegal characters.
    var cookieval = "";
    for (var prop in this) {
        // Ignore properties with names that begin with '$' and also methods
        if ((prop.charAt(0) == '$') || ((typeof this[prop]) == 'function'))
            continue;
        if (cookieval != "") cookieval += '&';
        cookieval += prop + ':' + encodeURIComponent(this[prop]);
    }

    // Now that we have the value of the cookie, put together the
    // complete cookie string, which includes the name and the various
    // attributes specified when the Cookie object was created
    var cookie = this.$name + '=' + cookieval;
    if (daysToLive || daysToLive == 0) {
      cookie += "; max-age=" + (daysToLive * 24 * 60 * 60);
    }

    if (path) cookie += "; path=" + path;
    if (domain) cookie += "; domain=" + domain;
    if (secure) cookie += "; secure";

    // Now store the cookie by setting the magic Document.cookie property
    document.cookie = cookie;
};

/**
 * This function is the remove( ) method of the Cookie object; it deletes the
 * properties of the object and removes the cookie from the browser's
 * local store.
 *
 * The arguments to this function are all optional, but to remove a cookie
 * you must pass the same values you passed to store( ).
 * @param {String} path  The value of the path attribute of the cookie
 * @param {String} domain  The value of the domain attribute of the cookie
 * @param {Boolean} secure  If true, the secure attribute of the cookie will be 
 *     set
 */
Cookie.prototype.remove = function(path, domain, secure) {
    // Delete the properties of the cookie
    for (var prop in this) {
        if (prop.charAt(0) != '$' && typeof this[prop] != 'function')
            delete this[prop];
    }

    // Then, store the cookie with a lifetime of 0
    this.store(0, path, domain, secure);
};

/**
 * This static method attempts to determine whether cookies are enabled.
 * @return {Boolean} True if they appear to be enabled and false otherwise.
 *   A return value of true does not guarantee that cookies actually persist.
 *   Nonpersistent session cookies may still work even if this method
 *   returns false.
 */
Cookie.enabled = function() {
    // Use navigator.cookieEnabled if this browser defines it
    if (navigator.cookieEnabled != undefined) return navigator.cookieEnabled;

    // If we've already cached a value, use that value
    if (Cookie.enabled.cache != undefined) return Cookie.enabled.cache;

    // Otherwise, create a test cookie with a lifetime
    document.cookie = "testcookie=test; max-age=10000";  // Set cookie

    // Now see if that cookie was saved
    var cookies = document.cookie;
    if (cookies.indexOf("testcookie=test") == -1) {
        // The cookie was not saved
        Cookie.enabled.cache = false;
        return false;
    }
    else {
        // Cookie was saved, so we've got to delete it before returning
        document.cookie = "testcookie=test; max-age=0";  // Delete cookie
        Cookie.enabled.cache = true;
        return true;
    }
};
