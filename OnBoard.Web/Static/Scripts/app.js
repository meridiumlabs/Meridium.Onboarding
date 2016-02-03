(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChallengeCards = (function () {
    function ChallengeCards(user) {
        _classCallCheck(this, ChallengeCards);

        this.user = user;
        this.registerClickEvent();
    }

    _createClass(ChallengeCards, [{
        key: "registerClickEvent",
        value: function registerClickEvent() {
            var self = this;
            var cards = document.getElementsByClassName("card");
            for (var i = 0; i < cards.length; i++) {
                (function () {
                    cards[i].addEventListener("click", function (e) {
                        e.preventDefault();

                        self.updateChallengeCard(this);
                        self.updateChallengeOnServer(this);
                    });
                    var card = cards[i];
                    var count = cards[i].getElementsByClassName('card-count--subtr');
                    if (count.length == 0) return;

                    count[0].addEventListener("click", function (e) {

                        e.preventDefault();
                        e.stopPropagation();

                        self.updateChallengeCardSubtract(card);
                        self.updateChallengeCardSubtractOnServer(card);
                    });
                })();
            }
        }
    }, {
        key: "updateChallengeCard",
        value: function updateChallengeCard(card) {

            var cardIsMarkedAsComplete = card.classList.contains("card--complete");
            var cardIsSingleOnly = card.classList.contains("card--single");
            var points = card.getAttribute('data-points');

            if (cardIsMarkedAsComplete && cardIsSingleOnly) {
                points = points * -1;
                card.classList.remove("card--complete");
            } else {
                card.classList.add("card--complete");
                if (!cardIsSingleOnly) {
                    var currentCount = card.getElementsByClassName('card-count--number')[0];
                    currentCount.textContent = parseInt(currentCount.textContent) + 1;
                }
            }

            var event = new CustomEvent("challengeCardSaved", { "detail": points });
            document.dispatchEvent(event);
        }
    }, {
        key: "updateChallengeCardSubtract",
        value: function updateChallengeCardSubtract(card) {
            var cardIsMarkedAsComplete = card.classList.contains("card--complete");

            var points = card.getAttribute('data-points');
            //if (cardIsMarkedAsComplete) {
            points = points * -1;
            //} else {
            //card.classList.add("card--complete");
            //}
            console.log(card);
            var currentCount = card.getElementsByClassName('card-count--number')[0];
            currentCount.textContent = parseInt(currentCount.textContent) - 1;
            var event = new CustomEvent("challengeCardSaved", { "detail": points });
            document.dispatchEvent(event);
        }
    }, {
        key: "updateChallengeOnServer",
        value: function updateChallengeOnServer(card) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'Home/ToggleChallenge');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status !== 200) {
                    //Something went wrong message.
                    // return to login form
                    var username = document.getElementById("user-hide").textContent;
                    window.location.href = "/Authentication?name=" + username;
                    return;
                }
            };
            xhr.send(JSON.stringify({
                id: card.getAttribute('data-id'),
                currentUser: this.user,
                single: card.classList.contains("card--single")
            }));
        }
    }, {
        key: "updateChallengeCardSubtractOnServer",
        value: function updateChallengeCardSubtractOnServer(card) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'Home/ToggleChallengeSubtract');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status !== 200) {
                    //Something went wrong message.
                    // return to login form
                    var username = document.getElementById("user-hide").textContent;
                    window.location.href = "/Authentication?name=" + username;
                    return;
                }
            };
            xhr.send(JSON.stringify({
                id: card.getAttribute('data-id'),
                currentUser: this.user
            }));
        }
    }]);

    return ChallengeCards;
})();

module.exports = ChallengeCards;

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var progressbar = require('progressbar.js');

var UserInfo = (function () {
    function UserInfo(user) {
        _classCallCheck(this, UserInfo);

        this.user = user;
        this.progressBar = new progressbar.Circle('#ProgressBarContainer', {
            color: '#ffffff',
            strokeWidth: 3,
            easing: 'easeInOut'
        });
        this.registerEvents();
    }

    _createClass(UserInfo, [{
        key: 'registerEvents',
        value: function registerEvents() {
            var _this = this;

            var event = new Event("challengeCardSaved");
            document.addEventListener("challengeCardSaved", function (event) {
                return _this.updateProgressBar(event.detail);
            });
        }
    }, {
        key: 'initProgressBar',
        value: function initProgressBar() {
            var currentPoints = parseFloat(document.getElementById('intro-score').textContent);
            var maxScore = parseFloat(document.getElementById('max-score').textContent);
            var progress = currentPoints / maxScore;
            this.progressBar.animate(progress);
        }
    }, {
        key: 'updateProgressBar',
        value: function updateProgressBar(points) {
            console.log(points);
            var scoreboard = document.getElementById('intro-score');
            var currentPoints = parseInt(scoreboard.textContent);

            var newScore = currentPoints + parseInt(points);
            scoreboard.textContent = newScore;
            var progress = parseFloat(scoreboard.textContent) / parseFloat(document.getElementById('max-score').textContent);
            this.progressBar.animate(progress);

            //update bonus rings
            if (newScore >= 100) {

                var level = document.getElementById('bonus-level-one');
                if (!level.classList.contains("fulfilled")) {
                    level.classList.add("fulfilled");
                }
            } else {

                var level = document.getElementById('bonus-level-one');
                if (level.classList.contains("fulfilled")) {
                    level.classList.remove("fulfilled");
                }
            }
            if (currentPoints >= 400) {

                var level = document.getElementById('bonus-level-two');
                if (!level.classList.contains("fulfilled")) {
                    level.classList.add("fulfilled");
                }
            } else {

                var level = document.getElementById('bonus-level-two');
                if (level.classList.contains("fulfilled")) {
                    level.classList.remove("fulfilled");
                }
            }

            if (currentPoints >= 800) {
                var level = document.getElementById('bonus-level-three');
                if (!level.classList.contains("fulfilled")) {
                    level.classList.add("fulfilled");
                }
            } else {
                var level = document.getElementById('bonus-level-three');
                if (level.classList.contains("fulfilled")) {
                    level.classList.remove("fulfilled");
                }
            }
            if (currentPoints >= 1300) {
                var level = document.getElementById('bonus-level-four');
                if (!level.classList.contains("fulfilled")) {
                    level.classList.add("fulfilled");
                }
            } else {
                var level = document.getElementById('bonus-level-four');
                if (level.classList.contains("fulfilled")) {
                    level.classList.remove("fulfilled");
                }
            }
            if (currentPoints >= 2000) {
                var level = document.getElementById('bonus-level-five');
                if (!level.classList.contains("fulfilled")) {
                    level.classList.add("fulfilled");
                }
            } else {
                var level = document.getElementById('bonus-level-five');
                if (level.classList.contains("fulfilled")) {
                    level.classList.remove("fulfilled");
                }
            }
        }
    }]);

    return UserInfo;
})();

module.exports = UserInfo;

},{"progressbar.js":7}],3:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _ModulesChallengeCards = require("./Modules/ChallengeCards");

var _ModulesChallengeCards2 = _interopRequireDefault(_ModulesChallengeCards);

var _ModulesUserInfo = require("./Modules/UserInfo");

var _ModulesUserInfo2 = _interopRequireDefault(_ModulesUserInfo);

document.addEventListener("DOMContentLoaded", function (event) {

    var username = document.getElementById("user-hide").textContent;

    var challengeCards = new _ModulesChallengeCards2["default"](username);
    var userInfo = new _ModulesUserInfo2["default"](username);

    userInfo.initProgressBar();

    var cards = document.getElementById('Cards');
});
/*var msnry = new Masonry( cards, {
  itemSelector: '.item',
  columnWidth: 220
});*/

},{"./Modules/ChallengeCards":1,"./Modules/UserInfo":2}],4:[function(require,module,exports){
/*! shifty - v1.2.2 - 2014-10-09 - http://jeremyckahn.github.io/shifty */
;(function (root) {

/*!
 * Shifty Core
 * By Jeremy Kahn - jeremyckahn@gmail.com
 */

// UglifyJS define hack.  Used for unit testing.  Contents of this if are
// compiled away.
if (typeof SHIFTY_DEBUG_NOW === 'undefined') {
  SHIFTY_DEBUG_NOW = function () {
    return +new Date();
  };
}

var Tweenable = (function () {

  'use strict';

  // Aliases that get defined later in this function
  var formula;

  // CONSTANTS
  var DEFAULT_SCHEDULE_FUNCTION;
  var DEFAULT_EASING = 'linear';
  var DEFAULT_DURATION = 500;
  var UPDATE_TIME = 1000 / 60;

  var _now = Date.now
       ? Date.now
       : function () {return +new Date();};

  var now = SHIFTY_DEBUG_NOW
       ? SHIFTY_DEBUG_NOW
       : _now;

  if (typeof window !== 'undefined') {
    // requestAnimationFrame() shim by Paul Irish (modified for Shifty)
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    DEFAULT_SCHEDULE_FUNCTION = window.requestAnimationFrame
       || window.webkitRequestAnimationFrame
       || window.oRequestAnimationFrame
       || window.msRequestAnimationFrame
       || (window.mozCancelRequestAnimationFrame
       && window.mozRequestAnimationFrame)
       || setTimeout;
  } else {
    DEFAULT_SCHEDULE_FUNCTION = setTimeout;
  }

  function noop () {
    // NOOP!
  }

  /*!
   * Handy shortcut for doing a for-in loop. This is not a "normal" each
   * function, it is optimized for Shifty.  The iterator function only receives
   * the property name, not the value.
   * @param {Object} obj
   * @param {Function(string)} fn
   */
  function each (obj, fn) {
    var key;
    for (key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        fn(key);
      }
    }
  }

  /*!
   * Perform a shallow copy of Object properties.
   * @param {Object} targetObject The object to copy into
   * @param {Object} srcObject The object to copy from
   * @return {Object} A reference to the augmented `targetObj` Object
   */
  function shallowCopy (targetObj, srcObj) {
    each(srcObj, function (prop) {
      targetObj[prop] = srcObj[prop];
    });

    return targetObj;
  }

  /*!
   * Copies each property from src onto target, but only if the property to
   * copy to target is undefined.
   * @param {Object} target Missing properties in this Object are filled in
   * @param {Object} src
   */
  function defaults (target, src) {
    each(src, function (prop) {
      if (typeof target[prop] === 'undefined') {
        target[prop] = src[prop];
      }
    });
  }

  /*!
   * Calculates the interpolated tween values of an Object for a given
   * timestamp.
   * @param {Number} forPosition The position to compute the state for.
   * @param {Object} currentState Current state properties.
   * @param {Object} originalState: The original state properties the Object is
   * tweening from.
   * @param {Object} targetState: The destination state properties the Object
   * is tweening to.
   * @param {number} duration: The length of the tween in milliseconds.
   * @param {number} timestamp: The UNIX epoch time at which the tween began.
   * @param {Object} easing: This Object's keys must correspond to the keys in
   * targetState.
   */
  function tweenProps (forPosition, currentState, originalState, targetState,
    duration, timestamp, easing) {
    var normalizedPosition = (forPosition - timestamp) / duration;

    var prop;
    for (prop in currentState) {
      if (currentState.hasOwnProperty(prop)) {
        currentState[prop] = tweenProp(originalState[prop],
          targetState[prop], formula[easing[prop]], normalizedPosition);
      }
    }

    return currentState;
  }

  /*!
   * Tweens a single property.
   * @param {number} start The value that the tween started from.
   * @param {number} end The value that the tween should end at.
   * @param {Function} easingFunc The easing curve to apply to the tween.
   * @param {number} position The normalized position (between 0.0 and 1.0) to
   * calculate the midpoint of 'start' and 'end' against.
   * @return {number} The tweened value.
   */
  function tweenProp (start, end, easingFunc, position) {
    return start + (end - start) * easingFunc(position);
  }

  /*!
   * Applies a filter to Tweenable instance.
   * @param {Tweenable} tweenable The `Tweenable` instance to call the filter
   * upon.
   * @param {String} filterName The name of the filter to apply.
   */
  function applyFilter (tweenable, filterName) {
    var filters = Tweenable.prototype.filter;
    var args = tweenable._filterArgs;

    each(filters, function (name) {
      if (typeof filters[name][filterName] !== 'undefined') {
        filters[name][filterName].apply(tweenable, args);
      }
    });
  }

  var timeoutHandler_endTime;
  var timeoutHandler_currentTime;
  var timeoutHandler_isEnded;
  /*!
   * Handles the update logic for one step of a tween.
   * @param {Tweenable} tweenable
   * @param {number} timestamp
   * @param {number} duration
   * @param {Object} currentState
   * @param {Object} originalState
   * @param {Object} targetState
   * @param {Object} easing
   * @param {Function} step
   * @param {Function(Function,number)}} schedule
   */
  function timeoutHandler (tweenable, timestamp, duration, currentState,
    originalState, targetState, easing, step, schedule) {
    timeoutHandler_endTime = timestamp + duration;
    timeoutHandler_currentTime = Math.min(now(), timeoutHandler_endTime);
    timeoutHandler_isEnded = timeoutHandler_currentTime >= timeoutHandler_endTime;

    if (tweenable.isPlaying() && !timeoutHandler_isEnded) {
      schedule(tweenable._timeoutHandler, UPDATE_TIME);

      applyFilter(tweenable, 'beforeTween');
      tweenProps(timeoutHandler_currentTime, currentState, originalState,
        targetState, duration, timestamp, easing);
      applyFilter(tweenable, 'afterTween');

      step(currentState);
    } else if (timeoutHandler_isEnded) {
      step(targetState);
      tweenable.stop(true);
    }
  }


  /*!
   * Creates a usable easing Object from either a string or another easing
   * Object.  If `easing` is an Object, then this function clones it and fills
   * in the missing properties with "linear".
   * @param {Object} fromTweenParams
   * @param {Object|string} easing
   */
  function composeEasingObject (fromTweenParams, easing) {
    var composedEasing = {};

    if (typeof easing === 'string') {
      each(fromTweenParams, function (prop) {
        composedEasing[prop] = easing;
      });
    } else {
      each(fromTweenParams, function (prop) {
        if (!composedEasing[prop]) {
          composedEasing[prop] = easing[prop] || DEFAULT_EASING;
        }
      });
    }

    return composedEasing;
  }

  /**
   * Tweenable constructor.
   * @param {Object=} opt_initialState The values that the initial tween should start at if a "from" object is not provided to Tweenable#tween.
   * @param {Object=} opt_config See Tweenable.prototype.setConfig()
   * @constructor
   */
  function Tweenable (opt_initialState, opt_config) {
    this._currentState = opt_initialState || {};
    this._configured = false;
    this._scheduleFunction = DEFAULT_SCHEDULE_FUNCTION;

    // To prevent unnecessary calls to setConfig do not set default configuration here.
    // Only set default configuration immediately before tweening if none has been set.
    if (typeof opt_config !== 'undefined') {
      this.setConfig(opt_config);
    }
  }

  /**
   * Configure and start a tween.
   * @param {Object=} opt_config See Tweenable.prototype.setConfig()
   * @return {Tweenable}
   */
  Tweenable.prototype.tween = function (opt_config) {
    if (this._isTweening) {
      return this;
    }

    // Only set default config if no configuration has been set previously and none is provided now.
    if (opt_config !== undefined || !this._configured) {
      this.setConfig(opt_config);
    }

    this._start(this.get());
    return this.resume();
  };

  /**
   * Sets the tween configuration. `config` may have the following options:
   *
   * - __from__ (_Object=_): Starting position.  If omitted, the current state is used.
   * - __to__ (_Object=_): Ending position.
   * - __duration__ (_number=_): How many milliseconds to animate for.
   * - __start__ (_Function(Object)=_): Function to execute when the tween begins.  Receives the state of the tween as the only parameter.
   * - __step__ (_Function(Object)=_): Function to execute on every tick.  Receives the state of the tween as the only parameter.  This function is not called on the final step of the animation, but `finish` is.
   * - __finish__ (_Function(Object)=_): Function to execute upon tween completion.  Receives the state of the tween as the only parameter.
   * - __easing__ (_Object|string=_): Easing curve name(s) to use for the tween.
   * @param {Object} config
   * @return {Tweenable}
   */
  Tweenable.prototype.setConfig = function (config) {
    config = config || {};
    this._configured = true;

    // Init the internal state
    this._pausedAtTime = null;
    this._start = config.start || noop;
    this._step = config.step || noop;
    this._finish = config.finish || noop;
    this._duration = config.duration || DEFAULT_DURATION;
    this._currentState = config.from || this.get();
    this._originalState = this.get();
    this._targetState = config.to || this.get();
    this._timestamp = now();

    // Aliases used below
    var currentState = this._currentState;
    var targetState = this._targetState;

    // Ensure that there is always something to tween to.
    defaults(targetState, currentState);

    this._easing = composeEasingObject(
      currentState, config.easing || DEFAULT_EASING);

    this._filterArgs =
      [currentState, this._originalState, targetState, this._easing];

    applyFilter(this, 'tweenCreated');
    return this;
  };

  /**
   * Gets the current state.
   * @return {Object}
   */
  Tweenable.prototype.get = function () {
    return shallowCopy({}, this._currentState);
  };

  /**
   * Sets the current state.
   * @param {Object} state
   */
  Tweenable.prototype.set = function (state) {
    this._currentState = state;
  };

  /**
   * Pauses a tween.  Paused tweens can be resumed from the point at which they were paused.  This is different than [`stop()`](#stop), as that method causes a tween to start over when it is resumed.
   * @return {Tweenable}
   */
  Tweenable.prototype.pause = function () {
    this._pausedAtTime = now();
    this._isPaused = true;
    return this;
  };

  /**
   * Resumes a paused tween.
   * @return {Tweenable}
   */
  Tweenable.prototype.resume = function () {
    if (this._isPaused) {
      this._timestamp += now() - this._pausedAtTime;
    }

    this._isPaused = false;
    this._isTweening = true;

    var self = this;
    this._timeoutHandler = function () {
      timeoutHandler(self, self._timestamp, self._duration, self._currentState,
        self._originalState, self._targetState, self._easing, self._step,
        self._scheduleFunction);
    };

    this._timeoutHandler();

    return this;
  };

  /**
   * Stops and cancels a tween.
   * @param {boolean=} gotoEnd If false or omitted, the tween just stops at its current state, and the "finish" handler is not invoked.  If true, the tweened object's values are instantly set to the target values, and "finish" is invoked.
   * @return {Tweenable}
   */
  Tweenable.prototype.stop = function (gotoEnd) {
    this._isTweening = false;
    this._isPaused = false;
    this._timeoutHandler = noop;

    if (gotoEnd) {
      shallowCopy(this._currentState, this._targetState);
      applyFilter(this, 'afterTweenEnd');
      this._finish.call(this, this._currentState);
    }

    return this;
  };

  /**
   * Returns whether or not a tween is running.
   * @return {boolean}
   */
  Tweenable.prototype.isPlaying = function () {
    return this._isTweening && !this._isPaused;
  };

  /**
   * Sets a custom schedule function.
   *
   * If a custom function is not set the default one is used [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame) if available, otherwise [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/Window.setTimeout)).
   *
   * @param {Function(Function,number)} scheduleFunction The function to be called to schedule the next frame to be rendered
   */
  Tweenable.prototype.setScheduleFunction = function (scheduleFunction) {
    this._scheduleFunction = scheduleFunction;
  };

  /**
   * `delete`s all "own" properties.  Call this when the `Tweenable` instance is no longer needed to free memory.
   */
  Tweenable.prototype.dispose = function () {
    var prop;
    for (prop in this) {
      if (this.hasOwnProperty(prop)) {
        delete this[prop];
      }
    }
  };

  /*!
   * Filters are used for transforming the properties of a tween at various
   * points in a Tweenable's life cycle.  See the README for more info on this.
   */
  Tweenable.prototype.filter = {};

  /*!
   * This object contains all of the tweens available to Shifty.  It is extendible - simply attach properties to the Tweenable.prototype.formula Object following the same format at linear.
   *
   * `pos` should be a normalized `number` (between 0 and 1).
   */
  Tweenable.prototype.formula = {
    linear: function (pos) {
      return pos;
    }
  };

  formula = Tweenable.prototype.formula;

  shallowCopy(Tweenable, {
    'now': now
    ,'each': each
    ,'tweenProps': tweenProps
    ,'tweenProp': tweenProp
    ,'applyFilter': applyFilter
    ,'shallowCopy': shallowCopy
    ,'defaults': defaults
    ,'composeEasingObject': composeEasingObject
  });

  // `root` is provided in the intro/outro files.

  // A hook used for unit testing.
  if (typeof SHIFTY_DEBUG_NOW === 'function') {
    root.timeoutHandler = timeoutHandler;
  }

  // Bootstrap Tweenable appropriately for the environment.
  if (typeof exports === 'object') {
    // CommonJS
    module.exports = Tweenable;
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(function () {return Tweenable;});
  } else if (typeof root.Tweenable === 'undefined') {
    // Browser: Make `Tweenable` globally accessible.
    root.Tweenable = Tweenable;
  }

  return Tweenable;

} ());

/*!
 * All equations are adapted from Thomas Fuchs' [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/penner.js).
 *
 * Based on Easing Equations (c) 2003 [Robert Penner](http://www.robertpenner.com/), all rights reserved. This work is [subject to terms](http://www.robertpenner.com/easing_terms_of_use.html).
 */

/*!
 *  TERMS OF USE - EASING EQUATIONS
 *  Open source under the BSD License.
 *  Easing Equations (c) 2003 Robert Penner, all rights reserved.
 */

;(function () {

  Tweenable.shallowCopy(Tweenable.prototype.formula, {
    easeInQuad: function (pos) {
      return Math.pow(pos, 2);
    },

    easeOutQuad: function (pos) {
      return -(Math.pow((pos - 1), 2) - 1);
    },

    easeInOutQuad: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,2);}
      return -0.5 * ((pos -= 2) * pos - 2);
    },

    easeInCubic: function (pos) {
      return Math.pow(pos, 3);
    },

    easeOutCubic: function (pos) {
      return (Math.pow((pos - 1), 3) + 1);
    },

    easeInOutCubic: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,3);}
      return 0.5 * (Math.pow((pos - 2),3) + 2);
    },

    easeInQuart: function (pos) {
      return Math.pow(pos, 4);
    },

    easeOutQuart: function (pos) {
      return -(Math.pow((pos - 1), 4) - 1);
    },

    easeInOutQuart: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,4);}
      return -0.5 * ((pos -= 2) * Math.pow(pos,3) - 2);
    },

    easeInQuint: function (pos) {
      return Math.pow(pos, 5);
    },

    easeOutQuint: function (pos) {
      return (Math.pow((pos - 1), 5) + 1);
    },

    easeInOutQuint: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,5);}
      return 0.5 * (Math.pow((pos - 2),5) + 2);
    },

    easeInSine: function (pos) {
      return -Math.cos(pos * (Math.PI / 2)) + 1;
    },

    easeOutSine: function (pos) {
      return Math.sin(pos * (Math.PI / 2));
    },

    easeInOutSine: function (pos) {
      return (-0.5 * (Math.cos(Math.PI * pos) - 1));
    },

    easeInExpo: function (pos) {
      return (pos === 0) ? 0 : Math.pow(2, 10 * (pos - 1));
    },

    easeOutExpo: function (pos) {
      return (pos === 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
    },

    easeInOutExpo: function (pos) {
      if (pos === 0) {return 0;}
      if (pos === 1) {return 1;}
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(2,10 * (pos - 1));}
      return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
    },

    easeInCirc: function (pos) {
      return -(Math.sqrt(1 - (pos * pos)) - 1);
    },

    easeOutCirc: function (pos) {
      return Math.sqrt(1 - Math.pow((pos - 1), 2));
    },

    easeInOutCirc: function (pos) {
      if ((pos /= 0.5) < 1) {return -0.5 * (Math.sqrt(1 - pos * pos) - 1);}
      return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
    },

    easeOutBounce: function (pos) {
      if ((pos) < (1 / 2.75)) {
        return (7.5625 * pos * pos);
      } else if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
      } else if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
      } else {
        return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
      }
    },

    easeInBack: function (pos) {
      var s = 1.70158;
      return (pos) * pos * ((s + 1) * pos - s);
    },

    easeOutBack: function (pos) {
      var s = 1.70158;
      return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
    },

    easeInOutBack: function (pos) {
      var s = 1.70158;
      if ((pos /= 0.5) < 1) {return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));}
      return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
    },

    elastic: function (pos) {
      return -1 * Math.pow(4,-8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
    },

    swingFromTo: function (pos) {
      var s = 1.70158;
      return ((pos /= 0.5) < 1) ? 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) :
          0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
    },

    swingFrom: function (pos) {
      var s = 1.70158;
      return pos * pos * ((s + 1) * pos - s);
    },

    swingTo: function (pos) {
      var s = 1.70158;
      return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
    },

    bounce: function (pos) {
      if (pos < (1 / 2.75)) {
        return (7.5625 * pos * pos);
      } else if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
      } else if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
      } else {
        return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
      }
    },

    bouncePast: function (pos) {
      if (pos < (1 / 2.75)) {
        return (7.5625 * pos * pos);
      } else if (pos < (2 / 2.75)) {
        return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
      } else if (pos < (2.5 / 2.75)) {
        return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
      } else {
        return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
      }
    },

    easeFromTo: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,4);}
      return -0.5 * ((pos -= 2) * Math.pow(pos,3) - 2);
    },

    easeFrom: function (pos) {
      return Math.pow(pos,4);
    },

    easeTo: function (pos) {
      return Math.pow(pos,0.25);
    }
  });

}());

/*!
 * The Bezier magic in this file is adapted/copied almost wholesale from
 * [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/cubic-bezier.js),
 * which was adapted from Apple code (which probably came from
 * [here](http://opensource.apple.com/source/WebCore/WebCore-955.66/platform/graphics/UnitBezier.h)).
 * Special thanks to Apple and Thomas Fuchs for much of this code.
 */

/*!
 *  Copyright (c) 2006 Apple Computer, Inc. All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *  1. Redistributions of source code must retain the above copyright notice,
 *  this list of conditions and the following disclaimer.
 *
 *  2. Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation
 *  and/or other materials provided with the distribution.
 *
 *  3. Neither the name of the copyright holder(s) nor the names of any
 *  contributors may be used to endorse or promote products derived from
 *  this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 *  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 *  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 *  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 *  ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
;(function () {
  // port of webkit cubic bezier handling by http://www.netzgesta.de/dev/
  function cubicBezierAtTime(t,p1x,p1y,p2x,p2y,duration) {
    var ax = 0,bx = 0,cx = 0,ay = 0,by = 0,cy = 0;
    function sampleCurveX(t) {return ((ax * t + bx) * t + cx) * t;}
    function sampleCurveY(t) {return ((ay * t + by) * t + cy) * t;}
    function sampleCurveDerivativeX(t) {return (3.0 * ax * t + 2.0 * bx) * t + cx;}
    function solveEpsilon(duration) {return 1.0 / (200.0 * duration);}
    function solve(x,epsilon) {return sampleCurveY(solveCurveX(x,epsilon));}
    function fabs(n) {if (n >= 0) {return n;}else {return 0 - n;}}
    function solveCurveX(x,epsilon) {
      var t0,t1,t2,x2,d2,i;
      for (t2 = x, i = 0; i < 8; i++) {x2 = sampleCurveX(t2) - x; if (fabs(x2) < epsilon) {return t2;} d2 = sampleCurveDerivativeX(t2); if (fabs(d2) < 1e-6) {break;} t2 = t2 - x2 / d2;}
      t0 = 0.0; t1 = 1.0; t2 = x; if (t2 < t0) {return t0;} if (t2 > t1) {return t1;}
      while (t0 < t1) {x2 = sampleCurveX(t2); if (fabs(x2 - x) < epsilon) {return t2;} if (x > x2) {t0 = t2;}else {t1 = t2;} t2 = (t1 - t0) * 0.5 + t0;}
      return t2; // Failure.
    }
    cx = 3.0 * p1x; bx = 3.0 * (p2x - p1x) - cx; ax = 1.0 - cx - bx; cy = 3.0 * p1y; by = 3.0 * (p2y - p1y) - cy; ay = 1.0 - cy - by;
    return solve(t, solveEpsilon(duration));
  }
  /*!
   *  getCubicBezierTransition(x1, y1, x2, y2) -> Function
   *
   *  Generates a transition easing function that is compatible
   *  with WebKit's CSS transitions `-webkit-transition-timing-function`
   *  CSS property.
   *
   *  The W3C has more information about
   *  <a href="http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag">
   *  CSS3 transition timing functions</a>.
   *
   *  @param {number} x1
   *  @param {number} y1
   *  @param {number} x2
   *  @param {number} y2
   *  @return {function}
   */
  function getCubicBezierTransition (x1, y1, x2, y2) {
    return function (pos) {
      return cubicBezierAtTime(pos,x1,y1,x2,y2,1);
    };
  }
  // End ported code

  /**
   * Creates a Bezier easing function and attaches it to `Tweenable.prototype.formula`.  This function gives you total control over the easing curve.  Matthew Lein's [Ceaser](http://matthewlein.com/ceaser/) is a useful tool for visualizing the curves you can make with this function.
   *
   * @param {string} name The name of the easing curve.  Overwrites the old easing function on Tweenable.prototype.formula if it exists.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @return {function} The easing function that was attached to Tweenable.prototype.formula.
   */
  Tweenable.setBezierFunction = function (name, x1, y1, x2, y2) {
    var cubicBezierTransition = getCubicBezierTransition(x1, y1, x2, y2);
    cubicBezierTransition.x1 = x1;
    cubicBezierTransition.y1 = y1;
    cubicBezierTransition.x2 = x2;
    cubicBezierTransition.y2 = y2;

    return Tweenable.prototype.formula[name] = cubicBezierTransition;
  };


  /**
   * `delete`s an easing function from `Tweenable.prototype.formula`.  Be careful with this method, as it `delete`s whatever easing formula matches `name` (which means you can delete default Shifty easing functions).
   *
   * @param {string} name The name of the easing function to delete.
   * @return {function}
   */
  Tweenable.unsetBezierFunction = function (name) {
    delete Tweenable.prototype.formula[name];
  };

})();

;(function () {

  function getInterpolatedValues (
    from, current, targetState, position, easing) {
    return Tweenable.tweenProps(
      position, current, from, targetState, 1, 0, easing);
  }

  // Fake a Tweenable and patch some internals.  This approach allows us to
  // skip uneccessary processing and object recreation, cutting down on garbage
  // collection pauses.
  var mockTweenable = new Tweenable();
  mockTweenable._filterArgs = [];

  /**
   * Compute the midpoint of two Objects.  This method effectively calculates a specific frame of animation that [Tweenable#tween](shifty.core.js.html#tween) does many times over the course of a tween.
   *
   * Example:
   *
   * ```
   *  var interpolatedValues = Tweenable.interpolate({
   *    width: '100px',
   *    opacity: 0,
   *    color: '#fff'
   *  }, {
   *    width: '200px',
   *    opacity: 1,
   *    color: '#000'
   *  }, 0.5);
   *
   *  console.log(interpolatedValues);
   *  // {opacity: 0.5, width: "150px", color: "rgb(127,127,127)"}
   * ```
   *
   * @param {Object} from The starting values to tween from.
   * @param {Object} targetState The ending values to tween to.
   * @param {number} position The normalized position value (between 0.0 and 1.0) to interpolate the values between `from` and `to` for.  `from` represents 0 and `to` represents `1`.
   * @param {string|Object} easing The easing curve(s) to calculate the midpoint against.  You can reference any easing function attached to `Tweenable.prototype.formula`.  If omitted, this defaults to "linear".
   * @return {Object}
   */
  Tweenable.interpolate = function (from, targetState, position, easing) {
    var current = Tweenable.shallowCopy({}, from);
    var easingObject = Tweenable.composeEasingObject(
      from, easing || 'linear');

    mockTweenable.set({});

    // Alias and reuse the _filterArgs array instead of recreating it.
    var filterArgs = mockTweenable._filterArgs;
    filterArgs.length = 0;
    filterArgs[0] = current;
    filterArgs[1] = from;
    filterArgs[2] = targetState;
    filterArgs[3] = easingObject;

    // Any defined value transformation must be applied
    Tweenable.applyFilter(mockTweenable, 'tweenCreated');
    Tweenable.applyFilter(mockTweenable, 'beforeTween');

    var interpolatedValues = getInterpolatedValues(
      from, current, targetState, position, easingObject);

    // Transform values back into their original format
    Tweenable.applyFilter(mockTweenable, 'afterTween');

    return interpolatedValues;
  };

}());

/**
 * Adds string interpolation support to Shifty.
 *
 * The Token extension allows Shifty to tween numbers inside of strings.  Among other things, this allows you to animate CSS properties.  For example, you can do this:
 *
 * ```
 * var tweenable = new Tweenable();
 * tweenable.tween({
 *   from: { transform: 'translateX(45px)'},
 *   to: { transform: 'translateX(90xp)'}
 * });
 * ```
 *
 * `translateX(45)` will be tweened to `translateX(90)`.  To demonstrate:
 *
 * ```
 * var tweenable = new Tweenable();
 * tweenable.tween({
 *   from: { transform: 'translateX(45px)'},
 *   to: { transform: 'translateX(90px)'},
 *   step: function (state) {
 *     console.log(state.transform);
 *   }
 * });
 * ```
 *
 * The above snippet will log something like this in the console:
 *
 * ```
 * translateX(60.3px)
 * ...
 * translateX(76.05px)
 * ...
 * translateX(90px)
 * ```
 *
 * Another use for this is animating colors:
 *
 * ```
 * var tweenable = new Tweenable();
 * tweenable.tween({
 *   from: { color: 'rgb(0,255,0)'},
 *   to: { color: 'rgb(255,0,255)'},
 *   step: function (state) {
 *     console.log(state.color);
 *   }
 * });
 * ```
 *
 * The above snippet will log something like this:
 *
 * ```
 * rgb(84,170,84)
 * ...
 * rgb(170,84,170)
 * ...
 * rgb(255,0,255)
 * ```
 *
 * This extension also supports hexadecimal colors, in both long (`#ff00ff`) and short (`#f0f`) forms.  Be aware that hexadecimal input values will be converted into the equivalent RGB output values.  This is done to optimize for performance.
 *
 * ```
 * var tweenable = new Tweenable();
 * tweenable.tween({
 *   from: { color: '#0f0'},
 *   to: { color: '#f0f'},
 *   step: function (state) {
 *     console.log(state.color);
 *   }
 * });
 * ```
 *
 * This snippet will generate the same output as the one before it because equivalent values were supplied (just in hexadecimal form rather than RGB):
 *
 * ```
 * rgb(84,170,84)
 * ...
 * rgb(170,84,170)
 * ...
 * rgb(255,0,255)
 * ```
 *
 * ## Easing support
 *
 * Easing works somewhat differently in the Token extension.  This is because some CSS properties have multiple values in them, and you might need to tween each value along its own easing curve.  A basic example:
 *
 * ```
 * var tweenable = new Tweenable();
 * tweenable.tween({
 *   from: { transform: 'translateX(0px) translateY(0px)'},
 *   to: { transform:   'translateX(100px) translateY(100px)'},
 *   easing: { transform: 'easeInQuad' },
 *   step: function (state) {
 *     console.log(state.transform);
 *   }
 * });
 * ```
 *
 * The above snippet create values like this:
 *
 * ```
 * translateX(11.560000000000002px) translateY(11.560000000000002px)
 * ...
 * translateX(46.24000000000001px) translateY(46.24000000000001px)
 * ...
 * translateX(100px) translateY(100px)
 * ```
 *
 * In this case, the values for `translateX` and `translateY` are always the same for each step of the tween, because they have the same start and end points and both use the same easing curve.  We can also tween `translateX` and `translateY` along independent curves:
 *
 * ```
 * var tweenable = new Tweenable();
 * tweenable.tween({
 *   from: { transform: 'translateX(0px) translateY(0px)'},
 *   to: { transform:   'translateX(100px) translateY(100px)'},
 *   easing: { transform: 'easeInQuad bounce' },
 *   step: function (state) {
 *     console.log(state.transform);
 *   }
 * });
 * ```
 *
 * The above snippet create values like this:
 *
 * ```
 * translateX(10.89px) translateY(82.355625px)
 * ...
 * translateX(44.89000000000001px) translateY(86.73062500000002px)
 * ...
 * translateX(100px) translateY(100px)
 * ```
 *
 * `translateX` and `translateY` are not in sync anymore, because `easeInQuad` was specified for `translateX` and `bounce` for `translateY`.  Mixing and matching easing curves can make for some interesting motion in your animations.
 *
 * The order of the space-separated easing curves correspond the token values they apply to.  If there are more token values than easing curves listed, the last easing curve listed is used.
 */
function token () {
  // Functionality for this extension runs implicitly if it is loaded.
} /*!*/

// token function is defined above only so that dox-foundation sees it as
// documentation and renders it.  It is never used, and is optimized away at
// build time.

;(function (Tweenable) {

  /*!
   * @typedef {{
   *   formatString: string
   *   chunkNames: Array.<string>
   * }}
   */
  var formatManifest;

  // CONSTANTS

  var R_NUMBER_COMPONENT = /(\d|\-|\.)/;
  var R_FORMAT_CHUNKS = /([^\-0-9\.]+)/g;
  var R_UNFORMATTED_VALUES = /[0-9.\-]+/g;
  var R_RGB = new RegExp(
    'rgb\\(' + R_UNFORMATTED_VALUES.source +
    (/,\s*/.source) + R_UNFORMATTED_VALUES.source +
    (/,\s*/.source) + R_UNFORMATTED_VALUES.source + '\\)', 'g');
  var R_RGB_PREFIX = /^.*\(/;
  var R_HEX = /#([0-9]|[a-f]){3,6}/gi;
  var VALUE_PLACEHOLDER = 'VAL';

  // HELPERS

  var getFormatChunksFrom_accumulator = [];
  /*!
   * @param {Array.number} rawValues
   * @param {string} prefix
   *
   * @return {Array.<string>}
   */
  function getFormatChunksFrom (rawValues, prefix) {
    getFormatChunksFrom_accumulator.length = 0;

    var rawValuesLength = rawValues.length;
    var i;

    for (i = 0; i < rawValuesLength; i++) {
      getFormatChunksFrom_accumulator.push('_' + prefix + '_' + i);
    }

    return getFormatChunksFrom_accumulator;
  }

  /*!
   * @param {string} formattedString
   *
   * @return {string}
   */
  function getFormatStringFrom (formattedString) {
    var chunks = formattedString.match(R_FORMAT_CHUNKS);

    if (!chunks) {
      // chunks will be null if there were no tokens to parse in
      // formattedString (for example, if formattedString is '2').  Coerce
      // chunks to be useful here.
      chunks = ['', ''];

      // If there is only one chunk, assume that the string is a number
      // followed by a token...
      // NOTE: This may be an unwise assumption.
    } else if (chunks.length === 1 ||
        // ...or if the string starts with a number component (".", "-", or a
        // digit)...
        formattedString[0].match(R_NUMBER_COMPONENT)) {
      // ...prepend an empty string here to make sure that the formatted number
      // is properly replaced by VALUE_PLACEHOLDER
      chunks.unshift('');
    }

    return chunks.join(VALUE_PLACEHOLDER);
  }

  /*!
   * Convert all hex color values within a string to an rgb string.
   *
   * @param {Object} stateObject
   *
   * @return {Object} The modified obj
   */
  function sanitizeObjectForHexProps (stateObject) {
    Tweenable.each(stateObject, function (prop) {
      var currentProp = stateObject[prop];

      if (typeof currentProp === 'string' && currentProp.match(R_HEX)) {
        stateObject[prop] = sanitizeHexChunksToRGB(currentProp);
      }
    });
  }

  /*!
   * @param {string} str
   *
   * @return {string}
   */
  function  sanitizeHexChunksToRGB (str) {
    return filterStringChunks(R_HEX, str, convertHexToRGB);
  }

  /*!
   * @param {string} hexString
   *
   * @return {string}
   */
  function convertHexToRGB (hexString) {
    var rgbArr = hexToRGBArray(hexString);
    return 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')';
  }

  var hexToRGBArray_returnArray = [];
  /*!
   * Convert a hexadecimal string to an array with three items, one each for
   * the red, blue, and green decimal values.
   *
   * @param {string} hex A hexadecimal string.
   *
   * @returns {Array.<number>} The converted Array of RGB values if `hex` is a
   * valid string, or an Array of three 0's.
   */
  function hexToRGBArray (hex) {

    hex = hex.replace(/#/, '');

    // If the string is a shorthand three digit hex notation, normalize it to
    // the standard six digit notation
    if (hex.length === 3) {
      hex = hex.split('');
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    hexToRGBArray_returnArray[0] = hexToDec(hex.substr(0, 2));
    hexToRGBArray_returnArray[1] = hexToDec(hex.substr(2, 2));
    hexToRGBArray_returnArray[2] = hexToDec(hex.substr(4, 2));

    return hexToRGBArray_returnArray;
  }

  /*!
   * Convert a base-16 number to base-10.
   *
   * @param {Number|String} hex The value to convert
   *
   * @returns {Number} The base-10 equivalent of `hex`.
   */
  function hexToDec (hex) {
    return parseInt(hex, 16);
  }

  /*!
   * Runs a filter operation on all chunks of a string that match a RegExp
   *
   * @param {RegExp} pattern
   * @param {string} unfilteredString
   * @param {function(string)} filter
   *
   * @return {string}
   */
  function filterStringChunks (pattern, unfilteredString, filter) {
    var pattenMatches = unfilteredString.match(pattern);
    var filteredString = unfilteredString.replace(pattern, VALUE_PLACEHOLDER);

    if (pattenMatches) {
      var pattenMatchesLength = pattenMatches.length;
      var currentChunk;

      for (var i = 0; i < pattenMatchesLength; i++) {
        currentChunk = pattenMatches.shift();
        filteredString = filteredString.replace(
          VALUE_PLACEHOLDER, filter(currentChunk));
      }
    }

    return filteredString;
  }

  /*!
   * Check for floating point values within rgb strings and rounds them.
   *
   * @param {string} formattedString
   *
   * @return {string}
   */
  function sanitizeRGBChunks (formattedString) {
    return filterStringChunks(R_RGB, formattedString, sanitizeRGBChunk);
  }

  /*!
   * @param {string} rgbChunk
   *
   * @return {string}
   */
  function sanitizeRGBChunk (rgbChunk) {
    var numbers = rgbChunk.match(R_UNFORMATTED_VALUES);
    var numbersLength = numbers.length;
    var sanitizedString = rgbChunk.match(R_RGB_PREFIX)[0];

    for (var i = 0; i < numbersLength; i++) {
      sanitizedString += parseInt(numbers[i], 10) + ',';
    }

    sanitizedString = sanitizedString.slice(0, -1) + ')';

    return sanitizedString;
  }

  /*!
   * @param {Object} stateObject
   *
   * @return {Object} An Object of formatManifests that correspond to
   * the string properties of stateObject
   */
  function getFormatManifests (stateObject) {
    var manifestAccumulator = {};

    Tweenable.each(stateObject, function (prop) {
      var currentProp = stateObject[prop];

      if (typeof currentProp === 'string') {
        var rawValues = getValuesFrom(currentProp);

        manifestAccumulator[prop] = {
          'formatString': getFormatStringFrom(currentProp)
          ,'chunkNames': getFormatChunksFrom(rawValues, prop)
        };
      }
    });

    return manifestAccumulator;
  }

  /*!
   * @param {Object} stateObject
   * @param {Object} formatManifests
   */
  function expandFormattedProperties (stateObject, formatManifests) {
    Tweenable.each(formatManifests, function (prop) {
      var currentProp = stateObject[prop];
      var rawValues = getValuesFrom(currentProp);
      var rawValuesLength = rawValues.length;

      for (var i = 0; i < rawValuesLength; i++) {
        stateObject[formatManifests[prop].chunkNames[i]] = +rawValues[i];
      }

      delete stateObject[prop];
    });
  }

  /*!
   * @param {Object} stateObject
   * @param {Object} formatManifests
   */
  function collapseFormattedProperties (stateObject, formatManifests) {
    Tweenable.each(formatManifests, function (prop) {
      var currentProp = stateObject[prop];
      var formatChunks = extractPropertyChunks(
        stateObject, formatManifests[prop].chunkNames);
      var valuesList = getValuesList(
        formatChunks, formatManifests[prop].chunkNames);
      currentProp = getFormattedValues(
        formatManifests[prop].formatString, valuesList);
      stateObject[prop] = sanitizeRGBChunks(currentProp);
    });
  }

  /*!
   * @param {Object} stateObject
   * @param {Array.<string>} chunkNames
   *
   * @return {Object} The extracted value chunks.
   */
  function extractPropertyChunks (stateObject, chunkNames) {
    var extractedValues = {};
    var currentChunkName, chunkNamesLength = chunkNames.length;

    for (var i = 0; i < chunkNamesLength; i++) {
      currentChunkName = chunkNames[i];
      extractedValues[currentChunkName] = stateObject[currentChunkName];
      delete stateObject[currentChunkName];
    }

    return extractedValues;
  }

  var getValuesList_accumulator = [];
  /*!
   * @param {Object} stateObject
   * @param {Array.<string>} chunkNames
   *
   * @return {Array.<number>}
   */
  function getValuesList (stateObject, chunkNames) {
    getValuesList_accumulator.length = 0;
    var chunkNamesLength = chunkNames.length;

    for (var i = 0; i < chunkNamesLength; i++) {
      getValuesList_accumulator.push(stateObject[chunkNames[i]]);
    }

    return getValuesList_accumulator;
  }

  /*!
   * @param {string} formatString
   * @param {Array.<number>} rawValues
   *
   * @return {string}
   */
  function getFormattedValues (formatString, rawValues) {
    var formattedValueString = formatString;
    var rawValuesLength = rawValues.length;

    for (var i = 0; i < rawValuesLength; i++) {
      formattedValueString = formattedValueString.replace(
        VALUE_PLACEHOLDER, +rawValues[i].toFixed(4));
    }

    return formattedValueString;
  }

  /*!
   * Note: It's the duty of the caller to convert the Array elements of the
   * return value into numbers.  This is a performance optimization.
   *
   * @param {string} formattedString
   *
   * @return {Array.<string>|null}
   */
  function getValuesFrom (formattedString) {
    return formattedString.match(R_UNFORMATTED_VALUES);
  }

  /*!
   * @param {Object} easingObject
   * @param {Object} tokenData
   */
  function expandEasingObject (easingObject, tokenData) {
    Tweenable.each(tokenData, function (prop) {
      var currentProp = tokenData[prop];
      var chunkNames = currentProp.chunkNames;
      var chunkLength = chunkNames.length;
      var easingChunks = easingObject[prop].split(' ');
      var lastEasingChunk = easingChunks[easingChunks.length - 1];

      for (var i = 0; i < chunkLength; i++) {
        easingObject[chunkNames[i]] = easingChunks[i] || lastEasingChunk;
      }

      delete easingObject[prop];
    });
  }

  /*!
   * @param {Object} easingObject
   * @param {Object} tokenData
   */
  function collapseEasingObject (easingObject, tokenData) {
    Tweenable.each(tokenData, function (prop) {
      var currentProp = tokenData[prop];
      var chunkNames = currentProp.chunkNames;
      var chunkLength = chunkNames.length;
      var composedEasingString = '';

      for (var i = 0; i < chunkLength; i++) {
        composedEasingString += ' ' + easingObject[chunkNames[i]];
        delete easingObject[chunkNames[i]];
      }

      easingObject[prop] = composedEasingString.substr(1);
    });
  }

  Tweenable.prototype.filter.token = {
    'tweenCreated': function (currentState, fromState, toState, easingObject) {
      sanitizeObjectForHexProps(currentState);
      sanitizeObjectForHexProps(fromState);
      sanitizeObjectForHexProps(toState);
      this._tokenData = getFormatManifests(currentState);
    },

    'beforeTween': function (currentState, fromState, toState, easingObject) {
      expandEasingObject(easingObject, this._tokenData);
      expandFormattedProperties(currentState, this._tokenData);
      expandFormattedProperties(fromState, this._tokenData);
      expandFormattedProperties(toState, this._tokenData);
    },

    'afterTween': function (currentState, fromState, toState, easingObject) {
      collapseFormattedProperties(currentState, this._tokenData);
      collapseFormattedProperties(fromState, this._tokenData);
      collapseFormattedProperties(toState, this._tokenData);
      collapseEasingObject(easingObject, this._tokenData);
    }
  };

} (Tweenable));

}(this));

},{}],5:[function(require,module,exports){
// Circle shaped progress bar

var Shape = require('./shape');
var utils = require('./utils');


var Circle = function Circle(container, options) {
    // Use two arcs to form a circle
    // See this answer http://stackoverflow.com/a/10477334/1446092
    this._pathTemplate =
        'M 50,50 m 0,-{radius}' +
        ' a {radius},{radius} 0 1 1 0,{2radius}' +
        ' a {radius},{radius} 0 1 1 0,-{2radius}';

    Shape.apply(this, arguments);
};

Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;

Circle.prototype._pathString = function _pathString(opts) {
    var widthOfWider = opts.strokeWidth;
    if (opts.trailWidth && opts.trailWidth > opts.strokeWidth) {
        widthOfWider = opts.trailWidth;
    }

    var r = 50 - widthOfWider / 2;

    return utils.render(this._pathTemplate, {
        radius: r,
        '2radius': r * 2
    });
};

Circle.prototype._trailString = function _trailString(opts) {
    return this._pathString(opts);
};

module.exports = Circle;

},{"./shape":9,"./utils":11}],6:[function(require,module,exports){
// Line shaped progress bar

var Shape = require('./shape');
var utils = require('./utils');


var Line = function Line(container, options) {
    this._pathTemplate = 'M 0,{center} L 100,{center}';
    Shape.apply(this, arguments);
};

Line.prototype = new Shape();
Line.prototype.constructor = Line;

Line.prototype._initializeSvg = function _initializeSvg(svg, opts) {
    svg.setAttribute('viewBox', '0 0 100 ' + opts.strokeWidth);
    svg.setAttribute('preserveAspectRatio', 'none');
};

Line.prototype._pathString = function _pathString(opts) {
    return utils.render(this._pathTemplate, {
        center: opts.strokeWidth / 2
    });
};

Line.prototype._trailString = function _trailString(opts) {
    return this._pathString(opts);
};

module.exports = Line;

},{"./shape":9,"./utils":11}],7:[function(require,module,exports){
// Different shaped progress bars
var Line = require('./line');
var Circle = require('./circle');
var Square = require('./square');

// Lower level API to use any SVG path
var Path = require('./path');


module.exports = {
    Line: Line,
    Circle: Circle,
    Square: Square,
    Path: Path
};

},{"./circle":5,"./line":6,"./path":8,"./square":10}],8:[function(require,module,exports){
// Lower level API to animate any kind of svg path

var Tweenable = require('shifty');
var utils = require('./utils');

var EASING_ALIASES = {
    easeIn: 'easeInCubic',
    easeOut: 'easeOutCubic',
    easeInOut: 'easeInOutCubic'
};


var Path = function Path(path, opts) {
    // Default parameters for animation
    opts = utils.extend({
        duration: 800,
        easing: 'linear',
        from: {},
        to: {},
        step: function() {}
    }, opts);

    var element;
    if (utils.isString(path)) {
        element = document.querySelector(path);
    } else {
        element = path;
    }

    // Reveal .path as public attribute
    this.path = element;
    this._opts = opts;
    this._tweenable = null;

    // Set up the starting positions
    var length = this.path.getTotalLength();
    this.path.style.strokeDasharray = length + ' ' + length;
    this.set(0);
};

Path.prototype.value = function value() {
    var offset = this._getComputedDashOffset();
    var length = this.path.getTotalLength();

    var progress = 1 - offset / length;
    // Round number to prevent returning very small number like 1e-30, which
    // is practically 0
    return parseFloat(progress.toFixed(6), 10);
};

Path.prototype.set = function set(progress) {
    this.stop();

    this.path.style.strokeDashoffset = this._progressToOffset(progress);

    var step = this._opts.step;
    if (utils.isFunction(step)) {
        var easing = this._easing(this._opts.easing);
        var values = this._calculateTo(progress, easing);
        step(values, this._opts.shape||this, this._opts.attachment);
    }
};

Path.prototype.stop = function stop() {
    this._stopTween();
    this.path.style.strokeDashoffset = this._getComputedDashOffset();
};

// Method introduced here:
// http://jakearchibald.com/2013/animated-line-drawing-svg/
Path.prototype.animate = function animate(progress, opts, cb) {
    opts = opts || {};

    if (utils.isFunction(opts)) {
        cb = opts;
        opts = {};
    }

    var passedOpts = utils.extend({}, opts);

    // Copy default opts to new object so defaults are not modified
    var defaultOpts = utils.extend({}, this._opts);
    opts = utils.extend(defaultOpts, opts);

    var shiftyEasing = this._easing(opts.easing);
    var values = this._resolveFromAndTo(progress, shiftyEasing, passedOpts);

    this.stop();

    // Trigger a layout so styles are calculated & the browser
    // picks up the starting position before animating
    this.path.getBoundingClientRect();

    var offset = this._getComputedDashOffset();
    var newOffset = this._progressToOffset(progress);

    var self = this;
    this._tweenable = new Tweenable();
    this._tweenable.tween({
        from: utils.extend({ offset: offset }, values.from),
        to: utils.extend({ offset: newOffset }, values.to),
        duration: opts.duration,
        easing: shiftyEasing,
        step: function(state) {
            self.path.style.strokeDashoffset = state.offset;
            opts.step(state, opts.shape||self, opts.attachment);
        },
        finish: function(state) {
            if (utils.isFunction(cb)) {
                cb();
            }
        }
    });
};

Path.prototype._getComputedDashOffset = function _getComputedDashOffset() {
    var computedStyle = window.getComputedStyle(this.path, null);
    return parseFloat(computedStyle.getPropertyValue('stroke-dashoffset'), 10);
};

Path.prototype._progressToOffset = function _progressToOffset(progress) {
    var length = this.path.getTotalLength();
    return length - progress * length;
};

// Resolves from and to values for animation.
Path.prototype._resolveFromAndTo = function _resolveFromAndTo(progress, easing, opts) {
    if (opts.from && opts.to) {
        return {
            from: opts.from,
            to: opts.to
        };
    }

    return {
        from: this._calculateFrom(easing),
        to: this._calculateTo(progress, easing)
    };
};

// Calculate `from` values from options passed at initialization
Path.prototype._calculateFrom = function _calculateFrom(easing) {
    return Tweenable.interpolate(this._opts.from, this._opts.to, this.value(), easing);
};

// Calculate `to` values from options passed at initialization
Path.prototype._calculateTo = function _calculateTo(progress, easing) {
    return Tweenable.interpolate(this._opts.from, this._opts.to, progress, easing);
};

Path.prototype._stopTween = function _stopTween() {
    if (this._tweenable !== null) {
        this._tweenable.stop();
        this._tweenable.dispose();
        this._tweenable = null;
    }
};

Path.prototype._easing = function _easing(easing) {
    if (EASING_ALIASES.hasOwnProperty(easing)) {
        return EASING_ALIASES[easing];
    }

    return easing;
};

module.exports = Path;

},{"./utils":11,"shifty":4}],9:[function(require,module,exports){
// Base object for different progress bar shapes

var Path = require('./path');
var utils = require('./utils');

var DESTROYED_ERROR = 'Object is destroyed';


var Shape = function Shape(container, opts) {
    // Throw a better error if progress bars are not initialized with `new`
    // keyword
    if (!(this instanceof Shape)) {
        throw new Error('Constructor was called without new keyword');
    }

    // Prevent calling constructor without parameters so inheritance
    // works correctly. To understand, this is how Shape is inherited:
    //
    //   Line.prototype = new Shape();
    //
    // We just want to set the prototype for Line.
    if (arguments.length === 0) return;

    // Default parameters for progress bar creation
    this._opts = utils.extend({
        color: '#555',
        strokeWidth: 1.0,
        trailColor: null,
        trailWidth: null,
        fill: null,
        text: {
            autoStyle: true,
            color: null,
            value: '',
            className: 'progressbar-text'
        }
    }, opts, true);  // Use recursive extend

    var svgView = this._createSvgView(this._opts);

    var element;
    if (utils.isString(container)) {
        element = document.querySelector(container);
    } else {
        element = container;
    }

    if (!element) {
        throw new Error('Container does not exist: ' + container);
    }

    this._container = element;
    this._container.appendChild(svgView.svg);

    this.text = null;
    if (this._opts.text.value) {
        this.text = this._createTextElement(this._opts, this._container);
        this._container.appendChild(this.text);
    }

    // Expose public attributes before Path initialization
    this.svg = svgView.svg;
    this.path = svgView.path;
    this.trail = svgView.trail;
    // this.text is also a public attribute

    var newOpts = utils.extend({
        attachment: undefined,
        shape: this
    }, this._opts);
    this._progressPath = new Path(svgView.path, newOpts);
};

Shape.prototype.animate = function animate(progress, opts, cb) {
    if (this._progressPath === null) throw new Error(DESTROYED_ERROR);
    this._progressPath.animate(progress, opts, cb);
};

Shape.prototype.stop = function stop() {
    if (this._progressPath === null) throw new Error(DESTROYED_ERROR);
    // Don't crash if stop is called inside step function
    if (this._progressPath === undefined) return;

    this._progressPath.stop();
};

Shape.prototype.destroy = function destroy() {
    if (this._progressPath === null) throw new Error(DESTROYED_ERROR);

    this.stop();
    this.svg.parentNode.removeChild(this.svg);
    this.svg = null;
    this.path = null;
    this.trail = null;
    this._progressPath = null;

    if (this.text !== null) {
        this.text.parentNode.removeChild(this.text);
        this.text = null;
    }
};

Shape.prototype.set = function set(progress) {
    if (this._progressPath === null) throw new Error(DESTROYED_ERROR);
    this._progressPath.set(progress);
};

Shape.prototype.value = function value() {
    if (this._progressPath === null) throw new Error(DESTROYED_ERROR);
    if (this._progressPath === undefined) return 0;

    return this._progressPath.value();
};

Shape.prototype.setText = function setText(text) {
    if (this._progressPath === null) throw new Error(DESTROYED_ERROR);

    if (this.text === null) {
        // Create new text node
        this.text = this._createTextElement(this._opts, this._container);
        this._container.appendChild(this.text);
    }

    // Remove previous text node and add new
    this.text.removeChild(this.text.firstChild);
    this.text.appendChild(document.createTextNode(text));
};

Shape.prototype._createSvgView = function _createSvgView(opts) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._initializeSvg(svg, opts);

    var trailPath = null;
    // Each option listed in the if condition are 'triggers' for creating
    // the trail path
    if (opts.trailColor || opts.trailWidth) {
        trailPath = this._createTrail(opts);
        svg.appendChild(trailPath);
    }

    var path = this._createPath(opts);
    svg.appendChild(path);

    return {
        svg: svg,
        path: path,
        trail: trailPath
    };
};

Shape.prototype._initializeSvg = function _initializeSvg(svg, opts) {
    svg.setAttribute('viewBox', '0 0 100 100');
};

Shape.prototype._createPath = function _createPath(opts) {
    var pathString = this._pathString(opts);
    return this._createPathElement(pathString, opts);
};

Shape.prototype._createTrail = function _createTrail(opts) {
    // Create path string with original passed options
    var pathString = this._trailString(opts);

    // Prevent modifying original
    var newOpts = utils.extend({}, opts);

    // Defaults for parameters which modify trail path
    if (!newOpts.trailColor) newOpts.trailColor = '#eee';
    if (!newOpts.trailWidth) newOpts.trailWidth = newOpts.strokeWidth;

    newOpts.color = newOpts.trailColor;
    newOpts.strokeWidth = newOpts.trailWidth;

    // When trail path is set, fill must be set for it instead of the
    // actual path to prevent trail stroke from clipping
    newOpts.fill = null;

    return this._createPathElement(pathString, newOpts);
};

Shape.prototype._createPathElement = function _createPathElement(pathString, opts) {
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathString);
    path.setAttribute('stroke', opts.color);
    path.setAttribute('stroke-width', opts.strokeWidth);

    if (opts.fill) {
        path.setAttribute('fill', opts.fill);
    } else {
        path.setAttribute('fill-opacity', '0');
    }

    return path;
};

Shape.prototype._createTextElement = function _createTextElement(opts, container) {
    var element = document.createElement('p');
    element.appendChild(document.createTextNode(opts.text.value));

    if (opts.text.autoStyle) {
        // Center text
        container.style.position = 'relative';
        element.style.position = 'absolute';
        element.style.top = '50%';
        element.style.left = '50%';
        element.style.padding = 0;
        element.style.margin = 0;
        utils.setStyle(element, 'transform', 'translate(-50%, -50%)');

        if (opts.text.color) {
            element.style.color = opts.text.color;
        } else {
            element.style.color = opts.color;
        }
    }
    element.className = opts.text.className;

    return element;
};

Shape.prototype._pathString = function _pathString(opts) {
    throw new Error('Override this function for each progress bar');
};

Shape.prototype._trailString = function _trailString(opts) {
    throw new Error('Override this function for each progress bar');
};

module.exports = Shape;

},{"./path":8,"./utils":11}],10:[function(require,module,exports){
// Square shaped progress bar

var Shape = require('./shape');
var utils = require('./utils');


var Square = function Square(container, options) {
    this._pathTemplate =
        'M 0,{halfOfStrokeWidth}' +
        ' L {width},{halfOfStrokeWidth}' +
        ' L {width},{width}' +
        ' L {halfOfStrokeWidth},{width}' +
        ' L {halfOfStrokeWidth},{strokeWidth}';

    this._trailTemplate =
        'M {startMargin},{halfOfStrokeWidth}' +
        ' L {width},{halfOfStrokeWidth}' +
        ' L {width},{width}' +
        ' L {halfOfStrokeWidth},{width}' +
        ' L {halfOfStrokeWidth},{halfOfStrokeWidth}';

    Shape.apply(this, arguments);
};

Square.prototype = new Shape();
Square.prototype.constructor = Square;

Square.prototype._pathString = function _pathString(opts) {
    var w = 100 - opts.strokeWidth / 2;

    return utils.render(this._pathTemplate, {
        width: w,
        strokeWidth: opts.strokeWidth,
        halfOfStrokeWidth: opts.strokeWidth / 2
    });
};

Square.prototype._trailString = function _trailString(opts) {
    var w = 100 - opts.strokeWidth / 2;

    return utils.render(this._trailTemplate, {
        width: w,
        strokeWidth: opts.strokeWidth,
        halfOfStrokeWidth: opts.strokeWidth / 2,
        startMargin: (opts.strokeWidth / 2) - (opts.trailWidth / 2)
    });
};

module.exports = Square;

},{"./shape":9,"./utils":11}],11:[function(require,module,exports){
// Utility functions

var PREFIXES = 'Webkit Moz O ms'.split(' ');

// Copy all attributes from source object to destination object.
// destination object is mutated.
function extend(destination, source, recursive) {
    destination = destination || {};
    source = source || {};
    recursive = recursive || false;

    for (var attrName in source) {
        if (source.hasOwnProperty(attrName)) {
            var destVal = destination[attrName];
            var sourceVal = source[attrName];
            if (recursive && isObject(destVal) && isObject(sourceVal)) {
                destination[attrName] = extend(destVal, sourceVal, recursive);
            } else {
                destination[attrName] = sourceVal;
            }
        }
    }

    return destination;
}

// Renders templates with given variables. Variables must be surrounded with
// braces without any spaces, e.g. {variable}
// All instances of variable placeholders will be replaced with given content
// Example:
// render('Hello, {message}!', {message: 'world'})
function render(template, vars) {
    var rendered = template;

    for (var key in vars) {
        if (vars.hasOwnProperty(key)) {
            var val = vars[key];
            var regExpString = '\\{' + key + '\\}';
            var regExp = new RegExp(regExpString, 'g');

            rendered = rendered.replace(regExp, val);
        }
    }

    return rendered;
}

function setStyle(element, style, value) {
    for (var i = 0; i < PREFIXES.length; ++i) {
        var prefix = PREFIXES[i];
        element.style[prefix + capitalize(style)] = value;
    }

    element.style[style] = value;
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function isString(obj) {
    return typeof obj === 'string' || obj instanceof String;
}

function isFunction(obj) {
    return typeof obj === 'function';
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

// Returns true if `obj` is object as in {a: 1, b: 2}, not if it's function or
// array
function isObject(obj) {
    if (isArray(obj)) return false;

    var type = typeof obj;
    return type === 'object' && !!obj;
}


module.exports = {
    extend: extend,
    render: render,
    setStyle: setStyle,
    capitalize: capitalize,
    isString: isString,
    isFunction: isFunction,
    isObject: isObject
};

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9QZXJzb25hbC9NZXJpZGl1bS5DaGFsbGVuZ2VCb2FyZC9PbkJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvTW9kdWxlcy9DaGFsbGVuZ2VDYXJkcy5qcyIsIkM6L1BlcnNvbmFsL01lcmlkaXVtLkNoYWxsZW5nZUJvYXJkL09uQm9hcmQuV2ViL0NvbnRlbnQvU2NyaXB0cy9Nb2R1bGVzL1VzZXJJbmZvLmpzIiwiQzovUGVyc29uYWwvTWVyaWRpdW0uQ2hhbGxlbmdlQm9hcmQvT25Cb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL21haW4uanMiLCIuLi9PbkJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvbm9kZV9tb2R1bGVzL3Byb2dyZXNzYmFyLmpzL25vZGVfbW9kdWxlcy9zaGlmdHkvZGlzdC9zaGlmdHkuanMiLCIuLi9PbkJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvbm9kZV9tb2R1bGVzL3Byb2dyZXNzYmFyLmpzL3NyYy9jaXJjbGUuanMiLCIuLi9PbkJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvbm9kZV9tb2R1bGVzL3Byb2dyZXNzYmFyLmpzL3NyYy9saW5lLmpzIiwiLi4vT25Cb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL25vZGVfbW9kdWxlcy9wcm9ncmVzc2Jhci5qcy9zcmMvbWFpbi5qcyIsIi4uL09uQm9hcmQuV2ViL0NvbnRlbnQvU2NyaXB0cy9ub2RlX21vZHVsZXMvcHJvZ3Jlc3NiYXIuanMvc3JjL3BhdGguanMiLCIuLi9PbkJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvbm9kZV9tb2R1bGVzL3Byb2dyZXNzYmFyLmpzL3NyYy9zaGFwZS5qcyIsIi4uL09uQm9hcmQuV2ViL0NvbnRlbnQvU2NyaXB0cy9ub2RlX21vZHVsZXMvcHJvZ3Jlc3NiYXIuanMvc3JjL3NxdWFyZS5qcyIsIi4uL09uQm9hcmQuV2ViL0NvbnRlbnQvU2NyaXB0cy9ub2RlX21vZHVsZXMvcHJvZ3Jlc3NiYXIuanMvc3JjL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0lDQU0sY0FBYztBQUNMLGFBRFQsY0FBYyxDQUNKLElBQUksRUFBRTs4QkFEaEIsY0FBYzs7QUFFWixZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixZQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztLQUM3Qjs7aUJBSkMsY0FBYzs7ZUFLRSw4QkFBRztBQUNqQixnQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLGdCQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEQsaUJBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25DLEFBQUMsaUJBQUEsWUFBVztBQUNSLHlCQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVMsQ0FBQyxFQUFFO0FBQzNDLHlCQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRW5CLDRCQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsNEJBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFFdEMsQ0FBQyxDQUFDO0FBQ0gsd0JBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQix3QkFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDakUsd0JBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQ2hCLE9BQU87O0FBRVgseUJBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFDLEVBQUU7O0FBRTNDLHlCQUFDLENBQUMsY0FB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QUVoRCxDQUFDLENBQUM7Ozs7Ozs7QUNkSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaDJDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBDaGFsbGVuZ2VDYXJkcyB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1c2VyKSB7XHJcbiAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyQ2xpY2tFdmVudCgpO1xyXG4gICAgfVxyXG4gICAgcmVnaXN0ZXJDbGlja0V2ZW50KCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY2FyZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY2FyZFwiKTsgICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY2FyZHNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlQ2hhbGxlbmdlQ2FyZCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZUNoYWxsZW5nZU9uU2VydmVyKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhcmQgPSBjYXJkc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBjb3VudCA9IGNhcmRzW2ldLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhcmQtY291bnQtLXN1YnRyJyk7XHJcbiAgICAgICAgICAgICAgICBpZihjb3VudC5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgY291bnRbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVDaGFsbGVuZ2VDYXJkU3VidHJhY3QoY2FyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVDaGFsbGVuZ2VDYXJkU3VidHJhY3RPblNlcnZlcihjYXJkKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZUNoYWxsZW5nZUNhcmQoY2FyZCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBjYXJkSXNNYXJrZWRBc0NvbXBsZXRlID0gY2FyZC5jbGFzc0xpc3QuY29udGFpbnMoXCJjYXJkLS1jb21wbGV0ZVwiKTtcclxuICAgICAgICB2YXIgY2FyZElzU2luZ2xlT25seSA9IGNhcmQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2FyZC0tc2luZ2xlXCIpO1xyXG4gICAgICAgIHZhciBwb2ludHMgPSBjYXJkLmdldEF0dHJpYnV0ZSgnZGF0YS1wb2ludHMnKTtcclxuXHJcbiAgICAgICAgaWYgKGNhcmRJc01hcmtlZEFzQ29tcGxldGUgJiYgY2FyZElzU2luZ2xlT25seSkge1xyXG4gICAgICAgICAgICBwb2ludHMgPSBwb2ludHMgKiAtMTtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiY2FyZC0tY29tcGxldGVcIik7IFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZChcImNhcmQtLWNvbXBsZXRlXCIpOyBcclxuICAgICAgICAgICAgaWYoIWNhcmRJc1NpbmdsZU9ubHkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q291bnQgPSBjYXJkLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhcmQtY291bnQtLW51bWJlcicpWzBdO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvdW50LnRleHRDb250ZW50ID0gcGFyc2VJbnQoY3VycmVudENvdW50LnRleHRDb250ZW50KSArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ICAgICAgICBcclxuXHJcbiAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiY2hhbGxlbmdlQ2FyZFNhdmVkXCIsIHsgXCJkZXRhaWxcIjogcG9pbnRzIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlQ2hhbGxlbmdlQ2FyZFN1YnRyYWN0KGNhcmQpIHtcclxuICAgICAgICB2YXIgY2FyZElzTWFya2VkQXNDb21wbGV0ZSA9IGNhcmQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2FyZC0tY29tcGxldGVcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHBvaW50cyA9IGNhcmQuZ2V0QXR0cmlidXRlKCdkYXRhLXBvaW50cycpO1xyXG4gICAgICAgIC8vaWYgKGNhcmRJc01hcmtlZEFzQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgcG9pbnRzID0gcG9pbnRzICogLTE7XHJcbiAgICAgICAgLy99IGVsc2Uge1xyXG4gICAgICAgICAgICAvL2NhcmQuY2xhc3NMaXN0LmFkZChcImNhcmQtLWNvbXBsZXRlXCIpO1xyXG4gICAgICAgIC8vfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGNhcmQpO1xyXG4gICAgICAgIHZhciBjdXJyZW50Q291bnQgPSBjYXJkLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhcmQtY291bnQtLW51bWJlcicpWzBdO1xyXG4gICAgICAgIGN1cnJlbnRDb3VudC50ZXh0Q29udGVudCA9IHBhcnNlSW50KGN1cnJlbnRDb3VudC50ZXh0Q29udGVudCkgLSAxO1xyXG4gICAgICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImNoYWxsZW5nZUNhcmRTYXZlZFwiLCB7IFwiZGV0YWlsXCI6IHBvaW50cyB9KTtcclxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuICAgIHVwZGF0ZUNoYWxsZW5nZU9uU2VydmVyKGNhcmQpIHsgICAgICAgIFxyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4aHIub3BlbignUE9TVCcsICdIb21lL1RvZ2dsZUNoYWxsZW5nZScpO1xyXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzICE9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIC8vU29tZXRoaW5nIHdlbnQgd3JvbmcgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgIC8vIHJldHVybiB0byBsb2dpbiBmb3JtXHJcbiAgICAgICAgICAgICAgICB2YXIgdXNlcm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXItaGlkZVwiKS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvQXV0aGVudGljYXRpb24/bmFtZT1cIiArIHVzZXJuYW1lO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgIFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBcclxuICAgICAgICAgICAgaWQ6IGNhcmQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyksXHJcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyOiB0aGlzLnVzZXIsXHJcbiAgICAgICAgICAgIHNpbmdsZTogY2FyZC5jbGFzc0xpc3QuY29udGFpbnMoXCJjYXJkLS1zaW5nbGVcIilcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVDaGFsbGVuZ2VDYXJkU3VidHJhY3RPblNlcnZlcihjYXJkKSB7ICAgICAgICBcclxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnSG9tZS9Ub2dnbGVDaGFsbGVuZ2VTdWJ0cmFjdCcpO1xyXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzICE9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIC8vU29tZXRoaW5nIHdlbnQgd3JvbmcgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgIC8vIHJldHVybiB0byBsb2dpbiBmb3JtXHJcbiAgICAgICAgICAgICAgICB2YXIgdXNlcm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXItaGlkZVwiKS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvQXV0aGVudGljYXRpb24/bmFtZT1cIiArIHVzZXJuYW1lO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIGlkOiBjYXJkLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpLFxyXG4gICAgICAgICAgICBjdXJyZW50VXNlcjogdGhpcy51c2VyXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gQ2hhbGxlbmdlQ2FyZHM7IiwidmFyIHByb2dyZXNzYmFyID0gcmVxdWlyZSgncHJvZ3Jlc3NiYXIuanMnKTtcclxuXHJcbmNsYXNzIFVzZXJJbmZvIHtcclxuICAgIGNvbnN0cnVjdG9yKHVzZXIpIHtcclxuICAgICAgICB0aGlzLnVzZXIgPSB1c2VyO1xyXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NCYXIgPSBuZXcgcHJvZ3Jlc3NiYXIuQ2lyY2xlKCcjUHJvZ3Jlc3NCYXJDb250YWluZXInLCB7XHJcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAzLFxyXG4gICAgICAgICAgICBlYXNpbmc6ICdlYXNlSW5PdXQnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xyXG4gICAgfVxyXG4gICAgcmVnaXN0ZXJFdmVudHMoKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBldmVudCA9IG5ldyBFdmVudChcImNoYWxsZW5nZUNhcmRTYXZlZFwiKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbGxlbmdlQ2FyZFNhdmVkXCIsIGV2ZW50ID0+IHRoaXMudXBkYXRlUHJvZ3Jlc3NCYXIoZXZlbnQuZGV0YWlsKSk7XHJcbiAgICB9XHJcbiAgICBpbml0UHJvZ3Jlc3NCYXIoKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBjdXJyZW50UG9pbnRzID0gcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW50cm8tc2NvcmUnKS50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgdmFyIG1heFNjb3JlID0gcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWF4LXNjb3JlJykudGV4dENvbnRlbnQpO1xyXG4gICAgICAgIHZhciBwcm9ncmVzcyA9IGN1cnJlbnRQb2ludHMgLyBtYXhTY29yZTtcclxuICAgICAgICB0aGlzLnByb2dyZXNzQmFyLmFuaW1hdGUocHJvZ3Jlc3MpO1xyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuICAgIHVwZGF0ZVByb2dyZXNzQmFyKHBvaW50cykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHBvaW50cyk7XHJcbiAgICAgICAgdmFyIHNjb3JlYm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW50cm8tc2NvcmUnKTtcclxuICAgICAgICB2YXIgY3VycmVudFBvaW50cyA9IHBhcnNlSW50KHNjb3JlYm9hcmQudGV4dENvbnRlbnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBuZXdTY29yZSA9IGN1cnJlbnRQb2ludHMgKyBwYXJzZUludChwb2ludHMpO1xyXG4gICAgICAgIHNjb3JlYm9hcmQudGV4dENvbnRlbnQgPSBuZXdTY29yZTtcclxuICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBwYXJzZUZsb2F0KHNjb3JlYm9hcmQudGV4dENvbnRlbnQpL3BhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21heC1zY29yZScpLnRleHRDb250ZW50KTtcclxuICAgICAgICB0aGlzLnByb2dyZXNzQmFyLmFuaW1hdGUocHJvZ3Jlc3MpO1xyXG5cclxuICAgICAgICAvL3VwZGF0ZSBib251cyByaW5nc1xyXG4gICAgICAgIGlmIChuZXdTY29yZSA+PSAxMDApIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib251cy1sZXZlbC1vbmUnKTtcclxuICAgICAgICAgICAgaWYgKCFsZXZlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLmNsYXNzTGlzdC5hZGQoXCJmdWxmaWxsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbnVzLWxldmVsLW9uZScpO1xyXG4gICAgICAgICAgICBpZiAobGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QucmVtb3ZlKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJyZW50UG9pbnRzID49IDQwMCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbnVzLWxldmVsLXR3bycpO1xyXG4gICAgICAgICAgICBpZiAoIWxldmVsLmNsYXNzTGlzdC5jb250YWlucyhcImZ1bGZpbGxlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuY2xhc3NMaXN0LmFkZChcImZ1bGZpbGxlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgbGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9udXMtbGV2ZWwtdHdvJyk7XHJcbiAgICAgICAgICAgIGlmIChsZXZlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJmdWxmaWxsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICBpZiAoY3VycmVudFBvaW50cyA+PSA4MDApIHtcclxuICAgICAgICAgICAgdmFyIGxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbnVzLWxldmVsLXRocmVlJyk7XHJcbiAgICAgICAgICAgIGlmICghbGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QuYWRkKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbnVzLWxldmVsLXRocmVlJyk7XHJcbiAgICAgICAgICAgIGlmIChsZXZlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJmdWxmaWxsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGN1cnJlbnRQb2ludHMgPj0gMTMwMCkge1xyXG4gICAgICAgICAgICB2YXIgbGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9udXMtbGV2ZWwtZm91cicpO1xyXG4gICAgICAgICAgICBpZiAoIWxldmVsLmNsYXNzTGlzdC5jb250YWlucyhcImZ1bGZpbGxlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuY2xhc3NMaXN0LmFkZChcImZ1bGZpbGxlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib251cy1sZXZlbC1mb3VyJyk7XHJcbiAgICAgICAgICAgIGlmIChsZXZlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJmdWxmaWxsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGN1cnJlbnRQb2ludHMgPj0gMjAwMCkge1xyXG4gICAgICAgICAgICB2YXIgbGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9udXMtbGV2ZWwtZml2ZScpO1xyXG4gICAgICAgICAgICBpZiAoIWxldmVsLmNsYXNzTGlzdC5jb250YWlucyhcImZ1bGZpbGxlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuY2xhc3NMaXN0LmFkZChcImZ1bGZpbGxlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib251cy1sZXZlbC1maXZlJyk7XHJcbiAgICAgICAgICAgIGlmIChsZXZlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJmdWxmaWxsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gVXNlckluZm87IiwiaW1wb3J0IENoYWxsZW5nZUNhcmRzIGZyb20gXCIuL01vZHVsZXMvQ2hhbGxlbmdlQ2FyZHNcIjtcclxuaW1wb3J0IFVzZXJJbmZvIGZyb20gXCIuL01vZHVsZXMvVXNlckluZm9cIjtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgdmFyIHVzZXJuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyLWhpZGVcIikudGV4dENvbnRlbnQ7XHJcbiAgICBcclxuICAgIHZhciBjaGFsbGVuZ2VDYXJkcyA9IG5ldyBDaGFsbGVuZ2VDYXJkcyh1c2VybmFtZSk7XHJcbiAgICB2YXIgdXNlckluZm8gPSBuZXcgVXNlckluZm8odXNlcm5hbWUpO1xyXG5cclxuICAgIHVzZXJJbmZvLmluaXRQcm9ncmVzc0JhcigpO1xyXG5cclxuICAgIHZhciBjYXJkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdDYXJkcycpO1xyXG5cclxufSk7XHJcbi8qdmFyIG1zbnJ5ID0gbmV3IE1hc29ucnkoIGNhcmRzLCB7XHJcbiAgaXRlbVNlbGVjdG9yOiAnLml0ZW0nLFxyXG4gIGNvbHVtbldpZHRoOiAyMjBcclxufSk7Ki8iLCIvKiEgc2hpZnR5IC0gdjEuMi4yIC0gMjAxNC0xMC0wOSAtIGh0dHA6Ly9qZXJlbXlja2Fobi5naXRodWIuaW8vc2hpZnR5ICovXHJcbjsoZnVuY3Rpb24gKHJvb3QpIHtcclxuXHJcbi8qIVxyXG4gKiBTaGlmdHkgQ29yZVxyXG4gKiBCeSBKZXJlbXkgS2FobiAtIGplcmVteWNrYWhuQGdtYWlsLmNvbVxyXG4gKi9cclxuXHJcbi8vIFVnbGlmeUpTIGRlZmluZSBoYWNrLiAgVXNlZCBmb3IgdW5pdCB0ZXN0aW5nLiAgQ29udGVudHMgb2YgdGhpcyBpZiBhcmVcclxuLy8gY29tcGlsZWQgYXdheS5cclxuaWYgKHR5cGVvZiBTSElGVFlfREVCVUdfTk9XID09PSAndW5kZWZpbmVkJykge1xyXG4gIFNISUZUWV9ERUJVR19OT1cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gK25ldyBEYXRlKCk7XHJcbiAgfTtcclxufVxyXG5cclxudmFyIFR3ZWVuYWJsZSA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgLy8gQWxpYXNlcyB0aGF0IGdldCBkZWZpbmVkIGxhdGVyIGluIHRoaXMgZnVuY3Rpb25cclxuICB2YXIgZm9ybXVsYTtcclxuXHJcbiAgLy8gQ09OU1RBTlRTXHJcbiAgdmFyIERFRkFVTFRfU0NIRURVTEVfRlVOQ1RJT047XHJcbiAgdmFyIERFRkFVTFRfRUFTSU5HID0gJ2xpbmVhcic7XHJcbiAgdmFyIERFRkFVTFRfRFVSQVRJT04gPSA1MDA7XHJcbiAgdmFyIFVQREFURV9USU1FID0gMTAwMCAvIDYwO1xyXG5cclxuICB2YXIgX25vdyA9IERhdGUubm93XHJcbiAgICAgICA/IERhdGUubm93XHJcbiAgICAgICA6IGZ1bmN0aW9uICgpIHtyZXR1cm4gK25ldyBEYXRlKCk7fTtcclxuXHJcbiAgdmFyIG5vdyA9IFNISUZUWV9ERUJVR19OT1dcclxuICAgICAgID8gU0hJRlRZX0RFQlVHX05PV1xyXG4gICAgICAgOiBfbm93O1xyXG5cclxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIC8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSgpIHNoaW0gYnkgUGF1bCBJcmlzaCAobW9kaWZpZWQgZm9yIFNoaWZ0eSlcclxuICAgIC8vIGh0dHA6Ly9wYXVsaXJpc2guY29tLzIwMTEvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1hbmltYXRpbmcvXHJcbiAgICBERUZBVUxUX1NDSEVEVUxFX0ZVTkNUSU9OID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgICAgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgICAgfHwgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuICAgICAgIHx8IHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgICAgfHwgKHdpbmRvdy5tb3pDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuICAgICAgICYmIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXHJcbiAgICAgICB8fCBzZXRUaW1lb3V0O1xyXG4gIH0gZWxzZSB7XHJcbiAgICBERUZBVUxUX1NDSEVEVUxFX0ZVTkNUSU9OID0gc2V0VGltZW91dDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG5vb3AgKCkge1xyXG4gICAgLy8gTk9PUCFcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIEhhbmR5IHNob3J0Y3V0IGZvciBkb2luZyBhIGZvci1pbiBsb29wLiBUaGlzIGlzIG5vdCBhIFwibm9ybWFsXCIgZWFjaFxyXG4gICAqIGZ1bmN0aW9uLCBpdCBpcyBvcHRpbWl6ZWQgZm9yIFNoaWZ0eS4gIFRoZSBpdGVyYXRvciBmdW5jdGlvbiBvbmx5IHJlY2VpdmVzXHJcbiAgICogdGhlIHByb3BlcnR5IG5hbWUsIG5vdCB0aGUgdmFsdWUuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9ialxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24oc3RyaW5nKX0gZm5cclxuICAgKi9cclxuICBmdW5jdGlvbiBlYWNoIChvYmosIGZuKSB7XHJcbiAgICB2YXIga2V5O1xyXG4gICAgZm9yIChrZXkgaW4gb2JqKSB7XHJcbiAgICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcclxuICAgICAgICBmbihrZXkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBQZXJmb3JtIGEgc2hhbGxvdyBjb3B5IG9mIE9iamVjdCBwcm9wZXJ0aWVzLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRPYmplY3QgVGhlIG9iamVjdCB0byBjb3B5IGludG9cclxuICAgKiBAcGFyYW0ge09iamVjdH0gc3JjT2JqZWN0IFRoZSBvYmplY3QgdG8gY29weSBmcm9tXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBBIHJlZmVyZW5jZSB0byB0aGUgYXVnbWVudGVkIGB0YXJnZXRPYmpgIE9iamVjdFxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHNoYWxsb3dDb3B5ICh0YXJnZXRPYmosIHNyY09iaikge1xyXG4gICAgZWFjaChzcmNPYmosIGZ1bmN0aW9uIChwcm9wKSB7XHJcbiAgICAgIHRhcmdldE9ialtwcm9wXSA9IHNyY09ialtwcm9wXTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0YXJnZXRPYmo7XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBDb3BpZXMgZWFjaCBwcm9wZXJ0eSBmcm9tIHNyYyBvbnRvIHRhcmdldCwgYnV0IG9ubHkgaWYgdGhlIHByb3BlcnR5IHRvXHJcbiAgICogY29weSB0byB0YXJnZXQgaXMgdW5kZWZpbmVkLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgTWlzc2luZyBwcm9wZXJ0aWVzIGluIHRoaXMgT2JqZWN0IGFyZSBmaWxsZWQgaW5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gc3JjXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZGVmYXVsdHMgKHRhcmdldCwgc3JjKSB7XHJcbiAgICBlYWNoKHNyYywgZnVuY3Rpb24gKHByb3ApIHtcclxuICAgICAgaWYgKHR5cGVvZiB0YXJnZXRbcHJvcF0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGFyZ2V0W3Byb3BdID0gc3JjW3Byb3BdO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIENhbGN1bGF0ZXMgdGhlIGludGVycG9sYXRlZCB0d2VlbiB2YWx1ZXMgb2YgYW4gT2JqZWN0IGZvciBhIGdpdmVuXHJcbiAgICogdGltZXN0YW1wLlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmb3JQb3NpdGlvbiBUaGUgcG9zaXRpb24gdG8gY29tcHV0ZSB0aGUgc3RhdGUgZm9yLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdXJyZW50U3RhdGUgQ3VycmVudCBzdGF0ZSBwcm9wZXJ0aWVzLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcmlnaW5hbFN0YXRlOiBUaGUgb3JpZ2luYWwgc3RhdGUgcHJvcGVydGllcyB0aGUgT2JqZWN0IGlzXHJcbiAgICogdHdlZW5pbmcgZnJvbS5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0U3RhdGU6IFRoZSBkZXN0aW5hdGlvbiBzdGF0ZSBwcm9wZXJ0aWVzIHRoZSBPYmplY3RcclxuICAgKiBpcyB0d2VlbmluZyB0by5cclxuICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb246IFRoZSBsZW5ndGggb2YgdGhlIHR3ZWVuIGluIG1pbGxpc2Vjb25kcy5cclxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZXN0YW1wOiBUaGUgVU5JWCBlcG9jaCB0aW1lIGF0IHdoaWNoIHRoZSB0d2VlbiBiZWdhbi5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nOiBUaGlzIE9iamVjdCdzIGtleXMgbXVzdCBjb3JyZXNwb25kIHRvIHRoZSBrZXlzIGluXHJcbiAgICogdGFyZ2V0U3RhdGUuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdHdlZW5Qcm9wcyAoZm9yUG9zaXRpb24sIGN1cnJlbnRTdGF0ZSwgb3JpZ2luYWxTdGF0ZSwgdGFyZ2V0U3RhdGUsXHJcbiAgICBkdXJhdGlvbiwgdGltZXN0YW1wLCBlYXNpbmcpIHtcclxuICAgIHZhciBub3JtYWxpemVkUG9zaXRpb24gPSAoZm9yUG9zaXRpb24gLSB0aW1lc3RhbXApIC8gZHVyYXRpb247XHJcblxyXG4gICAgdmFyIHByb3A7XHJcbiAgICBmb3IgKHByb3AgaW4gY3VycmVudFN0YXRlKSB7XHJcbiAgICAgIGlmIChjdXJyZW50U3RhdGUuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICBjdXJyZW50U3RhdGVbcHJvcF0gPSB0d2VlblByb3Aob3JpZ2luYWxTdGF0ZVtwcm9wXSxcclxuICAgICAgICAgIHRhcmdldFN0YXRlW3Byb3BdLCBmb3JtdWxhW2Vhc2luZ1twcm9wXV0sIG5vcm1hbGl6ZWRQb3NpdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY3VycmVudFN0YXRlO1xyXG4gIH1cclxuXHJcbiAgLyohXHJcbiAgICogVHdlZW5zIGEgc2luZ2xlIHByb3BlcnR5LlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBUaGUgdmFsdWUgdGhhdCB0aGUgdHdlZW4gc3RhcnRlZCBmcm9tLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhlIHZhbHVlIHRoYXQgdGhlIHR3ZWVuIHNob3VsZCBlbmQgYXQuXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZWFzaW5nRnVuYyBUaGUgZWFzaW5nIGN1cnZlIHRvIGFwcGx5IHRvIHRoZSB0d2Vlbi5cclxuICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb24gVGhlIG5vcm1hbGl6ZWQgcG9zaXRpb24gKGJldHdlZW4gMC4wIGFuZCAxLjApIHRvXHJcbiAgICogY2FsY3VsYXRlIHRoZSBtaWRwb2ludCBvZiAnc3RhcnQnIGFuZCAnZW5kJyBhZ2FpbnN0LlxyXG4gICAqIEByZXR1cm4ge251bWJlcn0gVGhlIHR3ZWVuZWQgdmFsdWUuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdHdlZW5Qcm9wIChzdGFydCwgZW5kLCBlYXNpbmdGdW5jLCBwb3NpdGlvbikge1xyXG4gICAgcmV0dXJuIHN0YXJ0ICsgKGVuZCAtIHN0YXJ0KSAqIGVhc2luZ0Z1bmMocG9zaXRpb24pO1xyXG4gIH1cclxuXHJcbiAgLyohXHJcbiAgICogQXBwbGllcyBhIGZpbHRlciB0byBUd2VlbmFibGUgaW5zdGFuY2UuXHJcbiAgICogQHBhcmFtIHtUd2VlbmFibGV9IHR3ZWVuYWJsZSBUaGUgYFR3ZWVuYWJsZWAgaW5zdGFuY2UgdG8gY2FsbCB0aGUgZmlsdGVyXHJcbiAgICogdXBvbi5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsdGVyTmFtZSBUaGUgbmFtZSBvZiB0aGUgZmlsdGVyIHRvIGFwcGx5LlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGFwcGx5RmlsdGVyICh0d2VlbmFibGUsIGZpbHRlck5hbWUpIHtcclxuICAgIHZhciBmaWx0ZXJzID0gVHdlZW5hYmxlLnByb3RvdHlwZS5maWx0ZXI7XHJcbiAgICB2YXIgYXJncyA9IHR3ZWVuYWJsZS5fZmlsdGVyQXJncztcclxuXHJcbiAgICBlYWNoKGZpbHRlcnMsIGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgZmlsdGVyc1tuYW1lXVtmaWx0ZXJOYW1lXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBmaWx0ZXJzW25hbWVdW2ZpbHRlck5hbWVdLmFwcGx5KHR3ZWVuYWJsZSwgYXJncyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdmFyIHRpbWVvdXRIYW5kbGVyX2VuZFRpbWU7XHJcbiAgdmFyIHRpbWVvdXRIYW5kbGVyX2N1cnJlbnRUaW1lO1xyXG4gIHZhciB0aW1lb3V0SGFuZGxlcl9pc0VuZGVkO1xyXG4gIC8qIVxyXG4gICAqIEhhbmRsZXMgdGhlIHVwZGF0ZSBsb2dpYyBmb3Igb25lIHN0ZXAgb2YgYSB0d2Vlbi5cclxuICAgKiBAcGFyYW0ge1R3ZWVuYWJsZX0gdHdlZW5hYmxlXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVzdGFtcFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvblxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdXJyZW50U3RhdGVcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3JpZ2luYWxTdGF0ZVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRTdGF0ZVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmdcclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdGVwXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbihGdW5jdGlvbixudW1iZXIpfX0gc2NoZWR1bGVcclxuICAgKi9cclxuICBmdW5jdGlvbiB0aW1lb3V0SGFuZGxlciAodHdlZW5hYmxlLCB0aW1lc3RhbXAsIGR1cmF0aW9uLCBjdXJyZW50U3RhdGUsXHJcbiAgICBvcmlnaW5hbFN0YXRlLCB0YXJnZXRTdGF0ZSwgZWFzaW5nLCBzdGVwLCBzY2hlZHVsZSkge1xyXG4gICAgdGltZW91dEhhbmRsZXJfZW5kVGltZSA9IHRpbWVzdGFtcCArIGR1cmF0aW9uO1xyXG4gICAgdGltZW91dEhhbmRsZXJfY3VycmVudFRpbWUgPSBNYXRoLm1pbihub3coKSwgdGltZW91dEhhbmRsZXJfZW5kVGltZSk7XHJcbiAgICB0aW1lb3V0SGFuZGxlcl9pc0VuZGVkID0gdGltZW91dEhhbmRsZXJfY3VycmVudFRpbWUgPj0gdGltZW91dEhhbmRsZXJfZW5kVGltZTtcclxuXHJcbiAgICBpZiAodHdlZW5hYmxlLmlzUGxheWluZygpICYmICF0aW1lb3V0SGFuZGxlcl9pc0VuZGVkKSB7XHJcbiAgICAgIHNjaGVkdWxlKHR3ZWVuYWJsZS5fdGltZW91dEhhbmRsZXIsIFVQREFURV9USU1FKTtcclxuXHJcbiAgICAgIGFwcGx5RmlsdGVyKHR3ZWVuYWJsZSwgJ2JlZm9yZVR3ZWVuJyk7XHJcbiAgICAgIHR3ZWVuUHJvcHModGltZW91dEhhbmRsZXJfY3VycmVudFRpbWUsIGN1cnJlbnRTdGF0ZSwgb3JpZ2luYWxTdGF0ZSxcclxuICAgICAgICB0YXJnZXRTdGF0ZSwgZHVyYXRpb24sIHRpbWVzdGFtcCwgZWFzaW5nKTtcclxuICAgICAgYXBwbHlGaWx0ZXIodHdlZW5hYmxlLCAnYWZ0ZXJUd2VlbicpO1xyXG5cclxuICAgICAgc3RlcChjdXJyZW50U3RhdGUpO1xyXG4gICAgfSBlbHNlIGlmICh0aW1lb3V0SGFuZGxlcl9pc0VuZGVkKSB7XHJcbiAgICAgIHN0ZXAodGFyZ2V0U3RhdGUpO1xyXG4gICAgICB0d2VlbmFibGUuc3RvcCh0cnVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvKiFcclxuICAgKiBDcmVhdGVzIGEgdXNhYmxlIGVhc2luZyBPYmplY3QgZnJvbSBlaXRoZXIgYSBzdHJpbmcgb3IgYW5vdGhlciBlYXNpbmdcclxuICAgKiBPYmplY3QuICBJZiBgZWFzaW5nYCBpcyBhbiBPYmplY3QsIHRoZW4gdGhpcyBmdW5jdGlvbiBjbG9uZXMgaXQgYW5kIGZpbGxzXHJcbiAgICogaW4gdGhlIG1pc3NpbmcgcHJvcGVydGllcyB3aXRoIFwibGluZWFyXCIuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGZyb21Ud2VlblBhcmFtc1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gZWFzaW5nXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY29tcG9zZUVhc2luZ09iamVjdCAoZnJvbVR3ZWVuUGFyYW1zLCBlYXNpbmcpIHtcclxuICAgIHZhciBjb21wb3NlZEVhc2luZyA9IHt9O1xyXG5cclxuICAgIGlmICh0eXBlb2YgZWFzaW5nID09PSAnc3RyaW5nJykge1xyXG4gICAgICBlYWNoKGZyb21Ud2VlblBhcmFtcywgZnVuY3Rpb24gKHByb3ApIHtcclxuICAgICAgICBjb21wb3NlZEVhc2luZ1twcm9wXSA9IGVhc2luZztcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlYWNoKGZyb21Ud2VlblBhcmFtcywgZnVuY3Rpb24gKHByb3ApIHtcclxuICAgICAgICBpZiAoIWNvbXBvc2VkRWFzaW5nW3Byb3BdKSB7XHJcbiAgICAgICAgICBjb21wb3NlZEVhc2luZ1twcm9wXSA9IGVhc2luZ1twcm9wXSB8fCBERUZBVUxUX0VBU0lORztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb21wb3NlZEVhc2luZztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFR3ZWVuYWJsZSBjb25zdHJ1Y3Rvci5cclxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9pbml0aWFsU3RhdGUgVGhlIHZhbHVlcyB0aGF0IHRoZSBpbml0aWFsIHR3ZWVuIHNob3VsZCBzdGFydCBhdCBpZiBhIFwiZnJvbVwiIG9iamVjdCBpcyBub3QgcHJvdmlkZWQgdG8gVHdlZW5hYmxlI3R3ZWVuLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2NvbmZpZyBTZWUgVHdlZW5hYmxlLnByb3RvdHlwZS5zZXRDb25maWcoKVxyXG4gICAqIEBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIFR3ZWVuYWJsZSAob3B0X2luaXRpYWxTdGF0ZSwgb3B0X2NvbmZpZykge1xyXG4gICAgdGhpcy5fY3VycmVudFN0YXRlID0gb3B0X2luaXRpYWxTdGF0ZSB8fCB7fTtcclxuICAgIHRoaXMuX2NvbmZpZ3VyZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuX3NjaGVkdWxlRnVuY3Rpb24gPSBERUZBVUxUX1NDSEVEVUxFX0ZVTkNUSU9OO1xyXG5cclxuICAgIC8vIFRvIHByZXZlbnQgdW5uZWNlc3NhcnkgY2FsbHMgdG8gc2V0Q29uZmlnIGRvIG5vdCBzZXQgZGVmYXVsdCBjb25maWd1cmF0aW9uIGhlcmUuXHJcbiAgICAvLyBPbmx5IHNldCBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gaW1tZWRpYXRlbHkgYmVmb3JlIHR3ZWVuaW5nIGlmIG5vbmUgaGFzIGJlZW4gc2V0LlxyXG4gICAgaWYgKHR5cGVvZiBvcHRfY29uZmlnICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICB0aGlzLnNldENvbmZpZyhvcHRfY29uZmlnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbmZpZ3VyZSBhbmQgc3RhcnQgYSB0d2Vlbi5cclxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9jb25maWcgU2VlIFR3ZWVuYWJsZS5wcm90b3R5cGUuc2V0Q29uZmlnKClcclxuICAgKiBAcmV0dXJuIHtUd2VlbmFibGV9XHJcbiAgICovXHJcbiAgVHdlZW5hYmxlLnByb3RvdHlwZS50d2VlbiA9IGZ1bmN0aW9uIChvcHRfY29uZmlnKSB7XHJcbiAgICBpZiAodGhpcy5faXNUd2VlbmluZykge1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvLyBPbmx5IHNldCBkZWZhdWx0IGNvbmZpZyBpZiBubyBjb25maWd1cmF0aW9uIGhhcyBiZWVuIHNldCBwcmV2aW91c2x5IGFuZCBub25lIGlzIHByb3ZpZGVkIG5vdy5cclxuICAgIGlmIChvcHRfY29uZmlnICE9PSB1bmRlZmluZWQgfHwgIXRoaXMuX2NvbmZpZ3VyZWQpIHtcclxuICAgICAgdGhpcy5zZXRDb25maWcob3B0X2NvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fc3RhcnQodGhpcy5nZXQoKSk7XHJcbiAgICByZXR1cm4gdGhpcy5yZXN1bWUoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSB0d2VlbiBjb25maWd1cmF0aW9uLiBgY29uZmlnYCBtYXkgaGF2ZSB0aGUgZm9sbG93aW5nIG9wdGlvbnM6XHJcbiAgICpcclxuICAgKiAtIF9fZnJvbV9fIChfT2JqZWN0PV8pOiBTdGFydGluZyBwb3NpdGlvbi4gIElmIG9taXR0ZWQsIHRoZSBjdXJyZW50IHN0YXRlIGlzIHVzZWQuXHJcbiAgICogLSBfX3RvX18gKF9PYmplY3Q9Xyk6IEVuZGluZyBwb3NpdGlvbi5cclxuICAgKiAtIF9fZHVyYXRpb25fXyAoX251bWJlcj1fKTogSG93IG1hbnkgbWlsbGlzZWNvbmRzIHRvIGFuaW1hdGUgZm9yLlxyXG4gICAqIC0gX19zdGFydF9fIChfRnVuY3Rpb24oT2JqZWN0KT1fKTogRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSB0d2VlbiBiZWdpbnMuICBSZWNlaXZlcyB0aGUgc3RhdGUgb2YgdGhlIHR3ZWVuIGFzIHRoZSBvbmx5IHBhcmFtZXRlci5cclxuICAgKiAtIF9fc3RlcF9fIChfRnVuY3Rpb24oT2JqZWN0KT1fKTogRnVuY3Rpb24gdG8gZXhlY3V0ZSBvbiBldmVyeSB0aWNrLiAgUmVjZWl2ZXMgdGhlIHN0YXRlIG9mIHRoZSB0d2VlbiBhcyB0aGUgb25seSBwYXJhbWV0ZXIuICBUaGlzIGZ1bmN0aW9uIGlzIG5vdCBjYWxsZWQgb24gdGhlIGZpbmFsIHN0ZXAgb2YgdGhlIGFuaW1hdGlvbiwgYnV0IGBmaW5pc2hgIGlzLlxyXG4gICAqIC0gX19maW5pc2hfXyAoX0Z1bmN0aW9uKE9iamVjdCk9Xyk6IEZ1bmN0aW9uIHRvIGV4ZWN1dGUgdXBvbiB0d2VlbiBjb21wbGV0aW9uLiAgUmVjZWl2ZXMgdGhlIHN0YXRlIG9mIHRoZSB0d2VlbiBhcyB0aGUgb25seSBwYXJhbWV0ZXIuXHJcbiAgICogLSBfX2Vhc2luZ19fIChfT2JqZWN0fHN0cmluZz1fKTogRWFzaW5nIGN1cnZlIG5hbWUocykgdG8gdXNlIGZvciB0aGUgdHdlZW4uXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAqIEByZXR1cm4ge1R3ZWVuYWJsZX1cclxuICAgKi9cclxuICBUd2VlbmFibGUucHJvdG90eXBlLnNldENvbmZpZyA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuICAgIHRoaXMuX2NvbmZpZ3VyZWQgPSB0cnVlO1xyXG5cclxuICAgIC8vIEluaXQgdGhlIGludGVybmFsIHN0YXRlXHJcbiAgICB0aGlzLl9wYXVzZWRBdFRpbWUgPSBudWxsO1xyXG4gICAgdGhpcy5fc3RhcnQgPSBjb25maWcuc3RhcnQgfHwgbm9vcDtcclxuICAgIHRoaXMuX3N0ZXAgPSBjb25maWcuc3RlcCB8fCBub29wO1xyXG4gICAgdGhpcy5fZmluaXNoID0gY29uZmlnLmZpbmlzaCB8fCBub29wO1xyXG4gICAgdGhpcy5fZHVyYXRpb24gPSBjb25maWcuZHVyYXRpb24gfHwgREVGQVVMVF9EVVJBVElPTjtcclxuICAgIHRoaXMuX2N1cnJlbnRTdGF0ZSA9IGNvbmZpZy5mcm9tIHx8IHRoaXMuZ2V0KCk7XHJcbiAgICB0aGlzLl9vcmlnaW5hbFN0YXRlID0gdGhpcy5nZXQoKTtcclxuICAgIHRoaXMuX3RhcmdldFN0YXRlID0gY29uZmlnLnRvIHx8IHRoaXMuZ2V0KCk7XHJcbiAgICB0aGlzLl90aW1lc3RhbXAgPSBub3coKTtcclxuXHJcbiAgICAvLyBBbGlhc2VzIHVzZWQgYmVsb3dcclxuICAgIHZhciBjdXJyZW50U3RhdGUgPSB0aGlzLl9jdXJyZW50U3RhdGU7XHJcbiAgICB2YXIgdGFyZ2V0U3RhdGUgPSB0aGlzLl90YXJnZXRTdGF0ZTtcclxuXHJcbiAgICAvLyBFbnN1cmUgdGhhdCB0aGVyZSBpcyBhbHdheXMgc29tZXRoaW5nIHRvIHR3ZWVuIHRvLlxyXG4gICAgZGVmYXVsdHModGFyZ2V0U3RhdGUsIGN1cnJlbnRTdGF0ZSk7XHJcblxyXG4gICAgdGhpcy5fZWFzaW5nID0gY29tcG9zZUVhc2luZ09iamVjdChcclxuICAgICAgY3VycmVudFN0YXRlLCBjb25maWcuZWFzaW5nIHx8IERFRkFVTFRfRUFTSU5HKTtcclxuXHJcbiAgICB0aGlzLl9maWx0ZXJBcmdzID1cclxuICAgICAgW2N1cnJlbnRTdGF0ZSwgdGhpcy5fb3JpZ2luYWxTdGF0ZSwgdGFyZ2V0U3RhdGUsIHRoaXMuX2Vhc2luZ107XHJcblxyXG4gICAgYXBwbHlGaWx0ZXIodGhpcywgJ3R3ZWVuQ3JlYXRlZCcpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgY3VycmVudCBzdGF0ZS5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAgICovXHJcbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gc2hhbGxvd0NvcHkoe30sIHRoaXMuX2N1cnJlbnRTdGF0ZSk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgY3VycmVudCBzdGF0ZS5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcclxuICAgKi9cclxuICBUd2VlbmFibGUucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gICAgdGhpcy5fY3VycmVudFN0YXRlID0gc3RhdGU7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUGF1c2VzIGEgdHdlZW4uICBQYXVzZWQgdHdlZW5zIGNhbiBiZSByZXN1bWVkIGZyb20gdGhlIHBvaW50IGF0IHdoaWNoIHRoZXkgd2VyZSBwYXVzZWQuICBUaGlzIGlzIGRpZmZlcmVudCB0aGFuIFtgc3RvcCgpYF0oI3N0b3ApLCBhcyB0aGF0IG1ldGhvZCBjYXVzZXMgYSB0d2VlbiB0byBzdGFydCBvdmVyIHdoZW4gaXQgaXMgcmVzdW1lZC5cclxuICAgKiBAcmV0dXJuIHtUd2VlbmFibGV9XHJcbiAgICovXHJcbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuX3BhdXNlZEF0VGltZSA9IG5vdygpO1xyXG4gICAgdGhpcy5faXNQYXVzZWQgPSB0cnVlO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdW1lcyBhIHBhdXNlZCB0d2Vlbi5cclxuICAgKiBAcmV0dXJuIHtUd2VlbmFibGV9XHJcbiAgICovXHJcbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5faXNQYXVzZWQpIHtcclxuICAgICAgdGhpcy5fdGltZXN0YW1wICs9IG5vdygpIC0gdGhpcy5fcGF1c2VkQXRUaW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2lzUGF1c2VkID0gZmFsc2U7XHJcbiAgICB0aGlzLl9pc1R3ZWVuaW5nID0gdHJ1ZTtcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLl90aW1lb3V0SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGltZW91dEhhbmRsZXIoc2VsZiwgc2VsZi5fdGltZXN0YW1wLCBzZWxmLl9kdXJhdGlvbiwgc2VsZi5fY3VycmVudFN0YXRlLFxyXG4gICAgICAgIHNlbGYuX29yaWdpbmFsU3RhdGUsIHNlbGYuX3RhcmdldFN0YXRlLCBzZWxmLl9lYXNpbmcsIHNlbGYuX3N0ZXAsXHJcbiAgICAgICAgc2VsZi5fc2NoZWR1bGVGdW5jdGlvbik7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuX3RpbWVvdXRIYW5kbGVyKCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RvcHMgYW5kIGNhbmNlbHMgYSB0d2Vlbi5cclxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBnb3RvRW5kIElmIGZhbHNlIG9yIG9taXR0ZWQsIHRoZSB0d2VlbiBqdXN0IHN0b3BzIGF0IGl0cyBjdXJyZW50IHN0YXRlLCBhbmQgdGhlIFwiZmluaXNoXCIgaGFuZGxlciBpcyBub3QgaW52b2tlZC4gIElmIHRydWUsIHRoZSB0d2VlbmVkIG9iamVjdCdzIHZhbHVlcyBhcmUgaW5zdGFudGx5IHNldCB0byB0aGUgdGFyZ2V0IHZhbHVlcywgYW5kIFwiZmluaXNoXCIgaXMgaW52b2tlZC5cclxuICAgKiBAcmV0dXJuIHtUd2VlbmFibGV9XHJcbiAgICovXHJcbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKGdvdG9FbmQpIHtcclxuICAgIHRoaXMuX2lzVHdlZW5pbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuX2lzUGF1c2VkID0gZmFsc2U7XHJcbiAgICB0aGlzLl90aW1lb3V0SGFuZGxlciA9IG5vb3A7XHJcblxyXG4gICAgaWYgKGdvdG9FbmQpIHtcclxuICAgICAgc2hhbGxvd0NvcHkodGhpcy5fY3VycmVudFN0YXRlLCB0aGlzLl90YXJnZXRTdGF0ZSk7XHJcbiAgICAgIGFwcGx5RmlsdGVyKHRoaXMsICdhZnRlclR3ZWVuRW5kJyk7XHJcbiAgICAgIHRoaXMuX2ZpbmlzaC5jYWxsKHRoaXMsIHRoaXMuX2N1cnJlbnRTdGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIHR3ZWVuIGlzIHJ1bm5pbmcuXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBUd2VlbmFibGUucHJvdG90eXBlLmlzUGxheWluZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLl9pc1R3ZWVuaW5nICYmICF0aGlzLl9pc1BhdXNlZDtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBTZXRzIGEgY3VzdG9tIHNjaGVkdWxlIGZ1bmN0aW9uLlxyXG4gICAqXHJcbiAgICogSWYgYSBjdXN0b20gZnVuY3Rpb24gaXMgbm90IHNldCB0aGUgZGVmYXVsdCBvbmUgaXMgdXNlZCBbYHJlcXVlc3RBbmltYXRpb25GcmFtZWBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS93aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSBpZiBhdmFpbGFibGUsIG90aGVyd2lzZSBbYHNldFRpbWVvdXRgXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2luZG93LnNldFRpbWVvdXQpKS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24oRnVuY3Rpb24sbnVtYmVyKX0gc2NoZWR1bGVGdW5jdGlvbiBUaGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHRvIHNjaGVkdWxlIHRoZSBuZXh0IGZyYW1lIHRvIGJlIHJlbmRlcmVkXHJcbiAgICovXHJcbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5zZXRTY2hlZHVsZUZ1bmN0aW9uID0gZnVuY3Rpb24gKHNjaGVkdWxlRnVuY3Rpb24pIHtcclxuICAgIHRoaXMuX3NjaGVkdWxlRnVuY3Rpb24gPSBzY2hlZHVsZUZ1bmN0aW9uO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIGBkZWxldGVgcyBhbGwgXCJvd25cIiBwcm9wZXJ0aWVzLiAgQ2FsbCB0aGlzIHdoZW4gdGhlIGBUd2VlbmFibGVgIGluc3RhbmNlIGlzIG5vIGxvbmdlciBuZWVkZWQgdG8gZnJlZSBtZW1vcnkuXHJcbiAgICovXHJcbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByb3A7XHJcbiAgICBmb3IgKHByb3AgaW4gdGhpcykge1xyXG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzW3Byb3BdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyohXHJcbiAgICogRmlsdGVycyBhcmUgdXNlZCBmb3IgdHJhbnNmb3JtaW5nIHRoZSBwcm9wZXJ0aWVzIG9mIGEgdHdlZW4gYXQgdmFyaW91c1xyXG4gICAqIHBvaW50cyBpbiBhIFR3ZWVuYWJsZSdzIGxpZmUgY3ljbGUuICBTZWUgdGhlIFJFQURNRSBmb3IgbW9yZSBpbmZvIG9uIHRoaXMuXHJcbiAgICovXHJcbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5maWx0ZXIgPSB7fTtcclxuXHJcbiAgLyohXHJcbiAgICogVGhpcyBvYmplY3QgY29udGFpbnMgYWxsIG9mIHRoZSB0d2VlbnMgYXZhaWxhYmxlIHRvIFNoaWZ0eS4gIEl0IGlzIGV4dGVuZGlibGUgLSBzaW1wbHkgYXR0YWNoIHByb3BlcnRpZXMgdG8gdGhlIFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYSBPYmplY3QgZm9sbG93aW5nIHRoZSBzYW1lIGZvcm1hdCBhdCBsaW5lYXIuXHJcbiAgICpcclxuICAgKiBgcG9zYCBzaG91bGQgYmUgYSBub3JtYWxpemVkIGBudW1iZXJgIChiZXR3ZWVuIDAgYW5kIDEpLlxyXG4gICAqL1xyXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYSA9IHtcclxuICAgIGxpbmVhcjogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gcG9zO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGZvcm11bGEgPSBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGE7XHJcblxyXG4gIHNoYWxsb3dDb3B5KFR3ZWVuYWJsZSwge1xyXG4gICAgJ25vdyc6IG5vd1xyXG4gICAgLCdlYWNoJzogZWFjaFxyXG4gICAgLCd0d2VlblByb3BzJzogdHdlZW5Qcm9wc1xyXG4gICAgLCd0d2VlblByb3AnOiB0d2VlblByb3BcclxuICAgICwnYXBwbHlGaWx0ZXInOiBhcHBseUZpbHRlclxyXG4gICAgLCdzaGFsbG93Q29weSc6IHNoYWxsb3dDb3B5XHJcbiAgICAsJ2RlZmF1bHRzJzogZGVmYXVsdHNcclxuICAgICwnY29tcG9zZUVhc2luZ09iamVjdCc6IGNvbXBvc2VFYXNpbmdPYmplY3RcclxuICB9KTtcclxuXHJcbiAgLy8gYHJvb3RgIGlzIHByb3ZpZGVkIGluIHRoZSBpbnRyby9vdXRybyBmaWxlcy5cclxuXHJcbiAgLy8gQSBob29rIHVzZWQgZm9yIHVuaXQgdGVzdGluZy5cclxuICBpZiAodHlwZW9mIFNISUZUWV9ERUJVR19OT1cgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIHJvb3QudGltZW91dEhhbmRsZXIgPSB0aW1lb3V0SGFuZGxlcjtcclxuICB9XHJcblxyXG4gIC8vIEJvb3RzdHJhcCBUd2VlbmFibGUgYXBwcm9wcmlhdGVseSBmb3IgdGhlIGVudmlyb25tZW50LlxyXG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgIC8vIENvbW1vbkpTXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFR3ZWVuYWJsZTtcclxuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgLy8gQU1EXHJcbiAgICBkZWZpbmUoZnVuY3Rpb24gKCkge3JldHVybiBUd2VlbmFibGU7fSk7XHJcbiAgfSBlbHNlIGlmICh0eXBlb2Ygcm9vdC5Ud2VlbmFibGUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAvLyBCcm93c2VyOiBNYWtlIGBUd2VlbmFibGVgIGdsb2JhbGx5IGFjY2Vzc2libGUuXHJcbiAgICByb290LlR3ZWVuYWJsZSA9IFR3ZWVuYWJsZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBUd2VlbmFibGU7XHJcblxyXG59ICgpKTtcclxuXHJcbi8qIVxyXG4gKiBBbGwgZXF1YXRpb25zIGFyZSBhZGFwdGVkIGZyb20gVGhvbWFzIEZ1Y2hzJyBbU2NyaXB0eTJdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYWRyb2JieS9zY3JpcHR5Mi9ibG9iL21hc3Rlci9zcmMvZWZmZWN0cy90cmFuc2l0aW9ucy9wZW5uZXIuanMpLlxyXG4gKlxyXG4gKiBCYXNlZCBvbiBFYXNpbmcgRXF1YXRpb25zIChjKSAyMDAzIFtSb2JlcnQgUGVubmVyXShodHRwOi8vd3d3LnJvYmVydHBlbm5lci5jb20vKSwgYWxsIHJpZ2h0cyByZXNlcnZlZC4gVGhpcyB3b3JrIGlzIFtzdWJqZWN0IHRvIHRlcm1zXShodHRwOi8vd3d3LnJvYmVydHBlbm5lci5jb20vZWFzaW5nX3Rlcm1zX29mX3VzZS5odG1sKS5cclxuICovXHJcblxyXG4vKiFcclxuICogIFRFUk1TIE9GIFVTRSAtIEVBU0lORyBFUVVBVElPTlNcclxuICogIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS5cclxuICogIEVhc2luZyBFcXVhdGlvbnMgKGMpIDIwMDMgUm9iZXJ0IFBlbm5lciwgYWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICovXHJcblxyXG47KGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgVHdlZW5hYmxlLnNoYWxsb3dDb3B5KFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYSwge1xyXG4gICAgZWFzZUluUXVhZDogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLCAyKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZU91dFF1YWQ6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgcmV0dXJuIC0oTWF0aC5wb3coKHBvcyAtIDEpLCAyKSAtIDEpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcywyKTt9XHJcbiAgICAgIHJldHVybiAtMC41ICogKChwb3MgLT0gMikgKiBwb3MgLSAyKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUluQ3ViaWM6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgcmV0dXJuIE1hdGgucG93KHBvcywgMyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VPdXRDdWJpYzogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gKE1hdGgucG93KChwb3MgLSAxKSwgMykgKyAxKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLDMpO31cclxuICAgICAgcmV0dXJuIDAuNSAqIChNYXRoLnBvdygocG9zIC0gMiksMykgKyAyKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUluUXVhcnQ6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgcmV0dXJuIE1hdGgucG93KHBvcywgNCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VPdXRRdWFydDogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gLShNYXRoLnBvdygocG9zIC0gMSksIDQpIC0gMSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VJbk91dFF1YXJ0OiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcyw0KTt9XHJcbiAgICAgIHJldHVybiAtMC41ICogKChwb3MgLT0gMikgKiBNYXRoLnBvdyhwb3MsMykgLSAyKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUluUXVpbnQ6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgcmV0dXJuIE1hdGgucG93KHBvcywgNSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VPdXRRdWludDogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gKE1hdGgucG93KChwb3MgLSAxKSwgNSkgKyAxKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUluT3V0UXVpbnQ6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLDUpO31cclxuICAgICAgcmV0dXJuIDAuNSAqIChNYXRoLnBvdygocG9zIC0gMiksNSkgKyAyKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUluU2luZTogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gLU1hdGguY29zKHBvcyAqIChNYXRoLlBJIC8gMikpICsgMTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZU91dFNpbmU6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgcmV0dXJuIE1hdGguc2luKHBvcyAqIChNYXRoLlBJIC8gMikpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlSW5PdXRTaW5lOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHJldHVybiAoLTAuNSAqIChNYXRoLmNvcyhNYXRoLlBJICogcG9zKSAtIDEpKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUluRXhwbzogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gKHBvcyA9PT0gMCkgPyAwIDogTWF0aC5wb3coMiwgMTAgKiAocG9zIC0gMSkpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlT3V0RXhwbzogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gKHBvcyA9PT0gMSkgPyAxIDogLU1hdGgucG93KDIsIC0xMCAqIHBvcykgKyAxO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlSW5PdXRFeHBvOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIGlmIChwb3MgPT09IDApIHtyZXR1cm4gMDt9XHJcbiAgICAgIGlmIChwb3MgPT09IDEpIHtyZXR1cm4gMTt9XHJcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIE1hdGgucG93KDIsMTAgKiAocG9zIC0gMSkpO31cclxuICAgICAgcmV0dXJuIDAuNSAqICgtTWF0aC5wb3coMiwgLTEwICogLS1wb3MpICsgMik7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VJbkNpcmM6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgcmV0dXJuIC0oTWF0aC5zcXJ0KDEgLSAocG9zICogcG9zKSkgLSAxKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZU91dENpcmM6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgcmV0dXJuIE1hdGguc3FydCgxIC0gTWF0aC5wb3coKHBvcyAtIDEpLCAyKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VJbk91dENpcmM6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gLTAuNSAqIChNYXRoLnNxcnQoMSAtIHBvcyAqIHBvcykgLSAxKTt9XHJcbiAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAocG9zIC09IDIpICogcG9zKSArIDEpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlT3V0Qm91bmNlOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIGlmICgocG9zKSA8ICgxIC8gMi43NSkpIHtcclxuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIHBvcyAqIHBvcyk7XHJcbiAgICAgIH0gZWxzZSBpZiAocG9zIDwgKDIgLyAyLjc1KSkge1xyXG4gICAgICAgIHJldHVybiAoNy41NjI1ICogKHBvcyAtPSAoMS41IC8gMi43NSkpICogcG9zICsgMC43NSk7XHJcbiAgICAgIH0gZWxzZSBpZiAocG9zIDwgKDIuNSAvIDIuNzUpKSB7XHJcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiAocG9zIC09ICgyLjI1IC8gMi43NSkpICogcG9zICsgMC45Mzc1KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIChwb3MgLT0gKDIuNjI1IC8gMi43NSkpICogcG9zICsgMC45ODQzNzUpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VJbkJhY2s6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgdmFyIHMgPSAxLjcwMTU4O1xyXG4gICAgICByZXR1cm4gKHBvcykgKiBwb3MgKiAoKHMgKyAxKSAqIHBvcyAtIHMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlT3V0QmFjazogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XHJcbiAgICAgIHJldHVybiAocG9zID0gcG9zIC0gMSkgKiBwb3MgKiAoKHMgKyAxKSAqIHBvcyArIHMpICsgMTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUluT3V0QmFjazogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XHJcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIChwb3MgKiBwb3MgKiAoKChzICo9ICgxLjUyNSkpICsgMSkgKiBwb3MgLSBzKSk7fVxyXG4gICAgICByZXR1cm4gMC41ICogKChwb3MgLT0gMikgKiBwb3MgKiAoKChzICo9ICgxLjUyNSkpICsgMSkgKiBwb3MgKyBzKSArIDIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlbGFzdGljOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHJldHVybiAtMSAqIE1hdGgucG93KDQsLTggKiBwb3MpICogTWF0aC5zaW4oKHBvcyAqIDYgLSAxKSAqICgyICogTWF0aC5QSSkgLyAyKSArIDE7XHJcbiAgICB9LFxyXG5cclxuICAgIHN3aW5nRnJvbVRvOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHZhciBzID0gMS43MDE1ODtcclxuICAgICAgcmV0dXJuICgocG9zIC89IDAuNSkgPCAxKSA/IDAuNSAqIChwb3MgKiBwb3MgKiAoKChzICo9ICgxLjUyNSkpICsgMSkgKiBwb3MgLSBzKSkgOlxyXG4gICAgICAgICAgMC41ICogKChwb3MgLT0gMikgKiBwb3MgKiAoKChzICo9ICgxLjUyNSkpICsgMSkgKiBwb3MgKyBzKSArIDIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzd2luZ0Zyb206IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgdmFyIHMgPSAxLjcwMTU4O1xyXG4gICAgICByZXR1cm4gcG9zICogcG9zICogKChzICsgMSkgKiBwb3MgLSBzKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3dpbmdUbzogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XHJcbiAgICAgIHJldHVybiAocG9zIC09IDEpICogcG9zICogKChzICsgMSkgKiBwb3MgKyBzKSArIDE7XHJcbiAgICB9LFxyXG5cclxuICAgIGJvdW5jZTogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICBpZiAocG9zIDwgKDEgLyAyLjc1KSkge1xyXG4gICAgICAgIHJldHVybiAoNy41NjI1ICogcG9zICogcG9zKTtcclxuICAgICAgfSBlbHNlIGlmIChwb3MgPCAoMiAvIDIuNzUpKSB7XHJcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiAocG9zIC09ICgxLjUgLyAyLjc1KSkgKiBwb3MgKyAwLjc1KTtcclxuICAgICAgfSBlbHNlIGlmIChwb3MgPCAoMi41IC8gMi43NSkpIHtcclxuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIChwb3MgLT0gKDIuMjUgLyAyLjc1KSkgKiBwb3MgKyAwLjkzNzUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAoNy41NjI1ICogKHBvcyAtPSAoMi42MjUgLyAyLjc1KSkgKiBwb3MgKyAwLjk4NDM3NSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYm91bmNlUGFzdDogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICBpZiAocG9zIDwgKDEgLyAyLjc1KSkge1xyXG4gICAgICAgIHJldHVybiAoNy41NjI1ICogcG9zICogcG9zKTtcclxuICAgICAgfSBlbHNlIGlmIChwb3MgPCAoMiAvIDIuNzUpKSB7XHJcbiAgICAgICAgcmV0dXJuIDIgLSAoNy41NjI1ICogKHBvcyAtPSAoMS41IC8gMi43NSkpICogcG9zICsgMC43NSk7XHJcbiAgICAgIH0gZWxzZSBpZiAocG9zIDwgKDIuNSAvIDIuNzUpKSB7XHJcbiAgICAgICAgcmV0dXJuIDIgLSAoNy41NjI1ICogKHBvcyAtPSAoMi4yNSAvIDIuNzUpKSAqIHBvcyArIDAuOTM3NSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIDIgLSAoNy41NjI1ICogKHBvcyAtPSAoMi42MjUgLyAyLjc1KSkgKiBwb3MgKyAwLjk4NDM3NSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUZyb21UbzogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsNCk7fVxyXG4gICAgICByZXR1cm4gLTAuNSAqICgocG9zIC09IDIpICogTWF0aC5wb3cocG9zLDMpIC0gMik7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VGcm9tOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHJldHVybiBNYXRoLnBvdyhwb3MsNCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VUbzogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLDAuMjUpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxufSgpKTtcclxuXHJcbi8qIVxyXG4gKiBUaGUgQmV6aWVyIG1hZ2ljIGluIHRoaXMgZmlsZSBpcyBhZGFwdGVkL2NvcGllZCBhbG1vc3Qgd2hvbGVzYWxlIGZyb21cclxuICogW1NjcmlwdHkyXShodHRwczovL2dpdGh1Yi5jb20vbWFkcm9iYnkvc2NyaXB0eTIvYmxvYi9tYXN0ZXIvc3JjL2VmZmVjdHMvdHJhbnNpdGlvbnMvY3ViaWMtYmV6aWVyLmpzKSxcclxuICogd2hpY2ggd2FzIGFkYXB0ZWQgZnJvbSBBcHBsZSBjb2RlICh3aGljaCBwcm9iYWJseSBjYW1lIGZyb21cclxuICogW2hlcmVdKGh0dHA6Ly9vcGVuc291cmNlLmFwcGxlLmNvbS9zb3VyY2UvV2ViQ29yZS9XZWJDb3JlLTk1NS42Ni9wbGF0Zm9ybS9ncmFwaGljcy9Vbml0QmV6aWVyLmgpKS5cclxuICogU3BlY2lhbCB0aGFua3MgdG8gQXBwbGUgYW5kIFRob21hcyBGdWNocyBmb3IgbXVjaCBvZiB0aGlzIGNvZGUuXHJcbiAqL1xyXG5cclxuLyohXHJcbiAqICBDb3B5cmlnaHQgKGMpIDIwMDYgQXBwbGUgQ29tcHV0ZXIsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxyXG4gKiAgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcbiAqXHJcbiAqICAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXHJcbiAqICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxyXG4gKlxyXG4gKiAgMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxyXG4gKiAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvblxyXG4gKiAgYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXHJcbiAqXHJcbiAqICAzLiBOZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBjb3B5cmlnaHQgaG9sZGVyKHMpIG5vciB0aGUgbmFtZXMgb2YgYW55XHJcbiAqICBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbVxyXG4gKiAgdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cclxuICpcclxuICogIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlNcclxuICogIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTyxcclxuICogIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxyXG4gKiAgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRVxyXG4gKiAgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xyXG4gKiAgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTO1xyXG4gKiAgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OXHJcbiAqICBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxyXG4gKiAgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcclxuICogIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxyXG4gKi9cclxuOyhmdW5jdGlvbiAoKSB7XHJcbiAgLy8gcG9ydCBvZiB3ZWJraXQgY3ViaWMgYmV6aWVyIGhhbmRsaW5nIGJ5IGh0dHA6Ly93d3cubmV0emdlc3RhLmRlL2Rldi9cclxuICBmdW5jdGlvbiBjdWJpY0JlemllckF0VGltZSh0LHAxeCxwMXkscDJ4LHAyeSxkdXJhdGlvbikge1xyXG4gICAgdmFyIGF4ID0gMCxieCA9IDAsY3ggPSAwLGF5ID0gMCxieSA9IDAsY3kgPSAwO1xyXG4gICAgZnVuY3Rpb24gc2FtcGxlQ3VydmVYKHQpIHtyZXR1cm4gKChheCAqIHQgKyBieCkgKiB0ICsgY3gpICogdDt9XHJcbiAgICBmdW5jdGlvbiBzYW1wbGVDdXJ2ZVkodCkge3JldHVybiAoKGF5ICogdCArIGJ5KSAqIHQgKyBjeSkgKiB0O31cclxuICAgIGZ1bmN0aW9uIHNhbXBsZUN1cnZlRGVyaXZhdGl2ZVgodCkge3JldHVybiAoMy4wICogYXggKiB0ICsgMi4wICogYngpICogdCArIGN4O31cclxuICAgIGZ1bmN0aW9uIHNvbHZlRXBzaWxvbihkdXJhdGlvbikge3JldHVybiAxLjAgLyAoMjAwLjAgKiBkdXJhdGlvbik7fVxyXG4gICAgZnVuY3Rpb24gc29sdmUoeCxlcHNpbG9uKSB7cmV0dXJuIHNhbXBsZUN1cnZlWShzb2x2ZUN1cnZlWCh4LGVwc2lsb24pKTt9XHJcbiAgICBmdW5jdGlvbiBmYWJzKG4pIHtpZiAobiA+PSAwKSB7cmV0dXJuIG47fWVsc2Uge3JldHVybiAwIC0gbjt9fVxyXG4gICAgZnVuY3Rpb24gc29sdmVDdXJ2ZVgoeCxlcHNpbG9uKSB7XHJcbiAgICAgIHZhciB0MCx0MSx0Mix4MixkMixpO1xyXG4gICAgICBmb3IgKHQyID0geCwgaSA9IDA7IGkgPCA4OyBpKyspIHt4MiA9IHNhbXBsZUN1cnZlWCh0MikgLSB4OyBpZiAoZmFicyh4MikgPCBlcHNpbG9uKSB7cmV0dXJuIHQyO30gZDIgPSBzYW1wbGVDdXJ2ZURlcml2YXRpdmVYKHQyKTsgaWYgKGZhYnMoZDIpIDwgMWUtNikge2JyZWFrO30gdDIgPSB0MiAtIHgyIC8gZDI7fVxyXG4gICAgICB0MCA9IDAuMDsgdDEgPSAxLjA7IHQyID0geDsgaWYgKHQyIDwgdDApIHtyZXR1cm4gdDA7fSBpZiAodDIgPiB0MSkge3JldHVybiB0MTt9XHJcbiAgICAgIHdoaWxlICh0MCA8IHQxKSB7eDIgPSBzYW1wbGVDdXJ2ZVgodDIpOyBpZiAoZmFicyh4MiAtIHgpIDwgZXBzaWxvbikge3JldHVybiB0Mjt9IGlmICh4ID4geDIpIHt0MCA9IHQyO31lbHNlIHt0MSA9IHQyO30gdDIgPSAodDEgLSB0MCkgKiAwLjUgKyB0MDt9XHJcbiAgICAgIHJldHVybiB0MjsgLy8gRmFpbHVyZS5cclxuICAgIH1cclxuICAgIGN4ID0gMy4wICogcDF4OyBieCA9IDMuMCAqIChwMnggLSBwMXgpIC0gY3g7IGF4ID0gMS4wIC0gY3ggLSBieDsgY3kgPSAzLjAgKiBwMXk7IGJ5ID0gMy4wICogKHAyeSAtIHAxeSkgLSBjeTsgYXkgPSAxLjAgLSBjeSAtIGJ5O1xyXG4gICAgcmV0dXJuIHNvbHZlKHQsIHNvbHZlRXBzaWxvbihkdXJhdGlvbikpO1xyXG4gIH1cclxuICAvKiFcclxuICAgKiAgZ2V0Q3ViaWNCZXppZXJUcmFuc2l0aW9uKHgxLCB5MSwgeDIsIHkyKSAtPiBGdW5jdGlvblxyXG4gICAqXHJcbiAgICogIEdlbmVyYXRlcyBhIHRyYW5zaXRpb24gZWFzaW5nIGZ1bmN0aW9uIHRoYXQgaXMgY29tcGF0aWJsZVxyXG4gICAqICB3aXRoIFdlYktpdCdzIENTUyB0cmFuc2l0aW9ucyBgLXdlYmtpdC10cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbmBcclxuICAgKiAgQ1NTIHByb3BlcnR5LlxyXG4gICAqXHJcbiAgICogIFRoZSBXM0MgaGFzIG1vcmUgaW5mb3JtYXRpb24gYWJvdXRcclxuICAgKiAgPGEgaHJlZj1cImh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtdHJhbnNpdGlvbnMvI3RyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uX3RhZ1wiPlxyXG4gICAqICBDU1MzIHRyYW5zaXRpb24gdGltaW5nIGZ1bmN0aW9uczwvYT4uXHJcbiAgICpcclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHgxXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSB5MVxyXG4gICAqICBAcGFyYW0ge251bWJlcn0geDJcclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHkyXHJcbiAgICogIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGdldEN1YmljQmV6aWVyVHJhbnNpdGlvbiAoeDEsIHkxLCB4MiwgeTIpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHJldHVybiBjdWJpY0JlemllckF0VGltZShwb3MseDEseTEseDIseTIsMSk7XHJcbiAgICB9O1xyXG4gIH1cclxuICAvLyBFbmQgcG9ydGVkIGNvZGVcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIEJlemllciBlYXNpbmcgZnVuY3Rpb24gYW5kIGF0dGFjaGVzIGl0IHRvIGBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGFgLiAgVGhpcyBmdW5jdGlvbiBnaXZlcyB5b3UgdG90YWwgY29udHJvbCBvdmVyIHRoZSBlYXNpbmcgY3VydmUuICBNYXR0aGV3IExlaW4ncyBbQ2Vhc2VyXShodHRwOi8vbWF0dGhld2xlaW4uY29tL2NlYXNlci8pIGlzIGEgdXNlZnVsIHRvb2wgZm9yIHZpc3VhbGl6aW5nIHRoZSBjdXJ2ZXMgeW91IGNhbiBtYWtlIHdpdGggdGhpcyBmdW5jdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBlYXNpbmcgY3VydmUuICBPdmVyd3JpdGVzIHRoZSBvbGQgZWFzaW5nIGZ1bmN0aW9uIG9uIFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYSBpZiBpdCBleGlzdHMuXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHgxXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkxXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHgyXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkyXHJcbiAgICogQHJldHVybiB7ZnVuY3Rpb259IFRoZSBlYXNpbmcgZnVuY3Rpb24gdGhhdCB3YXMgYXR0YWNoZWQgdG8gVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhLlxyXG4gICAqL1xyXG4gIFR3ZWVuYWJsZS5zZXRCZXppZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIChuYW1lLCB4MSwgeTEsIHgyLCB5Mikge1xyXG4gICAgdmFyIGN1YmljQmV6aWVyVHJhbnNpdGlvbiA9IGdldEN1YmljQmV6aWVyVHJhbnNpdGlvbih4MSwgeTEsIHgyLCB5Mik7XHJcbiAgICBjdWJpY0JlemllclRyYW5zaXRpb24ueDEgPSB4MTtcclxuICAgIGN1YmljQmV6aWVyVHJhbnNpdGlvbi55MSA9IHkxO1xyXG4gICAgY3ViaWNCZXppZXJUcmFuc2l0aW9uLngyID0geDI7XHJcbiAgICBjdWJpY0JlemllclRyYW5zaXRpb24ueTIgPSB5MjtcclxuXHJcbiAgICByZXR1cm4gVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhW25hbWVdID0gY3ViaWNCZXppZXJUcmFuc2l0aW9uO1xyXG4gIH07XHJcblxyXG5cclxuICAvKipcclxuICAgKiBgZGVsZXRlYHMgYW4gZWFzaW5nIGZ1bmN0aW9uIGZyb20gYFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYWAuICBCZSBjYXJlZnVsIHdpdGggdGhpcyBtZXRob2QsIGFzIGl0IGBkZWxldGVgcyB3aGF0ZXZlciBlYXNpbmcgZm9ybXVsYSBtYXRjaGVzIGBuYW1lYCAod2hpY2ggbWVhbnMgeW91IGNhbiBkZWxldGUgZGVmYXVsdCBTaGlmdHkgZWFzaW5nIGZ1bmN0aW9ucykuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZWFzaW5nIGZ1bmN0aW9uIHRvIGRlbGV0ZS5cclxuICAgKiBAcmV0dXJuIHtmdW5jdGlvbn1cclxuICAgKi9cclxuICBUd2VlbmFibGUudW5zZXRCZXppZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICBkZWxldGUgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhW25hbWVdO1xyXG4gIH07XHJcblxyXG59KSgpO1xyXG5cclxuOyhmdW5jdGlvbiAoKSB7XHJcblxyXG4gIGZ1bmN0aW9uIGdldEludGVycG9sYXRlZFZhbHVlcyAoXHJcbiAgICBmcm9tLCBjdXJyZW50LCB0YXJnZXRTdGF0ZSwgcG9zaXRpb24sIGVhc2luZykge1xyXG4gICAgcmV0dXJuIFR3ZWVuYWJsZS50d2VlblByb3BzKFxyXG4gICAgICBwb3NpdGlvbiwgY3VycmVudCwgZnJvbSwgdGFyZ2V0U3RhdGUsIDEsIDAsIGVhc2luZyk7XHJcbiAgfVxyXG5cclxuICAvLyBGYWtlIGEgVHdlZW5hYmxlIGFuZCBwYXRjaCBzb21lIGludGVybmFscy4gIFRoaXMgYXBwcm9hY2ggYWxsb3dzIHVzIHRvXHJcbiAgLy8gc2tpcCB1bmVjY2Vzc2FyeSBwcm9jZXNzaW5nIGFuZCBvYmplY3QgcmVjcmVhdGlvbiwgY3V0dGluZyBkb3duIG9uIGdhcmJhZ2VcclxuICAvLyBjb2xsZWN0aW9uIHBhdXNlcy5cclxuICB2YXIgbW9ja1R3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcclxuICBtb2NrVHdlZW5hYmxlLl9maWx0ZXJBcmdzID0gW107XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbXB1dGUgdGhlIG1pZHBvaW50IG9mIHR3byBPYmplY3RzLiAgVGhpcyBtZXRob2QgZWZmZWN0aXZlbHkgY2FsY3VsYXRlcyBhIHNwZWNpZmljIGZyYW1lIG9mIGFuaW1hdGlvbiB0aGF0IFtUd2VlbmFibGUjdHdlZW5dKHNoaWZ0eS5jb3JlLmpzLmh0bWwjdHdlZW4pIGRvZXMgbWFueSB0aW1lcyBvdmVyIHRoZSBjb3Vyc2Ugb2YgYSB0d2Vlbi5cclxuICAgKlxyXG4gICAqIEV4YW1wbGU6XHJcbiAgICpcclxuICAgKiBgYGBcclxuICAgKiAgdmFyIGludGVycG9sYXRlZFZhbHVlcyA9IFR3ZWVuYWJsZS5pbnRlcnBvbGF0ZSh7XHJcbiAgICogICAgd2lkdGg6ICcxMDBweCcsXHJcbiAgICogICAgb3BhY2l0eTogMCxcclxuICAgKiAgICBjb2xvcjogJyNmZmYnXHJcbiAgICogIH0sIHtcclxuICAgKiAgICB3aWR0aDogJzIwMHB4JyxcclxuICAgKiAgICBvcGFjaXR5OiAxLFxyXG4gICAqICAgIGNvbG9yOiAnIzAwMCdcclxuICAgKiAgfSwgMC41KTtcclxuICAgKlxyXG4gICAqICBjb25zb2xlLmxvZyhpbnRlcnBvbGF0ZWRWYWx1ZXMpO1xyXG4gICAqICAvLyB7b3BhY2l0eTogMC41LCB3aWR0aDogXCIxNTBweFwiLCBjb2xvcjogXCJyZ2IoMTI3LDEyNywxMjcpXCJ9XHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZnJvbSBUaGUgc3RhcnRpbmcgdmFsdWVzIHRvIHR3ZWVuIGZyb20uXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFN0YXRlIFRoZSBlbmRpbmcgdmFsdWVzIHRvIHR3ZWVuIHRvLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBUaGUgbm9ybWFsaXplZCBwb3NpdGlvbiB2YWx1ZSAoYmV0d2VlbiAwLjAgYW5kIDEuMCkgdG8gaW50ZXJwb2xhdGUgdGhlIHZhbHVlcyBiZXR3ZWVuIGBmcm9tYCBhbmQgYHRvYCBmb3IuICBgZnJvbWAgcmVwcmVzZW50cyAwIGFuZCBgdG9gIHJlcHJlc2VudHMgYDFgLlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfE9iamVjdH0gZWFzaW5nIFRoZSBlYXNpbmcgY3VydmUocykgdG8gY2FsY3VsYXRlIHRoZSBtaWRwb2ludCBhZ2FpbnN0LiAgWW91IGNhbiByZWZlcmVuY2UgYW55IGVhc2luZyBmdW5jdGlvbiBhdHRhY2hlZCB0byBgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhYC4gIElmIG9taXR0ZWQsIHRoaXMgZGVmYXVsdHMgdG8gXCJsaW5lYXJcIi5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAgICovXHJcbiAgVHdlZW5hYmxlLmludGVycG9sYXRlID0gZnVuY3Rpb24gKGZyb20sIHRhcmdldFN0YXRlLCBwb3NpdGlvbiwgZWFzaW5nKSB7XHJcbiAgICB2YXIgY3VycmVudCA9IFR3ZWVuYWJsZS5zaGFsbG93Q29weSh7fSwgZnJvbSk7XHJcbiAgICB2YXIgZWFzaW5nT2JqZWN0ID0gVHdlZW5hYmxlLmNvbXBvc2VFYXNpbmdPYmplY3QoXHJcbiAgICAgIGZyb20sIGVhc2luZyB8fCAnbGluZWFyJyk7XHJcblxyXG4gICAgbW9ja1R3ZWVuYWJsZS5zZXQoe30pO1xyXG5cclxuICAgIC8vIEFsaWFzIGFuZCByZXVzZSB0aGUgX2ZpbHRlckFyZ3MgYXJyYXkgaW5zdGVhZCBvZiByZWNyZWF0aW5nIGl0LlxyXG4gICAgdmFyIGZpbHRlckFyZ3MgPSBtb2NrVHdlZW5hYmxlLl9maWx0ZXJBcmdzO1xyXG4gICAgZmlsdGVyQXJncy5sZW5ndGggPSAwO1xyXG4gICAgZmlsdGVyQXJnc1swXSA9IGN1cnJlbnQ7XHJcbiAgICBmaWx0ZXJBcmdzWzFdID0gZnJvbTtcclxuICAgIGZpbHRlckFyZ3NbMl0gPSB0YXJnZXRTdGF0ZTtcclxuICAgIGZpbHRlckFyZ3NbM10gPSBlYXNpbmdPYmplY3Q7XHJcblxyXG4gICAgLy8gQW55IGRlZmluZWQgdmFsdWUgdHJhbnNmb3JtYXRpb24gbXVzdCBiZSBhcHBsaWVkXHJcbiAgICBUd2VlbmFibGUuYXBwbHlGaWx0ZXIobW9ja1R3ZWVuYWJsZSwgJ3R3ZWVuQ3JlYXRlZCcpO1xyXG4gICAgVHdlZW5hYmxlLmFwcGx5RmlsdGVyKG1vY2tUd2VlbmFibGUsICdiZWZvcmVUd2VlbicpO1xyXG5cclxuICAgIHZhciBpbnRlcnBvbGF0ZWRWYWx1ZXMgPSBnZXRJbnRlcnBvbGF0ZWRWYWx1ZXMoXHJcbiAgICAgIGZyb20sIGN1cnJlbnQsIHRhcmdldFN0YXRlLCBwb3NpdGlvbiwgZWFzaW5nT2JqZWN0KTtcclxuXHJcbiAgICAvLyBUcmFuc2Zvcm0gdmFsdWVzIGJhY2sgaW50byB0aGVpciBvcmlnaW5hbCBmb3JtYXRcclxuICAgIFR3ZWVuYWJsZS5hcHBseUZpbHRlcihtb2NrVHdlZW5hYmxlLCAnYWZ0ZXJUd2VlbicpO1xyXG5cclxuICAgIHJldHVybiBpbnRlcnBvbGF0ZWRWYWx1ZXM7XHJcbiAgfTtcclxuXHJcbn0oKSk7XHJcblxyXG4vKipcclxuICogQWRkcyBzdHJpbmcgaW50ZXJwb2xhdGlvbiBzdXBwb3J0IHRvIFNoaWZ0eS5cclxuICpcclxuICogVGhlIFRva2VuIGV4dGVuc2lvbiBhbGxvd3MgU2hpZnR5IHRvIHR3ZWVuIG51bWJlcnMgaW5zaWRlIG9mIHN0cmluZ3MuICBBbW9uZyBvdGhlciB0aGluZ3MsIHRoaXMgYWxsb3dzIHlvdSB0byBhbmltYXRlIENTUyBwcm9wZXJ0aWVzLiAgRm9yIGV4YW1wbGUsIHlvdSBjYW4gZG8gdGhpczpcclxuICpcclxuICogYGBgXHJcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XHJcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XHJcbiAqICAgZnJvbTogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDQ1cHgpJ30sXHJcbiAqICAgdG86IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg5MHhwKSd9XHJcbiAqIH0pO1xyXG4gKiBgYGBcclxuICpcclxuICogYHRyYW5zbGF0ZVgoNDUpYCB3aWxsIGJlIHR3ZWVuZWQgdG8gYHRyYW5zbGF0ZVgoOTApYC4gIFRvIGRlbW9uc3RyYXRlOlxyXG4gKlxyXG4gKiBgYGBcclxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcclxuICogdHdlZW5hYmxlLnR3ZWVuKHtcclxuICogICBmcm9tOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoNDVweCknfSxcclxuICogICB0bzogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDkwcHgpJ30sXHJcbiAqICAgc3RlcDogZnVuY3Rpb24gKHN0YXRlKSB7XHJcbiAqICAgICBjb25zb2xlLmxvZyhzdGF0ZS50cmFuc2Zvcm0pO1xyXG4gKiAgIH1cclxuICogfSk7XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBUaGUgYWJvdmUgc25pcHBldCB3aWxsIGxvZyBzb21ldGhpbmcgbGlrZSB0aGlzIGluIHRoZSBjb25zb2xlOlxyXG4gKlxyXG4gKiBgYGBcclxuICogdHJhbnNsYXRlWCg2MC4zcHgpXHJcbiAqIC4uLlxyXG4gKiB0cmFuc2xhdGVYKDc2LjA1cHgpXHJcbiAqIC4uLlxyXG4gKiB0cmFuc2xhdGVYKDkwcHgpXHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBBbm90aGVyIHVzZSBmb3IgdGhpcyBpcyBhbmltYXRpbmcgY29sb3JzOlxyXG4gKlxyXG4gKiBgYGBcclxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcclxuICogdHdlZW5hYmxlLnR3ZWVuKHtcclxuICogICBmcm9tOiB7IGNvbG9yOiAncmdiKDAsMjU1LDApJ30sXHJcbiAqICAgdG86IHsgY29sb3I6ICdyZ2IoMjU1LDAsMjU1KSd9LFxyXG4gKiAgIHN0ZXA6IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gKiAgICAgY29uc29sZS5sb2coc3RhdGUuY29sb3IpO1xyXG4gKiAgIH1cclxuICogfSk7XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBUaGUgYWJvdmUgc25pcHBldCB3aWxsIGxvZyBzb21ldGhpbmcgbGlrZSB0aGlzOlxyXG4gKlxyXG4gKiBgYGBcclxuICogcmdiKDg0LDE3MCw4NClcclxuICogLi4uXHJcbiAqIHJnYigxNzAsODQsMTcwKVxyXG4gKiAuLi5cclxuICogcmdiKDI1NSwwLDI1NSlcclxuICogYGBgXHJcbiAqXHJcbiAqIFRoaXMgZXh0ZW5zaW9uIGFsc28gc3VwcG9ydHMgaGV4YWRlY2ltYWwgY29sb3JzLCBpbiBib3RoIGxvbmcgKGAjZmYwMGZmYCkgYW5kIHNob3J0IChgI2YwZmApIGZvcm1zLiAgQmUgYXdhcmUgdGhhdCBoZXhhZGVjaW1hbCBpbnB1dCB2YWx1ZXMgd2lsbCBiZSBjb252ZXJ0ZWQgaW50byB0aGUgZXF1aXZhbGVudCBSR0Igb3V0cHV0IHZhbHVlcy4gIFRoaXMgaXMgZG9uZSB0byBvcHRpbWl6ZSBmb3IgcGVyZm9ybWFuY2UuXHJcbiAqXHJcbiAqIGBgYFxyXG4gKiB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xyXG4gKiB0d2VlbmFibGUudHdlZW4oe1xyXG4gKiAgIGZyb206IHsgY29sb3I6ICcjMGYwJ30sXHJcbiAqICAgdG86IHsgY29sb3I6ICcjZjBmJ30sXHJcbiAqICAgc3RlcDogZnVuY3Rpb24gKHN0YXRlKSB7XHJcbiAqICAgICBjb25zb2xlLmxvZyhzdGF0ZS5jb2xvcik7XHJcbiAqICAgfVxyXG4gKiB9KTtcclxuICogYGBgXHJcbiAqXHJcbiAqIFRoaXMgc25pcHBldCB3aWxsIGdlbmVyYXRlIHRoZSBzYW1lIG91dHB1dCBhcyB0aGUgb25lIGJlZm9yZSBpdCBiZWNhdXNlIGVxdWl2YWxlbnQgdmFsdWVzIHdlcmUgc3VwcGxpZWQgKGp1c3QgaW4gaGV4YWRlY2ltYWwgZm9ybSByYXRoZXIgdGhhbiBSR0IpOlxyXG4gKlxyXG4gKiBgYGBcclxuICogcmdiKDg0LDE3MCw4NClcclxuICogLi4uXHJcbiAqIHJnYigxNzAsODQsMTcwKVxyXG4gKiAuLi5cclxuICogcmdiKDI1NSwwLDI1NSlcclxuICogYGBgXHJcbiAqXHJcbiAqICMjIEVhc2luZyBzdXBwb3J0XHJcbiAqXHJcbiAqIEVhc2luZyB3b3JrcyBzb21ld2hhdCBkaWZmZXJlbnRseSBpbiB0aGUgVG9rZW4gZXh0ZW5zaW9uLiAgVGhpcyBpcyBiZWNhdXNlIHNvbWUgQ1NTIHByb3BlcnRpZXMgaGF2ZSBtdWx0aXBsZSB2YWx1ZXMgaW4gdGhlbSwgYW5kIHlvdSBtaWdodCBuZWVkIHRvIHR3ZWVuIGVhY2ggdmFsdWUgYWxvbmcgaXRzIG93biBlYXNpbmcgY3VydmUuICBBIGJhc2ljIGV4YW1wbGU6XHJcbiAqXHJcbiAqIGBgYFxyXG4gKiB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xyXG4gKiB0d2VlbmFibGUudHdlZW4oe1xyXG4gKiAgIGZyb206IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwcHgpIHRyYW5zbGF0ZVkoMHB4KSd9LFxyXG4gKiAgIHRvOiB7IHRyYW5zZm9ybTogICAndHJhbnNsYXRlWCgxMDBweCkgdHJhbnNsYXRlWSgxMDBweCknfSxcclxuICogICBlYXNpbmc6IHsgdHJhbnNmb3JtOiAnZWFzZUluUXVhZCcgfSxcclxuICogICBzdGVwOiBmdW5jdGlvbiAoc3RhdGUpIHtcclxuICogICAgIGNvbnNvbGUubG9nKHN0YXRlLnRyYW5zZm9ybSk7XHJcbiAqICAgfVxyXG4gKiB9KTtcclxuICogYGBgXHJcbiAqXHJcbiAqIFRoZSBhYm92ZSBzbmlwcGV0IGNyZWF0ZSB2YWx1ZXMgbGlrZSB0aGlzOlxyXG4gKlxyXG4gKiBgYGBcclxuICogdHJhbnNsYXRlWCgxMS41NjAwMDAwMDAwMDAwMDJweCkgdHJhbnNsYXRlWSgxMS41NjAwMDAwMDAwMDAwMDJweClcclxuICogLi4uXHJcbiAqIHRyYW5zbGF0ZVgoNDYuMjQwMDAwMDAwMDAwMDFweCkgdHJhbnNsYXRlWSg0Ni4yNDAwMDAwMDAwMDAwMXB4KVxyXG4gKiAuLi5cclxuICogdHJhbnNsYXRlWCgxMDBweCkgdHJhbnNsYXRlWSgxMDBweClcclxuICogYGBgXHJcbiAqXHJcbiAqIEluIHRoaXMgY2FzZSwgdGhlIHZhbHVlcyBmb3IgYHRyYW5zbGF0ZVhgIGFuZCBgdHJhbnNsYXRlWWAgYXJlIGFsd2F5cyB0aGUgc2FtZSBmb3IgZWFjaCBzdGVwIG9mIHRoZSB0d2VlbiwgYmVjYXVzZSB0aGV5IGhhdmUgdGhlIHNhbWUgc3RhcnQgYW5kIGVuZCBwb2ludHMgYW5kIGJvdGggdXNlIHRoZSBzYW1lIGVhc2luZyBjdXJ2ZS4gIFdlIGNhbiBhbHNvIHR3ZWVuIGB0cmFuc2xhdGVYYCBhbmQgYHRyYW5zbGF0ZVlgIGFsb25nIGluZGVwZW5kZW50IGN1cnZlczpcclxuICpcclxuICogYGBgXHJcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XHJcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XHJcbiAqICAgZnJvbTogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCkgdHJhbnNsYXRlWSgwcHgpJ30sXHJcbiAqICAgdG86IHsgdHJhbnNmb3JtOiAgICd0cmFuc2xhdGVYKDEwMHB4KSB0cmFuc2xhdGVZKDEwMHB4KSd9LFxyXG4gKiAgIGVhc2luZzogeyB0cmFuc2Zvcm06ICdlYXNlSW5RdWFkIGJvdW5jZScgfSxcclxuICogICBzdGVwOiBmdW5jdGlvbiAoc3RhdGUpIHtcclxuICogICAgIGNvbnNvbGUubG9nKHN0YXRlLnRyYW5zZm9ybSk7XHJcbiAqICAgfVxyXG4gKiB9KTtcclxuICogYGBgXHJcbiAqXHJcbiAqIFRoZSBhYm92ZSBzbmlwcGV0IGNyZWF0ZSB2YWx1ZXMgbGlrZSB0aGlzOlxyXG4gKlxyXG4gKiBgYGBcclxuICogdHJhbnNsYXRlWCgxMC44OXB4KSB0cmFuc2xhdGVZKDgyLjM1NTYyNXB4KVxyXG4gKiAuLi5cclxuICogdHJhbnNsYXRlWCg0NC44OTAwMDAwMDAwMDAwMXB4KSB0cmFuc2xhdGVZKDg2LjczMDYyNTAwMDAwMDAycHgpXHJcbiAqIC4uLlxyXG4gKiB0cmFuc2xhdGVYKDEwMHB4KSB0cmFuc2xhdGVZKDEwMHB4KVxyXG4gKiBgYGBcclxuICpcclxuICogYHRyYW5zbGF0ZVhgIGFuZCBgdHJhbnNsYXRlWWAgYXJlIG5vdCBpbiBzeW5jIGFueW1vcmUsIGJlY2F1c2UgYGVhc2VJblF1YWRgIHdhcyBzcGVjaWZpZWQgZm9yIGB0cmFuc2xhdGVYYCBhbmQgYGJvdW5jZWAgZm9yIGB0cmFuc2xhdGVZYC4gIE1peGluZyBhbmQgbWF0Y2hpbmcgZWFzaW5nIGN1cnZlcyBjYW4gbWFrZSBmb3Igc29tZSBpbnRlcmVzdGluZyBtb3Rpb24gaW4geW91ciBhbmltYXRpb25zLlxyXG4gKlxyXG4gKiBUaGUgb3JkZXIgb2YgdGhlIHNwYWNlLXNlcGFyYXRlZCBlYXNpbmcgY3VydmVzIGNvcnJlc3BvbmQgdGhlIHRva2VuIHZhbHVlcyB0aGV5IGFwcGx5IHRvLiAgSWYgdGhlcmUgYXJlIG1vcmUgdG9rZW4gdmFsdWVzIHRoYW4gZWFzaW5nIGN1cnZlcyBsaXN0ZWQsIHRoZSBsYXN0IGVhc2luZyBjdXJ2ZSBsaXN0ZWQgaXMgdXNlZC5cclxuICovXHJcbmZ1bmN0aW9uIHRva2VuICgpIHtcclxuICAvLyBGdW5jdGlvbmFsaXR5IGZvciB0aGlzIGV4dGVuc2lvbiBydW5zIGltcGxpY2l0bHkgaWYgaXQgaXMgbG9hZGVkLlxyXG59IC8qISovXHJcblxyXG4vLyB0b2tlbiBmdW5jdGlvbiBpcyBkZWZpbmVkIGFib3ZlIG9ubHkgc28gdGhhdCBkb3gtZm91bmRhdGlvbiBzZWVzIGl0IGFzXHJcbi8vIGRvY3VtZW50YXRpb24gYW5kIHJlbmRlcnMgaXQuICBJdCBpcyBuZXZlciB1c2VkLCBhbmQgaXMgb3B0aW1pemVkIGF3YXkgYXRcclxuLy8gYnVpbGQgdGltZS5cclxuXHJcbjsoZnVuY3Rpb24gKFR3ZWVuYWJsZSkge1xyXG5cclxuICAvKiFcclxuICAgKiBAdHlwZWRlZiB7e1xyXG4gICAqICAgZm9ybWF0U3RyaW5nOiBzdHJpbmdcclxuICAgKiAgIGNodW5rTmFtZXM6IEFycmF5LjxzdHJpbmc+XHJcbiAgICogfX1cclxuICAgKi9cclxuICB2YXIgZm9ybWF0TWFuaWZlc3Q7XHJcblxyXG4gIC8vIENPTlNUQU5UU1xyXG5cclxuICB2YXIgUl9OVU1CRVJfQ09NUE9ORU5UID0gLyhcXGR8XFwtfFxcLikvO1xyXG4gIHZhciBSX0ZPUk1BVF9DSFVOS1MgPSAvKFteXFwtMC05XFwuXSspL2c7XHJcbiAgdmFyIFJfVU5GT1JNQVRURURfVkFMVUVTID0gL1swLTkuXFwtXSsvZztcclxuICB2YXIgUl9SR0IgPSBuZXcgUmVnRXhwKFxyXG4gICAgJ3JnYlxcXFwoJyArIFJfVU5GT1JNQVRURURfVkFMVUVTLnNvdXJjZSArXHJcbiAgICAoLyxcXHMqLy5zb3VyY2UpICsgUl9VTkZPUk1BVFRFRF9WQUxVRVMuc291cmNlICtcclxuICAgICgvLFxccyovLnNvdXJjZSkgKyBSX1VORk9STUFUVEVEX1ZBTFVFUy5zb3VyY2UgKyAnXFxcXCknLCAnZycpO1xyXG4gIHZhciBSX1JHQl9QUkVGSVggPSAvXi4qXFwoLztcclxuICB2YXIgUl9IRVggPSAvIyhbMC05XXxbYS1mXSl7Myw2fS9naTtcclxuICB2YXIgVkFMVUVfUExBQ0VIT0xERVIgPSAnVkFMJztcclxuXHJcbiAgLy8gSEVMUEVSU1xyXG5cclxuICB2YXIgZ2V0Rm9ybWF0Q2h1bmtzRnJvbV9hY2N1bXVsYXRvciA9IFtdO1xyXG4gIC8qIVxyXG4gICAqIEBwYXJhbSB7QXJyYXkubnVtYmVyfSByYXdWYWx1ZXNcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJlZml4XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn1cclxuICAgKi9cclxuICBmdW5jdGlvbiBnZXRGb3JtYXRDaHVua3NGcm9tIChyYXdWYWx1ZXMsIHByZWZpeCkge1xyXG4gICAgZ2V0Rm9ybWF0Q2h1bmtzRnJvbV9hY2N1bXVsYXRvci5sZW5ndGggPSAwO1xyXG5cclxuICAgIHZhciByYXdWYWx1ZXNMZW5ndGggPSByYXdWYWx1ZXMubGVuZ3RoO1xyXG4gICAgdmFyIGk7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IHJhd1ZhbHVlc0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGdldEZvcm1hdENodW5rc0Zyb21fYWNjdW11bGF0b3IucHVzaCgnXycgKyBwcmVmaXggKyAnXycgKyBpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZ2V0Rm9ybWF0Q2h1bmtzRnJvbV9hY2N1bXVsYXRvcjtcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXR0ZWRTdHJpbmdcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge3N0cmluZ31cclxuICAgKi9cclxuICBmdW5jdGlvbiBnZXRGb3JtYXRTdHJpbmdGcm9tIChmb3JtYXR0ZWRTdHJpbmcpIHtcclxuICAgIHZhciBjaHVua3MgPSBmb3JtYXR0ZWRTdHJpbmcubWF0Y2goUl9GT1JNQVRfQ0hVTktTKTtcclxuXHJcbiAgICBpZiAoIWNodW5rcykge1xyXG4gICAgICAvLyBjaHVua3Mgd2lsbCBiZSBudWxsIGlmIHRoZXJlIHdlcmUgbm8gdG9rZW5zIHRvIHBhcnNlIGluXHJcbiAgICAgIC8vIGZvcm1hdHRlZFN0cmluZyAoZm9yIGV4YW1wbGUsIGlmIGZvcm1hdHRlZFN0cmluZyBpcyAnMicpLiAgQ29lcmNlXHJcbiAgICAgIC8vIGNodW5rcyB0byBiZSB1c2VmdWwgaGVyZS5cclxuICAgICAgY2h1bmtzID0gWycnLCAnJ107XHJcblxyXG4gICAgICAvLyBJZiB0aGVyZSBpcyBvbmx5IG9uZSBjaHVuaywgYXNzdW1lIHRoYXQgdGhlIHN0cmluZyBpcyBhIG51bWJlclxyXG4gICAgICAvLyBmb2xsb3dlZCBieSBhIHRva2VuLi4uXHJcbiAgICAgIC8vIE5PVEU6IFRoaXMgbWF5IGJlIGFuIHVud2lzZSBhc3N1bXB0aW9uLlxyXG4gICAgfSBlbHNlIGlmIChjaHVua3MubGVuZ3RoID09PSAxIHx8XHJcbiAgICAgICAgLy8gLi4ub3IgaWYgdGhlIHN0cmluZyBzdGFydHMgd2l0aCBhIG51bWJlciBjb21wb25lbnQgKFwiLlwiLCBcIi1cIiwgb3IgYVxyXG4gICAgICAgIC8vIGRpZ2l0KS4uLlxyXG4gICAgICAgIGZvcm1hdHRlZFN0cmluZ1swXS5tYXRjaChSX05VTUJFUl9DT01QT05FTlQpKSB7XHJcbiAgICAgIC8vIC4uLnByZXBlbmQgYW4gZW1wdHkgc3RyaW5nIGhlcmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGZvcm1hdHRlZCBudW1iZXJcclxuICAgICAgLy8gaXMgcHJvcGVybHkgcmVwbGFjZWQgYnkgVkFMVUVfUExBQ0VIT0xERVJcclxuICAgICAgY2h1bmtzLnVuc2hpZnQoJycpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjaHVua3Muam9pbihWQUxVRV9QTEFDRUhPTERFUik7XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBDb252ZXJ0IGFsbCBoZXggY29sb3IgdmFsdWVzIHdpdGhpbiBhIHN0cmluZyB0byBhbiByZ2Igc3RyaW5nLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBtb2RpZmllZCBvYmpcclxuICAgKi9cclxuICBmdW5jdGlvbiBzYW5pdGl6ZU9iamVjdEZvckhleFByb3BzIChzdGF0ZU9iamVjdCkge1xyXG4gICAgVHdlZW5hYmxlLmVhY2goc3RhdGVPYmplY3QsIGZ1bmN0aW9uIChwcm9wKSB7XHJcbiAgICAgIHZhciBjdXJyZW50UHJvcCA9IHN0YXRlT2JqZWN0W3Byb3BdO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBjdXJyZW50UHJvcCA9PT0gJ3N0cmluZycgJiYgY3VycmVudFByb3AubWF0Y2goUl9IRVgpKSB7XHJcbiAgICAgICAgc3RhdGVPYmplY3RbcHJvcF0gPSBzYW5pdGl6ZUhleENodW5rc1RvUkdCKGN1cnJlbnRQcm9wKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gIHNhbml0aXplSGV4Q2h1bmtzVG9SR0IgKHN0cikge1xyXG4gICAgcmV0dXJuIGZpbHRlclN0cmluZ0NodW5rcyhSX0hFWCwgc3RyLCBjb252ZXJ0SGV4VG9SR0IpO1xyXG4gIH1cclxuXHJcbiAgLyohXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhleFN0cmluZ1xyXG4gICAqXHJcbiAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNvbnZlcnRIZXhUb1JHQiAoaGV4U3RyaW5nKSB7XHJcbiAgICB2YXIgcmdiQXJyID0gaGV4VG9SR0JBcnJheShoZXhTdHJpbmcpO1xyXG4gICAgcmV0dXJuICdyZ2IoJyArIHJnYkFyclswXSArICcsJyArIHJnYkFyclsxXSArICcsJyArIHJnYkFyclsyXSArICcpJztcclxuICB9XHJcblxyXG4gIHZhciBoZXhUb1JHQkFycmF5X3JldHVybkFycmF5ID0gW107XHJcbiAgLyohXHJcbiAgICogQ29udmVydCBhIGhleGFkZWNpbWFsIHN0cmluZyB0byBhbiBhcnJheSB3aXRoIHRocmVlIGl0ZW1zLCBvbmUgZWFjaCBmb3JcclxuICAgKiB0aGUgcmVkLCBibHVlLCBhbmQgZ3JlZW4gZGVjaW1hbCB2YWx1ZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGV4IEEgaGV4YWRlY2ltYWwgc3RyaW5nLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMge0FycmF5LjxudW1iZXI+fSBUaGUgY29udmVydGVkIEFycmF5IG9mIFJHQiB2YWx1ZXMgaWYgYGhleGAgaXMgYVxyXG4gICAqIHZhbGlkIHN0cmluZywgb3IgYW4gQXJyYXkgb2YgdGhyZWUgMCdzLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGhleFRvUkdCQXJyYXkgKGhleCkge1xyXG5cclxuICAgIGhleCA9IGhleC5yZXBsYWNlKC8jLywgJycpO1xyXG5cclxuICAgIC8vIElmIHRoZSBzdHJpbmcgaXMgYSBzaG9ydGhhbmQgdGhyZWUgZGlnaXQgaGV4IG5vdGF0aW9uLCBub3JtYWxpemUgaXQgdG9cclxuICAgIC8vIHRoZSBzdGFuZGFyZCBzaXggZGlnaXQgbm90YXRpb25cclxuICAgIGlmIChoZXgubGVuZ3RoID09PSAzKSB7XHJcbiAgICAgIGhleCA9IGhleC5zcGxpdCgnJyk7XHJcbiAgICAgIGhleCA9IGhleFswXSArIGhleFswXSArIGhleFsxXSArIGhleFsxXSArIGhleFsyXSArIGhleFsyXTtcclxuICAgIH1cclxuXHJcbiAgICBoZXhUb1JHQkFycmF5X3JldHVybkFycmF5WzBdID0gaGV4VG9EZWMoaGV4LnN1YnN0cigwLCAyKSk7XHJcbiAgICBoZXhUb1JHQkFycmF5X3JldHVybkFycmF5WzFdID0gaGV4VG9EZWMoaGV4LnN1YnN0cigyLCAyKSk7XHJcbiAgICBoZXhUb1JHQkFycmF5X3JldHVybkFycmF5WzJdID0gaGV4VG9EZWMoaGV4LnN1YnN0cig0LCAyKSk7XHJcblxyXG4gICAgcmV0dXJuIGhleFRvUkdCQXJyYXlfcmV0dXJuQXJyYXk7XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBDb252ZXJ0IGEgYmFzZS0xNiBudW1iZXIgdG8gYmFzZS0xMC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gaGV4IFRoZSB2YWx1ZSB0byBjb252ZXJ0XHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgYmFzZS0xMCBlcXVpdmFsZW50IG9mIGBoZXhgLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGhleFRvRGVjIChoZXgpIHtcclxuICAgIHJldHVybiBwYXJzZUludChoZXgsIDE2KTtcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIFJ1bnMgYSBmaWx0ZXIgb3BlcmF0aW9uIG9uIGFsbCBjaHVua3Mgb2YgYSBzdHJpbmcgdGhhdCBtYXRjaCBhIFJlZ0V4cFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtSZWdFeHB9IHBhdHRlcm5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdW5maWx0ZXJlZFN0cmluZ1xyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oc3RyaW5nKX0gZmlsdGVyXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZmlsdGVyU3RyaW5nQ2h1bmtzIChwYXR0ZXJuLCB1bmZpbHRlcmVkU3RyaW5nLCBmaWx0ZXIpIHtcclxuICAgIHZhciBwYXR0ZW5NYXRjaGVzID0gdW5maWx0ZXJlZFN0cmluZy5tYXRjaChwYXR0ZXJuKTtcclxuICAgIHZhciBmaWx0ZXJlZFN0cmluZyA9IHVuZmlsdGVyZWRTdHJpbmcucmVwbGFjZShwYXR0ZXJuLCBWQUxVRV9QTEFDRUhPTERFUik7XHJcblxyXG4gICAgaWYgKHBhdHRlbk1hdGNoZXMpIHtcclxuICAgICAgdmFyIHBhdHRlbk1hdGNoZXNMZW5ndGggPSBwYXR0ZW5NYXRjaGVzLmxlbmd0aDtcclxuICAgICAgdmFyIGN1cnJlbnRDaHVuaztcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0dGVuTWF0Y2hlc0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY3VycmVudENodW5rID0gcGF0dGVuTWF0Y2hlcy5zaGlmdCgpO1xyXG4gICAgICAgIGZpbHRlcmVkU3RyaW5nID0gZmlsdGVyZWRTdHJpbmcucmVwbGFjZShcclxuICAgICAgICAgIFZBTFVFX1BMQUNFSE9MREVSLCBmaWx0ZXIoY3VycmVudENodW5rKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmlsdGVyZWRTdHJpbmc7XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBDaGVjayBmb3IgZmxvYXRpbmcgcG9pbnQgdmFsdWVzIHdpdGhpbiByZ2Igc3RyaW5ncyBhbmQgcm91bmRzIHRoZW0uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gZm9ybWF0dGVkU3RyaW5nXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc2FuaXRpemVSR0JDaHVua3MgKGZvcm1hdHRlZFN0cmluZykge1xyXG4gICAgcmV0dXJuIGZpbHRlclN0cmluZ0NodW5rcyhSX1JHQiwgZm9ybWF0dGVkU3RyaW5nLCBzYW5pdGl6ZVJHQkNodW5rKTtcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZ2JDaHVua1xyXG4gICAqXHJcbiAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHNhbml0aXplUkdCQ2h1bmsgKHJnYkNodW5rKSB7XHJcbiAgICB2YXIgbnVtYmVycyA9IHJnYkNodW5rLm1hdGNoKFJfVU5GT1JNQVRURURfVkFMVUVTKTtcclxuICAgIHZhciBudW1iZXJzTGVuZ3RoID0gbnVtYmVycy5sZW5ndGg7XHJcbiAgICB2YXIgc2FuaXRpemVkU3RyaW5nID0gcmdiQ2h1bmsubWF0Y2goUl9SR0JfUFJFRklYKVswXTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bWJlcnNMZW5ndGg7IGkrKykge1xyXG4gICAgICBzYW5pdGl6ZWRTdHJpbmcgKz0gcGFyc2VJbnQobnVtYmVyc1tpXSwgMTApICsgJywnO1xyXG4gICAgfVxyXG5cclxuICAgIHNhbml0aXplZFN0cmluZyA9IHNhbml0aXplZFN0cmluZy5zbGljZSgwLCAtMSkgKyAnKSc7XHJcblxyXG4gICAgcmV0dXJuIHNhbml0aXplZFN0cmluZztcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBBbiBPYmplY3Qgb2YgZm9ybWF0TWFuaWZlc3RzIHRoYXQgY29ycmVzcG9uZCB0b1xyXG4gICAqIHRoZSBzdHJpbmcgcHJvcGVydGllcyBvZiBzdGF0ZU9iamVjdFxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGdldEZvcm1hdE1hbmlmZXN0cyAoc3RhdGVPYmplY3QpIHtcclxuICAgIHZhciBtYW5pZmVzdEFjY3VtdWxhdG9yID0ge307XHJcblxyXG4gICAgVHdlZW5hYmxlLmVhY2goc3RhdGVPYmplY3QsIGZ1bmN0aW9uIChwcm9wKSB7XHJcbiAgICAgIHZhciBjdXJyZW50UHJvcCA9IHN0YXRlT2JqZWN0W3Byb3BdO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBjdXJyZW50UHJvcCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICB2YXIgcmF3VmFsdWVzID0gZ2V0VmFsdWVzRnJvbShjdXJyZW50UHJvcCk7XHJcblxyXG4gICAgICAgIG1hbmlmZXN0QWNjdW11bGF0b3JbcHJvcF0gPSB7XHJcbiAgICAgICAgICAnZm9ybWF0U3RyaW5nJzogZ2V0Rm9ybWF0U3RyaW5nRnJvbShjdXJyZW50UHJvcClcclxuICAgICAgICAgICwnY2h1bmtOYW1lcyc6IGdldEZvcm1hdENodW5rc0Zyb20ocmF3VmFsdWVzLCBwcm9wKVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBtYW5pZmVzdEFjY3VtdWxhdG9yO1xyXG4gIH1cclxuXHJcbiAgLyohXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGZvcm1hdE1hbmlmZXN0c1xyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGV4cGFuZEZvcm1hdHRlZFByb3BlcnRpZXMgKHN0YXRlT2JqZWN0LCBmb3JtYXRNYW5pZmVzdHMpIHtcclxuICAgIFR3ZWVuYWJsZS5lYWNoKGZvcm1hdE1hbmlmZXN0cywgZnVuY3Rpb24gKHByb3ApIHtcclxuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gc3RhdGVPYmplY3RbcHJvcF07XHJcbiAgICAgIHZhciByYXdWYWx1ZXMgPSBnZXRWYWx1ZXNGcm9tKGN1cnJlbnRQcm9wKTtcclxuICAgICAgdmFyIHJhd1ZhbHVlc0xlbmd0aCA9IHJhd1ZhbHVlcy5sZW5ndGg7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhd1ZhbHVlc0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc3RhdGVPYmplY3RbZm9ybWF0TWFuaWZlc3RzW3Byb3BdLmNodW5rTmFtZXNbaV1dID0gK3Jhd1ZhbHVlc1tpXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGVsZXRlIHN0YXRlT2JqZWN0W3Byb3BdO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZm9ybWF0TWFuaWZlc3RzXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY29sbGFwc2VGb3JtYXR0ZWRQcm9wZXJ0aWVzIChzdGF0ZU9iamVjdCwgZm9ybWF0TWFuaWZlc3RzKSB7XHJcbiAgICBUd2VlbmFibGUuZWFjaChmb3JtYXRNYW5pZmVzdHMsIGZ1bmN0aW9uIChwcm9wKSB7XHJcbiAgICAgIHZhciBjdXJyZW50UHJvcCA9IHN0YXRlT2JqZWN0W3Byb3BdO1xyXG4gICAgICB2YXIgZm9ybWF0Q2h1bmtzID0gZXh0cmFjdFByb3BlcnR5Q2h1bmtzKFxyXG4gICAgICAgIHN0YXRlT2JqZWN0LCBmb3JtYXRNYW5pZmVzdHNbcHJvcF0uY2h1bmtOYW1lcyk7XHJcbiAgICAgIHZhciB2YWx1ZXNMaXN0ID0gZ2V0VmFsdWVzTGlzdChcclxuICAgICAgICBmb3JtYXRDaHVua3MsIGZvcm1hdE1hbmlmZXN0c1twcm9wXS5jaHVua05hbWVzKTtcclxuICAgICAgY3VycmVudFByb3AgPSBnZXRGb3JtYXR0ZWRWYWx1ZXMoXHJcbiAgICAgICAgZm9ybWF0TWFuaWZlc3RzW3Byb3BdLmZvcm1hdFN0cmluZywgdmFsdWVzTGlzdCk7XHJcbiAgICAgIHN0YXRlT2JqZWN0W3Byb3BdID0gc2FuaXRpemVSR0JDaHVua3MoY3VycmVudFByb3ApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcclxuICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBjaHVua05hbWVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBleHRyYWN0ZWQgdmFsdWUgY2h1bmtzLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGV4dHJhY3RQcm9wZXJ0eUNodW5rcyAoc3RhdGVPYmplY3QsIGNodW5rTmFtZXMpIHtcclxuICAgIHZhciBleHRyYWN0ZWRWYWx1ZXMgPSB7fTtcclxuICAgIHZhciBjdXJyZW50Q2h1bmtOYW1lLCBjaHVua05hbWVzTGVuZ3RoID0gY2h1bmtOYW1lcy5sZW5ndGg7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua05hbWVzTGVuZ3RoOyBpKyspIHtcclxuICAgICAgY3VycmVudENodW5rTmFtZSA9IGNodW5rTmFtZXNbaV07XHJcbiAgICAgIGV4dHJhY3RlZFZhbHVlc1tjdXJyZW50Q2h1bmtOYW1lXSA9IHN0YXRlT2JqZWN0W2N1cnJlbnRDaHVua05hbWVdO1xyXG4gICAgICBkZWxldGUgc3RhdGVPYmplY3RbY3VycmVudENodW5rTmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGV4dHJhY3RlZFZhbHVlcztcclxuICB9XHJcblxyXG4gIHZhciBnZXRWYWx1ZXNMaXN0X2FjY3VtdWxhdG9yID0gW107XHJcbiAgLyohXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0XHJcbiAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gY2h1bmtOYW1lc1xyXG4gICAqXHJcbiAgICogQHJldHVybiB7QXJyYXkuPG51bWJlcj59XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZ2V0VmFsdWVzTGlzdCAoc3RhdGVPYmplY3QsIGNodW5rTmFtZXMpIHtcclxuICAgIGdldFZhbHVlc0xpc3RfYWNjdW11bGF0b3IubGVuZ3RoID0gMDtcclxuICAgIHZhciBjaHVua05hbWVzTGVuZ3RoID0gY2h1bmtOYW1lcy5sZW5ndGg7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua05hbWVzTGVuZ3RoOyBpKyspIHtcclxuICAgICAgZ2V0VmFsdWVzTGlzdF9hY2N1bXVsYXRvci5wdXNoKHN0YXRlT2JqZWN0W2NodW5rTmFtZXNbaV1dKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZ2V0VmFsdWVzTGlzdF9hY2N1bXVsYXRvcjtcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXRTdHJpbmdcclxuICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSByYXdWYWx1ZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge3N0cmluZ31cclxuICAgKi9cclxuICBmdW5jdGlvbiBnZXRGb3JtYXR0ZWRWYWx1ZXMgKGZvcm1hdFN0cmluZywgcmF3VmFsdWVzKSB7XHJcbiAgICB2YXIgZm9ybWF0dGVkVmFsdWVTdHJpbmcgPSBmb3JtYXRTdHJpbmc7XHJcbiAgICB2YXIgcmF3VmFsdWVzTGVuZ3RoID0gcmF3VmFsdWVzLmxlbmd0aDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhd1ZhbHVlc0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGZvcm1hdHRlZFZhbHVlU3RyaW5nID0gZm9ybWF0dGVkVmFsdWVTdHJpbmcucmVwbGFjZShcclxuICAgICAgICBWQUxVRV9QTEFDRUhPTERFUiwgK3Jhd1ZhbHVlc1tpXS50b0ZpeGVkKDQpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZm9ybWF0dGVkVmFsdWVTdHJpbmc7XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBOb3RlOiBJdCdzIHRoZSBkdXR5IG9mIHRoZSBjYWxsZXIgdG8gY29udmVydCB0aGUgQXJyYXkgZWxlbWVudHMgb2YgdGhlXHJcbiAgICogcmV0dXJuIHZhbHVlIGludG8gbnVtYmVycy4gIFRoaXMgaXMgYSBwZXJmb3JtYW5jZSBvcHRpbWl6YXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gZm9ybWF0dGVkU3RyaW5nXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPnxudWxsfVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGdldFZhbHVlc0Zyb20gKGZvcm1hdHRlZFN0cmluZykge1xyXG4gICAgcmV0dXJuIGZvcm1hdHRlZFN0cmluZy5tYXRjaChSX1VORk9STUFUVEVEX1ZBTFVFUyk7XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nT2JqZWN0XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHRva2VuRGF0YVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGV4cGFuZEVhc2luZ09iamVjdCAoZWFzaW5nT2JqZWN0LCB0b2tlbkRhdGEpIHtcclxuICAgIFR3ZWVuYWJsZS5lYWNoKHRva2VuRGF0YSwgZnVuY3Rpb24gKHByb3ApIHtcclxuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gdG9rZW5EYXRhW3Byb3BdO1xyXG4gICAgICB2YXIgY2h1bmtOYW1lcyA9IGN1cnJlbnRQcm9wLmNodW5rTmFtZXM7XHJcbiAgICAgIHZhciBjaHVua0xlbmd0aCA9IGNodW5rTmFtZXMubGVuZ3RoO1xyXG4gICAgICB2YXIgZWFzaW5nQ2h1bmtzID0gZWFzaW5nT2JqZWN0W3Byb3BdLnNwbGl0KCcgJyk7XHJcbiAgICAgIHZhciBsYXN0RWFzaW5nQ2h1bmsgPSBlYXNpbmdDaHVua3NbZWFzaW5nQ2h1bmtzLmxlbmd0aCAtIDFdO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZWFzaW5nT2JqZWN0W2NodW5rTmFtZXNbaV1dID0gZWFzaW5nQ2h1bmtzW2ldIHx8IGxhc3RFYXNpbmdDaHVuaztcclxuICAgICAgfVxyXG5cclxuICAgICAgZGVsZXRlIGVhc2luZ09iamVjdFtwcm9wXTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyohXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ09iamVjdFxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0b2tlbkRhdGFcclxuICAgKi9cclxuICBmdW5jdGlvbiBjb2xsYXBzZUVhc2luZ09iamVjdCAoZWFzaW5nT2JqZWN0LCB0b2tlbkRhdGEpIHtcclxuICAgIFR3ZWVuYWJsZS5lYWNoKHRva2VuRGF0YSwgZnVuY3Rpb24gKHByb3ApIHtcclxuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gdG9rZW5EYXRhW3Byb3BdO1xyXG4gICAgICB2YXIgY2h1bmtOYW1lcyA9IGN1cnJlbnRQcm9wLmNodW5rTmFtZXM7XHJcbiAgICAgIHZhciBjaHVua0xlbmd0aCA9IGNodW5rTmFtZXMubGVuZ3RoO1xyXG4gICAgICB2YXIgY29tcG9zZWRFYXNpbmdTdHJpbmcgPSAnJztcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2h1bmtMZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbXBvc2VkRWFzaW5nU3RyaW5nICs9ICcgJyArIGVhc2luZ09iamVjdFtjaHVua05hbWVzW2ldXTtcclxuICAgICAgICBkZWxldGUgZWFzaW5nT2JqZWN0W2NodW5rTmFtZXNbaV1dO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlYXNpbmdPYmplY3RbcHJvcF0gPSBjb21wb3NlZEVhc2luZ1N0cmluZy5zdWJzdHIoMSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuZmlsdGVyLnRva2VuID0ge1xyXG4gICAgJ3R3ZWVuQ3JlYXRlZCc6IGZ1bmN0aW9uIChjdXJyZW50U3RhdGUsIGZyb21TdGF0ZSwgdG9TdGF0ZSwgZWFzaW5nT2JqZWN0KSB7XHJcbiAgICAgIHNhbml0aXplT2JqZWN0Rm9ySGV4UHJvcHMoY3VycmVudFN0YXRlKTtcclxuICAgICAgc2FuaXRpemVPYmplY3RGb3JIZXhQcm9wcyhmcm9tU3RhdGUpO1xyXG4gICAgICBzYW5pdGl6ZU9iamVjdEZvckhleFByb3BzKHRvU3RhdGUpO1xyXG4gICAgICB0aGlzLl90b2tlbkRhdGEgPSBnZXRGb3JtYXRNYW5pZmVzdHMoY3VycmVudFN0YXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgJ2JlZm9yZVR3ZWVuJzogZnVuY3Rpb24gKGN1cnJlbnRTdGF0ZSwgZnJvbVN0YXRlLCB0b1N0YXRlLCBlYXNpbmdPYmplY3QpIHtcclxuICAgICAgZXhwYW5kRWFzaW5nT2JqZWN0KGVhc2luZ09iamVjdCwgdGhpcy5fdG9rZW5EYXRhKTtcclxuICAgICAgZXhwYW5kRm9ybWF0dGVkUHJvcGVydGllcyhjdXJyZW50U3RhdGUsIHRoaXMuX3Rva2VuRGF0YSk7XHJcbiAgICAgIGV4cGFuZEZvcm1hdHRlZFByb3BlcnRpZXMoZnJvbVN0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xyXG4gICAgICBleHBhbmRGb3JtYXR0ZWRQcm9wZXJ0aWVzKHRvU3RhdGUsIHRoaXMuX3Rva2VuRGF0YSk7XHJcbiAgICB9LFxyXG5cclxuICAgICdhZnRlclR3ZWVuJzogZnVuY3Rpb24gKGN1cnJlbnRTdGF0ZSwgZnJvbVN0YXRlLCB0b1N0YXRlLCBlYXNpbmdPYmplY3QpIHtcclxuICAgICAgY29sbGFwc2VGb3JtYXR0ZWRQcm9wZXJ0aWVzKGN1cnJlbnRTdGF0ZSwgdGhpcy5fdG9rZW5EYXRhKTtcclxuICAgICAgY29sbGFwc2VGb3JtYXR0ZWRQcm9wZXJ0aWVzKGZyb21TdGF0ZSwgdGhpcy5fdG9rZW5EYXRhKTtcclxuICAgICAgY29sbGFwc2VGb3JtYXR0ZWRQcm9wZXJ0aWVzKHRvU3RhdGUsIHRoaXMuX3Rva2VuRGF0YSk7XHJcbiAgICAgIGNvbGxhcHNlRWFzaW5nT2JqZWN0KGVhc2luZ09iamVjdCwgdGhpcy5fdG9rZW5EYXRhKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxufSAoVHdlZW5hYmxlKSk7XHJcblxyXG59KHRoaXMpKTtcclxuIiwiLy8gQ2lyY2xlIHNoYXBlZCBwcm9ncmVzcyBiYXJcclxuXHJcbnZhciBTaGFwZSA9IHJlcXVpcmUoJy4vc2hhcGUnKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG5cclxuXHJcbnZhciBDaXJjbGUgPSBmdW5jdGlvbiBDaXJjbGUoY29udGFpbmVyLCBvcHRpb25zKSB7XHJcbiAgICAvLyBVc2UgdHdvIGFyY3MgdG8gZm9ybSBhIGNpcmNsZVxyXG4gICAgLy8gU2VlIHRoaXMgYW5zd2VyIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEwNDc3MzM0LzE0NDYwOTJcclxuICAgIHRoaXMuX3BhdGhUZW1wbGF0ZSA9XHJcbiAgICAgICAgJ00gNTAsNTAgbSAwLC17cmFkaXVzfScgK1xyXG4gICAgICAgICcgYSB7cmFkaXVzfSx7cmFkaXVzfSAwIDEgMSAwLHsycmFkaXVzfScgK1xyXG4gICAgICAgICcgYSB7cmFkaXVzfSx7cmFkaXVzfSAwIDEgMSAwLC17MnJhZGl1c30nO1xyXG5cclxuICAgIFNoYXBlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5DaXJjbGUucHJvdG90eXBlID0gbmV3IFNoYXBlKCk7XHJcbkNpcmNsZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDaXJjbGU7XHJcblxyXG5DaXJjbGUucHJvdG90eXBlLl9wYXRoU3RyaW5nID0gZnVuY3Rpb24gX3BhdGhTdHJpbmcob3B0cykge1xyXG4gICAgdmFyIHdpZHRoT2ZXaWRlciA9IG9wdHMuc3Ryb2tlV2lkdGg7XHJcbiAgICBpZiAob3B0cy50cmFpbFdpZHRoICYmIG9wdHMudHJhaWxXaWR0aCA+IG9wdHMuc3Ryb2tlV2lkdGgpIHtcclxuICAgICAgICB3aWR0aE9mV2lkZXIgPSBvcHRzLnRyYWlsV2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHIgPSA1MCAtIHdpZHRoT2ZXaWRlciAvIDI7XHJcblxyXG4gICAgcmV0dXJuIHV0aWxzLnJlbmRlcih0aGlzLl9wYXRoVGVtcGxhdGUsIHtcclxuICAgICAgICByYWRpdXM6IHIsXHJcbiAgICAgICAgJzJyYWRpdXMnOiByICogMlxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5DaXJjbGUucHJvdG90eXBlLl90cmFpbFN0cmluZyA9IGZ1bmN0aW9uIF90cmFpbFN0cmluZyhvcHRzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcGF0aFN0cmluZyhvcHRzKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2lyY2xlO1xyXG4iLCIvLyBMaW5lIHNoYXBlZCBwcm9ncmVzcyBiYXJcclxuXHJcbnZhciBTaGFwZSA9IHJlcXVpcmUoJy4vc2hhcGUnKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG5cclxuXHJcbnZhciBMaW5lID0gZnVuY3Rpb24gTGluZShjb250YWluZXIsIG9wdGlvbnMpIHtcclxuICAgIHRoaXMuX3BhdGhUZW1wbGF0ZSA9ICdNIDAse2NlbnRlcn0gTCAxMDAse2NlbnRlcn0nO1xyXG4gICAgU2hhcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcbkxpbmUucHJvdG90eXBlID0gbmV3IFNoYXBlKCk7XHJcbkxpbmUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTGluZTtcclxuXHJcbkxpbmUucHJvdG90eXBlLl9pbml0aWFsaXplU3ZnID0gZnVuY3Rpb24gX2luaXRpYWxpemVTdmcoc3ZnLCBvcHRzKSB7XHJcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCAxMDAgJyArIG9wdHMuc3Ryb2tlV2lkdGgpO1xyXG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgncHJlc2VydmVBc3BlY3RSYXRpbycsICdub25lJyk7XHJcbn07XHJcblxyXG5MaW5lLnByb3RvdHlwZS5fcGF0aFN0cmluZyA9IGZ1bmN0aW9uIF9wYXRoU3RyaW5nKG9wdHMpIHtcclxuICAgIHJldHVybiB1dGlscy5yZW5kZXIodGhpcy5fcGF0aFRlbXBsYXRlLCB7XHJcbiAgICAgICAgY2VudGVyOiBvcHRzLnN0cm9rZVdpZHRoIC8gMlxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5MaW5lLnByb3RvdHlwZS5fdHJhaWxTdHJpbmcgPSBmdW5jdGlvbiBfdHJhaWxTdHJpbmcob3B0cykge1xyXG4gICAgcmV0dXJuIHRoaXMuX3BhdGhTdHJpbmcob3B0cyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpbmU7XHJcbiIsIi8vIERpZmZlcmVudCBzaGFwZWQgcHJvZ3Jlc3MgYmFyc1xyXG52YXIgTGluZSA9IHJlcXVpcmUoJy4vbGluZScpO1xyXG52YXIgQ2lyY2xlID0gcmVxdWlyZSgnLi9jaXJjbGUnKTtcclxudmFyIFNxdWFyZSA9IHJlcXVpcmUoJy4vc3F1YXJlJyk7XHJcblxyXG4vLyBMb3dlciBsZXZlbCBBUEkgdG8gdXNlIGFueSBTVkcgcGF0aFxyXG52YXIgUGF0aCA9IHJlcXVpcmUoJy4vcGF0aCcpO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgTGluZTogTGluZSxcclxuICAgIENpcmNsZTogQ2lyY2xlLFxyXG4gICAgU3F1YXJlOiBTcXVhcmUsXHJcbiAgICBQYXRoOiBQYXRoXHJcbn07XHJcbiIsIi8vIExvd2VyIGxldmVsIEFQSSB0byBhbmltYXRlIGFueSBraW5kIG9mIHN2ZyBwYXRoXHJcblxyXG52YXIgVHdlZW5hYmxlID0gcmVxdWlyZSgnc2hpZnR5Jyk7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuXHJcbnZhciBFQVNJTkdfQUxJQVNFUyA9IHtcclxuICAgIGVhc2VJbjogJ2Vhc2VJbkN1YmljJyxcclxuICAgIGVhc2VPdXQ6ICdlYXNlT3V0Q3ViaWMnLFxyXG4gICAgZWFzZUluT3V0OiAnZWFzZUluT3V0Q3ViaWMnXHJcbn07XHJcblxyXG5cclxudmFyIFBhdGggPSBmdW5jdGlvbiBQYXRoKHBhdGgsIG9wdHMpIHtcclxuICAgIC8vIERlZmF1bHQgcGFyYW1ldGVycyBmb3IgYW5pbWF0aW9uXHJcbiAgICBvcHRzID0gdXRpbHMuZXh0ZW5kKHtcclxuICAgICAgICBkdXJhdGlvbjogODAwLFxyXG4gICAgICAgIGVhc2luZzogJ2xpbmVhcicsXHJcbiAgICAgICAgZnJvbToge30sXHJcbiAgICAgICAgdG86IHt9LFxyXG4gICAgICAgIHN0ZXA6IGZ1bmN0aW9uKCkge31cclxuICAgIH0sIG9wdHMpO1xyXG5cclxuICAgIHZhciBlbGVtZW50O1xyXG4gICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XHJcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGF0aCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGVsZW1lbnQgPSBwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJldmVhbCAucGF0aCBhcyBwdWJsaWMgYXR0cmlidXRlXHJcbiAgICB0aGlzLnBhdGggPSBlbGVtZW50O1xyXG4gICAgdGhpcy5fb3B0cyA9IG9wdHM7XHJcbiAgICB0aGlzLl90d2VlbmFibGUgPSBudWxsO1xyXG5cclxuICAgIC8vIFNldCB1cCB0aGUgc3RhcnRpbmcgcG9zaXRpb25zXHJcbiAgICB2YXIgbGVuZ3RoID0gdGhpcy5wYXRoLmdldFRvdGFsTGVuZ3RoKCk7XHJcbiAgICB0aGlzLnBhdGguc3R5bGUuc3Ryb2tlRGFzaGFycmF5ID0gbGVuZ3RoICsgJyAnICsgbGVuZ3RoO1xyXG4gICAgdGhpcy5zZXQoMCk7XHJcbn07XHJcblxyXG5QYXRoLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uIHZhbHVlKCkge1xyXG4gICAgdmFyIG9mZnNldCA9IHRoaXMuX2dldENvbXB1dGVkRGFzaE9mZnNldCgpO1xyXG4gICAgdmFyIGxlbmd0aCA9IHRoaXMucGF0aC5nZXRUb3RhbExlbmd0aCgpO1xyXG5cclxuICAgIHZhciBwcm9ncmVzcyA9IDEgLSBvZmZzZXQgLyBsZW5ndGg7XHJcbiAgICAvLyBSb3VuZCBudW1iZXIgdG8gcHJldmVudCByZXR1cm5pbmcgdmVyeSBzbWFsbCBudW1iZXIgbGlrZSAxZS0zMCwgd2hpY2hcclxuICAgIC8vIGlzIHByYWN0aWNhbGx5IDBcclxuICAgIHJldHVybiBwYXJzZUZsb2F0KHByb2dyZXNzLnRvRml4ZWQoNiksIDEwKTtcclxufTtcclxuXHJcblBhdGgucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldChwcm9ncmVzcykge1xyXG4gICAgdGhpcy5zdG9wKCk7XHJcblxyXG4gICAgdGhpcy5wYXRoLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSB0aGlzLl9wcm9ncmVzc1RvT2Zmc2V0KHByb2dyZXNzKTtcclxuXHJcbiAgICB2YXIgc3RlcCA9IHRoaXMuX29wdHMuc3RlcDtcclxuICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKHN0ZXApKSB7XHJcbiAgICAgICAgdmFyIGVhc2luZyA9IHRoaXMuX2Vhc2luZyh0aGlzLl9vcHRzLmVhc2luZyk7XHJcbiAgICAgICAgdmFyIHZhbHVlcyA9IHRoaXMuX2NhbGN1bGF0ZVRvKHByb2dyZXNzLCBlYXNpbmcpO1xyXG4gICAgICAgIHN0ZXAodmFsdWVzLCB0aGlzLl9vcHRzLnNoYXBlfHx0aGlzLCB0aGlzLl9vcHRzLmF0dGFjaG1lbnQpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuUGF0aC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uIHN0b3AoKSB7XHJcbiAgICB0aGlzLl9zdG9wVHdlZW4oKTtcclxuICAgIHRoaXMucGF0aC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gdGhpcy5fZ2V0Q29tcHV0ZWREYXNoT2Zmc2V0KCk7XHJcbn07XHJcblxyXG4vLyBNZXRob2QgaW50cm9kdWNlZCBoZXJlOlxyXG4vLyBodHRwOi8vamFrZWFyY2hpYmFsZC5jb20vMjAxMy9hbmltYXRlZC1saW5lLWRyYXdpbmctc3ZnL1xyXG5QYXRoLnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24gYW5pbWF0ZShwcm9ncmVzcywgb3B0cywgY2IpIHtcclxuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xyXG5cclxuICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKG9wdHMpKSB7XHJcbiAgICAgICAgY2IgPSBvcHRzO1xyXG4gICAgICAgIG9wdHMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcGFzc2VkT3B0cyA9IHV0aWxzLmV4dGVuZCh7fSwgb3B0cyk7XHJcblxyXG4gICAgLy8gQ29weSBkZWZhdWx0IG9wdHMgdG8gbmV3IG9iamVjdCBzbyBkZWZhdWx0cyBhcmUgbm90IG1vZGlmaWVkXHJcbiAgICB2YXIgZGVmYXVsdE9wdHMgPSB1dGlscy5leHRlbmQoe30sIHRoaXMuX29wdHMpO1xyXG4gICAgb3B0cyA9IHV0aWxzLmV4dGVuZChkZWZhdWx0T3B0cywgb3B0cyk7XHJcblxyXG4gICAgdmFyIHNoaWZ0eUVhc2luZyA9IHRoaXMuX2Vhc2luZyhvcHRzLmVhc2luZyk7XHJcbiAgICB2YXIgdmFsdWVzID0gdGhpcy5fcmVzb2x2ZUZyb21BbmRUbyhwcm9ncmVzcywgc2hpZnR5RWFzaW5nLCBwYXNzZWRPcHRzKTtcclxuXHJcbiAgICB0aGlzLnN0b3AoKTtcclxuXHJcbiAgICAvLyBUcmlnZ2VyIGEgbGF5b3V0IHNvIHN0eWxlcyBhcmUgY2FsY3VsYXRlZCAmIHRoZSBicm93c2VyXHJcbiAgICAvLyBwaWNrcyB1cCB0aGUgc3RhcnRpbmcgcG9zaXRpb24gYmVmb3JlIGFuaW1hdGluZ1xyXG4gICAgdGhpcy5wYXRoLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIHZhciBvZmZzZXQgPSB0aGlzLl9nZXRDb21wdXRlZERhc2hPZmZzZXQoKTtcclxuICAgIHZhciBuZXdPZmZzZXQgPSB0aGlzLl9wcm9ncmVzc1RvT2Zmc2V0KHByb2dyZXNzKTtcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLl90d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XHJcbiAgICB0aGlzLl90d2VlbmFibGUudHdlZW4oe1xyXG4gICAgICAgIGZyb206IHV0aWxzLmV4dGVuZCh7IG9mZnNldDogb2Zmc2V0IH0sIHZhbHVlcy5mcm9tKSxcclxuICAgICAgICB0bzogdXRpbHMuZXh0ZW5kKHsgb2Zmc2V0OiBuZXdPZmZzZXQgfSwgdmFsdWVzLnRvKSxcclxuICAgICAgICBkdXJhdGlvbjogb3B0cy5kdXJhdGlvbixcclxuICAgICAgICBlYXNpbmc6IHNoaWZ0eUVhc2luZyxcclxuICAgICAgICBzdGVwOiBmdW5jdGlvbihzdGF0ZSkge1xyXG4gICAgICAgICAgICBzZWxmLnBhdGguc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IHN0YXRlLm9mZnNldDtcclxuICAgICAgICAgICAgb3B0cy5zdGVwKHN0YXRlLCBvcHRzLnNoYXBlfHxzZWxmLCBvcHRzLmF0dGFjaG1lbnQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmluaXNoOiBmdW5jdGlvbihzdGF0ZSkge1xyXG4gICAgICAgICAgICBpZiAodXRpbHMuaXNGdW5jdGlvbihjYikpIHtcclxuICAgICAgICAgICAgICAgIGNiKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufTtcclxuXHJcblBhdGgucHJvdG90eXBlLl9nZXRDb21wdXRlZERhc2hPZmZzZXQgPSBmdW5jdGlvbiBfZ2V0Q29tcHV0ZWREYXNoT2Zmc2V0KCkge1xyXG4gICAgdmFyIGNvbXB1dGVkU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLnBhdGgsIG51bGwpO1xyXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoY29tcHV0ZWRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdzdHJva2UtZGFzaG9mZnNldCcpLCAxMCk7XHJcbn07XHJcblxyXG5QYXRoLnByb3RvdHlwZS5fcHJvZ3Jlc3NUb09mZnNldCA9IGZ1bmN0aW9uIF9wcm9ncmVzc1RvT2Zmc2V0KHByb2dyZXNzKSB7XHJcbiAgICB2YXIgbGVuZ3RoID0gdGhpcy5wYXRoLmdldFRvdGFsTGVuZ3RoKCk7XHJcbiAgICByZXR1cm4gbGVuZ3RoIC0gcHJvZ3Jlc3MgKiBsZW5ndGg7XHJcbn07XHJcblxyXG4vLyBSZXNvbHZlcyBmcm9tIGFuZCB0byB2YWx1ZXMgZm9yIGFuaW1hdGlvbi5cclxuUGF0aC5wcm90b3R5cGUuX3Jlc29sdmVGcm9tQW5kVG8gPSBmdW5jdGlvbiBfcmVzb2x2ZUZyb21BbmRUbyhwcm9ncmVzcywgZWFzaW5nLCBvcHRzKSB7XHJcbiAgICBpZiAob3B0cy5mcm9tICYmIG9wdHMudG8pIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBmcm9tOiBvcHRzLmZyb20sXHJcbiAgICAgICAgICAgIHRvOiBvcHRzLnRvXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGZyb206IHRoaXMuX2NhbGN1bGF0ZUZyb20oZWFzaW5nKSxcclxuICAgICAgICB0bzogdGhpcy5fY2FsY3VsYXRlVG8ocHJvZ3Jlc3MsIGVhc2luZylcclxuICAgIH07XHJcbn07XHJcblxyXG4vLyBDYWxjdWxhdGUgYGZyb21gIHZhbHVlcyBmcm9tIG9wdGlvbnMgcGFzc2VkIGF0IGluaXRpYWxpemF0aW9uXHJcblBhdGgucHJvdG90eXBlLl9jYWxjdWxhdGVGcm9tID0gZnVuY3Rpb24gX2NhbGN1bGF0ZUZyb20oZWFzaW5nKSB7XHJcbiAgICByZXR1cm4gVHdlZW5hYmxlLmludGVycG9sYXRlKHRoaXMuX29wdHMuZnJvbSwgdGhpcy5fb3B0cy50bywgdGhpcy52YWx1ZSgpLCBlYXNpbmcpO1xyXG59O1xyXG5cclxuLy8gQ2FsY3VsYXRlIGB0b2AgdmFsdWVzIGZyb20gb3B0aW9ucyBwYXNzZWQgYXQgaW5pdGlhbGl6YXRpb25cclxuUGF0aC5wcm90b3R5cGUuX2NhbGN1bGF0ZVRvID0gZnVuY3Rpb24gX2NhbGN1bGF0ZVRvKHByb2dyZXNzLCBlYXNpbmcpIHtcclxuICAgIHJldHVybiBUd2VlbmFibGUuaW50ZXJwb2xhdGUodGhpcy5fb3B0cy5mcm9tLCB0aGlzLl9vcHRzLnRvLCBwcm9ncmVzcywgZWFzaW5nKTtcclxufTtcclxuXHJcblBhdGgucHJvdG90eXBlLl9zdG9wVHdlZW4gPSBmdW5jdGlvbiBfc3RvcFR3ZWVuKCkge1xyXG4gICAgaWYgKHRoaXMuX3R3ZWVuYWJsZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX3R3ZWVuYWJsZS5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5fdHdlZW5hYmxlLmRpc3Bvc2UoKTtcclxuICAgICAgICB0aGlzLl90d2VlbmFibGUgPSBudWxsO1xyXG4gICAgfVxyXG59O1xyXG5cclxuUGF0aC5wcm90b3R5cGUuX2Vhc2luZyA9IGZ1bmN0aW9uIF9lYXNpbmcoZWFzaW5nKSB7XHJcbiAgICBpZiAoRUFTSU5HX0FMSUFTRVMuaGFzT3duUHJvcGVydHkoZWFzaW5nKSkge1xyXG4gICAgICAgIHJldHVybiBFQVNJTkdfQUxJQVNFU1tlYXNpbmddO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlYXNpbmc7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhdGg7XHJcbiIsIi8vIEJhc2Ugb2JqZWN0IGZvciBkaWZmZXJlbnQgcHJvZ3Jlc3MgYmFyIHNoYXBlc1xyXG5cclxudmFyIFBhdGggPSByZXF1aXJlKCcuL3BhdGgnKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG5cclxudmFyIERFU1RST1lFRF9FUlJPUiA9ICdPYmplY3QgaXMgZGVzdHJveWVkJztcclxuXHJcblxyXG52YXIgU2hhcGUgPSBmdW5jdGlvbiBTaGFwZShjb250YWluZXIsIG9wdHMpIHtcclxuICAgIC8vIFRocm93IGEgYmV0dGVyIGVycm9yIGlmIHByb2dyZXNzIGJhcnMgYXJlIG5vdCBpbml0aWFsaXplZCB3aXRoIGBuZXdgXHJcbiAgICAvLyBrZXl3b3JkXHJcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU2hhcGUpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb25zdHJ1Y3RvciB3YXMgY2FsbGVkIHdpdGhvdXQgbmV3IGtleXdvcmQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQcmV2ZW50IGNhbGxpbmcgY29uc3RydWN0b3Igd2l0aG91dCBwYXJhbWV0ZXJzIHNvIGluaGVyaXRhbmNlXHJcbiAgICAvLyB3b3JrcyBjb3JyZWN0bHkuIFRvIHVuZGVyc3RhbmQsIHRoaXMgaXMgaG93IFNoYXBlIGlzIGluaGVyaXRlZDpcclxuICAgIC8vXHJcbiAgICAvLyAgIExpbmUucHJvdG90eXBlID0gbmV3IFNoYXBlKCk7XHJcbiAgICAvL1xyXG4gICAgLy8gV2UganVzdCB3YW50IHRvIHNldCB0aGUgcHJvdG90eXBlIGZvciBMaW5lLlxyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcbiAgICAvLyBEZWZhdWx0IHBhcmFtZXRlcnMgZm9yIHByb2dyZXNzIGJhciBjcmVhdGlvblxyXG4gICAgdGhpcy5fb3B0cyA9IHV0aWxzLmV4dGVuZCh7XHJcbiAgICAgICAgY29sb3I6ICcjNTU1JyxcclxuICAgICAgICBzdHJva2VXaWR0aDogMS4wLFxyXG4gICAgICAgIHRyYWlsQ29sb3I6IG51bGwsXHJcbiAgICAgICAgdHJhaWxXaWR0aDogbnVsbCxcclxuICAgICAgICBmaWxsOiBudWxsLFxyXG4gICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgICAgYXV0b1N0eWxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb2xvcjogbnVsbCxcclxuICAgICAgICAgICAgdmFsdWU6ICcnLFxyXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwcm9ncmVzc2Jhci10ZXh0J1xyXG4gICAgICAgIH1cclxuICAgIH0sIG9wdHMsIHRydWUpOyAgLy8gVXNlIHJlY3Vyc2l2ZSBleHRlbmRcclxuXHJcbiAgICB2YXIgc3ZnVmlldyA9IHRoaXMuX2NyZWF0ZVN2Z1ZpZXcodGhpcy5fb3B0cyk7XHJcblxyXG4gICAgdmFyIGVsZW1lbnQ7XHJcbiAgICBpZiAodXRpbHMuaXNTdHJpbmcoY29udGFpbmVyKSkge1xyXG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGVsZW1lbnQgPSBjb250YWluZXI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb250YWluZXIgZG9lcyBub3QgZXhpc3Q6ICcgKyBjb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2NvbnRhaW5lciA9IGVsZW1lbnQ7XHJcbiAgICB0aGlzLl9jb250YWluZXIuYXBwZW5kQ2hpbGQoc3ZnVmlldy5zdmcpO1xyXG5cclxuICAgIHRoaXMudGV4dCA9IG51bGw7XHJcbiAgICBpZiAodGhpcy5fb3B0cy50ZXh0LnZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy5fY3JlYXRlVGV4dEVsZW1lbnQodGhpcy5fb3B0cywgdGhpcy5fY29udGFpbmVyKTtcclxuICAgICAgICB0aGlzLl9jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy50ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBFeHBvc2UgcHVibGljIGF0dHJpYnV0ZXMgYmVmb3JlIFBhdGggaW5pdGlhbGl6YXRpb25cclxuICAgIHRoaXMuc3ZnID0gc3ZnVmlldy5zdmc7XHJcbiAgICB0aGlzLnBhdGggPSBzdmdWaWV3LnBhdGg7XHJcbiAgICB0aGlzLnRyYWlsID0gc3ZnVmlldy50cmFpbDtcclxuICAgIC8vIHRoaXMudGV4dCBpcyBhbHNvIGEgcHVibGljIGF0dHJpYnV0ZVxyXG5cclxuICAgIHZhciBuZXdPcHRzID0gdXRpbHMuZXh0ZW5kKHtcclxuICAgICAgICBhdHRhY2htZW50OiB1bmRlZmluZWQsXHJcbiAgICAgICAgc2hhcGU6IHRoaXNcclxuICAgIH0sIHRoaXMuX29wdHMpO1xyXG4gICAgdGhpcy5fcHJvZ3Jlc3NQYXRoID0gbmV3IFBhdGgoc3ZnVmlldy5wYXRoLCBuZXdPcHRzKTtcclxufTtcclxuXHJcblNoYXBlLnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24gYW5pbWF0ZShwcm9ncmVzcywgb3B0cywgY2IpIHtcclxuICAgIGlmICh0aGlzLl9wcm9ncmVzc1BhdGggPT09IG51bGwpIHRocm93IG5ldyBFcnJvcihERVNUUk9ZRURfRVJST1IpO1xyXG4gICAgdGhpcy5fcHJvZ3Jlc3NQYXRoLmFuaW1hdGUocHJvZ3Jlc3MsIG9wdHMsIGNiKTtcclxufTtcclxuXHJcblNoYXBlLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gc3RvcCgpIHtcclxuICAgIGlmICh0aGlzLl9wcm9ncmVzc1BhdGggPT09IG51bGwpIHRocm93IG5ldyBFcnJvcihERVNUUk9ZRURfRVJST1IpO1xyXG4gICAgLy8gRG9uJ3QgY3Jhc2ggaWYgc3RvcCBpcyBjYWxsZWQgaW5zaWRlIHN0ZXAgZnVuY3Rpb25cclxuICAgIGlmICh0aGlzLl9wcm9ncmVzc1BhdGggPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuX3Byb2dyZXNzUGF0aC5zdG9wKCk7XHJcbn07XHJcblxyXG5TaGFwZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3NQYXRoID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoREVTVFJPWUVEX0VSUk9SKTtcclxuXHJcbiAgICB0aGlzLnN0b3AoKTtcclxuICAgIHRoaXMuc3ZnLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5zdmcpO1xyXG4gICAgdGhpcy5zdmcgPSBudWxsO1xyXG4gICAgdGhpcy5wYXRoID0gbnVsbDtcclxuICAgIHRoaXMudHJhaWwgPSBudWxsO1xyXG4gICAgdGhpcy5fcHJvZ3Jlc3NQYXRoID0gbnVsbDtcclxuXHJcbiAgICBpZiAodGhpcy50ZXh0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy50ZXh0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy50ZXh0KTtcclxuICAgICAgICB0aGlzLnRleHQgPSBudWxsO1xyXG4gICAgfVxyXG59O1xyXG5cclxuU2hhcGUucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldChwcm9ncmVzcykge1xyXG4gICAgaWYgKHRoaXMuX3Byb2dyZXNzUGF0aCA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKERFU1RST1lFRF9FUlJPUik7XHJcbiAgICB0aGlzLl9wcm9ncmVzc1BhdGguc2V0KHByb2dyZXNzKTtcclxufTtcclxuXHJcblNoYXBlLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uIHZhbHVlKCkge1xyXG4gICAgaWYgKHRoaXMuX3Byb2dyZXNzUGF0aCA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKERFU1RST1lFRF9FUlJPUik7XHJcbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3NQYXRoID09PSB1bmRlZmluZWQpIHJldHVybiAwO1xyXG5cclxuICAgIHJldHVybiB0aGlzLl9wcm9ncmVzc1BhdGgudmFsdWUoKTtcclxufTtcclxuXHJcblNoYXBlLnByb3RvdHlwZS5zZXRUZXh0ID0gZnVuY3Rpb24gc2V0VGV4dCh0ZXh0KSB7XHJcbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3NQYXRoID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoREVTVFJPWUVEX0VSUk9SKTtcclxuXHJcbiAgICBpZiAodGhpcy50ZXh0ID09PSBudWxsKSB7XHJcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyB0ZXh0IG5vZGVcclxuICAgICAgICB0aGlzLnRleHQgPSB0aGlzLl9jcmVhdGVUZXh0RWxlbWVudCh0aGlzLl9vcHRzLCB0aGlzLl9jb250YWluZXIpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSBwcmV2aW91cyB0ZXh0IG5vZGUgYW5kIGFkZCBuZXdcclxuICAgIHRoaXMudGV4dC5yZW1vdmVDaGlsZCh0aGlzLnRleHQuZmlyc3RDaGlsZCk7XHJcbiAgICB0aGlzLnRleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpO1xyXG59O1xyXG5cclxuU2hhcGUucHJvdG90eXBlLl9jcmVhdGVTdmdWaWV3ID0gZnVuY3Rpb24gX2NyZWF0ZVN2Z1ZpZXcob3B0cykge1xyXG4gICAgdmFyIHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XHJcbiAgICB0aGlzLl9pbml0aWFsaXplU3ZnKHN2Zywgb3B0cyk7XHJcblxyXG4gICAgdmFyIHRyYWlsUGF0aCA9IG51bGw7XHJcbiAgICAvLyBFYWNoIG9wdGlvbiBsaXN0ZWQgaW4gdGhlIGlmIGNvbmRpdGlvbiBhcmUgJ3RyaWdnZXJzJyBmb3IgY3JlYXRpbmdcclxuICAgIC8vIHRoZSB0cmFpbCBwYXRoXHJcbiAgICBpZiAob3B0cy50cmFpbENvbG9yIHx8IG9wdHMudHJhaWxXaWR0aCkge1xyXG4gICAgICAgIHRyYWlsUGF0aCA9IHRoaXMuX2NyZWF0ZVRyYWlsKG9wdHMpO1xyXG4gICAgICAgIHN2Zy5hcHBlbmRDaGlsZCh0cmFpbFBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwYXRoID0gdGhpcy5fY3JlYXRlUGF0aChvcHRzKTtcclxuICAgIHN2Zy5hcHBlbmRDaGlsZChwYXRoKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHN2Zzogc3ZnLFxyXG4gICAgICAgIHBhdGg6IHBhdGgsXHJcbiAgICAgICAgdHJhaWw6IHRyYWlsUGF0aFxyXG4gICAgfTtcclxufTtcclxuXHJcblNoYXBlLnByb3RvdHlwZS5faW5pdGlhbGl6ZVN2ZyA9IGZ1bmN0aW9uIF9pbml0aWFsaXplU3ZnKHN2Zywgb3B0cykge1xyXG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgMTAwIDEwMCcpO1xyXG59O1xyXG5cclxuU2hhcGUucHJvdG90eXBlLl9jcmVhdGVQYXRoID0gZnVuY3Rpb24gX2NyZWF0ZVBhdGgob3B0cykge1xyXG4gICAgdmFyIHBhdGhTdHJpbmcgPSB0aGlzLl9wYXRoU3RyaW5nKG9wdHMpO1xyXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZVBhdGhFbGVtZW50KHBhdGhTdHJpbmcsIG9wdHMpO1xyXG59O1xyXG5cclxuU2hhcGUucHJvdG90eXBlLl9jcmVhdGVUcmFpbCA9IGZ1bmN0aW9uIF9jcmVhdGVUcmFpbChvcHRzKSB7XHJcbiAgICAvLyBDcmVhdGUgcGF0aCBzdHJpbmcgd2l0aCBvcmlnaW5hbCBwYXNzZWQgb3B0aW9uc1xyXG4gICAgdmFyIHBhdGhTdHJpbmcgPSB0aGlzLl90cmFpbFN0cmluZyhvcHRzKTtcclxuXHJcbiAgICAvLyBQcmV2ZW50IG1vZGlmeWluZyBvcmlnaW5hbFxyXG4gICAgdmFyIG5ld09wdHMgPSB1dGlscy5leHRlbmQoe30sIG9wdHMpO1xyXG5cclxuICAgIC8vIERlZmF1bHRzIGZvciBwYXJhbWV0ZXJzIHdoaWNoIG1vZGlmeSB0cmFpbCBwYXRoXHJcbiAgICBpZiAoIW5ld09wdHMudHJhaWxDb2xvcikgbmV3T3B0cy50cmFpbENvbG9yID0gJyNlZWUnO1xyXG4gICAgaWYgKCFuZXdPcHRzLnRyYWlsV2lkdGgpIG5ld09wdHMudHJhaWxXaWR0aCA9IG5ld09wdHMuc3Ryb2tlV2lkdGg7XHJcblxyXG4gICAgbmV3T3B0cy5jb2xvciA9IG5ld09wdHMudHJhaWxDb2xvcjtcclxuICAgIG5ld09wdHMuc3Ryb2tlV2lkdGggPSBuZXdPcHRzLnRyYWlsV2lkdGg7XHJcblxyXG4gICAgLy8gV2hlbiB0cmFpbCBwYXRoIGlzIHNldCwgZmlsbCBtdXN0IGJlIHNldCBmb3IgaXQgaW5zdGVhZCBvZiB0aGVcclxuICAgIC8vIGFjdHVhbCBwYXRoIHRvIHByZXZlbnQgdHJhaWwgc3Ryb2tlIGZyb20gY2xpcHBpbmdcclxuICAgIG5ld09wdHMuZmlsbCA9IG51bGw7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZVBhdGhFbGVtZW50KHBhdGhTdHJpbmcsIG5ld09wdHMpO1xyXG59O1xyXG5cclxuU2hhcGUucHJvdG90eXBlLl9jcmVhdGVQYXRoRWxlbWVudCA9IGZ1bmN0aW9uIF9jcmVhdGVQYXRoRWxlbWVudChwYXRoU3RyaW5nLCBvcHRzKSB7XHJcbiAgICB2YXIgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xyXG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBwYXRoU3RyaW5nKTtcclxuICAgIHBhdGguc2V0QXR0cmlidXRlKCdzdHJva2UnLCBvcHRzLmNvbG9yKTtcclxuICAgIHBhdGguc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCBvcHRzLnN0cm9rZVdpZHRoKTtcclxuXHJcbiAgICBpZiAob3B0cy5maWxsKSB7XHJcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBvcHRzLmZpbGwpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZmlsbC1vcGFjaXR5JywgJzAnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGF0aDtcclxufTtcclxuXHJcblNoYXBlLnByb3RvdHlwZS5fY3JlYXRlVGV4dEVsZW1lbnQgPSBmdW5jdGlvbiBfY3JlYXRlVGV4dEVsZW1lbnQob3B0cywgY29udGFpbmVyKSB7XHJcbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUob3B0cy50ZXh0LnZhbHVlKSk7XHJcblxyXG4gICAgaWYgKG9wdHMudGV4dC5hdXRvU3R5bGUpIHtcclxuICAgICAgICAvLyBDZW50ZXIgdGV4dFxyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSAnNTAlJztcclxuICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSAnNTAlJztcclxuICAgICAgICBlbGVtZW50LnN0eWxlLnBhZGRpbmcgPSAwO1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUubWFyZ2luID0gMDtcclxuICAgICAgICB1dGlscy5zZXRTdHlsZShlbGVtZW50LCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKScpO1xyXG5cclxuICAgICAgICBpZiAob3B0cy50ZXh0LmNvbG9yKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY29sb3IgPSBvcHRzLnRleHQuY29sb3I7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5jb2xvciA9IG9wdHMuY29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSBvcHRzLnRleHQuY2xhc3NOYW1lO1xyXG5cclxuICAgIHJldHVybiBlbGVtZW50O1xyXG59O1xyXG5cclxuU2hhcGUucHJvdG90eXBlLl9wYXRoU3RyaW5nID0gZnVuY3Rpb24gX3BhdGhTdHJpbmcob3B0cykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdPdmVycmlkZSB0aGlzIGZ1bmN0aW9uIGZvciBlYWNoIHByb2dyZXNzIGJhcicpO1xyXG59O1xyXG5cclxuU2hhcGUucHJvdG90eXBlLl90cmFpbFN0cmluZyA9IGZ1bmN0aW9uIF90cmFpbFN0cmluZyhvcHRzKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ092ZXJyaWRlIHRoaXMgZnVuY3Rpb24gZm9yIGVhY2ggcHJvZ3Jlc3MgYmFyJyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlO1xyXG4iLCIvLyBTcXVhcmUgc2hhcGVkIHByb2dyZXNzIGJhclxyXG5cclxudmFyIFNoYXBlID0gcmVxdWlyZSgnLi9zaGFwZScpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcblxyXG5cclxudmFyIFNxdWFyZSA9IGZ1bmN0aW9uIFNxdWFyZShjb250YWluZXIsIG9wdGlvbnMpIHtcclxuICAgIHRoaXMuX3BhdGhUZW1wbGF0ZSA9XHJcbiAgICAgICAgJ00gMCx7aGFsZk9mU3Ryb2tlV2lkdGh9JyArXHJcbiAgICAgICAgJyBMIHt3aWR0aH0se2hhbGZPZlN0cm9rZVdpZHRofScgK1xyXG4gICAgICAgICcgTCB7d2lkdGh9LHt3aWR0aH0nICtcclxuICAgICAgICAnIEwge2hhbGZPZlN0cm9rZVdpZHRofSx7d2lkdGh9JyArXHJcbiAgICAgICAgJyBMIHtoYWxmT2ZTdHJva2VXaWR0aH0se3N0cm9rZVdpZHRofSc7XHJcblxyXG4gICAgdGhpcy5fdHJhaWxUZW1wbGF0ZSA9XHJcbiAgICAgICAgJ00ge3N0YXJ0TWFyZ2lufSx7aGFsZk9mU3Ryb2tlV2lkdGh9JyArXHJcbiAgICAgICAgJyBMIHt3aWR0aH0se2hhbGZPZlN0cm9rZVdpZHRofScgK1xyXG4gICAgICAgICcgTCB7d2lkdGh9LHt3aWR0aH0nICtcclxuICAgICAgICAnIEwge2hhbGZPZlN0cm9rZVdpZHRofSx7d2lkdGh9JyArXHJcbiAgICAgICAgJyBMIHtoYWxmT2ZTdHJva2VXaWR0aH0se2hhbGZPZlN0cm9rZVdpZHRofSc7XHJcblxyXG4gICAgU2hhcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcblNxdWFyZS5wcm90b3R5cGUgPSBuZXcgU2hhcGUoKTtcclxuU3F1YXJlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNxdWFyZTtcclxuXHJcblNxdWFyZS5wcm90b3R5cGUuX3BhdGhTdHJpbmcgPSBmdW5jdGlvbiBfcGF0aFN0cmluZyhvcHRzKSB7XHJcbiAgICB2YXIgdyA9IDEwMCAtIG9wdHMuc3Ryb2tlV2lkdGggLyAyO1xyXG5cclxuICAgIHJldHVybiB1dGlscy5yZW5kZXIodGhpcy5fcGF0aFRlbXBsYXRlLCB7XHJcbiAgICAgICAgd2lkdGg6IHcsXHJcbiAgICAgICAgc3Ryb2tlV2lkdGg6IG9wdHMuc3Ryb2tlV2lkdGgsXHJcbiAgICAgICAgaGFsZk9mU3Ryb2tlV2lkdGg6IG9wdHMuc3Ryb2tlV2lkdGggLyAyXHJcbiAgICB9KTtcclxufTtcclxuXHJcblNxdWFyZS5wcm90b3R5cGUuX3RyYWlsU3RyaW5nID0gZnVuY3Rpb24gX3RyYWlsU3RyaW5nKG9wdHMpIHtcclxuICAgIHZhciB3ID0gMTAwIC0gb3B0cy5zdHJva2VXaWR0aCAvIDI7XHJcblxyXG4gICAgcmV0dXJuIHV0aWxzLnJlbmRlcih0aGlzLl90cmFpbFRlbXBsYXRlLCB7XHJcbiAgICAgICAgd2lkdGg6IHcsXHJcbiAgICAgICAgc3Ryb2tlV2lkdGg6IG9wdHMuc3Ryb2tlV2lkdGgsXHJcbiAgICAgICAgaGFsZk9mU3Ryb2tlV2lkdGg6IG9wdHMuc3Ryb2tlV2lkdGggLyAyLFxyXG4gICAgICAgIHN0YXJ0TWFyZ2luOiAob3B0cy5zdHJva2VXaWR0aCAvIDIpIC0gKG9wdHMudHJhaWxXaWR0aCAvIDIpXHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3F1YXJlO1xyXG4iLCIvLyBVdGlsaXR5IGZ1bmN0aW9uc1xyXG5cclxudmFyIFBSRUZJWEVTID0gJ1dlYmtpdCBNb3ogTyBtcycuc3BsaXQoJyAnKTtcclxuXHJcbi8vIENvcHkgYWxsIGF0dHJpYnV0ZXMgZnJvbSBzb3VyY2Ugb2JqZWN0IHRvIGRlc3RpbmF0aW9uIG9iamVjdC5cclxuLy8gZGVzdGluYXRpb24gb2JqZWN0IGlzIG11dGF0ZWQuXHJcbmZ1bmN0aW9uIGV4dGVuZChkZXN0aW5hdGlvbiwgc291cmNlLCByZWN1cnNpdmUpIHtcclxuICAgIGRlc3RpbmF0aW9uID0gZGVzdGluYXRpb24gfHwge307XHJcbiAgICBzb3VyY2UgPSBzb3VyY2UgfHwge307XHJcbiAgICByZWN1cnNpdmUgPSByZWN1cnNpdmUgfHwgZmFsc2U7XHJcblxyXG4gICAgZm9yICh2YXIgYXR0ck5hbWUgaW4gc291cmNlKSB7XHJcbiAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkpIHtcclxuICAgICAgICAgICAgdmFyIGRlc3RWYWwgPSBkZXN0aW5hdGlvblthdHRyTmFtZV07XHJcbiAgICAgICAgICAgIHZhciBzb3VyY2VWYWwgPSBzb3VyY2VbYXR0ck5hbWVdO1xyXG4gICAgICAgICAgICBpZiAocmVjdXJzaXZlICYmIGlzT2JqZWN0KGRlc3RWYWwpICYmIGlzT2JqZWN0KHNvdXJjZVZhbCkpIHtcclxuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW2F0dHJOYW1lXSA9IGV4dGVuZChkZXN0VmFsLCBzb3VyY2VWYWwsIHJlY3Vyc2l2ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvblthdHRyTmFtZV0gPSBzb3VyY2VWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG59XHJcblxyXG4vLyBSZW5kZXJzIHRlbXBsYXRlcyB3aXRoIGdpdmVuIHZhcmlhYmxlcy4gVmFyaWFibGVzIG11c3QgYmUgc3Vycm91bmRlZCB3aXRoXHJcbi8vIGJyYWNlcyB3aXRob3V0IGFueSBzcGFjZXMsIGUuZy4ge3ZhcmlhYmxlfVxyXG4vLyBBbGwgaW5zdGFuY2VzIG9mIHZhcmlhYmxlIHBsYWNlaG9sZGVycyB3aWxsIGJlIHJlcGxhY2VkIHdpdGggZ2l2ZW4gY29udGVudFxyXG4vLyBFeGFtcGxlOlxyXG4vLyByZW5kZXIoJ0hlbGxvLCB7bWVzc2FnZX0hJywge21lc3NhZ2U6ICd3b3JsZCd9KVxyXG5mdW5jdGlvbiByZW5kZXIodGVtcGxhdGUsIHZhcnMpIHtcclxuICAgIHZhciByZW5kZXJlZCA9IHRlbXBsYXRlO1xyXG5cclxuICAgIGZvciAodmFyIGtleSBpbiB2YXJzKSB7XHJcbiAgICAgICAgaWYgKHZhcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdmFyc1trZXldO1xyXG4gICAgICAgICAgICB2YXIgcmVnRXhwU3RyaW5nID0gJ1xcXFx7JyArIGtleSArICdcXFxcfSc7XHJcbiAgICAgICAgICAgIHZhciByZWdFeHAgPSBuZXcgUmVnRXhwKHJlZ0V4cFN0cmluZywgJ2cnKTtcclxuXHJcbiAgICAgICAgICAgIHJlbmRlcmVkID0gcmVuZGVyZWQucmVwbGFjZShyZWdFeHAsIHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZW5kZXJlZDtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0U3R5bGUoZWxlbWVudCwgc3R5bGUsIHZhbHVlKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IFBSRUZJWEVTLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgdmFyIHByZWZpeCA9IFBSRUZJWEVTW2ldO1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGVbcHJlZml4ICsgY2FwaXRhbGl6ZShzdHlsZSldID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudC5zdHlsZVtzdHlsZV0gPSB2YWx1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2FwaXRhbGl6ZSh0ZXh0KSB7XHJcbiAgICByZXR1cm4gdGV4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRleHQuc2xpY2UoMSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdzdHJpbmcnIHx8IG9iaiBpbnN0YW5jZW9mIFN0cmluZztcclxufVxyXG5cclxuZnVuY3Rpb24gaXNGdW5jdGlvbihvYmopIHtcclxuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0FycmF5KG9iaikge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xyXG59XHJcblxyXG4vLyBSZXR1cm5zIHRydWUgaWYgYG9iamAgaXMgb2JqZWN0IGFzIGluIHthOiAxLCBiOiAyfSwgbm90IGlmIGl0J3MgZnVuY3Rpb24gb3JcclxuLy8gYXJyYXlcclxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XHJcbiAgICBpZiAoaXNBcnJheShvYmopKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqO1xyXG4gICAgcmV0dXJuIHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBleHRlbmQ6IGV4dGVuZCxcclxuICAgIHJlbmRlcjogcmVuZGVyLFxyXG4gICAgc2V0U3R5bGU6IHNldFN0eWxlLFxyXG4gICAgY2FwaXRhbGl6ZTogY2FwaXRhbGl6ZSxcclxuICAgIGlzU3RyaW5nOiBpc1N0cmluZyxcclxuICAgIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXHJcbiAgICBpc09iamVjdDogaXNPYmplY3RcclxufTtcclxuIl19
