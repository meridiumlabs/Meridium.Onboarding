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
                cards[i].addEventListener("click", function (e) {
                    e.preventDefault();
                    self.updateChallengeCard(this);
                    self.updateChallengeOnServer(this);
                });
            }
        }
    }, {
        key: "updateChallengeCard",
        value: function updateChallengeCard(card) {
            var cardIsMarkedAsComplete = card.classList.contains("card--complete");
            card.classList.toggle("card--complete");
            var points = card.getAttribute('data-points');
            if (cardIsMarkedAsComplete) {
                points = points * -1;
            }

            //var e = document.createEvent('CustomEvent');

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXQvTWVyaWRpdW0uQ2hhbGxlbmdlQm9hcmQvQ2hhbGxlbmdlQm9hcmQuV2ViL0NvbnRlbnQvU2NyaXB0cy9Nb2R1bGVzL0NoYWxsZW5nZUNhcmRzLmpzIiwiQzovR2l0L01lcmlkaXVtLkNoYWxsZW5nZUJvYXJkL0NoYWxsZW5nZUJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvTW9kdWxlcy9Vc2VySW5mby5qcyIsIkM6L0dpdC9NZXJpZGl1bS5DaGFsbGVuZ2VCb2FyZC9DaGFsbGVuZ2VCb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL21haW4uanMiLCIuLi9DaGFsbGVuZ2VCb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL25vZGVfbW9kdWxlcy9wcm9ncmVzc2Jhci5qcy9ub2RlX21vZHVsZXMvc2hpZnR5L2Rpc3Qvc2hpZnR5LmpzIiwiLi4vQ2hhbGxlbmdlQm9hcmQuV2ViL0NvbnRlbnQvU2NyaXB0cy9ub2RlX21vZHVsZXMvcHJvZ3Jlc3NiYXIuanMvc3JjL2NpcmNsZS5qcyIsIi4uL0NoYWxsZW5nZUJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvbm9kZV9tb2R1bGVzL3Byb2dyZXNzYmFyLmpzL3NyYy9saW5lLmpzIiwiLi4vQ2hhbGxlbmdlQm9hcmQuV2ViL0NvbnRlbnQvU2NyaXB0cy9ub2RlX21vZHVsZXMvcHJvZ3Jlc3NiYXIuanMvc3JjL21haW4uanMiLCIuLi9DaGFsbGVuZ2VCb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL25vZGVfbW9kdWxlcy9wcm9ncmVzc2Jhci5qcy9zcmMvcGF0aC5qcyIsIi4uL0NoYWxsZW5nZUJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvbm9kZV9tb2R1bGVzL3Byb2dyZXNzYmFyLmpzL3NyYy9zaGFwZS5qcyIsIi4uL0NoYWxsZW5nZUJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvbm9kZV9tb2R1bGVzL3Byb2dyZXNzYmFyLmpzL3NyYy9zcXVhcmUuanMiLCIuLi9DaGFsbGVuZ2VCb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL25vZGVfbW9kdWxlcy9wcm9ncmVzc2Jhci5qcy9zcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7SUNBTSxjQUFjO0FBQ0wsYUFEVCxjQUFjLENBQ0osSUFBSSxFQUFFOzhCQURoQixjQUFjOztBQUVaLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0tBQzdCOztpQkFKQyxjQUFjOztlQUtFLDhCQUFHO0FBQ2pCLGdCQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsZ0JBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRCxpQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbkMscUJBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDM0MscUJBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNuQix3QkFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLHdCQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3RDLENBQUMsQ0FBQzthQUNOO1NBQ0o7OztlQUNrQiw2QkFBQyxJQUFJLEVBQUU7QUFDdEIsZ0JBQUksc0JBQXNCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN2RSxnQkFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN4QyxnQkFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM5QyxnQkFBRyxzQkFBc0IsRUFBRTtBQUN2QixzQkFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzthQUN4Qjs7OztBQUlELGdCQUFJLEtBQUssR0FBRyxJQUFJLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3hFLG9CQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2pDOzs7ZUFDc0IsaUNBQUMsSUFBSSxFQUFFO0FBQzFCLGdCQUFJLEdBQUcsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0FBQy9CLGVBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLHNCQUFzQixDQUFDLENBQUM7QUFDekMsZUFBRyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3pELGVBQUcsQ0FBQyxNQUFNLEdBQUcsWUFBWTtBQUNyQixvQkFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTs7O0FBR3BCLHdCQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUNoRSwwQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsdUJBQXVCLEdBQUcsUUFBUSxDQUFDO0FBQzFELDJCQUFPO2lCQUNWO2FBQ0osQ0FBQztBQUNGLGVBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNwQixrQkFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO0FBQ2hDLDJCQUFXLEVBQUUsSUFBSSxDQUFDLElBQUk7YUFDekIsQ0FBQyxDQUFDLENBQUM7U0FDUDs7O1dBOUNDLGNBQWM7OztBQWdEcEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUM7Ozs7Ozs7OztBQ2hEaEMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0lBRXRDLFFBQVE7QUFDQyxhQURULFFBQVEsQ0FDRSxJQUFJLEVBQUU7OEJBRGhCLFFBQVE7O0FBRU4sWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsWUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUU7QUFDL0QsaUJBQUssRUFBRSxTQUFTO0FBQ2hCLHVCQUFXLEVBQUUsQ0FBQztBQUNkLGtCQUFNLEVBQUUsV0FBVztTQUN0QixDQUFDLENBQUM7QUFDSCxZQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDekI7O2lCQVRDLFFBQVE7O2VBVUksMEJBQ2Q7OztBQUNJLGdCQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzVDLG9CQUFRLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLEVBQUUsVUFBQSxLQUFLO3VCQUFJLE1BQUssaUJBQWlCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQzthQUFBLENBQUMsQ0FBQztTQUNsRzs7O2VBQ2MsMkJBQ2Y7QUFDSSxnQkFBSSxhQUFhLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkYsZ0JBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzVFLGdCQUFJLFFBQVEsR0FBRyxhQUFhLEdBQUcsUUFBUSxDQUFDO0FBQ3hDLGdCQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUd0Qzs7O2VBQ2dCLDJCQUFDLE1BQU0sRUFBRTtBQUN0QixtQkFBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwQixnQkFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN4RCxnQkFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFckQsZ0JBQUksUUFBUSxHQUFHLGFBQWEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEQsc0JBQVUsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDO0FBQ2xDLGdCQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQy9HLGdCQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBR25DLGdCQUFJLFFBQVEsSUFBSSxHQUFHLEVBQUU7O0FBRWpCLG9CQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDdkQsb0JBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUN4Qyx5QkFBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3BDO2FBQ0osTUFBTTs7QUFFSCxvQkFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3ZELG9CQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQ3ZDLHlCQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDdkM7YUFDSjtBQUNELGdCQUFJLGFBQWEsSUFBSSxHQUFHLEVBQUU7O0FBRXRCLG9CQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDdkQsb0JBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUN4Qyx5QkFBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3BDO2FBQ0osTUFBTTs7QUFFSCxvQkFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3ZELG9CQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQ3ZDLHlCQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDdkM7YUFDSjs7QUFFRCxnQkFBSSxhQUFhLElBQUksR0FBRyxFQUFFO0FBQ3RCLG9CQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDekQsb0JBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUN4Qyx5QkFBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3BDO2FBQ0osTUFBTTtBQUNILG9CQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDekQsb0JBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDdkMseUJBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN2QzthQUNKO0FBQ0QsZ0JBQUksYUFBYSxJQUFJLElBQUksRUFBRTtBQUN2QixvQkFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3hELG9CQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDeEMseUJBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUNwQzthQUNKLE1BQU07QUFDSCxvQkFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3hELG9CQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQ3ZDLHlCQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDdkM7YUFDSjtBQUNELGdCQUFJLGFBQWEsSUFBSSxJQUFJLEVBQUU7QUFDdkIsb0JBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN4RCxvQkFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQ3hDLHlCQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDcEM7YUFDSixNQUFNO0FBQ0gsb0JBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN4RCxvQkFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUN2Qyx5QkFBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3ZDO2FBQ0o7U0FFSjs7O1dBaEdDLFFBQVE7OztBQWtHZCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQzs7Ozs7OztxQ0NwR0MsMEJBQTBCOzs7OytCQUNoQyxvQkFBb0I7Ozs7QUFFekMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFVBQVMsS0FBSyxFQUFFO0FBQzFELFFBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDOztBQUVoRSxRQUFJLGNBQWMsR0FBRyx1Q0FBbUIsUUFBUSxDQUFDLENBQUM7QUFDbEQsUUFBSSxRQUFRLEdBQUcsaUNBQWEsUUFBUSxDQUFDLENBQUM7O0FBRXRDLFlBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7QUFFM0IsUUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUNoRCxDQUFDLENBQUM7Ozs7Ozs7QUNaSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaDJDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBDaGFsbGVuZ2VDYXJkcyB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1c2VyKSB7XHJcbiAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyQ2xpY2tFdmVudCgpO1xyXG4gICAgfVxyXG4gICAgcmVnaXN0ZXJDbGlja0V2ZW50KCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY2FyZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY2FyZFwiKTsgICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpKyspIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FyZHNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGVDaGFsbGVuZ2VDYXJkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGVDaGFsbGVuZ2VPblNlcnZlcih0aGlzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdXBkYXRlQ2hhbGxlbmdlQ2FyZChjYXJkKSB7XHJcbiAgICAgICAgdmFyIGNhcmRJc01hcmtlZEFzQ29tcGxldGUgPSBjYXJkLmNsYXNzTGlzdC5jb250YWlucyhcImNhcmQtLWNvbXBsZXRlXCIpO1xyXG4gICAgICAgIGNhcmQuY2xhc3NMaXN0LnRvZ2dsZShcImNhcmQtLWNvbXBsZXRlXCIpO1xyXG4gICAgICAgIHZhciBwb2ludHMgPSBjYXJkLmdldEF0dHJpYnV0ZSgnZGF0YS1wb2ludHMnKTtcclxuICAgICAgICBpZihjYXJkSXNNYXJrZWRBc0NvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgIHBvaW50cyA9IHBvaW50cyAqIC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy92YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xyXG5cclxuICAgICAgICB2YXIgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJjaGFsbGVuZ2VDYXJkU2F2ZWRcIiwgeyBcImRldGFpbFwiOiBwb2ludHMgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVDaGFsbGVuZ2VPblNlcnZlcihjYXJkKSB7ICAgICAgICBcclxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnSG9tZS9Ub2dnbGVDaGFsbGVuZ2UnKTtcclxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyAhPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAvL1NvbWV0aGluZyB3ZW50IHdyb25nIG1lc3NhZ2UuXHJcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gdG8gbG9naW4gZm9ybVxyXG4gICAgICAgICAgICAgICAgdmFyIHVzZXJuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyLWhpZGVcIikudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL0F1dGhlbnRpY2F0aW9uP25hbWU9XCIgKyB1c2VybmFtZTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICBpZDogY2FyZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKSxcclxuICAgICAgICAgICAgY3VycmVudFVzZXI6IHRoaXMudXNlclxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IENoYWxsZW5nZUNhcmRzOyIsInZhciBwcm9ncmVzc2JhciA9IHJlcXVpcmUoJ3Byb2dyZXNzYmFyLmpzJyk7XHJcblxyXG5jbGFzcyBVc2VySW5mbyB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1c2VyKSB7XHJcbiAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcclxuICAgICAgICB0aGlzLnByb2dyZXNzQmFyID0gbmV3IHByb2dyZXNzYmFyLkNpcmNsZSgnI1Byb2dyZXNzQmFyQ29udGFpbmVyJywge1xyXG4gICAgICAgICAgICBjb2xvcjogJyMwMGNjOTknLFxyXG4gICAgICAgICAgICBzdHJva2VXaWR0aDogMyxcclxuICAgICAgICAgICAgZWFzaW5nOiAnZWFzZUluT3V0J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcclxuICAgIH1cclxuICAgIHJlZ2lzdGVyRXZlbnRzKClcclxuICAgIHtcclxuICAgICAgICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoXCJjaGFsbGVuZ2VDYXJkU2F2ZWRcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYWxsZW5nZUNhcmRTYXZlZFwiLCBldmVudCA9PiB0aGlzLnVwZGF0ZVByb2dyZXNzQmFyKGV2ZW50LmRldGFpbCkpO1xyXG4gICAgfVxyXG4gICAgaW5pdFByb2dyZXNzQmFyKClcclxuICAgIHtcclxuICAgICAgICB2YXIgY3VycmVudFBvaW50cyA9IHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ludHJvLXNjb3JlJykudGV4dENvbnRlbnQpO1xyXG4gICAgICAgIHZhciBtYXhTY29yZSA9IHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21heC1zY29yZScpLnRleHRDb250ZW50KTtcclxuICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBjdXJyZW50UG9pbnRzIC8gbWF4U2NvcmU7XHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc0Jhci5hbmltYXRlKHByb2dyZXNzKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICB1cGRhdGVQcm9ncmVzc0Jhcihwb2ludHMpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhwb2ludHMpO1xyXG4gICAgICAgIHZhciBzY29yZWJvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ludHJvLXNjb3JlJyk7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRQb2ludHMgPSBwYXJzZUludChzY29yZWJvYXJkLnRleHRDb250ZW50KTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgbmV3U2NvcmUgPSBjdXJyZW50UG9pbnRzICsgcGFyc2VJbnQocG9pbnRzKTtcclxuICAgICAgICBzY29yZWJvYXJkLnRleHRDb250ZW50ID0gbmV3U2NvcmU7XHJcbiAgICAgICAgdmFyIHByb2dyZXNzID0gcGFyc2VGbG9hdChzY29yZWJvYXJkLnRleHRDb250ZW50KS9wYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXgtc2NvcmUnKS50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc0Jhci5hbmltYXRlKHByb2dyZXNzKTtcclxuXHJcbiAgICAgICAgLy91cGRhdGUgYm9udXMgcmluZ3NcclxuICAgICAgICBpZiAobmV3U2NvcmUgPj0gMTAwKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgbGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9udXMtbGV2ZWwtb25lJyk7XHJcbiAgICAgICAgICAgIGlmICghbGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QuYWRkKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib251cy1sZXZlbC1vbmUnKTtcclxuICAgICAgICAgICAgaWYgKGxldmVsLmNsYXNzTGlzdC5jb250YWlucyhcImZ1bGZpbGxlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuY2xhc3NMaXN0LnJlbW92ZShcImZ1bGZpbGxlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudFBvaW50cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib251cy1sZXZlbC10d28nKTtcclxuICAgICAgICAgICAgaWYgKCFsZXZlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLmNsYXNzTGlzdC5hZGQoXCJmdWxmaWxsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbnVzLWxldmVsLXR3bycpO1xyXG4gICAgICAgICAgICBpZiAobGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QucmVtb3ZlKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKGN1cnJlbnRQb2ludHMgPj0gODAwKSB7XHJcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib251cy1sZXZlbC10aHJlZScpO1xyXG4gICAgICAgICAgICBpZiAoIWxldmVsLmNsYXNzTGlzdC5jb250YWlucyhcImZ1bGZpbGxlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuY2xhc3NMaXN0LmFkZChcImZ1bGZpbGxlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib251cy1sZXZlbC10aHJlZScpO1xyXG4gICAgICAgICAgICBpZiAobGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QucmVtb3ZlKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJyZW50UG9pbnRzID49IDEzMDApIHtcclxuICAgICAgICAgICAgdmFyIGxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbnVzLWxldmVsLWZvdXInKTtcclxuICAgICAgICAgICAgaWYgKCFsZXZlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLmNsYXNzTGlzdC5hZGQoXCJmdWxmaWxsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgbGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9udXMtbGV2ZWwtZm91cicpO1xyXG4gICAgICAgICAgICBpZiAobGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QucmVtb3ZlKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJyZW50UG9pbnRzID49IDIwMDApIHtcclxuICAgICAgICAgICAgdmFyIGxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbnVzLWxldmVsLWZpdmUnKTtcclxuICAgICAgICAgICAgaWYgKCFsZXZlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLmNsYXNzTGlzdC5hZGQoXCJmdWxmaWxsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgbGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9udXMtbGV2ZWwtZml2ZScpO1xyXG4gICAgICAgICAgICBpZiAobGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QucmVtb3ZlKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJJbmZvOyIsImltcG9ydCBDaGFsbGVuZ2VDYXJkcyBmcm9tIFwiLi9Nb2R1bGVzL0NoYWxsZW5nZUNhcmRzXCI7XHJcbmltcG9ydCBVc2VySW5mbyBmcm9tIFwiLi9Nb2R1bGVzL1VzZXJJbmZvXCI7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgdmFyIHVzZXJuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyLWhpZGVcIikudGV4dENvbnRlbnQ7XHJcbiAgICBcclxuICAgIHZhciBjaGFsbGVuZ2VDYXJkcyA9IG5ldyBDaGFsbGVuZ2VDYXJkcyh1c2VybmFtZSk7XHJcbiAgICB2YXIgdXNlckluZm8gPSBuZXcgVXNlckluZm8odXNlcm5hbWUpO1xyXG5cclxuICAgIHVzZXJJbmZvLmluaXRQcm9ncmVzc0JhcigpO1xyXG5cclxuICAgIHZhciBjYXJkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdDYXJkcycpO1xyXG59KTtcclxuLyp2YXIgbXNucnkgPSBuZXcgTWFzb25yeSggY2FyZHMsIHtcclxuICBpdGVtU2VsZWN0b3I6ICcuaXRlbScsXHJcbiAgY29sdW1uV2lkdGg6IDIyMFxyXG59KTsqLyIsIi8qISBzaGlmdHkgLSB2MS4yLjIgLSAyMDE0LTEwLTA5IC0gaHR0cDovL2plcmVteWNrYWhuLmdpdGh1Yi5pby9zaGlmdHkgKi9cclxuOyhmdW5jdGlvbiAocm9vdCkge1xyXG5cclxuLyohXHJcbiAqIFNoaWZ0eSBDb3JlXHJcbiAqIEJ5IEplcmVteSBLYWhuIC0gamVyZW15Y2thaG5AZ21haWwuY29tXHJcbiAqL1xyXG5cclxuLy8gVWdsaWZ5SlMgZGVmaW5lIGhhY2suICBVc2VkIGZvciB1bml0IHRlc3RpbmcuICBDb250ZW50cyBvZiB0aGlzIGlmIGFyZVxyXG4vLyBjb21waWxlZCBhd2F5LlxyXG5pZiAodHlwZW9mIFNISUZUWV9ERUJVR19OT1cgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgU0hJRlRZX0RFQlVHX05PVyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiArbmV3IERhdGUoKTtcclxuICB9O1xyXG59XHJcblxyXG52YXIgVHdlZW5hYmxlID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAvLyBBbGlhc2VzIHRoYXQgZ2V0IGRlZmluZWQgbGF0ZXIgaW4gdGhpcyBmdW5jdGlvblxyXG4gIHZhciBmb3JtdWxhO1xyXG5cclxuICAvLyBDT05TVEFOVFNcclxuICB2YXIgREVGQVVMVF9TQ0hFRFVMRV9GVU5DVElPTjtcclxuICB2YXIgREVGQVVMVF9FQVNJTkcgPSAnbGluZWFyJztcclxuICB2YXIgREVGQVVMVF9EVVJBVElPTiA9IDUwMDtcclxuICB2YXIgVVBEQVRFX1RJTUUgPSAxMDAwIC8gNjA7XHJcblxyXG4gIHZhciBfbm93ID0gRGF0ZS5ub3dcclxuICAgICAgID8gRGF0ZS5ub3dcclxuICAgICAgIDogZnVuY3Rpb24gKCkge3JldHVybiArbmV3IERhdGUoKTt9O1xyXG5cclxuICB2YXIgbm93ID0gU0hJRlRZX0RFQlVHX05PV1xyXG4gICAgICAgPyBTSElGVFlfREVCVUdfTk9XXHJcbiAgICAgICA6IF9ub3c7XHJcblxyXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCkgc2hpbSBieSBQYXVsIElyaXNoIChtb2RpZmllZCBmb3IgU2hpZnR5KVxyXG4gICAgLy8gaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cclxuICAgIERFRkFVTFRfU0NIRURVTEVfRlVOQ1RJT04gPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcbiAgICAgICB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcbiAgICAgICB8fCB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgICAgfHwgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcbiAgICAgICB8fCAod2luZG93Lm1vekNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgICAgJiYgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSlcclxuICAgICAgIHx8IHNldFRpbWVvdXQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIERFRkFVTFRfU0NIRURVTEVfRlVOQ1RJT04gPSBzZXRUaW1lb3V0O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbm9vcCAoKSB7XHJcbiAgICAvLyBOT09QIVxyXG4gIH1cclxuXHJcbiAgLyohXHJcbiAgICogSGFuZHkgc2hvcnRjdXQgZm9yIGRvaW5nIGEgZm9yLWluIGxvb3AuIFRoaXMgaXMgbm90IGEgXCJub3JtYWxcIiBlYWNoXHJcbiAgICogZnVuY3Rpb24sIGl0IGlzIG9wdGltaXplZCBmb3IgU2hpZnR5LiAgVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIG9ubHkgcmVjZWl2ZXNcclxuICAgKiB0aGUgcHJvcGVydHkgbmFtZSwgbm90IHRoZSB2YWx1ZS5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbihzdHJpbmcpfSBmblxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGVhY2ggKG9iaiwgZm4pIHtcclxuICAgIHZhciBrZXk7XHJcbiAgICBmb3IgKGtleSBpbiBvYmopIHtcclxuICAgICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xyXG4gICAgICAgIGZuKGtleSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIFBlcmZvcm0gYSBzaGFsbG93IGNvcHkgb2YgT2JqZWN0IHByb3BlcnRpZXMuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldE9iamVjdCBUaGUgb2JqZWN0IHRvIGNvcHkgaW50b1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzcmNPYmplY3QgVGhlIG9iamVjdCB0byBjb3B5IGZyb21cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEEgcmVmZXJlbmNlIHRvIHRoZSBhdWdtZW50ZWQgYHRhcmdldE9iamAgT2JqZWN0XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc2hhbGxvd0NvcHkgKHRhcmdldE9iaiwgc3JjT2JqKSB7XHJcbiAgICBlYWNoKHNyY09iaiwgZnVuY3Rpb24gKHByb3ApIHtcclxuICAgICAgdGFyZ2V0T2JqW3Byb3BdID0gc3JjT2JqW3Byb3BdO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRhcmdldE9iajtcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIENvcGllcyBlYWNoIHByb3BlcnR5IGZyb20gc3JjIG9udG8gdGFyZ2V0LCBidXQgb25seSBpZiB0aGUgcHJvcGVydHkgdG9cclxuICAgKiBjb3B5IHRvIHRhcmdldCBpcyB1bmRlZmluZWQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBNaXNzaW5nIHByb3BlcnRpZXMgaW4gdGhpcyBPYmplY3QgYXJlIGZpbGxlZCBpblxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzcmNcclxuICAgKi9cclxuICBmdW5jdGlvbiBkZWZhdWx0cyAodGFyZ2V0LCBzcmMpIHtcclxuICAgIGVhY2goc3JjLCBmdW5jdGlvbiAocHJvcCkge1xyXG4gICAgICBpZiAodHlwZW9mIHRhcmdldFtwcm9wXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0YXJnZXRbcHJvcF0gPSBzcmNbcHJvcF07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyohXHJcbiAgICogQ2FsY3VsYXRlcyB0aGUgaW50ZXJwb2xhdGVkIHR3ZWVuIHZhbHVlcyBvZiBhbiBPYmplY3QgZm9yIGEgZ2l2ZW5cclxuICAgKiB0aW1lc3RhbXAuXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGZvclBvc2l0aW9uIFRoZSBwb3NpdGlvbiB0byBjb21wdXRlIHRoZSBzdGF0ZSBmb3IuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGN1cnJlbnRTdGF0ZSBDdXJyZW50IHN0YXRlIHByb3BlcnRpZXMuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9yaWdpbmFsU3RhdGU6IFRoZSBvcmlnaW5hbCBzdGF0ZSBwcm9wZXJ0aWVzIHRoZSBPYmplY3QgaXNcclxuICAgKiB0d2VlbmluZyBmcm9tLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRTdGF0ZTogVGhlIGRlc3RpbmF0aW9uIHN0YXRlIHByb3BlcnRpZXMgdGhlIE9iamVjdFxyXG4gICAqIGlzIHR3ZWVuaW5nIHRvLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbjogVGhlIGxlbmd0aCBvZiB0aGUgdHdlZW4gaW4gbWlsbGlzZWNvbmRzLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lc3RhbXA6IFRoZSBVTklYIGVwb2NoIHRpbWUgYXQgd2hpY2ggdGhlIHR3ZWVuIGJlZ2FuLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmc6IFRoaXMgT2JqZWN0J3Mga2V5cyBtdXN0IGNvcnJlc3BvbmQgdG8gdGhlIGtleXMgaW5cclxuICAgKiB0YXJnZXRTdGF0ZS5cclxuICAgKi9cclxuICBmdW5jdGlvbiB0d2VlblByb3BzIChmb3JQb3NpdGlvbiwgY3VycmVudFN0YXRlLCBvcmlnaW5hbFN0YXRlLCB0YXJnZXRTdGF0ZSxcclxuICAgIGR1cmF0aW9uLCB0aW1lc3RhbXAsIGVhc2luZykge1xyXG4gICAgdmFyIG5vcm1hbGl6ZWRQb3NpdGlvbiA9IChmb3JQb3NpdGlvbiAtIHRpbWVzdGFtcCkgLyBkdXJhdGlvbjtcclxuXHJcbiAgICB2YXIgcHJvcDtcclxuICAgIGZvciAocHJvcCBpbiBjdXJyZW50U3RhdGUpIHtcclxuICAgICAgaWYgKGN1cnJlbnRTdGF0ZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgIGN1cnJlbnRTdGF0ZVtwcm9wXSA9IHR3ZWVuUHJvcChvcmlnaW5hbFN0YXRlW3Byb3BdLFxyXG4gICAgICAgICAgdGFyZ2V0U3RhdGVbcHJvcF0sIGZvcm11bGFbZWFzaW5nW3Byb3BdXSwgbm9ybWFsaXplZFBvc2l0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjdXJyZW50U3RhdGU7XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBUd2VlbnMgYSBzaW5nbGUgcHJvcGVydHkuXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IFRoZSB2YWx1ZSB0aGF0IHRoZSB0d2VlbiBzdGFydGVkIGZyb20uXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgdmFsdWUgdGhhdCB0aGUgdHdlZW4gc2hvdWxkIGVuZCBhdC5cclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYXNpbmdGdW5jIFRoZSBlYXNpbmcgY3VydmUgdG8gYXBwbHkgdG8gdGhlIHR3ZWVuLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBUaGUgbm9ybWFsaXplZCBwb3NpdGlvbiAoYmV0d2VlbiAwLjAgYW5kIDEuMCkgdG9cclxuICAgKiBjYWxjdWxhdGUgdGhlIG1pZHBvaW50IG9mICdzdGFydCcgYW5kICdlbmQnIGFnYWluc3QuXHJcbiAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgdHdlZW5lZCB2YWx1ZS5cclxuICAgKi9cclxuICBmdW5jdGlvbiB0d2VlblByb3AgKHN0YXJ0LCBlbmQsIGVhc2luZ0Z1bmMsIHBvc2l0aW9uKSB7XHJcbiAgICByZXR1cm4gc3RhcnQgKyAoZW5kIC0gc3RhcnQpICogZWFzaW5nRnVuYyhwb3NpdGlvbik7XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBBcHBsaWVzIGEgZmlsdGVyIHRvIFR3ZWVuYWJsZSBpbnN0YW5jZS5cclxuICAgKiBAcGFyYW0ge1R3ZWVuYWJsZX0gdHdlZW5hYmxlIFRoZSBgVHdlZW5hYmxlYCBpbnN0YW5jZSB0byBjYWxsIHRoZSBmaWx0ZXJcclxuICAgKiB1cG9uLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmaWx0ZXJOYW1lIFRoZSBuYW1lIG9mIHRoZSBmaWx0ZXIgdG8gYXBwbHkuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYXBwbHlGaWx0ZXIgKHR3ZWVuYWJsZSwgZmlsdGVyTmFtZSkge1xyXG4gICAgdmFyIGZpbHRlcnMgPSBUd2VlbmFibGUucHJvdG90eXBlLmZpbHRlcjtcclxuICAgIHZhciBhcmdzID0gdHdlZW5hYmxlLl9maWx0ZXJBcmdzO1xyXG5cclxuICAgIGVhY2goZmlsdGVycywgZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgaWYgKHR5cGVvZiBmaWx0ZXJzW25hbWVdW2ZpbHRlck5hbWVdICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGZpbHRlcnNbbmFtZV1bZmlsdGVyTmFtZV0uYXBwbHkodHdlZW5hYmxlLCBhcmdzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB2YXIgdGltZW91dEhhbmRsZXJfZW5kVGltZTtcclxuICB2YXIgdGltZW91dEhhbmRsZXJfY3VycmVudFRpbWU7XHJcbiAgdmFyIHRpbWVvdXRIYW5kbGVyX2lzRW5kZWQ7XHJcbiAgLyohXHJcbiAgICogSGFuZGxlcyB0aGUgdXBkYXRlIGxvZ2ljIGZvciBvbmUgc3RlcCBvZiBhIHR3ZWVuLlxyXG4gICAqIEBwYXJhbSB7VHdlZW5hYmxlfSB0d2VlbmFibGVcclxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZXN0YW1wXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGN1cnJlbnRTdGF0ZVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcmlnaW5hbFN0YXRlXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFN0YXRlXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ1xyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHN0ZXBcclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9uKEZ1bmN0aW9uLG51bWJlcil9fSBzY2hlZHVsZVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHRpbWVvdXRIYW5kbGVyICh0d2VlbmFibGUsIHRpbWVzdGFtcCwgZHVyYXRpb24sIGN1cnJlbnRTdGF0ZSxcclxuICAgIG9yaWdpbmFsU3RhdGUsIHRhcmdldFN0YXRlLCBlYXNpbmcsIHN0ZXAsIHNjaGVkdWxlKSB7XHJcbiAgICB0aW1lb3V0SGFuZGxlcl9lbmRUaW1lID0gdGltZXN0YW1wICsgZHVyYXRpb247XHJcbiAgICB0aW1lb3V0SGFuZGxlcl9jdXJyZW50VGltZSA9IE1hdGgubWluKG5vdygpLCB0aW1lb3V0SGFuZGxlcl9lbmRUaW1lKTtcclxuICAgIHRpbWVvdXRIYW5kbGVyX2lzRW5kZWQgPSB0aW1lb3V0SGFuZGxlcl9jdXJyZW50VGltZSA+PSB0aW1lb3V0SGFuZGxlcl9lbmRUaW1lO1xyXG5cclxuICAgIGlmICh0d2VlbmFibGUuaXNQbGF5aW5nKCkgJiYgIXRpbWVvdXRIYW5kbGVyX2lzRW5kZWQpIHtcclxuICAgICAgc2NoZWR1bGUodHdlZW5hYmxlLl90aW1lb3V0SGFuZGxlciwgVVBEQVRFX1RJTUUpO1xyXG5cclxuICAgICAgYXBwbHlGaWx0ZXIodHdlZW5hYmxlLCAnYmVmb3JlVHdlZW4nKTtcclxuICAgICAgdHdlZW5Qcm9wcyh0aW1lb3V0SGFuZGxlcl9jdXJyZW50VGltZSwgY3VycmVudFN0YXRlLCBvcmlnaW5hbFN0YXRlLFxyXG4gICAgICAgIHRhcmdldFN0YXRlLCBkdXJhdGlvbiwgdGltZXN0YW1wLCBlYXNpbmcpO1xyXG4gICAgICBhcHBseUZpbHRlcih0d2VlbmFibGUsICdhZnRlclR3ZWVuJyk7XHJcblxyXG4gICAgICBzdGVwKGN1cnJlbnRTdGF0ZSk7XHJcbiAgICB9IGVsc2UgaWYgKHRpbWVvdXRIYW5kbGVyX2lzRW5kZWQpIHtcclxuICAgICAgc3RlcCh0YXJnZXRTdGF0ZSk7XHJcbiAgICAgIHR3ZWVuYWJsZS5zdG9wKHRydWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8qIVxyXG4gICAqIENyZWF0ZXMgYSB1c2FibGUgZWFzaW5nIE9iamVjdCBmcm9tIGVpdGhlciBhIHN0cmluZyBvciBhbm90aGVyIGVhc2luZ1xyXG4gICAqIE9iamVjdC4gIElmIGBlYXNpbmdgIGlzIGFuIE9iamVjdCwgdGhlbiB0aGlzIGZ1bmN0aW9uIGNsb25lcyBpdCBhbmQgZmlsbHNcclxuICAgKiBpbiB0aGUgbWlzc2luZyBwcm9wZXJ0aWVzIHdpdGggXCJsaW5lYXJcIi5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gZnJvbVR3ZWVuUGFyYW1zXHJcbiAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBlYXNpbmdcclxuICAgKi9cclxuICBmdW5jdGlvbiBjb21wb3NlRWFzaW5nT2JqZWN0IChmcm9tVHdlZW5QYXJhbXMsIGVhc2luZykge1xyXG4gICAgdmFyIGNvbXBvc2VkRWFzaW5nID0ge307XHJcblxyXG4gICAgaWYgKHR5cGVvZiBlYXNpbmcgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIGVhY2goZnJvbVR3ZWVuUGFyYW1zLCBmdW5jdGlvbiAocHJvcCkge1xyXG4gICAgICAgIGNvbXBvc2VkRWFzaW5nW3Byb3BdID0gZWFzaW5nO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVhY2goZnJvbVR3ZWVuUGFyYW1zLCBmdW5jdGlvbiAocHJvcCkge1xyXG4gICAgICAgIGlmICghY29tcG9zZWRFYXNpbmdbcHJvcF0pIHtcclxuICAgICAgICAgIGNvbXBvc2VkRWFzaW5nW3Byb3BdID0gZWFzaW5nW3Byb3BdIHx8IERFRkFVTFRfRUFTSU5HO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvbXBvc2VkRWFzaW5nO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVHdlZW5hYmxlIGNvbnN0cnVjdG9yLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2luaXRpYWxTdGF0ZSBUaGUgdmFsdWVzIHRoYXQgdGhlIGluaXRpYWwgdHdlZW4gc2hvdWxkIHN0YXJ0IGF0IGlmIGEgXCJmcm9tXCIgb2JqZWN0IGlzIG5vdCBwcm92aWRlZCB0byBUd2VlbmFibGUjdHdlZW4uXHJcbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfY29uZmlnIFNlZSBUd2VlbmFibGUucHJvdG90eXBlLnNldENvbmZpZygpXHJcbiAgICogQGNvbnN0cnVjdG9yXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gVHdlZW5hYmxlIChvcHRfaW5pdGlhbFN0YXRlLCBvcHRfY29uZmlnKSB7XHJcbiAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSBvcHRfaW5pdGlhbFN0YXRlIHx8IHt9O1xyXG4gICAgdGhpcy5fY29uZmlndXJlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5fc2NoZWR1bGVGdW5jdGlvbiA9IERFRkFVTFRfU0NIRURVTEVfRlVOQ1RJT047XHJcblxyXG4gICAgLy8gVG8gcHJldmVudCB1bm5lY2Vzc2FyeSBjYWxscyB0byBzZXRDb25maWcgZG8gbm90IHNldCBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gaGVyZS5cclxuICAgIC8vIE9ubHkgc2V0IGRlZmF1bHQgY29uZmlndXJhdGlvbiBpbW1lZGlhdGVseSBiZWZvcmUgdHdlZW5pbmcgaWYgbm9uZSBoYXMgYmVlbiBzZXQuXHJcbiAgICBpZiAodHlwZW9mIG9wdF9jb25maWcgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRoaXMuc2V0Q29uZmlnKG9wdF9jb25maWcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ29uZmlndXJlIGFuZCBzdGFydCBhIHR3ZWVuLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2NvbmZpZyBTZWUgVHdlZW5hYmxlLnByb3RvdHlwZS5zZXRDb25maWcoKVxyXG4gICAqIEByZXR1cm4ge1R3ZWVuYWJsZX1cclxuICAgKi9cclxuICBUd2VlbmFibGUucHJvdG90eXBlLnR3ZWVuID0gZnVuY3Rpb24gKG9wdF9jb25maWcpIHtcclxuICAgIGlmICh0aGlzLl9pc1R3ZWVuaW5nKSB7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9ubHkgc2V0IGRlZmF1bHQgY29uZmlnIGlmIG5vIGNvbmZpZ3VyYXRpb24gaGFzIGJlZW4gc2V0IHByZXZpb3VzbHkgYW5kIG5vbmUgaXMgcHJvdmlkZWQgbm93LlxyXG4gICAgaWYgKG9wdF9jb25maWcgIT09IHVuZGVmaW5lZCB8fCAhdGhpcy5fY29uZmlndXJlZCkge1xyXG4gICAgICB0aGlzLnNldENvbmZpZyhvcHRfY29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9zdGFydCh0aGlzLmdldCgpKTtcclxuICAgIHJldHVybiB0aGlzLnJlc3VtZSgpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIHR3ZWVuIGNvbmZpZ3VyYXRpb24uIGBjb25maWdgIG1heSBoYXZlIHRoZSBmb2xsb3dpbmcgb3B0aW9uczpcclxuICAgKlxyXG4gICAqIC0gX19mcm9tX18gKF9PYmplY3Q9Xyk6IFN0YXJ0aW5nIHBvc2l0aW9uLiAgSWYgb21pdHRlZCwgdGhlIGN1cnJlbnQgc3RhdGUgaXMgdXNlZC5cclxuICAgKiAtIF9fdG9fXyAoX09iamVjdD1fKTogRW5kaW5nIHBvc2l0aW9uLlxyXG4gICAqIC0gX19kdXJhdGlvbl9fIChfbnVtYmVyPV8pOiBIb3cgbWFueSBtaWxsaXNlY29uZHMgdG8gYW5pbWF0ZSBmb3IuXHJcbiAgICogLSBfX3N0YXJ0X18gKF9GdW5jdGlvbihPYmplY3QpPV8pOiBGdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIHR3ZWVuIGJlZ2lucy4gIFJlY2VpdmVzIHRoZSBzdGF0ZSBvZiB0aGUgdHdlZW4gYXMgdGhlIG9ubHkgcGFyYW1ldGVyLlxyXG4gICAqIC0gX19zdGVwX18gKF9GdW5jdGlvbihPYmplY3QpPV8pOiBGdW5jdGlvbiB0byBleGVjdXRlIG9uIGV2ZXJ5IHRpY2suICBSZWNlaXZlcyB0aGUgc3RhdGUgb2YgdGhlIHR3ZWVuIGFzIHRoZSBvbmx5IHBhcmFtZXRlci4gIFRoaXMgZnVuY3Rpb24gaXMgbm90IGNhbGxlZCBvbiB0aGUgZmluYWwgc3RlcCBvZiB0aGUgYW5pbWF0aW9uLCBidXQgYGZpbmlzaGAgaXMuXHJcbiAgICogLSBfX2ZpbmlzaF9fIChfRnVuY3Rpb24oT2JqZWN0KT1fKTogRnVuY3Rpb24gdG8gZXhlY3V0ZSB1cG9uIHR3ZWVuIGNvbXBsZXRpb24uICBSZWNlaXZlcyB0aGUgc3RhdGUgb2YgdGhlIHR3ZWVuIGFzIHRoZSBvbmx5IHBhcmFtZXRlci5cclxuICAgKiAtIF9fZWFzaW5nX18gKF9PYmplY3R8c3RyaW5nPV8pOiBFYXNpbmcgY3VydmUgbmFtZShzKSB0byB1c2UgZm9yIHRoZSB0d2Vlbi5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICogQHJldHVybiB7VHdlZW5hYmxlfVxyXG4gICAqL1xyXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuc2V0Q29uZmlnID0gZnVuY3Rpb24gKGNvbmZpZykge1xyXG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG4gICAgdGhpcy5fY29uZmlndXJlZCA9IHRydWU7XHJcblxyXG4gICAgLy8gSW5pdCB0aGUgaW50ZXJuYWwgc3RhdGVcclxuICAgIHRoaXMuX3BhdXNlZEF0VGltZSA9IG51bGw7XHJcbiAgICB0aGlzLl9zdGFydCA9IGNvbmZpZy5zdGFydCB8fCBub29wO1xyXG4gICAgdGhpcy5fc3RlcCA9IGNvbmZpZy5zdGVwIHx8IG5vb3A7XHJcbiAgICB0aGlzLl9maW5pc2ggPSBjb25maWcuZmluaXNoIHx8IG5vb3A7XHJcbiAgICB0aGlzLl9kdXJhdGlvbiA9IGNvbmZpZy5kdXJhdGlvbiB8fCBERUZBVUxUX0RVUkFUSU9OO1xyXG4gICAgdGhpcy5fY3VycmVudFN0YXRlID0gY29uZmlnLmZyb20gfHwgdGhpcy5nZXQoKTtcclxuICAgIHRoaXMuX29yaWdpbmFsU3RhdGUgPSB0aGlzLmdldCgpO1xyXG4gICAgdGhpcy5fdGFyZ2V0U3RhdGUgPSBjb25maWcudG8gfHwgdGhpcy5nZXQoKTtcclxuICAgIHRoaXMuX3RpbWVzdGFtcCA9IG5vdygpO1xyXG5cclxuICAgIC8vIEFsaWFzZXMgdXNlZCBiZWxvd1xyXG4gICAgdmFyIGN1cnJlbnRTdGF0ZSA9IHRoaXMuX2N1cnJlbnRTdGF0ZTtcclxuICAgIHZhciB0YXJnZXRTdGF0ZSA9IHRoaXMuX3RhcmdldFN0YXRlO1xyXG5cclxuICAgIC8vIEVuc3VyZSB0aGF0IHRoZXJlIGlzIGFsd2F5cyBzb21ldGhpbmcgdG8gdHdlZW4gdG8uXHJcbiAgICBkZWZhdWx0cyh0YXJnZXRTdGF0ZSwgY3VycmVudFN0YXRlKTtcclxuXHJcbiAgICB0aGlzLl9lYXNpbmcgPSBjb21wb3NlRWFzaW5nT2JqZWN0KFxyXG4gICAgICBjdXJyZW50U3RhdGUsIGNvbmZpZy5lYXNpbmcgfHwgREVGQVVMVF9FQVNJTkcpO1xyXG5cclxuICAgIHRoaXMuX2ZpbHRlckFyZ3MgPVxyXG4gICAgICBbY3VycmVudFN0YXRlLCB0aGlzLl9vcmlnaW5hbFN0YXRlLCB0YXJnZXRTdGF0ZSwgdGhpcy5fZWFzaW5nXTtcclxuXHJcbiAgICBhcHBseUZpbHRlcih0aGlzLCAndHdlZW5DcmVhdGVkJyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBjdXJyZW50IHN0YXRlLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH1cclxuICAgKi9cclxuICBUd2VlbmFibGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBzaGFsbG93Q29weSh7fSwgdGhpcy5fY3VycmVudFN0YXRlKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBjdXJyZW50IHN0YXRlLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxyXG4gICAqL1xyXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHN0YXRlKSB7XHJcbiAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSBzdGF0ZTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBQYXVzZXMgYSB0d2Vlbi4gIFBhdXNlZCB0d2VlbnMgY2FuIGJlIHJlc3VtZWQgZnJvbSB0aGUgcG9pbnQgYXQgd2hpY2ggdGhleSB3ZXJlIHBhdXNlZC4gIFRoaXMgaXMgZGlmZmVyZW50IHRoYW4gW2BzdG9wKClgXSgjc3RvcCksIGFzIHRoYXQgbWV0aG9kIGNhdXNlcyBhIHR3ZWVuIHRvIHN0YXJ0IG92ZXIgd2hlbiBpdCBpcyByZXN1bWVkLlxyXG4gICAqIEByZXR1cm4ge1R3ZWVuYWJsZX1cclxuICAgKi9cclxuICBUd2VlbmFibGUucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fcGF1c2VkQXRUaW1lID0gbm93KCk7XHJcbiAgICB0aGlzLl9pc1BhdXNlZCA9IHRydWU7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSZXN1bWVzIGEgcGF1c2VkIHR3ZWVuLlxyXG4gICAqIEByZXR1cm4ge1R3ZWVuYWJsZX1cclxuICAgKi9cclxuICBUd2VlbmFibGUucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLl9pc1BhdXNlZCkge1xyXG4gICAgICB0aGlzLl90aW1lc3RhbXAgKz0gbm93KCkgLSB0aGlzLl9wYXVzZWRBdFRpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5faXNQYXVzZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuX2lzVHdlZW5pbmcgPSB0cnVlO1xyXG5cclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMuX3RpbWVvdXRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aW1lb3V0SGFuZGxlcihzZWxmLCBzZWxmLl90aW1lc3RhbXAsIHNlbGYuX2R1cmF0aW9uLCBzZWxmLl9jdXJyZW50U3RhdGUsXHJcbiAgICAgICAgc2VsZi5fb3JpZ2luYWxTdGF0ZSwgc2VsZi5fdGFyZ2V0U3RhdGUsIHNlbGYuX2Vhc2luZywgc2VsZi5fc3RlcCxcclxuICAgICAgICBzZWxmLl9zY2hlZHVsZUZ1bmN0aW9uKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fdGltZW91dEhhbmRsZXIoKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBTdG9wcyBhbmQgY2FuY2VscyBhIHR3ZWVuLlxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGdvdG9FbmQgSWYgZmFsc2Ugb3Igb21pdHRlZCwgdGhlIHR3ZWVuIGp1c3Qgc3RvcHMgYXQgaXRzIGN1cnJlbnQgc3RhdGUsIGFuZCB0aGUgXCJmaW5pc2hcIiBoYW5kbGVyIGlzIG5vdCBpbnZva2VkLiAgSWYgdHJ1ZSwgdGhlIHR3ZWVuZWQgb2JqZWN0J3MgdmFsdWVzIGFyZSBpbnN0YW50bHkgc2V0IHRvIHRoZSB0YXJnZXQgdmFsdWVzLCBhbmQgXCJmaW5pc2hcIiBpcyBpbnZva2VkLlxyXG4gICAqIEByZXR1cm4ge1R3ZWVuYWJsZX1cclxuICAgKi9cclxuICBUd2VlbmFibGUucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoZ290b0VuZCkge1xyXG4gICAgdGhpcy5faXNUd2VlbmluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5faXNQYXVzZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuX3RpbWVvdXRIYW5kbGVyID0gbm9vcDtcclxuXHJcbiAgICBpZiAoZ290b0VuZCkge1xyXG4gICAgICBzaGFsbG93Q29weSh0aGlzLl9jdXJyZW50U3RhdGUsIHRoaXMuX3RhcmdldFN0YXRlKTtcclxuICAgICAgYXBwbHlGaWx0ZXIodGhpcywgJ2FmdGVyVHdlZW5FbmQnKTtcclxuICAgICAgdGhpcy5fZmluaXNoLmNhbGwodGhpcywgdGhpcy5fY3VycmVudFN0YXRlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgdHdlZW4gaXMgcnVubmluZy5cclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAqL1xyXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuaXNQbGF5aW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2lzVHdlZW5pbmcgJiYgIXRoaXMuX2lzUGF1c2VkO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgYSBjdXN0b20gc2NoZWR1bGUgZnVuY3Rpb24uXHJcbiAgICpcclxuICAgKiBJZiBhIGN1c3RvbSBmdW5jdGlvbiBpcyBub3Qgc2V0IHRoZSBkZWZhdWx0IG9uZSBpcyB1c2VkIFtgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIGlmIGF2YWlsYWJsZSwgb3RoZXJ3aXNlIFtgc2V0VGltZW91dGBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XaW5kb3cuc2V0VGltZW91dCkpLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbihGdW5jdGlvbixudW1iZXIpfSBzY2hlZHVsZUZ1bmN0aW9uIFRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgdG8gc2NoZWR1bGUgdGhlIG5leHQgZnJhbWUgdG8gYmUgcmVuZGVyZWRcclxuICAgKi9cclxuICBUd2VlbmFibGUucHJvdG90eXBlLnNldFNjaGVkdWxlRnVuY3Rpb24gPSBmdW5jdGlvbiAoc2NoZWR1bGVGdW5jdGlvbikge1xyXG4gICAgdGhpcy5fc2NoZWR1bGVGdW5jdGlvbiA9IHNjaGVkdWxlRnVuY3Rpb247XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogYGRlbGV0ZWBzIGFsbCBcIm93blwiIHByb3BlcnRpZXMuICBDYWxsIHRoaXMgd2hlbiB0aGUgYFR3ZWVuYWJsZWAgaW5zdGFuY2UgaXMgbm8gbG9uZ2VyIG5lZWRlZCB0byBmcmVlIG1lbW9yeS5cclxuICAgKi9cclxuICBUd2VlbmFibGUucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHJvcDtcclxuICAgIGZvciAocHJvcCBpbiB0aGlzKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXNbcHJvcF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKiFcclxuICAgKiBGaWx0ZXJzIGFyZSB1c2VkIGZvciB0cmFuc2Zvcm1pbmcgdGhlIHByb3BlcnRpZXMgb2YgYSB0d2VlbiBhdCB2YXJpb3VzXHJcbiAgICogcG9pbnRzIGluIGEgVHdlZW5hYmxlJ3MgbGlmZSBjeWNsZS4gIFNlZSB0aGUgUkVBRE1FIGZvciBtb3JlIGluZm8gb24gdGhpcy5cclxuICAgKi9cclxuICBUd2VlbmFibGUucHJvdG90eXBlLmZpbHRlciA9IHt9O1xyXG5cclxuICAvKiFcclxuICAgKiBUaGlzIG9iamVjdCBjb250YWlucyBhbGwgb2YgdGhlIHR3ZWVucyBhdmFpbGFibGUgdG8gU2hpZnR5LiAgSXQgaXMgZXh0ZW5kaWJsZSAtIHNpbXBseSBhdHRhY2ggcHJvcGVydGllcyB0byB0aGUgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhIE9iamVjdCBmb2xsb3dpbmcgdGhlIHNhbWUgZm9ybWF0IGF0IGxpbmVhci5cclxuICAgKlxyXG4gICAqIGBwb3NgIHNob3VsZCBiZSBhIG5vcm1hbGl6ZWQgYG51bWJlcmAgKGJldHdlZW4gMCBhbmQgMSkuXHJcbiAgICovXHJcbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhID0ge1xyXG4gICAgbGluZWFyOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHJldHVybiBwb3M7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZm9ybXVsYSA9IFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYTtcclxuXHJcbiAgc2hhbGxvd0NvcHkoVHdlZW5hYmxlLCB7XHJcbiAgICAnbm93Jzogbm93XHJcbiAgICAsJ2VhY2gnOiBlYWNoXHJcbiAgICAsJ3R3ZWVuUHJvcHMnOiB0d2VlblByb3BzXHJcbiAgICAsJ3R3ZWVuUHJvcCc6IHR3ZWVuUHJvcFxyXG4gICAgLCdhcHBseUZpbHRlcic6IGFwcGx5RmlsdGVyXHJcbiAgICAsJ3NoYWxsb3dDb3B5Jzogc2hhbGxvd0NvcHlcclxuICAgICwnZGVmYXVsdHMnOiBkZWZhdWx0c1xyXG4gICAgLCdjb21wb3NlRWFzaW5nT2JqZWN0JzogY29tcG9zZUVhc2luZ09iamVjdFxyXG4gIH0pO1xyXG5cclxuICAvLyBgcm9vdGAgaXMgcHJvdmlkZWQgaW4gdGhlIGludHJvL291dHJvIGZpbGVzLlxyXG5cclxuICAvLyBBIGhvb2sgdXNlZCBmb3IgdW5pdCB0ZXN0aW5nLlxyXG4gIGlmICh0eXBlb2YgU0hJRlRZX0RFQlVHX05PVyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgcm9vdC50aW1lb3V0SGFuZGxlciA9IHRpbWVvdXRIYW5kbGVyO1xyXG4gIH1cclxuXHJcbiAgLy8gQm9vdHN0cmFwIFR3ZWVuYWJsZSBhcHByb3ByaWF0ZWx5IGZvciB0aGUgZW52aXJvbm1lbnQuXHJcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgLy8gQ29tbW9uSlNcclxuICAgIG1vZHVsZS5leHBvcnRzID0gVHdlZW5hYmxlO1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAvLyBBTURcclxuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7cmV0dXJuIFR3ZWVuYWJsZTt9KTtcclxuICB9IGVsc2UgaWYgKHR5cGVvZiByb290LlR3ZWVuYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIC8vIEJyb3dzZXI6IE1ha2UgYFR3ZWVuYWJsZWAgZ2xvYmFsbHkgYWNjZXNzaWJsZS5cclxuICAgIHJvb3QuVHdlZW5hYmxlID0gVHdlZW5hYmxlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFR3ZWVuYWJsZTtcclxuXHJcbn0gKCkpO1xyXG5cclxuLyohXHJcbiAqIEFsbCBlcXVhdGlvbnMgYXJlIGFkYXB0ZWQgZnJvbSBUaG9tYXMgRnVjaHMnIFtTY3JpcHR5Ml0oaHR0cHM6Ly9naXRodWIuY29tL21hZHJvYmJ5L3NjcmlwdHkyL2Jsb2IvbWFzdGVyL3NyYy9lZmZlY3RzL3RyYW5zaXRpb25zL3Blbm5lci5qcykuXHJcbiAqXHJcbiAqIEJhc2VkIG9uIEVhc2luZyBFcXVhdGlvbnMgKGMpIDIwMDMgW1JvYmVydCBQZW5uZXJdKGh0dHA6Ly93d3cucm9iZXJ0cGVubmVyLmNvbS8pLCBhbGwgcmlnaHRzIHJlc2VydmVkLiBUaGlzIHdvcmsgaXMgW3N1YmplY3QgdG8gdGVybXNdKGh0dHA6Ly93d3cucm9iZXJ0cGVubmVyLmNvbS9lYXNpbmdfdGVybXNfb2ZfdXNlLmh0bWwpLlxyXG4gKi9cclxuXHJcbi8qIVxyXG4gKiAgVEVSTVMgT0YgVVNFIC0gRUFTSU5HIEVRVUFUSU9OU1xyXG4gKiAgT3BlbiBzb3VyY2UgdW5kZXIgdGhlIEJTRCBMaWNlbnNlLlxyXG4gKiAgRWFzaW5nIEVxdWF0aW9ucyAoYykgMjAwMyBSb2JlcnQgUGVubmVyLCBhbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKi9cclxuXHJcbjsoZnVuY3Rpb24gKCkge1xyXG5cclxuICBUd2VlbmFibGUuc2hhbGxvd0NvcHkoVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhLCB7XHJcbiAgICBlYXNlSW5RdWFkOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHJldHVybiBNYXRoLnBvdyhwb3MsIDIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlT3V0UXVhZDogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gLShNYXRoLnBvdygocG9zIC0gMSksIDIpIC0gMSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VJbk91dFF1YWQ6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLDIpO31cclxuICAgICAgcmV0dXJuIC0wLjUgKiAoKHBvcyAtPSAyKSAqIHBvcyAtIDIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlSW5DdWJpYzogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLCAzKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZU91dEN1YmljOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHJldHVybiAoTWF0aC5wb3coKHBvcyAtIDEpLCAzKSArIDEpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlSW5PdXRDdWJpYzogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsMyk7fVxyXG4gICAgICByZXR1cm4gMC41ICogKE1hdGgucG93KChwb3MgLSAyKSwzKSArIDIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlSW5RdWFydDogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLCA0KTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZU91dFF1YXJ0OiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHJldHVybiAtKE1hdGgucG93KChwb3MgLSAxKSwgNCkgLSAxKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUluT3V0UXVhcnQ6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLDQpO31cclxuICAgICAgcmV0dXJuIC0wLjUgKiAoKHBvcyAtPSAyKSAqIE1hdGgucG93KHBvcywzKSAtIDIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlSW5RdWludDogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLCA1KTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZU91dFF1aW50OiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHJldHVybiAoTWF0aC5wb3coKHBvcyAtIDEpLCA1KSArIDEpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlSW5PdXRRdWludDogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsNSk7fVxyXG4gICAgICByZXR1cm4gMC41ICogKE1hdGgucG93KChwb3MgLSAyKSw1KSArIDIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlSW5TaW5lOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHJldHVybiAtTWF0aC5jb3MocG9zICogKE1hdGguUEkgLyAyKSkgKyAxO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlT3V0U2luZTogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gTWF0aC5zaW4ocG9zICogKE1hdGguUEkgLyAyKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VJbk91dFNpbmU6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgcmV0dXJuICgtMC41ICogKE1hdGguY29zKE1hdGguUEkgKiBwb3MpIC0gMSkpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlSW5FeHBvOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHJldHVybiAocG9zID09PSAwKSA/IDAgOiBNYXRoLnBvdygyLCAxMCAqIChwb3MgLSAxKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VPdXRFeHBvOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHJldHVybiAocG9zID09PSAxKSA/IDEgOiAtTWF0aC5wb3coMiwgLTEwICogcG9zKSArIDE7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VJbk91dEV4cG86IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgaWYgKHBvcyA9PT0gMCkge3JldHVybiAwO31cclxuICAgICAgaWYgKHBvcyA9PT0gMSkge3JldHVybiAxO31cclxuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3coMiwxMCAqIChwb3MgLSAxKSk7fVxyXG4gICAgICByZXR1cm4gMC41ICogKC1NYXRoLnBvdygyLCAtMTAgKiAtLXBvcykgKyAyKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUluQ2lyYzogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gLShNYXRoLnNxcnQoMSAtIChwb3MgKiBwb3MpKSAtIDEpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlT3V0Q2lyYzogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICByZXR1cm4gTWF0aC5zcXJ0KDEgLSBNYXRoLnBvdygocG9zIC0gMSksIDIpKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUluT3V0Q2lyYzogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAtMC41ICogKE1hdGguc3FydCgxIC0gcG9zICogcG9zKSAtIDEpO31cclxuICAgICAgcmV0dXJuIDAuNSAqIChNYXRoLnNxcnQoMSAtIChwb3MgLT0gMikgKiBwb3MpICsgMSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VPdXRCb3VuY2U6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgaWYgKChwb3MpIDwgKDEgLyAyLjc1KSkge1xyXG4gICAgICAgIHJldHVybiAoNy41NjI1ICogcG9zICogcG9zKTtcclxuICAgICAgfSBlbHNlIGlmIChwb3MgPCAoMiAvIDIuNzUpKSB7XHJcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiAocG9zIC09ICgxLjUgLyAyLjc1KSkgKiBwb3MgKyAwLjc1KTtcclxuICAgICAgfSBlbHNlIGlmIChwb3MgPCAoMi41IC8gMi43NSkpIHtcclxuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIChwb3MgLT0gKDIuMjUgLyAyLjc1KSkgKiBwb3MgKyAwLjkzNzUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAoNy41NjI1ICogKHBvcyAtPSAoMi42MjUgLyAyLjc1KSkgKiBwb3MgKyAwLjk4NDM3NSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUluQmFjazogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XHJcbiAgICAgIHJldHVybiAocG9zKSAqIHBvcyAqICgocyArIDEpICogcG9zIC0gcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VPdXRCYWNrOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHZhciBzID0gMS43MDE1ODtcclxuICAgICAgcmV0dXJuIChwb3MgPSBwb3MgLSAxKSAqIHBvcyAqICgocyArIDEpICogcG9zICsgcykgKyAxO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlSW5PdXRCYWNrOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHZhciBzID0gMS43MDE1ODtcclxuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogKHBvcyAqIHBvcyAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHBvcyAtIHMpKTt9XHJcbiAgICAgIHJldHVybiAwLjUgKiAoKHBvcyAtPSAyKSAqIHBvcyAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHBvcyArIHMpICsgMik7XHJcbiAgICB9LFxyXG5cclxuICAgIGVsYXN0aWM6IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgcmV0dXJuIC0xICogTWF0aC5wb3coNCwtOCAqIHBvcykgKiBNYXRoLnNpbigocG9zICogNiAtIDEpICogKDIgKiBNYXRoLlBJKSAvIDIpICsgMTtcclxuICAgIH0sXHJcblxyXG4gICAgc3dpbmdGcm9tVG86IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgdmFyIHMgPSAxLjcwMTU4O1xyXG4gICAgICByZXR1cm4gKChwb3MgLz0gMC41KSA8IDEpID8gMC41ICogKHBvcyAqIHBvcyAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHBvcyAtIHMpKSA6XHJcbiAgICAgICAgICAwLjUgKiAoKHBvcyAtPSAyKSAqIHBvcyAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHBvcyArIHMpICsgMik7XHJcbiAgICB9LFxyXG5cclxuICAgIHN3aW5nRnJvbTogZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XHJcbiAgICAgIHJldHVybiBwb3MgKiBwb3MgKiAoKHMgKyAxKSAqIHBvcyAtIHMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzd2luZ1RvOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHZhciBzID0gMS43MDE1ODtcclxuICAgICAgcmV0dXJuIChwb3MgLT0gMSkgKiBwb3MgKiAoKHMgKyAxKSAqIHBvcyArIHMpICsgMTtcclxuICAgIH0sXHJcblxyXG4gICAgYm91bmNlOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIGlmIChwb3MgPCAoMSAvIDIuNzUpKSB7XHJcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiBwb3MgKiBwb3MpO1xyXG4gICAgICB9IGVsc2UgaWYgKHBvcyA8ICgyIC8gMi43NSkpIHtcclxuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIChwb3MgLT0gKDEuNSAvIDIuNzUpKSAqIHBvcyArIDAuNzUpO1xyXG4gICAgICB9IGVsc2UgaWYgKHBvcyA8ICgyLjUgLyAyLjc1KSkge1xyXG4gICAgICAgIHJldHVybiAoNy41NjI1ICogKHBvcyAtPSAoMi4yNSAvIDIuNzUpKSAqIHBvcyArIDAuOTM3NSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiAocG9zIC09ICgyLjYyNSAvIDIuNzUpKSAqIHBvcyArIDAuOTg0Mzc1KTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBib3VuY2VQYXN0OiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIGlmIChwb3MgPCAoMSAvIDIuNzUpKSB7XHJcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiBwb3MgKiBwb3MpO1xyXG4gICAgICB9IGVsc2UgaWYgKHBvcyA8ICgyIC8gMi43NSkpIHtcclxuICAgICAgICByZXR1cm4gMiAtICg3LjU2MjUgKiAocG9zIC09ICgxLjUgLyAyLjc1KSkgKiBwb3MgKyAwLjc1KTtcclxuICAgICAgfSBlbHNlIGlmIChwb3MgPCAoMi41IC8gMi43NSkpIHtcclxuICAgICAgICByZXR1cm4gMiAtICg3LjU2MjUgKiAocG9zIC09ICgyLjI1IC8gMi43NSkpICogcG9zICsgMC45Mzc1KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gMiAtICg3LjU2MjUgKiAocG9zIC09ICgyLjYyNSAvIDIuNzUpKSAqIHBvcyArIDAuOTg0Mzc1KTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlRnJvbVRvOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcyw0KTt9XHJcbiAgICAgIHJldHVybiAtMC41ICogKChwb3MgLT0gMikgKiBNYXRoLnBvdyhwb3MsMykgLSAyKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUZyb206IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgcmV0dXJuIE1hdGgucG93KHBvcyw0KTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZVRvOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgIHJldHVybiBNYXRoLnBvdyhwb3MsMC4yNSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG59KCkpO1xyXG5cclxuLyohXHJcbiAqIFRoZSBCZXppZXIgbWFnaWMgaW4gdGhpcyBmaWxlIGlzIGFkYXB0ZWQvY29waWVkIGFsbW9zdCB3aG9sZXNhbGUgZnJvbVxyXG4gKiBbU2NyaXB0eTJdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYWRyb2JieS9zY3JpcHR5Mi9ibG9iL21hc3Rlci9zcmMvZWZmZWN0cy90cmFuc2l0aW9ucy9jdWJpYy1iZXppZXIuanMpLFxyXG4gKiB3aGljaCB3YXMgYWRhcHRlZCBmcm9tIEFwcGxlIGNvZGUgKHdoaWNoIHByb2JhYmx5IGNhbWUgZnJvbVxyXG4gKiBbaGVyZV0oaHR0cDovL29wZW5zb3VyY2UuYXBwbGUuY29tL3NvdXJjZS9XZWJDb3JlL1dlYkNvcmUtOTU1LjY2L3BsYXRmb3JtL2dyYXBoaWNzL1VuaXRCZXppZXIuaCkpLlxyXG4gKiBTcGVjaWFsIHRoYW5rcyB0byBBcHBsZSBhbmQgVGhvbWFzIEZ1Y2hzIGZvciBtdWNoIG9mIHRoaXMgY29kZS5cclxuICovXHJcblxyXG4vKiFcclxuICogIENvcHlyaWdodCAoYykgMjAwNiBBcHBsZSBDb21wdXRlciwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiAgUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XHJcbiAqICBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcclxuICpcclxuICogIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcclxuICogIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXHJcbiAqXHJcbiAqICAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXHJcbiAqICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uXHJcbiAqICBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuICpcclxuICogIDMuIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGNvcHlyaWdodCBob2xkZXIocykgbm9yIHRoZSBuYW1lcyBvZiBhbnlcclxuICogIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tXHJcbiAqICB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxyXG4gKlxyXG4gKiAgVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SU1xyXG4gKiAgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLFxyXG4gKiAgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFXHJcbiAqICBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFXHJcbiAqICBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXHJcbiAqICAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XHJcbiAqICBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT05cclxuICogIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXHJcbiAqICAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xyXG4gKiAgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXHJcbiAqL1xyXG47KGZ1bmN0aW9uICgpIHtcclxuICAvLyBwb3J0IG9mIHdlYmtpdCBjdWJpYyBiZXppZXIgaGFuZGxpbmcgYnkgaHR0cDovL3d3dy5uZXR6Z2VzdGEuZGUvZGV2L1xyXG4gIGZ1bmN0aW9uIGN1YmljQmV6aWVyQXRUaW1lKHQscDF4LHAxeSxwMngscDJ5LGR1cmF0aW9uKSB7XHJcbiAgICB2YXIgYXggPSAwLGJ4ID0gMCxjeCA9IDAsYXkgPSAwLGJ5ID0gMCxjeSA9IDA7XHJcbiAgICBmdW5jdGlvbiBzYW1wbGVDdXJ2ZVgodCkge3JldHVybiAoKGF4ICogdCArIGJ4KSAqIHQgKyBjeCkgKiB0O31cclxuICAgIGZ1bmN0aW9uIHNhbXBsZUN1cnZlWSh0KSB7cmV0dXJuICgoYXkgKiB0ICsgYnkpICogdCArIGN5KSAqIHQ7fVxyXG4gICAgZnVuY3Rpb24gc2FtcGxlQ3VydmVEZXJpdmF0aXZlWCh0KSB7cmV0dXJuICgzLjAgKiBheCAqIHQgKyAyLjAgKiBieCkgKiB0ICsgY3g7fVxyXG4gICAgZnVuY3Rpb24gc29sdmVFcHNpbG9uKGR1cmF0aW9uKSB7cmV0dXJuIDEuMCAvICgyMDAuMCAqIGR1cmF0aW9uKTt9XHJcbiAgICBmdW5jdGlvbiBzb2x2ZSh4LGVwc2lsb24pIHtyZXR1cm4gc2FtcGxlQ3VydmVZKHNvbHZlQ3VydmVYKHgsZXBzaWxvbikpO31cclxuICAgIGZ1bmN0aW9uIGZhYnMobikge2lmIChuID49IDApIHtyZXR1cm4gbjt9ZWxzZSB7cmV0dXJuIDAgLSBuO319XHJcbiAgICBmdW5jdGlvbiBzb2x2ZUN1cnZlWCh4LGVwc2lsb24pIHtcclxuICAgICAgdmFyIHQwLHQxLHQyLHgyLGQyLGk7XHJcbiAgICAgIGZvciAodDIgPSB4LCBpID0gMDsgaSA8IDg7IGkrKykge3gyID0gc2FtcGxlQ3VydmVYKHQyKSAtIHg7IGlmIChmYWJzKHgyKSA8IGVwc2lsb24pIHtyZXR1cm4gdDI7fSBkMiA9IHNhbXBsZUN1cnZlRGVyaXZhdGl2ZVgodDIpOyBpZiAoZmFicyhkMikgPCAxZS02KSB7YnJlYWs7fSB0MiA9IHQyIC0geDIgLyBkMjt9XHJcbiAgICAgIHQwID0gMC4wOyB0MSA9IDEuMDsgdDIgPSB4OyBpZiAodDIgPCB0MCkge3JldHVybiB0MDt9IGlmICh0MiA+IHQxKSB7cmV0dXJuIHQxO31cclxuICAgICAgd2hpbGUgKHQwIDwgdDEpIHt4MiA9IHNhbXBsZUN1cnZlWCh0Mik7IGlmIChmYWJzKHgyIC0geCkgPCBlcHNpbG9uKSB7cmV0dXJuIHQyO30gaWYgKHggPiB4Mikge3QwID0gdDI7fWVsc2Uge3QxID0gdDI7fSB0MiA9ICh0MSAtIHQwKSAqIDAuNSArIHQwO31cclxuICAgICAgcmV0dXJuIHQyOyAvLyBGYWlsdXJlLlxyXG4gICAgfVxyXG4gICAgY3ggPSAzLjAgKiBwMXg7IGJ4ID0gMy4wICogKHAyeCAtIHAxeCkgLSBjeDsgYXggPSAxLjAgLSBjeCAtIGJ4OyBjeSA9IDMuMCAqIHAxeTsgYnkgPSAzLjAgKiAocDJ5IC0gcDF5KSAtIGN5OyBheSA9IDEuMCAtIGN5IC0gYnk7XHJcbiAgICByZXR1cm4gc29sdmUodCwgc29sdmVFcHNpbG9uKGR1cmF0aW9uKSk7XHJcbiAgfVxyXG4gIC8qIVxyXG4gICAqICBnZXRDdWJpY0JlemllclRyYW5zaXRpb24oeDEsIHkxLCB4MiwgeTIpIC0+IEZ1bmN0aW9uXHJcbiAgICpcclxuICAgKiAgR2VuZXJhdGVzIGEgdHJhbnNpdGlvbiBlYXNpbmcgZnVuY3Rpb24gdGhhdCBpcyBjb21wYXRpYmxlXHJcbiAgICogIHdpdGggV2ViS2l0J3MgQ1NTIHRyYW5zaXRpb25zIGAtd2Via2l0LXRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uYFxyXG4gICAqICBDU1MgcHJvcGVydHkuXHJcbiAgICpcclxuICAgKiAgVGhlIFczQyBoYXMgbW9yZSBpbmZvcm1hdGlvbiBhYm91dFxyXG4gICAqICA8YSBocmVmPVwiaHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy10cmFuc2l0aW9ucy8jdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb25fdGFnXCI+XHJcbiAgICogIENTUzMgdHJhbnNpdGlvbiB0aW1pbmcgZnVuY3Rpb25zPC9hPi5cclxuICAgKlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0geDFcclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHkxXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSB4MlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0geTJcclxuICAgKiAgQHJldHVybiB7ZnVuY3Rpb259XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZ2V0Q3ViaWNCZXppZXJUcmFuc2l0aW9uICh4MSwgeTEsIHgyLCB5Mikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgcmV0dXJuIGN1YmljQmV6aWVyQXRUaW1lKHBvcyx4MSx5MSx4Mix5MiwxKTtcclxuICAgIH07XHJcbiAgfVxyXG4gIC8vIEVuZCBwb3J0ZWQgY29kZVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgQmV6aWVyIGVhc2luZyBmdW5jdGlvbiBhbmQgYXR0YWNoZXMgaXQgdG8gYFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYWAuICBUaGlzIGZ1bmN0aW9uIGdpdmVzIHlvdSB0b3RhbCBjb250cm9sIG92ZXIgdGhlIGVhc2luZyBjdXJ2ZS4gIE1hdHRoZXcgTGVpbidzIFtDZWFzZXJdKGh0dHA6Ly9tYXR0aGV3bGVpbi5jb20vY2Vhc2VyLykgaXMgYSB1c2VmdWwgdG9vbCBmb3IgdmlzdWFsaXppbmcgdGhlIGN1cnZlcyB5b3UgY2FuIG1ha2Ugd2l0aCB0aGlzIGZ1bmN0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGVhc2luZyBjdXJ2ZS4gIE92ZXJ3cml0ZXMgdGhlIG9sZCBlYXNpbmcgZnVuY3Rpb24gb24gVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhIGlmIGl0IGV4aXN0cy5cclxuICAgKiBAcGFyYW0ge251bWJlcn0geDFcclxuICAgKiBAcGFyYW0ge251bWJlcn0geTFcclxuICAgKiBAcGFyYW0ge251bWJlcn0geDJcclxuICAgKiBAcGFyYW0ge251bWJlcn0geTJcclxuICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gVGhlIGVhc2luZyBmdW5jdGlvbiB0aGF0IHdhcyBhdHRhY2hlZCB0byBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGEuXHJcbiAgICovXHJcbiAgVHdlZW5hYmxlLnNldEJlemllckZ1bmN0aW9uID0gZnVuY3Rpb24gKG5hbWUsIHgxLCB5MSwgeDIsIHkyKSB7XHJcbiAgICB2YXIgY3ViaWNCZXppZXJUcmFuc2l0aW9uID0gZ2V0Q3ViaWNCZXppZXJUcmFuc2l0aW9uKHgxLCB5MSwgeDIsIHkyKTtcclxuICAgIGN1YmljQmV6aWVyVHJhbnNpdGlvbi54MSA9IHgxO1xyXG4gICAgY3ViaWNCZXppZXJUcmFuc2l0aW9uLnkxID0geTE7XHJcbiAgICBjdWJpY0JlemllclRyYW5zaXRpb24ueDIgPSB4MjtcclxuICAgIGN1YmljQmV6aWVyVHJhbnNpdGlvbi55MiA9IHkyO1xyXG5cclxuICAgIHJldHVybiBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGFbbmFtZV0gPSBjdWJpY0JlemllclRyYW5zaXRpb247XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIGBkZWxldGVgcyBhbiBlYXNpbmcgZnVuY3Rpb24gZnJvbSBgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhYC4gIEJlIGNhcmVmdWwgd2l0aCB0aGlzIG1ldGhvZCwgYXMgaXQgYGRlbGV0ZWBzIHdoYXRldmVyIGVhc2luZyBmb3JtdWxhIG1hdGNoZXMgYG5hbWVgICh3aGljaCBtZWFucyB5b3UgY2FuIGRlbGV0ZSBkZWZhdWx0IFNoaWZ0eSBlYXNpbmcgZnVuY3Rpb25zKS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBlYXNpbmcgZnVuY3Rpb24gdG8gZGVsZXRlLlxyXG4gICAqIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gICAqL1xyXG4gIFR3ZWVuYWJsZS51bnNldEJlemllckZ1bmN0aW9uID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgIGRlbGV0ZSBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGFbbmFtZV07XHJcbiAgfTtcclxuXHJcbn0pKCk7XHJcblxyXG47KGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgZnVuY3Rpb24gZ2V0SW50ZXJwb2xhdGVkVmFsdWVzIChcclxuICAgIGZyb20sIGN1cnJlbnQsIHRhcmdldFN0YXRlLCBwb3NpdGlvbiwgZWFzaW5nKSB7XHJcbiAgICByZXR1cm4gVHdlZW5hYmxlLnR3ZWVuUHJvcHMoXHJcbiAgICAgIHBvc2l0aW9uLCBjdXJyZW50LCBmcm9tLCB0YXJnZXRTdGF0ZSwgMSwgMCwgZWFzaW5nKTtcclxuICB9XHJcblxyXG4gIC8vIEZha2UgYSBUd2VlbmFibGUgYW5kIHBhdGNoIHNvbWUgaW50ZXJuYWxzLiAgVGhpcyBhcHByb2FjaCBhbGxvd3MgdXMgdG9cclxuICAvLyBza2lwIHVuZWNjZXNzYXJ5IHByb2Nlc3NpbmcgYW5kIG9iamVjdCByZWNyZWF0aW9uLCBjdXR0aW5nIGRvd24gb24gZ2FyYmFnZVxyXG4gIC8vIGNvbGxlY3Rpb24gcGF1c2VzLlxyXG4gIHZhciBtb2NrVHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xyXG4gIG1vY2tUd2VlbmFibGUuX2ZpbHRlckFyZ3MgPSBbXTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ29tcHV0ZSB0aGUgbWlkcG9pbnQgb2YgdHdvIE9iamVjdHMuICBUaGlzIG1ldGhvZCBlZmZlY3RpdmVseSBjYWxjdWxhdGVzIGEgc3BlY2lmaWMgZnJhbWUgb2YgYW5pbWF0aW9uIHRoYXQgW1R3ZWVuYWJsZSN0d2Vlbl0oc2hpZnR5LmNvcmUuanMuaHRtbCN0d2VlbikgZG9lcyBtYW55IHRpbWVzIG92ZXIgdGhlIGNvdXJzZSBvZiBhIHR3ZWVuLlxyXG4gICAqXHJcbiAgICogRXhhbXBsZTpcclxuICAgKlxyXG4gICAqIGBgYFxyXG4gICAqICB2YXIgaW50ZXJwb2xhdGVkVmFsdWVzID0gVHdlZW5hYmxlLmludGVycG9sYXRlKHtcclxuICAgKiAgICB3aWR0aDogJzEwMHB4JyxcclxuICAgKiAgICBvcGFjaXR5OiAwLFxyXG4gICAqICAgIGNvbG9yOiAnI2ZmZidcclxuICAgKiAgfSwge1xyXG4gICAqICAgIHdpZHRoOiAnMjAwcHgnLFxyXG4gICAqICAgIG9wYWNpdHk6IDEsXHJcbiAgICogICAgY29sb3I6ICcjMDAwJ1xyXG4gICAqICB9LCAwLjUpO1xyXG4gICAqXHJcbiAgICogIGNvbnNvbGUubG9nKGludGVycG9sYXRlZFZhbHVlcyk7XHJcbiAgICogIC8vIHtvcGFjaXR5OiAwLjUsIHdpZHRoOiBcIjE1MHB4XCIsIGNvbG9yOiBcInJnYigxMjcsMTI3LDEyNylcIn1cclxuICAgKiBgYGBcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tIFRoZSBzdGFydGluZyB2YWx1ZXMgdG8gdHdlZW4gZnJvbS5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0U3RhdGUgVGhlIGVuZGluZyB2YWx1ZXMgdG8gdHdlZW4gdG8uXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIFRoZSBub3JtYWxpemVkIHBvc2l0aW9uIHZhbHVlIChiZXR3ZWVuIDAuMCBhbmQgMS4wKSB0byBpbnRlcnBvbGF0ZSB0aGUgdmFsdWVzIGJldHdlZW4gYGZyb21gIGFuZCBgdG9gIGZvci4gIGBmcm9tYCByZXByZXNlbnRzIDAgYW5kIGB0b2AgcmVwcmVzZW50cyBgMWAuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fSBlYXNpbmcgVGhlIGVhc2luZyBjdXJ2ZShzKSB0byBjYWxjdWxhdGUgdGhlIG1pZHBvaW50IGFnYWluc3QuICBZb3UgY2FuIHJlZmVyZW5jZSBhbnkgZWFzaW5nIGZ1bmN0aW9uIGF0dGFjaGVkIHRvIGBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGFgLiAgSWYgb21pdHRlZCwgdGhpcyBkZWZhdWx0cyB0byBcImxpbmVhclwiLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH1cclxuICAgKi9cclxuICBUd2VlbmFibGUuaW50ZXJwb2xhdGUgPSBmdW5jdGlvbiAoZnJvbSwgdGFyZ2V0U3RhdGUsIHBvc2l0aW9uLCBlYXNpbmcpIHtcclxuICAgIHZhciBjdXJyZW50ID0gVHdlZW5hYmxlLnNoYWxsb3dDb3B5KHt9LCBmcm9tKTtcclxuICAgIHZhciBlYXNpbmdPYmplY3QgPSBUd2VlbmFibGUuY29tcG9zZUVhc2luZ09iamVjdChcclxuICAgICAgZnJvbSwgZWFzaW5nIHx8ICdsaW5lYXInKTtcclxuXHJcbiAgICBtb2NrVHdlZW5hYmxlLnNldCh7fSk7XHJcblxyXG4gICAgLy8gQWxpYXMgYW5kIHJldXNlIHRoZSBfZmlsdGVyQXJncyBhcnJheSBpbnN0ZWFkIG9mIHJlY3JlYXRpbmcgaXQuXHJcbiAgICB2YXIgZmlsdGVyQXJncyA9IG1vY2tUd2VlbmFibGUuX2ZpbHRlckFyZ3M7XHJcbiAgICBmaWx0ZXJBcmdzLmxlbmd0aCA9IDA7XHJcbiAgICBmaWx0ZXJBcmdzWzBdID0gY3VycmVudDtcclxuICAgIGZpbHRlckFyZ3NbMV0gPSBmcm9tO1xyXG4gICAgZmlsdGVyQXJnc1syXSA9IHRhcmdldFN0YXRlO1xyXG4gICAgZmlsdGVyQXJnc1szXSA9IGVhc2luZ09iamVjdDtcclxuXHJcbiAgICAvLyBBbnkgZGVmaW5lZCB2YWx1ZSB0cmFuc2Zvcm1hdGlvbiBtdXN0IGJlIGFwcGxpZWRcclxuICAgIFR3ZWVuYWJsZS5hcHBseUZpbHRlcihtb2NrVHdlZW5hYmxlLCAndHdlZW5DcmVhdGVkJyk7XHJcbiAgICBUd2VlbmFibGUuYXBwbHlGaWx0ZXIobW9ja1R3ZWVuYWJsZSwgJ2JlZm9yZVR3ZWVuJyk7XHJcblxyXG4gICAgdmFyIGludGVycG9sYXRlZFZhbHVlcyA9IGdldEludGVycG9sYXRlZFZhbHVlcyhcclxuICAgICAgZnJvbSwgY3VycmVudCwgdGFyZ2V0U3RhdGUsIHBvc2l0aW9uLCBlYXNpbmdPYmplY3QpO1xyXG5cclxuICAgIC8vIFRyYW5zZm9ybSB2YWx1ZXMgYmFjayBpbnRvIHRoZWlyIG9yaWdpbmFsIGZvcm1hdFxyXG4gICAgVHdlZW5hYmxlLmFwcGx5RmlsdGVyKG1vY2tUd2VlbmFibGUsICdhZnRlclR3ZWVuJyk7XHJcblxyXG4gICAgcmV0dXJuIGludGVycG9sYXRlZFZhbHVlcztcclxuICB9O1xyXG5cclxufSgpKTtcclxuXHJcbi8qKlxyXG4gKiBBZGRzIHN0cmluZyBpbnRlcnBvbGF0aW9uIHN1cHBvcnQgdG8gU2hpZnR5LlxyXG4gKlxyXG4gKiBUaGUgVG9rZW4gZXh0ZW5zaW9uIGFsbG93cyBTaGlmdHkgdG8gdHdlZW4gbnVtYmVycyBpbnNpZGUgb2Ygc3RyaW5ncy4gIEFtb25nIG90aGVyIHRoaW5ncywgdGhpcyBhbGxvd3MgeW91IHRvIGFuaW1hdGUgQ1NTIHByb3BlcnRpZXMuICBGb3IgZXhhbXBsZSwgeW91IGNhbiBkbyB0aGlzOlxyXG4gKlxyXG4gKiBgYGBcclxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcclxuICogdHdlZW5hYmxlLnR3ZWVuKHtcclxuICogICBmcm9tOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoNDVweCknfSxcclxuICogICB0bzogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDkweHApJ31cclxuICogfSk7XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBgdHJhbnNsYXRlWCg0NSlgIHdpbGwgYmUgdHdlZW5lZCB0byBgdHJhbnNsYXRlWCg5MClgLiAgVG8gZGVtb25zdHJhdGU6XHJcbiAqXHJcbiAqIGBgYFxyXG4gKiB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xyXG4gKiB0d2VlbmFibGUudHdlZW4oe1xyXG4gKiAgIGZyb206IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg0NXB4KSd9LFxyXG4gKiAgIHRvOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoOTBweCknfSxcclxuICogICBzdGVwOiBmdW5jdGlvbiAoc3RhdGUpIHtcclxuICogICAgIGNvbnNvbGUubG9nKHN0YXRlLnRyYW5zZm9ybSk7XHJcbiAqICAgfVxyXG4gKiB9KTtcclxuICogYGBgXHJcbiAqXHJcbiAqIFRoZSBhYm92ZSBzbmlwcGV0IHdpbGwgbG9nIHNvbWV0aGluZyBsaWtlIHRoaXMgaW4gdGhlIGNvbnNvbGU6XHJcbiAqXHJcbiAqIGBgYFxyXG4gKiB0cmFuc2xhdGVYKDYwLjNweClcclxuICogLi4uXHJcbiAqIHRyYW5zbGF0ZVgoNzYuMDVweClcclxuICogLi4uXHJcbiAqIHRyYW5zbGF0ZVgoOTBweClcclxuICogYGBgXHJcbiAqXHJcbiAqIEFub3RoZXIgdXNlIGZvciB0aGlzIGlzIGFuaW1hdGluZyBjb2xvcnM6XHJcbiAqXHJcbiAqIGBgYFxyXG4gKiB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xyXG4gKiB0d2VlbmFibGUudHdlZW4oe1xyXG4gKiAgIGZyb206IHsgY29sb3I6ICdyZ2IoMCwyNTUsMCknfSxcclxuICogICB0bzogeyBjb2xvcjogJ3JnYigyNTUsMCwyNTUpJ30sXHJcbiAqICAgc3RlcDogZnVuY3Rpb24gKHN0YXRlKSB7XHJcbiAqICAgICBjb25zb2xlLmxvZyhzdGF0ZS5jb2xvcik7XHJcbiAqICAgfVxyXG4gKiB9KTtcclxuICogYGBgXHJcbiAqXHJcbiAqIFRoZSBhYm92ZSBzbmlwcGV0IHdpbGwgbG9nIHNvbWV0aGluZyBsaWtlIHRoaXM6XHJcbiAqXHJcbiAqIGBgYFxyXG4gKiByZ2IoODQsMTcwLDg0KVxyXG4gKiAuLi5cclxuICogcmdiKDE3MCw4NCwxNzApXHJcbiAqIC4uLlxyXG4gKiByZ2IoMjU1LDAsMjU1KVxyXG4gKiBgYGBcclxuICpcclxuICogVGhpcyBleHRlbnNpb24gYWxzbyBzdXBwb3J0cyBoZXhhZGVjaW1hbCBjb2xvcnMsIGluIGJvdGggbG9uZyAoYCNmZjAwZmZgKSBhbmQgc2hvcnQgKGAjZjBmYCkgZm9ybXMuICBCZSBhd2FyZSB0aGF0IGhleGFkZWNpbWFsIGlucHV0IHZhbHVlcyB3aWxsIGJlIGNvbnZlcnRlZCBpbnRvIHRoZSBlcXVpdmFsZW50IFJHQiBvdXRwdXQgdmFsdWVzLiAgVGhpcyBpcyBkb25lIHRvIG9wdGltaXplIGZvciBwZXJmb3JtYW5jZS5cclxuICpcclxuICogYGBgXHJcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XHJcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XHJcbiAqICAgZnJvbTogeyBjb2xvcjogJyMwZjAnfSxcclxuICogICB0bzogeyBjb2xvcjogJyNmMGYnfSxcclxuICogICBzdGVwOiBmdW5jdGlvbiAoc3RhdGUpIHtcclxuICogICAgIGNvbnNvbGUubG9nKHN0YXRlLmNvbG9yKTtcclxuICogICB9XHJcbiAqIH0pO1xyXG4gKiBgYGBcclxuICpcclxuICogVGhpcyBzbmlwcGV0IHdpbGwgZ2VuZXJhdGUgdGhlIHNhbWUgb3V0cHV0IGFzIHRoZSBvbmUgYmVmb3JlIGl0IGJlY2F1c2UgZXF1aXZhbGVudCB2YWx1ZXMgd2VyZSBzdXBwbGllZCAoanVzdCBpbiBoZXhhZGVjaW1hbCBmb3JtIHJhdGhlciB0aGFuIFJHQik6XHJcbiAqXHJcbiAqIGBgYFxyXG4gKiByZ2IoODQsMTcwLDg0KVxyXG4gKiAuLi5cclxuICogcmdiKDE3MCw4NCwxNzApXHJcbiAqIC4uLlxyXG4gKiByZ2IoMjU1LDAsMjU1KVxyXG4gKiBgYGBcclxuICpcclxuICogIyMgRWFzaW5nIHN1cHBvcnRcclxuICpcclxuICogRWFzaW5nIHdvcmtzIHNvbWV3aGF0IGRpZmZlcmVudGx5IGluIHRoZSBUb2tlbiBleHRlbnNpb24uICBUaGlzIGlzIGJlY2F1c2Ugc29tZSBDU1MgcHJvcGVydGllcyBoYXZlIG11bHRpcGxlIHZhbHVlcyBpbiB0aGVtLCBhbmQgeW91IG1pZ2h0IG5lZWQgdG8gdHdlZW4gZWFjaCB2YWx1ZSBhbG9uZyBpdHMgb3duIGVhc2luZyBjdXJ2ZS4gIEEgYmFzaWMgZXhhbXBsZTpcclxuICpcclxuICogYGBgXHJcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XHJcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XHJcbiAqICAgZnJvbTogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCkgdHJhbnNsYXRlWSgwcHgpJ30sXHJcbiAqICAgdG86IHsgdHJhbnNmb3JtOiAgICd0cmFuc2xhdGVYKDEwMHB4KSB0cmFuc2xhdGVZKDEwMHB4KSd9LFxyXG4gKiAgIGVhc2luZzogeyB0cmFuc2Zvcm06ICdlYXNlSW5RdWFkJyB9LFxyXG4gKiAgIHN0ZXA6IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gKiAgICAgY29uc29sZS5sb2coc3RhdGUudHJhbnNmb3JtKTtcclxuICogICB9XHJcbiAqIH0pO1xyXG4gKiBgYGBcclxuICpcclxuICogVGhlIGFib3ZlIHNuaXBwZXQgY3JlYXRlIHZhbHVlcyBsaWtlIHRoaXM6XHJcbiAqXHJcbiAqIGBgYFxyXG4gKiB0cmFuc2xhdGVYKDExLjU2MDAwMDAwMDAwMDAwMnB4KSB0cmFuc2xhdGVZKDExLjU2MDAwMDAwMDAwMDAwMnB4KVxyXG4gKiAuLi5cclxuICogdHJhbnNsYXRlWCg0Ni4yNDAwMDAwMDAwMDAwMXB4KSB0cmFuc2xhdGVZKDQ2LjI0MDAwMDAwMDAwMDAxcHgpXHJcbiAqIC4uLlxyXG4gKiB0cmFuc2xhdGVYKDEwMHB4KSB0cmFuc2xhdGVZKDEwMHB4KVxyXG4gKiBgYGBcclxuICpcclxuICogSW4gdGhpcyBjYXNlLCB0aGUgdmFsdWVzIGZvciBgdHJhbnNsYXRlWGAgYW5kIGB0cmFuc2xhdGVZYCBhcmUgYWx3YXlzIHRoZSBzYW1lIGZvciBlYWNoIHN0ZXAgb2YgdGhlIHR3ZWVuLCBiZWNhdXNlIHRoZXkgaGF2ZSB0aGUgc2FtZSBzdGFydCBhbmQgZW5kIHBvaW50cyBhbmQgYm90aCB1c2UgdGhlIHNhbWUgZWFzaW5nIGN1cnZlLiAgV2UgY2FuIGFsc28gdHdlZW4gYHRyYW5zbGF0ZVhgIGFuZCBgdHJhbnNsYXRlWWAgYWxvbmcgaW5kZXBlbmRlbnQgY3VydmVzOlxyXG4gKlxyXG4gKiBgYGBcclxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcclxuICogdHdlZW5hYmxlLnR3ZWVuKHtcclxuICogICBmcm9tOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMHB4KSB0cmFuc2xhdGVZKDBweCknfSxcclxuICogICB0bzogeyB0cmFuc2Zvcm06ICAgJ3RyYW5zbGF0ZVgoMTAwcHgpIHRyYW5zbGF0ZVkoMTAwcHgpJ30sXHJcbiAqICAgZWFzaW5nOiB7IHRyYW5zZm9ybTogJ2Vhc2VJblF1YWQgYm91bmNlJyB9LFxyXG4gKiAgIHN0ZXA6IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gKiAgICAgY29uc29sZS5sb2coc3RhdGUudHJhbnNmb3JtKTtcclxuICogICB9XHJcbiAqIH0pO1xyXG4gKiBgYGBcclxuICpcclxuICogVGhlIGFib3ZlIHNuaXBwZXQgY3JlYXRlIHZhbHVlcyBsaWtlIHRoaXM6XHJcbiAqXHJcbiAqIGBgYFxyXG4gKiB0cmFuc2xhdGVYKDEwLjg5cHgpIHRyYW5zbGF0ZVkoODIuMzU1NjI1cHgpXHJcbiAqIC4uLlxyXG4gKiB0cmFuc2xhdGVYKDQ0Ljg5MDAwMDAwMDAwMDAxcHgpIHRyYW5zbGF0ZVkoODYuNzMwNjI1MDAwMDAwMDJweClcclxuICogLi4uXHJcbiAqIHRyYW5zbGF0ZVgoMTAwcHgpIHRyYW5zbGF0ZVkoMTAwcHgpXHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBgdHJhbnNsYXRlWGAgYW5kIGB0cmFuc2xhdGVZYCBhcmUgbm90IGluIHN5bmMgYW55bW9yZSwgYmVjYXVzZSBgZWFzZUluUXVhZGAgd2FzIHNwZWNpZmllZCBmb3IgYHRyYW5zbGF0ZVhgIGFuZCBgYm91bmNlYCBmb3IgYHRyYW5zbGF0ZVlgLiAgTWl4aW5nIGFuZCBtYXRjaGluZyBlYXNpbmcgY3VydmVzIGNhbiBtYWtlIGZvciBzb21lIGludGVyZXN0aW5nIG1vdGlvbiBpbiB5b3VyIGFuaW1hdGlvbnMuXHJcbiAqXHJcbiAqIFRoZSBvcmRlciBvZiB0aGUgc3BhY2Utc2VwYXJhdGVkIGVhc2luZyBjdXJ2ZXMgY29ycmVzcG9uZCB0aGUgdG9rZW4gdmFsdWVzIHRoZXkgYXBwbHkgdG8uICBJZiB0aGVyZSBhcmUgbW9yZSB0b2tlbiB2YWx1ZXMgdGhhbiBlYXNpbmcgY3VydmVzIGxpc3RlZCwgdGhlIGxhc3QgZWFzaW5nIGN1cnZlIGxpc3RlZCBpcyB1c2VkLlxyXG4gKi9cclxuZnVuY3Rpb24gdG9rZW4gKCkge1xyXG4gIC8vIEZ1bmN0aW9uYWxpdHkgZm9yIHRoaXMgZXh0ZW5zaW9uIHJ1bnMgaW1wbGljaXRseSBpZiBpdCBpcyBsb2FkZWQuXHJcbn0gLyohKi9cclxuXHJcbi8vIHRva2VuIGZ1bmN0aW9uIGlzIGRlZmluZWQgYWJvdmUgb25seSBzbyB0aGF0IGRveC1mb3VuZGF0aW9uIHNlZXMgaXQgYXNcclxuLy8gZG9jdW1lbnRhdGlvbiBhbmQgcmVuZGVycyBpdC4gIEl0IGlzIG5ldmVyIHVzZWQsIGFuZCBpcyBvcHRpbWl6ZWQgYXdheSBhdFxyXG4vLyBidWlsZCB0aW1lLlxyXG5cclxuOyhmdW5jdGlvbiAoVHdlZW5hYmxlKSB7XHJcblxyXG4gIC8qIVxyXG4gICAqIEB0eXBlZGVmIHt7XHJcbiAgICogICBmb3JtYXRTdHJpbmc6IHN0cmluZ1xyXG4gICAqICAgY2h1bmtOYW1lczogQXJyYXkuPHN0cmluZz5cclxuICAgKiB9fVxyXG4gICAqL1xyXG4gIHZhciBmb3JtYXRNYW5pZmVzdDtcclxuXHJcbiAgLy8gQ09OU1RBTlRTXHJcblxyXG4gIHZhciBSX05VTUJFUl9DT01QT05FTlQgPSAvKFxcZHxcXC18XFwuKS87XHJcbiAgdmFyIFJfRk9STUFUX0NIVU5LUyA9IC8oW15cXC0wLTlcXC5dKykvZztcclxuICB2YXIgUl9VTkZPUk1BVFRFRF9WQUxVRVMgPSAvWzAtOS5cXC1dKy9nO1xyXG4gIHZhciBSX1JHQiA9IG5ldyBSZWdFeHAoXHJcbiAgICAncmdiXFxcXCgnICsgUl9VTkZPUk1BVFRFRF9WQUxVRVMuc291cmNlICtcclxuICAgICgvLFxccyovLnNvdXJjZSkgKyBSX1VORk9STUFUVEVEX1ZBTFVFUy5zb3VyY2UgK1xyXG4gICAgKC8sXFxzKi8uc291cmNlKSArIFJfVU5GT1JNQVRURURfVkFMVUVTLnNvdXJjZSArICdcXFxcKScsICdnJyk7XHJcbiAgdmFyIFJfUkdCX1BSRUZJWCA9IC9eLipcXCgvO1xyXG4gIHZhciBSX0hFWCA9IC8jKFswLTldfFthLWZdKXszLDZ9L2dpO1xyXG4gIHZhciBWQUxVRV9QTEFDRUhPTERFUiA9ICdWQUwnO1xyXG5cclxuICAvLyBIRUxQRVJTXHJcblxyXG4gIHZhciBnZXRGb3JtYXRDaHVua3NGcm9tX2FjY3VtdWxhdG9yID0gW107XHJcbiAgLyohXHJcbiAgICogQHBhcmFtIHtBcnJheS5udW1iZXJ9IHJhd1ZhbHVlc1xyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcmVmaXhcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGdldEZvcm1hdENodW5rc0Zyb20gKHJhd1ZhbHVlcywgcHJlZml4KSB7XHJcbiAgICBnZXRGb3JtYXRDaHVua3NGcm9tX2FjY3VtdWxhdG9yLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgdmFyIHJhd1ZhbHVlc0xlbmd0aCA9IHJhd1ZhbHVlcy5sZW5ndGg7XHJcbiAgICB2YXIgaTtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgcmF3VmFsdWVzTGVuZ3RoOyBpKyspIHtcclxuICAgICAgZ2V0Rm9ybWF0Q2h1bmtzRnJvbV9hY2N1bXVsYXRvci5wdXNoKCdfJyArIHByZWZpeCArICdfJyArIGkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBnZXRGb3JtYXRDaHVua3NGcm9tX2FjY3VtdWxhdG9yO1xyXG4gIH1cclxuXHJcbiAgLyohXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdHRlZFN0cmluZ1xyXG4gICAqXHJcbiAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGdldEZvcm1hdFN0cmluZ0Zyb20gKGZvcm1hdHRlZFN0cmluZykge1xyXG4gICAgdmFyIGNodW5rcyA9IGZvcm1hdHRlZFN0cmluZy5tYXRjaChSX0ZPUk1BVF9DSFVOS1MpO1xyXG5cclxuICAgIGlmICghY2h1bmtzKSB7XHJcbiAgICAgIC8vIGNodW5rcyB3aWxsIGJlIG51bGwgaWYgdGhlcmUgd2VyZSBubyB0b2tlbnMgdG8gcGFyc2UgaW5cclxuICAgICAgLy8gZm9ybWF0dGVkU3RyaW5nIChmb3IgZXhhbXBsZSwgaWYgZm9ybWF0dGVkU3RyaW5nIGlzICcyJykuICBDb2VyY2VcclxuICAgICAgLy8gY2h1bmtzIHRvIGJlIHVzZWZ1bCBoZXJlLlxyXG4gICAgICBjaHVua3MgPSBbJycsICcnXTtcclxuXHJcbiAgICAgIC8vIElmIHRoZXJlIGlzIG9ubHkgb25lIGNodW5rLCBhc3N1bWUgdGhhdCB0aGUgc3RyaW5nIGlzIGEgbnVtYmVyXHJcbiAgICAgIC8vIGZvbGxvd2VkIGJ5IGEgdG9rZW4uLi5cclxuICAgICAgLy8gTk9URTogVGhpcyBtYXkgYmUgYW4gdW53aXNlIGFzc3VtcHRpb24uXHJcbiAgICB9IGVsc2UgaWYgKGNodW5rcy5sZW5ndGggPT09IDEgfHxcclxuICAgICAgICAvLyAuLi5vciBpZiB0aGUgc3RyaW5nIHN0YXJ0cyB3aXRoIGEgbnVtYmVyIGNvbXBvbmVudCAoXCIuXCIsIFwiLVwiLCBvciBhXHJcbiAgICAgICAgLy8gZGlnaXQpLi4uXHJcbiAgICAgICAgZm9ybWF0dGVkU3RyaW5nWzBdLm1hdGNoKFJfTlVNQkVSX0NPTVBPTkVOVCkpIHtcclxuICAgICAgLy8gLi4ucHJlcGVuZCBhbiBlbXB0eSBzdHJpbmcgaGVyZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgZm9ybWF0dGVkIG51bWJlclxyXG4gICAgICAvLyBpcyBwcm9wZXJseSByZXBsYWNlZCBieSBWQUxVRV9QTEFDRUhPTERFUlxyXG4gICAgICBjaHVua3MudW5zaGlmdCgnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNodW5rcy5qb2luKFZBTFVFX1BMQUNFSE9MREVSKTtcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIENvbnZlcnQgYWxsIGhleCBjb2xvciB2YWx1ZXMgd2l0aGluIGEgc3RyaW5nIHRvIGFuIHJnYiBzdHJpbmcuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIG1vZGlmaWVkIG9ialxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHNhbml0aXplT2JqZWN0Rm9ySGV4UHJvcHMgKHN0YXRlT2JqZWN0KSB7XHJcbiAgICBUd2VlbmFibGUuZWFjaChzdGF0ZU9iamVjdCwgZnVuY3Rpb24gKHByb3ApIHtcclxuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gc3RhdGVPYmplY3RbcHJvcF07XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGN1cnJlbnRQcm9wID09PSAnc3RyaW5nJyAmJiBjdXJyZW50UHJvcC5tYXRjaChSX0hFWCkpIHtcclxuICAgICAgICBzdGF0ZU9iamVjdFtwcm9wXSA9IHNhbml0aXplSGV4Q2h1bmtzVG9SR0IoY3VycmVudFByb3ApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge3N0cmluZ31cclxuICAgKi9cclxuICBmdW5jdGlvbiAgc2FuaXRpemVIZXhDaHVua3NUb1JHQiAoc3RyKSB7XHJcbiAgICByZXR1cm4gZmlsdGVyU3RyaW5nQ2h1bmtzKFJfSEVYLCBzdHIsIGNvbnZlcnRIZXhUb1JHQik7XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGV4U3RyaW5nXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY29udmVydEhleFRvUkdCIChoZXhTdHJpbmcpIHtcclxuICAgIHZhciByZ2JBcnIgPSBoZXhUb1JHQkFycmF5KGhleFN0cmluZyk7XHJcbiAgICByZXR1cm4gJ3JnYignICsgcmdiQXJyWzBdICsgJywnICsgcmdiQXJyWzFdICsgJywnICsgcmdiQXJyWzJdICsgJyknO1xyXG4gIH1cclxuXHJcbiAgdmFyIGhleFRvUkdCQXJyYXlfcmV0dXJuQXJyYXkgPSBbXTtcclxuICAvKiFcclxuICAgKiBDb252ZXJ0IGEgaGV4YWRlY2ltYWwgc3RyaW5nIHRvIGFuIGFycmF5IHdpdGggdGhyZWUgaXRlbXMsIG9uZSBlYWNoIGZvclxyXG4gICAqIHRoZSByZWQsIGJsdWUsIGFuZCBncmVlbiBkZWNpbWFsIHZhbHVlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBoZXggQSBoZXhhZGVjaW1hbCBzdHJpbmcuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7QXJyYXkuPG51bWJlcj59IFRoZSBjb252ZXJ0ZWQgQXJyYXkgb2YgUkdCIHZhbHVlcyBpZiBgaGV4YCBpcyBhXHJcbiAgICogdmFsaWQgc3RyaW5nLCBvciBhbiBBcnJheSBvZiB0aHJlZSAwJ3MuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gaGV4VG9SR0JBcnJheSAoaGV4KSB7XHJcblxyXG4gICAgaGV4ID0gaGV4LnJlcGxhY2UoLyMvLCAnJyk7XHJcblxyXG4gICAgLy8gSWYgdGhlIHN0cmluZyBpcyBhIHNob3J0aGFuZCB0aHJlZSBkaWdpdCBoZXggbm90YXRpb24sIG5vcm1hbGl6ZSBpdCB0b1xyXG4gICAgLy8gdGhlIHN0YW5kYXJkIHNpeCBkaWdpdCBub3RhdGlvblxyXG4gICAgaWYgKGhleC5sZW5ndGggPT09IDMpIHtcclxuICAgICAgaGV4ID0gaGV4LnNwbGl0KCcnKTtcclxuICAgICAgaGV4ID0gaGV4WzBdICsgaGV4WzBdICsgaGV4WzFdICsgaGV4WzFdICsgaGV4WzJdICsgaGV4WzJdO1xyXG4gICAgfVxyXG5cclxuICAgIGhleFRvUkdCQXJyYXlfcmV0dXJuQXJyYXlbMF0gPSBoZXhUb0RlYyhoZXguc3Vic3RyKDAsIDIpKTtcclxuICAgIGhleFRvUkdCQXJyYXlfcmV0dXJuQXJyYXlbMV0gPSBoZXhUb0RlYyhoZXguc3Vic3RyKDIsIDIpKTtcclxuICAgIGhleFRvUkdCQXJyYXlfcmV0dXJuQXJyYXlbMl0gPSBoZXhUb0RlYyhoZXguc3Vic3RyKDQsIDIpKTtcclxuXHJcbiAgICByZXR1cm4gaGV4VG9SR0JBcnJheV9yZXR1cm5BcnJheTtcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIENvbnZlcnQgYSBiYXNlLTE2IG51bWJlciB0byBiYXNlLTEwLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBoZXggVGhlIHZhbHVlIHRvIGNvbnZlcnRcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBiYXNlLTEwIGVxdWl2YWxlbnQgb2YgYGhleGAuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gaGV4VG9EZWMgKGhleCkge1xyXG4gICAgcmV0dXJuIHBhcnNlSW50KGhleCwgMTYpO1xyXG4gIH1cclxuXHJcbiAgLyohXHJcbiAgICogUnVucyBhIGZpbHRlciBvcGVyYXRpb24gb24gYWxsIGNodW5rcyBvZiBhIHN0cmluZyB0aGF0IG1hdGNoIGEgUmVnRXhwXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1JlZ0V4cH0gcGF0dGVyblxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1bmZpbHRlcmVkU3RyaW5nXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihzdHJpbmcpfSBmaWx0ZXJcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge3N0cmluZ31cclxuICAgKi9cclxuICBmdW5jdGlvbiBmaWx0ZXJTdHJpbmdDaHVua3MgKHBhdHRlcm4sIHVuZmlsdGVyZWRTdHJpbmcsIGZpbHRlcikge1xyXG4gICAgdmFyIHBhdHRlbk1hdGNoZXMgPSB1bmZpbHRlcmVkU3RyaW5nLm1hdGNoKHBhdHRlcm4pO1xyXG4gICAgdmFyIGZpbHRlcmVkU3RyaW5nID0gdW5maWx0ZXJlZFN0cmluZy5yZXBsYWNlKHBhdHRlcm4sIFZBTFVFX1BMQUNFSE9MREVSKTtcclxuXHJcbiAgICBpZiAocGF0dGVuTWF0Y2hlcykge1xyXG4gICAgICB2YXIgcGF0dGVuTWF0Y2hlc0xlbmd0aCA9IHBhdHRlbk1hdGNoZXMubGVuZ3RoO1xyXG4gICAgICB2YXIgY3VycmVudENodW5rO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXR0ZW5NYXRjaGVzTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjdXJyZW50Q2h1bmsgPSBwYXR0ZW5NYXRjaGVzLnNoaWZ0KCk7XHJcbiAgICAgICAgZmlsdGVyZWRTdHJpbmcgPSBmaWx0ZXJlZFN0cmluZy5yZXBsYWNlKFxyXG4gICAgICAgICAgVkFMVUVfUExBQ0VIT0xERVIsIGZpbHRlcihjdXJyZW50Q2h1bmspKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmaWx0ZXJlZFN0cmluZztcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIENoZWNrIGZvciBmbG9hdGluZyBwb2ludCB2YWx1ZXMgd2l0aGluIHJnYiBzdHJpbmdzIGFuZCByb3VuZHMgdGhlbS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXR0ZWRTdHJpbmdcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge3N0cmluZ31cclxuICAgKi9cclxuICBmdW5jdGlvbiBzYW5pdGl6ZVJHQkNodW5rcyAoZm9ybWF0dGVkU3RyaW5nKSB7XHJcbiAgICByZXR1cm4gZmlsdGVyU3RyaW5nQ2h1bmtzKFJfUkdCLCBmb3JtYXR0ZWRTdHJpbmcsIHNhbml0aXplUkdCQ2h1bmspO1xyXG4gIH1cclxuXHJcbiAgLyohXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJnYkNodW5rXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc2FuaXRpemVSR0JDaHVuayAocmdiQ2h1bmspIHtcclxuICAgIHZhciBudW1iZXJzID0gcmdiQ2h1bmsubWF0Y2goUl9VTkZPUk1BVFRFRF9WQUxVRVMpO1xyXG4gICAgdmFyIG51bWJlcnNMZW5ndGggPSBudW1iZXJzLmxlbmd0aDtcclxuICAgIHZhciBzYW5pdGl6ZWRTdHJpbmcgPSByZ2JDaHVuay5tYXRjaChSX1JHQl9QUkVGSVgpWzBdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtYmVyc0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHNhbml0aXplZFN0cmluZyArPSBwYXJzZUludChudW1iZXJzW2ldLCAxMCkgKyAnLCc7XHJcbiAgICB9XHJcblxyXG4gICAgc2FuaXRpemVkU3RyaW5nID0gc2FuaXRpemVkU3RyaW5nLnNsaWNlKDAsIC0xKSArICcpJztcclxuXHJcbiAgICByZXR1cm4gc2FuaXRpemVkU3RyaW5nO1xyXG4gIH1cclxuXHJcbiAgLyohXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuIE9iamVjdCBvZiBmb3JtYXRNYW5pZmVzdHMgdGhhdCBjb3JyZXNwb25kIHRvXHJcbiAgICogdGhlIHN0cmluZyBwcm9wZXJ0aWVzIG9mIHN0YXRlT2JqZWN0XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZ2V0Rm9ybWF0TWFuaWZlc3RzIChzdGF0ZU9iamVjdCkge1xyXG4gICAgdmFyIG1hbmlmZXN0QWNjdW11bGF0b3IgPSB7fTtcclxuXHJcbiAgICBUd2VlbmFibGUuZWFjaChzdGF0ZU9iamVjdCwgZnVuY3Rpb24gKHByb3ApIHtcclxuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gc3RhdGVPYmplY3RbcHJvcF07XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGN1cnJlbnRQcm9wID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHZhciByYXdWYWx1ZXMgPSBnZXRWYWx1ZXNGcm9tKGN1cnJlbnRQcm9wKTtcclxuXHJcbiAgICAgICAgbWFuaWZlc3RBY2N1bXVsYXRvcltwcm9wXSA9IHtcclxuICAgICAgICAgICdmb3JtYXRTdHJpbmcnOiBnZXRGb3JtYXRTdHJpbmdGcm9tKGN1cnJlbnRQcm9wKVxyXG4gICAgICAgICAgLCdjaHVua05hbWVzJzogZ2V0Rm9ybWF0Q2h1bmtzRnJvbShyYXdWYWx1ZXMsIHByb3ApXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIG1hbmlmZXN0QWNjdW11bGF0b3I7XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZm9ybWF0TWFuaWZlc3RzXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZXhwYW5kRm9ybWF0dGVkUHJvcGVydGllcyAoc3RhdGVPYmplY3QsIGZvcm1hdE1hbmlmZXN0cykge1xyXG4gICAgVHdlZW5hYmxlLmVhY2goZm9ybWF0TWFuaWZlc3RzLCBmdW5jdGlvbiAocHJvcCkge1xyXG4gICAgICB2YXIgY3VycmVudFByb3AgPSBzdGF0ZU9iamVjdFtwcm9wXTtcclxuICAgICAgdmFyIHJhd1ZhbHVlcyA9IGdldFZhbHVlc0Zyb20oY3VycmVudFByb3ApO1xyXG4gICAgICB2YXIgcmF3VmFsdWVzTGVuZ3RoID0gcmF3VmFsdWVzLmxlbmd0aDtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3VmFsdWVzTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBzdGF0ZU9iamVjdFtmb3JtYXRNYW5pZmVzdHNbcHJvcF0uY2h1bmtOYW1lc1tpXV0gPSArcmF3VmFsdWVzW2ldO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkZWxldGUgc3RhdGVPYmplY3RbcHJvcF07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdFxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmb3JtYXRNYW5pZmVzdHNcclxuICAgKi9cclxuICBmdW5jdGlvbiBjb2xsYXBzZUZvcm1hdHRlZFByb3BlcnRpZXMgKHN0YXRlT2JqZWN0LCBmb3JtYXRNYW5pZmVzdHMpIHtcclxuICAgIFR3ZWVuYWJsZS5lYWNoKGZvcm1hdE1hbmlmZXN0cywgZnVuY3Rpb24gKHByb3ApIHtcclxuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gc3RhdGVPYmplY3RbcHJvcF07XHJcbiAgICAgIHZhciBmb3JtYXRDaHVua3MgPSBleHRyYWN0UHJvcGVydHlDaHVua3MoXHJcbiAgICAgICAgc3RhdGVPYmplY3QsIGZvcm1hdE1hbmlmZXN0c1twcm9wXS5jaHVua05hbWVzKTtcclxuICAgICAgdmFyIHZhbHVlc0xpc3QgPSBnZXRWYWx1ZXNMaXN0KFxyXG4gICAgICAgIGZvcm1hdENodW5rcywgZm9ybWF0TWFuaWZlc3RzW3Byb3BdLmNodW5rTmFtZXMpO1xyXG4gICAgICBjdXJyZW50UHJvcCA9IGdldEZvcm1hdHRlZFZhbHVlcyhcclxuICAgICAgICBmb3JtYXRNYW5pZmVzdHNbcHJvcF0uZm9ybWF0U3RyaW5nLCB2YWx1ZXNMaXN0KTtcclxuICAgICAgc3RhdGVPYmplY3RbcHJvcF0gPSBzYW5pdGl6ZVJHQkNodW5rcyhjdXJyZW50UHJvcCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdFxyXG4gICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGNodW5rTmFtZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGV4dHJhY3RlZCB2YWx1ZSBjaHVua3MuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZXh0cmFjdFByb3BlcnR5Q2h1bmtzIChzdGF0ZU9iamVjdCwgY2h1bmtOYW1lcykge1xyXG4gICAgdmFyIGV4dHJhY3RlZFZhbHVlcyA9IHt9O1xyXG4gICAgdmFyIGN1cnJlbnRDaHVua05hbWUsIGNodW5rTmFtZXNMZW5ndGggPSBjaHVua05hbWVzLmxlbmd0aDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rTmFtZXNMZW5ndGg7IGkrKykge1xyXG4gICAgICBjdXJyZW50Q2h1bmtOYW1lID0gY2h1bmtOYW1lc1tpXTtcclxuICAgICAgZXh0cmFjdGVkVmFsdWVzW2N1cnJlbnRDaHVua05hbWVdID0gc3RhdGVPYmplY3RbY3VycmVudENodW5rTmFtZV07XHJcbiAgICAgIGRlbGV0ZSBzdGF0ZU9iamVjdFtjdXJyZW50Q2h1bmtOYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZXh0cmFjdGVkVmFsdWVzO1xyXG4gIH1cclxuXHJcbiAgdmFyIGdldFZhbHVlc0xpc3RfYWNjdW11bGF0b3IgPSBbXTtcclxuICAvKiFcclxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcclxuICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBjaHVua05hbWVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtBcnJheS48bnVtYmVyPn1cclxuICAgKi9cclxuICBmdW5jdGlvbiBnZXRWYWx1ZXNMaXN0IChzdGF0ZU9iamVjdCwgY2h1bmtOYW1lcykge1xyXG4gICAgZ2V0VmFsdWVzTGlzdF9hY2N1bXVsYXRvci5sZW5ndGggPSAwO1xyXG4gICAgdmFyIGNodW5rTmFtZXNMZW5ndGggPSBjaHVua05hbWVzLmxlbmd0aDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rTmFtZXNMZW5ndGg7IGkrKykge1xyXG4gICAgICBnZXRWYWx1ZXNMaXN0X2FjY3VtdWxhdG9yLnB1c2goc3RhdGVPYmplY3RbY2h1bmtOYW1lc1tpXV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBnZXRWYWx1ZXNMaXN0X2FjY3VtdWxhdG9yO1xyXG4gIH1cclxuXHJcbiAgLyohXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdFN0cmluZ1xyXG4gICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IHJhd1ZhbHVlc1xyXG4gICAqXHJcbiAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGdldEZvcm1hdHRlZFZhbHVlcyAoZm9ybWF0U3RyaW5nLCByYXdWYWx1ZXMpIHtcclxuICAgIHZhciBmb3JtYXR0ZWRWYWx1ZVN0cmluZyA9IGZvcm1hdFN0cmluZztcclxuICAgIHZhciByYXdWYWx1ZXNMZW5ndGggPSByYXdWYWx1ZXMubGVuZ3RoO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3VmFsdWVzTGVuZ3RoOyBpKyspIHtcclxuICAgICAgZm9ybWF0dGVkVmFsdWVTdHJpbmcgPSBmb3JtYXR0ZWRWYWx1ZVN0cmluZy5yZXBsYWNlKFxyXG4gICAgICAgIFZBTFVFX1BMQUNFSE9MREVSLCArcmF3VmFsdWVzW2ldLnRvRml4ZWQoNCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmb3JtYXR0ZWRWYWx1ZVN0cmluZztcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIE5vdGU6IEl0J3MgdGhlIGR1dHkgb2YgdGhlIGNhbGxlciB0byBjb252ZXJ0IHRoZSBBcnJheSBlbGVtZW50cyBvZiB0aGVcclxuICAgKiByZXR1cm4gdmFsdWUgaW50byBudW1iZXJzLiAgVGhpcyBpcyBhIHBlcmZvcm1hbmNlIG9wdGltaXphdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXR0ZWRTdHJpbmdcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fG51bGx9XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZ2V0VmFsdWVzRnJvbSAoZm9ybWF0dGVkU3RyaW5nKSB7XHJcbiAgICByZXR1cm4gZm9ybWF0dGVkU3RyaW5nLm1hdGNoKFJfVU5GT1JNQVRURURfVkFMVUVTKTtcclxuICB9XHJcblxyXG4gIC8qIVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmdPYmplY3RcclxuICAgKiBAcGFyYW0ge09iamVjdH0gdG9rZW5EYXRhXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZXhwYW5kRWFzaW5nT2JqZWN0IChlYXNpbmdPYmplY3QsIHRva2VuRGF0YSkge1xyXG4gICAgVHdlZW5hYmxlLmVhY2godG9rZW5EYXRhLCBmdW5jdGlvbiAocHJvcCkge1xyXG4gICAgICB2YXIgY3VycmVudFByb3AgPSB0b2tlbkRhdGFbcHJvcF07XHJcbiAgICAgIHZhciBjaHVua05hbWVzID0gY3VycmVudFByb3AuY2h1bmtOYW1lcztcclxuICAgICAgdmFyIGNodW5rTGVuZ3RoID0gY2h1bmtOYW1lcy5sZW5ndGg7XHJcbiAgICAgIHZhciBlYXNpbmdDaHVua3MgPSBlYXNpbmdPYmplY3RbcHJvcF0uc3BsaXQoJyAnKTtcclxuICAgICAgdmFyIGxhc3RFYXNpbmdDaHVuayA9IGVhc2luZ0NodW5rc1tlYXNpbmdDaHVua3MubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBlYXNpbmdPYmplY3RbY2h1bmtOYW1lc1tpXV0gPSBlYXNpbmdDaHVua3NbaV0gfHwgbGFzdEVhc2luZ0NodW5rO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkZWxldGUgZWFzaW5nT2JqZWN0W3Byb3BdO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKiFcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nT2JqZWN0XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHRva2VuRGF0YVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNvbGxhcHNlRWFzaW5nT2JqZWN0IChlYXNpbmdPYmplY3QsIHRva2VuRGF0YSkge1xyXG4gICAgVHdlZW5hYmxlLmVhY2godG9rZW5EYXRhLCBmdW5jdGlvbiAocHJvcCkge1xyXG4gICAgICB2YXIgY3VycmVudFByb3AgPSB0b2tlbkRhdGFbcHJvcF07XHJcbiAgICAgIHZhciBjaHVua05hbWVzID0gY3VycmVudFByb3AuY2h1bmtOYW1lcztcclxuICAgICAgdmFyIGNodW5rTGVuZ3RoID0gY2h1bmtOYW1lcy5sZW5ndGg7XHJcbiAgICAgIHZhciBjb21wb3NlZEVhc2luZ1N0cmluZyA9ICcnO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29tcG9zZWRFYXNpbmdTdHJpbmcgKz0gJyAnICsgZWFzaW5nT2JqZWN0W2NodW5rTmFtZXNbaV1dO1xyXG4gICAgICAgIGRlbGV0ZSBlYXNpbmdPYmplY3RbY2h1bmtOYW1lc1tpXV07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVhc2luZ09iamVjdFtwcm9wXSA9IGNvbXBvc2VkRWFzaW5nU3RyaW5nLnN1YnN0cigxKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5maWx0ZXIudG9rZW4gPSB7XHJcbiAgICAndHdlZW5DcmVhdGVkJzogZnVuY3Rpb24gKGN1cnJlbnRTdGF0ZSwgZnJvbVN0YXRlLCB0b1N0YXRlLCBlYXNpbmdPYmplY3QpIHtcclxuICAgICAgc2FuaXRpemVPYmplY3RGb3JIZXhQcm9wcyhjdXJyZW50U3RhdGUpO1xyXG4gICAgICBzYW5pdGl6ZU9iamVjdEZvckhleFByb3BzKGZyb21TdGF0ZSk7XHJcbiAgICAgIHNhbml0aXplT2JqZWN0Rm9ySGV4UHJvcHModG9TdGF0ZSk7XHJcbiAgICAgIHRoaXMuX3Rva2VuRGF0YSA9IGdldEZvcm1hdE1hbmlmZXN0cyhjdXJyZW50U3RhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICAnYmVmb3JlVHdlZW4nOiBmdW5jdGlvbiAoY3VycmVudFN0YXRlLCBmcm9tU3RhdGUsIHRvU3RhdGUsIGVhc2luZ09iamVjdCkge1xyXG4gICAgICBleHBhbmRFYXNpbmdPYmplY3QoZWFzaW5nT2JqZWN0LCB0aGlzLl90b2tlbkRhdGEpO1xyXG4gICAgICBleHBhbmRGb3JtYXR0ZWRQcm9wZXJ0aWVzKGN1cnJlbnRTdGF0ZSwgdGhpcy5fdG9rZW5EYXRhKTtcclxuICAgICAgZXhwYW5kRm9ybWF0dGVkUHJvcGVydGllcyhmcm9tU3RhdGUsIHRoaXMuX3Rva2VuRGF0YSk7XHJcbiAgICAgIGV4cGFuZEZvcm1hdHRlZFByb3BlcnRpZXModG9TdGF0ZSwgdGhpcy5fdG9rZW5EYXRhKTtcclxuICAgIH0sXHJcblxyXG4gICAgJ2FmdGVyVHdlZW4nOiBmdW5jdGlvbiAoY3VycmVudFN0YXRlLCBmcm9tU3RhdGUsIHRvU3RhdGUsIGVhc2luZ09iamVjdCkge1xyXG4gICAgICBjb2xsYXBzZUZvcm1hdHRlZFByb3BlcnRpZXMoY3VycmVudFN0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xyXG4gICAgICBjb2xsYXBzZUZvcm1hdHRlZFByb3BlcnRpZXMoZnJvbVN0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xyXG4gICAgICBjb2xsYXBzZUZvcm1hdHRlZFByb3BlcnRpZXModG9TdGF0ZSwgdGhpcy5fdG9rZW5EYXRhKTtcclxuICAgICAgY29sbGFwc2VFYXNpbmdPYmplY3QoZWFzaW5nT2JqZWN0LCB0aGlzLl90b2tlbkRhdGEpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG59IChUd2VlbmFibGUpKTtcclxuXHJcbn0odGhpcykpO1xyXG4iLCIvLyBDaXJjbGUgc2hhcGVkIHByb2dyZXNzIGJhclxyXG5cclxudmFyIFNoYXBlID0gcmVxdWlyZSgnLi9zaGFwZScpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcblxyXG5cclxudmFyIENpcmNsZSA9IGZ1bmN0aW9uIENpcmNsZShjb250YWluZXIsIG9wdGlvbnMpIHtcclxuICAgIC8vIFVzZSB0d28gYXJjcyB0byBmb3JtIGEgY2lyY2xlXHJcbiAgICAvLyBTZWUgdGhpcyBhbnN3ZXIgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTA0NzczMzQvMTQ0NjA5MlxyXG4gICAgdGhpcy5fcGF0aFRlbXBsYXRlID1cclxuICAgICAgICAnTSA1MCw1MCBtIDAsLXtyYWRpdXN9JyArXHJcbiAgICAgICAgJyBhIHtyYWRpdXN9LHtyYWRpdXN9IDAgMSAxIDAsezJyYWRpdXN9JyArXHJcbiAgICAgICAgJyBhIHtyYWRpdXN9LHtyYWRpdXN9IDAgMSAxIDAsLXsycmFkaXVzfSc7XHJcblxyXG4gICAgU2hhcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcbkNpcmNsZS5wcm90b3R5cGUgPSBuZXcgU2hhcGUoKTtcclxuQ2lyY2xlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENpcmNsZTtcclxuXHJcbkNpcmNsZS5wcm90b3R5cGUuX3BhdGhTdHJpbmcgPSBmdW5jdGlvbiBfcGF0aFN0cmluZyhvcHRzKSB7XHJcbiAgICB2YXIgd2lkdGhPZldpZGVyID0gb3B0cy5zdHJva2VXaWR0aDtcclxuICAgIGlmIChvcHRzLnRyYWlsV2lkdGggJiYgb3B0cy50cmFpbFdpZHRoID4gb3B0cy5zdHJva2VXaWR0aCkge1xyXG4gICAgICAgIHdpZHRoT2ZXaWRlciA9IG9wdHMudHJhaWxXaWR0aDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgciA9IDUwIC0gd2lkdGhPZldpZGVyIC8gMjtcclxuXHJcbiAgICByZXR1cm4gdXRpbHMucmVuZGVyKHRoaXMuX3BhdGhUZW1wbGF0ZSwge1xyXG4gICAgICAgIHJhZGl1czogcixcclxuICAgICAgICAnMnJhZGl1cyc6IHIgKiAyXHJcbiAgICB9KTtcclxufTtcclxuXHJcbkNpcmNsZS5wcm90b3R5cGUuX3RyYWlsU3RyaW5nID0gZnVuY3Rpb24gX3RyYWlsU3RyaW5nKG9wdHMpIHtcclxuICAgIHJldHVybiB0aGlzLl9wYXRoU3RyaW5nKG9wdHMpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDaXJjbGU7XHJcbiIsIi8vIExpbmUgc2hhcGVkIHByb2dyZXNzIGJhclxyXG5cclxudmFyIFNoYXBlID0gcmVxdWlyZSgnLi9zaGFwZScpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcblxyXG5cclxudmFyIExpbmUgPSBmdW5jdGlvbiBMaW5lKGNvbnRhaW5lciwgb3B0aW9ucykge1xyXG4gICAgdGhpcy5fcGF0aFRlbXBsYXRlID0gJ00gMCx7Y2VudGVyfSBMIDEwMCx7Y2VudGVyfSc7XHJcbiAgICBTaGFwZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuTGluZS5wcm90b3R5cGUgPSBuZXcgU2hhcGUoKTtcclxuTGluZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMaW5lO1xyXG5cclxuTGluZS5wcm90b3R5cGUuX2luaXRpYWxpemVTdmcgPSBmdW5jdGlvbiBfaW5pdGlhbGl6ZVN2ZyhzdmcsIG9wdHMpIHtcclxuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDEwMCAnICsgb3B0cy5zdHJva2VXaWR0aCk7XHJcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ25vbmUnKTtcclxufTtcclxuXHJcbkxpbmUucHJvdG90eXBlLl9wYXRoU3RyaW5nID0gZnVuY3Rpb24gX3BhdGhTdHJpbmcob3B0cykge1xyXG4gICAgcmV0dXJuIHV0aWxzLnJlbmRlcih0aGlzLl9wYXRoVGVtcGxhdGUsIHtcclxuICAgICAgICBjZW50ZXI6IG9wdHMuc3Ryb2tlV2lkdGggLyAyXHJcbiAgICB9KTtcclxufTtcclxuXHJcbkxpbmUucHJvdG90eXBlLl90cmFpbFN0cmluZyA9IGZ1bmN0aW9uIF90cmFpbFN0cmluZyhvcHRzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcGF0aFN0cmluZyhvcHRzKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGluZTtcclxuIiwiLy8gRGlmZmVyZW50IHNoYXBlZCBwcm9ncmVzcyBiYXJzXHJcbnZhciBMaW5lID0gcmVxdWlyZSgnLi9saW5lJyk7XHJcbnZhciBDaXJjbGUgPSByZXF1aXJlKCcuL2NpcmNsZScpO1xyXG52YXIgU3F1YXJlID0gcmVxdWlyZSgnLi9zcXVhcmUnKTtcclxuXHJcbi8vIExvd2VyIGxldmVsIEFQSSB0byB1c2UgYW55IFNWRyBwYXRoXHJcbnZhciBQYXRoID0gcmVxdWlyZSgnLi9wYXRoJyk7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBMaW5lOiBMaW5lLFxyXG4gICAgQ2lyY2xlOiBDaXJjbGUsXHJcbiAgICBTcXVhcmU6IFNxdWFyZSxcclxuICAgIFBhdGg6IFBhdGhcclxufTtcclxuIiwiLy8gTG93ZXIgbGV2ZWwgQVBJIHRvIGFuaW1hdGUgYW55IGtpbmQgb2Ygc3ZnIHBhdGhcclxuXHJcbnZhciBUd2VlbmFibGUgPSByZXF1aXJlKCdzaGlmdHknKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG5cclxudmFyIEVBU0lOR19BTElBU0VTID0ge1xyXG4gICAgZWFzZUluOiAnZWFzZUluQ3ViaWMnLFxyXG4gICAgZWFzZU91dDogJ2Vhc2VPdXRDdWJpYycsXHJcbiAgICBlYXNlSW5PdXQ6ICdlYXNlSW5PdXRDdWJpYydcclxufTtcclxuXHJcblxyXG52YXIgUGF0aCA9IGZ1bmN0aW9uIFBhdGgocGF0aCwgb3B0cykge1xyXG4gICAgLy8gRGVmYXVsdCBwYXJhbWV0ZXJzIGZvciBhbmltYXRpb25cclxuICAgIG9wdHMgPSB1dGlscy5leHRlbmQoe1xyXG4gICAgICAgIGR1cmF0aW9uOiA4MDAsXHJcbiAgICAgICAgZWFzaW5nOiAnbGluZWFyJyxcclxuICAgICAgICBmcm9tOiB7fSxcclxuICAgICAgICB0bzoge30sXHJcbiAgICAgICAgc3RlcDogZnVuY3Rpb24oKSB7fVxyXG4gICAgfSwgb3B0cyk7XHJcblxyXG4gICAgdmFyIGVsZW1lbnQ7XHJcbiAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcclxuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXRoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZWxlbWVudCA9IHBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmV2ZWFsIC5wYXRoIGFzIHB1YmxpYyBhdHRyaWJ1dGVcclxuICAgIHRoaXMucGF0aCA9IGVsZW1lbnQ7XHJcbiAgICB0aGlzLl9vcHRzID0gb3B0cztcclxuICAgIHRoaXMuX3R3ZWVuYWJsZSA9IG51bGw7XHJcblxyXG4gICAgLy8gU2V0IHVwIHRoZSBzdGFydGluZyBwb3NpdGlvbnNcclxuICAgIHZhciBsZW5ndGggPSB0aGlzLnBhdGguZ2V0VG90YWxMZW5ndGgoKTtcclxuICAgIHRoaXMucGF0aC5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSBsZW5ndGggKyAnICcgKyBsZW5ndGg7XHJcbiAgICB0aGlzLnNldCgwKTtcclxufTtcclxuXHJcblBhdGgucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24gdmFsdWUoKSB7XHJcbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy5fZ2V0Q29tcHV0ZWREYXNoT2Zmc2V0KCk7XHJcbiAgICB2YXIgbGVuZ3RoID0gdGhpcy5wYXRoLmdldFRvdGFsTGVuZ3RoKCk7XHJcblxyXG4gICAgdmFyIHByb2dyZXNzID0gMSAtIG9mZnNldCAvIGxlbmd0aDtcclxuICAgIC8vIFJvdW5kIG51bWJlciB0byBwcmV2ZW50IHJldHVybmluZyB2ZXJ5IHNtYWxsIG51bWJlciBsaWtlIDFlLTMwLCB3aGljaFxyXG4gICAgLy8gaXMgcHJhY3RpY2FsbHkgMFxyXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQocHJvZ3Jlc3MudG9GaXhlZCg2KSwgMTApO1xyXG59O1xyXG5cclxuUGF0aC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KHByb2dyZXNzKSB7XHJcbiAgICB0aGlzLnN0b3AoKTtcclxuXHJcbiAgICB0aGlzLnBhdGguc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IHRoaXMuX3Byb2dyZXNzVG9PZmZzZXQocHJvZ3Jlc3MpO1xyXG5cclxuICAgIHZhciBzdGVwID0gdGhpcy5fb3B0cy5zdGVwO1xyXG4gICAgaWYgKHV0aWxzLmlzRnVuY3Rpb24oc3RlcCkpIHtcclxuICAgICAgICB2YXIgZWFzaW5nID0gdGhpcy5fZWFzaW5nKHRoaXMuX29wdHMuZWFzaW5nKTtcclxuICAgICAgICB2YXIgdmFsdWVzID0gdGhpcy5fY2FsY3VsYXRlVG8ocHJvZ3Jlc3MsIGVhc2luZyk7XHJcbiAgICAgICAgc3RlcCh2YWx1ZXMsIHRoaXMuX29wdHMuc2hhcGV8fHRoaXMsIHRoaXMuX29wdHMuYXR0YWNobWVudCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5QYXRoLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gc3RvcCgpIHtcclxuICAgIHRoaXMuX3N0b3BUd2VlbigpO1xyXG4gICAgdGhpcy5wYXRoLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSB0aGlzLl9nZXRDb21wdXRlZERhc2hPZmZzZXQoKTtcclxufTtcclxuXHJcbi8vIE1ldGhvZCBpbnRyb2R1Y2VkIGhlcmU6XHJcbi8vIGh0dHA6Ly9qYWtlYXJjaGliYWxkLmNvbS8yMDEzL2FuaW1hdGVkLWxpbmUtZHJhd2luZy1zdmcvXHJcblBhdGgucHJvdG90eXBlLmFuaW1hdGUgPSBmdW5jdGlvbiBhbmltYXRlKHByb2dyZXNzLCBvcHRzLCBjYikge1xyXG4gICAgb3B0cyA9IG9wdHMgfHwge307XHJcblxyXG4gICAgaWYgKHV0aWxzLmlzRnVuY3Rpb24ob3B0cykpIHtcclxuICAgICAgICBjYiA9IG9wdHM7XHJcbiAgICAgICAgb3B0cyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwYXNzZWRPcHRzID0gdXRpbHMuZXh0ZW5kKHt9LCBvcHRzKTtcclxuXHJcbiAgICAvLyBDb3B5IGRlZmF1bHQgb3B0cyB0byBuZXcgb2JqZWN0IHNvIGRlZmF1bHRzIGFyZSBub3QgbW9kaWZpZWRcclxuICAgIHZhciBkZWZhdWx0T3B0cyA9IHV0aWxzLmV4dGVuZCh7fSwgdGhpcy5fb3B0cyk7XHJcbiAgICBvcHRzID0gdXRpbHMuZXh0ZW5kKGRlZmF1bHRPcHRzLCBvcHRzKTtcclxuXHJcbiAgICB2YXIgc2hpZnR5RWFzaW5nID0gdGhpcy5fZWFzaW5nKG9wdHMuZWFzaW5nKTtcclxuICAgIHZhciB2YWx1ZXMgPSB0aGlzLl9yZXNvbHZlRnJvbUFuZFRvKHByb2dyZXNzLCBzaGlmdHlFYXNpbmcsIHBhc3NlZE9wdHMpO1xyXG5cclxuICAgIHRoaXMuc3RvcCgpO1xyXG5cclxuICAgIC8vIFRyaWdnZXIgYSBsYXlvdXQgc28gc3R5bGVzIGFyZSBjYWxjdWxhdGVkICYgdGhlIGJyb3dzZXJcclxuICAgIC8vIHBpY2tzIHVwIHRoZSBzdGFydGluZyBwb3NpdGlvbiBiZWZvcmUgYW5pbWF0aW5nXHJcbiAgICB0aGlzLnBhdGguZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgdmFyIG9mZnNldCA9IHRoaXMuX2dldENvbXB1dGVkRGFzaE9mZnNldCgpO1xyXG4gICAgdmFyIG5ld09mZnNldCA9IHRoaXMuX3Byb2dyZXNzVG9PZmZzZXQocHJvZ3Jlc3MpO1xyXG5cclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMuX3R3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcclxuICAgIHRoaXMuX3R3ZWVuYWJsZS50d2Vlbih7XHJcbiAgICAgICAgZnJvbTogdXRpbHMuZXh0ZW5kKHsgb2Zmc2V0OiBvZmZzZXQgfSwgdmFsdWVzLmZyb20pLFxyXG4gICAgICAgIHRvOiB1dGlscy5leHRlbmQoeyBvZmZzZXQ6IG5ld09mZnNldCB9LCB2YWx1ZXMudG8pLFxyXG4gICAgICAgIGR1cmF0aW9uOiBvcHRzLmR1cmF0aW9uLFxyXG4gICAgICAgIGVhc2luZzogc2hpZnR5RWFzaW5nLFxyXG4gICAgICAgIHN0ZXA6IGZ1bmN0aW9uKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIHNlbGYucGF0aC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gc3RhdGUub2Zmc2V0O1xyXG4gICAgICAgICAgICBvcHRzLnN0ZXAoc3RhdGUsIG9wdHMuc2hhcGV8fHNlbGYsIG9wdHMuYXR0YWNobWVudCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaW5pc2g6IGZ1bmN0aW9uKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKGNiKSkge1xyXG4gICAgICAgICAgICAgICAgY2IoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuUGF0aC5wcm90b3R5cGUuX2dldENvbXB1dGVkRGFzaE9mZnNldCA9IGZ1bmN0aW9uIF9nZXRDb21wdXRlZERhc2hPZmZzZXQoKSB7XHJcbiAgICB2YXIgY29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMucGF0aCwgbnVsbCk7XHJcbiAgICByZXR1cm4gcGFyc2VGbG9hdChjb21wdXRlZFN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3N0cm9rZS1kYXNob2Zmc2V0JyksIDEwKTtcclxufTtcclxuXHJcblBhdGgucHJvdG90eXBlLl9wcm9ncmVzc1RvT2Zmc2V0ID0gZnVuY3Rpb24gX3Byb2dyZXNzVG9PZmZzZXQocHJvZ3Jlc3MpIHtcclxuICAgIHZhciBsZW5ndGggPSB0aGlzLnBhdGguZ2V0VG90YWxMZW5ndGgoKTtcclxuICAgIHJldHVybiBsZW5ndGggLSBwcm9ncmVzcyAqIGxlbmd0aDtcclxufTtcclxuXHJcbi8vIFJlc29sdmVzIGZyb20gYW5kIHRvIHZhbHVlcyBmb3IgYW5pbWF0aW9uLlxyXG5QYXRoLnByb3RvdHlwZS5fcmVzb2x2ZUZyb21BbmRUbyA9IGZ1bmN0aW9uIF9yZXNvbHZlRnJvbUFuZFRvKHByb2dyZXNzLCBlYXNpbmcsIG9wdHMpIHtcclxuICAgIGlmIChvcHRzLmZyb20gJiYgb3B0cy50bykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGZyb206IG9wdHMuZnJvbSxcclxuICAgICAgICAgICAgdG86IG9wdHMudG9cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZnJvbTogdGhpcy5fY2FsY3VsYXRlRnJvbShlYXNpbmcpLFxyXG4gICAgICAgIHRvOiB0aGlzLl9jYWxjdWxhdGVUbyhwcm9ncmVzcywgZWFzaW5nKVxyXG4gICAgfTtcclxufTtcclxuXHJcbi8vIENhbGN1bGF0ZSBgZnJvbWAgdmFsdWVzIGZyb20gb3B0aW9ucyBwYXNzZWQgYXQgaW5pdGlhbGl6YXRpb25cclxuUGF0aC5wcm90b3R5cGUuX2NhbGN1bGF0ZUZyb20gPSBmdW5jdGlvbiBfY2FsY3VsYXRlRnJvbShlYXNpbmcpIHtcclxuICAgIHJldHVybiBUd2VlbmFibGUuaW50ZXJwb2xhdGUodGhpcy5fb3B0cy5mcm9tLCB0aGlzLl9vcHRzLnRvLCB0aGlzLnZhbHVlKCksIGVhc2luZyk7XHJcbn07XHJcblxyXG4vLyBDYWxjdWxhdGUgYHRvYCB2YWx1ZXMgZnJvbSBvcHRpb25zIHBhc3NlZCBhdCBpbml0aWFsaXphdGlvblxyXG5QYXRoLnByb3RvdHlwZS5fY2FsY3VsYXRlVG8gPSBmdW5jdGlvbiBfY2FsY3VsYXRlVG8ocHJvZ3Jlc3MsIGVhc2luZykge1xyXG4gICAgcmV0dXJuIFR3ZWVuYWJsZS5pbnRlcnBvbGF0ZSh0aGlzLl9vcHRzLmZyb20sIHRoaXMuX29wdHMudG8sIHByb2dyZXNzLCBlYXNpbmcpO1xyXG59O1xyXG5cclxuUGF0aC5wcm90b3R5cGUuX3N0b3BUd2VlbiA9IGZ1bmN0aW9uIF9zdG9wVHdlZW4oKSB7XHJcbiAgICBpZiAodGhpcy5fdHdlZW5hYmxlICE9PSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fdHdlZW5hYmxlLnN0b3AoKTtcclxuICAgICAgICB0aGlzLl90d2VlbmFibGUuZGlzcG9zZSgpO1xyXG4gICAgICAgIHRoaXMuX3R3ZWVuYWJsZSA9IG51bGw7XHJcbiAgICB9XHJcbn07XHJcblxyXG5QYXRoLnByb3RvdHlwZS5fZWFzaW5nID0gZnVuY3Rpb24gX2Vhc2luZyhlYXNpbmcpIHtcclxuICAgIGlmIChFQVNJTkdfQUxJQVNFUy5oYXNPd25Qcm9wZXJ0eShlYXNpbmcpKSB7XHJcbiAgICAgICAgcmV0dXJuIEVBU0lOR19BTElBU0VTW2Vhc2luZ107XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVhc2luZztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0aDtcclxuIiwiLy8gQmFzZSBvYmplY3QgZm9yIGRpZmZlcmVudCBwcm9ncmVzcyBiYXIgc2hhcGVzXHJcblxyXG52YXIgUGF0aCA9IHJlcXVpcmUoJy4vcGF0aCcpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcblxyXG52YXIgREVTVFJPWUVEX0VSUk9SID0gJ09iamVjdCBpcyBkZXN0cm95ZWQnO1xyXG5cclxuXHJcbnZhciBTaGFwZSA9IGZ1bmN0aW9uIFNoYXBlKGNvbnRhaW5lciwgb3B0cykge1xyXG4gICAgLy8gVGhyb3cgYSBiZXR0ZXIgZXJyb3IgaWYgcHJvZ3Jlc3MgYmFycyBhcmUgbm90IGluaXRpYWxpemVkIHdpdGggYG5ld2BcclxuICAgIC8vIGtleXdvcmRcclxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTaGFwZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnN0cnVjdG9yIHdhcyBjYWxsZWQgd2l0aG91dCBuZXcga2V5d29yZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFByZXZlbnQgY2FsbGluZyBjb25zdHJ1Y3RvciB3aXRob3V0IHBhcmFtZXRlcnMgc28gaW5oZXJpdGFuY2VcclxuICAgIC8vIHdvcmtzIGNvcnJlY3RseS4gVG8gdW5kZXJzdGFuZCwgdGhpcyBpcyBob3cgU2hhcGUgaXMgaW5oZXJpdGVkOlxyXG4gICAgLy9cclxuICAgIC8vICAgTGluZS5wcm90b3R5cGUgPSBuZXcgU2hhcGUoKTtcclxuICAgIC8vXHJcbiAgICAvLyBXZSBqdXN0IHdhbnQgdG8gc2V0IHRoZSBwcm90b3R5cGUgZm9yIExpbmUuXHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgIC8vIERlZmF1bHQgcGFyYW1ldGVycyBmb3IgcHJvZ3Jlc3MgYmFyIGNyZWF0aW9uXHJcbiAgICB0aGlzLl9vcHRzID0gdXRpbHMuZXh0ZW5kKHtcclxuICAgICAgICBjb2xvcjogJyM1NTUnLFxyXG4gICAgICAgIHN0cm9rZVdpZHRoOiAxLjAsXHJcbiAgICAgICAgdHJhaWxDb2xvcjogbnVsbCxcclxuICAgICAgICB0cmFpbFdpZHRoOiBudWxsLFxyXG4gICAgICAgIGZpbGw6IG51bGwsXHJcbiAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBhdXRvU3R5bGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbG9yOiBudWxsLFxyXG4gICAgICAgICAgICB2YWx1ZTogJycsXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3Byb2dyZXNzYmFyLXRleHQnXHJcbiAgICAgICAgfVxyXG4gICAgfSwgb3B0cywgdHJ1ZSk7ICAvLyBVc2UgcmVjdXJzaXZlIGV4dGVuZFxyXG5cclxuICAgIHZhciBzdmdWaWV3ID0gdGhpcy5fY3JlYXRlU3ZnVmlldyh0aGlzLl9vcHRzKTtcclxuXHJcbiAgICB2YXIgZWxlbWVudDtcclxuICAgIGlmICh1dGlscy5pc1N0cmluZyhjb250YWluZXIpKSB7XHJcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZWxlbWVudCA9IGNvbnRhaW5lcjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWVsZW1lbnQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnRhaW5lciBkb2VzIG5vdCBleGlzdDogJyArIGNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fY29udGFpbmVyID0gZWxlbWVudDtcclxuICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZChzdmdWaWV3LnN2Zyk7XHJcblxyXG4gICAgdGhpcy50ZXh0ID0gbnVsbDtcclxuICAgIGlmICh0aGlzLl9vcHRzLnRleHQudmFsdWUpIHtcclxuICAgICAgICB0aGlzLnRleHQgPSB0aGlzLl9jcmVhdGVUZXh0RWxlbWVudCh0aGlzLl9vcHRzLCB0aGlzLl9jb250YWluZXIpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEV4cG9zZSBwdWJsaWMgYXR0cmlidXRlcyBiZWZvcmUgUGF0aCBpbml0aWFsaXphdGlvblxyXG4gICAgdGhpcy5zdmcgPSBzdmdWaWV3LnN2ZztcclxuICAgIHRoaXMucGF0aCA9IHN2Z1ZpZXcucGF0aDtcclxuICAgIHRoaXMudHJhaWwgPSBzdmdWaWV3LnRyYWlsO1xyXG4gICAgLy8gdGhpcy50ZXh0IGlzIGFsc28gYSBwdWJsaWMgYXR0cmlidXRlXHJcblxyXG4gICAgdmFyIG5ld09wdHMgPSB1dGlscy5leHRlbmQoe1xyXG4gICAgICAgIGF0dGFjaG1lbnQ6IHVuZGVmaW5lZCxcclxuICAgICAgICBzaGFwZTogdGhpc1xyXG4gICAgfSwgdGhpcy5fb3B0cyk7XHJcbiAgICB0aGlzLl9wcm9ncmVzc1BhdGggPSBuZXcgUGF0aChzdmdWaWV3LnBhdGgsIG5ld09wdHMpO1xyXG59O1xyXG5cclxuU2hhcGUucHJvdG90eXBlLmFuaW1hdGUgPSBmdW5jdGlvbiBhbmltYXRlKHByb2dyZXNzLCBvcHRzLCBjYikge1xyXG4gICAgaWYgKHRoaXMuX3Byb2dyZXNzUGF0aCA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKERFU1RST1lFRF9FUlJPUik7XHJcbiAgICB0aGlzLl9wcm9ncmVzc1BhdGguYW5pbWF0ZShwcm9ncmVzcywgb3B0cywgY2IpO1xyXG59O1xyXG5cclxuU2hhcGUucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiBzdG9wKCkge1xyXG4gICAgaWYgKHRoaXMuX3Byb2dyZXNzUGF0aCA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKERFU1RST1lFRF9FUlJPUik7XHJcbiAgICAvLyBEb24ndCBjcmFzaCBpZiBzdG9wIGlzIGNhbGxlZCBpbnNpZGUgc3RlcCBmdW5jdGlvblxyXG4gICAgaWYgKHRoaXMuX3Byb2dyZXNzUGF0aCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5fcHJvZ3Jlc3NQYXRoLnN0b3AoKTtcclxufTtcclxuXHJcblNoYXBlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gZGVzdHJveSgpIHtcclxuICAgIGlmICh0aGlzLl9wcm9ncmVzc1BhdGggPT09IG51bGwpIHRocm93IG5ldyBFcnJvcihERVNUUk9ZRURfRVJST1IpO1xyXG5cclxuICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgdGhpcy5zdmcucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnN2Zyk7XHJcbiAgICB0aGlzLnN2ZyA9IG51bGw7XHJcbiAgICB0aGlzLnBhdGggPSBudWxsO1xyXG4gICAgdGhpcy50cmFpbCA9IG51bGw7XHJcbiAgICB0aGlzLl9wcm9ncmVzc1BhdGggPSBudWxsO1xyXG5cclxuICAgIGlmICh0aGlzLnRleHQgIT09IG51bGwpIHtcclxuICAgICAgICB0aGlzLnRleHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnRleHQpO1xyXG4gICAgICAgIHRoaXMudGV4dCA9IG51bGw7XHJcbiAgICB9XHJcbn07XHJcblxyXG5TaGFwZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KHByb2dyZXNzKSB7XHJcbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3NQYXRoID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoREVTVFJPWUVEX0VSUk9SKTtcclxuICAgIHRoaXMuX3Byb2dyZXNzUGF0aC5zZXQocHJvZ3Jlc3MpO1xyXG59O1xyXG5cclxuU2hhcGUucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24gdmFsdWUoKSB7XHJcbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3NQYXRoID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoREVTVFJPWUVEX0VSUk9SKTtcclxuICAgIGlmICh0aGlzLl9wcm9ncmVzc1BhdGggPT09IHVuZGVmaW5lZCkgcmV0dXJuIDA7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3Byb2dyZXNzUGF0aC52YWx1ZSgpO1xyXG59O1xyXG5cclxuU2hhcGUucHJvdG90eXBlLnNldFRleHQgPSBmdW5jdGlvbiBzZXRUZXh0KHRleHQpIHtcclxuICAgIGlmICh0aGlzLl9wcm9ncmVzc1BhdGggPT09IG51bGwpIHRocm93IG5ldyBFcnJvcihERVNUUk9ZRURfRVJST1IpO1xyXG5cclxuICAgIGlmICh0aGlzLnRleHQgPT09IG51bGwpIHtcclxuICAgICAgICAvLyBDcmVhdGUgbmV3IHRleHQgbm9kZVxyXG4gICAgICAgIHRoaXMudGV4dCA9IHRoaXMuX2NyZWF0ZVRleHRFbGVtZW50KHRoaXMuX29wdHMsIHRoaXMuX2NvbnRhaW5lcik7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMudGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIHByZXZpb3VzIHRleHQgbm9kZSBhbmQgYWRkIG5ld1xyXG4gICAgdGhpcy50ZXh0LnJlbW92ZUNoaWxkKHRoaXMudGV4dC5maXJzdENoaWxkKTtcclxuICAgIHRoaXMudGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KSk7XHJcbn07XHJcblxyXG5TaGFwZS5wcm90b3R5cGUuX2NyZWF0ZVN2Z1ZpZXcgPSBmdW5jdGlvbiBfY3JlYXRlU3ZnVmlldyhvcHRzKSB7XHJcbiAgICB2YXIgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcclxuICAgIHRoaXMuX2luaXRpYWxpemVTdmcoc3ZnLCBvcHRzKTtcclxuXHJcbiAgICB2YXIgdHJhaWxQYXRoID0gbnVsbDtcclxuICAgIC8vIEVhY2ggb3B0aW9uIGxpc3RlZCBpbiB0aGUgaWYgY29uZGl0aW9uIGFyZSAndHJpZ2dlcnMnIGZvciBjcmVhdGluZ1xyXG4gICAgLy8gdGhlIHRyYWlsIHBhdGhcclxuICAgIGlmIChvcHRzLnRyYWlsQ29sb3IgfHwgb3B0cy50cmFpbFdpZHRoKSB7XHJcbiAgICAgICAgdHJhaWxQYXRoID0gdGhpcy5fY3JlYXRlVHJhaWwob3B0cyk7XHJcbiAgICAgICAgc3ZnLmFwcGVuZENoaWxkKHRyYWlsUGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHBhdGggPSB0aGlzLl9jcmVhdGVQYXRoKG9wdHMpO1xyXG4gICAgc3ZnLmFwcGVuZENoaWxkKHBhdGgpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc3ZnOiBzdmcsXHJcbiAgICAgICAgcGF0aDogcGF0aCxcclxuICAgICAgICB0cmFpbDogdHJhaWxQYXRoXHJcbiAgICB9O1xyXG59O1xyXG5cclxuU2hhcGUucHJvdG90eXBlLl9pbml0aWFsaXplU3ZnID0gZnVuY3Rpb24gX2luaXRpYWxpemVTdmcoc3ZnLCBvcHRzKSB7XHJcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCAxMDAgMTAwJyk7XHJcbn07XHJcblxyXG5TaGFwZS5wcm90b3R5cGUuX2NyZWF0ZVBhdGggPSBmdW5jdGlvbiBfY3JlYXRlUGF0aChvcHRzKSB7XHJcbiAgICB2YXIgcGF0aFN0cmluZyA9IHRoaXMuX3BhdGhTdHJpbmcob3B0cyk7XHJcbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlUGF0aEVsZW1lbnQocGF0aFN0cmluZywgb3B0cyk7XHJcbn07XHJcblxyXG5TaGFwZS5wcm90b3R5cGUuX2NyZWF0ZVRyYWlsID0gZnVuY3Rpb24gX2NyZWF0ZVRyYWlsKG9wdHMpIHtcclxuICAgIC8vIENyZWF0ZSBwYXRoIHN0cmluZyB3aXRoIG9yaWdpbmFsIHBhc3NlZCBvcHRpb25zXHJcbiAgICB2YXIgcGF0aFN0cmluZyA9IHRoaXMuX3RyYWlsU3RyaW5nKG9wdHMpO1xyXG5cclxuICAgIC8vIFByZXZlbnQgbW9kaWZ5aW5nIG9yaWdpbmFsXHJcbiAgICB2YXIgbmV3T3B0cyA9IHV0aWxzLmV4dGVuZCh7fSwgb3B0cyk7XHJcblxyXG4gICAgLy8gRGVmYXVsdHMgZm9yIHBhcmFtZXRlcnMgd2hpY2ggbW9kaWZ5IHRyYWlsIHBhdGhcclxuICAgIGlmICghbmV3T3B0cy50cmFpbENvbG9yKSBuZXdPcHRzLnRyYWlsQ29sb3IgPSAnI2VlZSc7XHJcbiAgICBpZiAoIW5ld09wdHMudHJhaWxXaWR0aCkgbmV3T3B0cy50cmFpbFdpZHRoID0gbmV3T3B0cy5zdHJva2VXaWR0aDtcclxuXHJcbiAgICBuZXdPcHRzLmNvbG9yID0gbmV3T3B0cy50cmFpbENvbG9yO1xyXG4gICAgbmV3T3B0cy5zdHJva2VXaWR0aCA9IG5ld09wdHMudHJhaWxXaWR0aDtcclxuXHJcbiAgICAvLyBXaGVuIHRyYWlsIHBhdGggaXMgc2V0LCBmaWxsIG11c3QgYmUgc2V0IGZvciBpdCBpbnN0ZWFkIG9mIHRoZVxyXG4gICAgLy8gYWN0dWFsIHBhdGggdG8gcHJldmVudCB0cmFpbCBzdHJva2UgZnJvbSBjbGlwcGluZ1xyXG4gICAgbmV3T3B0cy5maWxsID0gbnVsbDtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlUGF0aEVsZW1lbnQocGF0aFN0cmluZywgbmV3T3B0cyk7XHJcbn07XHJcblxyXG5TaGFwZS5wcm90b3R5cGUuX2NyZWF0ZVBhdGhFbGVtZW50ID0gZnVuY3Rpb24gX2NyZWF0ZVBhdGhFbGVtZW50KHBhdGhTdHJpbmcsIG9wdHMpIHtcclxuICAgIHZhciBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XHJcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIHBhdGhTdHJpbmcpO1xyXG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIG9wdHMuY29sb3IpO1xyXG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsIG9wdHMuc3Ryb2tlV2lkdGgpO1xyXG5cclxuICAgIGlmIChvcHRzLmZpbGwpIHtcclxuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZmlsbCcsIG9wdHMuZmlsbCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdmaWxsLW9wYWNpdHknLCAnMCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXRoO1xyXG59O1xyXG5cclxuU2hhcGUucHJvdG90eXBlLl9jcmVhdGVUZXh0RWxlbWVudCA9IGZ1bmN0aW9uIF9jcmVhdGVUZXh0RWxlbWVudChvcHRzLCBjb250YWluZXIpIHtcclxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShvcHRzLnRleHQudmFsdWUpKTtcclxuXHJcbiAgICBpZiAob3B0cy50ZXh0LmF1dG9TdHlsZSkge1xyXG4gICAgICAgIC8vIENlbnRlciB0ZXh0XHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9ICc1MCUnO1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9ICc1MCUnO1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZyA9IDA7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5tYXJnaW4gPSAwO1xyXG4gICAgICAgIHV0aWxzLnNldFN0eWxlKGVsZW1lbnQsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKC01MCUsIC01MCUpJyk7XHJcblxyXG4gICAgICAgIGlmIChvcHRzLnRleHQuY29sb3IpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5jb2xvciA9IG9wdHMudGV4dC5jb2xvcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmNvbG9yID0gb3B0cy5jb2xvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbGVtZW50LmNsYXNzTmFtZSA9IG9wdHMudGV4dC5jbGFzc05hbWU7XHJcblxyXG4gICAgcmV0dXJuIGVsZW1lbnQ7XHJcbn07XHJcblxyXG5TaGFwZS5wcm90b3R5cGUuX3BhdGhTdHJpbmcgPSBmdW5jdGlvbiBfcGF0aFN0cmluZyhvcHRzKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ092ZXJyaWRlIHRoaXMgZnVuY3Rpb24gZm9yIGVhY2ggcHJvZ3Jlc3MgYmFyJyk7XHJcbn07XHJcblxyXG5TaGFwZS5wcm90b3R5cGUuX3RyYWlsU3RyaW5nID0gZnVuY3Rpb24gX3RyYWlsU3RyaW5nKG9wdHMpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignT3ZlcnJpZGUgdGhpcyBmdW5jdGlvbiBmb3IgZWFjaCBwcm9ncmVzcyBiYXInKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGU7XHJcbiIsIi8vIFNxdWFyZSBzaGFwZWQgcHJvZ3Jlc3MgYmFyXHJcblxyXG52YXIgU2hhcGUgPSByZXF1aXJlKCcuL3NoYXBlJyk7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuXHJcblxyXG52YXIgU3F1YXJlID0gZnVuY3Rpb24gU3F1YXJlKGNvbnRhaW5lciwgb3B0aW9ucykge1xyXG4gICAgdGhpcy5fcGF0aFRlbXBsYXRlID1cclxuICAgICAgICAnTSAwLHtoYWxmT2ZTdHJva2VXaWR0aH0nICtcclxuICAgICAgICAnIEwge3dpZHRofSx7aGFsZk9mU3Ryb2tlV2lkdGh9JyArXHJcbiAgICAgICAgJyBMIHt3aWR0aH0se3dpZHRofScgK1xyXG4gICAgICAgICcgTCB7aGFsZk9mU3Ryb2tlV2lkdGh9LHt3aWR0aH0nICtcclxuICAgICAgICAnIEwge2hhbGZPZlN0cm9rZVdpZHRofSx7c3Ryb2tlV2lkdGh9JztcclxuXHJcbiAgICB0aGlzLl90cmFpbFRlbXBsYXRlID1cclxuICAgICAgICAnTSB7c3RhcnRNYXJnaW59LHtoYWxmT2ZTdHJva2VXaWR0aH0nICtcclxuICAgICAgICAnIEwge3dpZHRofSx7aGFsZk9mU3Ryb2tlV2lkdGh9JyArXHJcbiAgICAgICAgJyBMIHt3aWR0aH0se3dpZHRofScgK1xyXG4gICAgICAgICcgTCB7aGFsZk9mU3Ryb2tlV2lkdGh9LHt3aWR0aH0nICtcclxuICAgICAgICAnIEwge2hhbGZPZlN0cm9rZVdpZHRofSx7aGFsZk9mU3Ryb2tlV2lkdGh9JztcclxuXHJcbiAgICBTaGFwZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuU3F1YXJlLnByb3RvdHlwZSA9IG5ldyBTaGFwZSgpO1xyXG5TcXVhcmUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3F1YXJlO1xyXG5cclxuU3F1YXJlLnByb3RvdHlwZS5fcGF0aFN0cmluZyA9IGZ1bmN0aW9uIF9wYXRoU3RyaW5nKG9wdHMpIHtcclxuICAgIHZhciB3ID0gMTAwIC0gb3B0cy5zdHJva2VXaWR0aCAvIDI7XHJcblxyXG4gICAgcmV0dXJuIHV0aWxzLnJlbmRlcih0aGlzLl9wYXRoVGVtcGxhdGUsIHtcclxuICAgICAgICB3aWR0aDogdyxcclxuICAgICAgICBzdHJva2VXaWR0aDogb3B0cy5zdHJva2VXaWR0aCxcclxuICAgICAgICBoYWxmT2ZTdHJva2VXaWR0aDogb3B0cy5zdHJva2VXaWR0aCAvIDJcclxuICAgIH0pO1xyXG59O1xyXG5cclxuU3F1YXJlLnByb3RvdHlwZS5fdHJhaWxTdHJpbmcgPSBmdW5jdGlvbiBfdHJhaWxTdHJpbmcob3B0cykge1xyXG4gICAgdmFyIHcgPSAxMDAgLSBvcHRzLnN0cm9rZVdpZHRoIC8gMjtcclxuXHJcbiAgICByZXR1cm4gdXRpbHMucmVuZGVyKHRoaXMuX3RyYWlsVGVtcGxhdGUsIHtcclxuICAgICAgICB3aWR0aDogdyxcclxuICAgICAgICBzdHJva2VXaWR0aDogb3B0cy5zdHJva2VXaWR0aCxcclxuICAgICAgICBoYWxmT2ZTdHJva2VXaWR0aDogb3B0cy5zdHJva2VXaWR0aCAvIDIsXHJcbiAgICAgICAgc3RhcnRNYXJnaW46IChvcHRzLnN0cm9rZVdpZHRoIC8gMikgLSAob3B0cy50cmFpbFdpZHRoIC8gMilcclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTcXVhcmU7XHJcbiIsIi8vIFV0aWxpdHkgZnVuY3Rpb25zXHJcblxyXG52YXIgUFJFRklYRVMgPSAnV2Via2l0IE1veiBPIG1zJy5zcGxpdCgnICcpO1xyXG5cclxuLy8gQ29weSBhbGwgYXR0cmlidXRlcyBmcm9tIHNvdXJjZSBvYmplY3QgdG8gZGVzdGluYXRpb24gb2JqZWN0LlxyXG4vLyBkZXN0aW5hdGlvbiBvYmplY3QgaXMgbXV0YXRlZC5cclxuZnVuY3Rpb24gZXh0ZW5kKGRlc3RpbmF0aW9uLCBzb3VyY2UsIHJlY3Vyc2l2ZSkge1xyXG4gICAgZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbiB8fCB7fTtcclxuICAgIHNvdXJjZSA9IHNvdXJjZSB8fCB7fTtcclxuICAgIHJlY3Vyc2l2ZSA9IHJlY3Vyc2l2ZSB8fCBmYWxzZTtcclxuXHJcbiAgICBmb3IgKHZhciBhdHRyTmFtZSBpbiBzb3VyY2UpIHtcclxuICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGF0dHJOYW1lKSkge1xyXG4gICAgICAgICAgICB2YXIgZGVzdFZhbCA9IGRlc3RpbmF0aW9uW2F0dHJOYW1lXTtcclxuICAgICAgICAgICAgdmFyIHNvdXJjZVZhbCA9IHNvdXJjZVthdHRyTmFtZV07XHJcbiAgICAgICAgICAgIGlmIChyZWN1cnNpdmUgJiYgaXNPYmplY3QoZGVzdFZhbCkgJiYgaXNPYmplY3Qoc291cmNlVmFsKSkge1xyXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25bYXR0ck5hbWVdID0gZXh0ZW5kKGRlc3RWYWwsIHNvdXJjZVZhbCwgcmVjdXJzaXZlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW2F0dHJOYW1lXSA9IHNvdXJjZVZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbn1cclxuXHJcbi8vIFJlbmRlcnMgdGVtcGxhdGVzIHdpdGggZ2l2ZW4gdmFyaWFibGVzLiBWYXJpYWJsZXMgbXVzdCBiZSBzdXJyb3VuZGVkIHdpdGhcclxuLy8gYnJhY2VzIHdpdGhvdXQgYW55IHNwYWNlcywgZS5nLiB7dmFyaWFibGV9XHJcbi8vIEFsbCBpbnN0YW5jZXMgb2YgdmFyaWFibGUgcGxhY2Vob2xkZXJzIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCBnaXZlbiBjb250ZW50XHJcbi8vIEV4YW1wbGU6XHJcbi8vIHJlbmRlcignSGVsbG8sIHttZXNzYWdlfSEnLCB7bWVzc2FnZTogJ3dvcmxkJ30pXHJcbmZ1bmN0aW9uIHJlbmRlcih0ZW1wbGF0ZSwgdmFycykge1xyXG4gICAgdmFyIHJlbmRlcmVkID0gdGVtcGxhdGU7XHJcblxyXG4gICAgZm9yICh2YXIga2V5IGluIHZhcnMpIHtcclxuICAgICAgICBpZiAodmFycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB2YXJzW2tleV07XHJcbiAgICAgICAgICAgIHZhciByZWdFeHBTdHJpbmcgPSAnXFxcXHsnICsga2V5ICsgJ1xcXFx9JztcclxuICAgICAgICAgICAgdmFyIHJlZ0V4cCA9IG5ldyBSZWdFeHAocmVnRXhwU3RyaW5nLCAnZycpO1xyXG5cclxuICAgICAgICAgICAgcmVuZGVyZWQgPSByZW5kZXJlZC5yZXBsYWNlKHJlZ0V4cCwgdmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlbmRlcmVkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRTdHlsZShlbGVtZW50LCBzdHlsZSwgdmFsdWUpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgUFJFRklYRVMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICB2YXIgcHJlZml4ID0gUFJFRklYRVNbaV07XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZVtwcmVmaXggKyBjYXBpdGFsaXplKHN0eWxlKV0gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50LnN0eWxlW3N0eWxlXSA9IHZhbHVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYXBpdGFsaXplKHRleHQpIHtcclxuICAgIHJldHVybiB0ZXh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGV4dC5zbGljZSgxKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgfHwgb2JqIGluc3RhbmNlb2YgU3RyaW5nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbic7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XHJcbn1cclxuXHJcbi8vIFJldHVybnMgdHJ1ZSBpZiBgb2JqYCBpcyBvYmplY3QgYXMgaW4ge2E6IDEsIGI6IDJ9LCBub3QgaWYgaXQncyBmdW5jdGlvbiBvclxyXG4vLyBhcnJheVxyXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcclxuICAgIGlmIChpc0FycmF5KG9iaikpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmo7XHJcbiAgICByZXR1cm4gdHlwZSA9PT0gJ29iamVjdCcgJiYgISFvYmo7XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGV4dGVuZDogZXh0ZW5kLFxyXG4gICAgcmVuZGVyOiByZW5kZXIsXHJcbiAgICBzZXRTdHlsZTogc2V0U3R5bGUsXHJcbiAgICBjYXBpdGFsaXplOiBjYXBpdGFsaXplLFxyXG4gICAgaXNTdHJpbmc6IGlzU3RyaW5nLFxyXG4gICAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcclxuICAgIGlzT2JqZWN0OiBpc09iamVjdFxyXG59O1xyXG4iXX0=
