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
                    var count = cards[i].getElementsByClassName("card-count--subtr");
                    if (count.length == 0) return;

                    count[0].addEventListener("click", function (e) {
                        //alert("hej");
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
            var points = card.getAttribute("data-points");

            if (cardIsMarkedAsComplete && cardIsSingleOnly) {
                points = points * -1;
                card.classList.remove("card--complete");
            } else {
                card.classList.add("card--complete");
                if (!cardIsSingleOnly) {
                    var currentCount = card.getElementsByClassName("card-count--number")[0];
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

            var points = card.getAttribute("data-points");
            //if (cardIsMarkedAsComplete) {
            points = points * -1;
            //} else {
            //card.classList.add("card--complete");
            //}
            console.log(card);
            var currentCount = card.getElementsByClassName("card-count--number")[0];
            currentCount.textContent = parseInt(currentCount.textContent) - 1;
            var event = new CustomEvent("challengeCardSaved", { "detail": points });
            document.dispatchEvent(event);
        }
    }, {
        key: "updateChallengeOnServer",
        value: function updateChallengeOnServer(card) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "Home/ToggleChallenge");
            xhr.setRequestHeader("Content-Type", "application/json");
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
                id: card.getAttribute("data-id"),
                currentUser: this.user,
                single: card.classList.contains("card--single")
            }));
        }
    }, {
        key: "updateChallengeCardSubtractOnServer",
        value: function updateChallengeCardSubtractOnServer(card) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "Home/ToggleChallengeSubtract");
            xhr.setRequestHeader("Content-Type", "application/json");
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
                id: card.getAttribute("data-id"),
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
            color: '#00cc99',
            strokeWidth: 3,
            easing: 'easeInOut'
        });
        this.registerEvents();
    }

    _createClass(UserInfo, [{
        key: 'registerEvents',
        value: function registerEvents() {
            var _this = this;

            var event = new Event('challengeCardSaved');
            document.addEventListener('challengeCardSaved', function (event) {
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
                if (!level.classList.contains('fulfilled')) {
                    level.classList.add('fulfilled');
                }
            } else {

                var level = document.getElementById('bonus-level-one');
                if (level.classList.contains('fulfilled')) {
                    level.classList.remove('fulfilled');
                }
            }
            if (currentPoints >= 400) {

                var level = document.getElementById('bonus-level-two');
                if (!level.classList.contains('fulfilled')) {
                    level.classList.add('fulfilled');
                }
            } else {

                var level = document.getElementById('bonus-level-two');
                if (level.classList.contains('fulfilled')) {
                    level.classList.remove('fulfilled');
                }
            }

            if (currentPoints >= 800) {
                var level = document.getElementById('bonus-level-three');
                if (!level.classList.contains('fulfilled')) {
                    level.classList.add('fulfilled');
                }
            } else {
                var level = document.getElementById('bonus-level-three');
                if (level.classList.contains('fulfilled')) {
                    level.classList.remove('fulfilled');
                }
            }
            if (currentPoints >= 1300) {
                var level = document.getElementById('bonus-level-four');
                if (!level.classList.contains('fulfilled')) {
                    level.classList.add('fulfilled');
                }
            } else {
                var level = document.getElementById('bonus-level-four');
                if (level.classList.contains('fulfilled')) {
                    level.classList.remove('fulfilled');
                }
            }
            if (currentPoints >= 2000) {
                var level = document.getElementById('bonus-level-five');
                if (!level.classList.contains('fulfilled')) {
                    level.classList.add('fulfilled');
                }
            } else {
                var level = document.getElementById('bonus-level-five');
                if (level.classList.contains('fulfilled')) {
                    level.classList.remove('fulfilled');
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

    var cards = document.getElementById("Cards");
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Qcm9qZWN0cy9sYWJzL01lcmlkaXVtLkNoYWxsZW5nZUJvYXJkL0NoYWxsZW5nZUJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvTW9kdWxlcy9DaGFsbGVuZ2VDYXJkcy5qcyIsIkM6L1Byb2plY3RzL2xhYnMvTWVyaWRpdW0uQ2hhbGxlbmdlQm9hcmQvQ2hhbGxlbmdlQm9hcmQuV2ViL0NvbnRlbnQvU2NyaXB0cy9Nb2R1bGVzL1VzZXJJbmZvLmpzIiwiQzovUHJvamVjdHMvbGFicy9NZXJpZGl1bS5DaGFsbGVuZ2VCb2FyZC9DaGFsbGVuZ2VCb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL21haW4uanMiLCIuLi9DaGFsbGVuZ2VCb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL25vZGVfbW9kdWxlcy9wcm9ncmVzc2Jhci5qcy9ub2RlX21vZHVsZXMvc2hpZnR5L2Rpc3Qvc2hpZnR5LmpzIiwiLi4vQ2hhbGxlbmdlQm9hcmQuV2ViL0NvbnRlbnQvU2NyaXB0cy9ub2RlX21vZHVsZXMvcHJvZ3Jlc3NiYXIuanMvc3JjL2NpcmNsZS5qcyIsIi4uL0NoYWxsZW5nZUJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvbm9kZV9tb2R1bGVzL3Byb2dyZXNzYmFyLmpzL3NyYy9saW5lLmpzIiwiLi4vQ2hhbGxlbmdlQm9hcmQuV2ViL0NvbnRlbnQvU2NyaXB0cy9ub2RlX21vZHVsZXMvcHJvZ3Jlc3NiYXIuanMvc3JjL21haW4uanMiLCIuLi9DaGFsbGVuZ2VCb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL25vZGVfbW9kdWxlcy9wcm9ncmVzc2Jhci5qcy9zcmMvcGF0aC5qcyIsIi4uL0NoYWxsZW5nZUJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvbm9kZV9tb2R1bGVzL3Byb2dyZXNzYmFyLmpzL3NyYy9zaGFwZS5qcyIsIi4uL0NoYWxsZW5nZUJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvbm9kZV9tb2R1bGVzL3Byb2dyZXNzYmFyLmpzL3NyYy9zcXVhcmUuanMiLCIuLi9DaGFsbGVuZ2VCb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL25vZGVfbW9kdWxlcy9wcm9ncmVzc2Jhci5qcy9zcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7SUNBTSxjQUFjO0FBQ0wsYUFEVCxjQUFjLENBQ0osSUFBSSxFQUFFOzhCQURoQixjQUFjOztBQUVaLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0tBQzdCOztpQkFKQyxjQUFjOztlQUtFLDhCQUFHO0FBQ2pCLGdCQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsZ0JBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRCxpQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbkMsQUFBQyxpQkFBQSxZQUFXO0FBQ1IseUJBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDM0MseUJBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFbkIsNEJBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQiw0QkFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUV0QyxDQUFDLENBQUM7QUFDSCx3QkFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLHdCQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNqRSx3QkFBRyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFDaEIsT0FB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Qzs7QUFFdEMsWUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUUzQixRQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ2hELENBQUMsQ0FBQzs7Ozs7OztBQ2JIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoMkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIENoYWxsZW5nZUNhcmRzIHtcclxuICAgIGNvbnN0cnVjdG9yKHVzZXIpIHtcclxuICAgICAgICB0aGlzLnVzZXIgPSB1c2VyO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJDbGlja0V2ZW50KCk7XHJcbiAgICB9XHJcbiAgICByZWdpc3RlckNsaWNrRXZlbnQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjYXJkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjYXJkXCIpOyAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjYXJkc1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVDaGFsbGVuZ2VDYXJkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlQ2hhbGxlbmdlT25TZXJ2ZXIodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FyZCA9IGNhcmRzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvdW50ID0gY2FyZHNbaV0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2FyZC1jb3VudC0tc3VidHInKTtcclxuICAgICAgICAgICAgICAgIGlmKGNvdW50Lmxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb3VudFswXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vYWxlcnQoXCJoZWpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlQ2hhbGxlbmdlQ2FyZFN1YnRyYWN0KGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlQ2hhbGxlbmdlQ2FyZFN1YnRyYWN0T25TZXJ2ZXIoY2FyZCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB1cGRhdGVDaGFsbGVuZ2VDYXJkKGNhcmQpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgY2FyZElzTWFya2VkQXNDb21wbGV0ZSA9IGNhcmQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2FyZC0tY29tcGxldGVcIik7XHJcbiAgICAgICAgdmFyIGNhcmRJc1NpbmdsZU9ubHkgPSBjYXJkLmNsYXNzTGlzdC5jb250YWlucyhcImNhcmQtLXNpbmdsZVwiKTtcclxuICAgICAgICB2YXIgcG9pbnRzID0gY2FyZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcG9pbnRzJyk7XHJcblxyXG4gICAgICAgIGlmIChjYXJkSXNNYXJrZWRBc0NvbXBsZXRlICYmIGNhcmRJc1NpbmdsZU9ubHkpIHtcclxuICAgICAgICAgICAgcG9pbnRzID0gcG9pbnRzICogLTE7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZShcImNhcmQtLWNvbXBsZXRlXCIpOyBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoXCJjYXJkLS1jb21wbGV0ZVwiKTsgXHJcbiAgICAgICAgICAgIGlmKCFjYXJkSXNTaW5nbGVPbmx5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudENvdW50ID0gY2FyZC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYXJkLWNvdW50LS1udW1iZXInKVswXTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb3VudC50ZXh0Q29udGVudCA9IHBhcnNlSW50KGN1cnJlbnRDb3VudC50ZXh0Q29udGVudCkgKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICAgICAgXHJcblxyXG4gICAgICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImNoYWxsZW5nZUNhcmRTYXZlZFwiLCB7IFwiZGV0YWlsXCI6IHBvaW50cyB9KTtcclxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuICAgIHVwZGF0ZUNoYWxsZW5nZUNhcmRTdWJ0cmFjdChjYXJkKSB7XHJcbiAgICAgICAgdmFyIGNhcmRJc01hcmtlZEFzQ29tcGxldGUgPSBjYXJkLmNsYXNzTGlzdC5jb250YWlucyhcImNhcmQtLWNvbXBsZXRlXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBwb2ludHMgPSBjYXJkLmdldEF0dHJpYnV0ZSgnZGF0YS1wb2ludHMnKTtcclxuICAgICAgICAvL2lmIChjYXJkSXNNYXJrZWRBc0NvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgIHBvaW50cyA9IHBvaW50cyAqIC0xO1xyXG4gICAgICAgIC8vfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9jYXJkLmNsYXNzTGlzdC5hZGQoXCJjYXJkLS1jb21wbGV0ZVwiKTtcclxuICAgICAgICAvL31cclxuICAgICAgICBjb25zb2xlLmxvZyhjYXJkKTtcclxuICAgICAgICB2YXIgY3VycmVudENvdW50ID0gY2FyZC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYXJkLWNvdW50LS1udW1iZXInKVswXTtcclxuICAgICAgICBjdXJyZW50Q291bnQudGV4dENvbnRlbnQgPSBwYXJzZUludChjdXJyZW50Q291bnQudGV4dENvbnRlbnQpIC0gMTtcclxuICAgICAgICB2YXIgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJjaGFsbGVuZ2VDYXJkU2F2ZWRcIiwgeyBcImRldGFpbFwiOiBwb2ludHMgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVDaGFsbGVuZ2VPblNlcnZlcihjYXJkKSB7ICAgICAgICBcclxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnSG9tZS9Ub2dnbGVDaGFsbGVuZ2UnKTtcclxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyAhPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAvL1NvbWV0aGluZyB3ZW50IHdyb25nIG1lc3NhZ2UuXHJcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gdG8gbG9naW4gZm9ybVxyXG4gICAgICAgICAgICAgICAgdmFyIHVzZXJuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyLWhpZGVcIikudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL0F1dGhlbnRpY2F0aW9uP25hbWU9XCIgKyB1c2VybmFtZTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgICBcclxuICAgICAgICB9O1xyXG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHsgXHJcbiAgICAgICAgICAgIGlkOiBjYXJkLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpLFxyXG4gICAgICAgICAgICBjdXJyZW50VXNlcjogdGhpcy51c2VyLFxyXG4gICAgICAgICAgICBzaW5nbGU6IGNhcmQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2FyZC0tc2luZ2xlXCIpXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlQ2hhbGxlbmdlQ2FyZFN1YnRyYWN0T25TZXJ2ZXIoY2FyZCkgeyAgICAgICAgXHJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhoci5vcGVuKCdQT1NUJywgJ0hvbWUvVG9nZ2xlQ2hhbGxlbmdlU3VidHJhY3QnKTtcclxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyAhPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAvL1NvbWV0aGluZyB3ZW50IHdyb25nIG1lc3NhZ2UuXHJcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gdG8gbG9naW4gZm9ybVxyXG4gICAgICAgICAgICAgICAgdmFyIHVzZXJuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyLWhpZGVcIikudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL0F1dGhlbnRpY2F0aW9uP25hbWU9XCIgKyB1c2VybmFtZTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICBpZDogY2FyZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKSxcclxuICAgICAgICAgICAgY3VycmVudFVzZXI6IHRoaXMudXNlclxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IENoYWxsZW5nZUNhcmRzOyIsInZhciBwcm9ncmVzc2JhciA9IHJlcXVpcmUoJ3Byb2dyZXNzYmFyLmpzJyk7XHJcblxyXG5jbGFzcyBVc2VySW5mbyB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1c2VyKSB7XHJcbiAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcclxuICAgICAgICB0aGlzLnByb2dyZXNzQmFyID0gbmV3IHByb2dyZXNzYmFyLkNpcmNsZSgnI1Byb2dyZXNzQmFyQ29udGFpbmVyJywge1xyXG4gICAgICAgICAgICBjb2xvcjogJyMwMGNjOTknLFxyXG4gICAgICAgICAgICBzdHJva2VXaWR0aDogMyxcclxuICAgICAgICAgICAgZWFzaW5nOiAnZWFzZUluT3V0J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcclxuICAgIH1cclxuICAgIHJlZ2lzdGVyRXZlbnRzKClcclxuICAgIHtcclxuICAgICAgICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoXCJjaGFsbGVuZ2VDYXJkU2F2ZWRcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYWxsZW5nZUNhcmRTYXZlZFwiLCBldmVudCA9PiB0aGlzLnVwZGF0ZVByb2dyZXNzQmFyKGV2ZW50LmRldGFpbCkpO1xyXG4gICAgfVxyXG4gICAgaW5pdFByb2dyZXNzQmFyKClcclxuICAgIHtcclxuICAgICAgICB2YXIgY3VycmVudFBvaW50cyA9IHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ludHJvLXNjb3JlJykudGV4dENvbnRlbnQpO1xyXG4gICAgICAgIHZhciBtYXhTY29yZSA9IHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21heC1zY29yZScpLnRleHRDb250ZW50KTtcclxuICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBjdXJyZW50UG9pbnRzIC8gbWF4U2NvcmU7XHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc0Jhci5hbmltYXRlKHByb2dyZXNzKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICB1cGRhdGVQcm9ncmVzc0Jhcihwb2ludHMpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhwb2ludHMpO1xyXG4gICAgICAgIHZhciBzY29yZWJvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ludHJvLXNjb3JlJyk7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRQb2ludHMgPSBwYXJzZUludChzY29yZWJvYXJkLnRleHRDb250ZW50KTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgbmV3U2NvcmUgPSBjdXJyZW50UG9pbnRzICsgcGFyc2VJbnQocG9pbnRzKTtcclxuICAgICAgICBzY29yZWJvYXJkLnRleHRDb250ZW50ID0gbmV3U2NvcmU7XHJcbiAgICAgICAgdmFyIHByb2dyZXNzID0gcGFyc2VGbG9hdChzY29yZWJvYXJkLnRleHRDb250ZW50KS9wYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXgtc2NvcmUnKS50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc0Jhci5hbmltYXRlKHByb2dyZXNzKTtcclxuXHJcbiAgICAgICAgLy91cGRhdGUgYm9udXMgcmluZ3NcclxuICAgICAgICBpZiAobmV3U2NvcmUgPj0gMTAwKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgbGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9udXMtbGV2ZWwtb25lJyk7XHJcbiAgICAgICAgICAgIGlmICghbGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QuYWRkKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib251cy1sZXZlbC1vbmUnKTtcclxuICAgICAgICAgICAgaWYgKGxldmVsLmNsYXNzTGlzdC5jb250YWlucyhcImZ1bGZpbGxlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuY2xhc3NMaXN0LnJlbW92ZShcImZ1bGZpbGxlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudFBvaW50cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib251cy1sZXZlbC10d28nKTtcclxuICAgICAgICAgICAgaWYgKCFsZXZlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLmNsYXNzTGlzdC5hZGQoXCJmdWxmaWxsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbnVzLWxldmVsLXR3bycpO1xyXG4gICAgICAgICAgICBpZiAobGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QucmVtb3ZlKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKGN1cnJlbnRQb2ludHMgPj0gODAwKSB7XHJcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib251cy1sZXZlbC10aHJlZScpO1xyXG4gICAgICAgICAgICBpZiAoIWxldmVsLmNsYXNzTGlzdC5jb250YWlucyhcImZ1bGZpbGxlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuY2xhc3NMaXN0LmFkZChcImZ1bGZpbGxlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib251cy1sZXZlbC10aHJlZScpO1xyXG4gICAgICAgICAgICBpZiAobGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QucmVtb3ZlKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJyZW50UG9pbnRzID49IDEzMDApIHtcclxuICAgICAgICAgICAgdmFyIGxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbnVzLWxldmVsLWZvdXInKTtcclxuICAgICAgICAgICAgaWYgKCFsZXZlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLmNsYXNzTGlzdC5hZGQoXCJmdWxmaWxsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgbGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9udXMtbGV2ZWwtZm91cicpO1xyXG4gICAgICAgICAgICBpZiAobGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QucmVtb3ZlKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJyZW50UG9pbnRzID49IDIwMDApIHtcclxuICAgICAgICAgICAgdmFyIGxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbnVzLWxldmVsLWZpdmUnKTtcclxuICAgICAgICAgICAgaWYgKCFsZXZlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLmNsYXNzTGlzdC5hZGQoXCJmdWxmaWxsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgbGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9udXMtbGV2ZWwtZml2ZScpO1xyXG4gICAgICAgICAgICBpZiAobGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QucmVtb3ZlKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJJbmZvOyIsImltcG9ydCBDaGFsbGVuZ2VDYXJkcyBmcm9tIFwiLi9Nb2R1bGVzL0NoYWxsZW5nZUNhcmRzXCI7XHJcbmltcG9ydCBVc2VySW5mbyBmcm9tIFwiLi9Nb2R1bGVzL1VzZXJJbmZvXCI7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgIHZhciB1c2VybmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlci1oaWRlXCIpLnRleHRDb250ZW50O1xyXG4gICAgXHJcbiAgICB2YXIgY2hhbGxlbmdlQ2FyZHMgPSBuZXcgQ2hhbGxlbmdlQ2FyZHModXNlcm5hbWUpO1xyXG4gICAgdmFyIHVzZXJJbmZvID0gbmV3IFVzZXJJbmZvKHVzZXJuYW1lKTtcclxuXHJcbiAgICB1c2VySW5mby5pbml0UHJvZ3Jlc3NCYXIoKTtcclxuXHJcbiAgICB2YXIgY2FyZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnQ2FyZHMnKTtcclxufSk7XHJcbi8qdmFyIG1zbnJ5ID0gbmV3IE1hc29ucnkoIGNhcmRzLCB7XHJcbiAgaXRlbVNlbGVjdG9yOiAnLml0ZW0nLFxyXG4gIGNvbHVtbldpZHRoOiAyMjBcclxufSk7Ki8iLCIvKiEgc2hpZnR5IC0gdjEuMi4yIC0gMjAxNC0xMC0wOSAtIGh0dHA6Ly9qZXJlbXlja2Fobi5naXRodWIuaW8vc2hpZnR5ICovXG47KGZ1bmN0aW9uIChyb290KSB7XG5cbi8qIVxuICogU2hpZnR5IENvcmVcbiAqIEJ5IEplcmVteSBLYWhuIC0gamVyZW15Y2thaG5AZ21haWwuY29tXG4gKi9cblxuLy8gVWdsaWZ5SlMgZGVmaW5lIGhhY2suICBVc2VkIGZvciB1bml0IHRlc3RpbmcuICBDb250ZW50cyBvZiB0aGlzIGlmIGFyZVxuLy8gY29tcGlsZWQgYXdheS5cbmlmICh0eXBlb2YgU0hJRlRZX0RFQlVHX05PVyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgU0hJRlRZX0RFQlVHX05PVyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gK25ldyBEYXRlKCk7XG4gIH07XG59XG5cbnZhciBUd2VlbmFibGUgPSAoZnVuY3Rpb24gKCkge1xuXG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBBbGlhc2VzIHRoYXQgZ2V0IGRlZmluZWQgbGF0ZXIgaW4gdGhpcyBmdW5jdGlvblxuICB2YXIgZm9ybXVsYTtcblxuICAvLyBDT05TVEFOVFNcbiAgdmFyIERFRkFVTFRfU0NIRURVTEVfRlVOQ1RJT047XG4gIHZhciBERUZBVUxUX0VBU0lORyA9ICdsaW5lYXInO1xuICB2YXIgREVGQVVMVF9EVVJBVElPTiA9IDUwMDtcbiAgdmFyIFVQREFURV9USU1FID0gMTAwMCAvIDYwO1xuXG4gIHZhciBfbm93ID0gRGF0ZS5ub3dcbiAgICAgICA/IERhdGUubm93XG4gICAgICAgOiBmdW5jdGlvbiAoKSB7cmV0dXJuICtuZXcgRGF0ZSgpO307XG5cbiAgdmFyIG5vdyA9IFNISUZUWV9ERUJVR19OT1dcbiAgICAgICA/IFNISUZUWV9ERUJVR19OT1dcbiAgICAgICA6IF9ub3c7XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCkgc2hpbSBieSBQYXVsIElyaXNoIChtb2RpZmllZCBmb3IgU2hpZnR5KVxuICAgIC8vIGh0dHA6Ly9wYXVsaXJpc2guY29tLzIwMTEvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1hbmltYXRpbmcvXG4gICAgREVGQVVMVF9TQ0hFRFVMRV9GVU5DVElPTiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgfHwgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICB8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICB8fCAod2luZG93Lm1vekNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVxuICAgICAgICYmIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgICAgfHwgc2V0VGltZW91dDtcbiAgfSBlbHNlIHtcbiAgICBERUZBVUxUX1NDSEVEVUxFX0ZVTkNUSU9OID0gc2V0VGltZW91dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vb3AgKCkge1xuICAgIC8vIE5PT1AhXG4gIH1cblxuICAvKiFcbiAgICogSGFuZHkgc2hvcnRjdXQgZm9yIGRvaW5nIGEgZm9yLWluIGxvb3AuIFRoaXMgaXMgbm90IGEgXCJub3JtYWxcIiBlYWNoXG4gICAqIGZ1bmN0aW9uLCBpdCBpcyBvcHRpbWl6ZWQgZm9yIFNoaWZ0eS4gIFRoZSBpdGVyYXRvciBmdW5jdGlvbiBvbmx5IHJlY2VpdmVzXG4gICAqIHRoZSBwcm9wZXJ0eSBuYW1lLCBub3QgdGhlIHZhbHVlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24oc3RyaW5nKX0gZm5cbiAgICovXG4gIGZ1bmN0aW9uIGVhY2ggKG9iaiwgZm4pIHtcbiAgICB2YXIga2V5O1xuICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICBmbihrZXkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qIVxuICAgKiBQZXJmb3JtIGEgc2hhbGxvdyBjb3B5IG9mIE9iamVjdCBwcm9wZXJ0aWVzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0T2JqZWN0IFRoZSBvYmplY3QgdG8gY29weSBpbnRvXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzcmNPYmplY3QgVGhlIG9iamVjdCB0byBjb3B5IGZyb21cbiAgICogQHJldHVybiB7T2JqZWN0fSBBIHJlZmVyZW5jZSB0byB0aGUgYXVnbWVudGVkIGB0YXJnZXRPYmpgIE9iamVjdFxuICAgKi9cbiAgZnVuY3Rpb24gc2hhbGxvd0NvcHkgKHRhcmdldE9iaiwgc3JjT2JqKSB7XG4gICAgZWFjaChzcmNPYmosIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICB0YXJnZXRPYmpbcHJvcF0gPSBzcmNPYmpbcHJvcF07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGFyZ2V0T2JqO1xuICB9XG5cbiAgLyohXG4gICAqIENvcGllcyBlYWNoIHByb3BlcnR5IGZyb20gc3JjIG9udG8gdGFyZ2V0LCBidXQgb25seSBpZiB0aGUgcHJvcGVydHkgdG9cbiAgICogY29weSB0byB0YXJnZXQgaXMgdW5kZWZpbmVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IE1pc3NpbmcgcHJvcGVydGllcyBpbiB0aGlzIE9iamVjdCBhcmUgZmlsbGVkIGluXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzcmNcbiAgICovXG4gIGZ1bmN0aW9uIGRlZmF1bHRzICh0YXJnZXQsIHNyYykge1xuICAgIGVhY2goc3JjLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgaWYgKHR5cGVvZiB0YXJnZXRbcHJvcF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRhcmdldFtwcm9wXSA9IHNyY1twcm9wXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qIVxuICAgKiBDYWxjdWxhdGVzIHRoZSBpbnRlcnBvbGF0ZWQgdHdlZW4gdmFsdWVzIG9mIGFuIE9iamVjdCBmb3IgYSBnaXZlblxuICAgKiB0aW1lc3RhbXAuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmb3JQb3NpdGlvbiBUaGUgcG9zaXRpb24gdG8gY29tcHV0ZSB0aGUgc3RhdGUgZm9yLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY3VycmVudFN0YXRlIEN1cnJlbnQgc3RhdGUgcHJvcGVydGllcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9yaWdpbmFsU3RhdGU6IFRoZSBvcmlnaW5hbCBzdGF0ZSBwcm9wZXJ0aWVzIHRoZSBPYmplY3QgaXNcbiAgICogdHdlZW5pbmcgZnJvbS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFN0YXRlOiBUaGUgZGVzdGluYXRpb24gc3RhdGUgcHJvcGVydGllcyB0aGUgT2JqZWN0XG4gICAqIGlzIHR3ZWVuaW5nIHRvLlxuICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb246IFRoZSBsZW5ndGggb2YgdGhlIHR3ZWVuIGluIG1pbGxpc2Vjb25kcy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVzdGFtcDogVGhlIFVOSVggZXBvY2ggdGltZSBhdCB3aGljaCB0aGUgdHdlZW4gYmVnYW4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmc6IFRoaXMgT2JqZWN0J3Mga2V5cyBtdXN0IGNvcnJlc3BvbmQgdG8gdGhlIGtleXMgaW5cbiAgICogdGFyZ2V0U3RhdGUuXG4gICAqL1xuICBmdW5jdGlvbiB0d2VlblByb3BzIChmb3JQb3NpdGlvbiwgY3VycmVudFN0YXRlLCBvcmlnaW5hbFN0YXRlLCB0YXJnZXRTdGF0ZSxcbiAgICBkdXJhdGlvbiwgdGltZXN0YW1wLCBlYXNpbmcpIHtcbiAgICB2YXIgbm9ybWFsaXplZFBvc2l0aW9uID0gKGZvclBvc2l0aW9uIC0gdGltZXN0YW1wKSAvIGR1cmF0aW9uO1xuXG4gICAgdmFyIHByb3A7XG4gICAgZm9yIChwcm9wIGluIGN1cnJlbnRTdGF0ZSkge1xuICAgICAgaWYgKGN1cnJlbnRTdGF0ZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICBjdXJyZW50U3RhdGVbcHJvcF0gPSB0d2VlblByb3Aob3JpZ2luYWxTdGF0ZVtwcm9wXSxcbiAgICAgICAgICB0YXJnZXRTdGF0ZVtwcm9wXSwgZm9ybXVsYVtlYXNpbmdbcHJvcF1dLCBub3JtYWxpemVkUG9zaXRpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjdXJyZW50U3RhdGU7XG4gIH1cblxuICAvKiFcbiAgICogVHdlZW5zIGEgc2luZ2xlIHByb3BlcnR5LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgVGhlIHZhbHVlIHRoYXQgdGhlIHR3ZWVuIHN0YXJ0ZWQgZnJvbS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgdmFsdWUgdGhhdCB0aGUgdHdlZW4gc2hvdWxkIGVuZCBhdC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZWFzaW5nRnVuYyBUaGUgZWFzaW5nIGN1cnZlIHRvIGFwcGx5IHRvIHRoZSB0d2Vlbi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIFRoZSBub3JtYWxpemVkIHBvc2l0aW9uIChiZXR3ZWVuIDAuMCBhbmQgMS4wKSB0b1xuICAgKiBjYWxjdWxhdGUgdGhlIG1pZHBvaW50IG9mICdzdGFydCcgYW5kICdlbmQnIGFnYWluc3QuXG4gICAqIEByZXR1cm4ge251bWJlcn0gVGhlIHR3ZWVuZWQgdmFsdWUuXG4gICAqL1xuICBmdW5jdGlvbiB0d2VlblByb3AgKHN0YXJ0LCBlbmQsIGVhc2luZ0Z1bmMsIHBvc2l0aW9uKSB7XG4gICAgcmV0dXJuIHN0YXJ0ICsgKGVuZCAtIHN0YXJ0KSAqIGVhc2luZ0Z1bmMocG9zaXRpb24pO1xuICB9XG5cbiAgLyohXG4gICAqIEFwcGxpZXMgYSBmaWx0ZXIgdG8gVHdlZW5hYmxlIGluc3RhbmNlLlxuICAgKiBAcGFyYW0ge1R3ZWVuYWJsZX0gdHdlZW5hYmxlIFRoZSBgVHdlZW5hYmxlYCBpbnN0YW5jZSB0byBjYWxsIHRoZSBmaWx0ZXJcbiAgICogdXBvbi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGZpbHRlck5hbWUgVGhlIG5hbWUgb2YgdGhlIGZpbHRlciB0byBhcHBseS5cbiAgICovXG4gIGZ1bmN0aW9uIGFwcGx5RmlsdGVyICh0d2VlbmFibGUsIGZpbHRlck5hbWUpIHtcbiAgICB2YXIgZmlsdGVycyA9IFR3ZWVuYWJsZS5wcm90b3R5cGUuZmlsdGVyO1xuICAgIHZhciBhcmdzID0gdHdlZW5hYmxlLl9maWx0ZXJBcmdzO1xuXG4gICAgZWFjaChmaWx0ZXJzLCBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWx0ZXJzW25hbWVdW2ZpbHRlck5hbWVdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWx0ZXJzW25hbWVdW2ZpbHRlck5hbWVdLmFwcGx5KHR3ZWVuYWJsZSwgYXJncyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB2YXIgdGltZW91dEhhbmRsZXJfZW5kVGltZTtcbiAgdmFyIHRpbWVvdXRIYW5kbGVyX2N1cnJlbnRUaW1lO1xuICB2YXIgdGltZW91dEhhbmRsZXJfaXNFbmRlZDtcbiAgLyohXG4gICAqIEhhbmRsZXMgdGhlIHVwZGF0ZSBsb2dpYyBmb3Igb25lIHN0ZXAgb2YgYSB0d2Vlbi5cbiAgICogQHBhcmFtIHtUd2VlbmFibGV9IHR3ZWVuYWJsZVxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gY3VycmVudFN0YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcmlnaW5hbFN0YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRTdGF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHN0ZXBcbiAgICogQHBhcmFtIHtGdW5jdGlvbihGdW5jdGlvbixudW1iZXIpfX0gc2NoZWR1bGVcbiAgICovXG4gIGZ1bmN0aW9uIHRpbWVvdXRIYW5kbGVyICh0d2VlbmFibGUsIHRpbWVzdGFtcCwgZHVyYXRpb24sIGN1cnJlbnRTdGF0ZSxcbiAgICBvcmlnaW5hbFN0YXRlLCB0YXJnZXRTdGF0ZSwgZWFzaW5nLCBzdGVwLCBzY2hlZHVsZSkge1xuICAgIHRpbWVvdXRIYW5kbGVyX2VuZFRpbWUgPSB0aW1lc3RhbXAgKyBkdXJhdGlvbjtcbiAgICB0aW1lb3V0SGFuZGxlcl9jdXJyZW50VGltZSA9IE1hdGgubWluKG5vdygpLCB0aW1lb3V0SGFuZGxlcl9lbmRUaW1lKTtcbiAgICB0aW1lb3V0SGFuZGxlcl9pc0VuZGVkID0gdGltZW91dEhhbmRsZXJfY3VycmVudFRpbWUgPj0gdGltZW91dEhhbmRsZXJfZW5kVGltZTtcblxuICAgIGlmICh0d2VlbmFibGUuaXNQbGF5aW5nKCkgJiYgIXRpbWVvdXRIYW5kbGVyX2lzRW5kZWQpIHtcbiAgICAgIHNjaGVkdWxlKHR3ZWVuYWJsZS5fdGltZW91dEhhbmRsZXIsIFVQREFURV9USU1FKTtcblxuICAgICAgYXBwbHlGaWx0ZXIodHdlZW5hYmxlLCAnYmVmb3JlVHdlZW4nKTtcbiAgICAgIHR3ZWVuUHJvcHModGltZW91dEhhbmRsZXJfY3VycmVudFRpbWUsIGN1cnJlbnRTdGF0ZSwgb3JpZ2luYWxTdGF0ZSxcbiAgICAgICAgdGFyZ2V0U3RhdGUsIGR1cmF0aW9uLCB0aW1lc3RhbXAsIGVhc2luZyk7XG4gICAgICBhcHBseUZpbHRlcih0d2VlbmFibGUsICdhZnRlclR3ZWVuJyk7XG5cbiAgICAgIHN0ZXAoY3VycmVudFN0YXRlKTtcbiAgICB9IGVsc2UgaWYgKHRpbWVvdXRIYW5kbGVyX2lzRW5kZWQpIHtcbiAgICAgIHN0ZXAodGFyZ2V0U3RhdGUpO1xuICAgICAgdHdlZW5hYmxlLnN0b3AodHJ1ZSk7XG4gICAgfVxuICB9XG5cblxuICAvKiFcbiAgICogQ3JlYXRlcyBhIHVzYWJsZSBlYXNpbmcgT2JqZWN0IGZyb20gZWl0aGVyIGEgc3RyaW5nIG9yIGFub3RoZXIgZWFzaW5nXG4gICAqIE9iamVjdC4gIElmIGBlYXNpbmdgIGlzIGFuIE9iamVjdCwgdGhlbiB0aGlzIGZ1bmN0aW9uIGNsb25lcyBpdCBhbmQgZmlsbHNcbiAgICogaW4gdGhlIG1pc3NpbmcgcHJvcGVydGllcyB3aXRoIFwibGluZWFyXCIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tVHdlZW5QYXJhbXNcbiAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBlYXNpbmdcbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBvc2VFYXNpbmdPYmplY3QgKGZyb21Ud2VlblBhcmFtcywgZWFzaW5nKSB7XG4gICAgdmFyIGNvbXBvc2VkRWFzaW5nID0ge307XG5cbiAgICBpZiAodHlwZW9mIGVhc2luZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVhY2goZnJvbVR3ZWVuUGFyYW1zLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICBjb21wb3NlZEVhc2luZ1twcm9wXSA9IGVhc2luZztcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBlYWNoKGZyb21Ud2VlblBhcmFtcywgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgaWYgKCFjb21wb3NlZEVhc2luZ1twcm9wXSkge1xuICAgICAgICAgIGNvbXBvc2VkRWFzaW5nW3Byb3BdID0gZWFzaW5nW3Byb3BdIHx8IERFRkFVTFRfRUFTSU5HO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29tcG9zZWRFYXNpbmc7XG4gIH1cblxuICAvKipcbiAgICogVHdlZW5hYmxlIGNvbnN0cnVjdG9yLlxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9pbml0aWFsU3RhdGUgVGhlIHZhbHVlcyB0aGF0IHRoZSBpbml0aWFsIHR3ZWVuIHNob3VsZCBzdGFydCBhdCBpZiBhIFwiZnJvbVwiIG9iamVjdCBpcyBub3QgcHJvdmlkZWQgdG8gVHdlZW5hYmxlI3R3ZWVuLlxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9jb25maWcgU2VlIFR3ZWVuYWJsZS5wcm90b3R5cGUuc2V0Q29uZmlnKClcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBmdW5jdGlvbiBUd2VlbmFibGUgKG9wdF9pbml0aWFsU3RhdGUsIG9wdF9jb25maWcpIHtcbiAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSBvcHRfaW5pdGlhbFN0YXRlIHx8IHt9O1xuICAgIHRoaXMuX2NvbmZpZ3VyZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9zY2hlZHVsZUZ1bmN0aW9uID0gREVGQVVMVF9TQ0hFRFVMRV9GVU5DVElPTjtcblxuICAgIC8vIFRvIHByZXZlbnQgdW5uZWNlc3NhcnkgY2FsbHMgdG8gc2V0Q29uZmlnIGRvIG5vdCBzZXQgZGVmYXVsdCBjb25maWd1cmF0aW9uIGhlcmUuXG4gICAgLy8gT25seSBzZXQgZGVmYXVsdCBjb25maWd1cmF0aW9uIGltbWVkaWF0ZWx5IGJlZm9yZSB0d2VlbmluZyBpZiBub25lIGhhcyBiZWVuIHNldC5cbiAgICBpZiAodHlwZW9mIG9wdF9jb25maWcgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLnNldENvbmZpZyhvcHRfY29uZmlnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIGFuZCBzdGFydCBhIHR3ZWVuLlxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9jb25maWcgU2VlIFR3ZWVuYWJsZS5wcm90b3R5cGUuc2V0Q29uZmlnKClcbiAgICogQHJldHVybiB7VHdlZW5hYmxlfVxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS50d2VlbiA9IGZ1bmN0aW9uIChvcHRfY29uZmlnKSB7XG4gICAgaWYgKHRoaXMuX2lzVHdlZW5pbmcpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vIE9ubHkgc2V0IGRlZmF1bHQgY29uZmlnIGlmIG5vIGNvbmZpZ3VyYXRpb24gaGFzIGJlZW4gc2V0IHByZXZpb3VzbHkgYW5kIG5vbmUgaXMgcHJvdmlkZWQgbm93LlxuICAgIGlmIChvcHRfY29uZmlnICE9PSB1bmRlZmluZWQgfHwgIXRoaXMuX2NvbmZpZ3VyZWQpIHtcbiAgICAgIHRoaXMuc2V0Q29uZmlnKG9wdF9jb25maWcpO1xuICAgIH1cblxuICAgIHRoaXMuX3N0YXJ0KHRoaXMuZ2V0KCkpO1xuICAgIHJldHVybiB0aGlzLnJlc3VtZSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB0d2VlbiBjb25maWd1cmF0aW9uLiBgY29uZmlnYCBtYXkgaGF2ZSB0aGUgZm9sbG93aW5nIG9wdGlvbnM6XG4gICAqXG4gICAqIC0gX19mcm9tX18gKF9PYmplY3Q9Xyk6IFN0YXJ0aW5nIHBvc2l0aW9uLiAgSWYgb21pdHRlZCwgdGhlIGN1cnJlbnQgc3RhdGUgaXMgdXNlZC5cbiAgICogLSBfX3RvX18gKF9PYmplY3Q9Xyk6IEVuZGluZyBwb3NpdGlvbi5cbiAgICogLSBfX2R1cmF0aW9uX18gKF9udW1iZXI9Xyk6IEhvdyBtYW55IG1pbGxpc2Vjb25kcyB0byBhbmltYXRlIGZvci5cbiAgICogLSBfX3N0YXJ0X18gKF9GdW5jdGlvbihPYmplY3QpPV8pOiBGdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIHR3ZWVuIGJlZ2lucy4gIFJlY2VpdmVzIHRoZSBzdGF0ZSBvZiB0aGUgdHdlZW4gYXMgdGhlIG9ubHkgcGFyYW1ldGVyLlxuICAgKiAtIF9fc3RlcF9fIChfRnVuY3Rpb24oT2JqZWN0KT1fKTogRnVuY3Rpb24gdG8gZXhlY3V0ZSBvbiBldmVyeSB0aWNrLiAgUmVjZWl2ZXMgdGhlIHN0YXRlIG9mIHRoZSB0d2VlbiBhcyB0aGUgb25seSBwYXJhbWV0ZXIuICBUaGlzIGZ1bmN0aW9uIGlzIG5vdCBjYWxsZWQgb24gdGhlIGZpbmFsIHN0ZXAgb2YgdGhlIGFuaW1hdGlvbiwgYnV0IGBmaW5pc2hgIGlzLlxuICAgKiAtIF9fZmluaXNoX18gKF9GdW5jdGlvbihPYmplY3QpPV8pOiBGdW5jdGlvbiB0byBleGVjdXRlIHVwb24gdHdlZW4gY29tcGxldGlvbi4gIFJlY2VpdmVzIHRoZSBzdGF0ZSBvZiB0aGUgdHdlZW4gYXMgdGhlIG9ubHkgcGFyYW1ldGVyLlxuICAgKiAtIF9fZWFzaW5nX18gKF9PYmplY3R8c3RyaW5nPV8pOiBFYXNpbmcgY3VydmUgbmFtZShzKSB0byB1c2UgZm9yIHRoZSB0d2Vlbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xuICAgKiBAcmV0dXJuIHtUd2VlbmFibGV9XG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLnNldENvbmZpZyA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gICAgdGhpcy5fY29uZmlndXJlZCA9IHRydWU7XG5cbiAgICAvLyBJbml0IHRoZSBpbnRlcm5hbCBzdGF0ZVxuICAgIHRoaXMuX3BhdXNlZEF0VGltZSA9IG51bGw7XG4gICAgdGhpcy5fc3RhcnQgPSBjb25maWcuc3RhcnQgfHwgbm9vcDtcbiAgICB0aGlzLl9zdGVwID0gY29uZmlnLnN0ZXAgfHwgbm9vcDtcbiAgICB0aGlzLl9maW5pc2ggPSBjb25maWcuZmluaXNoIHx8IG5vb3A7XG4gICAgdGhpcy5fZHVyYXRpb24gPSBjb25maWcuZHVyYXRpb24gfHwgREVGQVVMVF9EVVJBVElPTjtcbiAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSBjb25maWcuZnJvbSB8fCB0aGlzLmdldCgpO1xuICAgIHRoaXMuX29yaWdpbmFsU3RhdGUgPSB0aGlzLmdldCgpO1xuICAgIHRoaXMuX3RhcmdldFN0YXRlID0gY29uZmlnLnRvIHx8IHRoaXMuZ2V0KCk7XG4gICAgdGhpcy5fdGltZXN0YW1wID0gbm93KCk7XG5cbiAgICAvLyBBbGlhc2VzIHVzZWQgYmVsb3dcbiAgICB2YXIgY3VycmVudFN0YXRlID0gdGhpcy5fY3VycmVudFN0YXRlO1xuICAgIHZhciB0YXJnZXRTdGF0ZSA9IHRoaXMuX3RhcmdldFN0YXRlO1xuXG4gICAgLy8gRW5zdXJlIHRoYXQgdGhlcmUgaXMgYWx3YXlzIHNvbWV0aGluZyB0byB0d2VlbiB0by5cbiAgICBkZWZhdWx0cyh0YXJnZXRTdGF0ZSwgY3VycmVudFN0YXRlKTtcblxuICAgIHRoaXMuX2Vhc2luZyA9IGNvbXBvc2VFYXNpbmdPYmplY3QoXG4gICAgICBjdXJyZW50U3RhdGUsIGNvbmZpZy5lYXNpbmcgfHwgREVGQVVMVF9FQVNJTkcpO1xuXG4gICAgdGhpcy5fZmlsdGVyQXJncyA9XG4gICAgICBbY3VycmVudFN0YXRlLCB0aGlzLl9vcmlnaW5hbFN0YXRlLCB0YXJnZXRTdGF0ZSwgdGhpcy5fZWFzaW5nXTtcblxuICAgIGFwcGx5RmlsdGVyKHRoaXMsICd0d2VlbkNyZWF0ZWQnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogR2V0cyB0aGUgY3VycmVudCBzdGF0ZS5cbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHNoYWxsb3dDb3B5KHt9LCB0aGlzLl9jdXJyZW50U3RhdGUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjdXJyZW50IHN0YXRlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdGhpcy5fY3VycmVudFN0YXRlID0gc3RhdGU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFBhdXNlcyBhIHR3ZWVuLiAgUGF1c2VkIHR3ZWVucyBjYW4gYmUgcmVzdW1lZCBmcm9tIHRoZSBwb2ludCBhdCB3aGljaCB0aGV5IHdlcmUgcGF1c2VkLiAgVGhpcyBpcyBkaWZmZXJlbnQgdGhhbiBbYHN0b3AoKWBdKCNzdG9wKSwgYXMgdGhhdCBtZXRob2QgY2F1c2VzIGEgdHdlZW4gdG8gc3RhcnQgb3ZlciB3aGVuIGl0IGlzIHJlc3VtZWQuXG4gICAqIEByZXR1cm4ge1R3ZWVuYWJsZX1cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fcGF1c2VkQXRUaW1lID0gbm93KCk7XG4gICAgdGhpcy5faXNQYXVzZWQgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXN1bWVzIGEgcGF1c2VkIHR3ZWVuLlxuICAgKiBAcmV0dXJuIHtUd2VlbmFibGV9XG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5faXNQYXVzZWQpIHtcbiAgICAgIHRoaXMuX3RpbWVzdGFtcCArPSBub3coKSAtIHRoaXMuX3BhdXNlZEF0VGltZTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1BhdXNlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2lzVHdlZW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuX3RpbWVvdXRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGltZW91dEhhbmRsZXIoc2VsZiwgc2VsZi5fdGltZXN0YW1wLCBzZWxmLl9kdXJhdGlvbiwgc2VsZi5fY3VycmVudFN0YXRlLFxuICAgICAgICBzZWxmLl9vcmlnaW5hbFN0YXRlLCBzZWxmLl90YXJnZXRTdGF0ZSwgc2VsZi5fZWFzaW5nLCBzZWxmLl9zdGVwLFxuICAgICAgICBzZWxmLl9zY2hlZHVsZUZ1bmN0aW9uKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fdGltZW91dEhhbmRsZXIoKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTdG9wcyBhbmQgY2FuY2VscyBhIHR3ZWVuLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBnb3RvRW5kIElmIGZhbHNlIG9yIG9taXR0ZWQsIHRoZSB0d2VlbiBqdXN0IHN0b3BzIGF0IGl0cyBjdXJyZW50IHN0YXRlLCBhbmQgdGhlIFwiZmluaXNoXCIgaGFuZGxlciBpcyBub3QgaW52b2tlZC4gIElmIHRydWUsIHRoZSB0d2VlbmVkIG9iamVjdCdzIHZhbHVlcyBhcmUgaW5zdGFudGx5IHNldCB0byB0aGUgdGFyZ2V0IHZhbHVlcywgYW5kIFwiZmluaXNoXCIgaXMgaW52b2tlZC5cbiAgICogQHJldHVybiB7VHdlZW5hYmxlfVxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKGdvdG9FbmQpIHtcbiAgICB0aGlzLl9pc1R3ZWVuaW5nID0gZmFsc2U7XG4gICAgdGhpcy5faXNQYXVzZWQgPSBmYWxzZTtcbiAgICB0aGlzLl90aW1lb3V0SGFuZGxlciA9IG5vb3A7XG5cbiAgICBpZiAoZ290b0VuZCkge1xuICAgICAgc2hhbGxvd0NvcHkodGhpcy5fY3VycmVudFN0YXRlLCB0aGlzLl90YXJnZXRTdGF0ZSk7XG4gICAgICBhcHBseUZpbHRlcih0aGlzLCAnYWZ0ZXJUd2VlbkVuZCcpO1xuICAgICAgdGhpcy5fZmluaXNoLmNhbGwodGhpcywgdGhpcy5fY3VycmVudFN0YXRlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIHR3ZWVuIGlzIHJ1bm5pbmcuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLmlzUGxheWluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNUd2VlbmluZyAmJiAhdGhpcy5faXNQYXVzZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldHMgYSBjdXN0b20gc2NoZWR1bGUgZnVuY3Rpb24uXG4gICAqXG4gICAqIElmIGEgY3VzdG9tIGZ1bmN0aW9uIGlzIG5vdCBzZXQgdGhlIGRlZmF1bHQgb25lIGlzIHVzZWQgW2ByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkgaWYgYXZhaWxhYmxlLCBvdGhlcndpc2UgW2BzZXRUaW1lb3V0YF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dpbmRvdy5zZXRUaW1lb3V0KSkuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24oRnVuY3Rpb24sbnVtYmVyKX0gc2NoZWR1bGVGdW5jdGlvbiBUaGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHRvIHNjaGVkdWxlIHRoZSBuZXh0IGZyYW1lIHRvIGJlIHJlbmRlcmVkXG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLnNldFNjaGVkdWxlRnVuY3Rpb24gPSBmdW5jdGlvbiAoc2NoZWR1bGVGdW5jdGlvbikge1xuICAgIHRoaXMuX3NjaGVkdWxlRnVuY3Rpb24gPSBzY2hlZHVsZUZ1bmN0aW9uO1xuICB9O1xuXG4gIC8qKlxuICAgKiBgZGVsZXRlYHMgYWxsIFwib3duXCIgcHJvcGVydGllcy4gIENhbGwgdGhpcyB3aGVuIHRoZSBgVHdlZW5hYmxlYCBpbnN0YW5jZSBpcyBubyBsb25nZXIgbmVlZGVkIHRvIGZyZWUgbWVtb3J5LlxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9wO1xuICAgIGZvciAocHJvcCBpbiB0aGlzKSB7XG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICBkZWxldGUgdGhpc1twcm9wXTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyohXG4gICAqIEZpbHRlcnMgYXJlIHVzZWQgZm9yIHRyYW5zZm9ybWluZyB0aGUgcHJvcGVydGllcyBvZiBhIHR3ZWVuIGF0IHZhcmlvdXNcbiAgICogcG9pbnRzIGluIGEgVHdlZW5hYmxlJ3MgbGlmZSBjeWNsZS4gIFNlZSB0aGUgUkVBRE1FIGZvciBtb3JlIGluZm8gb24gdGhpcy5cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuZmlsdGVyID0ge307XG5cbiAgLyohXG4gICAqIFRoaXMgb2JqZWN0IGNvbnRhaW5zIGFsbCBvZiB0aGUgdHdlZW5zIGF2YWlsYWJsZSB0byBTaGlmdHkuICBJdCBpcyBleHRlbmRpYmxlIC0gc2ltcGx5IGF0dGFjaCBwcm9wZXJ0aWVzIHRvIHRoZSBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGEgT2JqZWN0IGZvbGxvd2luZyB0aGUgc2FtZSBmb3JtYXQgYXQgbGluZWFyLlxuICAgKlxuICAgKiBgcG9zYCBzaG91bGQgYmUgYSBub3JtYWxpemVkIGBudW1iZXJgIChiZXR3ZWVuIDAgYW5kIDEpLlxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhID0ge1xuICAgIGxpbmVhcjogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIHBvcztcbiAgICB9XG4gIH07XG5cbiAgZm9ybXVsYSA9IFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYTtcblxuICBzaGFsbG93Q29weShUd2VlbmFibGUsIHtcbiAgICAnbm93Jzogbm93XG4gICAgLCdlYWNoJzogZWFjaFxuICAgICwndHdlZW5Qcm9wcyc6IHR3ZWVuUHJvcHNcbiAgICAsJ3R3ZWVuUHJvcCc6IHR3ZWVuUHJvcFxuICAgICwnYXBwbHlGaWx0ZXInOiBhcHBseUZpbHRlclxuICAgICwnc2hhbGxvd0NvcHknOiBzaGFsbG93Q29weVxuICAgICwnZGVmYXVsdHMnOiBkZWZhdWx0c1xuICAgICwnY29tcG9zZUVhc2luZ09iamVjdCc6IGNvbXBvc2VFYXNpbmdPYmplY3RcbiAgfSk7XG5cbiAgLy8gYHJvb3RgIGlzIHByb3ZpZGVkIGluIHRoZSBpbnRyby9vdXRybyBmaWxlcy5cblxuICAvLyBBIGhvb2sgdXNlZCBmb3IgdW5pdCB0ZXN0aW5nLlxuICBpZiAodHlwZW9mIFNISUZUWV9ERUJVR19OT1cgPT09ICdmdW5jdGlvbicpIHtcbiAgICByb290LnRpbWVvdXRIYW5kbGVyID0gdGltZW91dEhhbmRsZXI7XG4gIH1cblxuICAvLyBCb290c3RyYXAgVHdlZW5hYmxlIGFwcHJvcHJpYXRlbHkgZm9yIHRoZSBlbnZpcm9ubWVudC5cbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBUd2VlbmFibGU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtyZXR1cm4gVHdlZW5hYmxlO30pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiByb290LlR3ZWVuYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBCcm93c2VyOiBNYWtlIGBUd2VlbmFibGVgIGdsb2JhbGx5IGFjY2Vzc2libGUuXG4gICAgcm9vdC5Ud2VlbmFibGUgPSBUd2VlbmFibGU7XG4gIH1cblxuICByZXR1cm4gVHdlZW5hYmxlO1xuXG59ICgpKTtcblxuLyohXG4gKiBBbGwgZXF1YXRpb25zIGFyZSBhZGFwdGVkIGZyb20gVGhvbWFzIEZ1Y2hzJyBbU2NyaXB0eTJdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYWRyb2JieS9zY3JpcHR5Mi9ibG9iL21hc3Rlci9zcmMvZWZmZWN0cy90cmFuc2l0aW9ucy9wZW5uZXIuanMpLlxuICpcbiAqIEJhc2VkIG9uIEVhc2luZyBFcXVhdGlvbnMgKGMpIDIwMDMgW1JvYmVydCBQZW5uZXJdKGh0dHA6Ly93d3cucm9iZXJ0cGVubmVyLmNvbS8pLCBhbGwgcmlnaHRzIHJlc2VydmVkLiBUaGlzIHdvcmsgaXMgW3N1YmplY3QgdG8gdGVybXNdKGh0dHA6Ly93d3cucm9iZXJ0cGVubmVyLmNvbS9lYXNpbmdfdGVybXNfb2ZfdXNlLmh0bWwpLlxuICovXG5cbi8qIVxuICogIFRFUk1TIE9GIFVTRSAtIEVBU0lORyBFUVVBVElPTlNcbiAqICBPcGVuIHNvdXJjZSB1bmRlciB0aGUgQlNEIExpY2Vuc2UuXG4gKiAgRWFzaW5nIEVxdWF0aW9ucyAoYykgMjAwMyBSb2JlcnQgUGVubmVyLCBhbGwgcmlnaHRzIHJlc2VydmVkLlxuICovXG5cbjsoZnVuY3Rpb24gKCkge1xuXG4gIFR3ZWVuYWJsZS5zaGFsbG93Q29weShUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGEsIHtcbiAgICBlYXNlSW5RdWFkOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLCAyKTtcbiAgICB9LFxuXG4gICAgZWFzZU91dFF1YWQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAtKE1hdGgucG93KChwb3MgLSAxKSwgMikgLSAxKTtcbiAgICB9LFxuXG4gICAgZWFzZUluT3V0UXVhZDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLDIpO31cbiAgICAgIHJldHVybiAtMC41ICogKChwb3MgLT0gMikgKiBwb3MgLSAyKTtcbiAgICB9LFxuXG4gICAgZWFzZUluQ3ViaWM6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBNYXRoLnBvdyhwb3MsIDMpO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0Q3ViaWM6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAoTWF0aC5wb3coKHBvcyAtIDEpLCAzKSArIDEpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXRDdWJpYzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLDMpO31cbiAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5wb3coKHBvcyAtIDIpLDMpICsgMik7XG4gICAgfSxcblxuICAgIGVhc2VJblF1YXJ0OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLCA0KTtcbiAgICB9LFxuXG4gICAgZWFzZU91dFF1YXJ0OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gLShNYXRoLnBvdygocG9zIC0gMSksIDQpIC0gMSk7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dFF1YXJ0OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsNCk7fVxuICAgICAgcmV0dXJuIC0wLjUgKiAoKHBvcyAtPSAyKSAqIE1hdGgucG93KHBvcywzKSAtIDIpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5RdWludDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIE1hdGgucG93KHBvcywgNSk7XG4gICAgfSxcblxuICAgIGVhc2VPdXRRdWludDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIChNYXRoLnBvdygocG9zIC0gMSksIDUpICsgMSk7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsNSk7fVxuICAgICAgcmV0dXJuIDAuNSAqIChNYXRoLnBvdygocG9zIC0gMiksNSkgKyAyKTtcbiAgICB9LFxuXG4gICAgZWFzZUluU2luZTogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIC1NYXRoLmNvcyhwb3MgKiAoTWF0aC5QSSAvIDIpKSArIDE7XG4gICAgfSxcblxuICAgIGVhc2VPdXRTaW5lOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5zaW4ocG9zICogKE1hdGguUEkgLyAyKSk7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dFNpbmU6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAoLTAuNSAqIChNYXRoLmNvcyhNYXRoLlBJICogcG9zKSAtIDEpKTtcbiAgICB9LFxuXG4gICAgZWFzZUluRXhwbzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIChwb3MgPT09IDApID8gMCA6IE1hdGgucG93KDIsIDEwICogKHBvcyAtIDEpKTtcbiAgICB9LFxuXG4gICAgZWFzZU91dEV4cG86IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAocG9zID09PSAxKSA/IDEgOiAtTWF0aC5wb3coMiwgLTEwICogcG9zKSArIDE7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dEV4cG86IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmIChwb3MgPT09IDApIHtyZXR1cm4gMDt9XG4gICAgICBpZiAocG9zID09PSAxKSB7cmV0dXJuIDE7fVxuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3coMiwxMCAqIChwb3MgLSAxKSk7fVxuICAgICAgcmV0dXJuIDAuNSAqICgtTWF0aC5wb3coMiwgLTEwICogLS1wb3MpICsgMik7XG4gICAgfSxcblxuICAgIGVhc2VJbkNpcmM6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAtKE1hdGguc3FydCgxIC0gKHBvcyAqIHBvcykpIC0gMSk7XG4gICAgfSxcblxuICAgIGVhc2VPdXRDaXJjOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5zcXJ0KDEgLSBNYXRoLnBvdygocG9zIC0gMSksIDIpKTtcbiAgICB9LFxuXG4gICAgZWFzZUluT3V0Q2lyYzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gLTAuNSAqIChNYXRoLnNxcnQoMSAtIHBvcyAqIHBvcykgLSAxKTt9XG4gICAgICByZXR1cm4gMC41ICogKE1hdGguc3FydCgxIC0gKHBvcyAtPSAyKSAqIHBvcykgKyAxKTtcbiAgICB9LFxuXG4gICAgZWFzZU91dEJvdW5jZTogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKChwb3MpIDwgKDEgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIHBvcyAqIHBvcyk7XG4gICAgICB9IGVsc2UgaWYgKHBvcyA8ICgyIC8gMi43NSkpIHtcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiAocG9zIC09ICgxLjUgLyAyLjc1KSkgKiBwb3MgKyAwLjc1KTtcbiAgICAgIH0gZWxzZSBpZiAocG9zIDwgKDIuNSAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogKHBvcyAtPSAoMi4yNSAvIDIuNzUpKSAqIHBvcyArIDAuOTM3NSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIChwb3MgLT0gKDIuNjI1IC8gMi43NSkpICogcG9zICsgMC45ODQzNzUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBlYXNlSW5CYWNrOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICByZXR1cm4gKHBvcykgKiBwb3MgKiAoKHMgKyAxKSAqIHBvcyAtIHMpO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0QmFjazogZnVuY3Rpb24gKHBvcykge1xuICAgICAgdmFyIHMgPSAxLjcwMTU4O1xuICAgICAgcmV0dXJuIChwb3MgPSBwb3MgLSAxKSAqIHBvcyAqICgocyArIDEpICogcG9zICsgcykgKyAxO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXRCYWNrOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAwLjUgKiAocG9zICogcG9zICogKCgocyAqPSAoMS41MjUpKSArIDEpICogcG9zIC0gcykpO31cbiAgICAgIHJldHVybiAwLjUgKiAoKHBvcyAtPSAyKSAqIHBvcyAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHBvcyArIHMpICsgMik7XG4gICAgfSxcblxuICAgIGVsYXN0aWM6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAtMSAqIE1hdGgucG93KDQsLTggKiBwb3MpICogTWF0aC5zaW4oKHBvcyAqIDYgLSAxKSAqICgyICogTWF0aC5QSSkgLyAyKSArIDE7XG4gICAgfSxcblxuICAgIHN3aW5nRnJvbVRvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICByZXR1cm4gKChwb3MgLz0gMC41KSA8IDEpID8gMC41ICogKHBvcyAqIHBvcyAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHBvcyAtIHMpKSA6XG4gICAgICAgICAgMC41ICogKChwb3MgLT0gMikgKiBwb3MgKiAoKChzICo9ICgxLjUyNSkpICsgMSkgKiBwb3MgKyBzKSArIDIpO1xuICAgIH0sXG5cbiAgICBzd2luZ0Zyb206IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHZhciBzID0gMS43MDE1ODtcbiAgICAgIHJldHVybiBwb3MgKiBwb3MgKiAoKHMgKyAxKSAqIHBvcyAtIHMpO1xuICAgIH0sXG5cbiAgICBzd2luZ1RvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICByZXR1cm4gKHBvcyAtPSAxKSAqIHBvcyAqICgocyArIDEpICogcG9zICsgcykgKyAxO1xuICAgIH0sXG5cbiAgICBib3VuY2U6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmIChwb3MgPCAoMSAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogcG9zICogcG9zKTtcbiAgICAgIH0gZWxzZSBpZiAocG9zIDwgKDIgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIChwb3MgLT0gKDEuNSAvIDIuNzUpKSAqIHBvcyArIDAuNzUpO1xuICAgICAgfSBlbHNlIGlmIChwb3MgPCAoMi41IC8gMi43NSkpIHtcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiAocG9zIC09ICgyLjI1IC8gMi43NSkpICogcG9zICsgMC45Mzc1KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogKHBvcyAtPSAoMi42MjUgLyAyLjc1KSkgKiBwb3MgKyAwLjk4NDM3NSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGJvdW5jZVBhc3Q6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmIChwb3MgPCAoMSAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogcG9zICogcG9zKTtcbiAgICAgIH0gZWxzZSBpZiAocG9zIDwgKDIgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gMiAtICg3LjU2MjUgKiAocG9zIC09ICgxLjUgLyAyLjc1KSkgKiBwb3MgKyAwLjc1KTtcbiAgICAgIH0gZWxzZSBpZiAocG9zIDwgKDIuNSAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAyIC0gKDcuNTYyNSAqIChwb3MgLT0gKDIuMjUgLyAyLjc1KSkgKiBwb3MgKyAwLjkzNzUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDIgLSAoNy41NjI1ICogKHBvcyAtPSAoMi42MjUgLyAyLjc1KSkgKiBwb3MgKyAwLjk4NDM3NSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVhc2VGcm9tVG86IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcyw0KTt9XG4gICAgICByZXR1cm4gLTAuNSAqICgocG9zIC09IDIpICogTWF0aC5wb3cocG9zLDMpIC0gMik7XG4gICAgfSxcblxuICAgIGVhc2VGcm9tOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLDQpO1xuICAgIH0sXG5cbiAgICBlYXNlVG86IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBNYXRoLnBvdyhwb3MsMC4yNSk7XG4gICAgfVxuICB9KTtcblxufSgpKTtcblxuLyohXG4gKiBUaGUgQmV6aWVyIG1hZ2ljIGluIHRoaXMgZmlsZSBpcyBhZGFwdGVkL2NvcGllZCBhbG1vc3Qgd2hvbGVzYWxlIGZyb21cbiAqIFtTY3JpcHR5Ml0oaHR0cHM6Ly9naXRodWIuY29tL21hZHJvYmJ5L3NjcmlwdHkyL2Jsb2IvbWFzdGVyL3NyYy9lZmZlY3RzL3RyYW5zaXRpb25zL2N1YmljLWJlemllci5qcyksXG4gKiB3aGljaCB3YXMgYWRhcHRlZCBmcm9tIEFwcGxlIGNvZGUgKHdoaWNoIHByb2JhYmx5IGNhbWUgZnJvbVxuICogW2hlcmVdKGh0dHA6Ly9vcGVuc291cmNlLmFwcGxlLmNvbS9zb3VyY2UvV2ViQ29yZS9XZWJDb3JlLTk1NS42Ni9wbGF0Zm9ybS9ncmFwaGljcy9Vbml0QmV6aWVyLmgpKS5cbiAqIFNwZWNpYWwgdGhhbmtzIHRvIEFwcGxlIGFuZCBUaG9tYXMgRnVjaHMgZm9yIG11Y2ggb2YgdGhpcyBjb2RlLlxuICovXG5cbi8qIVxuICogIENvcHlyaWdodCAoYykgMjAwNiBBcHBsZSBDb21wdXRlciwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqICBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAqICBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAqXG4gKiAgMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKlxuICogIDIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uXG4gKiAgYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKlxuICogIDMuIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGNvcHlyaWdodCBob2xkZXIocykgbm9yIHRoZSBuYW1lcyBvZiBhbnlcbiAqICBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbVxuICogIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG4gKlxuICogIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlNcbiAqICBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sXG4gKiAgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFXG4gKiAgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRVxuICogIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcbiAqICAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG4gKiAgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OXG4gKiAgQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbiAqICAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xuICogIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICovXG47KGZ1bmN0aW9uICgpIHtcbiAgLy8gcG9ydCBvZiB3ZWJraXQgY3ViaWMgYmV6aWVyIGhhbmRsaW5nIGJ5IGh0dHA6Ly93d3cubmV0emdlc3RhLmRlL2Rldi9cbiAgZnVuY3Rpb24gY3ViaWNCZXppZXJBdFRpbWUodCxwMXgscDF5LHAyeCxwMnksZHVyYXRpb24pIHtcbiAgICB2YXIgYXggPSAwLGJ4ID0gMCxjeCA9IDAsYXkgPSAwLGJ5ID0gMCxjeSA9IDA7XG4gICAgZnVuY3Rpb24gc2FtcGxlQ3VydmVYKHQpIHtyZXR1cm4gKChheCAqIHQgKyBieCkgKiB0ICsgY3gpICogdDt9XG4gICAgZnVuY3Rpb24gc2FtcGxlQ3VydmVZKHQpIHtyZXR1cm4gKChheSAqIHQgKyBieSkgKiB0ICsgY3kpICogdDt9XG4gICAgZnVuY3Rpb24gc2FtcGxlQ3VydmVEZXJpdmF0aXZlWCh0KSB7cmV0dXJuICgzLjAgKiBheCAqIHQgKyAyLjAgKiBieCkgKiB0ICsgY3g7fVxuICAgIGZ1bmN0aW9uIHNvbHZlRXBzaWxvbihkdXJhdGlvbikge3JldHVybiAxLjAgLyAoMjAwLjAgKiBkdXJhdGlvbik7fVxuICAgIGZ1bmN0aW9uIHNvbHZlKHgsZXBzaWxvbikge3JldHVybiBzYW1wbGVDdXJ2ZVkoc29sdmVDdXJ2ZVgoeCxlcHNpbG9uKSk7fVxuICAgIGZ1bmN0aW9uIGZhYnMobikge2lmIChuID49IDApIHtyZXR1cm4gbjt9ZWxzZSB7cmV0dXJuIDAgLSBuO319XG4gICAgZnVuY3Rpb24gc29sdmVDdXJ2ZVgoeCxlcHNpbG9uKSB7XG4gICAgICB2YXIgdDAsdDEsdDIseDIsZDIsaTtcbiAgICAgIGZvciAodDIgPSB4LCBpID0gMDsgaSA8IDg7IGkrKykge3gyID0gc2FtcGxlQ3VydmVYKHQyKSAtIHg7IGlmIChmYWJzKHgyKSA8IGVwc2lsb24pIHtyZXR1cm4gdDI7fSBkMiA9IHNhbXBsZUN1cnZlRGVyaXZhdGl2ZVgodDIpOyBpZiAoZmFicyhkMikgPCAxZS02KSB7YnJlYWs7fSB0MiA9IHQyIC0geDIgLyBkMjt9XG4gICAgICB0MCA9IDAuMDsgdDEgPSAxLjA7IHQyID0geDsgaWYgKHQyIDwgdDApIHtyZXR1cm4gdDA7fSBpZiAodDIgPiB0MSkge3JldHVybiB0MTt9XG4gICAgICB3aGlsZSAodDAgPCB0MSkge3gyID0gc2FtcGxlQ3VydmVYKHQyKTsgaWYgKGZhYnMoeDIgLSB4KSA8IGVwc2lsb24pIHtyZXR1cm4gdDI7fSBpZiAoeCA+IHgyKSB7dDAgPSB0Mjt9ZWxzZSB7dDEgPSB0Mjt9IHQyID0gKHQxIC0gdDApICogMC41ICsgdDA7fVxuICAgICAgcmV0dXJuIHQyOyAvLyBGYWlsdXJlLlxuICAgIH1cbiAgICBjeCA9IDMuMCAqIHAxeDsgYnggPSAzLjAgKiAocDJ4IC0gcDF4KSAtIGN4OyBheCA9IDEuMCAtIGN4IC0gYng7IGN5ID0gMy4wICogcDF5OyBieSA9IDMuMCAqIChwMnkgLSBwMXkpIC0gY3k7IGF5ID0gMS4wIC0gY3kgLSBieTtcbiAgICByZXR1cm4gc29sdmUodCwgc29sdmVFcHNpbG9uKGR1cmF0aW9uKSk7XG4gIH1cbiAgLyohXG4gICAqICBnZXRDdWJpY0JlemllclRyYW5zaXRpb24oeDEsIHkxLCB4MiwgeTIpIC0+IEZ1bmN0aW9uXG4gICAqXG4gICAqICBHZW5lcmF0ZXMgYSB0cmFuc2l0aW9uIGVhc2luZyBmdW5jdGlvbiB0aGF0IGlzIGNvbXBhdGlibGVcbiAgICogIHdpdGggV2ViS2l0J3MgQ1NTIHRyYW5zaXRpb25zIGAtd2Via2l0LXRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uYFxuICAgKiAgQ1NTIHByb3BlcnR5LlxuICAgKlxuICAgKiAgVGhlIFczQyBoYXMgbW9yZSBpbmZvcm1hdGlvbiBhYm91dFxuICAgKiAgPGEgaHJlZj1cImh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtdHJhbnNpdGlvbnMvI3RyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uX3RhZ1wiPlxuICAgKiAgQ1NTMyB0cmFuc2l0aW9uIHRpbWluZyBmdW5jdGlvbnM8L2E+LlxuICAgKlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHgxXG4gICAqICBAcGFyYW0ge251bWJlcn0geTFcbiAgICogIEBwYXJhbSB7bnVtYmVyfSB4MlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHkyXG4gICAqICBAcmV0dXJuIHtmdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEN1YmljQmV6aWVyVHJhbnNpdGlvbiAoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIGN1YmljQmV6aWVyQXRUaW1lKHBvcyx4MSx5MSx4Mix5MiwxKTtcbiAgICB9O1xuICB9XG4gIC8vIEVuZCBwb3J0ZWQgY29kZVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgQmV6aWVyIGVhc2luZyBmdW5jdGlvbiBhbmQgYXR0YWNoZXMgaXQgdG8gYFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYWAuICBUaGlzIGZ1bmN0aW9uIGdpdmVzIHlvdSB0b3RhbCBjb250cm9sIG92ZXIgdGhlIGVhc2luZyBjdXJ2ZS4gIE1hdHRoZXcgTGVpbidzIFtDZWFzZXJdKGh0dHA6Ly9tYXR0aGV3bGVpbi5jb20vY2Vhc2VyLykgaXMgYSB1c2VmdWwgdG9vbCBmb3IgdmlzdWFsaXppbmcgdGhlIGN1cnZlcyB5b3UgY2FuIG1ha2Ugd2l0aCB0aGlzIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZWFzaW5nIGN1cnZlLiAgT3ZlcndyaXRlcyB0aGUgb2xkIGVhc2luZyBmdW5jdGlvbiBvbiBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGEgaWYgaXQgZXhpc3RzLlxuICAgKiBAcGFyYW0ge251bWJlcn0geDFcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkxXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB4MlxuICAgKiBAcGFyYW0ge251bWJlcn0geTJcbiAgICogQHJldHVybiB7ZnVuY3Rpb259IFRoZSBlYXNpbmcgZnVuY3Rpb24gdGhhdCB3YXMgYXR0YWNoZWQgdG8gVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhLlxuICAgKi9cbiAgVHdlZW5hYmxlLnNldEJlemllckZ1bmN0aW9uID0gZnVuY3Rpb24gKG5hbWUsIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgdmFyIGN1YmljQmV6aWVyVHJhbnNpdGlvbiA9IGdldEN1YmljQmV6aWVyVHJhbnNpdGlvbih4MSwgeTEsIHgyLCB5Mik7XG4gICAgY3ViaWNCZXppZXJUcmFuc2l0aW9uLngxID0geDE7XG4gICAgY3ViaWNCZXppZXJUcmFuc2l0aW9uLnkxID0geTE7XG4gICAgY3ViaWNCZXppZXJUcmFuc2l0aW9uLngyID0geDI7XG4gICAgY3ViaWNCZXppZXJUcmFuc2l0aW9uLnkyID0geTI7XG5cbiAgICByZXR1cm4gVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhW25hbWVdID0gY3ViaWNCZXppZXJUcmFuc2l0aW9uO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIGBkZWxldGVgcyBhbiBlYXNpbmcgZnVuY3Rpb24gZnJvbSBgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhYC4gIEJlIGNhcmVmdWwgd2l0aCB0aGlzIG1ldGhvZCwgYXMgaXQgYGRlbGV0ZWBzIHdoYXRldmVyIGVhc2luZyBmb3JtdWxhIG1hdGNoZXMgYG5hbWVgICh3aGljaCBtZWFucyB5b3UgY2FuIGRlbGV0ZSBkZWZhdWx0IFNoaWZ0eSBlYXNpbmcgZnVuY3Rpb25zKS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGVhc2luZyBmdW5jdGlvbiB0byBkZWxldGUuXG4gICAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICAgKi9cbiAgVHdlZW5hYmxlLnVuc2V0QmV6aWVyRnVuY3Rpb24gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGRlbGV0ZSBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGFbbmFtZV07XG4gIH07XG5cbn0pKCk7XG5cbjsoZnVuY3Rpb24gKCkge1xuXG4gIGZ1bmN0aW9uIGdldEludGVycG9sYXRlZFZhbHVlcyAoXG4gICAgZnJvbSwgY3VycmVudCwgdGFyZ2V0U3RhdGUsIHBvc2l0aW9uLCBlYXNpbmcpIHtcbiAgICByZXR1cm4gVHdlZW5hYmxlLnR3ZWVuUHJvcHMoXG4gICAgICBwb3NpdGlvbiwgY3VycmVudCwgZnJvbSwgdGFyZ2V0U3RhdGUsIDEsIDAsIGVhc2luZyk7XG4gIH1cblxuICAvLyBGYWtlIGEgVHdlZW5hYmxlIGFuZCBwYXRjaCBzb21lIGludGVybmFscy4gIFRoaXMgYXBwcm9hY2ggYWxsb3dzIHVzIHRvXG4gIC8vIHNraXAgdW5lY2Nlc3NhcnkgcHJvY2Vzc2luZyBhbmQgb2JqZWN0IHJlY3JlYXRpb24sIGN1dHRpbmcgZG93biBvbiBnYXJiYWdlXG4gIC8vIGNvbGxlY3Rpb24gcGF1c2VzLlxuICB2YXIgbW9ja1R3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAgbW9ja1R3ZWVuYWJsZS5fZmlsdGVyQXJncyA9IFtdO1xuXG4gIC8qKlxuICAgKiBDb21wdXRlIHRoZSBtaWRwb2ludCBvZiB0d28gT2JqZWN0cy4gIFRoaXMgbWV0aG9kIGVmZmVjdGl2ZWx5IGNhbGN1bGF0ZXMgYSBzcGVjaWZpYyBmcmFtZSBvZiBhbmltYXRpb24gdGhhdCBbVHdlZW5hYmxlI3R3ZWVuXShzaGlmdHkuY29yZS5qcy5odG1sI3R3ZWVuKSBkb2VzIG1hbnkgdGltZXMgb3ZlciB0aGUgY291cnNlIG9mIGEgdHdlZW4uXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqXG4gICAqIGBgYFxuICAgKiAgdmFyIGludGVycG9sYXRlZFZhbHVlcyA9IFR3ZWVuYWJsZS5pbnRlcnBvbGF0ZSh7XG4gICAqICAgIHdpZHRoOiAnMTAwcHgnLFxuICAgKiAgICBvcGFjaXR5OiAwLFxuICAgKiAgICBjb2xvcjogJyNmZmYnXG4gICAqICB9LCB7XG4gICAqICAgIHdpZHRoOiAnMjAwcHgnLFxuICAgKiAgICBvcGFjaXR5OiAxLFxuICAgKiAgICBjb2xvcjogJyMwMDAnXG4gICAqICB9LCAwLjUpO1xuICAgKlxuICAgKiAgY29uc29sZS5sb2coaW50ZXJwb2xhdGVkVmFsdWVzKTtcbiAgICogIC8vIHtvcGFjaXR5OiAwLjUsIHdpZHRoOiBcIjE1MHB4XCIsIGNvbG9yOiBcInJnYigxMjcsMTI3LDEyNylcIn1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tIFRoZSBzdGFydGluZyB2YWx1ZXMgdG8gdHdlZW4gZnJvbS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFN0YXRlIFRoZSBlbmRpbmcgdmFsdWVzIHRvIHR3ZWVuIHRvLlxuICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb24gVGhlIG5vcm1hbGl6ZWQgcG9zaXRpb24gdmFsdWUgKGJldHdlZW4gMC4wIGFuZCAxLjApIHRvIGludGVycG9sYXRlIHRoZSB2YWx1ZXMgYmV0d2VlbiBgZnJvbWAgYW5kIGB0b2AgZm9yLiAgYGZyb21gIHJlcHJlc2VudHMgMCBhbmQgYHRvYCByZXByZXNlbnRzIGAxYC5cbiAgICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fSBlYXNpbmcgVGhlIGVhc2luZyBjdXJ2ZShzKSB0byBjYWxjdWxhdGUgdGhlIG1pZHBvaW50IGFnYWluc3QuICBZb3UgY2FuIHJlZmVyZW5jZSBhbnkgZWFzaW5nIGZ1bmN0aW9uIGF0dGFjaGVkIHRvIGBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGFgLiAgSWYgb21pdHRlZCwgdGhpcyBkZWZhdWx0cyB0byBcImxpbmVhclwiLlxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBUd2VlbmFibGUuaW50ZXJwb2xhdGUgPSBmdW5jdGlvbiAoZnJvbSwgdGFyZ2V0U3RhdGUsIHBvc2l0aW9uLCBlYXNpbmcpIHtcbiAgICB2YXIgY3VycmVudCA9IFR3ZWVuYWJsZS5zaGFsbG93Q29weSh7fSwgZnJvbSk7XG4gICAgdmFyIGVhc2luZ09iamVjdCA9IFR3ZWVuYWJsZS5jb21wb3NlRWFzaW5nT2JqZWN0KFxuICAgICAgZnJvbSwgZWFzaW5nIHx8ICdsaW5lYXInKTtcblxuICAgIG1vY2tUd2VlbmFibGUuc2V0KHt9KTtcblxuICAgIC8vIEFsaWFzIGFuZCByZXVzZSB0aGUgX2ZpbHRlckFyZ3MgYXJyYXkgaW5zdGVhZCBvZiByZWNyZWF0aW5nIGl0LlxuICAgIHZhciBmaWx0ZXJBcmdzID0gbW9ja1R3ZWVuYWJsZS5fZmlsdGVyQXJncztcbiAgICBmaWx0ZXJBcmdzLmxlbmd0aCA9IDA7XG4gICAgZmlsdGVyQXJnc1swXSA9IGN1cnJlbnQ7XG4gICAgZmlsdGVyQXJnc1sxXSA9IGZyb207XG4gICAgZmlsdGVyQXJnc1syXSA9IHRhcmdldFN0YXRlO1xuICAgIGZpbHRlckFyZ3NbM10gPSBlYXNpbmdPYmplY3Q7XG5cbiAgICAvLyBBbnkgZGVmaW5lZCB2YWx1ZSB0cmFuc2Zvcm1hdGlvbiBtdXN0IGJlIGFwcGxpZWRcbiAgICBUd2VlbmFibGUuYXBwbHlGaWx0ZXIobW9ja1R3ZWVuYWJsZSwgJ3R3ZWVuQ3JlYXRlZCcpO1xuICAgIFR3ZWVuYWJsZS5hcHBseUZpbHRlcihtb2NrVHdlZW5hYmxlLCAnYmVmb3JlVHdlZW4nKTtcblxuICAgIHZhciBpbnRlcnBvbGF0ZWRWYWx1ZXMgPSBnZXRJbnRlcnBvbGF0ZWRWYWx1ZXMoXG4gICAgICBmcm9tLCBjdXJyZW50LCB0YXJnZXRTdGF0ZSwgcG9zaXRpb24sIGVhc2luZ09iamVjdCk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gdmFsdWVzIGJhY2sgaW50byB0aGVpciBvcmlnaW5hbCBmb3JtYXRcbiAgICBUd2VlbmFibGUuYXBwbHlGaWx0ZXIobW9ja1R3ZWVuYWJsZSwgJ2FmdGVyVHdlZW4nKTtcblxuICAgIHJldHVybiBpbnRlcnBvbGF0ZWRWYWx1ZXM7XG4gIH07XG5cbn0oKSk7XG5cbi8qKlxuICogQWRkcyBzdHJpbmcgaW50ZXJwb2xhdGlvbiBzdXBwb3J0IHRvIFNoaWZ0eS5cbiAqXG4gKiBUaGUgVG9rZW4gZXh0ZW5zaW9uIGFsbG93cyBTaGlmdHkgdG8gdHdlZW4gbnVtYmVycyBpbnNpZGUgb2Ygc3RyaW5ncy4gIEFtb25nIG90aGVyIHRoaW5ncywgdGhpcyBhbGxvd3MgeW91IHRvIGFuaW1hdGUgQ1NTIHByb3BlcnRpZXMuICBGb3IgZXhhbXBsZSwgeW91IGNhbiBkbyB0aGlzOlxuICpcbiAqIGBgYFxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XG4gKiAgIGZyb206IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg0NXB4KSd9LFxuICogICB0bzogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDkweHApJ31cbiAqIH0pO1xuICogYGBgXG4gKlxuICogYHRyYW5zbGF0ZVgoNDUpYCB3aWxsIGJlIHR3ZWVuZWQgdG8gYHRyYW5zbGF0ZVgoOTApYC4gIFRvIGRlbW9uc3RyYXRlOlxuICpcbiAqIGBgYFxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XG4gKiAgIGZyb206IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg0NXB4KSd9LFxuICogICB0bzogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDkwcHgpJ30sXG4gKiAgIHN0ZXA6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICogICAgIGNvbnNvbGUubG9nKHN0YXRlLnRyYW5zZm9ybSk7XG4gKiAgIH1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogVGhlIGFib3ZlIHNuaXBwZXQgd2lsbCBsb2cgc29tZXRoaW5nIGxpa2UgdGhpcyBpbiB0aGUgY29uc29sZTpcbiAqXG4gKiBgYGBcbiAqIHRyYW5zbGF0ZVgoNjAuM3B4KVxuICogLi4uXG4gKiB0cmFuc2xhdGVYKDc2LjA1cHgpXG4gKiAuLi5cbiAqIHRyYW5zbGF0ZVgoOTBweClcbiAqIGBgYFxuICpcbiAqIEFub3RoZXIgdXNlIGZvciB0aGlzIGlzIGFuaW1hdGluZyBjb2xvcnM6XG4gKlxuICogYGBgXG4gKiB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICogdHdlZW5hYmxlLnR3ZWVuKHtcbiAqICAgZnJvbTogeyBjb2xvcjogJ3JnYigwLDI1NSwwKSd9LFxuICogICB0bzogeyBjb2xvcjogJ3JnYigyNTUsMCwyNTUpJ30sXG4gKiAgIHN0ZXA6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICogICAgIGNvbnNvbGUubG9nKHN0YXRlLmNvbG9yKTtcbiAqICAgfVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBUaGUgYWJvdmUgc25pcHBldCB3aWxsIGxvZyBzb21ldGhpbmcgbGlrZSB0aGlzOlxuICpcbiAqIGBgYFxuICogcmdiKDg0LDE3MCw4NClcbiAqIC4uLlxuICogcmdiKDE3MCw4NCwxNzApXG4gKiAuLi5cbiAqIHJnYigyNTUsMCwyNTUpXG4gKiBgYGBcbiAqXG4gKiBUaGlzIGV4dGVuc2lvbiBhbHNvIHN1cHBvcnRzIGhleGFkZWNpbWFsIGNvbG9ycywgaW4gYm90aCBsb25nIChgI2ZmMDBmZmApIGFuZCBzaG9ydCAoYCNmMGZgKSBmb3Jtcy4gIEJlIGF3YXJlIHRoYXQgaGV4YWRlY2ltYWwgaW5wdXQgdmFsdWVzIHdpbGwgYmUgY29udmVydGVkIGludG8gdGhlIGVxdWl2YWxlbnQgUkdCIG91dHB1dCB2YWx1ZXMuICBUaGlzIGlzIGRvbmUgdG8gb3B0aW1pemUgZm9yIHBlcmZvcm1hbmNlLlxuICpcbiAqIGBgYFxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XG4gKiAgIGZyb206IHsgY29sb3I6ICcjMGYwJ30sXG4gKiAgIHRvOiB7IGNvbG9yOiAnI2YwZid9LFxuICogICBzdGVwOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAqICAgICBjb25zb2xlLmxvZyhzdGF0ZS5jb2xvcik7XG4gKiAgIH1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogVGhpcyBzbmlwcGV0IHdpbGwgZ2VuZXJhdGUgdGhlIHNhbWUgb3V0cHV0IGFzIHRoZSBvbmUgYmVmb3JlIGl0IGJlY2F1c2UgZXF1aXZhbGVudCB2YWx1ZXMgd2VyZSBzdXBwbGllZCAoanVzdCBpbiBoZXhhZGVjaW1hbCBmb3JtIHJhdGhlciB0aGFuIFJHQik6XG4gKlxuICogYGBgXG4gKiByZ2IoODQsMTcwLDg0KVxuICogLi4uXG4gKiByZ2IoMTcwLDg0LDE3MClcbiAqIC4uLlxuICogcmdiKDI1NSwwLDI1NSlcbiAqIGBgYFxuICpcbiAqICMjIEVhc2luZyBzdXBwb3J0XG4gKlxuICogRWFzaW5nIHdvcmtzIHNvbWV3aGF0IGRpZmZlcmVudGx5IGluIHRoZSBUb2tlbiBleHRlbnNpb24uICBUaGlzIGlzIGJlY2F1c2Ugc29tZSBDU1MgcHJvcGVydGllcyBoYXZlIG11bHRpcGxlIHZhbHVlcyBpbiB0aGVtLCBhbmQgeW91IG1pZ2h0IG5lZWQgdG8gdHdlZW4gZWFjaCB2YWx1ZSBhbG9uZyBpdHMgb3duIGVhc2luZyBjdXJ2ZS4gIEEgYmFzaWMgZXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gKiB0d2VlbmFibGUudHdlZW4oe1xuICogICBmcm9tOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMHB4KSB0cmFuc2xhdGVZKDBweCknfSxcbiAqICAgdG86IHsgdHJhbnNmb3JtOiAgICd0cmFuc2xhdGVYKDEwMHB4KSB0cmFuc2xhdGVZKDEwMHB4KSd9LFxuICogICBlYXNpbmc6IHsgdHJhbnNmb3JtOiAnZWFzZUluUXVhZCcgfSxcbiAqICAgc3RlcDogZnVuY3Rpb24gKHN0YXRlKSB7XG4gKiAgICAgY29uc29sZS5sb2coc3RhdGUudHJhbnNmb3JtKTtcbiAqICAgfVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBUaGUgYWJvdmUgc25pcHBldCBjcmVhdGUgdmFsdWVzIGxpa2UgdGhpczpcbiAqXG4gKiBgYGBcbiAqIHRyYW5zbGF0ZVgoMTEuNTYwMDAwMDAwMDAwMDAycHgpIHRyYW5zbGF0ZVkoMTEuNTYwMDAwMDAwMDAwMDAycHgpXG4gKiAuLi5cbiAqIHRyYW5zbGF0ZVgoNDYuMjQwMDAwMDAwMDAwMDFweCkgdHJhbnNsYXRlWSg0Ni4yNDAwMDAwMDAwMDAwMXB4KVxuICogLi4uXG4gKiB0cmFuc2xhdGVYKDEwMHB4KSB0cmFuc2xhdGVZKDEwMHB4KVxuICogYGBgXG4gKlxuICogSW4gdGhpcyBjYXNlLCB0aGUgdmFsdWVzIGZvciBgdHJhbnNsYXRlWGAgYW5kIGB0cmFuc2xhdGVZYCBhcmUgYWx3YXlzIHRoZSBzYW1lIGZvciBlYWNoIHN0ZXAgb2YgdGhlIHR3ZWVuLCBiZWNhdXNlIHRoZXkgaGF2ZSB0aGUgc2FtZSBzdGFydCBhbmQgZW5kIHBvaW50cyBhbmQgYm90aCB1c2UgdGhlIHNhbWUgZWFzaW5nIGN1cnZlLiAgV2UgY2FuIGFsc28gdHdlZW4gYHRyYW5zbGF0ZVhgIGFuZCBgdHJhbnNsYXRlWWAgYWxvbmcgaW5kZXBlbmRlbnQgY3VydmVzOlxuICpcbiAqIGBgYFxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XG4gKiAgIGZyb206IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwcHgpIHRyYW5zbGF0ZVkoMHB4KSd9LFxuICogICB0bzogeyB0cmFuc2Zvcm06ICAgJ3RyYW5zbGF0ZVgoMTAwcHgpIHRyYW5zbGF0ZVkoMTAwcHgpJ30sXG4gKiAgIGVhc2luZzogeyB0cmFuc2Zvcm06ICdlYXNlSW5RdWFkIGJvdW5jZScgfSxcbiAqICAgc3RlcDogZnVuY3Rpb24gKHN0YXRlKSB7XG4gKiAgICAgY29uc29sZS5sb2coc3RhdGUudHJhbnNmb3JtKTtcbiAqICAgfVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBUaGUgYWJvdmUgc25pcHBldCBjcmVhdGUgdmFsdWVzIGxpa2UgdGhpczpcbiAqXG4gKiBgYGBcbiAqIHRyYW5zbGF0ZVgoMTAuODlweCkgdHJhbnNsYXRlWSg4Mi4zNTU2MjVweClcbiAqIC4uLlxuICogdHJhbnNsYXRlWCg0NC44OTAwMDAwMDAwMDAwMXB4KSB0cmFuc2xhdGVZKDg2LjczMDYyNTAwMDAwMDAycHgpXG4gKiAuLi5cbiAqIHRyYW5zbGF0ZVgoMTAwcHgpIHRyYW5zbGF0ZVkoMTAwcHgpXG4gKiBgYGBcbiAqXG4gKiBgdHJhbnNsYXRlWGAgYW5kIGB0cmFuc2xhdGVZYCBhcmUgbm90IGluIHN5bmMgYW55bW9yZSwgYmVjYXVzZSBgZWFzZUluUXVhZGAgd2FzIHNwZWNpZmllZCBmb3IgYHRyYW5zbGF0ZVhgIGFuZCBgYm91bmNlYCBmb3IgYHRyYW5zbGF0ZVlgLiAgTWl4aW5nIGFuZCBtYXRjaGluZyBlYXNpbmcgY3VydmVzIGNhbiBtYWtlIGZvciBzb21lIGludGVyZXN0aW5nIG1vdGlvbiBpbiB5b3VyIGFuaW1hdGlvbnMuXG4gKlxuICogVGhlIG9yZGVyIG9mIHRoZSBzcGFjZS1zZXBhcmF0ZWQgZWFzaW5nIGN1cnZlcyBjb3JyZXNwb25kIHRoZSB0b2tlbiB2YWx1ZXMgdGhleSBhcHBseSB0by4gIElmIHRoZXJlIGFyZSBtb3JlIHRva2VuIHZhbHVlcyB0aGFuIGVhc2luZyBjdXJ2ZXMgbGlzdGVkLCB0aGUgbGFzdCBlYXNpbmcgY3VydmUgbGlzdGVkIGlzIHVzZWQuXG4gKi9cbmZ1bmN0aW9uIHRva2VuICgpIHtcbiAgLy8gRnVuY3Rpb25hbGl0eSBmb3IgdGhpcyBleHRlbnNpb24gcnVucyBpbXBsaWNpdGx5IGlmIGl0IGlzIGxvYWRlZC5cbn0gLyohKi9cblxuLy8gdG9rZW4gZnVuY3Rpb24gaXMgZGVmaW5lZCBhYm92ZSBvbmx5IHNvIHRoYXQgZG94LWZvdW5kYXRpb24gc2VlcyBpdCBhc1xuLy8gZG9jdW1lbnRhdGlvbiBhbmQgcmVuZGVycyBpdC4gIEl0IGlzIG5ldmVyIHVzZWQsIGFuZCBpcyBvcHRpbWl6ZWQgYXdheSBhdFxuLy8gYnVpbGQgdGltZS5cblxuOyhmdW5jdGlvbiAoVHdlZW5hYmxlKSB7XG5cbiAgLyohXG4gICAqIEB0eXBlZGVmIHt7XG4gICAqICAgZm9ybWF0U3RyaW5nOiBzdHJpbmdcbiAgICogICBjaHVua05hbWVzOiBBcnJheS48c3RyaW5nPlxuICAgKiB9fVxuICAgKi9cbiAgdmFyIGZvcm1hdE1hbmlmZXN0O1xuXG4gIC8vIENPTlNUQU5UU1xuXG4gIHZhciBSX05VTUJFUl9DT01QT05FTlQgPSAvKFxcZHxcXC18XFwuKS87XG4gIHZhciBSX0ZPUk1BVF9DSFVOS1MgPSAvKFteXFwtMC05XFwuXSspL2c7XG4gIHZhciBSX1VORk9STUFUVEVEX1ZBTFVFUyA9IC9bMC05LlxcLV0rL2c7XG4gIHZhciBSX1JHQiA9IG5ldyBSZWdFeHAoXG4gICAgJ3JnYlxcXFwoJyArIFJfVU5GT1JNQVRURURfVkFMVUVTLnNvdXJjZSArXG4gICAgKC8sXFxzKi8uc291cmNlKSArIFJfVU5GT1JNQVRURURfVkFMVUVTLnNvdXJjZSArXG4gICAgKC8sXFxzKi8uc291cmNlKSArIFJfVU5GT1JNQVRURURfVkFMVUVTLnNvdXJjZSArICdcXFxcKScsICdnJyk7XG4gIHZhciBSX1JHQl9QUkVGSVggPSAvXi4qXFwoLztcbiAgdmFyIFJfSEVYID0gLyMoWzAtOV18W2EtZl0pezMsNn0vZ2k7XG4gIHZhciBWQUxVRV9QTEFDRUhPTERFUiA9ICdWQUwnO1xuXG4gIC8vIEhFTFBFUlNcblxuICB2YXIgZ2V0Rm9ybWF0Q2h1bmtzRnJvbV9hY2N1bXVsYXRvciA9IFtdO1xuICAvKiFcbiAgICogQHBhcmFtIHtBcnJheS5udW1iZXJ9IHJhd1ZhbHVlc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJlZml4XG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Rm9ybWF0Q2h1bmtzRnJvbSAocmF3VmFsdWVzLCBwcmVmaXgpIHtcbiAgICBnZXRGb3JtYXRDaHVua3NGcm9tX2FjY3VtdWxhdG9yLmxlbmd0aCA9IDA7XG5cbiAgICB2YXIgcmF3VmFsdWVzTGVuZ3RoID0gcmF3VmFsdWVzLmxlbmd0aDtcbiAgICB2YXIgaTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCByYXdWYWx1ZXNMZW5ndGg7IGkrKykge1xuICAgICAgZ2V0Rm9ybWF0Q2h1bmtzRnJvbV9hY2N1bXVsYXRvci5wdXNoKCdfJyArIHByZWZpeCArICdfJyArIGkpO1xuICAgIH1cblxuICAgIHJldHVybiBnZXRGb3JtYXRDaHVua3NGcm9tX2FjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXR0ZWRTdHJpbmdcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Rm9ybWF0U3RyaW5nRnJvbSAoZm9ybWF0dGVkU3RyaW5nKSB7XG4gICAgdmFyIGNodW5rcyA9IGZvcm1hdHRlZFN0cmluZy5tYXRjaChSX0ZPUk1BVF9DSFVOS1MpO1xuXG4gICAgaWYgKCFjaHVua3MpIHtcbiAgICAgIC8vIGNodW5rcyB3aWxsIGJlIG51bGwgaWYgdGhlcmUgd2VyZSBubyB0b2tlbnMgdG8gcGFyc2UgaW5cbiAgICAgIC8vIGZvcm1hdHRlZFN0cmluZyAoZm9yIGV4YW1wbGUsIGlmIGZvcm1hdHRlZFN0cmluZyBpcyAnMicpLiAgQ29lcmNlXG4gICAgICAvLyBjaHVua3MgdG8gYmUgdXNlZnVsIGhlcmUuXG4gICAgICBjaHVua3MgPSBbJycsICcnXTtcblxuICAgICAgLy8gSWYgdGhlcmUgaXMgb25seSBvbmUgY2h1bmssIGFzc3VtZSB0aGF0IHRoZSBzdHJpbmcgaXMgYSBudW1iZXJcbiAgICAgIC8vIGZvbGxvd2VkIGJ5IGEgdG9rZW4uLi5cbiAgICAgIC8vIE5PVEU6IFRoaXMgbWF5IGJlIGFuIHVud2lzZSBhc3N1bXB0aW9uLlxuICAgIH0gZWxzZSBpZiAoY2h1bmtzLmxlbmd0aCA9PT0gMSB8fFxuICAgICAgICAvLyAuLi5vciBpZiB0aGUgc3RyaW5nIHN0YXJ0cyB3aXRoIGEgbnVtYmVyIGNvbXBvbmVudCAoXCIuXCIsIFwiLVwiLCBvciBhXG4gICAgICAgIC8vIGRpZ2l0KS4uLlxuICAgICAgICBmb3JtYXR0ZWRTdHJpbmdbMF0ubWF0Y2goUl9OVU1CRVJfQ09NUE9ORU5UKSkge1xuICAgICAgLy8gLi4ucHJlcGVuZCBhbiBlbXB0eSBzdHJpbmcgaGVyZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgZm9ybWF0dGVkIG51bWJlclxuICAgICAgLy8gaXMgcHJvcGVybHkgcmVwbGFjZWQgYnkgVkFMVUVfUExBQ0VIT0xERVJcbiAgICAgIGNodW5rcy51bnNoaWZ0KCcnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2h1bmtzLmpvaW4oVkFMVUVfUExBQ0VIT0xERVIpO1xuICB9XG5cbiAgLyohXG4gICAqIENvbnZlcnQgYWxsIGhleCBjb2xvciB2YWx1ZXMgd2l0aGluIGEgc3RyaW5nIHRvIGFuIHJnYiBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdFxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBtb2RpZmllZCBvYmpcbiAgICovXG4gIGZ1bmN0aW9uIHNhbml0aXplT2JqZWN0Rm9ySGV4UHJvcHMgKHN0YXRlT2JqZWN0KSB7XG4gICAgVHdlZW5hYmxlLmVhY2goc3RhdGVPYmplY3QsIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICB2YXIgY3VycmVudFByb3AgPSBzdGF0ZU9iamVjdFtwcm9wXTtcblxuICAgICAgaWYgKHR5cGVvZiBjdXJyZW50UHJvcCA9PT0gJ3N0cmluZycgJiYgY3VycmVudFByb3AubWF0Y2goUl9IRVgpKSB7XG4gICAgICAgIHN0YXRlT2JqZWN0W3Byb3BdID0gc2FuaXRpemVIZXhDaHVua3NUb1JHQihjdXJyZW50UHJvcCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiAgc2FuaXRpemVIZXhDaHVua3NUb1JHQiAoc3RyKSB7XG4gICAgcmV0dXJuIGZpbHRlclN0cmluZ0NodW5rcyhSX0hFWCwgc3RyLCBjb252ZXJ0SGV4VG9SR0IpO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBoZXhTdHJpbmdcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gY29udmVydEhleFRvUkdCIChoZXhTdHJpbmcpIHtcbiAgICB2YXIgcmdiQXJyID0gaGV4VG9SR0JBcnJheShoZXhTdHJpbmcpO1xuICAgIHJldHVybiAncmdiKCcgKyByZ2JBcnJbMF0gKyAnLCcgKyByZ2JBcnJbMV0gKyAnLCcgKyByZ2JBcnJbMl0gKyAnKSc7XG4gIH1cblxuICB2YXIgaGV4VG9SR0JBcnJheV9yZXR1cm5BcnJheSA9IFtdO1xuICAvKiFcbiAgICogQ29udmVydCBhIGhleGFkZWNpbWFsIHN0cmluZyB0byBhbiBhcnJheSB3aXRoIHRocmVlIGl0ZW1zLCBvbmUgZWFjaCBmb3JcbiAgICogdGhlIHJlZCwgYmx1ZSwgYW5kIGdyZWVuIGRlY2ltYWwgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGV4IEEgaGV4YWRlY2ltYWwgc3RyaW5nLlxuICAgKlxuICAgKiBAcmV0dXJucyB7QXJyYXkuPG51bWJlcj59IFRoZSBjb252ZXJ0ZWQgQXJyYXkgb2YgUkdCIHZhbHVlcyBpZiBgaGV4YCBpcyBhXG4gICAqIHZhbGlkIHN0cmluZywgb3IgYW4gQXJyYXkgb2YgdGhyZWUgMCdzLlxuICAgKi9cbiAgZnVuY3Rpb24gaGV4VG9SR0JBcnJheSAoaGV4KSB7XG5cbiAgICBoZXggPSBoZXgucmVwbGFjZSgvIy8sICcnKTtcblxuICAgIC8vIElmIHRoZSBzdHJpbmcgaXMgYSBzaG9ydGhhbmQgdGhyZWUgZGlnaXQgaGV4IG5vdGF0aW9uLCBub3JtYWxpemUgaXQgdG9cbiAgICAvLyB0aGUgc3RhbmRhcmQgc2l4IGRpZ2l0IG5vdGF0aW9uXG4gICAgaWYgKGhleC5sZW5ndGggPT09IDMpIHtcbiAgICAgIGhleCA9IGhleC5zcGxpdCgnJyk7XG4gICAgICBoZXggPSBoZXhbMF0gKyBoZXhbMF0gKyBoZXhbMV0gKyBoZXhbMV0gKyBoZXhbMl0gKyBoZXhbMl07XG4gICAgfVxuXG4gICAgaGV4VG9SR0JBcnJheV9yZXR1cm5BcnJheVswXSA9IGhleFRvRGVjKGhleC5zdWJzdHIoMCwgMikpO1xuICAgIGhleFRvUkdCQXJyYXlfcmV0dXJuQXJyYXlbMV0gPSBoZXhUb0RlYyhoZXguc3Vic3RyKDIsIDIpKTtcbiAgICBoZXhUb1JHQkFycmF5X3JldHVybkFycmF5WzJdID0gaGV4VG9EZWMoaGV4LnN1YnN0cig0LCAyKSk7XG5cbiAgICByZXR1cm4gaGV4VG9SR0JBcnJheV9yZXR1cm5BcnJheTtcbiAgfVxuXG4gIC8qIVxuICAgKiBDb252ZXJ0IGEgYmFzZS0xNiBudW1iZXIgdG8gYmFzZS0xMC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBoZXggVGhlIHZhbHVlIHRvIGNvbnZlcnRcbiAgICpcbiAgICogQHJldHVybnMge051bWJlcn0gVGhlIGJhc2UtMTAgZXF1aXZhbGVudCBvZiBgaGV4YC5cbiAgICovXG4gIGZ1bmN0aW9uIGhleFRvRGVjIChoZXgpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoaGV4LCAxNik7XG4gIH1cblxuICAvKiFcbiAgICogUnVucyBhIGZpbHRlciBvcGVyYXRpb24gb24gYWxsIGNodW5rcyBvZiBhIHN0cmluZyB0aGF0IG1hdGNoIGEgUmVnRXhwXG4gICAqXG4gICAqIEBwYXJhbSB7UmVnRXhwfSBwYXR0ZXJuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1bmZpbHRlcmVkU3RyaW5nXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oc3RyaW5nKX0gZmlsdGVyXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGZpbHRlclN0cmluZ0NodW5rcyAocGF0dGVybiwgdW5maWx0ZXJlZFN0cmluZywgZmlsdGVyKSB7XG4gICAgdmFyIHBhdHRlbk1hdGNoZXMgPSB1bmZpbHRlcmVkU3RyaW5nLm1hdGNoKHBhdHRlcm4pO1xuICAgIHZhciBmaWx0ZXJlZFN0cmluZyA9IHVuZmlsdGVyZWRTdHJpbmcucmVwbGFjZShwYXR0ZXJuLCBWQUxVRV9QTEFDRUhPTERFUik7XG5cbiAgICBpZiAocGF0dGVuTWF0Y2hlcykge1xuICAgICAgdmFyIHBhdHRlbk1hdGNoZXNMZW5ndGggPSBwYXR0ZW5NYXRjaGVzLmxlbmd0aDtcbiAgICAgIHZhciBjdXJyZW50Q2h1bms7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0dGVuTWF0Y2hlc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgIGN1cnJlbnRDaHVuayA9IHBhdHRlbk1hdGNoZXMuc2hpZnQoKTtcbiAgICAgICAgZmlsdGVyZWRTdHJpbmcgPSBmaWx0ZXJlZFN0cmluZy5yZXBsYWNlKFxuICAgICAgICAgIFZBTFVFX1BMQUNFSE9MREVSLCBmaWx0ZXIoY3VycmVudENodW5rKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbHRlcmVkU3RyaW5nO1xuICB9XG5cbiAgLyohXG4gICAqIENoZWNrIGZvciBmbG9hdGluZyBwb2ludCB2YWx1ZXMgd2l0aGluIHJnYiBzdHJpbmdzIGFuZCByb3VuZHMgdGhlbS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdHRlZFN0cmluZ1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBzYW5pdGl6ZVJHQkNodW5rcyAoZm9ybWF0dGVkU3RyaW5nKSB7XG4gICAgcmV0dXJuIGZpbHRlclN0cmluZ0NodW5rcyhSX1JHQiwgZm9ybWF0dGVkU3RyaW5nLCBzYW5pdGl6ZVJHQkNodW5rKTtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmdiQ2h1bmtcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gc2FuaXRpemVSR0JDaHVuayAocmdiQ2h1bmspIHtcbiAgICB2YXIgbnVtYmVycyA9IHJnYkNodW5rLm1hdGNoKFJfVU5GT1JNQVRURURfVkFMVUVTKTtcbiAgICB2YXIgbnVtYmVyc0xlbmd0aCA9IG51bWJlcnMubGVuZ3RoO1xuICAgIHZhciBzYW5pdGl6ZWRTdHJpbmcgPSByZ2JDaHVuay5tYXRjaChSX1JHQl9QUkVGSVgpWzBdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1iZXJzTGVuZ3RoOyBpKyspIHtcbiAgICAgIHNhbml0aXplZFN0cmluZyArPSBwYXJzZUludChudW1iZXJzW2ldLCAxMCkgKyAnLCc7XG4gICAgfVxuXG4gICAgc2FuaXRpemVkU3RyaW5nID0gc2FuaXRpemVkU3RyaW5nLnNsaWNlKDAsIC0xKSArICcpJztcblxuICAgIHJldHVybiBzYW5pdGl6ZWRTdHJpbmc7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0XG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gQW4gT2JqZWN0IG9mIGZvcm1hdE1hbmlmZXN0cyB0aGF0IGNvcnJlc3BvbmQgdG9cbiAgICogdGhlIHN0cmluZyBwcm9wZXJ0aWVzIG9mIHN0YXRlT2JqZWN0XG4gICAqL1xuICBmdW5jdGlvbiBnZXRGb3JtYXRNYW5pZmVzdHMgKHN0YXRlT2JqZWN0KSB7XG4gICAgdmFyIG1hbmlmZXN0QWNjdW11bGF0b3IgPSB7fTtcblxuICAgIFR3ZWVuYWJsZS5lYWNoKHN0YXRlT2JqZWN0LCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gc3RhdGVPYmplY3RbcHJvcF07XG5cbiAgICAgIGlmICh0eXBlb2YgY3VycmVudFByb3AgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhciByYXdWYWx1ZXMgPSBnZXRWYWx1ZXNGcm9tKGN1cnJlbnRQcm9wKTtcblxuICAgICAgICBtYW5pZmVzdEFjY3VtdWxhdG9yW3Byb3BdID0ge1xuICAgICAgICAgICdmb3JtYXRTdHJpbmcnOiBnZXRGb3JtYXRTdHJpbmdGcm9tKGN1cnJlbnRQcm9wKVxuICAgICAgICAgICwnY2h1bmtOYW1lcyc6IGdldEZvcm1hdENodW5rc0Zyb20ocmF3VmFsdWVzLCBwcm9wKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1hbmlmZXN0QWNjdW11bGF0b3I7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmb3JtYXRNYW5pZmVzdHNcbiAgICovXG4gIGZ1bmN0aW9uIGV4cGFuZEZvcm1hdHRlZFByb3BlcnRpZXMgKHN0YXRlT2JqZWN0LCBmb3JtYXRNYW5pZmVzdHMpIHtcbiAgICBUd2VlbmFibGUuZWFjaChmb3JtYXRNYW5pZmVzdHMsIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICB2YXIgY3VycmVudFByb3AgPSBzdGF0ZU9iamVjdFtwcm9wXTtcbiAgICAgIHZhciByYXdWYWx1ZXMgPSBnZXRWYWx1ZXNGcm9tKGN1cnJlbnRQcm9wKTtcbiAgICAgIHZhciByYXdWYWx1ZXNMZW5ndGggPSByYXdWYWx1ZXMubGVuZ3RoO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhd1ZhbHVlc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN0YXRlT2JqZWN0W2Zvcm1hdE1hbmlmZXN0c1twcm9wXS5jaHVua05hbWVzW2ldXSA9ICtyYXdWYWx1ZXNbaV07XG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSBzdGF0ZU9iamVjdFtwcm9wXTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IGZvcm1hdE1hbmlmZXN0c1xuICAgKi9cbiAgZnVuY3Rpb24gY29sbGFwc2VGb3JtYXR0ZWRQcm9wZXJ0aWVzIChzdGF0ZU9iamVjdCwgZm9ybWF0TWFuaWZlc3RzKSB7XG4gICAgVHdlZW5hYmxlLmVhY2goZm9ybWF0TWFuaWZlc3RzLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gc3RhdGVPYmplY3RbcHJvcF07XG4gICAgICB2YXIgZm9ybWF0Q2h1bmtzID0gZXh0cmFjdFByb3BlcnR5Q2h1bmtzKFxuICAgICAgICBzdGF0ZU9iamVjdCwgZm9ybWF0TWFuaWZlc3RzW3Byb3BdLmNodW5rTmFtZXMpO1xuICAgICAgdmFyIHZhbHVlc0xpc3QgPSBnZXRWYWx1ZXNMaXN0KFxuICAgICAgICBmb3JtYXRDaHVua3MsIGZvcm1hdE1hbmlmZXN0c1twcm9wXS5jaHVua05hbWVzKTtcbiAgICAgIGN1cnJlbnRQcm9wID0gZ2V0Rm9ybWF0dGVkVmFsdWVzKFxuICAgICAgICBmb3JtYXRNYW5pZmVzdHNbcHJvcF0uZm9ybWF0U3RyaW5nLCB2YWx1ZXNMaXN0KTtcbiAgICAgIHN0YXRlT2JqZWN0W3Byb3BdID0gc2FuaXRpemVSR0JDaHVua3MoY3VycmVudFByb3ApO1xuICAgIH0pO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdFxuICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBjaHVua05hbWVzXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGV4dHJhY3RlZCB2YWx1ZSBjaHVua3MuXG4gICAqL1xuICBmdW5jdGlvbiBleHRyYWN0UHJvcGVydHlDaHVua3MgKHN0YXRlT2JqZWN0LCBjaHVua05hbWVzKSB7XG4gICAgdmFyIGV4dHJhY3RlZFZhbHVlcyA9IHt9O1xuICAgIHZhciBjdXJyZW50Q2h1bmtOYW1lLCBjaHVua05hbWVzTGVuZ3RoID0gY2h1bmtOYW1lcy5sZW5ndGg7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rTmFtZXNMZW5ndGg7IGkrKykge1xuICAgICAgY3VycmVudENodW5rTmFtZSA9IGNodW5rTmFtZXNbaV07XG4gICAgICBleHRyYWN0ZWRWYWx1ZXNbY3VycmVudENodW5rTmFtZV0gPSBzdGF0ZU9iamVjdFtjdXJyZW50Q2h1bmtOYW1lXTtcbiAgICAgIGRlbGV0ZSBzdGF0ZU9iamVjdFtjdXJyZW50Q2h1bmtOYW1lXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXh0cmFjdGVkVmFsdWVzO1xuICB9XG5cbiAgdmFyIGdldFZhbHVlc0xpc3RfYWNjdW11bGF0b3IgPSBbXTtcbiAgLyohXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdFxuICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBjaHVua05hbWVzXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5LjxudW1iZXI+fVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0VmFsdWVzTGlzdCAoc3RhdGVPYmplY3QsIGNodW5rTmFtZXMpIHtcbiAgICBnZXRWYWx1ZXNMaXN0X2FjY3VtdWxhdG9yLmxlbmd0aCA9IDA7XG4gICAgdmFyIGNodW5rTmFtZXNMZW5ndGggPSBjaHVua05hbWVzLmxlbmd0aDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2h1bmtOYW1lc0xlbmd0aDsgaSsrKSB7XG4gICAgICBnZXRWYWx1ZXNMaXN0X2FjY3VtdWxhdG9yLnB1c2goc3RhdGVPYmplY3RbY2h1bmtOYW1lc1tpXV0pO1xuICAgIH1cblxuICAgIHJldHVybiBnZXRWYWx1ZXNMaXN0X2FjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXRTdHJpbmdcbiAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gcmF3VmFsdWVzXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGdldEZvcm1hdHRlZFZhbHVlcyAoZm9ybWF0U3RyaW5nLCByYXdWYWx1ZXMpIHtcbiAgICB2YXIgZm9ybWF0dGVkVmFsdWVTdHJpbmcgPSBmb3JtYXRTdHJpbmc7XG4gICAgdmFyIHJhd1ZhbHVlc0xlbmd0aCA9IHJhd1ZhbHVlcy5sZW5ndGg7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhd1ZhbHVlc0xlbmd0aDsgaSsrKSB7XG4gICAgICBmb3JtYXR0ZWRWYWx1ZVN0cmluZyA9IGZvcm1hdHRlZFZhbHVlU3RyaW5nLnJlcGxhY2UoXG4gICAgICAgIFZBTFVFX1BMQUNFSE9MREVSLCArcmF3VmFsdWVzW2ldLnRvRml4ZWQoNCkpO1xuICAgIH1cblxuICAgIHJldHVybiBmb3JtYXR0ZWRWYWx1ZVN0cmluZztcbiAgfVxuXG4gIC8qIVxuICAgKiBOb3RlOiBJdCdzIHRoZSBkdXR5IG9mIHRoZSBjYWxsZXIgdG8gY29udmVydCB0aGUgQXJyYXkgZWxlbWVudHMgb2YgdGhlXG4gICAqIHJldHVybiB2YWx1ZSBpbnRvIG51bWJlcnMuICBUaGlzIGlzIGEgcGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZm9ybWF0dGVkU3RyaW5nXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fG51bGx9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRWYWx1ZXNGcm9tIChmb3JtYXR0ZWRTdHJpbmcpIHtcbiAgICByZXR1cm4gZm9ybWF0dGVkU3RyaW5nLm1hdGNoKFJfVU5GT1JNQVRURURfVkFMVUVTKTtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0b2tlbkRhdGFcbiAgICovXG4gIGZ1bmN0aW9uIGV4cGFuZEVhc2luZ09iamVjdCAoZWFzaW5nT2JqZWN0LCB0b2tlbkRhdGEpIHtcbiAgICBUd2VlbmFibGUuZWFjaCh0b2tlbkRhdGEsIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICB2YXIgY3VycmVudFByb3AgPSB0b2tlbkRhdGFbcHJvcF07XG4gICAgICB2YXIgY2h1bmtOYW1lcyA9IGN1cnJlbnRQcm9wLmNodW5rTmFtZXM7XG4gICAgICB2YXIgY2h1bmtMZW5ndGggPSBjaHVua05hbWVzLmxlbmd0aDtcbiAgICAgIHZhciBlYXNpbmdDaHVua3MgPSBlYXNpbmdPYmplY3RbcHJvcF0uc3BsaXQoJyAnKTtcbiAgICAgIHZhciBsYXN0RWFzaW5nQ2h1bmsgPSBlYXNpbmdDaHVua3NbZWFzaW5nQ2h1bmtzLmxlbmd0aCAtIDFdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWFzaW5nT2JqZWN0W2NodW5rTmFtZXNbaV1dID0gZWFzaW5nQ2h1bmtzW2ldIHx8IGxhc3RFYXNpbmdDaHVuaztcbiAgICAgIH1cblxuICAgICAgZGVsZXRlIGVhc2luZ09iamVjdFtwcm9wXTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0b2tlbkRhdGFcbiAgICovXG4gIGZ1bmN0aW9uIGNvbGxhcHNlRWFzaW5nT2JqZWN0IChlYXNpbmdPYmplY3QsIHRva2VuRGF0YSkge1xuICAgIFR3ZWVuYWJsZS5lYWNoKHRva2VuRGF0YSwgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIHZhciBjdXJyZW50UHJvcCA9IHRva2VuRGF0YVtwcm9wXTtcbiAgICAgIHZhciBjaHVua05hbWVzID0gY3VycmVudFByb3AuY2h1bmtOYW1lcztcbiAgICAgIHZhciBjaHVua0xlbmd0aCA9IGNodW5rTmFtZXMubGVuZ3RoO1xuICAgICAgdmFyIGNvbXBvc2VkRWFzaW5nU3RyaW5nID0gJyc7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2h1bmtMZW5ndGg7IGkrKykge1xuICAgICAgICBjb21wb3NlZEVhc2luZ1N0cmluZyArPSAnICcgKyBlYXNpbmdPYmplY3RbY2h1bmtOYW1lc1tpXV07XG4gICAgICAgIGRlbGV0ZSBlYXNpbmdPYmplY3RbY2h1bmtOYW1lc1tpXV07XG4gICAgICB9XG5cbiAgICAgIGVhc2luZ09iamVjdFtwcm9wXSA9IGNvbXBvc2VkRWFzaW5nU3RyaW5nLnN1YnN0cigxKTtcbiAgICB9KTtcbiAgfVxuXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuZmlsdGVyLnRva2VuID0ge1xuICAgICd0d2VlbkNyZWF0ZWQnOiBmdW5jdGlvbiAoY3VycmVudFN0YXRlLCBmcm9tU3RhdGUsIHRvU3RhdGUsIGVhc2luZ09iamVjdCkge1xuICAgICAgc2FuaXRpemVPYmplY3RGb3JIZXhQcm9wcyhjdXJyZW50U3RhdGUpO1xuICAgICAgc2FuaXRpemVPYmplY3RGb3JIZXhQcm9wcyhmcm9tU3RhdGUpO1xuICAgICAgc2FuaXRpemVPYmplY3RGb3JIZXhQcm9wcyh0b1N0YXRlKTtcbiAgICAgIHRoaXMuX3Rva2VuRGF0YSA9IGdldEZvcm1hdE1hbmlmZXN0cyhjdXJyZW50U3RhdGUpO1xuICAgIH0sXG5cbiAgICAnYmVmb3JlVHdlZW4nOiBmdW5jdGlvbiAoY3VycmVudFN0YXRlLCBmcm9tU3RhdGUsIHRvU3RhdGUsIGVhc2luZ09iamVjdCkge1xuICAgICAgZXhwYW5kRWFzaW5nT2JqZWN0KGVhc2luZ09iamVjdCwgdGhpcy5fdG9rZW5EYXRhKTtcbiAgICAgIGV4cGFuZEZvcm1hdHRlZFByb3BlcnRpZXMoY3VycmVudFN0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xuICAgICAgZXhwYW5kRm9ybWF0dGVkUHJvcGVydGllcyhmcm9tU3RhdGUsIHRoaXMuX3Rva2VuRGF0YSk7XG4gICAgICBleHBhbmRGb3JtYXR0ZWRQcm9wZXJ0aWVzKHRvU3RhdGUsIHRoaXMuX3Rva2VuRGF0YSk7XG4gICAgfSxcblxuICAgICdhZnRlclR3ZWVuJzogZnVuY3Rpb24gKGN1cnJlbnRTdGF0ZSwgZnJvbVN0YXRlLCB0b1N0YXRlLCBlYXNpbmdPYmplY3QpIHtcbiAgICAgIGNvbGxhcHNlRm9ybWF0dGVkUHJvcGVydGllcyhjdXJyZW50U3RhdGUsIHRoaXMuX3Rva2VuRGF0YSk7XG4gICAgICBjb2xsYXBzZUZvcm1hdHRlZFByb3BlcnRpZXMoZnJvbVN0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xuICAgICAgY29sbGFwc2VGb3JtYXR0ZWRQcm9wZXJ0aWVzKHRvU3RhdGUsIHRoaXMuX3Rva2VuRGF0YSk7XG4gICAgICBjb2xsYXBzZUVhc2luZ09iamVjdChlYXNpbmdPYmplY3QsIHRoaXMuX3Rva2VuRGF0YSk7XG4gICAgfVxuICB9O1xuXG59IChUd2VlbmFibGUpKTtcblxufSh0aGlzKSk7XG4iLCIvLyBDaXJjbGUgc2hhcGVkIHByb2dyZXNzIGJhclxuXG52YXIgU2hhcGUgPSByZXF1aXJlKCcuL3NoYXBlJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cblxudmFyIENpcmNsZSA9IGZ1bmN0aW9uIENpcmNsZShjb250YWluZXIsIG9wdGlvbnMpIHtcbiAgICAvLyBVc2UgdHdvIGFyY3MgdG8gZm9ybSBhIGNpcmNsZVxuICAgIC8vIFNlZSB0aGlzIGFuc3dlciBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMDQ3NzMzNC8xNDQ2MDkyXG4gICAgdGhpcy5fcGF0aFRlbXBsYXRlID1cbiAgICAgICAgJ00gNTAsNTAgbSAwLC17cmFkaXVzfScgK1xuICAgICAgICAnIGEge3JhZGl1c30se3JhZGl1c30gMCAxIDEgMCx7MnJhZGl1c30nICtcbiAgICAgICAgJyBhIHtyYWRpdXN9LHtyYWRpdXN9IDAgMSAxIDAsLXsycmFkaXVzfSc7XG5cbiAgICBTaGFwZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuQ2lyY2xlLnByb3RvdHlwZSA9IG5ldyBTaGFwZSgpO1xuQ2lyY2xlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENpcmNsZTtcblxuQ2lyY2xlLnByb3RvdHlwZS5fcGF0aFN0cmluZyA9IGZ1bmN0aW9uIF9wYXRoU3RyaW5nKG9wdHMpIHtcbiAgICB2YXIgd2lkdGhPZldpZGVyID0gb3B0cy5zdHJva2VXaWR0aDtcbiAgICBpZiAob3B0cy50cmFpbFdpZHRoICYmIG9wdHMudHJhaWxXaWR0aCA+IG9wdHMuc3Ryb2tlV2lkdGgpIHtcbiAgICAgICAgd2lkdGhPZldpZGVyID0gb3B0cy50cmFpbFdpZHRoO1xuICAgIH1cblxuICAgIHZhciByID0gNTAgLSB3aWR0aE9mV2lkZXIgLyAyO1xuXG4gICAgcmV0dXJuIHV0aWxzLnJlbmRlcih0aGlzLl9wYXRoVGVtcGxhdGUsIHtcbiAgICAgICAgcmFkaXVzOiByLFxuICAgICAgICAnMnJhZGl1cyc6IHIgKiAyXG4gICAgfSk7XG59O1xuXG5DaXJjbGUucHJvdG90eXBlLl90cmFpbFN0cmluZyA9IGZ1bmN0aW9uIF90cmFpbFN0cmluZyhvcHRzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhdGhTdHJpbmcob3B0cyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENpcmNsZTtcbiIsIi8vIExpbmUgc2hhcGVkIHByb2dyZXNzIGJhclxuXG52YXIgU2hhcGUgPSByZXF1aXJlKCcuL3NoYXBlJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cblxudmFyIExpbmUgPSBmdW5jdGlvbiBMaW5lKGNvbnRhaW5lciwgb3B0aW9ucykge1xuICAgIHRoaXMuX3BhdGhUZW1wbGF0ZSA9ICdNIDAse2NlbnRlcn0gTCAxMDAse2NlbnRlcn0nO1xuICAgIFNoYXBlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG5MaW5lLnByb3RvdHlwZSA9IG5ldyBTaGFwZSgpO1xuTGluZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMaW5lO1xuXG5MaW5lLnByb3RvdHlwZS5faW5pdGlhbGl6ZVN2ZyA9IGZ1bmN0aW9uIF9pbml0aWFsaXplU3ZnKHN2Zywgb3B0cykge1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDEwMCAnICsgb3B0cy5zdHJva2VXaWR0aCk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgncHJlc2VydmVBc3BlY3RSYXRpbycsICdub25lJyk7XG59O1xuXG5MaW5lLnByb3RvdHlwZS5fcGF0aFN0cmluZyA9IGZ1bmN0aW9uIF9wYXRoU3RyaW5nKG9wdHMpIHtcbiAgICByZXR1cm4gdXRpbHMucmVuZGVyKHRoaXMuX3BhdGhUZW1wbGF0ZSwge1xuICAgICAgICBjZW50ZXI6IG9wdHMuc3Ryb2tlV2lkdGggLyAyXG4gICAgfSk7XG59O1xuXG5MaW5lLnByb3RvdHlwZS5fdHJhaWxTdHJpbmcgPSBmdW5jdGlvbiBfdHJhaWxTdHJpbmcob3B0cykge1xuICAgIHJldHVybiB0aGlzLl9wYXRoU3RyaW5nKG9wdHMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaW5lO1xuIiwiLy8gRGlmZmVyZW50IHNoYXBlZCBwcm9ncmVzcyBiYXJzXG52YXIgTGluZSA9IHJlcXVpcmUoJy4vbGluZScpO1xudmFyIENpcmNsZSA9IHJlcXVpcmUoJy4vY2lyY2xlJyk7XG52YXIgU3F1YXJlID0gcmVxdWlyZSgnLi9zcXVhcmUnKTtcblxuLy8gTG93ZXIgbGV2ZWwgQVBJIHRvIHVzZSBhbnkgU1ZHIHBhdGhcbnZhciBQYXRoID0gcmVxdWlyZSgnLi9wYXRoJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgTGluZTogTGluZSxcbiAgICBDaXJjbGU6IENpcmNsZSxcbiAgICBTcXVhcmU6IFNxdWFyZSxcbiAgICBQYXRoOiBQYXRoXG59O1xuIiwiLy8gTG93ZXIgbGV2ZWwgQVBJIHRvIGFuaW1hdGUgYW55IGtpbmQgb2Ygc3ZnIHBhdGhcblxudmFyIFR3ZWVuYWJsZSA9IHJlcXVpcmUoJ3NoaWZ0eScpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgRUFTSU5HX0FMSUFTRVMgPSB7XG4gICAgZWFzZUluOiAnZWFzZUluQ3ViaWMnLFxuICAgIGVhc2VPdXQ6ICdlYXNlT3V0Q3ViaWMnLFxuICAgIGVhc2VJbk91dDogJ2Vhc2VJbk91dEN1YmljJ1xufTtcblxuXG52YXIgUGF0aCA9IGZ1bmN0aW9uIFBhdGgocGF0aCwgb3B0cykge1xuICAgIC8vIERlZmF1bHQgcGFyYW1ldGVycyBmb3IgYW5pbWF0aW9uXG4gICAgb3B0cyA9IHV0aWxzLmV4dGVuZCh7XG4gICAgICAgIGR1cmF0aW9uOiA4MDAsXG4gICAgICAgIGVhc2luZzogJ2xpbmVhcicsXG4gICAgICAgIGZyb206IHt9LFxuICAgICAgICB0bzoge30sXG4gICAgICAgIHN0ZXA6IGZ1bmN0aW9uKCkge31cbiAgICB9LCBvcHRzKTtcblxuICAgIHZhciBlbGVtZW50O1xuICAgIGlmICh1dGlscy5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50ID0gcGF0aDtcbiAgICB9XG5cbiAgICAvLyBSZXZlYWwgLnBhdGggYXMgcHVibGljIGF0dHJpYnV0ZVxuICAgIHRoaXMucGF0aCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5fb3B0cyA9IG9wdHM7XG4gICAgdGhpcy5fdHdlZW5hYmxlID0gbnVsbDtcblxuICAgIC8vIFNldCB1cCB0aGUgc3RhcnRpbmcgcG9zaXRpb25zXG4gICAgdmFyIGxlbmd0aCA9IHRoaXMucGF0aC5nZXRUb3RhbExlbmd0aCgpO1xuICAgIHRoaXMucGF0aC5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSBsZW5ndGggKyAnICcgKyBsZW5ndGg7XG4gICAgdGhpcy5zZXQoMCk7XG59O1xuXG5QYXRoLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uIHZhbHVlKCkge1xuICAgIHZhciBvZmZzZXQgPSB0aGlzLl9nZXRDb21wdXRlZERhc2hPZmZzZXQoKTtcbiAgICB2YXIgbGVuZ3RoID0gdGhpcy5wYXRoLmdldFRvdGFsTGVuZ3RoKCk7XG5cbiAgICB2YXIgcHJvZ3Jlc3MgPSAxIC0gb2Zmc2V0IC8gbGVuZ3RoO1xuICAgIC8vIFJvdW5kIG51bWJlciB0byBwcmV2ZW50IHJldHVybmluZyB2ZXJ5IHNtYWxsIG51bWJlciBsaWtlIDFlLTMwLCB3aGljaFxuICAgIC8vIGlzIHByYWN0aWNhbGx5IDBcbiAgICByZXR1cm4gcGFyc2VGbG9hdChwcm9ncmVzcy50b0ZpeGVkKDYpLCAxMCk7XG59O1xuXG5QYXRoLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQocHJvZ3Jlc3MpIHtcbiAgICB0aGlzLnN0b3AoKTtcblxuICAgIHRoaXMucGF0aC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gdGhpcy5fcHJvZ3Jlc3NUb09mZnNldChwcm9ncmVzcyk7XG5cbiAgICB2YXIgc3RlcCA9IHRoaXMuX29wdHMuc3RlcDtcbiAgICBpZiAodXRpbHMuaXNGdW5jdGlvbihzdGVwKSkge1xuICAgICAgICB2YXIgZWFzaW5nID0gdGhpcy5fZWFzaW5nKHRoaXMuX29wdHMuZWFzaW5nKTtcbiAgICAgICAgdmFyIHZhbHVlcyA9IHRoaXMuX2NhbGN1bGF0ZVRvKHByb2dyZXNzLCBlYXNpbmcpO1xuICAgICAgICBzdGVwKHZhbHVlcywgdGhpcy5fb3B0cy5zaGFwZXx8dGhpcywgdGhpcy5fb3B0cy5hdHRhY2htZW50KTtcbiAgICB9XG59O1xuXG5QYXRoLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gc3RvcCgpIHtcbiAgICB0aGlzLl9zdG9wVHdlZW4oKTtcbiAgICB0aGlzLnBhdGguc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IHRoaXMuX2dldENvbXB1dGVkRGFzaE9mZnNldCgpO1xufTtcblxuLy8gTWV0aG9kIGludHJvZHVjZWQgaGVyZTpcbi8vIGh0dHA6Ly9qYWtlYXJjaGliYWxkLmNvbS8yMDEzL2FuaW1hdGVkLWxpbmUtZHJhd2luZy1zdmcvXG5QYXRoLnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24gYW5pbWF0ZShwcm9ncmVzcywgb3B0cywgY2IpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcblxuICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKG9wdHMpKSB7XG4gICAgICAgIGNiID0gb3B0cztcbiAgICAgICAgb3B0cyA9IHt9O1xuICAgIH1cblxuICAgIHZhciBwYXNzZWRPcHRzID0gdXRpbHMuZXh0ZW5kKHt9LCBvcHRzKTtcblxuICAgIC8vIENvcHkgZGVmYXVsdCBvcHRzIHRvIG5ldyBvYmplY3Qgc28gZGVmYXVsdHMgYXJlIG5vdCBtb2RpZmllZFxuICAgIHZhciBkZWZhdWx0T3B0cyA9IHV0aWxzLmV4dGVuZCh7fSwgdGhpcy5fb3B0cyk7XG4gICAgb3B0cyA9IHV0aWxzLmV4dGVuZChkZWZhdWx0T3B0cywgb3B0cyk7XG5cbiAgICB2YXIgc2hpZnR5RWFzaW5nID0gdGhpcy5fZWFzaW5nKG9wdHMuZWFzaW5nKTtcbiAgICB2YXIgdmFsdWVzID0gdGhpcy5fcmVzb2x2ZUZyb21BbmRUbyhwcm9ncmVzcywgc2hpZnR5RWFzaW5nLCBwYXNzZWRPcHRzKTtcblxuICAgIHRoaXMuc3RvcCgpO1xuXG4gICAgLy8gVHJpZ2dlciBhIGxheW91dCBzbyBzdHlsZXMgYXJlIGNhbGN1bGF0ZWQgJiB0aGUgYnJvd3NlclxuICAgIC8vIHBpY2tzIHVwIHRoZSBzdGFydGluZyBwb3NpdGlvbiBiZWZvcmUgYW5pbWF0aW5nXG4gICAgdGhpcy5wYXRoLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgdmFyIG9mZnNldCA9IHRoaXMuX2dldENvbXB1dGVkRGFzaE9mZnNldCgpO1xuICAgIHZhciBuZXdPZmZzZXQgPSB0aGlzLl9wcm9ncmVzc1RvT2Zmc2V0KHByb2dyZXNzKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLl90d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gICAgdGhpcy5fdHdlZW5hYmxlLnR3ZWVuKHtcbiAgICAgICAgZnJvbTogdXRpbHMuZXh0ZW5kKHsgb2Zmc2V0OiBvZmZzZXQgfSwgdmFsdWVzLmZyb20pLFxuICAgICAgICB0bzogdXRpbHMuZXh0ZW5kKHsgb2Zmc2V0OiBuZXdPZmZzZXQgfSwgdmFsdWVzLnRvKSxcbiAgICAgICAgZHVyYXRpb246IG9wdHMuZHVyYXRpb24sXG4gICAgICAgIGVhc2luZzogc2hpZnR5RWFzaW5nLFxuICAgICAgICBzdGVwOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgICAgICAgc2VsZi5wYXRoLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBzdGF0ZS5vZmZzZXQ7XG4gICAgICAgICAgICBvcHRzLnN0ZXAoc3RhdGUsIG9wdHMuc2hhcGV8fHNlbGYsIG9wdHMuYXR0YWNobWVudCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZpbmlzaDogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKGNiKSkge1xuICAgICAgICAgICAgICAgIGNiKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cblBhdGgucHJvdG90eXBlLl9nZXRDb21wdXRlZERhc2hPZmZzZXQgPSBmdW5jdGlvbiBfZ2V0Q29tcHV0ZWREYXNoT2Zmc2V0KCkge1xuICAgIHZhciBjb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5wYXRoLCBudWxsKTtcbiAgICByZXR1cm4gcGFyc2VGbG9hdChjb21wdXRlZFN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3N0cm9rZS1kYXNob2Zmc2V0JyksIDEwKTtcbn07XG5cblBhdGgucHJvdG90eXBlLl9wcm9ncmVzc1RvT2Zmc2V0ID0gZnVuY3Rpb24gX3Byb2dyZXNzVG9PZmZzZXQocHJvZ3Jlc3MpIHtcbiAgICB2YXIgbGVuZ3RoID0gdGhpcy5wYXRoLmdldFRvdGFsTGVuZ3RoKCk7XG4gICAgcmV0dXJuIGxlbmd0aCAtIHByb2dyZXNzICogbGVuZ3RoO1xufTtcblxuLy8gUmVzb2x2ZXMgZnJvbSBhbmQgdG8gdmFsdWVzIGZvciBhbmltYXRpb24uXG5QYXRoLnByb3RvdHlwZS5fcmVzb2x2ZUZyb21BbmRUbyA9IGZ1bmN0aW9uIF9yZXNvbHZlRnJvbUFuZFRvKHByb2dyZXNzLCBlYXNpbmcsIG9wdHMpIHtcbiAgICBpZiAob3B0cy5mcm9tICYmIG9wdHMudG8pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZyb206IG9wdHMuZnJvbSxcbiAgICAgICAgICAgIHRvOiBvcHRzLnRvXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZnJvbTogdGhpcy5fY2FsY3VsYXRlRnJvbShlYXNpbmcpLFxuICAgICAgICB0bzogdGhpcy5fY2FsY3VsYXRlVG8ocHJvZ3Jlc3MsIGVhc2luZylcbiAgICB9O1xufTtcblxuLy8gQ2FsY3VsYXRlIGBmcm9tYCB2YWx1ZXMgZnJvbSBvcHRpb25zIHBhc3NlZCBhdCBpbml0aWFsaXphdGlvblxuUGF0aC5wcm90b3R5cGUuX2NhbGN1bGF0ZUZyb20gPSBmdW5jdGlvbiBfY2FsY3VsYXRlRnJvbShlYXNpbmcpIHtcbiAgICByZXR1cm4gVHdlZW5hYmxlLmludGVycG9sYXRlKHRoaXMuX29wdHMuZnJvbSwgdGhpcy5fb3B0cy50bywgdGhpcy52YWx1ZSgpLCBlYXNpbmcpO1xufTtcblxuLy8gQ2FsY3VsYXRlIGB0b2AgdmFsdWVzIGZyb20gb3B0aW9ucyBwYXNzZWQgYXQgaW5pdGlhbGl6YXRpb25cblBhdGgucHJvdG90eXBlLl9jYWxjdWxhdGVUbyA9IGZ1bmN0aW9uIF9jYWxjdWxhdGVUbyhwcm9ncmVzcywgZWFzaW5nKSB7XG4gICAgcmV0dXJuIFR3ZWVuYWJsZS5pbnRlcnBvbGF0ZSh0aGlzLl9vcHRzLmZyb20sIHRoaXMuX29wdHMudG8sIHByb2dyZXNzLCBlYXNpbmcpO1xufTtcblxuUGF0aC5wcm90b3R5cGUuX3N0b3BUd2VlbiA9IGZ1bmN0aW9uIF9zdG9wVHdlZW4oKSB7XG4gICAgaWYgKHRoaXMuX3R3ZWVuYWJsZSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl90d2VlbmFibGUuc3RvcCgpO1xuICAgICAgICB0aGlzLl90d2VlbmFibGUuZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLl90d2VlbmFibGUgPSBudWxsO1xuICAgIH1cbn07XG5cblBhdGgucHJvdG90eXBlLl9lYXNpbmcgPSBmdW5jdGlvbiBfZWFzaW5nKGVhc2luZykge1xuICAgIGlmIChFQVNJTkdfQUxJQVNFUy5oYXNPd25Qcm9wZXJ0eShlYXNpbmcpKSB7XG4gICAgICAgIHJldHVybiBFQVNJTkdfQUxJQVNFU1tlYXNpbmddO1xuICAgIH1cblxuICAgIHJldHVybiBlYXNpbmc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhdGg7XG4iLCIvLyBCYXNlIG9iamVjdCBmb3IgZGlmZmVyZW50IHByb2dyZXNzIGJhciBzaGFwZXNcblxudmFyIFBhdGggPSByZXF1aXJlKCcuL3BhdGgnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIERFU1RST1lFRF9FUlJPUiA9ICdPYmplY3QgaXMgZGVzdHJveWVkJztcblxuXG52YXIgU2hhcGUgPSBmdW5jdGlvbiBTaGFwZShjb250YWluZXIsIG9wdHMpIHtcbiAgICAvLyBUaHJvdyBhIGJldHRlciBlcnJvciBpZiBwcm9ncmVzcyBiYXJzIGFyZSBub3QgaW5pdGlhbGl6ZWQgd2l0aCBgbmV3YFxuICAgIC8vIGtleXdvcmRcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU2hhcGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ29uc3RydWN0b3Igd2FzIGNhbGxlZCB3aXRob3V0IG5ldyBrZXl3b3JkJyk7XG4gICAgfVxuXG4gICAgLy8gUHJldmVudCBjYWxsaW5nIGNvbnN0cnVjdG9yIHdpdGhvdXQgcGFyYW1ldGVycyBzbyBpbmhlcml0YW5jZVxuICAgIC8vIHdvcmtzIGNvcnJlY3RseS4gVG8gdW5kZXJzdGFuZCwgdGhpcyBpcyBob3cgU2hhcGUgaXMgaW5oZXJpdGVkOlxuICAgIC8vXG4gICAgLy8gICBMaW5lLnByb3RvdHlwZSA9IG5ldyBTaGFwZSgpO1xuICAgIC8vXG4gICAgLy8gV2UganVzdCB3YW50IHRvIHNldCB0aGUgcHJvdG90eXBlIGZvciBMaW5lLlxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAvLyBEZWZhdWx0IHBhcmFtZXRlcnMgZm9yIHByb2dyZXNzIGJhciBjcmVhdGlvblxuICAgIHRoaXMuX29wdHMgPSB1dGlscy5leHRlbmQoe1xuICAgICAgICBjb2xvcjogJyM1NTUnLFxuICAgICAgICBzdHJva2VXaWR0aDogMS4wLFxuICAgICAgICB0cmFpbENvbG9yOiBudWxsLFxuICAgICAgICB0cmFpbFdpZHRoOiBudWxsLFxuICAgICAgICBmaWxsOiBudWxsLFxuICAgICAgICB0ZXh0OiB7XG4gICAgICAgICAgICBhdXRvU3R5bGU6IHRydWUsXG4gICAgICAgICAgICBjb2xvcjogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3Byb2dyZXNzYmFyLXRleHQnXG4gICAgICAgIH1cbiAgICB9LCBvcHRzLCB0cnVlKTsgIC8vIFVzZSByZWN1cnNpdmUgZXh0ZW5kXG5cbiAgICB2YXIgc3ZnVmlldyA9IHRoaXMuX2NyZWF0ZVN2Z1ZpZXcodGhpcy5fb3B0cyk7XG5cbiAgICB2YXIgZWxlbWVudDtcbiAgICBpZiAodXRpbHMuaXNTdHJpbmcoY29udGFpbmVyKSkge1xuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQgPSBjb250YWluZXI7XG4gICAgfVxuXG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ29udGFpbmVyIGRvZXMgbm90IGV4aXN0OiAnICsgY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jb250YWluZXIgPSBlbGVtZW50O1xuICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZChzdmdWaWV3LnN2Zyk7XG5cbiAgICB0aGlzLnRleHQgPSBudWxsO1xuICAgIGlmICh0aGlzLl9vcHRzLnRleHQudmFsdWUpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy5fY3JlYXRlVGV4dEVsZW1lbnQodGhpcy5fb3B0cywgdGhpcy5fY29udGFpbmVyKTtcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMudGV4dCk7XG4gICAgfVxuXG4gICAgLy8gRXhwb3NlIHB1YmxpYyBhdHRyaWJ1dGVzIGJlZm9yZSBQYXRoIGluaXRpYWxpemF0aW9uXG4gICAgdGhpcy5zdmcgPSBzdmdWaWV3LnN2ZztcbiAgICB0aGlzLnBhdGggPSBzdmdWaWV3LnBhdGg7XG4gICAgdGhpcy50cmFpbCA9IHN2Z1ZpZXcudHJhaWw7XG4gICAgLy8gdGhpcy50ZXh0IGlzIGFsc28gYSBwdWJsaWMgYXR0cmlidXRlXG5cbiAgICB2YXIgbmV3T3B0cyA9IHV0aWxzLmV4dGVuZCh7XG4gICAgICAgIGF0dGFjaG1lbnQ6IHVuZGVmaW5lZCxcbiAgICAgICAgc2hhcGU6IHRoaXNcbiAgICB9LCB0aGlzLl9vcHRzKTtcbiAgICB0aGlzLl9wcm9ncmVzc1BhdGggPSBuZXcgUGF0aChzdmdWaWV3LnBhdGgsIG5ld09wdHMpO1xufTtcblxuU2hhcGUucHJvdG90eXBlLmFuaW1hdGUgPSBmdW5jdGlvbiBhbmltYXRlKHByb2dyZXNzLCBvcHRzLCBjYikge1xuICAgIGlmICh0aGlzLl9wcm9ncmVzc1BhdGggPT09IG51bGwpIHRocm93IG5ldyBFcnJvcihERVNUUk9ZRURfRVJST1IpO1xuICAgIHRoaXMuX3Byb2dyZXNzUGF0aC5hbmltYXRlKHByb2dyZXNzLCBvcHRzLCBjYik7XG59O1xuXG5TaGFwZS5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuX3Byb2dyZXNzUGF0aCA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKERFU1RST1lFRF9FUlJPUik7XG4gICAgLy8gRG9uJ3QgY3Jhc2ggaWYgc3RvcCBpcyBjYWxsZWQgaW5zaWRlIHN0ZXAgZnVuY3Rpb25cbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3NQYXRoID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgIHRoaXMuX3Byb2dyZXNzUGF0aC5zdG9wKCk7XG59O1xuXG5TaGFwZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX3Byb2dyZXNzUGF0aCA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKERFU1RST1lFRF9FUlJPUik7XG5cbiAgICB0aGlzLnN0b3AoKTtcbiAgICB0aGlzLnN2Zy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuc3ZnKTtcbiAgICB0aGlzLnN2ZyA9IG51bGw7XG4gICAgdGhpcy5wYXRoID0gbnVsbDtcbiAgICB0aGlzLnRyYWlsID0gbnVsbDtcbiAgICB0aGlzLl9wcm9ncmVzc1BhdGggPSBudWxsO1xuXG4gICAgaWYgKHRoaXMudGV4dCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnRleHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnRleHQpO1xuICAgICAgICB0aGlzLnRleHQgPSBudWxsO1xuICAgIH1cbn07XG5cblNoYXBlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQocHJvZ3Jlc3MpIHtcbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3NQYXRoID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoREVTVFJPWUVEX0VSUk9SKTtcbiAgICB0aGlzLl9wcm9ncmVzc1BhdGguc2V0KHByb2dyZXNzKTtcbn07XG5cblNoYXBlLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uIHZhbHVlKCkge1xuICAgIGlmICh0aGlzLl9wcm9ncmVzc1BhdGggPT09IG51bGwpIHRocm93IG5ldyBFcnJvcihERVNUUk9ZRURfRVJST1IpO1xuICAgIGlmICh0aGlzLl9wcm9ncmVzc1BhdGggPT09IHVuZGVmaW5lZCkgcmV0dXJuIDA7XG5cbiAgICByZXR1cm4gdGhpcy5fcHJvZ3Jlc3NQYXRoLnZhbHVlKCk7XG59O1xuXG5TaGFwZS5wcm90b3R5cGUuc2V0VGV4dCA9IGZ1bmN0aW9uIHNldFRleHQodGV4dCkge1xuICAgIGlmICh0aGlzLl9wcm9ncmVzc1BhdGggPT09IG51bGwpIHRocm93IG5ldyBFcnJvcihERVNUUk9ZRURfRVJST1IpO1xuXG4gICAgaWYgKHRoaXMudGV4dCA9PT0gbnVsbCkge1xuICAgICAgICAvLyBDcmVhdGUgbmV3IHRleHQgbm9kZVxuICAgICAgICB0aGlzLnRleHQgPSB0aGlzLl9jcmVhdGVUZXh0RWxlbWVudCh0aGlzLl9vcHRzLCB0aGlzLl9jb250YWluZXIpO1xuICAgICAgICB0aGlzLl9jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy50ZXh0KTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgcHJldmlvdXMgdGV4dCBub2RlIGFuZCBhZGQgbmV3XG4gICAgdGhpcy50ZXh0LnJlbW92ZUNoaWxkKHRoaXMudGV4dC5maXJzdENoaWxkKTtcbiAgICB0aGlzLnRleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpO1xufTtcblxuU2hhcGUucHJvdG90eXBlLl9jcmVhdGVTdmdWaWV3ID0gZnVuY3Rpb24gX2NyZWF0ZVN2Z1ZpZXcob3B0cykge1xuICAgIHZhciBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHRoaXMuX2luaXRpYWxpemVTdmcoc3ZnLCBvcHRzKTtcblxuICAgIHZhciB0cmFpbFBhdGggPSBudWxsO1xuICAgIC8vIEVhY2ggb3B0aW9uIGxpc3RlZCBpbiB0aGUgaWYgY29uZGl0aW9uIGFyZSAndHJpZ2dlcnMnIGZvciBjcmVhdGluZ1xuICAgIC8vIHRoZSB0cmFpbCBwYXRoXG4gICAgaWYgKG9wdHMudHJhaWxDb2xvciB8fCBvcHRzLnRyYWlsV2lkdGgpIHtcbiAgICAgICAgdHJhaWxQYXRoID0gdGhpcy5fY3JlYXRlVHJhaWwob3B0cyk7XG4gICAgICAgIHN2Zy5hcHBlbmRDaGlsZCh0cmFpbFBhdGgpO1xuICAgIH1cblxuICAgIHZhciBwYXRoID0gdGhpcy5fY3JlYXRlUGF0aChvcHRzKTtcbiAgICBzdmcuYXBwZW5kQ2hpbGQocGF0aCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdmc6IHN2ZyxcbiAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgdHJhaWw6IHRyYWlsUGF0aFxuICAgIH07XG59O1xuXG5TaGFwZS5wcm90b3R5cGUuX2luaXRpYWxpemVTdmcgPSBmdW5jdGlvbiBfaW5pdGlhbGl6ZVN2ZyhzdmcsIG9wdHMpIHtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCAxMDAgMTAwJyk7XG59O1xuXG5TaGFwZS5wcm90b3R5cGUuX2NyZWF0ZVBhdGggPSBmdW5jdGlvbiBfY3JlYXRlUGF0aChvcHRzKSB7XG4gICAgdmFyIHBhdGhTdHJpbmcgPSB0aGlzLl9wYXRoU3RyaW5nKG9wdHMpO1xuICAgIHJldHVybiB0aGlzLl9jcmVhdGVQYXRoRWxlbWVudChwYXRoU3RyaW5nLCBvcHRzKTtcbn07XG5cblNoYXBlLnByb3RvdHlwZS5fY3JlYXRlVHJhaWwgPSBmdW5jdGlvbiBfY3JlYXRlVHJhaWwob3B0cykge1xuICAgIC8vIENyZWF0ZSBwYXRoIHN0cmluZyB3aXRoIG9yaWdpbmFsIHBhc3NlZCBvcHRpb25zXG4gICAgdmFyIHBhdGhTdHJpbmcgPSB0aGlzLl90cmFpbFN0cmluZyhvcHRzKTtcblxuICAgIC8vIFByZXZlbnQgbW9kaWZ5aW5nIG9yaWdpbmFsXG4gICAgdmFyIG5ld09wdHMgPSB1dGlscy5leHRlbmQoe30sIG9wdHMpO1xuXG4gICAgLy8gRGVmYXVsdHMgZm9yIHBhcmFtZXRlcnMgd2hpY2ggbW9kaWZ5IHRyYWlsIHBhdGhcbiAgICBpZiAoIW5ld09wdHMudHJhaWxDb2xvcikgbmV3T3B0cy50cmFpbENvbG9yID0gJyNlZWUnO1xuICAgIGlmICghbmV3T3B0cy50cmFpbFdpZHRoKSBuZXdPcHRzLnRyYWlsV2lkdGggPSBuZXdPcHRzLnN0cm9rZVdpZHRoO1xuXG4gICAgbmV3T3B0cy5jb2xvciA9IG5ld09wdHMudHJhaWxDb2xvcjtcbiAgICBuZXdPcHRzLnN0cm9rZVdpZHRoID0gbmV3T3B0cy50cmFpbFdpZHRoO1xuXG4gICAgLy8gV2hlbiB0cmFpbCBwYXRoIGlzIHNldCwgZmlsbCBtdXN0IGJlIHNldCBmb3IgaXQgaW5zdGVhZCBvZiB0aGVcbiAgICAvLyBhY3R1YWwgcGF0aCB0byBwcmV2ZW50IHRyYWlsIHN0cm9rZSBmcm9tIGNsaXBwaW5nXG4gICAgbmV3T3B0cy5maWxsID0gbnVsbDtcblxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVQYXRoRWxlbWVudChwYXRoU3RyaW5nLCBuZXdPcHRzKTtcbn07XG5cblNoYXBlLnByb3RvdHlwZS5fY3JlYXRlUGF0aEVsZW1lbnQgPSBmdW5jdGlvbiBfY3JlYXRlUGF0aEVsZW1lbnQocGF0aFN0cmluZywgb3B0cykge1xuICAgIHZhciBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBwYXRoU3RyaW5nKTtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgb3B0cy5jb2xvcik7XG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsIG9wdHMuc3Ryb2tlV2lkdGgpO1xuXG4gICAgaWYgKG9wdHMuZmlsbCkge1xuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZmlsbCcsIG9wdHMuZmlsbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2ZpbGwtb3BhY2l0eScsICcwJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdGg7XG59O1xuXG5TaGFwZS5wcm90b3R5cGUuX2NyZWF0ZVRleHRFbGVtZW50ID0gZnVuY3Rpb24gX2NyZWF0ZVRleHRFbGVtZW50KG9wdHMsIGNvbnRhaW5lcikge1xuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUob3B0cy50ZXh0LnZhbHVlKSk7XG5cbiAgICBpZiAob3B0cy50ZXh0LmF1dG9TdHlsZSkge1xuICAgICAgICAvLyBDZW50ZXIgdGV4dFxuICAgICAgICBjb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSAnNTAlJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gJzUwJSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZyA9IDA7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUubWFyZ2luID0gMDtcbiAgICAgICAgdXRpbHMuc2V0U3R5bGUoZWxlbWVudCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknKTtcblxuICAgICAgICBpZiAob3B0cy50ZXh0LmNvbG9yKSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmNvbG9yID0gb3B0cy50ZXh0LmNvbG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5jb2xvciA9IG9wdHMuY29sb3I7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSBvcHRzLnRleHQuY2xhc3NOYW1lO1xuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuXG5TaGFwZS5wcm90b3R5cGUuX3BhdGhTdHJpbmcgPSBmdW5jdGlvbiBfcGF0aFN0cmluZyhvcHRzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdPdmVycmlkZSB0aGlzIGZ1bmN0aW9uIGZvciBlYWNoIHByb2dyZXNzIGJhcicpO1xufTtcblxuU2hhcGUucHJvdG90eXBlLl90cmFpbFN0cmluZyA9IGZ1bmN0aW9uIF90cmFpbFN0cmluZyhvcHRzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdPdmVycmlkZSB0aGlzIGZ1bmN0aW9uIGZvciBlYWNoIHByb2dyZXNzIGJhcicpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZTtcbiIsIi8vIFNxdWFyZSBzaGFwZWQgcHJvZ3Jlc3MgYmFyXG5cbnZhciBTaGFwZSA9IHJlcXVpcmUoJy4vc2hhcGUnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuXG52YXIgU3F1YXJlID0gZnVuY3Rpb24gU3F1YXJlKGNvbnRhaW5lciwgb3B0aW9ucykge1xuICAgIHRoaXMuX3BhdGhUZW1wbGF0ZSA9XG4gICAgICAgICdNIDAse2hhbGZPZlN0cm9rZVdpZHRofScgK1xuICAgICAgICAnIEwge3dpZHRofSx7aGFsZk9mU3Ryb2tlV2lkdGh9JyArXG4gICAgICAgICcgTCB7d2lkdGh9LHt3aWR0aH0nICtcbiAgICAgICAgJyBMIHtoYWxmT2ZTdHJva2VXaWR0aH0se3dpZHRofScgK1xuICAgICAgICAnIEwge2hhbGZPZlN0cm9rZVdpZHRofSx7c3Ryb2tlV2lkdGh9JztcblxuICAgIHRoaXMuX3RyYWlsVGVtcGxhdGUgPVxuICAgICAgICAnTSB7c3RhcnRNYXJnaW59LHtoYWxmT2ZTdHJva2VXaWR0aH0nICtcbiAgICAgICAgJyBMIHt3aWR0aH0se2hhbGZPZlN0cm9rZVdpZHRofScgK1xuICAgICAgICAnIEwge3dpZHRofSx7d2lkdGh9JyArXG4gICAgICAgICcgTCB7aGFsZk9mU3Ryb2tlV2lkdGh9LHt3aWR0aH0nICtcbiAgICAgICAgJyBMIHtoYWxmT2ZTdHJva2VXaWR0aH0se2hhbGZPZlN0cm9rZVdpZHRofSc7XG5cbiAgICBTaGFwZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuU3F1YXJlLnByb3RvdHlwZSA9IG5ldyBTaGFwZSgpO1xuU3F1YXJlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNxdWFyZTtcblxuU3F1YXJlLnByb3RvdHlwZS5fcGF0aFN0cmluZyA9IGZ1bmN0aW9uIF9wYXRoU3RyaW5nKG9wdHMpIHtcbiAgICB2YXIgdyA9IDEwMCAtIG9wdHMuc3Ryb2tlV2lkdGggLyAyO1xuXG4gICAgcmV0dXJuIHV0aWxzLnJlbmRlcih0aGlzLl9wYXRoVGVtcGxhdGUsIHtcbiAgICAgICAgd2lkdGg6IHcsXG4gICAgICAgIHN0cm9rZVdpZHRoOiBvcHRzLnN0cm9rZVdpZHRoLFxuICAgICAgICBoYWxmT2ZTdHJva2VXaWR0aDogb3B0cy5zdHJva2VXaWR0aCAvIDJcbiAgICB9KTtcbn07XG5cblNxdWFyZS5wcm90b3R5cGUuX3RyYWlsU3RyaW5nID0gZnVuY3Rpb24gX3RyYWlsU3RyaW5nKG9wdHMpIHtcbiAgICB2YXIgdyA9IDEwMCAtIG9wdHMuc3Ryb2tlV2lkdGggLyAyO1xuXG4gICAgcmV0dXJuIHV0aWxzLnJlbmRlcih0aGlzLl90cmFpbFRlbXBsYXRlLCB7XG4gICAgICAgIHdpZHRoOiB3LFxuICAgICAgICBzdHJva2VXaWR0aDogb3B0cy5zdHJva2VXaWR0aCxcbiAgICAgICAgaGFsZk9mU3Ryb2tlV2lkdGg6IG9wdHMuc3Ryb2tlV2lkdGggLyAyLFxuICAgICAgICBzdGFydE1hcmdpbjogKG9wdHMuc3Ryb2tlV2lkdGggLyAyKSAtIChvcHRzLnRyYWlsV2lkdGggLyAyKVxuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTcXVhcmU7XG4iLCIvLyBVdGlsaXR5IGZ1bmN0aW9uc1xuXG52YXIgUFJFRklYRVMgPSAnV2Via2l0IE1veiBPIG1zJy5zcGxpdCgnICcpO1xuXG4vLyBDb3B5IGFsbCBhdHRyaWJ1dGVzIGZyb20gc291cmNlIG9iamVjdCB0byBkZXN0aW5hdGlvbiBvYmplY3QuXG4vLyBkZXN0aW5hdGlvbiBvYmplY3QgaXMgbXV0YXRlZC5cbmZ1bmN0aW9uIGV4dGVuZChkZXN0aW5hdGlvbiwgc291cmNlLCByZWN1cnNpdmUpIHtcbiAgICBkZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uIHx8IHt9O1xuICAgIHNvdXJjZSA9IHNvdXJjZSB8fCB7fTtcbiAgICByZWN1cnNpdmUgPSByZWN1cnNpdmUgfHwgZmFsc2U7XG5cbiAgICBmb3IgKHZhciBhdHRyTmFtZSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgIHZhciBkZXN0VmFsID0gZGVzdGluYXRpb25bYXR0ck5hbWVdO1xuICAgICAgICAgICAgdmFyIHNvdXJjZVZhbCA9IHNvdXJjZVthdHRyTmFtZV07XG4gICAgICAgICAgICBpZiAocmVjdXJzaXZlICYmIGlzT2JqZWN0KGRlc3RWYWwpICYmIGlzT2JqZWN0KHNvdXJjZVZhbCkpIHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvblthdHRyTmFtZV0gPSBleHRlbmQoZGVzdFZhbCwgc291cmNlVmFsLCByZWN1cnNpdmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvblthdHRyTmFtZV0gPSBzb3VyY2VWYWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVzdGluYXRpb247XG59XG5cbi8vIFJlbmRlcnMgdGVtcGxhdGVzIHdpdGggZ2l2ZW4gdmFyaWFibGVzLiBWYXJpYWJsZXMgbXVzdCBiZSBzdXJyb3VuZGVkIHdpdGhcbi8vIGJyYWNlcyB3aXRob3V0IGFueSBzcGFjZXMsIGUuZy4ge3ZhcmlhYmxlfVxuLy8gQWxsIGluc3RhbmNlcyBvZiB2YXJpYWJsZSBwbGFjZWhvbGRlcnMgd2lsbCBiZSByZXBsYWNlZCB3aXRoIGdpdmVuIGNvbnRlbnRcbi8vIEV4YW1wbGU6XG4vLyByZW5kZXIoJ0hlbGxvLCB7bWVzc2FnZX0hJywge21lc3NhZ2U6ICd3b3JsZCd9KVxuZnVuY3Rpb24gcmVuZGVyKHRlbXBsYXRlLCB2YXJzKSB7XG4gICAgdmFyIHJlbmRlcmVkID0gdGVtcGxhdGU7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gdmFycykge1xuICAgICAgICBpZiAodmFycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gdmFyc1trZXldO1xuICAgICAgICAgICAgdmFyIHJlZ0V4cFN0cmluZyA9ICdcXFxceycgKyBrZXkgKyAnXFxcXH0nO1xuICAgICAgICAgICAgdmFyIHJlZ0V4cCA9IG5ldyBSZWdFeHAocmVnRXhwU3RyaW5nLCAnZycpO1xuXG4gICAgICAgICAgICByZW5kZXJlZCA9IHJlbmRlcmVkLnJlcGxhY2UocmVnRXhwLCB2YWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlbmRlcmVkO1xufVxuXG5mdW5jdGlvbiBzZXRTdHlsZShlbGVtZW50LCBzdHlsZSwgdmFsdWUpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IFBSRUZJWEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSBQUkVGSVhFU1tpXTtcbiAgICAgICAgZWxlbWVudC5zdHlsZVtwcmVmaXggKyBjYXBpdGFsaXplKHN0eWxlKV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBlbGVtZW50LnN0eWxlW3N0eWxlXSA9IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBjYXBpdGFsaXplKHRleHQpIHtcbiAgICByZXR1cm4gdGV4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRleHQuc2xpY2UoMSk7XG59XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJyB8fCBvYmogaW5zdGFuY2VvZiBTdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG4vLyBSZXR1cm5zIHRydWUgaWYgYG9iamAgaXMgb2JqZWN0IGFzIGluIHthOiAxLCBiOiAyfSwgbm90IGlmIGl0J3MgZnVuY3Rpb24gb3Jcbi8vIGFycmF5XG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICBpZiAoaXNBcnJheShvYmopKSByZXR1cm4gZmFsc2U7XG5cbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmo7XG4gICAgcmV0dXJuIHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGV4dGVuZDogZXh0ZW5kLFxuICAgIHJlbmRlcjogcmVuZGVyLFxuICAgIHNldFN0eWxlOiBzZXRTdHlsZSxcbiAgICBjYXBpdGFsaXplOiBjYXBpdGFsaXplLFxuICAgIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICAgIGlzT2JqZWN0OiBpc09iamVjdFxufTtcbiJdfQ==
