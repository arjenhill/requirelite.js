/**
 * requirejs lite 
 * p_jiewwang email@ahthw.com
 * readme.md  2016 年5月18日23: 49: 04
 */

(function(win) {
    "use strict";

    if (win.define) { //使用原始的requirejs
        return;
    }

    /**
     * 扩展当前object
     * @param  {object} obj 待填充的object
     * @param  {object} src 用于填充的object
     * @return {object}     填充后的object
     */
    var _extend = function(obj, src) {
        for (var i in src) {
            if (src.hasOwnProperty(i)) {
                obj[i] = src[i];
            }
        }
        return obj;
    };

    /**
     * 检查是否是空对象
     * @param  {object}  obj 检查的对象
     * @return {bool}     返回检查结果
     */
    var _isEmptyObject = function(obj) {
        if (!obj) {
            return true;
        }
        for (var i in obj) {
            return false;
        }
        return true;
    };

    //存储define过的模块信息
    var _modulesList = {};

    var _define = function(name, deps, callback) {
        var coreTostring = Object.prototype.toString,
            typeName = coreTostring.call(name).toLowerCase(),
            typeDepends = coreTostring.call(deps).toLowerCase();

        if (typeName === '[object function]') {
            callback = name;
            name = '';
            deps = [];
        } else if (typeName === '[object array]') {
            callback = deps;
            deps = name;
            name = '';
        } else if (typeDepends === '[object function]') {
            callback = deps;
            deps = [];
        }

        _modulesList[name] = {
            exec: 0, //是否执行过callback
            dp: deps, //依赖模块数组
            cb: callback, //callback方法
            ins: {} //执行结果保存
        };
    };
    _define.amd = true;

    var _requireMod = function(name) {
        if (name === 'exports') {
            return {};
        }

        var modInfo = _modulesList[name];
        if (!modInfo) {
            throw new Error('not found module name: ' + name);
        }

        if (modInfo.exec) { //已经require过
            return modInfo.ins;
        }
        modInfo.exec = 1;

        var mods = [],
            ret = {},
            exports = {};
        for (var i = 0, l = modInfo.dp.length; i < l; i++) {
            if (modInfo.dp[i] === 'exports') {
                mods.push(exports);
            } else {
                mods.push(_requireMod(modInfo.dp[i]));
            }
        }

        //执行callback结果
        ret = modInfo.cb.apply(null, mods) || {};
        if (_isEmptyObject(exports)) {
            modInfo.ins = ret;
        } else { //合并exports中的导出
            _extend(exports, ret);
            _extend(modInfo.ins, exports);
        }
        return modInfo.ins;
    };

    _modulesList.require = {
        ins: _requireMod,
        exec: 1
    };

    var _require = function(deps, callback) {
        var depsMod = [];
        for (var i = 0, l = deps.length; i < l; i++) {
            depsMod.push(_requireMod(deps[i]));
        }

        callback.apply(null, depsMod);
    };

    _require.config = function(conf) {
        _require._config = conf;
    };

    win.define = _define;
    win.require = win.mrequire = _require;
}(window));