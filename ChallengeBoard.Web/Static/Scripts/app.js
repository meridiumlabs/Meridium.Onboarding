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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Qcm9qZWN0cy9sYWJzL01lcmlkaXVtLkNoYWxsZW5nZUJvYXJkL0NoYWxsZW5nZUJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvTW9kdWxlcy9DaGFsbGVuZ2VDYXJkcy5qcyIsIkM6L1Byb2plY3RzL2xhYnMvTWVyaWRpdW0uQ2hhbGxlbmdlQm9hcmQvQ2hhbGxlbmdlQm9hcmQuV2ViL0NvbnRlbnQvU2NyaXB0cy9Nb2R1bGVzL1VzZXJJbmZvLmpzIiwiQzovUHJvamVjdHMvbGFicy9NZXJpZGl1bS5DaGFsbGVuZ2VCb2FyZC9DaGFsbGVuZ2VCb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL21haW4uanMiLCIuLi9DaGFsbGVuZ2VCb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL25vZGVfbW9kdWxlcy9wcm9ncmVzc2Jhci5qcy9ub2RlX21vZHVsZXMvc2hpZnR5L2Rpc3Qvc2hpZnR5LmpzIiwiLi4vQ2hhbGxlbmdlQm9hcmQuV2ViL0NvbnRlbnQvU2NyaXB0cy9ub2RlX21vZHVsZXMvcHJvZ3Jlc3NiYXIuanMvc3JjL2NpcmNsZS5qcyIsIi4uL0NoYWxsZW5nZUJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvbm9kZV9tb2R1bGVzL3Byb2dyZXNzYmFyLmpzL3NyYy9saW5lLmpzIiwiLi4vQ2hhbGxlbmdlQm9hcmQuV2ViL0NvbnRlbnQvU2NyaXB0cy9ub2RlX21vZHVsZXMvcHJvZ3Jlc3NiYXIuanMvc3JjL21haW4uanMiLCIuLi9DaGFsbGVuZ2VCb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL25vZGVfbW9kdWxlcy9wcm9ncmVzc2Jhci5qcy9zcmMvcGF0aC5qcyIsIi4uL0NoYWxsZW5nZUJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvbm9kZV9tb2R1bGVzL3Byb2dyZXNzYmFyLmpzL3NyYy9zaGFwZS5qcyIsIi4uL0NoYWxsZW5nZUJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvbm9kZV9tb2R1bGVzL3Byb2dyZXNzYmFyLmpzL3NyYy9zcXVhcmUuanMiLCIuLi9DaGFsbGVuZ2VCb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL25vZGVfbW9kdWxlcy9wcm9ncmVzc2Jhci5qcy9zcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7SUNBTSxjQUFjO0FBQ0wsYUFEVCxjQUFjLENBQ0osSUFBSSxFQUFFOzhCQURoQixjQUFjOztBQUVaLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0tBQzdCOztpQkFKQyxjQUFjOztlQUtFLDhCQUFHO0FBQ2pCLGdCQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsZ0JBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRCxpQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbkMscUJBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDM0MscUJBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNuQix3QkFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLHdCQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3RDLENBQUMsQ0FBQzthQUNOO1NBQ0o7OztlQUNrQiw2QkFBQyxJQUFJLEVBQUU7O0FBRXRCLGdCQUFJLHNCQUFzQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDdkUsZ0JBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDL0QsZ0JBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRTlDLGdCQUFJLHNCQUFzQixJQUFJLGdCQUFnQixFQUFFO0FBQzVDLHNCQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLG9CQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2FBQzNDLE1BQU07QUFDSCxvQkFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNyQyxvQkFBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ2xCLHdCQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RSxnQ0FBWSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDckU7YUFDSjs7QUFFRCxnQkFBSSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUN4RSxvQkFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNqQzs7O2VBQ3NCLGlDQUFDLElBQUksRUFBRTtBQUMxQixnQkFBSSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztBQUMvQixlQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3pDLGVBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUN6RCxlQUFHLENBQUMsTUFBTSxHQUFHLFlBQVk7QUFDckIsb0JBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7OztBQUdwQix3QkFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFDaEUsMEJBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLHVCQUF1QixHQUFHLFFBQVEsQ0FBQztBQUMxRCwyQkFBTztpQkFDVjthQUNKLENBQUM7QUFDRixlQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDcEIsa0JBQUUsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztBQUNoQywyQkFBVyxFQUFFLElBQUksQ0FBQyxJQUFJO0FBQ3RCLHNCQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO2FBQ2xELENBQUMsQ0FBQyxDQUFDO1NBQ1A7OztXQXREQyxjQUFjOzs7QUF3RHBCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDOzs7Ozs7Ozs7QUN4RGhDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztJQUV0QyxRQUFRO0FBQ0MsYUFEVCxRQUFRLENBQ0UsSUFBSSxFQUFFOzhCQURoQixRQUFROztBQUVOLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFO0FBQy9ELGlCQUFLLEVBQUUsU0FBUztBQUNoQix1QkFBVyxFQUFFLENBQUM7QUFDZCxrQkFBTSxFQUFFLFdBQVc7U0FDdEIsQ0FBQyxDQUFDO0FBQ0gsWUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ3pCOztpQkFUQyxRQUFROztlQVVJLDBCQUNkOzs7QUFDSSxnQkFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUM1QyxvQkFBUSxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixFQUFFLFVBQUEsS0FBSzt1QkFBSSxNQUFLLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7YUFBQSxDQUFDLENBQUM7U0FDbEc7OztlQUNjLDJCQUNmO0FBQ0ksZ0JBQUksYUFBYSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ25GLGdCQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM1RSxnQkFBSSxRQUFRLEdBQUcsYUFBYSxHQUFHLFFBQVEsQ0FBQztBQUN4QyxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7U0FHdEM7OztlQUNnQiwyQkFBQyxNQUFNLEVBQUU7QUFDdEIsbUJBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEIsZ0JBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDeEQsZ0JBQUksYUFBYSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXJELGdCQUFJLFFBQVEsR0FBRyxhQUFhLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hELHNCQUFVLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztBQUNsQyxnQkFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMvRyxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUduQyxnQkFBSSxRQUFRLElBQUksR0FBRyxFQUFFOztBQUVqQixvQkFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3ZELG9CQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDeEMseUJBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUNwQzthQUNKLE1BQU07O0FBRUgsb0JBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN2RCxvQkFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUN2Qyx5QkFBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3ZDO2FBQ0o7QUFDRCxnQkFBSSxhQUFhLElBQUksR0FBRyxFQUFFOztBQUV0QixvQkFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3ZELG9CQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDeEMseUJBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUNwQzthQUNKLE1BQU07O0FBRUgsb0JBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN2RCxvQkFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUN2Qyx5QkFBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3ZDO2FBQ0o7O0FBRUQsZ0JBQUksYUFBYSxJQUFJLEdBQUcsRUFBRTtBQUN0QixvQkFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3pELG9CQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDeEMseUJBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUNwQzthQUNKLE1BQU07QUFDSCxvQkFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3pELG9CQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQ3ZDLHlCQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDdkM7YUFDSjtBQUNELGdCQUFJLGFBQWEsSUFBSSxJQUFJLEVBQUU7QUFDdkIsb0JBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN4RCxvQkFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQ3hDLHlCQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDcEM7YUFDSixNQUFNO0FBQ0gsb0JBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN4RCxvQkFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUN2Qyx5QkFBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3ZDO2FBQ0o7QUFDRCxnQkFBSSxhQUFhLElBQUksSUFBSSxFQUFFO0FBQ3ZCLG9CQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDeEQsb0JBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUN4Qyx5QkFBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3BDO2FBQ0osTUFBTTtBQUNILG9CQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDeEQsb0JBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDdkMseUJBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN2QzthQUNKO1NBRUo7OztXQWhHQyxRQUFROzs7QUFrR2QsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7Ozs7Ozs7cUNDcEdDLDBCQUEwQjs7OzsrQkFDaEMsb0JBQW9COzs7O0FBRXpDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxVQUFTLEtBQUssRUFBRTs7QUFFMUQsUUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUM7O0FBRWhFLFFBQUksY0FBYyxHQUFHLHVDQUFtQixRQUFRLENBQUMsQ0FBQztBQUNsRCxRQUFJLFFBQVEsR0FBRyxpQ0FBYSxRQUFRLENBQUMsQ0FBQzs7QUFFdEMsWUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUUzQixRQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ2hELENBQUMsQ0FBQzs7Ozs7OztBQ2JIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoMkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIENoYWxsZW5nZUNhcmRzIHtcclxuICAgIGNvbnN0cnVjdG9yKHVzZXIpIHtcclxuICAgICAgICB0aGlzLnVzZXIgPSB1c2VyO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJDbGlja0V2ZW50KCk7XHJcbiAgICB9XHJcbiAgICByZWdpc3RlckNsaWNrRXZlbnQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjYXJkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjYXJkXCIpOyAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkrKykgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXJkc1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZUNoYWxsZW5nZUNhcmQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZUNoYWxsZW5nZU9uU2VydmVyKHRoaXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB1cGRhdGVDaGFsbGVuZ2VDYXJkKGNhcmQpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgY2FyZElzTWFya2VkQXNDb21wbGV0ZSA9IGNhcmQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2FyZC0tY29tcGxldGVcIik7XHJcbiAgICAgICAgdmFyIGNhcmRJc1NpbmdsZU9ubHkgPSBjYXJkLmNsYXNzTGlzdC5jb250YWlucyhcImNhcmQtLXNpbmdsZVwiKTtcclxuICAgICAgICB2YXIgcG9pbnRzID0gY2FyZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcG9pbnRzJyk7XHJcblxyXG4gICAgICAgIGlmIChjYXJkSXNNYXJrZWRBc0NvbXBsZXRlICYmIGNhcmRJc1NpbmdsZU9ubHkpIHtcclxuICAgICAgICAgICAgcG9pbnRzID0gcG9pbnRzICogLTE7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZShcImNhcmQtLWNvbXBsZXRlXCIpOyBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoXCJjYXJkLS1jb21wbGV0ZVwiKTsgXHJcbiAgICAgICAgICAgIGlmKCFjYXJkSXNTaW5nbGVPbmx5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudENvdW50ID0gY2FyZC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYXJkLWNvdW50LS1udW1iZXInKVswXTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb3VudC50ZXh0Q29udGVudCA9IHBhcnNlSW50KGN1cnJlbnRDb3VudC50ZXh0Q29udGVudCkgKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICAgICAgXHJcblxyXG4gICAgICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImNoYWxsZW5nZUNhcmRTYXZlZFwiLCB7IFwiZGV0YWlsXCI6IHBvaW50cyB9KTtcclxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuICAgIHVwZGF0ZUNoYWxsZW5nZU9uU2VydmVyKGNhcmQpIHsgICAgICAgIFxyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4aHIub3BlbignUE9TVCcsICdIb21lL1RvZ2dsZUNoYWxsZW5nZScpO1xyXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzICE9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIC8vU29tZXRoaW5nIHdlbnQgd3JvbmcgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgIC8vIHJldHVybiB0byBsb2dpbiBmb3JtXHJcbiAgICAgICAgICAgICAgICB2YXIgdXNlcm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXItaGlkZVwiKS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvQXV0aGVudGljYXRpb24/bmFtZT1cIiArIHVzZXJuYW1lO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgIFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBcclxuICAgICAgICAgICAgaWQ6IGNhcmQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyksXHJcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyOiB0aGlzLnVzZXIsXHJcbiAgICAgICAgICAgIHNpbmdsZTogY2FyZC5jbGFzc0xpc3QuY29udGFpbnMoXCJjYXJkLS1zaW5nbGVcIilcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBDaGFsbGVuZ2VDYXJkczsiLCJ2YXIgcHJvZ3Jlc3NiYXIgPSByZXF1aXJlKCdwcm9ncmVzc2Jhci5qcycpO1xyXG5cclxuY2xhc3MgVXNlckluZm8ge1xyXG4gICAgY29uc3RydWN0b3IodXNlcikge1xyXG4gICAgICAgIHRoaXMudXNlciA9IHVzZXI7XHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc0JhciA9IG5ldyBwcm9ncmVzc2Jhci5DaXJjbGUoJyNQcm9ncmVzc0JhckNvbnRhaW5lcicsIHtcclxuICAgICAgICAgICAgY29sb3I6ICcjMDBjYzk5JyxcclxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDMsXHJcbiAgICAgICAgICAgIGVhc2luZzogJ2Vhc2VJbk91dCdcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICB9XHJcbiAgICByZWdpc3RlckV2ZW50cygpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEV2ZW50KFwiY2hhbGxlbmdlQ2FyZFNhdmVkXCIpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFsbGVuZ2VDYXJkU2F2ZWRcIiwgZXZlbnQgPT4gdGhpcy51cGRhdGVQcm9ncmVzc0JhcihldmVudC5kZXRhaWwpKTtcclxuICAgIH1cclxuICAgIGluaXRQcm9ncmVzc0JhcigpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRQb2ludHMgPSBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnRyby1zY29yZScpLnRleHRDb250ZW50KTtcclxuICAgICAgICB2YXIgbWF4U2NvcmUgPSBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXgtc2NvcmUnKS50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgdmFyIHByb2dyZXNzID0gY3VycmVudFBvaW50cyAvIG1heFNjb3JlO1xyXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NCYXIuYW5pbWF0ZShwcm9ncmVzcyk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgdXBkYXRlUHJvZ3Jlc3NCYXIocG9pbnRzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocG9pbnRzKTtcclxuICAgICAgICB2YXIgc2NvcmVib2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnRyby1zY29yZScpO1xyXG4gICAgICAgIHZhciBjdXJyZW50UG9pbnRzID0gcGFyc2VJbnQoc2NvcmVib2FyZC50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIG5ld1Njb3JlID0gY3VycmVudFBvaW50cyArIHBhcnNlSW50KHBvaW50cyk7XHJcbiAgICAgICAgc2NvcmVib2FyZC50ZXh0Q29udGVudCA9IG5ld1Njb3JlO1xyXG4gICAgICAgIHZhciBwcm9ncmVzcyA9IHBhcnNlRmxvYXQoc2NvcmVib2FyZC50ZXh0Q29udGVudCkvcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWF4LXNjb3JlJykudGV4dENvbnRlbnQpO1xyXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NCYXIuYW5pbWF0ZShwcm9ncmVzcyk7XHJcblxyXG4gICAgICAgIC8vdXBkYXRlIGJvbnVzIHJpbmdzXHJcbiAgICAgICAgaWYgKG5ld1Njb3JlID49IDEwMCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbnVzLWxldmVsLW9uZScpO1xyXG4gICAgICAgICAgICBpZiAoIWxldmVsLmNsYXNzTGlzdC5jb250YWlucyhcImZ1bGZpbGxlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuY2xhc3NMaXN0LmFkZChcImZ1bGZpbGxlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgbGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9udXMtbGV2ZWwtb25lJyk7XHJcbiAgICAgICAgICAgIGlmIChsZXZlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJmdWxmaWxsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGN1cnJlbnRQb2ludHMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgbGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9udXMtbGV2ZWwtdHdvJyk7XHJcbiAgICAgICAgICAgIGlmICghbGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QuYWRkKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib251cy1sZXZlbC10d28nKTtcclxuICAgICAgICAgICAgaWYgKGxldmVsLmNsYXNzTGlzdC5jb250YWlucyhcImZ1bGZpbGxlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuY2xhc3NMaXN0LnJlbW92ZShcImZ1bGZpbGxlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGlmIChjdXJyZW50UG9pbnRzID49IDgwMCkge1xyXG4gICAgICAgICAgICB2YXIgbGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9udXMtbGV2ZWwtdGhyZWUnKTtcclxuICAgICAgICAgICAgaWYgKCFsZXZlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLmNsYXNzTGlzdC5hZGQoXCJmdWxmaWxsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgbGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9udXMtbGV2ZWwtdGhyZWUnKTtcclxuICAgICAgICAgICAgaWYgKGxldmVsLmNsYXNzTGlzdC5jb250YWlucyhcImZ1bGZpbGxlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuY2xhc3NMaXN0LnJlbW92ZShcImZ1bGZpbGxlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudFBvaW50cyA+PSAxMzAwKSB7XHJcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib251cy1sZXZlbC1mb3VyJyk7XHJcbiAgICAgICAgICAgIGlmICghbGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QuYWRkKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbnVzLWxldmVsLWZvdXInKTtcclxuICAgICAgICAgICAgaWYgKGxldmVsLmNsYXNzTGlzdC5jb250YWlucyhcImZ1bGZpbGxlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuY2xhc3NMaXN0LnJlbW92ZShcImZ1bGZpbGxlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudFBvaW50cyA+PSAyMDAwKSB7XHJcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib251cy1sZXZlbC1maXZlJyk7XHJcbiAgICAgICAgICAgIGlmICghbGV2ZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5jbGFzc0xpc3QuYWRkKFwiZnVsZmlsbGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbnVzLWxldmVsLWZpdmUnKTtcclxuICAgICAgICAgICAgaWYgKGxldmVsLmNsYXNzTGlzdC5jb250YWlucyhcImZ1bGZpbGxlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuY2xhc3NMaXN0LnJlbW92ZShcImZ1bGZpbGxlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBVc2VySW5mbzsiLCJpbXBvcnQgQ2hhbGxlbmdlQ2FyZHMgZnJvbSBcIi4vTW9kdWxlcy9DaGFsbGVuZ2VDYXJkc1wiO1xyXG5pbXBvcnQgVXNlckluZm8gZnJvbSBcIi4vTW9kdWxlcy9Vc2VySW5mb1wiO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICB2YXIgdXNlcm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXItaGlkZVwiKS50ZXh0Q29udGVudDtcclxuICAgIFxyXG4gICAgdmFyIGNoYWxsZW5nZUNhcmRzID0gbmV3IENoYWxsZW5nZUNhcmRzKHVzZXJuYW1lKTtcclxuICAgIHZhciB1c2VySW5mbyA9IG5ldyBVc2VySW5mbyh1c2VybmFtZSk7XHJcblxyXG4gICAgdXNlckluZm8uaW5pdFByb2dyZXNzQmFyKCk7XHJcblxyXG4gICAgdmFyIGNhcmRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0NhcmRzJyk7XHJcbn0pO1xyXG4vKnZhciBtc25yeSA9IG5ldyBNYXNvbnJ5KCBjYXJkcywge1xyXG4gIGl0ZW1TZWxlY3RvcjogJy5pdGVtJyxcclxuICBjb2x1bW5XaWR0aDogMjIwXHJcbn0pOyovIiwiLyohIHNoaWZ0eSAtIHYxLjIuMiAtIDIwMTQtMTAtMDkgLSBodHRwOi8vamVyZW15Y2thaG4uZ2l0aHViLmlvL3NoaWZ0eSAqL1xuOyhmdW5jdGlvbiAocm9vdCkge1xuXG4vKiFcbiAqIFNoaWZ0eSBDb3JlXG4gKiBCeSBKZXJlbXkgS2FobiAtIGplcmVteWNrYWhuQGdtYWlsLmNvbVxuICovXG5cbi8vIFVnbGlmeUpTIGRlZmluZSBoYWNrLiAgVXNlZCBmb3IgdW5pdCB0ZXN0aW5nLiAgQ29udGVudHMgb2YgdGhpcyBpZiBhcmVcbi8vIGNvbXBpbGVkIGF3YXkuXG5pZiAodHlwZW9mIFNISUZUWV9ERUJVR19OT1cgPT09ICd1bmRlZmluZWQnKSB7XG4gIFNISUZUWV9ERUJVR19OT1cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICtuZXcgRGF0ZSgpO1xuICB9O1xufVxuXG52YXIgVHdlZW5hYmxlID0gKGZ1bmN0aW9uICgpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQWxpYXNlcyB0aGF0IGdldCBkZWZpbmVkIGxhdGVyIGluIHRoaXMgZnVuY3Rpb25cbiAgdmFyIGZvcm11bGE7XG5cbiAgLy8gQ09OU1RBTlRTXG4gIHZhciBERUZBVUxUX1NDSEVEVUxFX0ZVTkNUSU9OO1xuICB2YXIgREVGQVVMVF9FQVNJTkcgPSAnbGluZWFyJztcbiAgdmFyIERFRkFVTFRfRFVSQVRJT04gPSA1MDA7XG4gIHZhciBVUERBVEVfVElNRSA9IDEwMDAgLyA2MDtcblxuICB2YXIgX25vdyA9IERhdGUubm93XG4gICAgICAgPyBEYXRlLm5vd1xuICAgICAgIDogZnVuY3Rpb24gKCkge3JldHVybiArbmV3IERhdGUoKTt9O1xuXG4gIHZhciBub3cgPSBTSElGVFlfREVCVUdfTk9XXG4gICAgICAgPyBTSElGVFlfREVCVUdfTk9XXG4gICAgICAgOiBfbm93O1xuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSgpIHNoaW0gYnkgUGF1bCBJcmlzaCAobW9kaWZpZWQgZm9yIFNoaWZ0eSlcbiAgICAvLyBodHRwOi8vcGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xuICAgIERFRkFVTFRfU0NIRURVTEVfRlVOQ1RJT04gPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxuICAgICAgIHx8IHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgfHwgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgfHwgKHdpbmRvdy5tb3pDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICAmJiB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgICAgIHx8IHNldFRpbWVvdXQ7XG4gIH0gZWxzZSB7XG4gICAgREVGQVVMVF9TQ0hFRFVMRV9GVU5DVElPTiA9IHNldFRpbWVvdXQ7XG4gIH1cblxuICBmdW5jdGlvbiBub29wICgpIHtcbiAgICAvLyBOT09QIVxuICB9XG5cbiAgLyohXG4gICAqIEhhbmR5IHNob3J0Y3V0IGZvciBkb2luZyBhIGZvci1pbiBsb29wLiBUaGlzIGlzIG5vdCBhIFwibm9ybWFsXCIgZWFjaFxuICAgKiBmdW5jdGlvbiwgaXQgaXMgb3B0aW1pemVkIGZvciBTaGlmdHkuICBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gb25seSByZWNlaXZlc1xuICAgKiB0aGUgcHJvcGVydHkgbmFtZSwgbm90IHRoZSB2YWx1ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgKiBAcGFyYW0ge0Z1bmN0aW9uKHN0cmluZyl9IGZuXG4gICAqL1xuICBmdW5jdGlvbiBlYWNoIChvYmosIGZuKSB7XG4gICAgdmFyIGtleTtcbiAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4oa2V5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiFcbiAgICogUGVyZm9ybSBhIHNoYWxsb3cgY29weSBvZiBPYmplY3QgcHJvcGVydGllcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldE9iamVjdCBUaGUgb2JqZWN0IHRvIGNvcHkgaW50b1xuICAgKiBAcGFyYW0ge09iamVjdH0gc3JjT2JqZWN0IFRoZSBvYmplY3QgdG8gY29weSBmcm9tXG4gICAqIEByZXR1cm4ge09iamVjdH0gQSByZWZlcmVuY2UgdG8gdGhlIGF1Z21lbnRlZCBgdGFyZ2V0T2JqYCBPYmplY3RcbiAgICovXG4gIGZ1bmN0aW9uIHNoYWxsb3dDb3B5ICh0YXJnZXRPYmosIHNyY09iaikge1xuICAgIGVhY2goc3JjT2JqLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdGFyZ2V0T2JqW3Byb3BdID0gc3JjT2JqW3Byb3BdO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRhcmdldE9iajtcbiAgfVxuXG4gIC8qIVxuICAgKiBDb3BpZXMgZWFjaCBwcm9wZXJ0eSBmcm9tIHNyYyBvbnRvIHRhcmdldCwgYnV0IG9ubHkgaWYgdGhlIHByb3BlcnR5IHRvXG4gICAqIGNvcHkgdG8gdGFyZ2V0IGlzIHVuZGVmaW5lZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBNaXNzaW5nIHByb3BlcnRpZXMgaW4gdGhpcyBPYmplY3QgYXJlIGZpbGxlZCBpblxuICAgKiBAcGFyYW0ge09iamVjdH0gc3JjXG4gICAqL1xuICBmdW5jdGlvbiBkZWZhdWx0cyAodGFyZ2V0LCBzcmMpIHtcbiAgICBlYWNoKHNyYywgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W3Byb3BdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0YXJnZXRbcHJvcF0gPSBzcmNbcHJvcF07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiFcbiAgICogQ2FsY3VsYXRlcyB0aGUgaW50ZXJwb2xhdGVkIHR3ZWVuIHZhbHVlcyBvZiBhbiBPYmplY3QgZm9yIGEgZ2l2ZW5cbiAgICogdGltZXN0YW1wLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZm9yUG9zaXRpb24gVGhlIHBvc2l0aW9uIHRvIGNvbXB1dGUgdGhlIHN0YXRlIGZvci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGN1cnJlbnRTdGF0ZSBDdXJyZW50IHN0YXRlIHByb3BlcnRpZXMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcmlnaW5hbFN0YXRlOiBUaGUgb3JpZ2luYWwgc3RhdGUgcHJvcGVydGllcyB0aGUgT2JqZWN0IGlzXG4gICAqIHR3ZWVuaW5nIGZyb20uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRTdGF0ZTogVGhlIGRlc3RpbmF0aW9uIHN0YXRlIHByb3BlcnRpZXMgdGhlIE9iamVjdFxuICAgKiBpcyB0d2VlbmluZyB0by5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uOiBUaGUgbGVuZ3RoIG9mIHRoZSB0d2VlbiBpbiBtaWxsaXNlY29uZHMuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lc3RhbXA6IFRoZSBVTklYIGVwb2NoIHRpbWUgYXQgd2hpY2ggdGhlIHR3ZWVuIGJlZ2FuLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nOiBUaGlzIE9iamVjdCdzIGtleXMgbXVzdCBjb3JyZXNwb25kIHRvIHRoZSBrZXlzIGluXG4gICAqIHRhcmdldFN0YXRlLlxuICAgKi9cbiAgZnVuY3Rpb24gdHdlZW5Qcm9wcyAoZm9yUG9zaXRpb24sIGN1cnJlbnRTdGF0ZSwgb3JpZ2luYWxTdGF0ZSwgdGFyZ2V0U3RhdGUsXG4gICAgZHVyYXRpb24sIHRpbWVzdGFtcCwgZWFzaW5nKSB7XG4gICAgdmFyIG5vcm1hbGl6ZWRQb3NpdGlvbiA9IChmb3JQb3NpdGlvbiAtIHRpbWVzdGFtcCkgLyBkdXJhdGlvbjtcblxuICAgIHZhciBwcm9wO1xuICAgIGZvciAocHJvcCBpbiBjdXJyZW50U3RhdGUpIHtcbiAgICAgIGlmIChjdXJyZW50U3RhdGUuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgY3VycmVudFN0YXRlW3Byb3BdID0gdHdlZW5Qcm9wKG9yaWdpbmFsU3RhdGVbcHJvcF0sXG4gICAgICAgICAgdGFyZ2V0U3RhdGVbcHJvcF0sIGZvcm11bGFbZWFzaW5nW3Byb3BdXSwgbm9ybWFsaXplZFBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY3VycmVudFN0YXRlO1xuICB9XG5cbiAgLyohXG4gICAqIFR3ZWVucyBhIHNpbmdsZSBwcm9wZXJ0eS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IFRoZSB2YWx1ZSB0aGF0IHRoZSB0d2VlbiBzdGFydGVkIGZyb20uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhlIHZhbHVlIHRoYXQgdGhlIHR3ZWVuIHNob3VsZCBlbmQgYXQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGVhc2luZ0Z1bmMgVGhlIGVhc2luZyBjdXJ2ZSB0byBhcHBseSB0byB0aGUgdHdlZW4uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBUaGUgbm9ybWFsaXplZCBwb3NpdGlvbiAoYmV0d2VlbiAwLjAgYW5kIDEuMCkgdG9cbiAgICogY2FsY3VsYXRlIHRoZSBtaWRwb2ludCBvZiAnc3RhcnQnIGFuZCAnZW5kJyBhZ2FpbnN0LlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSB0d2VlbmVkIHZhbHVlLlxuICAgKi9cbiAgZnVuY3Rpb24gdHdlZW5Qcm9wIChzdGFydCwgZW5kLCBlYXNpbmdGdW5jLCBwb3NpdGlvbikge1xuICAgIHJldHVybiBzdGFydCArIChlbmQgLSBzdGFydCkgKiBlYXNpbmdGdW5jKHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qIVxuICAgKiBBcHBsaWVzIGEgZmlsdGVyIHRvIFR3ZWVuYWJsZSBpbnN0YW5jZS5cbiAgICogQHBhcmFtIHtUd2VlbmFibGV9IHR3ZWVuYWJsZSBUaGUgYFR3ZWVuYWJsZWAgaW5zdGFuY2UgdG8gY2FsbCB0aGUgZmlsdGVyXG4gICAqIHVwb24uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmaWx0ZXJOYW1lIFRoZSBuYW1lIG9mIHRoZSBmaWx0ZXIgdG8gYXBwbHkuXG4gICAqL1xuICBmdW5jdGlvbiBhcHBseUZpbHRlciAodHdlZW5hYmxlLCBmaWx0ZXJOYW1lKSB7XG4gICAgdmFyIGZpbHRlcnMgPSBUd2VlbmFibGUucHJvdG90eXBlLmZpbHRlcjtcbiAgICB2YXIgYXJncyA9IHR3ZWVuYWJsZS5fZmlsdGVyQXJncztcblxuICAgIGVhY2goZmlsdGVycywgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgZmlsdGVyc1tuYW1lXVtmaWx0ZXJOYW1lXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmlsdGVyc1tuYW1lXVtmaWx0ZXJOYW1lXS5hcHBseSh0d2VlbmFibGUsIGFyZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdmFyIHRpbWVvdXRIYW5kbGVyX2VuZFRpbWU7XG4gIHZhciB0aW1lb3V0SGFuZGxlcl9jdXJyZW50VGltZTtcbiAgdmFyIHRpbWVvdXRIYW5kbGVyX2lzRW5kZWQ7XG4gIC8qIVxuICAgKiBIYW5kbGVzIHRoZSB1cGRhdGUgbG9naWMgZm9yIG9uZSBzdGVwIG9mIGEgdHdlZW4uXG4gICAqIEBwYXJhbSB7VHdlZW5hYmxlfSB0d2VlbmFibGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVzdGFtcFxuICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IGN1cnJlbnRTdGF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3JpZ2luYWxTdGF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0U3RhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdGVwXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24oRnVuY3Rpb24sbnVtYmVyKX19IHNjaGVkdWxlXG4gICAqL1xuICBmdW5jdGlvbiB0aW1lb3V0SGFuZGxlciAodHdlZW5hYmxlLCB0aW1lc3RhbXAsIGR1cmF0aW9uLCBjdXJyZW50U3RhdGUsXG4gICAgb3JpZ2luYWxTdGF0ZSwgdGFyZ2V0U3RhdGUsIGVhc2luZywgc3RlcCwgc2NoZWR1bGUpIHtcbiAgICB0aW1lb3V0SGFuZGxlcl9lbmRUaW1lID0gdGltZXN0YW1wICsgZHVyYXRpb247XG4gICAgdGltZW91dEhhbmRsZXJfY3VycmVudFRpbWUgPSBNYXRoLm1pbihub3coKSwgdGltZW91dEhhbmRsZXJfZW5kVGltZSk7XG4gICAgdGltZW91dEhhbmRsZXJfaXNFbmRlZCA9IHRpbWVvdXRIYW5kbGVyX2N1cnJlbnRUaW1lID49IHRpbWVvdXRIYW5kbGVyX2VuZFRpbWU7XG5cbiAgICBpZiAodHdlZW5hYmxlLmlzUGxheWluZygpICYmICF0aW1lb3V0SGFuZGxlcl9pc0VuZGVkKSB7XG4gICAgICBzY2hlZHVsZSh0d2VlbmFibGUuX3RpbWVvdXRIYW5kbGVyLCBVUERBVEVfVElNRSk7XG5cbiAgICAgIGFwcGx5RmlsdGVyKHR3ZWVuYWJsZSwgJ2JlZm9yZVR3ZWVuJyk7XG4gICAgICB0d2VlblByb3BzKHRpbWVvdXRIYW5kbGVyX2N1cnJlbnRUaW1lLCBjdXJyZW50U3RhdGUsIG9yaWdpbmFsU3RhdGUsXG4gICAgICAgIHRhcmdldFN0YXRlLCBkdXJhdGlvbiwgdGltZXN0YW1wLCBlYXNpbmcpO1xuICAgICAgYXBwbHlGaWx0ZXIodHdlZW5hYmxlLCAnYWZ0ZXJUd2VlbicpO1xuXG4gICAgICBzdGVwKGN1cnJlbnRTdGF0ZSk7XG4gICAgfSBlbHNlIGlmICh0aW1lb3V0SGFuZGxlcl9pc0VuZGVkKSB7XG4gICAgICBzdGVwKHRhcmdldFN0YXRlKTtcbiAgICAgIHR3ZWVuYWJsZS5zdG9wKHRydWUpO1xuICAgIH1cbiAgfVxuXG5cbiAgLyohXG4gICAqIENyZWF0ZXMgYSB1c2FibGUgZWFzaW5nIE9iamVjdCBmcm9tIGVpdGhlciBhIHN0cmluZyBvciBhbm90aGVyIGVhc2luZ1xuICAgKiBPYmplY3QuICBJZiBgZWFzaW5nYCBpcyBhbiBPYmplY3QsIHRoZW4gdGhpcyBmdW5jdGlvbiBjbG9uZXMgaXQgYW5kIGZpbGxzXG4gICAqIGluIHRoZSBtaXNzaW5nIHByb3BlcnRpZXMgd2l0aCBcImxpbmVhclwiLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZnJvbVR3ZWVuUGFyYW1zXG4gICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gZWFzaW5nXG4gICAqL1xuICBmdW5jdGlvbiBjb21wb3NlRWFzaW5nT2JqZWN0IChmcm9tVHdlZW5QYXJhbXMsIGVhc2luZykge1xuICAgIHZhciBjb21wb3NlZEVhc2luZyA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBlYXNpbmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlYWNoKGZyb21Ud2VlblBhcmFtcywgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgY29tcG9zZWRFYXNpbmdbcHJvcF0gPSBlYXNpbmc7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWFjaChmcm9tVHdlZW5QYXJhbXMsIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgIGlmICghY29tcG9zZWRFYXNpbmdbcHJvcF0pIHtcbiAgICAgICAgICBjb21wb3NlZEVhc2luZ1twcm9wXSA9IGVhc2luZ1twcm9wXSB8fCBERUZBVUxUX0VBU0lORztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbXBvc2VkRWFzaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIFR3ZWVuYWJsZSBjb25zdHJ1Y3Rvci5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfaW5pdGlhbFN0YXRlIFRoZSB2YWx1ZXMgdGhhdCB0aGUgaW5pdGlhbCB0d2VlbiBzaG91bGQgc3RhcnQgYXQgaWYgYSBcImZyb21cIiBvYmplY3QgaXMgbm90IHByb3ZpZGVkIHRvIFR3ZWVuYWJsZSN0d2Vlbi5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfY29uZmlnIFNlZSBUd2VlbmFibGUucHJvdG90eXBlLnNldENvbmZpZygpXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgZnVuY3Rpb24gVHdlZW5hYmxlIChvcHRfaW5pdGlhbFN0YXRlLCBvcHRfY29uZmlnKSB7XG4gICAgdGhpcy5fY3VycmVudFN0YXRlID0gb3B0X2luaXRpYWxTdGF0ZSB8fCB7fTtcbiAgICB0aGlzLl9jb25maWd1cmVkID0gZmFsc2U7XG4gICAgdGhpcy5fc2NoZWR1bGVGdW5jdGlvbiA9IERFRkFVTFRfU0NIRURVTEVfRlVOQ1RJT047XG5cbiAgICAvLyBUbyBwcmV2ZW50IHVubmVjZXNzYXJ5IGNhbGxzIHRvIHNldENvbmZpZyBkbyBub3Qgc2V0IGRlZmF1bHQgY29uZmlndXJhdGlvbiBoZXJlLlxuICAgIC8vIE9ubHkgc2V0IGRlZmF1bHQgY29uZmlndXJhdGlvbiBpbW1lZGlhdGVseSBiZWZvcmUgdHdlZW5pbmcgaWYgbm9uZSBoYXMgYmVlbiBzZXQuXG4gICAgaWYgKHR5cGVvZiBvcHRfY29uZmlnICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5zZXRDb25maWcob3B0X2NvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSBhbmQgc3RhcnQgYSB0d2Vlbi5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfY29uZmlnIFNlZSBUd2VlbmFibGUucHJvdG90eXBlLnNldENvbmZpZygpXG4gICAqIEByZXR1cm4ge1R3ZWVuYWJsZX1cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUudHdlZW4gPSBmdW5jdGlvbiAob3B0X2NvbmZpZykge1xuICAgIGlmICh0aGlzLl9pc1R3ZWVuaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBPbmx5IHNldCBkZWZhdWx0IGNvbmZpZyBpZiBubyBjb25maWd1cmF0aW9uIGhhcyBiZWVuIHNldCBwcmV2aW91c2x5IGFuZCBub25lIGlzIHByb3ZpZGVkIG5vdy5cbiAgICBpZiAob3B0X2NvbmZpZyAhPT0gdW5kZWZpbmVkIHx8ICF0aGlzLl9jb25maWd1cmVkKSB7XG4gICAgICB0aGlzLnNldENvbmZpZyhvcHRfY29uZmlnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zdGFydCh0aGlzLmdldCgpKTtcbiAgICByZXR1cm4gdGhpcy5yZXN1bWUoKTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0cyB0aGUgdHdlZW4gY29uZmlndXJhdGlvbi4gYGNvbmZpZ2AgbWF5IGhhdmUgdGhlIGZvbGxvd2luZyBvcHRpb25zOlxuICAgKlxuICAgKiAtIF9fZnJvbV9fIChfT2JqZWN0PV8pOiBTdGFydGluZyBwb3NpdGlvbi4gIElmIG9taXR0ZWQsIHRoZSBjdXJyZW50IHN0YXRlIGlzIHVzZWQuXG4gICAqIC0gX190b19fIChfT2JqZWN0PV8pOiBFbmRpbmcgcG9zaXRpb24uXG4gICAqIC0gX19kdXJhdGlvbl9fIChfbnVtYmVyPV8pOiBIb3cgbWFueSBtaWxsaXNlY29uZHMgdG8gYW5pbWF0ZSBmb3IuXG4gICAqIC0gX19zdGFydF9fIChfRnVuY3Rpb24oT2JqZWN0KT1fKTogRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSB0d2VlbiBiZWdpbnMuICBSZWNlaXZlcyB0aGUgc3RhdGUgb2YgdGhlIHR3ZWVuIGFzIHRoZSBvbmx5IHBhcmFtZXRlci5cbiAgICogLSBfX3N0ZXBfXyAoX0Z1bmN0aW9uKE9iamVjdCk9Xyk6IEZ1bmN0aW9uIHRvIGV4ZWN1dGUgb24gZXZlcnkgdGljay4gIFJlY2VpdmVzIHRoZSBzdGF0ZSBvZiB0aGUgdHdlZW4gYXMgdGhlIG9ubHkgcGFyYW1ldGVyLiAgVGhpcyBmdW5jdGlvbiBpcyBub3QgY2FsbGVkIG9uIHRoZSBmaW5hbCBzdGVwIG9mIHRoZSBhbmltYXRpb24sIGJ1dCBgZmluaXNoYCBpcy5cbiAgICogLSBfX2ZpbmlzaF9fIChfRnVuY3Rpb24oT2JqZWN0KT1fKTogRnVuY3Rpb24gdG8gZXhlY3V0ZSB1cG9uIHR3ZWVuIGNvbXBsZXRpb24uICBSZWNlaXZlcyB0aGUgc3RhdGUgb2YgdGhlIHR3ZWVuIGFzIHRoZSBvbmx5IHBhcmFtZXRlci5cbiAgICogLSBfX2Vhc2luZ19fIChfT2JqZWN0fHN0cmluZz1fKTogRWFzaW5nIGN1cnZlIG5hbWUocykgdG8gdXNlIGZvciB0aGUgdHdlZW4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAgICogQHJldHVybiB7VHdlZW5hYmxlfVxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5zZXRDb25maWcgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgIHRoaXMuX2NvbmZpZ3VyZWQgPSB0cnVlO1xuXG4gICAgLy8gSW5pdCB0aGUgaW50ZXJuYWwgc3RhdGVcbiAgICB0aGlzLl9wYXVzZWRBdFRpbWUgPSBudWxsO1xuICAgIHRoaXMuX3N0YXJ0ID0gY29uZmlnLnN0YXJ0IHx8IG5vb3A7XG4gICAgdGhpcy5fc3RlcCA9IGNvbmZpZy5zdGVwIHx8IG5vb3A7XG4gICAgdGhpcy5fZmluaXNoID0gY29uZmlnLmZpbmlzaCB8fCBub29wO1xuICAgIHRoaXMuX2R1cmF0aW9uID0gY29uZmlnLmR1cmF0aW9uIHx8IERFRkFVTFRfRFVSQVRJT047XG4gICAgdGhpcy5fY3VycmVudFN0YXRlID0gY29uZmlnLmZyb20gfHwgdGhpcy5nZXQoKTtcbiAgICB0aGlzLl9vcmlnaW5hbFN0YXRlID0gdGhpcy5nZXQoKTtcbiAgICB0aGlzLl90YXJnZXRTdGF0ZSA9IGNvbmZpZy50byB8fCB0aGlzLmdldCgpO1xuICAgIHRoaXMuX3RpbWVzdGFtcCA9IG5vdygpO1xuXG4gICAgLy8gQWxpYXNlcyB1c2VkIGJlbG93XG4gICAgdmFyIGN1cnJlbnRTdGF0ZSA9IHRoaXMuX2N1cnJlbnRTdGF0ZTtcbiAgICB2YXIgdGFyZ2V0U3RhdGUgPSB0aGlzLl90YXJnZXRTdGF0ZTtcblxuICAgIC8vIEVuc3VyZSB0aGF0IHRoZXJlIGlzIGFsd2F5cyBzb21ldGhpbmcgdG8gdHdlZW4gdG8uXG4gICAgZGVmYXVsdHModGFyZ2V0U3RhdGUsIGN1cnJlbnRTdGF0ZSk7XG5cbiAgICB0aGlzLl9lYXNpbmcgPSBjb21wb3NlRWFzaW5nT2JqZWN0KFxuICAgICAgY3VycmVudFN0YXRlLCBjb25maWcuZWFzaW5nIHx8IERFRkFVTFRfRUFTSU5HKTtcblxuICAgIHRoaXMuX2ZpbHRlckFyZ3MgPVxuICAgICAgW2N1cnJlbnRTdGF0ZSwgdGhpcy5fb3JpZ2luYWxTdGF0ZSwgdGFyZ2V0U3RhdGUsIHRoaXMuX2Vhc2luZ107XG5cbiAgICBhcHBseUZpbHRlcih0aGlzLCAndHdlZW5DcmVhdGVkJyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBzaGFsbG93Q29weSh7fSwgdGhpcy5fY3VycmVudFN0YXRlKTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0cyB0aGUgY3VycmVudCBzdGF0ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHRoaXMuX2N1cnJlbnRTdGF0ZSA9IHN0YXRlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQYXVzZXMgYSB0d2Vlbi4gIFBhdXNlZCB0d2VlbnMgY2FuIGJlIHJlc3VtZWQgZnJvbSB0aGUgcG9pbnQgYXQgd2hpY2ggdGhleSB3ZXJlIHBhdXNlZC4gIFRoaXMgaXMgZGlmZmVyZW50IHRoYW4gW2BzdG9wKClgXSgjc3RvcCksIGFzIHRoYXQgbWV0aG9kIGNhdXNlcyBhIHR3ZWVuIHRvIHN0YXJ0IG92ZXIgd2hlbiBpdCBpcyByZXN1bWVkLlxuICAgKiBAcmV0dXJuIHtUd2VlbmFibGV9XG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX3BhdXNlZEF0VGltZSA9IG5vdygpO1xuICAgIHRoaXMuX2lzUGF1c2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogUmVzdW1lcyBhIHBhdXNlZCB0d2Vlbi5cbiAgICogQHJldHVybiB7VHdlZW5hYmxlfVxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX2lzUGF1c2VkKSB7XG4gICAgICB0aGlzLl90aW1lc3RhbXAgKz0gbm93KCkgLSB0aGlzLl9wYXVzZWRBdFRpbWU7XG4gICAgfVxuXG4gICAgdGhpcy5faXNQYXVzZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9pc1R3ZWVuaW5nID0gdHJ1ZTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLl90aW1lb3V0SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRpbWVvdXRIYW5kbGVyKHNlbGYsIHNlbGYuX3RpbWVzdGFtcCwgc2VsZi5fZHVyYXRpb24sIHNlbGYuX2N1cnJlbnRTdGF0ZSxcbiAgICAgICAgc2VsZi5fb3JpZ2luYWxTdGF0ZSwgc2VsZi5fdGFyZ2V0U3RhdGUsIHNlbGYuX2Vhc2luZywgc2VsZi5fc3RlcCxcbiAgICAgICAgc2VsZi5fc2NoZWR1bGVGdW5jdGlvbik7XG4gICAgfTtcblxuICAgIHRoaXMuX3RpbWVvdXRIYW5kbGVyKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogU3RvcHMgYW5kIGNhbmNlbHMgYSB0d2Vlbi5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gZ290b0VuZCBJZiBmYWxzZSBvciBvbWl0dGVkLCB0aGUgdHdlZW4ganVzdCBzdG9wcyBhdCBpdHMgY3VycmVudCBzdGF0ZSwgYW5kIHRoZSBcImZpbmlzaFwiIGhhbmRsZXIgaXMgbm90IGludm9rZWQuICBJZiB0cnVlLCB0aGUgdHdlZW5lZCBvYmplY3QncyB2YWx1ZXMgYXJlIGluc3RhbnRseSBzZXQgdG8gdGhlIHRhcmdldCB2YWx1ZXMsIGFuZCBcImZpbmlzaFwiIGlzIGludm9rZWQuXG4gICAqIEByZXR1cm4ge1R3ZWVuYWJsZX1cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uIChnb3RvRW5kKSB7XG4gICAgdGhpcy5faXNUd2VlbmluZyA9IGZhbHNlO1xuICAgIHRoaXMuX2lzUGF1c2VkID0gZmFsc2U7XG4gICAgdGhpcy5fdGltZW91dEhhbmRsZXIgPSBub29wO1xuXG4gICAgaWYgKGdvdG9FbmQpIHtcbiAgICAgIHNoYWxsb3dDb3B5KHRoaXMuX2N1cnJlbnRTdGF0ZSwgdGhpcy5fdGFyZ2V0U3RhdGUpO1xuICAgICAgYXBwbHlGaWx0ZXIodGhpcywgJ2FmdGVyVHdlZW5FbmQnKTtcbiAgICAgIHRoaXMuX2ZpbmlzaC5jYWxsKHRoaXMsIHRoaXMuX2N1cnJlbnRTdGF0ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgYSB0d2VlbiBpcyBydW5uaW5nLlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5pc1BsYXlpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzVHdlZW5pbmcgJiYgIXRoaXMuX2lzUGF1c2VkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXRzIGEgY3VzdG9tIHNjaGVkdWxlIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBJZiBhIGN1c3RvbSBmdW5jdGlvbiBpcyBub3Qgc2V0IHRoZSBkZWZhdWx0IG9uZSBpcyB1c2VkIFtgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIGlmIGF2YWlsYWJsZSwgb3RoZXJ3aXNlIFtgc2V0VGltZW91dGBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XaW5kb3cuc2V0VGltZW91dCkpLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9uKEZ1bmN0aW9uLG51bWJlcil9IHNjaGVkdWxlRnVuY3Rpb24gVGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB0byBzY2hlZHVsZSB0aGUgbmV4dCBmcmFtZSB0byBiZSByZW5kZXJlZFxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5zZXRTY2hlZHVsZUZ1bmN0aW9uID0gZnVuY3Rpb24gKHNjaGVkdWxlRnVuY3Rpb24pIHtcbiAgICB0aGlzLl9zY2hlZHVsZUZ1bmN0aW9uID0gc2NoZWR1bGVGdW5jdGlvbjtcbiAgfTtcblxuICAvKipcbiAgICogYGRlbGV0ZWBzIGFsbCBcIm93blwiIHByb3BlcnRpZXMuICBDYWxsIHRoaXMgd2hlbiB0aGUgYFR3ZWVuYWJsZWAgaW5zdGFuY2UgaXMgbm8gbG9uZ2VyIG5lZWRlZCB0byBmcmVlIG1lbW9yeS5cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvcDtcbiAgICBmb3IgKHByb3AgaW4gdGhpcykge1xuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgZGVsZXRlIHRoaXNbcHJvcF07XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qIVxuICAgKiBGaWx0ZXJzIGFyZSB1c2VkIGZvciB0cmFuc2Zvcm1pbmcgdGhlIHByb3BlcnRpZXMgb2YgYSB0d2VlbiBhdCB2YXJpb3VzXG4gICAqIHBvaW50cyBpbiBhIFR3ZWVuYWJsZSdzIGxpZmUgY3ljbGUuICBTZWUgdGhlIFJFQURNRSBmb3IgbW9yZSBpbmZvIG9uIHRoaXMuXG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLmZpbHRlciA9IHt9O1xuXG4gIC8qIVxuICAgKiBUaGlzIG9iamVjdCBjb250YWlucyBhbGwgb2YgdGhlIHR3ZWVucyBhdmFpbGFibGUgdG8gU2hpZnR5LiAgSXQgaXMgZXh0ZW5kaWJsZSAtIHNpbXBseSBhdHRhY2ggcHJvcGVydGllcyB0byB0aGUgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhIE9iamVjdCBmb2xsb3dpbmcgdGhlIHNhbWUgZm9ybWF0IGF0IGxpbmVhci5cbiAgICpcbiAgICogYHBvc2Agc2hvdWxkIGJlIGEgbm9ybWFsaXplZCBgbnVtYmVyYCAoYmV0d2VlbiAwIGFuZCAxKS5cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYSA9IHtcbiAgICBsaW5lYXI6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBwb3M7XG4gICAgfVxuICB9O1xuXG4gIGZvcm11bGEgPSBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGE7XG5cbiAgc2hhbGxvd0NvcHkoVHdlZW5hYmxlLCB7XG4gICAgJ25vdyc6IG5vd1xuICAgICwnZWFjaCc6IGVhY2hcbiAgICAsJ3R3ZWVuUHJvcHMnOiB0d2VlblByb3BzXG4gICAgLCd0d2VlblByb3AnOiB0d2VlblByb3BcbiAgICAsJ2FwcGx5RmlsdGVyJzogYXBwbHlGaWx0ZXJcbiAgICAsJ3NoYWxsb3dDb3B5Jzogc2hhbGxvd0NvcHlcbiAgICAsJ2RlZmF1bHRzJzogZGVmYXVsdHNcbiAgICAsJ2NvbXBvc2VFYXNpbmdPYmplY3QnOiBjb21wb3NlRWFzaW5nT2JqZWN0XG4gIH0pO1xuXG4gIC8vIGByb290YCBpcyBwcm92aWRlZCBpbiB0aGUgaW50cm8vb3V0cm8gZmlsZXMuXG5cbiAgLy8gQSBob29rIHVzZWQgZm9yIHVuaXQgdGVzdGluZy5cbiAgaWYgKHR5cGVvZiBTSElGVFlfREVCVUdfTk9XID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcm9vdC50aW1lb3V0SGFuZGxlciA9IHRpbWVvdXRIYW5kbGVyO1xuICB9XG5cbiAgLy8gQm9vdHN0cmFwIFR3ZWVuYWJsZSBhcHByb3ByaWF0ZWx5IGZvciB0aGUgZW52aXJvbm1lbnQuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gVHdlZW5hYmxlO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7cmV0dXJuIFR3ZWVuYWJsZTt9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygcm9vdC5Ud2VlbmFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gQnJvd3NlcjogTWFrZSBgVHdlZW5hYmxlYCBnbG9iYWxseSBhY2Nlc3NpYmxlLlxuICAgIHJvb3QuVHdlZW5hYmxlID0gVHdlZW5hYmxlO1xuICB9XG5cbiAgcmV0dXJuIFR3ZWVuYWJsZTtcblxufSAoKSk7XG5cbi8qIVxuICogQWxsIGVxdWF0aW9ucyBhcmUgYWRhcHRlZCBmcm9tIFRob21hcyBGdWNocycgW1NjcmlwdHkyXShodHRwczovL2dpdGh1Yi5jb20vbWFkcm9iYnkvc2NyaXB0eTIvYmxvYi9tYXN0ZXIvc3JjL2VmZmVjdHMvdHJhbnNpdGlvbnMvcGVubmVyLmpzKS5cbiAqXG4gKiBCYXNlZCBvbiBFYXNpbmcgRXF1YXRpb25zIChjKSAyMDAzIFtSb2JlcnQgUGVubmVyXShodHRwOi8vd3d3LnJvYmVydHBlbm5lci5jb20vKSwgYWxsIHJpZ2h0cyByZXNlcnZlZC4gVGhpcyB3b3JrIGlzIFtzdWJqZWN0IHRvIHRlcm1zXShodHRwOi8vd3d3LnJvYmVydHBlbm5lci5jb20vZWFzaW5nX3Rlcm1zX29mX3VzZS5odG1sKS5cbiAqL1xuXG4vKiFcbiAqICBURVJNUyBPRiBVU0UgLSBFQVNJTkcgRVFVQVRJT05TXG4gKiAgT3BlbiBzb3VyY2UgdW5kZXIgdGhlIEJTRCBMaWNlbnNlLlxuICogIEVhc2luZyBFcXVhdGlvbnMgKGMpIDIwMDMgUm9iZXJ0IFBlbm5lciwgYWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqL1xuXG47KGZ1bmN0aW9uICgpIHtcblxuICBUd2VlbmFibGUuc2hhbGxvd0NvcHkoVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhLCB7XG4gICAgZWFzZUluUXVhZDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIE1hdGgucG93KHBvcywgMik7XG4gICAgfSxcblxuICAgIGVhc2VPdXRRdWFkOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gLShNYXRoLnBvdygocG9zIC0gMSksIDIpIC0gMSk7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dFF1YWQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcywyKTt9XG4gICAgICByZXR1cm4gLTAuNSAqICgocG9zIC09IDIpICogcG9zIC0gMik7XG4gICAgfSxcblxuICAgIGVhc2VJbkN1YmljOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLCAzKTtcbiAgICB9LFxuXG4gICAgZWFzZU91dEN1YmljOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gKE1hdGgucG93KChwb3MgLSAxKSwgMykgKyAxKTtcbiAgICB9LFxuXG4gICAgZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcywzKTt9XG4gICAgICByZXR1cm4gMC41ICogKE1hdGgucG93KChwb3MgLSAyKSwzKSArIDIpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5RdWFydDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIE1hdGgucG93KHBvcywgNCk7XG4gICAgfSxcblxuICAgIGVhc2VPdXRRdWFydDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIC0oTWF0aC5wb3coKHBvcyAtIDEpLCA0KSAtIDEpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLDQpO31cbiAgICAgIHJldHVybiAtMC41ICogKChwb3MgLT0gMikgKiBNYXRoLnBvdyhwb3MsMykgLSAyKTtcbiAgICB9LFxuXG4gICAgZWFzZUluUXVpbnQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBNYXRoLnBvdyhwb3MsIDUpO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0UXVpbnQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAoTWF0aC5wb3coKHBvcyAtIDEpLCA1KSArIDEpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXRRdWludDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLDUpO31cbiAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5wb3coKHBvcyAtIDIpLDUpICsgMik7XG4gICAgfSxcblxuICAgIGVhc2VJblNpbmU6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAtTWF0aC5jb3MocG9zICogKE1hdGguUEkgLyAyKSkgKyAxO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0U2luZTogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIE1hdGguc2luKHBvcyAqIChNYXRoLlBJIC8gMikpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXRTaW5lOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gKC0wLjUgKiAoTWF0aC5jb3MoTWF0aC5QSSAqIHBvcykgLSAxKSk7XG4gICAgfSxcblxuICAgIGVhc2VJbkV4cG86IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAocG9zID09PSAwKSA/IDAgOiBNYXRoLnBvdygyLCAxMCAqIChwb3MgLSAxKSk7XG4gICAgfSxcblxuICAgIGVhc2VPdXRFeHBvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gKHBvcyA9PT0gMSkgPyAxIDogLU1hdGgucG93KDIsIC0xMCAqIHBvcykgKyAxO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXRFeHBvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAocG9zID09PSAwKSB7cmV0dXJuIDA7fVxuICAgICAgaWYgKHBvcyA9PT0gMSkge3JldHVybiAxO31cbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIE1hdGgucG93KDIsMTAgKiAocG9zIC0gMSkpO31cbiAgICAgIHJldHVybiAwLjUgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tcG9zKSArIDIpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5DaXJjOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gLShNYXRoLnNxcnQoMSAtIChwb3MgKiBwb3MpKSAtIDEpO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0Q2lyYzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIE1hdGguc3FydCgxIC0gTWF0aC5wb3coKHBvcyAtIDEpLCAyKSk7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dENpcmM6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIC0wLjUgKiAoTWF0aC5zcXJ0KDEgLSBwb3MgKiBwb3MpIC0gMSk7fVxuICAgICAgcmV0dXJuIDAuNSAqIChNYXRoLnNxcnQoMSAtIChwb3MgLT0gMikgKiBwb3MpICsgMSk7XG4gICAgfSxcblxuICAgIGVhc2VPdXRCb3VuY2U6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmICgocG9zKSA8ICgxIC8gMi43NSkpIHtcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiBwb3MgKiBwb3MpO1xuICAgICAgfSBlbHNlIGlmIChwb3MgPCAoMiAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogKHBvcyAtPSAoMS41IC8gMi43NSkpICogcG9zICsgMC43NSk7XG4gICAgICB9IGVsc2UgaWYgKHBvcyA8ICgyLjUgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIChwb3MgLT0gKDIuMjUgLyAyLjc1KSkgKiBwb3MgKyAwLjkzNzUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiAocG9zIC09ICgyLjYyNSAvIDIuNzUpKSAqIHBvcyArIDAuOTg0Mzc1KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZWFzZUluQmFjazogZnVuY3Rpb24gKHBvcykge1xuICAgICAgdmFyIHMgPSAxLjcwMTU4O1xuICAgICAgcmV0dXJuIChwb3MpICogcG9zICogKChzICsgMSkgKiBwb3MgLSBzKTtcbiAgICB9LFxuXG4gICAgZWFzZU91dEJhY2s6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHZhciBzID0gMS43MDE1ODtcbiAgICAgIHJldHVybiAocG9zID0gcG9zIC0gMSkgKiBwb3MgKiAoKHMgKyAxKSAqIHBvcyArIHMpICsgMTtcbiAgICB9LFxuXG4gICAgZWFzZUluT3V0QmFjazogZnVuY3Rpb24gKHBvcykge1xuICAgICAgdmFyIHMgPSAxLjcwMTU4O1xuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogKHBvcyAqIHBvcyAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHBvcyAtIHMpKTt9XG4gICAgICByZXR1cm4gMC41ICogKChwb3MgLT0gMikgKiBwb3MgKiAoKChzICo9ICgxLjUyNSkpICsgMSkgKiBwb3MgKyBzKSArIDIpO1xuICAgIH0sXG5cbiAgICBlbGFzdGljOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gLTEgKiBNYXRoLnBvdyg0LC04ICogcG9zKSAqIE1hdGguc2luKChwb3MgKiA2IC0gMSkgKiAoMiAqIE1hdGguUEkpIC8gMikgKyAxO1xuICAgIH0sXG5cbiAgICBzd2luZ0Zyb21UbzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgdmFyIHMgPSAxLjcwMTU4O1xuICAgICAgcmV0dXJuICgocG9zIC89IDAuNSkgPCAxKSA/IDAuNSAqIChwb3MgKiBwb3MgKiAoKChzICo9ICgxLjUyNSkpICsgMSkgKiBwb3MgLSBzKSkgOlxuICAgICAgICAgIDAuNSAqICgocG9zIC09IDIpICogcG9zICogKCgocyAqPSAoMS41MjUpKSArIDEpICogcG9zICsgcykgKyAyKTtcbiAgICB9LFxuXG4gICAgc3dpbmdGcm9tOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICByZXR1cm4gcG9zICogcG9zICogKChzICsgMSkgKiBwb3MgLSBzKTtcbiAgICB9LFxuXG4gICAgc3dpbmdUbzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgdmFyIHMgPSAxLjcwMTU4O1xuICAgICAgcmV0dXJuIChwb3MgLT0gMSkgKiBwb3MgKiAoKHMgKyAxKSAqIHBvcyArIHMpICsgMTtcbiAgICB9LFxuXG4gICAgYm91bmNlOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAocG9zIDwgKDEgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIHBvcyAqIHBvcyk7XG4gICAgICB9IGVsc2UgaWYgKHBvcyA8ICgyIC8gMi43NSkpIHtcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiAocG9zIC09ICgxLjUgLyAyLjc1KSkgKiBwb3MgKyAwLjc1KTtcbiAgICAgIH0gZWxzZSBpZiAocG9zIDwgKDIuNSAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogKHBvcyAtPSAoMi4yNSAvIDIuNzUpKSAqIHBvcyArIDAuOTM3NSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIChwb3MgLT0gKDIuNjI1IC8gMi43NSkpICogcG9zICsgMC45ODQzNzUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBib3VuY2VQYXN0OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAocG9zIDwgKDEgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIHBvcyAqIHBvcyk7XG4gICAgICB9IGVsc2UgaWYgKHBvcyA8ICgyIC8gMi43NSkpIHtcbiAgICAgICAgcmV0dXJuIDIgLSAoNy41NjI1ICogKHBvcyAtPSAoMS41IC8gMi43NSkpICogcG9zICsgMC43NSk7XG4gICAgICB9IGVsc2UgaWYgKHBvcyA8ICgyLjUgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gMiAtICg3LjU2MjUgKiAocG9zIC09ICgyLjI1IC8gMi43NSkpICogcG9zICsgMC45Mzc1KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAyIC0gKDcuNTYyNSAqIChwb3MgLT0gKDIuNjI1IC8gMi43NSkpICogcG9zICsgMC45ODQzNzUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBlYXNlRnJvbVRvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsNCk7fVxuICAgICAgcmV0dXJuIC0wLjUgKiAoKHBvcyAtPSAyKSAqIE1hdGgucG93KHBvcywzKSAtIDIpO1xuICAgIH0sXG5cbiAgICBlYXNlRnJvbTogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIE1hdGgucG93KHBvcyw0KTtcbiAgICB9LFxuXG4gICAgZWFzZVRvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLDAuMjUpO1xuICAgIH1cbiAgfSk7XG5cbn0oKSk7XG5cbi8qIVxuICogVGhlIEJlemllciBtYWdpYyBpbiB0aGlzIGZpbGUgaXMgYWRhcHRlZC9jb3BpZWQgYWxtb3N0IHdob2xlc2FsZSBmcm9tXG4gKiBbU2NyaXB0eTJdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYWRyb2JieS9zY3JpcHR5Mi9ibG9iL21hc3Rlci9zcmMvZWZmZWN0cy90cmFuc2l0aW9ucy9jdWJpYy1iZXppZXIuanMpLFxuICogd2hpY2ggd2FzIGFkYXB0ZWQgZnJvbSBBcHBsZSBjb2RlICh3aGljaCBwcm9iYWJseSBjYW1lIGZyb21cbiAqIFtoZXJlXShodHRwOi8vb3BlbnNvdXJjZS5hcHBsZS5jb20vc291cmNlL1dlYkNvcmUvV2ViQ29yZS05NTUuNjYvcGxhdGZvcm0vZ3JhcGhpY3MvVW5pdEJlemllci5oKSkuXG4gKiBTcGVjaWFsIHRoYW5rcyB0byBBcHBsZSBhbmQgVGhvbWFzIEZ1Y2hzIGZvciBtdWNoIG9mIHRoaXMgY29kZS5cbiAqL1xuXG4vKiFcbiAqICBDb3B5cmlnaHQgKGMpIDIwMDYgQXBwbGUgQ29tcHV0ZXIsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiAgUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gKiAgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gKlxuICogIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICpcbiAqICAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvblxuICogIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICpcbiAqICAzLiBOZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBjb3B5cmlnaHQgaG9sZGVyKHMpIG5vciB0aGUgbmFtZXMgb2YgYW55XG4gKiAgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb21cbiAqICB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuICpcbiAqICBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gKiAgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLFxuICogIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxuICogIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEVcbiAqICBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXG4gKiAgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTO1xuICogIExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTlxuICogIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gKiAgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcbiAqICBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqL1xuOyhmdW5jdGlvbiAoKSB7XG4gIC8vIHBvcnQgb2Ygd2Via2l0IGN1YmljIGJlemllciBoYW5kbGluZyBieSBodHRwOi8vd3d3Lm5ldHpnZXN0YS5kZS9kZXYvXG4gIGZ1bmN0aW9uIGN1YmljQmV6aWVyQXRUaW1lKHQscDF4LHAxeSxwMngscDJ5LGR1cmF0aW9uKSB7XG4gICAgdmFyIGF4ID0gMCxieCA9IDAsY3ggPSAwLGF5ID0gMCxieSA9IDAsY3kgPSAwO1xuICAgIGZ1bmN0aW9uIHNhbXBsZUN1cnZlWCh0KSB7cmV0dXJuICgoYXggKiB0ICsgYngpICogdCArIGN4KSAqIHQ7fVxuICAgIGZ1bmN0aW9uIHNhbXBsZUN1cnZlWSh0KSB7cmV0dXJuICgoYXkgKiB0ICsgYnkpICogdCArIGN5KSAqIHQ7fVxuICAgIGZ1bmN0aW9uIHNhbXBsZUN1cnZlRGVyaXZhdGl2ZVgodCkge3JldHVybiAoMy4wICogYXggKiB0ICsgMi4wICogYngpICogdCArIGN4O31cbiAgICBmdW5jdGlvbiBzb2x2ZUVwc2lsb24oZHVyYXRpb24pIHtyZXR1cm4gMS4wIC8gKDIwMC4wICogZHVyYXRpb24pO31cbiAgICBmdW5jdGlvbiBzb2x2ZSh4LGVwc2lsb24pIHtyZXR1cm4gc2FtcGxlQ3VydmVZKHNvbHZlQ3VydmVYKHgsZXBzaWxvbikpO31cbiAgICBmdW5jdGlvbiBmYWJzKG4pIHtpZiAobiA+PSAwKSB7cmV0dXJuIG47fWVsc2Uge3JldHVybiAwIC0gbjt9fVxuICAgIGZ1bmN0aW9uIHNvbHZlQ3VydmVYKHgsZXBzaWxvbikge1xuICAgICAgdmFyIHQwLHQxLHQyLHgyLGQyLGk7XG4gICAgICBmb3IgKHQyID0geCwgaSA9IDA7IGkgPCA4OyBpKyspIHt4MiA9IHNhbXBsZUN1cnZlWCh0MikgLSB4OyBpZiAoZmFicyh4MikgPCBlcHNpbG9uKSB7cmV0dXJuIHQyO30gZDIgPSBzYW1wbGVDdXJ2ZURlcml2YXRpdmVYKHQyKTsgaWYgKGZhYnMoZDIpIDwgMWUtNikge2JyZWFrO30gdDIgPSB0MiAtIHgyIC8gZDI7fVxuICAgICAgdDAgPSAwLjA7IHQxID0gMS4wOyB0MiA9IHg7IGlmICh0MiA8IHQwKSB7cmV0dXJuIHQwO30gaWYgKHQyID4gdDEpIHtyZXR1cm4gdDE7fVxuICAgICAgd2hpbGUgKHQwIDwgdDEpIHt4MiA9IHNhbXBsZUN1cnZlWCh0Mik7IGlmIChmYWJzKHgyIC0geCkgPCBlcHNpbG9uKSB7cmV0dXJuIHQyO30gaWYgKHggPiB4Mikge3QwID0gdDI7fWVsc2Uge3QxID0gdDI7fSB0MiA9ICh0MSAtIHQwKSAqIDAuNSArIHQwO31cbiAgICAgIHJldHVybiB0MjsgLy8gRmFpbHVyZS5cbiAgICB9XG4gICAgY3ggPSAzLjAgKiBwMXg7IGJ4ID0gMy4wICogKHAyeCAtIHAxeCkgLSBjeDsgYXggPSAxLjAgLSBjeCAtIGJ4OyBjeSA9IDMuMCAqIHAxeTsgYnkgPSAzLjAgKiAocDJ5IC0gcDF5KSAtIGN5OyBheSA9IDEuMCAtIGN5IC0gYnk7XG4gICAgcmV0dXJuIHNvbHZlKHQsIHNvbHZlRXBzaWxvbihkdXJhdGlvbikpO1xuICB9XG4gIC8qIVxuICAgKiAgZ2V0Q3ViaWNCZXppZXJUcmFuc2l0aW9uKHgxLCB5MSwgeDIsIHkyKSAtPiBGdW5jdGlvblxuICAgKlxuICAgKiAgR2VuZXJhdGVzIGEgdHJhbnNpdGlvbiBlYXNpbmcgZnVuY3Rpb24gdGhhdCBpcyBjb21wYXRpYmxlXG4gICAqICB3aXRoIFdlYktpdCdzIENTUyB0cmFuc2l0aW9ucyBgLXdlYmtpdC10cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbmBcbiAgICogIENTUyBwcm9wZXJ0eS5cbiAgICpcbiAgICogIFRoZSBXM0MgaGFzIG1vcmUgaW5mb3JtYXRpb24gYWJvdXRcbiAgICogIDxhIGhyZWY9XCJodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXRyYW5zaXRpb25zLyN0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbl90YWdcIj5cbiAgICogIENTUzMgdHJhbnNpdGlvbiB0aW1pbmcgZnVuY3Rpb25zPC9hPi5cbiAgICpcbiAgICogIEBwYXJhbSB7bnVtYmVyfSB4MVxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHkxXG4gICAqICBAcGFyYW0ge251bWJlcn0geDJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSB5MlxuICAgKiAgQHJldHVybiB7ZnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBnZXRDdWJpY0JlemllclRyYW5zaXRpb24gKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBjdWJpY0JlemllckF0VGltZShwb3MseDEseTEseDIseTIsMSk7XG4gICAgfTtcbiAgfVxuICAvLyBFbmQgcG9ydGVkIGNvZGVcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIEJlemllciBlYXNpbmcgZnVuY3Rpb24gYW5kIGF0dGFjaGVzIGl0IHRvIGBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGFgLiAgVGhpcyBmdW5jdGlvbiBnaXZlcyB5b3UgdG90YWwgY29udHJvbCBvdmVyIHRoZSBlYXNpbmcgY3VydmUuICBNYXR0aGV3IExlaW4ncyBbQ2Vhc2VyXShodHRwOi8vbWF0dGhld2xlaW4uY29tL2NlYXNlci8pIGlzIGEgdXNlZnVsIHRvb2wgZm9yIHZpc3VhbGl6aW5nIHRoZSBjdXJ2ZXMgeW91IGNhbiBtYWtlIHdpdGggdGhpcyBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGVhc2luZyBjdXJ2ZS4gIE92ZXJ3cml0ZXMgdGhlIG9sZCBlYXNpbmcgZnVuY3Rpb24gb24gVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhIGlmIGl0IGV4aXN0cy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHgxXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5MVxuICAgKiBAcGFyYW0ge251bWJlcn0geDJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkyXG4gICAqIEByZXR1cm4ge2Z1bmN0aW9ufSBUaGUgZWFzaW5nIGZ1bmN0aW9uIHRoYXQgd2FzIGF0dGFjaGVkIHRvIFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYS5cbiAgICovXG4gIFR3ZWVuYWJsZS5zZXRCZXppZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIChuYW1lLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIHZhciBjdWJpY0JlemllclRyYW5zaXRpb24gPSBnZXRDdWJpY0JlemllclRyYW5zaXRpb24oeDEsIHkxLCB4MiwgeTIpO1xuICAgIGN1YmljQmV6aWVyVHJhbnNpdGlvbi54MSA9IHgxO1xuICAgIGN1YmljQmV6aWVyVHJhbnNpdGlvbi55MSA9IHkxO1xuICAgIGN1YmljQmV6aWVyVHJhbnNpdGlvbi54MiA9IHgyO1xuICAgIGN1YmljQmV6aWVyVHJhbnNpdGlvbi55MiA9IHkyO1xuXG4gICAgcmV0dXJuIFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYVtuYW1lXSA9IGN1YmljQmV6aWVyVHJhbnNpdGlvbjtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBgZGVsZXRlYHMgYW4gZWFzaW5nIGZ1bmN0aW9uIGZyb20gYFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYWAuICBCZSBjYXJlZnVsIHdpdGggdGhpcyBtZXRob2QsIGFzIGl0IGBkZWxldGVgcyB3aGF0ZXZlciBlYXNpbmcgZm9ybXVsYSBtYXRjaGVzIGBuYW1lYCAod2hpY2ggbWVhbnMgeW91IGNhbiBkZWxldGUgZGVmYXVsdCBTaGlmdHkgZWFzaW5nIGZ1bmN0aW9ucykuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBlYXNpbmcgZnVuY3Rpb24gdG8gZGVsZXRlLlxuICAgKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAgICovXG4gIFR3ZWVuYWJsZS51bnNldEJlemllckZ1bmN0aW9uID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBkZWxldGUgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhW25hbWVdO1xuICB9O1xuXG59KSgpO1xuXG47KGZ1bmN0aW9uICgpIHtcblxuICBmdW5jdGlvbiBnZXRJbnRlcnBvbGF0ZWRWYWx1ZXMgKFxuICAgIGZyb20sIGN1cnJlbnQsIHRhcmdldFN0YXRlLCBwb3NpdGlvbiwgZWFzaW5nKSB7XG4gICAgcmV0dXJuIFR3ZWVuYWJsZS50d2VlblByb3BzKFxuICAgICAgcG9zaXRpb24sIGN1cnJlbnQsIGZyb20sIHRhcmdldFN0YXRlLCAxLCAwLCBlYXNpbmcpO1xuICB9XG5cbiAgLy8gRmFrZSBhIFR3ZWVuYWJsZSBhbmQgcGF0Y2ggc29tZSBpbnRlcm5hbHMuICBUaGlzIGFwcHJvYWNoIGFsbG93cyB1cyB0b1xuICAvLyBza2lwIHVuZWNjZXNzYXJ5IHByb2Nlc3NpbmcgYW5kIG9iamVjdCByZWNyZWF0aW9uLCBjdXR0aW5nIGRvd24gb24gZ2FyYmFnZVxuICAvLyBjb2xsZWN0aW9uIHBhdXNlcy5cbiAgdmFyIG1vY2tUd2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gIG1vY2tUd2VlbmFibGUuX2ZpbHRlckFyZ3MgPSBbXTtcblxuICAvKipcbiAgICogQ29tcHV0ZSB0aGUgbWlkcG9pbnQgb2YgdHdvIE9iamVjdHMuICBUaGlzIG1ldGhvZCBlZmZlY3RpdmVseSBjYWxjdWxhdGVzIGEgc3BlY2lmaWMgZnJhbWUgb2YgYW5pbWF0aW9uIHRoYXQgW1R3ZWVuYWJsZSN0d2Vlbl0oc2hpZnR5LmNvcmUuanMuaHRtbCN0d2VlbikgZG9lcyBtYW55IHRpbWVzIG92ZXIgdGhlIGNvdXJzZSBvZiBhIHR3ZWVuLlxuICAgKlxuICAgKiBFeGFtcGxlOlxuICAgKlxuICAgKiBgYGBcbiAgICogIHZhciBpbnRlcnBvbGF0ZWRWYWx1ZXMgPSBUd2VlbmFibGUuaW50ZXJwb2xhdGUoe1xuICAgKiAgICB3aWR0aDogJzEwMHB4JyxcbiAgICogICAgb3BhY2l0eTogMCxcbiAgICogICAgY29sb3I6ICcjZmZmJ1xuICAgKiAgfSwge1xuICAgKiAgICB3aWR0aDogJzIwMHB4JyxcbiAgICogICAgb3BhY2l0eTogMSxcbiAgICogICAgY29sb3I6ICcjMDAwJ1xuICAgKiAgfSwgMC41KTtcbiAgICpcbiAgICogIGNvbnNvbGUubG9nKGludGVycG9sYXRlZFZhbHVlcyk7XG4gICAqICAvLyB7b3BhY2l0eTogMC41LCB3aWR0aDogXCIxNTBweFwiLCBjb2xvcjogXCJyZ2IoMTI3LDEyNywxMjcpXCJ9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZnJvbSBUaGUgc3RhcnRpbmcgdmFsdWVzIHRvIHR3ZWVuIGZyb20uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRTdGF0ZSBUaGUgZW5kaW5nIHZhbHVlcyB0byB0d2VlbiB0by5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIFRoZSBub3JtYWxpemVkIHBvc2l0aW9uIHZhbHVlIChiZXR3ZWVuIDAuMCBhbmQgMS4wKSB0byBpbnRlcnBvbGF0ZSB0aGUgdmFsdWVzIGJldHdlZW4gYGZyb21gIGFuZCBgdG9gIGZvci4gIGBmcm9tYCByZXByZXNlbnRzIDAgYW5kIGB0b2AgcmVwcmVzZW50cyBgMWAuXG4gICAqIEBwYXJhbSB7c3RyaW5nfE9iamVjdH0gZWFzaW5nIFRoZSBlYXNpbmcgY3VydmUocykgdG8gY2FsY3VsYXRlIHRoZSBtaWRwb2ludCBhZ2FpbnN0LiAgWW91IGNhbiByZWZlcmVuY2UgYW55IGVhc2luZyBmdW5jdGlvbiBhdHRhY2hlZCB0byBgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhYC4gIElmIG9taXR0ZWQsIHRoaXMgZGVmYXVsdHMgdG8gXCJsaW5lYXJcIi5cbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgVHdlZW5hYmxlLmludGVycG9sYXRlID0gZnVuY3Rpb24gKGZyb20sIHRhcmdldFN0YXRlLCBwb3NpdGlvbiwgZWFzaW5nKSB7XG4gICAgdmFyIGN1cnJlbnQgPSBUd2VlbmFibGUuc2hhbGxvd0NvcHkoe30sIGZyb20pO1xuICAgIHZhciBlYXNpbmdPYmplY3QgPSBUd2VlbmFibGUuY29tcG9zZUVhc2luZ09iamVjdChcbiAgICAgIGZyb20sIGVhc2luZyB8fCAnbGluZWFyJyk7XG5cbiAgICBtb2NrVHdlZW5hYmxlLnNldCh7fSk7XG5cbiAgICAvLyBBbGlhcyBhbmQgcmV1c2UgdGhlIF9maWx0ZXJBcmdzIGFycmF5IGluc3RlYWQgb2YgcmVjcmVhdGluZyBpdC5cbiAgICB2YXIgZmlsdGVyQXJncyA9IG1vY2tUd2VlbmFibGUuX2ZpbHRlckFyZ3M7XG4gICAgZmlsdGVyQXJncy5sZW5ndGggPSAwO1xuICAgIGZpbHRlckFyZ3NbMF0gPSBjdXJyZW50O1xuICAgIGZpbHRlckFyZ3NbMV0gPSBmcm9tO1xuICAgIGZpbHRlckFyZ3NbMl0gPSB0YXJnZXRTdGF0ZTtcbiAgICBmaWx0ZXJBcmdzWzNdID0gZWFzaW5nT2JqZWN0O1xuXG4gICAgLy8gQW55IGRlZmluZWQgdmFsdWUgdHJhbnNmb3JtYXRpb24gbXVzdCBiZSBhcHBsaWVkXG4gICAgVHdlZW5hYmxlLmFwcGx5RmlsdGVyKG1vY2tUd2VlbmFibGUsICd0d2VlbkNyZWF0ZWQnKTtcbiAgICBUd2VlbmFibGUuYXBwbHlGaWx0ZXIobW9ja1R3ZWVuYWJsZSwgJ2JlZm9yZVR3ZWVuJyk7XG5cbiAgICB2YXIgaW50ZXJwb2xhdGVkVmFsdWVzID0gZ2V0SW50ZXJwb2xhdGVkVmFsdWVzKFxuICAgICAgZnJvbSwgY3VycmVudCwgdGFyZ2V0U3RhdGUsIHBvc2l0aW9uLCBlYXNpbmdPYmplY3QpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHZhbHVlcyBiYWNrIGludG8gdGhlaXIgb3JpZ2luYWwgZm9ybWF0XG4gICAgVHdlZW5hYmxlLmFwcGx5RmlsdGVyKG1vY2tUd2VlbmFibGUsICdhZnRlclR3ZWVuJyk7XG5cbiAgICByZXR1cm4gaW50ZXJwb2xhdGVkVmFsdWVzO1xuICB9O1xuXG59KCkpO1xuXG4vKipcbiAqIEFkZHMgc3RyaW5nIGludGVycG9sYXRpb24gc3VwcG9ydCB0byBTaGlmdHkuXG4gKlxuICogVGhlIFRva2VuIGV4dGVuc2lvbiBhbGxvd3MgU2hpZnR5IHRvIHR3ZWVuIG51bWJlcnMgaW5zaWRlIG9mIHN0cmluZ3MuICBBbW9uZyBvdGhlciB0aGluZ3MsIHRoaXMgYWxsb3dzIHlvdSB0byBhbmltYXRlIENTUyBwcm9wZXJ0aWVzLiAgRm9yIGV4YW1wbGUsIHlvdSBjYW4gZG8gdGhpczpcbiAqXG4gKiBgYGBcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gKiB0d2VlbmFibGUudHdlZW4oe1xuICogICBmcm9tOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoNDVweCknfSxcbiAqICAgdG86IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg5MHhwKSd9XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIGB0cmFuc2xhdGVYKDQ1KWAgd2lsbCBiZSB0d2VlbmVkIHRvIGB0cmFuc2xhdGVYKDkwKWAuICBUbyBkZW1vbnN0cmF0ZTpcbiAqXG4gKiBgYGBcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gKiB0d2VlbmFibGUudHdlZW4oe1xuICogICBmcm9tOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoNDVweCknfSxcbiAqICAgdG86IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg5MHB4KSd9LFxuICogICBzdGVwOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAqICAgICBjb25zb2xlLmxvZyhzdGF0ZS50cmFuc2Zvcm0pO1xuICogICB9XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIFRoZSBhYm92ZSBzbmlwcGV0IHdpbGwgbG9nIHNvbWV0aGluZyBsaWtlIHRoaXMgaW4gdGhlIGNvbnNvbGU6XG4gKlxuICogYGBgXG4gKiB0cmFuc2xhdGVYKDYwLjNweClcbiAqIC4uLlxuICogdHJhbnNsYXRlWCg3Ni4wNXB4KVxuICogLi4uXG4gKiB0cmFuc2xhdGVYKDkwcHgpXG4gKiBgYGBcbiAqXG4gKiBBbm90aGVyIHVzZSBmb3IgdGhpcyBpcyBhbmltYXRpbmcgY29sb3JzOlxuICpcbiAqIGBgYFxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XG4gKiAgIGZyb206IHsgY29sb3I6ICdyZ2IoMCwyNTUsMCknfSxcbiAqICAgdG86IHsgY29sb3I6ICdyZ2IoMjU1LDAsMjU1KSd9LFxuICogICBzdGVwOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAqICAgICBjb25zb2xlLmxvZyhzdGF0ZS5jb2xvcik7XG4gKiAgIH1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogVGhlIGFib3ZlIHNuaXBwZXQgd2lsbCBsb2cgc29tZXRoaW5nIGxpa2UgdGhpczpcbiAqXG4gKiBgYGBcbiAqIHJnYig4NCwxNzAsODQpXG4gKiAuLi5cbiAqIHJnYigxNzAsODQsMTcwKVxuICogLi4uXG4gKiByZ2IoMjU1LDAsMjU1KVxuICogYGBgXG4gKlxuICogVGhpcyBleHRlbnNpb24gYWxzbyBzdXBwb3J0cyBoZXhhZGVjaW1hbCBjb2xvcnMsIGluIGJvdGggbG9uZyAoYCNmZjAwZmZgKSBhbmQgc2hvcnQgKGAjZjBmYCkgZm9ybXMuICBCZSBhd2FyZSB0aGF0IGhleGFkZWNpbWFsIGlucHV0IHZhbHVlcyB3aWxsIGJlIGNvbnZlcnRlZCBpbnRvIHRoZSBlcXVpdmFsZW50IFJHQiBvdXRwdXQgdmFsdWVzLiAgVGhpcyBpcyBkb25lIHRvIG9wdGltaXplIGZvciBwZXJmb3JtYW5jZS5cbiAqXG4gKiBgYGBcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gKiB0d2VlbmFibGUudHdlZW4oe1xuICogICBmcm9tOiB7IGNvbG9yOiAnIzBmMCd9LFxuICogICB0bzogeyBjb2xvcjogJyNmMGYnfSxcbiAqICAgc3RlcDogZnVuY3Rpb24gKHN0YXRlKSB7XG4gKiAgICAgY29uc29sZS5sb2coc3RhdGUuY29sb3IpO1xuICogICB9XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIFRoaXMgc25pcHBldCB3aWxsIGdlbmVyYXRlIHRoZSBzYW1lIG91dHB1dCBhcyB0aGUgb25lIGJlZm9yZSBpdCBiZWNhdXNlIGVxdWl2YWxlbnQgdmFsdWVzIHdlcmUgc3VwcGxpZWQgKGp1c3QgaW4gaGV4YWRlY2ltYWwgZm9ybSByYXRoZXIgdGhhbiBSR0IpOlxuICpcbiAqIGBgYFxuICogcmdiKDg0LDE3MCw4NClcbiAqIC4uLlxuICogcmdiKDE3MCw4NCwxNzApXG4gKiAuLi5cbiAqIHJnYigyNTUsMCwyNTUpXG4gKiBgYGBcbiAqXG4gKiAjIyBFYXNpbmcgc3VwcG9ydFxuICpcbiAqIEVhc2luZyB3b3JrcyBzb21ld2hhdCBkaWZmZXJlbnRseSBpbiB0aGUgVG9rZW4gZXh0ZW5zaW9uLiAgVGhpcyBpcyBiZWNhdXNlIHNvbWUgQ1NTIHByb3BlcnRpZXMgaGF2ZSBtdWx0aXBsZSB2YWx1ZXMgaW4gdGhlbSwgYW5kIHlvdSBtaWdodCBuZWVkIHRvIHR3ZWVuIGVhY2ggdmFsdWUgYWxvbmcgaXRzIG93biBlYXNpbmcgY3VydmUuICBBIGJhc2ljIGV4YW1wbGU6XG4gKlxuICogYGBgXG4gKiB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICogdHdlZW5hYmxlLnR3ZWVuKHtcbiAqICAgZnJvbTogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCkgdHJhbnNsYXRlWSgwcHgpJ30sXG4gKiAgIHRvOiB7IHRyYW5zZm9ybTogICAndHJhbnNsYXRlWCgxMDBweCkgdHJhbnNsYXRlWSgxMDBweCknfSxcbiAqICAgZWFzaW5nOiB7IHRyYW5zZm9ybTogJ2Vhc2VJblF1YWQnIH0sXG4gKiAgIHN0ZXA6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICogICAgIGNvbnNvbGUubG9nKHN0YXRlLnRyYW5zZm9ybSk7XG4gKiAgIH1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogVGhlIGFib3ZlIHNuaXBwZXQgY3JlYXRlIHZhbHVlcyBsaWtlIHRoaXM6XG4gKlxuICogYGBgXG4gKiB0cmFuc2xhdGVYKDExLjU2MDAwMDAwMDAwMDAwMnB4KSB0cmFuc2xhdGVZKDExLjU2MDAwMDAwMDAwMDAwMnB4KVxuICogLi4uXG4gKiB0cmFuc2xhdGVYKDQ2LjI0MDAwMDAwMDAwMDAxcHgpIHRyYW5zbGF0ZVkoNDYuMjQwMDAwMDAwMDAwMDFweClcbiAqIC4uLlxuICogdHJhbnNsYXRlWCgxMDBweCkgdHJhbnNsYXRlWSgxMDBweClcbiAqIGBgYFxuICpcbiAqIEluIHRoaXMgY2FzZSwgdGhlIHZhbHVlcyBmb3IgYHRyYW5zbGF0ZVhgIGFuZCBgdHJhbnNsYXRlWWAgYXJlIGFsd2F5cyB0aGUgc2FtZSBmb3IgZWFjaCBzdGVwIG9mIHRoZSB0d2VlbiwgYmVjYXVzZSB0aGV5IGhhdmUgdGhlIHNhbWUgc3RhcnQgYW5kIGVuZCBwb2ludHMgYW5kIGJvdGggdXNlIHRoZSBzYW1lIGVhc2luZyBjdXJ2ZS4gIFdlIGNhbiBhbHNvIHR3ZWVuIGB0cmFuc2xhdGVYYCBhbmQgYHRyYW5zbGF0ZVlgIGFsb25nIGluZGVwZW5kZW50IGN1cnZlczpcbiAqXG4gKiBgYGBcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gKiB0d2VlbmFibGUudHdlZW4oe1xuICogICBmcm9tOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMHB4KSB0cmFuc2xhdGVZKDBweCknfSxcbiAqICAgdG86IHsgdHJhbnNmb3JtOiAgICd0cmFuc2xhdGVYKDEwMHB4KSB0cmFuc2xhdGVZKDEwMHB4KSd9LFxuICogICBlYXNpbmc6IHsgdHJhbnNmb3JtOiAnZWFzZUluUXVhZCBib3VuY2UnIH0sXG4gKiAgIHN0ZXA6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICogICAgIGNvbnNvbGUubG9nKHN0YXRlLnRyYW5zZm9ybSk7XG4gKiAgIH1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogVGhlIGFib3ZlIHNuaXBwZXQgY3JlYXRlIHZhbHVlcyBsaWtlIHRoaXM6XG4gKlxuICogYGBgXG4gKiB0cmFuc2xhdGVYKDEwLjg5cHgpIHRyYW5zbGF0ZVkoODIuMzU1NjI1cHgpXG4gKiAuLi5cbiAqIHRyYW5zbGF0ZVgoNDQuODkwMDAwMDAwMDAwMDFweCkgdHJhbnNsYXRlWSg4Ni43MzA2MjUwMDAwMDAwMnB4KVxuICogLi4uXG4gKiB0cmFuc2xhdGVYKDEwMHB4KSB0cmFuc2xhdGVZKDEwMHB4KVxuICogYGBgXG4gKlxuICogYHRyYW5zbGF0ZVhgIGFuZCBgdHJhbnNsYXRlWWAgYXJlIG5vdCBpbiBzeW5jIGFueW1vcmUsIGJlY2F1c2UgYGVhc2VJblF1YWRgIHdhcyBzcGVjaWZpZWQgZm9yIGB0cmFuc2xhdGVYYCBhbmQgYGJvdW5jZWAgZm9yIGB0cmFuc2xhdGVZYC4gIE1peGluZyBhbmQgbWF0Y2hpbmcgZWFzaW5nIGN1cnZlcyBjYW4gbWFrZSBmb3Igc29tZSBpbnRlcmVzdGluZyBtb3Rpb24gaW4geW91ciBhbmltYXRpb25zLlxuICpcbiAqIFRoZSBvcmRlciBvZiB0aGUgc3BhY2Utc2VwYXJhdGVkIGVhc2luZyBjdXJ2ZXMgY29ycmVzcG9uZCB0aGUgdG9rZW4gdmFsdWVzIHRoZXkgYXBwbHkgdG8uICBJZiB0aGVyZSBhcmUgbW9yZSB0b2tlbiB2YWx1ZXMgdGhhbiBlYXNpbmcgY3VydmVzIGxpc3RlZCwgdGhlIGxhc3QgZWFzaW5nIGN1cnZlIGxpc3RlZCBpcyB1c2VkLlxuICovXG5mdW5jdGlvbiB0b2tlbiAoKSB7XG4gIC8vIEZ1bmN0aW9uYWxpdHkgZm9yIHRoaXMgZXh0ZW5zaW9uIHJ1bnMgaW1wbGljaXRseSBpZiBpdCBpcyBsb2FkZWQuXG59IC8qISovXG5cbi8vIHRva2VuIGZ1bmN0aW9uIGlzIGRlZmluZWQgYWJvdmUgb25seSBzbyB0aGF0IGRveC1mb3VuZGF0aW9uIHNlZXMgaXQgYXNcbi8vIGRvY3VtZW50YXRpb24gYW5kIHJlbmRlcnMgaXQuICBJdCBpcyBuZXZlciB1c2VkLCBhbmQgaXMgb3B0aW1pemVkIGF3YXkgYXRcbi8vIGJ1aWxkIHRpbWUuXG5cbjsoZnVuY3Rpb24gKFR3ZWVuYWJsZSkge1xuXG4gIC8qIVxuICAgKiBAdHlwZWRlZiB7e1xuICAgKiAgIGZvcm1hdFN0cmluZzogc3RyaW5nXG4gICAqICAgY2h1bmtOYW1lczogQXJyYXkuPHN0cmluZz5cbiAgICogfX1cbiAgICovXG4gIHZhciBmb3JtYXRNYW5pZmVzdDtcblxuICAvLyBDT05TVEFOVFNcblxuICB2YXIgUl9OVU1CRVJfQ09NUE9ORU5UID0gLyhcXGR8XFwtfFxcLikvO1xuICB2YXIgUl9GT1JNQVRfQ0hVTktTID0gLyhbXlxcLTAtOVxcLl0rKS9nO1xuICB2YXIgUl9VTkZPUk1BVFRFRF9WQUxVRVMgPSAvWzAtOS5cXC1dKy9nO1xuICB2YXIgUl9SR0IgPSBuZXcgUmVnRXhwKFxuICAgICdyZ2JcXFxcKCcgKyBSX1VORk9STUFUVEVEX1ZBTFVFUy5zb3VyY2UgK1xuICAgICgvLFxccyovLnNvdXJjZSkgKyBSX1VORk9STUFUVEVEX1ZBTFVFUy5zb3VyY2UgK1xuICAgICgvLFxccyovLnNvdXJjZSkgKyBSX1VORk9STUFUVEVEX1ZBTFVFUy5zb3VyY2UgKyAnXFxcXCknLCAnZycpO1xuICB2YXIgUl9SR0JfUFJFRklYID0gL14uKlxcKC87XG4gIHZhciBSX0hFWCA9IC8jKFswLTldfFthLWZdKXszLDZ9L2dpO1xuICB2YXIgVkFMVUVfUExBQ0VIT0xERVIgPSAnVkFMJztcblxuICAvLyBIRUxQRVJTXG5cbiAgdmFyIGdldEZvcm1hdENodW5rc0Zyb21fYWNjdW11bGF0b3IgPSBbXTtcbiAgLyohXG4gICAqIEBwYXJhbSB7QXJyYXkubnVtYmVyfSByYXdWYWx1ZXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByZWZpeFxuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEZvcm1hdENodW5rc0Zyb20gKHJhd1ZhbHVlcywgcHJlZml4KSB7XG4gICAgZ2V0Rm9ybWF0Q2h1bmtzRnJvbV9hY2N1bXVsYXRvci5sZW5ndGggPSAwO1xuXG4gICAgdmFyIHJhd1ZhbHVlc0xlbmd0aCA9IHJhd1ZhbHVlcy5sZW5ndGg7XG4gICAgdmFyIGk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgcmF3VmFsdWVzTGVuZ3RoOyBpKyspIHtcbiAgICAgIGdldEZvcm1hdENodW5rc0Zyb21fYWNjdW11bGF0b3IucHVzaCgnXycgKyBwcmVmaXggKyAnXycgKyBpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0Rm9ybWF0Q2h1bmtzRnJvbV9hY2N1bXVsYXRvcjtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZm9ybWF0dGVkU3RyaW5nXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGdldEZvcm1hdFN0cmluZ0Zyb20gKGZvcm1hdHRlZFN0cmluZykge1xuICAgIHZhciBjaHVua3MgPSBmb3JtYXR0ZWRTdHJpbmcubWF0Y2goUl9GT1JNQVRfQ0hVTktTKTtcblxuICAgIGlmICghY2h1bmtzKSB7XG4gICAgICAvLyBjaHVua3Mgd2lsbCBiZSBudWxsIGlmIHRoZXJlIHdlcmUgbm8gdG9rZW5zIHRvIHBhcnNlIGluXG4gICAgICAvLyBmb3JtYXR0ZWRTdHJpbmcgKGZvciBleGFtcGxlLCBpZiBmb3JtYXR0ZWRTdHJpbmcgaXMgJzInKS4gIENvZXJjZVxuICAgICAgLy8gY2h1bmtzIHRvIGJlIHVzZWZ1bCBoZXJlLlxuICAgICAgY2h1bmtzID0gWycnLCAnJ107XG5cbiAgICAgIC8vIElmIHRoZXJlIGlzIG9ubHkgb25lIGNodW5rLCBhc3N1bWUgdGhhdCB0aGUgc3RyaW5nIGlzIGEgbnVtYmVyXG4gICAgICAvLyBmb2xsb3dlZCBieSBhIHRva2VuLi4uXG4gICAgICAvLyBOT1RFOiBUaGlzIG1heSBiZSBhbiB1bndpc2UgYXNzdW1wdGlvbi5cbiAgICB9IGVsc2UgaWYgKGNodW5rcy5sZW5ndGggPT09IDEgfHxcbiAgICAgICAgLy8gLi4ub3IgaWYgdGhlIHN0cmluZyBzdGFydHMgd2l0aCBhIG51bWJlciBjb21wb25lbnQgKFwiLlwiLCBcIi1cIiwgb3IgYVxuICAgICAgICAvLyBkaWdpdCkuLi5cbiAgICAgICAgZm9ybWF0dGVkU3RyaW5nWzBdLm1hdGNoKFJfTlVNQkVSX0NPTVBPTkVOVCkpIHtcbiAgICAgIC8vIC4uLnByZXBlbmQgYW4gZW1wdHkgc3RyaW5nIGhlcmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGZvcm1hdHRlZCBudW1iZXJcbiAgICAgIC8vIGlzIHByb3Blcmx5IHJlcGxhY2VkIGJ5IFZBTFVFX1BMQUNFSE9MREVSXG4gICAgICBjaHVua3MudW5zaGlmdCgnJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNodW5rcy5qb2luKFZBTFVFX1BMQUNFSE9MREVSKTtcbiAgfVxuXG4gIC8qIVxuICAgKiBDb252ZXJ0IGFsbCBoZXggY29sb3IgdmFsdWVzIHdpdGhpbiBhIHN0cmluZyB0byBhbiByZ2Igc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgbW9kaWZpZWQgb2JqXG4gICAqL1xuICBmdW5jdGlvbiBzYW5pdGl6ZU9iamVjdEZvckhleFByb3BzIChzdGF0ZU9iamVjdCkge1xuICAgIFR3ZWVuYWJsZS5lYWNoKHN0YXRlT2JqZWN0LCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gc3RhdGVPYmplY3RbcHJvcF07XG5cbiAgICAgIGlmICh0eXBlb2YgY3VycmVudFByb3AgPT09ICdzdHJpbmcnICYmIGN1cnJlbnRQcm9wLm1hdGNoKFJfSEVYKSkge1xuICAgICAgICBzdGF0ZU9iamVjdFtwcm9wXSA9IHNhbml0aXplSGV4Q2h1bmtzVG9SR0IoY3VycmVudFByb3ApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gIHNhbml0aXplSGV4Q2h1bmtzVG9SR0IgKHN0cikge1xuICAgIHJldHVybiBmaWx0ZXJTdHJpbmdDaHVua3MoUl9IRVgsIHN0ciwgY29udmVydEhleFRvUkdCKTtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGV4U3RyaW5nXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGNvbnZlcnRIZXhUb1JHQiAoaGV4U3RyaW5nKSB7XG4gICAgdmFyIHJnYkFyciA9IGhleFRvUkdCQXJyYXkoaGV4U3RyaW5nKTtcbiAgICByZXR1cm4gJ3JnYignICsgcmdiQXJyWzBdICsgJywnICsgcmdiQXJyWzFdICsgJywnICsgcmdiQXJyWzJdICsgJyknO1xuICB9XG5cbiAgdmFyIGhleFRvUkdCQXJyYXlfcmV0dXJuQXJyYXkgPSBbXTtcbiAgLyohXG4gICAqIENvbnZlcnQgYSBoZXhhZGVjaW1hbCBzdHJpbmcgdG8gYW4gYXJyYXkgd2l0aCB0aHJlZSBpdGVtcywgb25lIGVhY2ggZm9yXG4gICAqIHRoZSByZWQsIGJsdWUsIGFuZCBncmVlbiBkZWNpbWFsIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhleCBBIGhleGFkZWNpbWFsIHN0cmluZy5cbiAgICpcbiAgICogQHJldHVybnMge0FycmF5LjxudW1iZXI+fSBUaGUgY29udmVydGVkIEFycmF5IG9mIFJHQiB2YWx1ZXMgaWYgYGhleGAgaXMgYVxuICAgKiB2YWxpZCBzdHJpbmcsIG9yIGFuIEFycmF5IG9mIHRocmVlIDAncy5cbiAgICovXG4gIGZ1bmN0aW9uIGhleFRvUkdCQXJyYXkgKGhleCkge1xuXG4gICAgaGV4ID0gaGV4LnJlcGxhY2UoLyMvLCAnJyk7XG5cbiAgICAvLyBJZiB0aGUgc3RyaW5nIGlzIGEgc2hvcnRoYW5kIHRocmVlIGRpZ2l0IGhleCBub3RhdGlvbiwgbm9ybWFsaXplIGl0IHRvXG4gICAgLy8gdGhlIHN0YW5kYXJkIHNpeCBkaWdpdCBub3RhdGlvblxuICAgIGlmIChoZXgubGVuZ3RoID09PSAzKSB7XG4gICAgICBoZXggPSBoZXguc3BsaXQoJycpO1xuICAgICAgaGV4ID0gaGV4WzBdICsgaGV4WzBdICsgaGV4WzFdICsgaGV4WzFdICsgaGV4WzJdICsgaGV4WzJdO1xuICAgIH1cblxuICAgIGhleFRvUkdCQXJyYXlfcmV0dXJuQXJyYXlbMF0gPSBoZXhUb0RlYyhoZXguc3Vic3RyKDAsIDIpKTtcbiAgICBoZXhUb1JHQkFycmF5X3JldHVybkFycmF5WzFdID0gaGV4VG9EZWMoaGV4LnN1YnN0cigyLCAyKSk7XG4gICAgaGV4VG9SR0JBcnJheV9yZXR1cm5BcnJheVsyXSA9IGhleFRvRGVjKGhleC5zdWJzdHIoNCwgMikpO1xuXG4gICAgcmV0dXJuIGhleFRvUkdCQXJyYXlfcmV0dXJuQXJyYXk7XG4gIH1cblxuICAvKiFcbiAgICogQ29udmVydCBhIGJhc2UtMTYgbnVtYmVyIHRvIGJhc2UtMTAuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gaGV4IFRoZSB2YWx1ZSB0byBjb252ZXJ0XG4gICAqXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBiYXNlLTEwIGVxdWl2YWxlbnQgb2YgYGhleGAuXG4gICAqL1xuICBmdW5jdGlvbiBoZXhUb0RlYyAoaGV4KSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGhleCwgMTYpO1xuICB9XG5cbiAgLyohXG4gICAqIFJ1bnMgYSBmaWx0ZXIgb3BlcmF0aW9uIG9uIGFsbCBjaHVua3Mgb2YgYSBzdHJpbmcgdGhhdCBtYXRjaCBhIFJlZ0V4cFxuICAgKlxuICAgKiBAcGFyYW0ge1JlZ0V4cH0gcGF0dGVyblxuICAgKiBAcGFyYW0ge3N0cmluZ30gdW5maWx0ZXJlZFN0cmluZ1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKHN0cmluZyl9IGZpbHRlclxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBmaWx0ZXJTdHJpbmdDaHVua3MgKHBhdHRlcm4sIHVuZmlsdGVyZWRTdHJpbmcsIGZpbHRlcikge1xuICAgIHZhciBwYXR0ZW5NYXRjaGVzID0gdW5maWx0ZXJlZFN0cmluZy5tYXRjaChwYXR0ZXJuKTtcbiAgICB2YXIgZmlsdGVyZWRTdHJpbmcgPSB1bmZpbHRlcmVkU3RyaW5nLnJlcGxhY2UocGF0dGVybiwgVkFMVUVfUExBQ0VIT0xERVIpO1xuXG4gICAgaWYgKHBhdHRlbk1hdGNoZXMpIHtcbiAgICAgIHZhciBwYXR0ZW5NYXRjaGVzTGVuZ3RoID0gcGF0dGVuTWF0Y2hlcy5sZW5ndGg7XG4gICAgICB2YXIgY3VycmVudENodW5rO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdHRlbk1hdGNoZXNMZW5ndGg7IGkrKykge1xuICAgICAgICBjdXJyZW50Q2h1bmsgPSBwYXR0ZW5NYXRjaGVzLnNoaWZ0KCk7XG4gICAgICAgIGZpbHRlcmVkU3RyaW5nID0gZmlsdGVyZWRTdHJpbmcucmVwbGFjZShcbiAgICAgICAgICBWQUxVRV9QTEFDRUhPTERFUiwgZmlsdGVyKGN1cnJlbnRDaHVuaykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmaWx0ZXJlZFN0cmluZztcbiAgfVxuXG4gIC8qIVxuICAgKiBDaGVjayBmb3IgZmxvYXRpbmcgcG9pbnQgdmFsdWVzIHdpdGhpbiByZ2Igc3RyaW5ncyBhbmQgcm91bmRzIHRoZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXR0ZWRTdHJpbmdcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gc2FuaXRpemVSR0JDaHVua3MgKGZvcm1hdHRlZFN0cmluZykge1xuICAgIHJldHVybiBmaWx0ZXJTdHJpbmdDaHVua3MoUl9SR0IsIGZvcm1hdHRlZFN0cmluZywgc2FuaXRpemVSR0JDaHVuayk7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJnYkNodW5rXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHNhbml0aXplUkdCQ2h1bmsgKHJnYkNodW5rKSB7XG4gICAgdmFyIG51bWJlcnMgPSByZ2JDaHVuay5tYXRjaChSX1VORk9STUFUVEVEX1ZBTFVFUyk7XG4gICAgdmFyIG51bWJlcnNMZW5ndGggPSBudW1iZXJzLmxlbmd0aDtcbiAgICB2YXIgc2FuaXRpemVkU3RyaW5nID0gcmdiQ2h1bmsubWF0Y2goUl9SR0JfUFJFRklYKVswXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtYmVyc0xlbmd0aDsgaSsrKSB7XG4gICAgICBzYW5pdGl6ZWRTdHJpbmcgKz0gcGFyc2VJbnQobnVtYmVyc1tpXSwgMTApICsgJywnO1xuICAgIH1cblxuICAgIHNhbml0aXplZFN0cmluZyA9IHNhbml0aXplZFN0cmluZy5zbGljZSgwLCAtMSkgKyAnKSc7XG5cbiAgICByZXR1cm4gc2FuaXRpemVkU3RyaW5nO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdFxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuIE9iamVjdCBvZiBmb3JtYXRNYW5pZmVzdHMgdGhhdCBjb3JyZXNwb25kIHRvXG4gICAqIHRoZSBzdHJpbmcgcHJvcGVydGllcyBvZiBzdGF0ZU9iamVjdFxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Rm9ybWF0TWFuaWZlc3RzIChzdGF0ZU9iamVjdCkge1xuICAgIHZhciBtYW5pZmVzdEFjY3VtdWxhdG9yID0ge307XG5cbiAgICBUd2VlbmFibGUuZWFjaChzdGF0ZU9iamVjdCwgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIHZhciBjdXJyZW50UHJvcCA9IHN0YXRlT2JqZWN0W3Byb3BdO1xuXG4gICAgICBpZiAodHlwZW9mIGN1cnJlbnRQcm9wID09PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgcmF3VmFsdWVzID0gZ2V0VmFsdWVzRnJvbShjdXJyZW50UHJvcCk7XG5cbiAgICAgICAgbWFuaWZlc3RBY2N1bXVsYXRvcltwcm9wXSA9IHtcbiAgICAgICAgICAnZm9ybWF0U3RyaW5nJzogZ2V0Rm9ybWF0U3RyaW5nRnJvbShjdXJyZW50UHJvcClcbiAgICAgICAgICAsJ2NodW5rTmFtZXMnOiBnZXRGb3JtYXRDaHVua3NGcm9tKHJhd1ZhbHVlcywgcHJvcClcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBtYW5pZmVzdEFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gZm9ybWF0TWFuaWZlc3RzXG4gICAqL1xuICBmdW5jdGlvbiBleHBhbmRGb3JtYXR0ZWRQcm9wZXJ0aWVzIChzdGF0ZU9iamVjdCwgZm9ybWF0TWFuaWZlc3RzKSB7XG4gICAgVHdlZW5hYmxlLmVhY2goZm9ybWF0TWFuaWZlc3RzLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gc3RhdGVPYmplY3RbcHJvcF07XG4gICAgICB2YXIgcmF3VmFsdWVzID0gZ2V0VmFsdWVzRnJvbShjdXJyZW50UHJvcCk7XG4gICAgICB2YXIgcmF3VmFsdWVzTGVuZ3RoID0gcmF3VmFsdWVzLmxlbmd0aDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdWYWx1ZXNMZW5ndGg7IGkrKykge1xuICAgICAgICBzdGF0ZU9iamVjdFtmb3JtYXRNYW5pZmVzdHNbcHJvcF0uY2h1bmtOYW1lc1tpXV0gPSArcmF3VmFsdWVzW2ldO1xuICAgICAgfVxuXG4gICAgICBkZWxldGUgc3RhdGVPYmplY3RbcHJvcF07XG4gICAgfSk7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmb3JtYXRNYW5pZmVzdHNcbiAgICovXG4gIGZ1bmN0aW9uIGNvbGxhcHNlRm9ybWF0dGVkUHJvcGVydGllcyAoc3RhdGVPYmplY3QsIGZvcm1hdE1hbmlmZXN0cykge1xuICAgIFR3ZWVuYWJsZS5lYWNoKGZvcm1hdE1hbmlmZXN0cywgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIHZhciBjdXJyZW50UHJvcCA9IHN0YXRlT2JqZWN0W3Byb3BdO1xuICAgICAgdmFyIGZvcm1hdENodW5rcyA9IGV4dHJhY3RQcm9wZXJ0eUNodW5rcyhcbiAgICAgICAgc3RhdGVPYmplY3QsIGZvcm1hdE1hbmlmZXN0c1twcm9wXS5jaHVua05hbWVzKTtcbiAgICAgIHZhciB2YWx1ZXNMaXN0ID0gZ2V0VmFsdWVzTGlzdChcbiAgICAgICAgZm9ybWF0Q2h1bmtzLCBmb3JtYXRNYW5pZmVzdHNbcHJvcF0uY2h1bmtOYW1lcyk7XG4gICAgICBjdXJyZW50UHJvcCA9IGdldEZvcm1hdHRlZFZhbHVlcyhcbiAgICAgICAgZm9ybWF0TWFuaWZlc3RzW3Byb3BdLmZvcm1hdFN0cmluZywgdmFsdWVzTGlzdCk7XG4gICAgICBzdGF0ZU9iamVjdFtwcm9wXSA9IHNhbml0aXplUkdCQ2h1bmtzKGN1cnJlbnRQcm9wKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcbiAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gY2h1bmtOYW1lc1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBleHRyYWN0ZWQgdmFsdWUgY2h1bmtzLlxuICAgKi9cbiAgZnVuY3Rpb24gZXh0cmFjdFByb3BlcnR5Q2h1bmtzIChzdGF0ZU9iamVjdCwgY2h1bmtOYW1lcykge1xuICAgIHZhciBleHRyYWN0ZWRWYWx1ZXMgPSB7fTtcbiAgICB2YXIgY3VycmVudENodW5rTmFtZSwgY2h1bmtOYW1lc0xlbmd0aCA9IGNodW5rTmFtZXMubGVuZ3RoO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua05hbWVzTGVuZ3RoOyBpKyspIHtcbiAgICAgIGN1cnJlbnRDaHVua05hbWUgPSBjaHVua05hbWVzW2ldO1xuICAgICAgZXh0cmFjdGVkVmFsdWVzW2N1cnJlbnRDaHVua05hbWVdID0gc3RhdGVPYmplY3RbY3VycmVudENodW5rTmFtZV07XG4gICAgICBkZWxldGUgc3RhdGVPYmplY3RbY3VycmVudENodW5rTmFtZV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGV4dHJhY3RlZFZhbHVlcztcbiAgfVxuXG4gIHZhciBnZXRWYWx1ZXNMaXN0X2FjY3VtdWxhdG9yID0gW107XG4gIC8qIVxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcbiAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gY2h1bmtOYW1lc1xuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheS48bnVtYmVyPn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldFZhbHVlc0xpc3QgKHN0YXRlT2JqZWN0LCBjaHVua05hbWVzKSB7XG4gICAgZ2V0VmFsdWVzTGlzdF9hY2N1bXVsYXRvci5sZW5ndGggPSAwO1xuICAgIHZhciBjaHVua05hbWVzTGVuZ3RoID0gY2h1bmtOYW1lcy5sZW5ndGg7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rTmFtZXNMZW5ndGg7IGkrKykge1xuICAgICAgZ2V0VmFsdWVzTGlzdF9hY2N1bXVsYXRvci5wdXNoKHN0YXRlT2JqZWN0W2NodW5rTmFtZXNbaV1dKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0VmFsdWVzTGlzdF9hY2N1bXVsYXRvcjtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZm9ybWF0U3RyaW5nXG4gICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IHJhd1ZhbHVlc1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRGb3JtYXR0ZWRWYWx1ZXMgKGZvcm1hdFN0cmluZywgcmF3VmFsdWVzKSB7XG4gICAgdmFyIGZvcm1hdHRlZFZhbHVlU3RyaW5nID0gZm9ybWF0U3RyaW5nO1xuICAgIHZhciByYXdWYWx1ZXNMZW5ndGggPSByYXdWYWx1ZXMubGVuZ3RoO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdWYWx1ZXNMZW5ndGg7IGkrKykge1xuICAgICAgZm9ybWF0dGVkVmFsdWVTdHJpbmcgPSBmb3JtYXR0ZWRWYWx1ZVN0cmluZy5yZXBsYWNlKFxuICAgICAgICBWQUxVRV9QTEFDRUhPTERFUiwgK3Jhd1ZhbHVlc1tpXS50b0ZpeGVkKDQpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9ybWF0dGVkVmFsdWVTdHJpbmc7XG4gIH1cblxuICAvKiFcbiAgICogTm90ZTogSXQncyB0aGUgZHV0eSBvZiB0aGUgY2FsbGVyIHRvIGNvbnZlcnQgdGhlIEFycmF5IGVsZW1lbnRzIG9mIHRoZVxuICAgKiByZXR1cm4gdmFsdWUgaW50byBudW1iZXJzLiAgVGhpcyBpcyBhIHBlcmZvcm1hbmNlIG9wdGltaXphdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdHRlZFN0cmluZ1xuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPnxudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0VmFsdWVzRnJvbSAoZm9ybWF0dGVkU3RyaW5nKSB7XG4gICAgcmV0dXJuIGZvcm1hdHRlZFN0cmluZy5tYXRjaChSX1VORk9STUFUVEVEX1ZBTFVFUyk7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ09iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gdG9rZW5EYXRhXG4gICAqL1xuICBmdW5jdGlvbiBleHBhbmRFYXNpbmdPYmplY3QgKGVhc2luZ09iamVjdCwgdG9rZW5EYXRhKSB7XG4gICAgVHdlZW5hYmxlLmVhY2godG9rZW5EYXRhLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gdG9rZW5EYXRhW3Byb3BdO1xuICAgICAgdmFyIGNodW5rTmFtZXMgPSBjdXJyZW50UHJvcC5jaHVua05hbWVzO1xuICAgICAgdmFyIGNodW5rTGVuZ3RoID0gY2h1bmtOYW1lcy5sZW5ndGg7XG4gICAgICB2YXIgZWFzaW5nQ2h1bmtzID0gZWFzaW5nT2JqZWN0W3Byb3BdLnNwbGl0KCcgJyk7XG4gICAgICB2YXIgbGFzdEVhc2luZ0NodW5rID0gZWFzaW5nQ2h1bmtzW2Vhc2luZ0NodW5rcy5sZW5ndGggLSAxXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua0xlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVhc2luZ09iamVjdFtjaHVua05hbWVzW2ldXSA9IGVhc2luZ0NodW5rc1tpXSB8fCBsYXN0RWFzaW5nQ2h1bms7XG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSBlYXNpbmdPYmplY3RbcHJvcF07XG4gICAgfSk7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ09iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gdG9rZW5EYXRhXG4gICAqL1xuICBmdW5jdGlvbiBjb2xsYXBzZUVhc2luZ09iamVjdCAoZWFzaW5nT2JqZWN0LCB0b2tlbkRhdGEpIHtcbiAgICBUd2VlbmFibGUuZWFjaCh0b2tlbkRhdGEsIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICB2YXIgY3VycmVudFByb3AgPSB0b2tlbkRhdGFbcHJvcF07XG4gICAgICB2YXIgY2h1bmtOYW1lcyA9IGN1cnJlbnRQcm9wLmNodW5rTmFtZXM7XG4gICAgICB2YXIgY2h1bmtMZW5ndGggPSBjaHVua05hbWVzLmxlbmd0aDtcbiAgICAgIHZhciBjb21wb3NlZEVhc2luZ1N0cmluZyA9ICcnO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29tcG9zZWRFYXNpbmdTdHJpbmcgKz0gJyAnICsgZWFzaW5nT2JqZWN0W2NodW5rTmFtZXNbaV1dO1xuICAgICAgICBkZWxldGUgZWFzaW5nT2JqZWN0W2NodW5rTmFtZXNbaV1dO1xuICAgICAgfVxuXG4gICAgICBlYXNpbmdPYmplY3RbcHJvcF0gPSBjb21wb3NlZEVhc2luZ1N0cmluZy5zdWJzdHIoMSk7XG4gICAgfSk7XG4gIH1cblxuICBUd2VlbmFibGUucHJvdG90eXBlLmZpbHRlci50b2tlbiA9IHtcbiAgICAndHdlZW5DcmVhdGVkJzogZnVuY3Rpb24gKGN1cnJlbnRTdGF0ZSwgZnJvbVN0YXRlLCB0b1N0YXRlLCBlYXNpbmdPYmplY3QpIHtcbiAgICAgIHNhbml0aXplT2JqZWN0Rm9ySGV4UHJvcHMoY3VycmVudFN0YXRlKTtcbiAgICAgIHNhbml0aXplT2JqZWN0Rm9ySGV4UHJvcHMoZnJvbVN0YXRlKTtcbiAgICAgIHNhbml0aXplT2JqZWN0Rm9ySGV4UHJvcHModG9TdGF0ZSk7XG4gICAgICB0aGlzLl90b2tlbkRhdGEgPSBnZXRGb3JtYXRNYW5pZmVzdHMoY3VycmVudFN0YXRlKTtcbiAgICB9LFxuXG4gICAgJ2JlZm9yZVR3ZWVuJzogZnVuY3Rpb24gKGN1cnJlbnRTdGF0ZSwgZnJvbVN0YXRlLCB0b1N0YXRlLCBlYXNpbmdPYmplY3QpIHtcbiAgICAgIGV4cGFuZEVhc2luZ09iamVjdChlYXNpbmdPYmplY3QsIHRoaXMuX3Rva2VuRGF0YSk7XG4gICAgICBleHBhbmRGb3JtYXR0ZWRQcm9wZXJ0aWVzKGN1cnJlbnRTdGF0ZSwgdGhpcy5fdG9rZW5EYXRhKTtcbiAgICAgIGV4cGFuZEZvcm1hdHRlZFByb3BlcnRpZXMoZnJvbVN0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xuICAgICAgZXhwYW5kRm9ybWF0dGVkUHJvcGVydGllcyh0b1N0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xuICAgIH0sXG5cbiAgICAnYWZ0ZXJUd2Vlbic6IGZ1bmN0aW9uIChjdXJyZW50U3RhdGUsIGZyb21TdGF0ZSwgdG9TdGF0ZSwgZWFzaW5nT2JqZWN0KSB7XG4gICAgICBjb2xsYXBzZUZvcm1hdHRlZFByb3BlcnRpZXMoY3VycmVudFN0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xuICAgICAgY29sbGFwc2VGb3JtYXR0ZWRQcm9wZXJ0aWVzKGZyb21TdGF0ZSwgdGhpcy5fdG9rZW5EYXRhKTtcbiAgICAgIGNvbGxhcHNlRm9ybWF0dGVkUHJvcGVydGllcyh0b1N0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xuICAgICAgY29sbGFwc2VFYXNpbmdPYmplY3QoZWFzaW5nT2JqZWN0LCB0aGlzLl90b2tlbkRhdGEpO1xuICAgIH1cbiAgfTtcblxufSAoVHdlZW5hYmxlKSk7XG5cbn0odGhpcykpO1xuIiwiLy8gQ2lyY2xlIHNoYXBlZCBwcm9ncmVzcyBiYXJcblxudmFyIFNoYXBlID0gcmVxdWlyZSgnLi9zaGFwZScpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5cbnZhciBDaXJjbGUgPSBmdW5jdGlvbiBDaXJjbGUoY29udGFpbmVyLCBvcHRpb25zKSB7XG4gICAgLy8gVXNlIHR3byBhcmNzIHRvIGZvcm0gYSBjaXJjbGVcbiAgICAvLyBTZWUgdGhpcyBhbnN3ZXIgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTA0NzczMzQvMTQ0NjA5MlxuICAgIHRoaXMuX3BhdGhUZW1wbGF0ZSA9XG4gICAgICAgICdNIDUwLDUwIG0gMCwte3JhZGl1c30nICtcbiAgICAgICAgJyBhIHtyYWRpdXN9LHtyYWRpdXN9IDAgMSAxIDAsezJyYWRpdXN9JyArXG4gICAgICAgICcgYSB7cmFkaXVzfSx7cmFkaXVzfSAwIDEgMSAwLC17MnJhZGl1c30nO1xuXG4gICAgU2hhcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cbkNpcmNsZS5wcm90b3R5cGUgPSBuZXcgU2hhcGUoKTtcbkNpcmNsZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDaXJjbGU7XG5cbkNpcmNsZS5wcm90b3R5cGUuX3BhdGhTdHJpbmcgPSBmdW5jdGlvbiBfcGF0aFN0cmluZyhvcHRzKSB7XG4gICAgdmFyIHdpZHRoT2ZXaWRlciA9IG9wdHMuc3Ryb2tlV2lkdGg7XG4gICAgaWYgKG9wdHMudHJhaWxXaWR0aCAmJiBvcHRzLnRyYWlsV2lkdGggPiBvcHRzLnN0cm9rZVdpZHRoKSB7XG4gICAgICAgIHdpZHRoT2ZXaWRlciA9IG9wdHMudHJhaWxXaWR0aDtcbiAgICB9XG5cbiAgICB2YXIgciA9IDUwIC0gd2lkdGhPZldpZGVyIC8gMjtcblxuICAgIHJldHVybiB1dGlscy5yZW5kZXIodGhpcy5fcGF0aFRlbXBsYXRlLCB7XG4gICAgICAgIHJhZGl1czogcixcbiAgICAgICAgJzJyYWRpdXMnOiByICogMlxuICAgIH0pO1xufTtcblxuQ2lyY2xlLnByb3RvdHlwZS5fdHJhaWxTdHJpbmcgPSBmdW5jdGlvbiBfdHJhaWxTdHJpbmcob3B0cykge1xuICAgIHJldHVybiB0aGlzLl9wYXRoU3RyaW5nKG9wdHMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaXJjbGU7XG4iLCIvLyBMaW5lIHNoYXBlZCBwcm9ncmVzcyBiYXJcblxudmFyIFNoYXBlID0gcmVxdWlyZSgnLi9zaGFwZScpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5cbnZhciBMaW5lID0gZnVuY3Rpb24gTGluZShjb250YWluZXIsIG9wdGlvbnMpIHtcbiAgICB0aGlzLl9wYXRoVGVtcGxhdGUgPSAnTSAwLHtjZW50ZXJ9IEwgMTAwLHtjZW50ZXJ9JztcbiAgICBTaGFwZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuTGluZS5wcm90b3R5cGUgPSBuZXcgU2hhcGUoKTtcbkxpbmUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTGluZTtcblxuTGluZS5wcm90b3R5cGUuX2luaXRpYWxpemVTdmcgPSBmdW5jdGlvbiBfaW5pdGlhbGl6ZVN2ZyhzdmcsIG9wdHMpIHtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCAxMDAgJyArIG9wdHMuc3Ryb2tlV2lkdGgpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAnbm9uZScpO1xufTtcblxuTGluZS5wcm90b3R5cGUuX3BhdGhTdHJpbmcgPSBmdW5jdGlvbiBfcGF0aFN0cmluZyhvcHRzKSB7XG4gICAgcmV0dXJuIHV0aWxzLnJlbmRlcih0aGlzLl9wYXRoVGVtcGxhdGUsIHtcbiAgICAgICAgY2VudGVyOiBvcHRzLnN0cm9rZVdpZHRoIC8gMlxuICAgIH0pO1xufTtcblxuTGluZS5wcm90b3R5cGUuX3RyYWlsU3RyaW5nID0gZnVuY3Rpb24gX3RyYWlsU3RyaW5nKG9wdHMpIHtcbiAgICByZXR1cm4gdGhpcy5fcGF0aFN0cmluZyhvcHRzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGluZTtcbiIsIi8vIERpZmZlcmVudCBzaGFwZWQgcHJvZ3Jlc3MgYmFyc1xudmFyIExpbmUgPSByZXF1aXJlKCcuL2xpbmUnKTtcbnZhciBDaXJjbGUgPSByZXF1aXJlKCcuL2NpcmNsZScpO1xudmFyIFNxdWFyZSA9IHJlcXVpcmUoJy4vc3F1YXJlJyk7XG5cbi8vIExvd2VyIGxldmVsIEFQSSB0byB1c2UgYW55IFNWRyBwYXRoXG52YXIgUGF0aCA9IHJlcXVpcmUoJy4vcGF0aCcpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIExpbmU6IExpbmUsXG4gICAgQ2lyY2xlOiBDaXJjbGUsXG4gICAgU3F1YXJlOiBTcXVhcmUsXG4gICAgUGF0aDogUGF0aFxufTtcbiIsIi8vIExvd2VyIGxldmVsIEFQSSB0byBhbmltYXRlIGFueSBraW5kIG9mIHN2ZyBwYXRoXG5cbnZhciBUd2VlbmFibGUgPSByZXF1aXJlKCdzaGlmdHknKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIEVBU0lOR19BTElBU0VTID0ge1xuICAgIGVhc2VJbjogJ2Vhc2VJbkN1YmljJyxcbiAgICBlYXNlT3V0OiAnZWFzZU91dEN1YmljJyxcbiAgICBlYXNlSW5PdXQ6ICdlYXNlSW5PdXRDdWJpYydcbn07XG5cblxudmFyIFBhdGggPSBmdW5jdGlvbiBQYXRoKHBhdGgsIG9wdHMpIHtcbiAgICAvLyBEZWZhdWx0IHBhcmFtZXRlcnMgZm9yIGFuaW1hdGlvblxuICAgIG9wdHMgPSB1dGlscy5leHRlbmQoe1xuICAgICAgICBkdXJhdGlvbjogODAwLFxuICAgICAgICBlYXNpbmc6ICdsaW5lYXInLFxuICAgICAgICBmcm9tOiB7fSxcbiAgICAgICAgdG86IHt9LFxuICAgICAgICBzdGVwOiBmdW5jdGlvbigpIHt9XG4gICAgfSwgb3B0cyk7XG5cbiAgICB2YXIgZWxlbWVudDtcbiAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudCA9IHBhdGg7XG4gICAgfVxuXG4gICAgLy8gUmV2ZWFsIC5wYXRoIGFzIHB1YmxpYyBhdHRyaWJ1dGVcbiAgICB0aGlzLnBhdGggPSBlbGVtZW50O1xuICAgIHRoaXMuX29wdHMgPSBvcHRzO1xuICAgIHRoaXMuX3R3ZWVuYWJsZSA9IG51bGw7XG5cbiAgICAvLyBTZXQgdXAgdGhlIHN0YXJ0aW5nIHBvc2l0aW9uc1xuICAgIHZhciBsZW5ndGggPSB0aGlzLnBhdGguZ2V0VG90YWxMZW5ndGgoKTtcbiAgICB0aGlzLnBhdGguc3R5bGUuc3Ryb2tlRGFzaGFycmF5ID0gbGVuZ3RoICsgJyAnICsgbGVuZ3RoO1xuICAgIHRoaXMuc2V0KDApO1xufTtcblxuUGF0aC5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy5fZ2V0Q29tcHV0ZWREYXNoT2Zmc2V0KCk7XG4gICAgdmFyIGxlbmd0aCA9IHRoaXMucGF0aC5nZXRUb3RhbExlbmd0aCgpO1xuXG4gICAgdmFyIHByb2dyZXNzID0gMSAtIG9mZnNldCAvIGxlbmd0aDtcbiAgICAvLyBSb3VuZCBudW1iZXIgdG8gcHJldmVudCByZXR1cm5pbmcgdmVyeSBzbWFsbCBudW1iZXIgbGlrZSAxZS0zMCwgd2hpY2hcbiAgICAvLyBpcyBwcmFjdGljYWxseSAwXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQocHJvZ3Jlc3MudG9GaXhlZCg2KSwgMTApO1xufTtcblxuUGF0aC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KHByb2dyZXNzKSB7XG4gICAgdGhpcy5zdG9wKCk7XG5cbiAgICB0aGlzLnBhdGguc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IHRoaXMuX3Byb2dyZXNzVG9PZmZzZXQocHJvZ3Jlc3MpO1xuXG4gICAgdmFyIHN0ZXAgPSB0aGlzLl9vcHRzLnN0ZXA7XG4gICAgaWYgKHV0aWxzLmlzRnVuY3Rpb24oc3RlcCkpIHtcbiAgICAgICAgdmFyIGVhc2luZyA9IHRoaXMuX2Vhc2luZyh0aGlzLl9vcHRzLmVhc2luZyk7XG4gICAgICAgIHZhciB2YWx1ZXMgPSB0aGlzLl9jYWxjdWxhdGVUbyhwcm9ncmVzcywgZWFzaW5nKTtcbiAgICAgICAgc3RlcCh2YWx1ZXMsIHRoaXMuX29wdHMuc2hhcGV8fHRoaXMsIHRoaXMuX29wdHMuYXR0YWNobWVudCk7XG4gICAgfVxufTtcblxuUGF0aC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgdGhpcy5fc3RvcFR3ZWVuKCk7XG4gICAgdGhpcy5wYXRoLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSB0aGlzLl9nZXRDb21wdXRlZERhc2hPZmZzZXQoKTtcbn07XG5cbi8vIE1ldGhvZCBpbnRyb2R1Y2VkIGhlcmU6XG4vLyBodHRwOi8vamFrZWFyY2hpYmFsZC5jb20vMjAxMy9hbmltYXRlZC1saW5lLWRyYXdpbmctc3ZnL1xuUGF0aC5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uIGFuaW1hdGUocHJvZ3Jlc3MsIG9wdHMsIGNiKSB7XG4gICAgb3B0cyA9IG9wdHMgfHwge307XG5cbiAgICBpZiAodXRpbHMuaXNGdW5jdGlvbihvcHRzKSkge1xuICAgICAgICBjYiA9IG9wdHM7XG4gICAgICAgIG9wdHMgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgcGFzc2VkT3B0cyA9IHV0aWxzLmV4dGVuZCh7fSwgb3B0cyk7XG5cbiAgICAvLyBDb3B5IGRlZmF1bHQgb3B0cyB0byBuZXcgb2JqZWN0IHNvIGRlZmF1bHRzIGFyZSBub3QgbW9kaWZpZWRcbiAgICB2YXIgZGVmYXVsdE9wdHMgPSB1dGlscy5leHRlbmQoe30sIHRoaXMuX29wdHMpO1xuICAgIG9wdHMgPSB1dGlscy5leHRlbmQoZGVmYXVsdE9wdHMsIG9wdHMpO1xuXG4gICAgdmFyIHNoaWZ0eUVhc2luZyA9IHRoaXMuX2Vhc2luZyhvcHRzLmVhc2luZyk7XG4gICAgdmFyIHZhbHVlcyA9IHRoaXMuX3Jlc29sdmVGcm9tQW5kVG8ocHJvZ3Jlc3MsIHNoaWZ0eUVhc2luZywgcGFzc2VkT3B0cyk7XG5cbiAgICB0aGlzLnN0b3AoKTtcblxuICAgIC8vIFRyaWdnZXIgYSBsYXlvdXQgc28gc3R5bGVzIGFyZSBjYWxjdWxhdGVkICYgdGhlIGJyb3dzZXJcbiAgICAvLyBwaWNrcyB1cCB0aGUgc3RhcnRpbmcgcG9zaXRpb24gYmVmb3JlIGFuaW1hdGluZ1xuICAgIHRoaXMucGF0aC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIHZhciBvZmZzZXQgPSB0aGlzLl9nZXRDb21wdXRlZERhc2hPZmZzZXQoKTtcbiAgICB2YXIgbmV3T2Zmc2V0ID0gdGhpcy5fcHJvZ3Jlc3NUb09mZnNldChwcm9ncmVzcyk7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICAgIHRoaXMuX3R3ZWVuYWJsZS50d2Vlbih7XG4gICAgICAgIGZyb206IHV0aWxzLmV4dGVuZCh7IG9mZnNldDogb2Zmc2V0IH0sIHZhbHVlcy5mcm9tKSxcbiAgICAgICAgdG86IHV0aWxzLmV4dGVuZCh7IG9mZnNldDogbmV3T2Zmc2V0IH0sIHZhbHVlcy50byksXG4gICAgICAgIGR1cmF0aW9uOiBvcHRzLmR1cmF0aW9uLFxuICAgICAgICBlYXNpbmc6IHNoaWZ0eUVhc2luZyxcbiAgICAgICAgc3RlcDogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICAgIHNlbGYucGF0aC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gc3RhdGUub2Zmc2V0O1xuICAgICAgICAgICAgb3B0cy5zdGVwKHN0YXRlLCBvcHRzLnNoYXBlfHxzZWxmLCBvcHRzLmF0dGFjaG1lbnQpO1xuICAgICAgICB9LFxuICAgICAgICBmaW5pc2g6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgICBpZiAodXRpbHMuaXNGdW5jdGlvbihjYikpIHtcbiAgICAgICAgICAgICAgICBjYigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5QYXRoLnByb3RvdHlwZS5fZ2V0Q29tcHV0ZWREYXNoT2Zmc2V0ID0gZnVuY3Rpb24gX2dldENvbXB1dGVkRGFzaE9mZnNldCgpIHtcbiAgICB2YXIgY29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMucGF0aCwgbnVsbCk7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoY29tcHV0ZWRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdzdHJva2UtZGFzaG9mZnNldCcpLCAxMCk7XG59O1xuXG5QYXRoLnByb3RvdHlwZS5fcHJvZ3Jlc3NUb09mZnNldCA9IGZ1bmN0aW9uIF9wcm9ncmVzc1RvT2Zmc2V0KHByb2dyZXNzKSB7XG4gICAgdmFyIGxlbmd0aCA9IHRoaXMucGF0aC5nZXRUb3RhbExlbmd0aCgpO1xuICAgIHJldHVybiBsZW5ndGggLSBwcm9ncmVzcyAqIGxlbmd0aDtcbn07XG5cbi8vIFJlc29sdmVzIGZyb20gYW5kIHRvIHZhbHVlcyBmb3IgYW5pbWF0aW9uLlxuUGF0aC5wcm90b3R5cGUuX3Jlc29sdmVGcm9tQW5kVG8gPSBmdW5jdGlvbiBfcmVzb2x2ZUZyb21BbmRUbyhwcm9ncmVzcywgZWFzaW5nLCBvcHRzKSB7XG4gICAgaWYgKG9wdHMuZnJvbSAmJiBvcHRzLnRvKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmcm9tOiBvcHRzLmZyb20sXG4gICAgICAgICAgICB0bzogb3B0cy50b1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGZyb206IHRoaXMuX2NhbGN1bGF0ZUZyb20oZWFzaW5nKSxcbiAgICAgICAgdG86IHRoaXMuX2NhbGN1bGF0ZVRvKHByb2dyZXNzLCBlYXNpbmcpXG4gICAgfTtcbn07XG5cbi8vIENhbGN1bGF0ZSBgZnJvbWAgdmFsdWVzIGZyb20gb3B0aW9ucyBwYXNzZWQgYXQgaW5pdGlhbGl6YXRpb25cblBhdGgucHJvdG90eXBlLl9jYWxjdWxhdGVGcm9tID0gZnVuY3Rpb24gX2NhbGN1bGF0ZUZyb20oZWFzaW5nKSB7XG4gICAgcmV0dXJuIFR3ZWVuYWJsZS5pbnRlcnBvbGF0ZSh0aGlzLl9vcHRzLmZyb20sIHRoaXMuX29wdHMudG8sIHRoaXMudmFsdWUoKSwgZWFzaW5nKTtcbn07XG5cbi8vIENhbGN1bGF0ZSBgdG9gIHZhbHVlcyBmcm9tIG9wdGlvbnMgcGFzc2VkIGF0IGluaXRpYWxpemF0aW9uXG5QYXRoLnByb3RvdHlwZS5fY2FsY3VsYXRlVG8gPSBmdW5jdGlvbiBfY2FsY3VsYXRlVG8ocHJvZ3Jlc3MsIGVhc2luZykge1xuICAgIHJldHVybiBUd2VlbmFibGUuaW50ZXJwb2xhdGUodGhpcy5fb3B0cy5mcm9tLCB0aGlzLl9vcHRzLnRvLCBwcm9ncmVzcywgZWFzaW5nKTtcbn07XG5cblBhdGgucHJvdG90eXBlLl9zdG9wVHdlZW4gPSBmdW5jdGlvbiBfc3RvcFR3ZWVuKCkge1xuICAgIGlmICh0aGlzLl90d2VlbmFibGUgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fdHdlZW5hYmxlLnN0b3AoKTtcbiAgICAgICAgdGhpcy5fdHdlZW5hYmxlLmRpc3Bvc2UoKTtcbiAgICAgICAgdGhpcy5fdHdlZW5hYmxlID0gbnVsbDtcbiAgICB9XG59O1xuXG5QYXRoLnByb3RvdHlwZS5fZWFzaW5nID0gZnVuY3Rpb24gX2Vhc2luZyhlYXNpbmcpIHtcbiAgICBpZiAoRUFTSU5HX0FMSUFTRVMuaGFzT3duUHJvcGVydHkoZWFzaW5nKSkge1xuICAgICAgICByZXR1cm4gRUFTSU5HX0FMSUFTRVNbZWFzaW5nXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWFzaW5nO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXRoO1xuIiwiLy8gQmFzZSBvYmplY3QgZm9yIGRpZmZlcmVudCBwcm9ncmVzcyBiYXIgc2hhcGVzXG5cbnZhciBQYXRoID0gcmVxdWlyZSgnLi9wYXRoJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBERVNUUk9ZRURfRVJST1IgPSAnT2JqZWN0IGlzIGRlc3Ryb3llZCc7XG5cblxudmFyIFNoYXBlID0gZnVuY3Rpb24gU2hhcGUoY29udGFpbmVyLCBvcHRzKSB7XG4gICAgLy8gVGhyb3cgYSBiZXR0ZXIgZXJyb3IgaWYgcHJvZ3Jlc3MgYmFycyBhcmUgbm90IGluaXRpYWxpemVkIHdpdGggYG5ld2BcbiAgICAvLyBrZXl3b3JkXG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFNoYXBlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnN0cnVjdG9yIHdhcyBjYWxsZWQgd2l0aG91dCBuZXcga2V5d29yZCcpO1xuICAgIH1cblxuICAgIC8vIFByZXZlbnQgY2FsbGluZyBjb25zdHJ1Y3RvciB3aXRob3V0IHBhcmFtZXRlcnMgc28gaW5oZXJpdGFuY2VcbiAgICAvLyB3b3JrcyBjb3JyZWN0bHkuIFRvIHVuZGVyc3RhbmQsIHRoaXMgaXMgaG93IFNoYXBlIGlzIGluaGVyaXRlZDpcbiAgICAvL1xuICAgIC8vICAgTGluZS5wcm90b3R5cGUgPSBuZXcgU2hhcGUoKTtcbiAgICAvL1xuICAgIC8vIFdlIGp1c3Qgd2FudCB0byBzZXQgdGhlIHByb3RvdHlwZSBmb3IgTGluZS5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgLy8gRGVmYXVsdCBwYXJhbWV0ZXJzIGZvciBwcm9ncmVzcyBiYXIgY3JlYXRpb25cbiAgICB0aGlzLl9vcHRzID0gdXRpbHMuZXh0ZW5kKHtcbiAgICAgICAgY29sb3I6ICcjNTU1JyxcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDEuMCxcbiAgICAgICAgdHJhaWxDb2xvcjogbnVsbCxcbiAgICAgICAgdHJhaWxXaWR0aDogbnVsbCxcbiAgICAgICAgZmlsbDogbnVsbCxcbiAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgYXV0b1N0eWxlOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwcm9ncmVzc2Jhci10ZXh0J1xuICAgICAgICB9XG4gICAgfSwgb3B0cywgdHJ1ZSk7ICAvLyBVc2UgcmVjdXJzaXZlIGV4dGVuZFxuXG4gICAgdmFyIHN2Z1ZpZXcgPSB0aGlzLl9jcmVhdGVTdmdWaWV3KHRoaXMuX29wdHMpO1xuXG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgaWYgKHV0aWxzLmlzU3RyaW5nKGNvbnRhaW5lcikpIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50ID0gY29udGFpbmVyO1xuICAgIH1cblxuICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnRhaW5lciBkb2VzIG5vdCBleGlzdDogJyArIGNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgdGhpcy5fY29udGFpbmVyID0gZWxlbWVudDtcbiAgICB0aGlzLl9jb250YWluZXIuYXBwZW5kQ2hpbGQoc3ZnVmlldy5zdmcpO1xuXG4gICAgdGhpcy50ZXh0ID0gbnVsbDtcbiAgICBpZiAodGhpcy5fb3B0cy50ZXh0LnZhbHVlKSB7XG4gICAgICAgIHRoaXMudGV4dCA9IHRoaXMuX2NyZWF0ZVRleHRFbGVtZW50KHRoaXMuX29wdHMsIHRoaXMuX2NvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnRleHQpO1xuICAgIH1cblxuICAgIC8vIEV4cG9zZSBwdWJsaWMgYXR0cmlidXRlcyBiZWZvcmUgUGF0aCBpbml0aWFsaXphdGlvblxuICAgIHRoaXMuc3ZnID0gc3ZnVmlldy5zdmc7XG4gICAgdGhpcy5wYXRoID0gc3ZnVmlldy5wYXRoO1xuICAgIHRoaXMudHJhaWwgPSBzdmdWaWV3LnRyYWlsO1xuICAgIC8vIHRoaXMudGV4dCBpcyBhbHNvIGEgcHVibGljIGF0dHJpYnV0ZVxuXG4gICAgdmFyIG5ld09wdHMgPSB1dGlscy5leHRlbmQoe1xuICAgICAgICBhdHRhY2htZW50OiB1bmRlZmluZWQsXG4gICAgICAgIHNoYXBlOiB0aGlzXG4gICAgfSwgdGhpcy5fb3B0cyk7XG4gICAgdGhpcy5fcHJvZ3Jlc3NQYXRoID0gbmV3IFBhdGgoc3ZnVmlldy5wYXRoLCBuZXdPcHRzKTtcbn07XG5cblNoYXBlLnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24gYW5pbWF0ZShwcm9ncmVzcywgb3B0cywgY2IpIHtcbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3NQYXRoID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoREVTVFJPWUVEX0VSUk9SKTtcbiAgICB0aGlzLl9wcm9ncmVzc1BhdGguYW5pbWF0ZShwcm9ncmVzcywgb3B0cywgY2IpO1xufTtcblxuU2hhcGUucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiBzdG9wKCkge1xuICAgIGlmICh0aGlzLl9wcm9ncmVzc1BhdGggPT09IG51bGwpIHRocm93IG5ldyBFcnJvcihERVNUUk9ZRURfRVJST1IpO1xuICAgIC8vIERvbid0IGNyYXNoIGlmIHN0b3AgaXMgY2FsbGVkIGluc2lkZSBzdGVwIGZ1bmN0aW9uXG4gICAgaWYgKHRoaXMuX3Byb2dyZXNzUGF0aCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICB0aGlzLl9wcm9ncmVzc1BhdGguc3RvcCgpO1xufTtcblxuU2hhcGUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9wcm9ncmVzc1BhdGggPT09IG51bGwpIHRocm93IG5ldyBFcnJvcihERVNUUk9ZRURfRVJST1IpO1xuXG4gICAgdGhpcy5zdG9wKCk7XG4gICAgdGhpcy5zdmcucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnN2Zyk7XG4gICAgdGhpcy5zdmcgPSBudWxsO1xuICAgIHRoaXMucGF0aCA9IG51bGw7XG4gICAgdGhpcy50cmFpbCA9IG51bGw7XG4gICAgdGhpcy5fcHJvZ3Jlc3NQYXRoID0gbnVsbDtcblxuICAgIGlmICh0aGlzLnRleHQgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy50ZXh0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy50ZXh0KTtcbiAgICAgICAgdGhpcy50ZXh0ID0gbnVsbDtcbiAgICB9XG59O1xuXG5TaGFwZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KHByb2dyZXNzKSB7XG4gICAgaWYgKHRoaXMuX3Byb2dyZXNzUGF0aCA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKERFU1RST1lFRF9FUlJPUik7XG4gICAgdGhpcy5fcHJvZ3Jlc3NQYXRoLnNldChwcm9ncmVzcyk7XG59O1xuXG5TaGFwZS5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3NQYXRoID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoREVTVFJPWUVEX0VSUk9SKTtcbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3NQYXRoID09PSB1bmRlZmluZWQpIHJldHVybiAwO1xuXG4gICAgcmV0dXJuIHRoaXMuX3Byb2dyZXNzUGF0aC52YWx1ZSgpO1xufTtcblxuU2hhcGUucHJvdG90eXBlLnNldFRleHQgPSBmdW5jdGlvbiBzZXRUZXh0KHRleHQpIHtcbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3NQYXRoID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoREVTVFJPWUVEX0VSUk9SKTtcblxuICAgIGlmICh0aGlzLnRleHQgPT09IG51bGwpIHtcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyB0ZXh0IG5vZGVcbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy5fY3JlYXRlVGV4dEVsZW1lbnQodGhpcy5fb3B0cywgdGhpcy5fY29udGFpbmVyKTtcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMudGV4dCk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIHByZXZpb3VzIHRleHQgbm9kZSBhbmQgYWRkIG5ld1xuICAgIHRoaXMudGV4dC5yZW1vdmVDaGlsZCh0aGlzLnRleHQuZmlyc3RDaGlsZCk7XG4gICAgdGhpcy50ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKTtcbn07XG5cblNoYXBlLnByb3RvdHlwZS5fY3JlYXRlU3ZnVmlldyA9IGZ1bmN0aW9uIF9jcmVhdGVTdmdWaWV3KG9wdHMpIHtcbiAgICB2YXIgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICB0aGlzLl9pbml0aWFsaXplU3ZnKHN2Zywgb3B0cyk7XG5cbiAgICB2YXIgdHJhaWxQYXRoID0gbnVsbDtcbiAgICAvLyBFYWNoIG9wdGlvbiBsaXN0ZWQgaW4gdGhlIGlmIGNvbmRpdGlvbiBhcmUgJ3RyaWdnZXJzJyBmb3IgY3JlYXRpbmdcbiAgICAvLyB0aGUgdHJhaWwgcGF0aFxuICAgIGlmIChvcHRzLnRyYWlsQ29sb3IgfHwgb3B0cy50cmFpbFdpZHRoKSB7XG4gICAgICAgIHRyYWlsUGF0aCA9IHRoaXMuX2NyZWF0ZVRyYWlsKG9wdHMpO1xuICAgICAgICBzdmcuYXBwZW5kQ2hpbGQodHJhaWxQYXRoKTtcbiAgICB9XG5cbiAgICB2YXIgcGF0aCA9IHRoaXMuX2NyZWF0ZVBhdGgob3B0cyk7XG4gICAgc3ZnLmFwcGVuZENoaWxkKHBhdGgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3ZnOiBzdmcsXG4gICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgIHRyYWlsOiB0cmFpbFBhdGhcbiAgICB9O1xufTtcblxuU2hhcGUucHJvdG90eXBlLl9pbml0aWFsaXplU3ZnID0gZnVuY3Rpb24gX2luaXRpYWxpemVTdmcoc3ZnLCBvcHRzKSB7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgMTAwIDEwMCcpO1xufTtcblxuU2hhcGUucHJvdG90eXBlLl9jcmVhdGVQYXRoID0gZnVuY3Rpb24gX2NyZWF0ZVBhdGgob3B0cykge1xuICAgIHZhciBwYXRoU3RyaW5nID0gdGhpcy5fcGF0aFN0cmluZyhvcHRzKTtcbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlUGF0aEVsZW1lbnQocGF0aFN0cmluZywgb3B0cyk7XG59O1xuXG5TaGFwZS5wcm90b3R5cGUuX2NyZWF0ZVRyYWlsID0gZnVuY3Rpb24gX2NyZWF0ZVRyYWlsKG9wdHMpIHtcbiAgICAvLyBDcmVhdGUgcGF0aCBzdHJpbmcgd2l0aCBvcmlnaW5hbCBwYXNzZWQgb3B0aW9uc1xuICAgIHZhciBwYXRoU3RyaW5nID0gdGhpcy5fdHJhaWxTdHJpbmcob3B0cyk7XG5cbiAgICAvLyBQcmV2ZW50IG1vZGlmeWluZyBvcmlnaW5hbFxuICAgIHZhciBuZXdPcHRzID0gdXRpbHMuZXh0ZW5kKHt9LCBvcHRzKTtcblxuICAgIC8vIERlZmF1bHRzIGZvciBwYXJhbWV0ZXJzIHdoaWNoIG1vZGlmeSB0cmFpbCBwYXRoXG4gICAgaWYgKCFuZXdPcHRzLnRyYWlsQ29sb3IpIG5ld09wdHMudHJhaWxDb2xvciA9ICcjZWVlJztcbiAgICBpZiAoIW5ld09wdHMudHJhaWxXaWR0aCkgbmV3T3B0cy50cmFpbFdpZHRoID0gbmV3T3B0cy5zdHJva2VXaWR0aDtcblxuICAgIG5ld09wdHMuY29sb3IgPSBuZXdPcHRzLnRyYWlsQ29sb3I7XG4gICAgbmV3T3B0cy5zdHJva2VXaWR0aCA9IG5ld09wdHMudHJhaWxXaWR0aDtcblxuICAgIC8vIFdoZW4gdHJhaWwgcGF0aCBpcyBzZXQsIGZpbGwgbXVzdCBiZSBzZXQgZm9yIGl0IGluc3RlYWQgb2YgdGhlXG4gICAgLy8gYWN0dWFsIHBhdGggdG8gcHJldmVudCB0cmFpbCBzdHJva2UgZnJvbSBjbGlwcGluZ1xuICAgIG5ld09wdHMuZmlsbCA9IG51bGw7XG5cbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlUGF0aEVsZW1lbnQocGF0aFN0cmluZywgbmV3T3B0cyk7XG59O1xuXG5TaGFwZS5wcm90b3R5cGUuX2NyZWF0ZVBhdGhFbGVtZW50ID0gZnVuY3Rpb24gX2NyZWF0ZVBhdGhFbGVtZW50KHBhdGhTdHJpbmcsIG9wdHMpIHtcbiAgICB2YXIgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgcGF0aFN0cmluZyk7XG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIG9wdHMuY29sb3IpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCBvcHRzLnN0cm9rZVdpZHRoKTtcblxuICAgIGlmIChvcHRzLmZpbGwpIHtcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBvcHRzLmZpbGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdmaWxsLW9wYWNpdHknLCAnMCcpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXRoO1xufTtcblxuU2hhcGUucHJvdG90eXBlLl9jcmVhdGVUZXh0RWxlbWVudCA9IGZ1bmN0aW9uIF9jcmVhdGVUZXh0RWxlbWVudChvcHRzLCBjb250YWluZXIpIHtcbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG9wdHMudGV4dC52YWx1ZSkpO1xuXG4gICAgaWYgKG9wdHMudGV4dC5hdXRvU3R5bGUpIHtcbiAgICAgICAgLy8gQ2VudGVyIHRleHRcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gJzUwJSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9ICc1MCUnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnBhZGRpbmcgPSAwO1xuICAgICAgICBlbGVtZW50LnN0eWxlLm1hcmdpbiA9IDA7XG4gICAgICAgIHV0aWxzLnNldFN0eWxlKGVsZW1lbnQsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKC01MCUsIC01MCUpJyk7XG5cbiAgICAgICAgaWYgKG9wdHMudGV4dC5jb2xvcikge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5jb2xvciA9IG9wdHMudGV4dC5jb2xvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY29sb3IgPSBvcHRzLmNvbG9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gb3B0cy50ZXh0LmNsYXNzTmFtZTtcblxuICAgIHJldHVybiBlbGVtZW50O1xufTtcblxuU2hhcGUucHJvdG90eXBlLl9wYXRoU3RyaW5nID0gZnVuY3Rpb24gX3BhdGhTdHJpbmcob3B0cykge1xuICAgIHRocm93IG5ldyBFcnJvcignT3ZlcnJpZGUgdGhpcyBmdW5jdGlvbiBmb3IgZWFjaCBwcm9ncmVzcyBiYXInKTtcbn07XG5cblNoYXBlLnByb3RvdHlwZS5fdHJhaWxTdHJpbmcgPSBmdW5jdGlvbiBfdHJhaWxTdHJpbmcob3B0cykge1xuICAgIHRocm93IG5ldyBFcnJvcignT3ZlcnJpZGUgdGhpcyBmdW5jdGlvbiBmb3IgZWFjaCBwcm9ncmVzcyBiYXInKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcGU7XG4iLCIvLyBTcXVhcmUgc2hhcGVkIHByb2dyZXNzIGJhclxuXG52YXIgU2hhcGUgPSByZXF1aXJlKCcuL3NoYXBlJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cblxudmFyIFNxdWFyZSA9IGZ1bmN0aW9uIFNxdWFyZShjb250YWluZXIsIG9wdGlvbnMpIHtcbiAgICB0aGlzLl9wYXRoVGVtcGxhdGUgPVxuICAgICAgICAnTSAwLHtoYWxmT2ZTdHJva2VXaWR0aH0nICtcbiAgICAgICAgJyBMIHt3aWR0aH0se2hhbGZPZlN0cm9rZVdpZHRofScgK1xuICAgICAgICAnIEwge3dpZHRofSx7d2lkdGh9JyArXG4gICAgICAgICcgTCB7aGFsZk9mU3Ryb2tlV2lkdGh9LHt3aWR0aH0nICtcbiAgICAgICAgJyBMIHtoYWxmT2ZTdHJva2VXaWR0aH0se3N0cm9rZVdpZHRofSc7XG5cbiAgICB0aGlzLl90cmFpbFRlbXBsYXRlID1cbiAgICAgICAgJ00ge3N0YXJ0TWFyZ2lufSx7aGFsZk9mU3Ryb2tlV2lkdGh9JyArXG4gICAgICAgICcgTCB7d2lkdGh9LHtoYWxmT2ZTdHJva2VXaWR0aH0nICtcbiAgICAgICAgJyBMIHt3aWR0aH0se3dpZHRofScgK1xuICAgICAgICAnIEwge2hhbGZPZlN0cm9rZVdpZHRofSx7d2lkdGh9JyArXG4gICAgICAgICcgTCB7aGFsZk9mU3Ryb2tlV2lkdGh9LHtoYWxmT2ZTdHJva2VXaWR0aH0nO1xuXG4gICAgU2hhcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cblNxdWFyZS5wcm90b3R5cGUgPSBuZXcgU2hhcGUoKTtcblNxdWFyZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTcXVhcmU7XG5cblNxdWFyZS5wcm90b3R5cGUuX3BhdGhTdHJpbmcgPSBmdW5jdGlvbiBfcGF0aFN0cmluZyhvcHRzKSB7XG4gICAgdmFyIHcgPSAxMDAgLSBvcHRzLnN0cm9rZVdpZHRoIC8gMjtcblxuICAgIHJldHVybiB1dGlscy5yZW5kZXIodGhpcy5fcGF0aFRlbXBsYXRlLCB7XG4gICAgICAgIHdpZHRoOiB3LFxuICAgICAgICBzdHJva2VXaWR0aDogb3B0cy5zdHJva2VXaWR0aCxcbiAgICAgICAgaGFsZk9mU3Ryb2tlV2lkdGg6IG9wdHMuc3Ryb2tlV2lkdGggLyAyXG4gICAgfSk7XG59O1xuXG5TcXVhcmUucHJvdG90eXBlLl90cmFpbFN0cmluZyA9IGZ1bmN0aW9uIF90cmFpbFN0cmluZyhvcHRzKSB7XG4gICAgdmFyIHcgPSAxMDAgLSBvcHRzLnN0cm9rZVdpZHRoIC8gMjtcblxuICAgIHJldHVybiB1dGlscy5yZW5kZXIodGhpcy5fdHJhaWxUZW1wbGF0ZSwge1xuICAgICAgICB3aWR0aDogdyxcbiAgICAgICAgc3Ryb2tlV2lkdGg6IG9wdHMuc3Ryb2tlV2lkdGgsXG4gICAgICAgIGhhbGZPZlN0cm9rZVdpZHRoOiBvcHRzLnN0cm9rZVdpZHRoIC8gMixcbiAgICAgICAgc3RhcnRNYXJnaW46IChvcHRzLnN0cm9rZVdpZHRoIC8gMikgLSAob3B0cy50cmFpbFdpZHRoIC8gMilcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3F1YXJlO1xuIiwiLy8gVXRpbGl0eSBmdW5jdGlvbnNcblxudmFyIFBSRUZJWEVTID0gJ1dlYmtpdCBNb3ogTyBtcycuc3BsaXQoJyAnKTtcblxuLy8gQ29weSBhbGwgYXR0cmlidXRlcyBmcm9tIHNvdXJjZSBvYmplY3QgdG8gZGVzdGluYXRpb24gb2JqZWN0LlxuLy8gZGVzdGluYXRpb24gb2JqZWN0IGlzIG11dGF0ZWQuXG5mdW5jdGlvbiBleHRlbmQoZGVzdGluYXRpb24sIHNvdXJjZSwgcmVjdXJzaXZlKSB7XG4gICAgZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbiB8fCB7fTtcbiAgICBzb3VyY2UgPSBzb3VyY2UgfHwge307XG4gICAgcmVjdXJzaXZlID0gcmVjdXJzaXZlIHx8IGZhbHNlO1xuXG4gICAgZm9yICh2YXIgYXR0ck5hbWUgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICB2YXIgZGVzdFZhbCA9IGRlc3RpbmF0aW9uW2F0dHJOYW1lXTtcbiAgICAgICAgICAgIHZhciBzb3VyY2VWYWwgPSBzb3VyY2VbYXR0ck5hbWVdO1xuICAgICAgICAgICAgaWYgKHJlY3Vyc2l2ZSAmJiBpc09iamVjdChkZXN0VmFsKSAmJiBpc09iamVjdChzb3VyY2VWYWwpKSB7XG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25bYXR0ck5hbWVdID0gZXh0ZW5kKGRlc3RWYWwsIHNvdXJjZVZhbCwgcmVjdXJzaXZlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25bYXR0ck5hbWVdID0gc291cmNlVmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxuXG4vLyBSZW5kZXJzIHRlbXBsYXRlcyB3aXRoIGdpdmVuIHZhcmlhYmxlcy4gVmFyaWFibGVzIG11c3QgYmUgc3Vycm91bmRlZCB3aXRoXG4vLyBicmFjZXMgd2l0aG91dCBhbnkgc3BhY2VzLCBlLmcuIHt2YXJpYWJsZX1cbi8vIEFsbCBpbnN0YW5jZXMgb2YgdmFyaWFibGUgcGxhY2Vob2xkZXJzIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCBnaXZlbiBjb250ZW50XG4vLyBFeGFtcGxlOlxuLy8gcmVuZGVyKCdIZWxsbywge21lc3NhZ2V9IScsIHttZXNzYWdlOiAnd29ybGQnfSlcbmZ1bmN0aW9uIHJlbmRlcih0ZW1wbGF0ZSwgdmFycykge1xuICAgIHZhciByZW5kZXJlZCA9IHRlbXBsYXRlO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHZhcnMpIHtcbiAgICAgICAgaWYgKHZhcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgdmFyIHZhbCA9IHZhcnNba2V5XTtcbiAgICAgICAgICAgIHZhciByZWdFeHBTdHJpbmcgPSAnXFxcXHsnICsga2V5ICsgJ1xcXFx9JztcbiAgICAgICAgICAgIHZhciByZWdFeHAgPSBuZXcgUmVnRXhwKHJlZ0V4cFN0cmluZywgJ2cnKTtcblxuICAgICAgICAgICAgcmVuZGVyZWQgPSByZW5kZXJlZC5yZXBsYWNlKHJlZ0V4cCwgdmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZW5kZXJlZDtcbn1cblxuZnVuY3Rpb24gc2V0U3R5bGUoZWxlbWVudCwgc3R5bGUsIHZhbHVlKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBQUkVGSVhFUy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgcHJlZml4ID0gUFJFRklYRVNbaV07XG4gICAgICAgIGVsZW1lbnQuc3R5bGVbcHJlZml4ICsgY2FwaXRhbGl6ZShzdHlsZSldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZWxlbWVudC5zdHlsZVtzdHlsZV0gPSB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gY2FwaXRhbGl6ZSh0ZXh0KSB7XG4gICAgcmV0dXJuIHRleHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0ZXh0LnNsaWNlKDEpO1xufVxuXG5mdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgfHwgb2JqIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLy8gUmV0dXJucyB0cnVlIGlmIGBvYmpgIGlzIG9iamVjdCBhcyBpbiB7YTogMSwgYjogMn0sIG5vdCBpZiBpdCdzIGZ1bmN0aW9uIG9yXG4vLyBhcnJheVxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gICAgaWYgKGlzQXJyYXkob2JqKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqO1xuICAgIHJldHVybiB0eXBlID09PSAnb2JqZWN0JyAmJiAhIW9iajtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBleHRlbmQ6IGV4dGVuZCxcbiAgICByZW5kZXI6IHJlbmRlcixcbiAgICBzZXRTdHlsZTogc2V0U3R5bGUsXG4gICAgY2FwaXRhbGl6ZTogY2FwaXRhbGl6ZSxcbiAgICBpc1N0cmluZzogaXNTdHJpbmcsXG4gICAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgICBpc09iamVjdDogaXNPYmplY3Rcbn07XG4iXX0=
