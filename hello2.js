(function(root, factory) {
    var JSLite = factory(root);
    if (typeof define === 'function' && define.amd) {
        // AMD
        // define([], factory);
        define('JSLite', function() {
            return JSLite;
        });
    } else if (typeof exports === 'object') {
        // Node.js
        module.exports = JSLite;
    } else {
        // Browser globals
        root.JSLite = JSLite;
    }
})(this, function() {
    //module ...
});