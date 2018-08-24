/** @license React v16.4.3-alpha.0
 * interaction-tracking-subscriptions.development.js
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

    var interactionTracking = require("interaction-tracking");

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

    var subscribers = null;
    if (enableInteractionTracking) {
      subscribers = new Set();
    }

    function subscribe(subscriber) {
      if (enableInteractionTracking) {
        subscribers.add(subscriber);
      }
    }

    function unsubscribe(subscriber) {
      if (enableInteractionTracking) {
        subscribers.delete(subscriber);
      }
    }

    function onInteractionTracked(interaction) {
      var didCatchError = false;
      var caughtError = null;

      subscribers.forEach(function(subscriber) {
        try {
          subscriber.onInteractionTracked(interaction);
        } catch (error) {
          if (!didCatchError) {
            didCatchError = true;
            caughtError = error;
          }
        }
      });

      if (didCatchError) {
        throw caughtError;
      }
    }

    function onInteractionScheduledWorkCompleted(interaction) {
      var didCatchError = false;
      var caughtError = null;

      subscribers.forEach(function(subscriber) {
        try {
          subscriber.onInteractionScheduledWorkCompleted(interaction);
        } catch (error) {
          if (!didCatchError) {
            didCatchError = true;
            caughtError = error;
          }
        }
      });

      if (didCatchError) {
        throw caughtError;
      }
    }

    function onWorkScheduled(interactions, threadID) {
      var didCatchError = false;
      var caughtError = null;

      subscribers.forEach(function(subscriber) {
        try {
          subscriber.onWorkScheduled(interactions, threadID);
        } catch (error) {
          if (!didCatchError) {
            didCatchError = true;
            caughtError = error;
          }
        }
      });

      if (didCatchError) {
        throw caughtError;
      }
    }

    function onWorkStarted(interactions, threadID) {
      var didCatchError = false;
      var caughtError = null;

      subscribers.forEach(function(subscriber) {
        try {
          subscriber.onWorkStarted(interactions, threadID);
        } catch (error) {
          if (!didCatchError) {
            didCatchError = true;
            caughtError = error;
          }
        }
      });

      if (didCatchError) {
        throw caughtError;
      }
    }

    function onWorkStopped(interactions, threadID) {
      var didCatchError = false;
      var caughtError = null;

      subscribers.forEach(function(subscriber) {
        try {
          subscriber.onWorkStopped(interactions, threadID);
        } catch (error) {
          if (!didCatchError) {
            didCatchError = true;
            caughtError = error;
          }
        }
      });

      if (didCatchError) {
        throw caughtError;
      }
    }

    function onWorkCanceled(interactions, threadID) {
      var didCatchError = false;
      var caughtError = null;

      subscribers.forEach(function(subscriber) {
        try {
          subscriber.onWorkCanceled(interactions, threadID);
        } catch (error) {
          if (!didCatchError) {
            didCatchError = true;
            caughtError = error;
          }
        }
      });

      if (didCatchError) {
        throw caughtError;
      }
    }

    if (enableInteractionTracking) {
      interactionTracking.__subscriberRef.current = {
        onInteractionScheduledWorkCompleted: onInteractionScheduledWorkCompleted,
        onInteractionTracked: onInteractionTracked,
        onWorkCanceled: onWorkCanceled,
        onWorkScheduled: onWorkScheduled,
        onWorkStarted: onWorkStarted,
        onWorkStopped: onWorkStopped,
      };
    }

    exports.subscribe = subscribe;
    exports.unsubscribe = unsubscribe;
  })();
}
