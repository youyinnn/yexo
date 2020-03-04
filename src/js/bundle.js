/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/wp.main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/frame.js":
/*!*************************!*\
  !*** ./src/js/frame.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports.frameInit = () => {\n    var win = __webpack_require__(/*! electron */ \"electron\").remote.getGlobal('share').win\n\n    var appFrame = new Vue({\n        el: '#app-frame',\n        data: {\n            title: 'Yexo',\n            win: win\n        },\n        methods: {\n            appClose: function () {\n                this.win.close()\n            },\n            appMinimize: function () {\n                this.win.minimize()\n            }\n        }\n    })\n\n    Vue.component('div-example', {\n        props: ['title', 'content'],\n        data: function () {\n            return {\n                xixi: 'haha',\n                heihei: 'hoho'\n            }\n        },\n        template: `\n            <div :class=\"xixi\">\n                <h1>💖{{title}}</h1>\n                <p>{{content}}</p>\n                <p>{{heihei}}</p>\n            </div>`\n    })\n    var contentFrame = new Vue({\n        el: '#content-frame',\n        data: {\n            title: 'Yexo'\n        },\n        methods: {\n            show: function () {\n                console.log(123)\n            }\n        }\n    })\n\n}\n\n//# sourceURL=webpack:///./src/js/frame.js?");

/***/ }),

/***/ "./src/js/init.js":
/*!************************!*\
  !*** ./src/js/init.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports.init = () => {\r\n    window.onload = () => {\r\n        var win = __webpack_require__(/*! electron */ \"electron\").remote.getGlobal('share').win\r\n    \r\n        // ANCHOR frame size control\r\n        var frame = __webpack_require__(/*! ./frame */ \"./src/js/frame.js\")\r\n    \r\n        frame.frameInit()\r\n    }\r\n}\n\n//# sourceURL=webpack:///./src/js/init.js?");

/***/ }),

/***/ "./src/js/wp.main.js":
/*!***************************!*\
  !*** ./src/js/wp.main.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// my init\r\nvar init = __webpack_require__(/*! ./init */ \"./src/js/init.js\")\r\ninit.init()\r\n\r\n// Global Constant\r\nprocess.env.APPNAME = 'Yexo'\r\n\n\n//# sourceURL=webpack:///./src/js/wp.main.js?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");\n\n//# sourceURL=webpack:///external_%22electron%22?");

/***/ })

/******/ });