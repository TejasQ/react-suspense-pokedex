/** @license React v16.4.3-alpha.0
 * interaction-tracking.development.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

if (process.env.NODE_ENV !== "production") {
  (function() {
    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });

    /**
     * Use invariant() to assert state which your program assumes to be true.
     *
     * Provide sprintf-style format (only %s is supported) and arguments
     * to provide information about what broke and what you were
     * expecting.
     *
     * The invariant message will be stripped in production, but the invariant
     * will remain to ensure logic does not differ in production.
     */

    {
    }

    // Relying on the `invariant()` implementation lets us
    // preserve the format and params in the www builds.

    // Exports ReactDOM.createRoot

    // Experimental error-boundary API that can recover from errors within a single
    // render phase

    // Suspense

    // Helps identify side effects in begin-phase lifecycle hooks and setState reducers:

    // In some cases, StrictMode should also double-render lifecycles.
    // This can be confusing for tests though,
    // And it can be bad for performance in production.
    // This feature flag can be used to control the behavior:

    // To preserve the "Pause on caught exceptions" behavior of the debugger, we
    // replay the begin phase of a failed component inside invokeGuardedCallback.

    // Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:

    // Warn about legacy context API

    // Gather advanced timing metrics for Profiler subtrees.

    // Track which interactions trigger each commit.
    var enableInteractionTracking = false;

    // Only used in www builds.

    var DEFAULT_THREAD_ID = 0;

    // Counters used to generate unique IDs.
    var interactionIDCounter = 0;
    var threadIDCounter = 0;

    // Set of currently tracked interactions.
    // Interactions "stack"–
    // Meaning that newly tracked interactions are appended to the previously active set.
    // When an interaction goes out of scope, the previous set (if any) is restored.
    exports.__interactionsRef = null;

    // Listener(s) to notify when interactions begin and end.
    exports.__subscriberRef = null;

    if (enableInteractionTracking) {
      exports.__interactionsRef = {
        current: new Set(),
      };
      exports.__subscriberRef = {
        current: null,
      };
    }

    function clear(callback) {
      if (!enableInteractionTracking) {
        return callback();
      }

      var prevInteractions = exports.__interactionsRef.current;
      exports.__interactionsRef.current = new Set();

      try {
        return callback();
      } finally {
        exports.__interactionsRef.current = prevInteractions;
      }
    }

    function getCurrent() {
      if (!enableInteractionTracking) {
        return null;
      } else {
        return exports.__interactionsRef.current;
      }
    }

    function getThreadID() {
      return ++threadIDCounter;
    }

    function track(name, timestamp, callback) {
      var threadID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_THREAD_ID;

      if (!enableInteractionTracking) {
        return callback();
      }

      var interaction = {
        __count: 1,
        id: interactionIDCounter++,
        name: name,
        timestamp: timestamp,
      };

      var prevInteractions = exports.__interactionsRef.current;

      // Tracked interactions should stack/accumulate.
      // To do that, clone the current interactions.
      // The previous set will be restored upon completion.
      var interactions = new Set(prevInteractions);
      interactions.add(interaction);
      exports.__interactionsRef.current = interactions;

      var subscriber = exports.__subscriberRef.current;
      var returnValue = void 0;

      try {
        if (subscriber !== null) {
          subscriber.onInteractionTracked(interaction);
        }
      } finally {
        try {
          if (subscriber !== null) {
            subscriber.onWorkStarted(interactions, threadID);
          }
        } finally {
          try {
            returnValue = callback();
          } finally {
            exports.__interactionsRef.current = prevInteractions;

            try {
              if (subscriber !== null) {
                subscriber.onWorkStopped(interactions, threadID);
              }
            } finally {
              interaction.__count--;

              // If no async work was scheduled for this interaction,
              // Notify subscribers that it's completed.
              if (subscriber !== null && interaction.__count === 0) {
                subscriber.onInteractionScheduledWorkCompleted(interaction);
              }
            }
          }
        }
      }

      return returnValue;
    }

    function wrap(callback) {
      var threadID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_THREAD_ID;

      if (!enableInteractionTracking) {
        return callback;
      }

      var wrappedInteractions = exports.__interactionsRef.current;

      var subscriber = exports.__subscriberRef.current;
      if (subscriber !== null) {
        subscriber.onWorkScheduled(wrappedInteractions, threadID);
      }

      // Update the pending async work count for the current interactions.
      // Update after calling subscribers in case of error.
      wrappedInteractions.forEach(function(interaction) {
        interaction.__count++;
      });

      function wrapped() {
        var prevInteractions = exports.__interactionsRef.current;
        exports.__interactionsRef.current = wrappedInteractions;

        subscriber = exports.__subscriberRef.current;

        try {
          var returnValue = void 0;

          try {
            if (subscriber !== null) {
              subscriber.onWorkStarted(wrappedInteractions, threadID);
            }
          } finally {
            try {
              returnValue = callback.apply(undefined, arguments);
            } finally {
              exports.__interactionsRef.current = prevInteractions;

              if (subscriber !== null) {
                subscriber.onWorkStopped(wrappedInteractions, threadID);
              }
            }
          }

          return returnValue;
        } finally {
          // Update pending async counts for all wrapped interactions.
          // If this was the last scheduled async work for any of them,
          // Mark them as completed.
          wrappedInteractions.forEach(function(interaction) {
            interaction.__count--;

            if (subscriber !== null && interaction.__count === 0) {
              subscriber.onInteractionScheduledWorkCompleted(interaction);
            }
          });
        }
      }

      wrapped.cancel = function cancel() {
        subscriber = exports.__subscriberRef.current;

        try {
          if (subscriber !== null) {
            subscriber.onWorkCanceled(wrappedInteractions, threadID);
          }
        } finally {
          // Update pending async counts for all wrapped interactions.
          // If this was the last scheduled async work for any of them,
          // Mark them as completed.
          wrappedInteractions.forEach(function(interaction) {
            interaction.__count--;

            if (subscriber && interaction.__count === 0) {
              subscriber.onInteractionScheduledWorkCompleted(interaction);
            }
          });
        }
      };

      return wrapped;
    }

    exports.clear = clear;
    exports.getCurrent = getCurrent;
    exports.getThreadID = getThreadID;
    exports.track = track;
    exports.wrap = wrap;
  })();
}
