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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/js/app.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/js/app.ts":
/*!***********************!*\
  !*** ./app/js/app.ts ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _conf_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./conf/settings */ \"./app/js/conf/settings.ts\");\n/* harmony import */ var _conf_configuration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./conf/configuration */ \"./app/js/conf/configuration.ts\");\n/* harmony import */ var _players_player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./players/player */ \"./app/js/players/player.ts\");\n/* harmony import */ var _game_phase_one__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./game/phase-one */ \"./app/js/game/phase-one.ts\");\n/* harmony import */ var _game_phase_two__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./game/phase-two */ \"./app/js/game/phase-two.ts\");\n\n\n\n\n\nclass App {\n    constructor() {\n        this._settings = _conf_settings__WEBPACK_IMPORTED_MODULE_0__[\"Settings\"].instance;\n        this._conf = _conf_configuration__WEBPACK_IMPORTED_MODULE_1__[\"Configuration\"].instance;\n        this.init();\n    }\n    init() {\n        this.createPlayers();\n        this.initializePhases();\n        console.log(this.settings, this.conf);\n    }\n    createPlayers() {\n        const playerOne = new _players_player__WEBPACK_IMPORTED_MODULE_2__[\"Player\"](\"Mängija 1\", 1, \"one\");\n        const playerTwo = new _players_player__WEBPACK_IMPORTED_MODULE_2__[\"Player\"](\"Mängija 2\", 2, \"two\");\n        this.conf.players.push(playerOne, playerTwo);\n        playerOne.active = true;\n    }\n    initializePhases() {\n        const phaseOne = new _game_phase_one__WEBPACK_IMPORTED_MODULE_3__[\"PhaseOne\"]();\n        const phaseTwo = new _game_phase_two__WEBPACK_IMPORTED_MODULE_4__[\"PhaseTwo\"]();\n        this.conf.phases.push(phaseOne, phaseTwo);\n        phaseOne.init();\n    }\n    static get instance() {\n        if (!App._instance) {\n            App._instance = new App();\n        }\n        return App._instance;\n    }\n    set settings(settings) {\n        this._settings = settings;\n    }\n    set conf(configuration) {\n        this._conf = configuration;\n    }\n    get settings() {\n        return this._settings;\n    }\n    get conf() {\n        return this._conf;\n    }\n}\nApp.instance;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvanMvYXBwLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vYXBwL2pzL2FwcC50cz9hYTU1Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4vY29uZi9zZXR0aW5nc1wiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuL2NvbmYvY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vcGxheWVycy9wbGF5ZXJcIjtcbmltcG9ydCB7IFBoYXNlT25lIH0gZnJvbSBcIi4vZ2FtZS9waGFzZS1vbmVcIjtcbmltcG9ydCB7IFBoYXNlVHdvIH0gZnJvbSBcIi4vZ2FtZS9waGFzZS10d29cIjtcbmNsYXNzIEFwcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3NldHRpbmdzID0gU2V0dGluZ3MuaW5zdGFuY2U7XG4gICAgICAgIHRoaXMuX2NvbmYgPSBDb25maWd1cmF0aW9uLmluc3RhbmNlO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVQbGF5ZXJzKCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBoYXNlcygpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnNldHRpbmdzLCB0aGlzLmNvbmYpO1xuICAgIH1cbiAgICBjcmVhdGVQbGF5ZXJzKCkge1xuICAgICAgICBjb25zdCBwbGF5ZXJPbmUgPSBuZXcgUGxheWVyKFwiTcOkbmdpamEgMVwiLCAxLCBcIm9uZVwiKTtcbiAgICAgICAgY29uc3QgcGxheWVyVHdvID0gbmV3IFBsYXllcihcIk3DpG5naWphIDJcIiwgMiwgXCJ0d29cIik7XG4gICAgICAgIHRoaXMuY29uZi5wbGF5ZXJzLnB1c2gocGxheWVyT25lLCBwbGF5ZXJUd28pO1xuICAgICAgICBwbGF5ZXJPbmUuYWN0aXZlID0gdHJ1ZTtcbiAgICB9XG4gICAgaW5pdGlhbGl6ZVBoYXNlcygpIHtcbiAgICAgICAgY29uc3QgcGhhc2VPbmUgPSBuZXcgUGhhc2VPbmUoKTtcbiAgICAgICAgY29uc3QgcGhhc2VUd28gPSBuZXcgUGhhc2VUd28oKTtcbiAgICAgICAgdGhpcy5jb25mLnBoYXNlcy5wdXNoKHBoYXNlT25lLCBwaGFzZVR3byk7XG4gICAgICAgIHBoYXNlT25lLmluaXQoKTtcbiAgICB9XG4gICAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKCFBcHAuX2luc3RhbmNlKSB7XG4gICAgICAgICAgICBBcHAuX2luc3RhbmNlID0gbmV3IEFwcCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBBcHAuX2luc3RhbmNlO1xuICAgIH1cbiAgICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICB9XG4gICAgc2V0IGNvbmYoY29uZmlndXJhdGlvbikge1xuICAgICAgICB0aGlzLl9jb25mID0gY29uZmlndXJhdGlvbjtcbiAgICB9XG4gICAgZ2V0IHNldHRpbmdzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3M7XG4gICAgfVxuICAgIGdldCBjb25mKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29uZjtcbiAgICB9XG59XG5BcHAuaW5zdGFuY2U7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./app/js/app.ts\n");

/***/ }),

/***/ "./app/js/conf/configuration.ts":
/*!**************************************!*\
  !*** ./app/js/conf/configuration.ts ***!
  \**************************************/
/*! exports provided: Configuration */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Configuration\", function() { return Configuration; });\nclass Configuration {\n    constructor() {\n        this._players = [];\n        this._phases = [];\n        this._eventListeners = {\n            pieceActivation: this.activatePiece.bind(this)\n        };\n        this.acitvePiece = null;\n    }\n    activatePiece(e) {\n        const activePhase = this.phases.find((phase) => phase.active);\n        activePhase.activatePiece(e);\n    }\n    static get instance() {\n        if (!Configuration._instance) {\n            Configuration._instance = new Configuration();\n        }\n        return Configuration._instance;\n    }\n    get players() {\n        return this._players;\n    }\n    get phases() {\n        return this._phases;\n    }\n    get eventListeners() {\n        return this._eventListeners;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvanMvY29uZi9jb25maWd1cmF0aW9uLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vYXBwL2pzL2NvbmYvY29uZmlndXJhdGlvbi50cz82OWNiIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fcGxheWVycyA9IFtdO1xuICAgICAgICB0aGlzLl9waGFzZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnMgPSB7XG4gICAgICAgICAgICBwaWVjZUFjdGl2YXRpb246IHRoaXMuYWN0aXZhdGVQaWVjZS5iaW5kKHRoaXMpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWNpdHZlUGllY2UgPSBudWxsO1xuICAgIH1cbiAgICBhY3RpdmF0ZVBpZWNlKGUpIHtcbiAgICAgICAgY29uc3QgYWN0aXZlUGhhc2UgPSB0aGlzLnBoYXNlcy5maW5kKChwaGFzZSkgPT4gcGhhc2UuYWN0aXZlKTtcbiAgICAgICAgYWN0aXZlUGhhc2UuYWN0aXZhdGVQaWVjZShlKTtcbiAgICB9XG4gICAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKCFDb25maWd1cmF0aW9uLl9pbnN0YW5jZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5faW5zdGFuY2UgPSBuZXcgQ29uZmlndXJhdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDb25maWd1cmF0aW9uLl9pbnN0YW5jZTtcbiAgICB9XG4gICAgZ2V0IHBsYXllcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wbGF5ZXJzO1xuICAgIH1cbiAgICBnZXQgcGhhc2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGhhc2VzO1xuICAgIH1cbiAgICBnZXQgZXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudExpc3RlbmVycztcbiAgICB9XG59XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./app/js/conf/configuration.ts\n");

/***/ }),

/***/ "./app/js/conf/helper.ts":
/*!*******************************!*\
  !*** ./app/js/conf/helper.ts ***!
  \*******************************/
/*! exports provided: Helper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Helper\", function() { return Helper; });\nclass Helper {\n    static upperCaseFirstLetter(str) {\n        const firstLetter = str.charAt(0).toUpperCase();\n        if (str.length === 1)\n            return firstLetter;\n        if (str.length > 1)\n            return firstLetter + str.slice(1);\n        return \"\";\n    }\n    static create(element) {\n        const newElement = document.createElement(element.type);\n        if (element.id)\n            newElement.id = element.id;\n        if (element.class)\n            newElement.className = element.class;\n        if (element.text)\n            newElement.textContent = element.text;\n        if (element.area)\n            newElement.style.gridArea = element.area;\n        element.parent.appendChild(newElement);\n        return newElement;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvanMvY29uZi9oZWxwZXIudHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvanMvY29uZi9oZWxwZXIudHM/ZjRkYSJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgSGVscGVyIHtcbiAgICBzdGF0aWMgdXBwZXJDYXNlRmlyc3RMZXR0ZXIoc3RyKSB7XG4gICAgICAgIGNvbnN0IGZpcnN0TGV0dGVyID0gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBpZiAoc3RyLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICAgIHJldHVybiBmaXJzdExldHRlcjtcbiAgICAgICAgaWYgKHN0ci5sZW5ndGggPiAxKVxuICAgICAgICAgICAgcmV0dXJuIGZpcnN0TGV0dGVyICsgc3RyLnNsaWNlKDEpO1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShlbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IG5ld0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnQudHlwZSk7XG4gICAgICAgIGlmIChlbGVtZW50LmlkKVxuICAgICAgICAgICAgbmV3RWxlbWVudC5pZCA9IGVsZW1lbnQuaWQ7XG4gICAgICAgIGlmIChlbGVtZW50LmNsYXNzKVxuICAgICAgICAgICAgbmV3RWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzO1xuICAgICAgICBpZiAoZWxlbWVudC50ZXh0KVxuICAgICAgICAgICAgbmV3RWxlbWVudC50ZXh0Q29udGVudCA9IGVsZW1lbnQudGV4dDtcbiAgICAgICAgaWYgKGVsZW1lbnQuYXJlYSlcbiAgICAgICAgICAgIG5ld0VsZW1lbnQuc3R5bGUuZ3JpZEFyZWEgPSBlbGVtZW50LmFyZWE7XG4gICAgICAgIGVsZW1lbnQucGFyZW50LmFwcGVuZENoaWxkKG5ld0VsZW1lbnQpO1xuICAgICAgICByZXR1cm4gbmV3RWxlbWVudDtcbiAgICB9XG59XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./app/js/conf/helper.ts\n");

/***/ }),

/***/ "./app/js/conf/settings.ts":
/*!*********************************!*\
  !*** ./app/js/conf/settings.ts ***!
  \*********************************/
/*! exports provided: Settings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Settings\", function() { return Settings; });\nclass Settings {\n    constructor() {\n        this._piecesForEachPlayer = 3;\n        this._animationTime = \".5s\";\n    }\n    static get instance() {\n        if (!Settings._instance) {\n            Settings._instance = new Settings();\n        }\n        return Settings._instance;\n    }\n    get piecesForEachPlayer() {\n        return this._piecesForEachPlayer;\n    }\n    get animationTime() {\n        return this._animationTime;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvanMvY29uZi9zZXR0aW5ncy50cy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2FwcC9qcy9jb25mL3NldHRpbmdzLnRzPzBkZDUiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFNldHRpbmdzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fcGllY2VzRm9yRWFjaFBsYXllciA9IDM7XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvblRpbWUgPSBcIi41c1wiO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xuICAgICAgICBpZiAoIVNldHRpbmdzLl9pbnN0YW5jZSkge1xuICAgICAgICAgICAgU2V0dGluZ3MuX2luc3RhbmNlID0gbmV3IFNldHRpbmdzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNldHRpbmdzLl9pbnN0YW5jZTtcbiAgICB9XG4gICAgZ2V0IHBpZWNlc0ZvckVhY2hQbGF5ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9waWVjZXNGb3JFYWNoUGxheWVyO1xuICAgIH1cbiAgICBnZXQgYW5pbWF0aW9uVGltZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvblRpbWU7XG4gICAgfVxufVxuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./app/js/conf/settings.ts\n");

/***/ }),

/***/ "./app/js/game/game.ts":
/*!*****************************!*\
  !*** ./app/js/game/game.ts ***!
  \*****************************/
/*! exports provided: Game */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Game\", function() { return Game; });\n/* harmony import */ var _conf_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../conf/settings */ \"./app/js/conf/settings.ts\");\n/* harmony import */ var _conf_configuration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../conf/configuration */ \"./app/js/conf/configuration.ts\");\n/* harmony import */ var _move_states_game_move__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./move-states/game-move */ \"./app/js/game/move-states/game-move.ts\");\n\n\n\nclass Game {\n    constructor() {\n        this.settings = _conf_settings__WEBPACK_IMPORTED_MODULE_0__[\"Settings\"].instance;\n        this.conf = _conf_configuration__WEBPACK_IMPORTED_MODULE_1__[\"Configuration\"].instance;\n        this.gameTurn = new _move_states_game_move__WEBPACK_IMPORTED_MODULE_2__[\"GameMove\"]();\n    }\n    activatePlayer() {\n        const activePlayer = this.conf.players.find(player => player.active);\n        const inactivePlayer = this.conf.players.find(player => !player.active);\n        activePlayer.piecesContainerElement.classList.add(\"active\");\n        inactivePlayer.piecesContainerElement.classList.remove(\"active\");\n    }\n    activateGameTurn() {\n        this.gameTurn.state.enablePieceActivation();\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvanMvZ2FtZS9nYW1lLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vYXBwL2pzL2dhbWUvZ2FtZS50cz8wMTViIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL2NvbmYvc2V0dGluZ3NcIjtcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZi9jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBHYW1lTW92ZSB9IGZyb20gXCIuL21vdmUtc3RhdGVzL2dhbWUtbW92ZVwiO1xuZXhwb3J0IGNsYXNzIEdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gU2V0dGluZ3MuaW5zdGFuY2U7XG4gICAgICAgIHRoaXMuY29uZiA9IENvbmZpZ3VyYXRpb24uaW5zdGFuY2U7XG4gICAgICAgIHRoaXMuZ2FtZVR1cm4gPSBuZXcgR2FtZU1vdmUoKTtcbiAgICB9XG4gICAgYWN0aXZhdGVQbGF5ZXIoKSB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZVBsYXllciA9IHRoaXMuY29uZi5wbGF5ZXJzLmZpbmQocGxheWVyID0+IHBsYXllci5hY3RpdmUpO1xuICAgICAgICBjb25zdCBpbmFjdGl2ZVBsYXllciA9IHRoaXMuY29uZi5wbGF5ZXJzLmZpbmQocGxheWVyID0+ICFwbGF5ZXIuYWN0aXZlKTtcbiAgICAgICAgYWN0aXZlUGxheWVyLnBpZWNlc0NvbnRhaW5lckVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICAgICAgaW5hY3RpdmVQbGF5ZXIucGllY2VzQ29udGFpbmVyRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgIH1cbiAgICBhY3RpdmF0ZUdhbWVUdXJuKCkge1xuICAgICAgICB0aGlzLmdhbWVUdXJuLnN0YXRlLmVuYWJsZVBpZWNlQWN0aXZhdGlvbigpO1xuICAgIH1cbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./app/js/game/game.ts\n");

/***/ }),

/***/ "./app/js/game/move-states/game-move.ts":
/*!**********************************************!*\
  !*** ./app/js/game/move-states/game-move.ts ***!
  \**********************************************/
/*! exports provided: GameMove */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GameMove\", function() { return GameMove; });\n/* harmony import */ var _waiting_piece_activation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./waiting-piece-activation */ \"./app/js/game/move-states/waiting-piece-activation.ts\");\n/* harmony import */ var _piece_activated__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./piece-activated */ \"./app/js/game/move-states/piece-activated.ts\");\n\n\nclass GameMove {\n    constructor() {\n        this._state = {};\n        this.waitingPieceActivationState = new _waiting_piece_activation__WEBPACK_IMPORTED_MODULE_0__[\"WaitingPieceActivationState\"](this);\n        this.pieceActivatedState = new _piece_activated__WEBPACK_IMPORTED_MODULE_1__[\"PieceActivatedState\"](this);\n        this.initializeGameMove();\n    }\n    initializeGameMove() {\n        this.state = this.waitingPieceActivationState;\n    }\n    activatePiece() {\n        this.state = this.pieceActivatedState;\n    }\n    get state() {\n        return this._state;\n    }\n    set state(state) {\n        this._state = state;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvanMvZ2FtZS9tb3ZlLXN0YXRlcy9nYW1lLW1vdmUudHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvanMvZ2FtZS9tb3ZlLXN0YXRlcy9nYW1lLW1vdmUudHM/ZWMwZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBXYWl0aW5nUGllY2VBY3RpdmF0aW9uU3RhdGUgfSBmcm9tIFwiLi93YWl0aW5nLXBpZWNlLWFjdGl2YXRpb25cIjtcbmltcG9ydCB7IFBpZWNlQWN0aXZhdGVkU3RhdGUgfSBmcm9tIFwiLi9waWVjZS1hY3RpdmF0ZWRcIjtcbmV4cG9ydCBjbGFzcyBHYW1lTW92ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0ge307XG4gICAgICAgIHRoaXMud2FpdGluZ1BpZWNlQWN0aXZhdGlvblN0YXRlID0gbmV3IFdhaXRpbmdQaWVjZUFjdGl2YXRpb25TdGF0ZSh0aGlzKTtcbiAgICAgICAgdGhpcy5waWVjZUFjdGl2YXRlZFN0YXRlID0gbmV3IFBpZWNlQWN0aXZhdGVkU3RhdGUodGhpcyk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUdhbWVNb3ZlKCk7XG4gICAgfVxuICAgIGluaXRpYWxpemVHYW1lTW92ZSgpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMud2FpdGluZ1BpZWNlQWN0aXZhdGlvblN0YXRlO1xuICAgIH1cbiAgICBhY3RpdmF0ZVBpZWNlKCkge1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5waWVjZUFjdGl2YXRlZFN0YXRlO1xuICAgIH1cbiAgICBnZXQgc3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgICB9XG4gICAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgfVxufVxuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./app/js/game/move-states/game-move.ts\n");

/***/ }),

/***/ "./app/js/game/move-states/piece-activated.ts":
/*!****************************************************!*\
  !*** ./app/js/game/move-states/piece-activated.ts ***!
  \****************************************************/
/*! exports provided: PieceActivatedState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PieceActivatedState\", function() { return PieceActivatedState; });\n/* harmony import */ var _conf_configuration__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../conf/configuration */ \"./app/js/conf/configuration.ts\");\n\nclass PieceActivatedState {\n    constructor(gameMove) {\n        this.gameMove = gameMove;\n        this.conf = _conf_configuration__WEBPACK_IMPORTED_MODULE_0__[\"Configuration\"].instance;\n    }\n    enablePieceActivation() {\n        throw new Error(\"A piece is already activated!\");\n    }\n    enablePieceHighlight() {\n        console.log(\"enabling highlight...\");\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvanMvZ2FtZS9tb3ZlLXN0YXRlcy9waWVjZS1hY3RpdmF0ZWQudHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvanMvZ2FtZS9tb3ZlLXN0YXRlcy9waWVjZS1hY3RpdmF0ZWQudHM/MjRiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmYvY29uZmlndXJhdGlvblwiO1xuZXhwb3J0IGNsYXNzIFBpZWNlQWN0aXZhdGVkU3RhdGUge1xuICAgIGNvbnN0cnVjdG9yKGdhbWVNb3ZlKSB7XG4gICAgICAgIHRoaXMuZ2FtZU1vdmUgPSBnYW1lTW92ZTtcbiAgICAgICAgdGhpcy5jb25mID0gQ29uZmlndXJhdGlvbi5pbnN0YW5jZTtcbiAgICB9XG4gICAgZW5hYmxlUGllY2VBY3RpdmF0aW9uKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIHBpZWNlIGlzIGFscmVhZHkgYWN0aXZhdGVkIVwiKTtcbiAgICB9XG4gICAgZW5hYmxlUGllY2VIaWdobGlnaHQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZW5hYmxpbmcgaGlnaGxpZ2h0Li4uXCIpO1xuICAgIH1cbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./app/js/game/move-states/piece-activated.ts\n");

/***/ }),

/***/ "./app/js/game/move-states/waiting-piece-activation.ts":
/*!*************************************************************!*\
  !*** ./app/js/game/move-states/waiting-piece-activation.ts ***!
  \*************************************************************/
/*! exports provided: WaitingPieceActivationState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"WaitingPieceActivationState\", function() { return WaitingPieceActivationState; });\n/* harmony import */ var _conf_configuration__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../conf/configuration */ \"./app/js/conf/configuration.ts\");\n\nclass WaitingPieceActivationState {\n    constructor(gameMove) {\n        this.gameMove = gameMove;\n        this.conf = _conf_configuration__WEBPACK_IMPORTED_MODULE_0__[\"Configuration\"].instance;\n    }\n    enablePieceActivation() {\n        this.handlePieceEventListeners();\n        this.gameMove.activatePiece();\n    }\n    enablePieceHighlight() {\n        throw new Error(\"Cannot highlight a piece when it is not activated!\");\n    }\n    handlePieceEventListeners() {\n        const activePlayer = this.conf.players.find(player => player.active);\n        const inactivePlayer = this.conf.players.find(player => !player.active);\n        activePlayer.pieces.forEach(piece => {\n            if (!piece.movedToTable) {\n                piece.element.addEventListener(\"click\", this.conf.eventListeners.pieceActivation);\n            }\n        });\n        inactivePlayer.pieces.forEach(piece => {\n            piece.element.removeEventListener(\"click\", this.conf.eventListeners.pieceActivation);\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvanMvZ2FtZS9tb3ZlLXN0YXRlcy93YWl0aW5nLXBpZWNlLWFjdGl2YXRpb24udHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvanMvZ2FtZS9tb3ZlLXN0YXRlcy93YWl0aW5nLXBpZWNlLWFjdGl2YXRpb24udHM/ZTY3NCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmYvY29uZmlndXJhdGlvblwiO1xuZXhwb3J0IGNsYXNzIFdhaXRpbmdQaWVjZUFjdGl2YXRpb25TdGF0ZSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZU1vdmUpIHtcbiAgICAgICAgdGhpcy5nYW1lTW92ZSA9IGdhbWVNb3ZlO1xuICAgICAgICB0aGlzLmNvbmYgPSBDb25maWd1cmF0aW9uLmluc3RhbmNlO1xuICAgIH1cbiAgICBlbmFibGVQaWVjZUFjdGl2YXRpb24oKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlUGllY2VFdmVudExpc3RlbmVycygpO1xuICAgICAgICB0aGlzLmdhbWVNb3ZlLmFjdGl2YXRlUGllY2UoKTtcbiAgICB9XG4gICAgZW5hYmxlUGllY2VIaWdobGlnaHQoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBoaWdobGlnaHQgYSBwaWVjZSB3aGVuIGl0IGlzIG5vdCBhY3RpdmF0ZWQhXCIpO1xuICAgIH1cbiAgICBoYW5kbGVQaWVjZUV2ZW50TGlzdGVuZXJzKCkge1xuICAgICAgICBjb25zdCBhY3RpdmVQbGF5ZXIgPSB0aGlzLmNvbmYucGxheWVycy5maW5kKHBsYXllciA9PiBwbGF5ZXIuYWN0aXZlKTtcbiAgICAgICAgY29uc3QgaW5hY3RpdmVQbGF5ZXIgPSB0aGlzLmNvbmYucGxheWVycy5maW5kKHBsYXllciA9PiAhcGxheWVyLmFjdGl2ZSk7XG4gICAgICAgIGFjdGl2ZVBsYXllci5waWVjZXMuZm9yRWFjaChwaWVjZSA9PiB7XG4gICAgICAgICAgICBpZiAoIXBpZWNlLm1vdmVkVG9UYWJsZSkge1xuICAgICAgICAgICAgICAgIHBpZWNlLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY29uZi5ldmVudExpc3RlbmVycy5waWVjZUFjdGl2YXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaW5hY3RpdmVQbGF5ZXIucGllY2VzLmZvckVhY2gocGllY2UgPT4ge1xuICAgICAgICAgICAgcGllY2UuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5jb25mLmV2ZW50TGlzdGVuZXJzLnBpZWNlQWN0aXZhdGlvbik7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./app/js/game/move-states/waiting-piece-activation.ts\n");

/***/ }),

/***/ "./app/js/game/phase-one.ts":
/*!**********************************!*\
  !*** ./app/js/game/phase-one.ts ***!
  \**********************************/
/*! exports provided: PhaseOne */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PhaseOne\", function() { return PhaseOne; });\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./app/js/game/game.ts\");\n\nclass PhaseOne extends _game__WEBPACK_IMPORTED_MODULE_0__[\"Game\"] {\n    constructor() {\n        super();\n        this.active = true;\n        this.phase = \"one\";\n    }\n    init() {\n        this.activatePlayer();\n        this.activateGameTurn();\n    }\n    activatePiece(e) {\n        const activePlayer = this.conf.players.find(player => player.active);\n        const activatedPiece = activePlayer.pieces.find(piece => piece.element === e.target);\n        this.conf.acitvePiece = activatedPiece;\n        this.gameTurn.state.enablePieceHighlight();\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvanMvZ2FtZS9waGFzZS1vbmUudHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvanMvZ2FtZS9waGFzZS1vbmUudHM/MTYzOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4vZ2FtZVwiO1xuZXhwb3J0IGNsYXNzIFBoYXNlT25lIGV4dGVuZHMgR2FtZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5waGFzZSA9IFwib25lXCI7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVQbGF5ZXIoKTtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZUdhbWVUdXJuKCk7XG4gICAgfVxuICAgIGFjdGl2YXRlUGllY2UoZSkge1xuICAgICAgICBjb25zdCBhY3RpdmVQbGF5ZXIgPSB0aGlzLmNvbmYucGxheWVycy5maW5kKHBsYXllciA9PiBwbGF5ZXIuYWN0aXZlKTtcbiAgICAgICAgY29uc3QgYWN0aXZhdGVkUGllY2UgPSBhY3RpdmVQbGF5ZXIucGllY2VzLmZpbmQocGllY2UgPT4gcGllY2UuZWxlbWVudCA9PT0gZS50YXJnZXQpO1xuICAgICAgICB0aGlzLmNvbmYuYWNpdHZlUGllY2UgPSBhY3RpdmF0ZWRQaWVjZTtcbiAgICAgICAgdGhpcy5nYW1lVHVybi5zdGF0ZS5lbmFibGVQaWVjZUhpZ2hsaWdodCgpO1xuICAgIH1cbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./app/js/game/phase-one.ts\n");

/***/ }),

/***/ "./app/js/game/phase-two.ts":
/*!**********************************!*\
  !*** ./app/js/game/phase-two.ts ***!
  \**********************************/
/*! exports provided: PhaseTwo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PhaseTwo\", function() { return PhaseTwo; });\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./app/js/game/game.ts\");\n\nclass PhaseTwo extends _game__WEBPACK_IMPORTED_MODULE_0__[\"Game\"] {\n    constructor() {\n        super();\n        this.active = false;\n        this.phase = \"two\";\n    }\n    activatePiece() {\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvanMvZ2FtZS9waGFzZS10d28udHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvanMvZ2FtZS9waGFzZS10d28udHM/NTU4MyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4vZ2FtZVwiO1xuZXhwb3J0IGNsYXNzIFBoYXNlVHdvIGV4dGVuZHMgR2FtZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGhhc2UgPSBcInR3b1wiO1xuICAgIH1cbiAgICBhY3RpdmF0ZVBpZWNlKCkge1xuICAgIH1cbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./app/js/game/phase-two.ts\n");

/***/ }),

/***/ "./app/js/players/piece.ts":
/*!*********************************!*\
  !*** ./app/js/players/piece.ts ***!
  \*********************************/
/*! exports provided: Piece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Piece\", function() { return Piece; });\nclass Piece {\n    constructor(id, player, element) {\n        this.active = false;\n        this.movedToTable = false;\n        this.partOfThreeInRow = false;\n        this._area = \"\";\n        this.player = player;\n        this.id = id;\n        this.element = element;\n    }\n    get area() {\n        return this._area;\n    }\n    set area(areaStr) {\n        if (areaStr.length === 3 &&\n            areaStr[0] === \"a\" &&\n            +areaStr[1] >= 1 && +areaStr[1] <= 5 &&\n            +areaStr[2] >= 1 && +areaStr[2] <= 6) {\n            this._area = areaStr;\n        }\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvanMvcGxheWVycy9waWVjZS50cy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2FwcC9qcy9wbGF5ZXJzL3BpZWNlLnRzPzJiMDIiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFBpZWNlIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgcGxheWVyLCBlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubW92ZWRUb1RhYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGFydE9mVGhyZWVJblJvdyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hcmVhID0gXCJcIjtcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB9XG4gICAgZ2V0IGFyZWEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcmVhO1xuICAgIH1cbiAgICBzZXQgYXJlYShhcmVhU3RyKSB7XG4gICAgICAgIGlmIChhcmVhU3RyLmxlbmd0aCA9PT0gMyAmJlxuICAgICAgICAgICAgYXJlYVN0clswXSA9PT0gXCJhXCIgJiZcbiAgICAgICAgICAgICthcmVhU3RyWzFdID49IDEgJiYgK2FyZWFTdHJbMV0gPD0gNSAmJlxuICAgICAgICAgICAgK2FyZWFTdHJbMl0gPj0gMSAmJiArYXJlYVN0clsyXSA8PSA2KSB7XG4gICAgICAgICAgICB0aGlzLl9hcmVhID0gYXJlYVN0cjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./app/js/players/piece.ts\n");

/***/ }),

/***/ "./app/js/players/player.ts":
/*!**********************************!*\
  !*** ./app/js/players/player.ts ***!
  \**********************************/
/*! exports provided: Player */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Player\", function() { return Player; });\n/* harmony import */ var _conf_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../conf/helper */ \"./app/js/conf/helper.ts\");\n/* harmony import */ var _conf_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../conf/settings */ \"./app/js/conf/settings.ts\");\n/* harmony import */ var _piece__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./piece */ \"./app/js/players/piece.ts\");\n\n\n\nclass Player {\n    constructor(name, number, numberString) {\n        this.active = false;\n        this._pieces = [];\n        this.settings = _conf_settings__WEBPACK_IMPORTED_MODULE_1__[\"Settings\"].instance;\n        this.name = name;\n        this.number = number;\n        this.numberString = numberString;\n        this.numberStringUpperCase = _conf_helper__WEBPACK_IMPORTED_MODULE_0__[\"Helper\"].upperCaseFirstLetter(numberString);\n        this.piecesContainerElement = document.querySelector(`.player${this.numberStringUpperCase}.piecesContainer`);\n        this.createPieces();\n    }\n    createPieces() {\n        for (let pieceNumber = 1; pieceNumber <= this.settings.piecesForEachPlayer; pieceNumber++) {\n            const pieceId = `p${this.number}_${pieceNumber}`;\n            const pieceElement = _conf_helper__WEBPACK_IMPORTED_MODULE_0__[\"Helper\"].create({\n                type: \"div\", id: pieceId, class: \"piece\",\n                text: `${pieceNumber}`, area: pieceId,\n                parent: this.piecesContainerElement\n            });\n            this.pieces.push(new _piece__WEBPACK_IMPORTED_MODULE_2__[\"Piece\"](pieceId, this, pieceElement));\n        }\n    }\n    get pieces() {\n        return this._pieces;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvanMvcGxheWVycy9wbGF5ZXIudHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvanMvcGxheWVycy9wbGF5ZXIudHM/OTQzNCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIZWxwZXIgfSBmcm9tIFwiLi4vY29uZi9oZWxwZXJcIjtcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL2NvbmYvc2V0dGluZ3NcIjtcbmltcG9ydCB7IFBpZWNlIH0gZnJvbSBcIi4vcGllY2VcIjtcbmV4cG9ydCBjbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIG51bWJlciwgbnVtYmVyU3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3BpZWNlcyA9IFtdO1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gU2V0dGluZ3MuaW5zdGFuY2U7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubnVtYmVyID0gbnVtYmVyO1xuICAgICAgICB0aGlzLm51bWJlclN0cmluZyA9IG51bWJlclN0cmluZztcbiAgICAgICAgdGhpcy5udW1iZXJTdHJpbmdVcHBlckNhc2UgPSBIZWxwZXIudXBwZXJDYXNlRmlyc3RMZXR0ZXIobnVtYmVyU3RyaW5nKTtcbiAgICAgICAgdGhpcy5waWVjZXNDb250YWluZXJFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnBsYXllciR7dGhpcy5udW1iZXJTdHJpbmdVcHBlckNhc2V9LnBpZWNlc0NvbnRhaW5lcmApO1xuICAgICAgICB0aGlzLmNyZWF0ZVBpZWNlcygpO1xuICAgIH1cbiAgICBjcmVhdGVQaWVjZXMoKSB7XG4gICAgICAgIGZvciAobGV0IHBpZWNlTnVtYmVyID0gMTsgcGllY2VOdW1iZXIgPD0gdGhpcy5zZXR0aW5ncy5waWVjZXNGb3JFYWNoUGxheWVyOyBwaWVjZU51bWJlcisrKSB7XG4gICAgICAgICAgICBjb25zdCBwaWVjZUlkID0gYHAke3RoaXMubnVtYmVyfV8ke3BpZWNlTnVtYmVyfWA7XG4gICAgICAgICAgICBjb25zdCBwaWVjZUVsZW1lbnQgPSBIZWxwZXIuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRpdlwiLCBpZDogcGllY2VJZCwgY2xhc3M6IFwicGllY2VcIixcbiAgICAgICAgICAgICAgICB0ZXh0OiBgJHtwaWVjZU51bWJlcn1gLCBhcmVhOiBwaWVjZUlkLFxuICAgICAgICAgICAgICAgIHBhcmVudDogdGhpcy5waWVjZXNDb250YWluZXJFbGVtZW50XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMucGllY2VzLnB1c2gobmV3IFBpZWNlKHBpZWNlSWQsIHRoaXMsIHBpZWNlRWxlbWVudCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBwaWVjZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9waWVjZXM7XG4gICAgfVxufVxuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./app/js/players/player.ts\n");

/***/ })

/******/ });