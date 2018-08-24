/** @license React v16.4.3-alpha.0
 * react-dom-server.node.development.js
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

    var _assign = require("object-assign");
    var stream = require("stream");
    var React = require("react");

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

    var validateFormat = function() {};

    {
      validateFormat = function(format) {
        if (format === undefined) {
          throw new Error("invariant requires an error message argument");
        }
      };
    }

    function invariant(condition, format, a, b, c, d, e, f) {
      validateFormat(format);

      if (!condition) {
        var error = void 0;
        if (format === undefined) {
          error = new Error(
            "Minified exception occurred; use the non-minified dev environment " +
              "for the full error message and additional helpful warnings.",
          );
        } else {
          var args = [a, b, c, d, e, f];
          var argIndex = 0;
          error = new Error(
            format.replace(/%s/g, function() {
              return args[argIndex++];
            }),
          );
          error.name = "Invariant Violation";
        }

        error.framesToPop = 1; // we don't care about invariant's own frame
        throw error;
      }
    }

    // Relying on the `invariant()` implementation lets us
    // preserve the format and params in the www builds.

    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var hasSymbol = typeof Symbol === "function" && Symbol.for;

    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 0xeac7;

    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 0xeacb;
    var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 0xeacc;

    var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for("react.async_mode") : 0xeacf;

    var REACT_PLACEHOLDER_TYPE = hasSymbol ? Symbol.for("react.placeholder") : 0xead1;

    var HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
    var MATH_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
    var SVG_NAMESPACE = "http://www.w3.org/2000/svg";

    var Namespaces = {
      html: HTML_NAMESPACE,
      mathml: MATH_NAMESPACE,
      svg: SVG_NAMESPACE,
    };

    // Assumes there is no parent namespace.
    function getIntrinsicNamespace(type) {
      switch (type) {
        case "svg":
          return SVG_NAMESPACE;
        case "math":
          return MATH_NAMESPACE;
        default:
          return HTML_NAMESPACE;
      }
    }

    // For HTML, certain tags should omit their close tag. We keep a whitelist for
    // those special-case tags.

    var omittedCloseTags = {
      area: true,
      base: true,
      br: true,
      col: true,
      embed: true,
      hr: true,
      img: true,
      input: true,
      keygen: true,
      link: true,
      meta: true,
      param: true,
      source: true,
      track: true,
      wbr: true,
      // NOTE: menuitem's close tag should be omitted, but that causes problems.
    };

    var uppercasePattern = /([A-Z])/g;
    var msPattern = /^ms-/;

    /**
     * Hyphenates a camelcased CSS property name, for example:
     *
     *   > hyphenateStyleName('backgroundColor')
     *   < "background-color"
     *   > hyphenateStyleName('MozTransition')
     *   < "-moz-transition"
     *   > hyphenateStyleName('msTransition')
     *   < "-ms-transition"
     *
     * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
     * is converted to `-ms-`.
     */
    function hyphenateStyleName(name) {
      return name
        .replace(uppercasePattern, "-$1")
        .toLowerCase()
        .replace(msPattern, "-ms-");
    }

    /**
     * Forked from fbjs/warning:
     * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
     *
     * Only change is we use console.warn instead of console.error,
     * and do nothing when 'console' is not supported.
     * This really simplifies the code.
     * ---
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */

    {
    }

    /**
     * Memoizes the return value of a function that accepts one string argument.
     */

    function memoizeStringOnly(callback) {
      var cache = {};
      return function(string) {
        if (!cache.hasOwnProperty(string)) {
          cache[string] = callback.call(this, string);
        }
        return cache[string];
      };
    }

    var memoizeStringOnly_1 = memoizeStringOnly;

    /**
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */

    var warningWithoutStack = function() {};

    {
      warningWithoutStack = function(condition, format) {
        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        if (format === undefined) {
          throw new Error("`warningWithoutStack(condition, format, ...args)` requires a warning " + "message argument");
        }
        if (condition) {
          return;
        }
        if (typeof console !== "undefined") {
          var _console;

          var stringArgs = args.map(function(item) {
            return "" + item;
          });
          (_console = console).error.apply(_console, ["Warning: " + format].concat(stringArgs));
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          var argIndex = 0;
          var message =
            "Warning: " +
            format.replace(/%s/g, function() {
              return args[argIndex++];
            });
          throw new Error(message);
        } catch (x) {}
      };
    }

    var warningWithoutStack$1 = warningWithoutStack;

    var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

    /**
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */

    var warning = warningWithoutStack$1;

    {
      warning = function(condition, format) {
        if (condition) {
          return;
        }
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        var stack = ReactDebugCurrentFrame.getStackAddendum();
        // eslint-disable-next-line react-internal/warning-and-invariant-args

        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        warningWithoutStack$1.apply(undefined, [false, format + "%s"].concat(args, [stack]));
      };
    }

    var warning$1 = warning;

    var BEFORE_SLASH_RE = /^(.*)[\\\/]/;

    var describeComponentFrame = function(name, source, ownerName) {
      var sourceInfo = "";
      if (source) {
        var path = source.fileName;
        var fileName = path.replace(BEFORE_SLASH_RE, "");
        {
          // In DEV, include code for a common special case:
          // prefer "folder/index.js" instead of just "index.js".
          if (/^index\./.test(fileName)) {
            var match = path.match(BEFORE_SLASH_RE);
            if (match) {
              var pathBeforeSlash = match[1];
              if (pathBeforeSlash) {
                var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, "");
                fileName = folderName + "/" + fileName;
              }
            }
          }
        }
        sourceInfo = " (at " + fileName + ":" + source.lineNumber + ")";
      } else if (ownerName) {
        sourceInfo = " (created by " + ownerName + ")";
      }
      return "\n    in " + (name || "Unknown") + sourceInfo;
    };

    var ReactInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

    var ReactCurrentOwner = ReactInternals.ReactCurrentOwner;
    var ReactDebugCurrentFrame = ReactInternals.ReactDebugCurrentFrame;

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

    // Only used in www builds.

    // A reserved attribute.
    // It is handled by React separately and shouldn't be written to the DOM.
    var RESERVED = 0;

    // A simple string attribute.
    // Attributes that aren't in the whitelist are presumed to have this type.
    var STRING = 1;

    // A string attribute that accepts booleans in React. In HTML, these are called
    // "enumerated" attributes with "true" and "false" as possible values.
    // When true, it should be set to a "true" string.
    // When false, it should be set to a "false" string.
    var BOOLEANISH_STRING = 2;

    // A real boolean attribute.
    // When true, it should be present (set either to an empty string or its name).
    // When false, it should be omitted.
    var BOOLEAN = 3;

    // An attribute that can be used as a flag as well as with a value.
    // When true, it should be present (set either to an empty string or its name).
    // When false, it should be omitted.
    // For any other value, should be present with that value.
    var OVERLOADED_BOOLEAN = 4;

    // An attribute that must be numeric or parse as a numeric.
    // When falsy, it should be removed.
    var NUMERIC = 5;

    // An attribute that must be positive numeric or parse as a positive numeric.
    // When falsy, it should be removed.
    var POSITIVE_NUMERIC = 6;

    /* eslint-disable max-len */
    var ATTRIBUTE_NAME_START_CHAR =
      ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    /* eslint-enable max-len */
    var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";

    var ROOT_ATTRIBUTE_NAME = "data-reactroot";
    var VALID_ATTRIBUTE_NAME_REGEX = new RegExp("^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$");

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var illegalAttributeNameCache = {};
    var validatedAttributeNameCache = {};

    function isAttributeNameSafe(attributeName) {
      if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) {
        return true;
      }
      if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) {
        return false;
      }
      if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
        validatedAttributeNameCache[attributeName] = true;
        return true;
      }
      illegalAttributeNameCache[attributeName] = true;
      {
        warning$1(false, "Invalid attribute name: `%s`", attributeName);
      }
      return false;
    }

    function shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag) {
      if (propertyInfo !== null) {
        return propertyInfo.type === RESERVED;
      }
      if (isCustomComponentTag) {
        return false;
      }
      if (name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")) {
        return true;
      }
      return false;
    }

    function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
      if (propertyInfo !== null && propertyInfo.type === RESERVED) {
        return false;
      }
      switch (typeof value) {
        case "function":
        // $FlowIssue symbol is perfectly valid here
        case "symbol":
          // eslint-disable-line
          return true;
        case "boolean": {
          if (isCustomComponentTag) {
            return false;
          }
          if (propertyInfo !== null) {
            return !propertyInfo.acceptsBooleans;
          } else {
            var prefix = name.toLowerCase().slice(0, 5);
            return prefix !== "data-" && prefix !== "aria-";
          }
        }
        default:
          return false;
      }
    }

    function shouldRemoveAttribute(name, value, propertyInfo, isCustomComponentTag) {
      if (value === null || typeof value === "undefined") {
        return true;
      }
      if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag)) {
        return true;
      }
      if (isCustomComponentTag) {
        return false;
      }
      if (propertyInfo !== null) {
        switch (propertyInfo.type) {
          case BOOLEAN:
            return !value;
          case OVERLOADED_BOOLEAN:
            return value === false;
          case NUMERIC:
            return isNaN(value);
          case POSITIVE_NUMERIC:
            return isNaN(value) || value < 1;
        }
      }
      return false;
    }

    function getPropertyInfo(name) {
      return properties.hasOwnProperty(name) ? properties[name] : null;
    }

    function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace) {
      this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
      this.attributeName = attributeName;
      this.attributeNamespace = attributeNamespace;
      this.mustUseProperty = mustUseProperty;
      this.propertyName = name;
      this.type = type;
    }

    // When adding attributes to this list, be sure to also add them to
    // the `possibleStandardNames` module to ensure casing and incorrect
    // name warnings.
    var properties = {};

    // These props are reserved by React. They shouldn't be written to the DOM.
    [
      "children",
      "dangerouslySetInnerHTML",
      // TODO: This prevents the assignment of defaultValue to regular
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style",
    ].forEach(
      function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          RESERVED,
          false, // mustUseProperty
          name, // attributeName
          null,
        );
      }, // attributeNamespace
    );

    // A few React string attributes have a different name.
    // This is a mapping from React prop names to the attribute names.
    [
      ["acceptCharset", "accept-charset"],
      ["className", "class"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
    ].forEach(
      function(_ref) {
        var name = _ref[0],
          attributeName = _ref[1];

        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          false, // mustUseProperty
          attributeName, // attributeName
          null,
        );
      }, // attributeNamespace
    );

    // These are "enumerated" HTML attributes that accept "true" and "false".
    // In React, we let users pass `true` and `false` even though technically
    // these aren't boolean attributes (they are coerced to strings).
    ["contentEditable", "draggable", "spellCheck", "value"].forEach(
      function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEANISH_STRING,
          false, // mustUseProperty
          name.toLowerCase(), // attributeName
          null,
        );
      }, // attributeNamespace
    );

    // These are "enumerated" SVG attributes that accept "true" and "false".
    // In React, we let users pass `true` and `false` even though technically
    // these aren't boolean attributes (they are coerced to strings).
    // Since these are SVG attributes, their attribute names are case-sensitive.
    ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(
      function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEANISH_STRING,
          false, // mustUseProperty
          name, // attributeName
          null,
        );
      }, // attributeNamespace
    );

    // These are HTML boolean attributes.
    [
      "allowFullScreen",
      "async",
      // Note: there is a special case that prevents it from being written to the DOM
      // on the client side because the browsers are inconsistent. Instead we call focus().
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      // Microdata
      "itemScope",
    ].forEach(
      function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEAN,
          false, // mustUseProperty
          name.toLowerCase(), // attributeName
          null,
        );
      }, // attributeNamespace
    );

    // These are the few React props that we set as DOM properties
    // rather than attributes. These are all booleans.
    [
      "checked",
      // Note: `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected",
    ].forEach(
      function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEAN,
          true, // mustUseProperty
          name, // attributeName
          null,
        );
      }, // attributeNamespace
    );

    // These are HTML attributes that are "overloaded booleans": they behave like
    // booleans, but can also accept a string value.
    ["capture", "download"].forEach(
      function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          OVERLOADED_BOOLEAN,
          false, // mustUseProperty
          name, // attributeName
          null,
        );
      }, // attributeNamespace
    );

    // These are HTML attributes that must be positive numbers.
    ["cols", "rows", "size", "span"].forEach(
      function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          POSITIVE_NUMERIC,
          false, // mustUseProperty
          name, // attributeName
          null,
        );
      }, // attributeNamespace
    );

    // These are HTML attributes that must be numbers.
    ["rowSpan", "start"].forEach(
      function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          NUMERIC,
          false, // mustUseProperty
          name.toLowerCase(), // attributeName
          null,
        );
      }, // attributeNamespace
    );

    var CAMELIZE = /[\-\:]([a-z])/g;
    var capitalize = function(token) {
      return token[1].toUpperCase();
    };

    // This is a list of all SVG attributes that need special casing, namespacing,
    // or boolean value assignment. Regular attributes that just accept strings
    // and have the same names are omitted, just like in the HTML whitelist.
    // Some of these attributes can be hard to find. This list was created by
    // scrapping the MDN documentation.
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height",
    ].forEach(
      function(attributeName) {
        var name = attributeName.replace(CAMELIZE, capitalize);
        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          false, // mustUseProperty
          attributeName,
          null,
        );
      }, // attributeNamespace
    );

    // String SVG attributes with the xlink namespace.
    ["xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type"].forEach(
      function(attributeName) {
        var name = attributeName.replace(CAMELIZE, capitalize);
        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          false, // mustUseProperty
          attributeName,
          "http://www.w3.org/1999/xlink",
        );
      },
    );

    // String SVG attributes with the xml namespace.
    ["xml:base", "xml:lang", "xml:space"].forEach(function(attributeName) {
      var name = attributeName.replace(CAMELIZE, capitalize);
      properties[name] = new PropertyInfoRecord(
        name,
        STRING,
        false, // mustUseProperty
        attributeName,
        "http://www.w3.org/XML/1998/namespace",
      );
    });

    // Special case: this attribute exists both in HTML and SVG.
    // Its "tabindex" attribute name is case-sensitive in SVG so we can't just use
    // its React `tabIndex` name, like we do for attributes that exist only in HTML.
    properties.tabIndex = new PropertyInfoRecord(
      "tabIndex",
      STRING,
      false, // mustUseProperty
      "tabindex", // attributeName
      null,
    );

    // code copied and modified from escape-html
    /**
     * Module variables.
     * @private
     */

    var matchHtmlRegExp = /["'&<>]/;

    /**
     * Escapes special characters and HTML entities in a given html string.
     *
     * @param  {string} string HTML string to escape for later insertion
     * @return {string}
     * @public
     */

    function escapeHtml(string) {
      var str = "" + string;
      var match = matchHtmlRegExp.exec(str);

      if (!match) {
        return str;
      }

      var escape = void 0;
      var html = "";
      var index = 0;
      var lastIndex = 0;

      for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
          case 34:
            // "
            escape = "&quot;";
            break;
          case 38:
            // &
            escape = "&amp;";
            break;
          case 39:
            // '
            escape = "&#x27;"; // modified from escape-html; used to be '&#39'
            break;
          case 60:
            // <
            escape = "&lt;";
            break;
          case 62:
            // >
            escape = "&gt;";
            break;
          default:
            continue;
        }

        if (lastIndex !== index) {
          html += str.substring(lastIndex, index);
        }

        lastIndex = index + 1;
        html += escape;
      }

      return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
    }
    // end code copied and modified from escape-html

    /**
     * Escapes text to prevent scripting attacks.
     *
     * @param {*} text Text value to escape.
     * @return {string} An escaped string.
     */
    function escapeTextForBrowser(text) {
      if (typeof text === "boolean" || typeof text === "number") {
        // this shortcircuit helps perf for types that we know will never have
        // special characters, especially given that this function is used often
        // for numeric dom ids.
        return "" + text;
      }
      return escapeHtml(text);
    }

    /**
     * Escapes attribute value to prevent scripting attacks.
     *
     * @param {*} value Value to escape.
     * @return {string} An escaped string.
     */
    function quoteAttributeValueForBrowser(value) {
      return '"' + escapeTextForBrowser(value) + '"';
    }

    /**
     * Operations for dealing with DOM properties.
     */

    /**
     * Creates markup for the ID property.
     *
     * @param {string} id Unescaped ID.
     * @return {string} Markup string.
     */

    function createMarkupForRoot() {
      return ROOT_ATTRIBUTE_NAME + '=""';
    }

    /**
     * Creates markup for a property.
     *
     * @param {string} name
     * @param {*} value
     * @return {?string} Markup string, or null if the property was invalid.
     */
    function createMarkupForProperty(name, value) {
      var propertyInfo = getPropertyInfo(name);
      if (name !== "style" && shouldIgnoreAttribute(name, propertyInfo, false)) {
        return "";
      }
      if (shouldRemoveAttribute(name, value, propertyInfo, false)) {
        return "";
      }
      if (propertyInfo !== null) {
        var attributeName = propertyInfo.attributeName;
        var type = propertyInfo.type;

        if (type === BOOLEAN || (type === OVERLOADED_BOOLEAN && value === true)) {
          return attributeName + '=""';
        } else {
          return attributeName + "=" + quoteAttributeValueForBrowser(value);
        }
      } else {
        return name + "=" + quoteAttributeValueForBrowser(value);
      }
    }

    /**
     * Creates markup for a custom property.
     *
     * @param {string} name
     * @param {*} value
     * @return {string} Markup string, or empty string if the property was invalid.
     */
    function createMarkupForCustomAttribute(name, value) {
      if (!isAttributeNameSafe(name) || value == null) {
        return "";
      }
      return name + "=" + quoteAttributeValueForBrowser(value);
    }

    var ReactDebugCurrentFrame$1 = null;

    {
      ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
    }

    // For HTML, certain tags cannot have children. This has the same purpose as
    // `omittedCloseTags` except that `menuitem` should still have its closing tag.

    var voidElementTags = _assign(
      {
        menuitem: true,
      },
      omittedCloseTags,
    );

    // TODO: We can remove this if we add invariantWithStack()
    // or add stack by default to invariants where possible.
    var ReactDebugCurrentFrame$2 = null;
    {
      ReactDebugCurrentFrame$2 = ReactSharedInternals.ReactDebugCurrentFrame;
    }

    /**
     * CSS properties which accept numbers but are not in units of "px".
     */
    var isUnitlessNumber = {
      animationIterationCount: true,
      borderImageOutset: true,
      borderImageSlice: true,
      borderImageWidth: true,
      boxFlex: true,
      boxFlexGroup: true,
      boxOrdinalGroup: true,
      columnCount: true,
      columns: true,
      flex: true,
      flexGrow: true,
      flexPositive: true,
      flexShrink: true,
      flexNegative: true,
      flexOrder: true,
      gridRow: true,
      gridRowEnd: true,
      gridRowSpan: true,
      gridRowStart: true,
      gridColumn: true,
      gridColumnEnd: true,
      gridColumnSpan: true,
      gridColumnStart: true,
      fontWeight: true,
      lineClamp: true,
      lineHeight: true,
      opacity: true,
      order: true,
      orphans: true,
      tabSize: true,
      widows: true,
      zIndex: true,
      zoom: true,

      // SVG-related properties
      fillOpacity: true,
      floodOpacity: true,
      stopOpacity: true,
      strokeDasharray: true,
      strokeDashoffset: true,
      strokeMiterlimit: true,
      strokeOpacity: true,
      strokeWidth: true,
    };

    /**
     * @param {string} prefix vendor-specific prefix, eg: Webkit
     * @param {string} key style name, eg: transitionDuration
     * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
     * WebkitTransitionDuration
     */
    function prefixKey(prefix, key) {
      return prefix + key.charAt(0).toUpperCase() + key.substring(1);
    }

    /**
     * Support style names that may come passed in prefixed by adding permutations
     * of vendor prefixes.
     */
    var prefixes = ["Webkit", "ms", "Moz", "O"];

    // Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
    // infinite loop, because it iterates over the newly added props too.
    Object.keys(isUnitlessNumber).forEach(function(prop) {
      prefixes.forEach(function(prefix) {
        isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
      });
    });

    /**
     * Convert a value into the proper css writable value. The style name `name`
     * should be logical (no hyphens), as specified
     * in `CSSProperty.isUnitlessNumber`.
     *
     * @param {string} name CSS property name such as `topMargin`.
     * @param {*} value CSS property value such as `10px`.
     * @return {string} Normalized style value with dimensions applied.
     */
    function dangerousStyleValue(name, value, isCustomProperty) {
      // Note that we've removed escapeTextForBrowser() calls here since the
      // whole string will be escaped when the attribute is injected into
      // the markup. If you provide unsafe user data here they can inject
      // arbitrary CSS which may be problematic (I couldn't repro this):
      // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
      // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
      // This is not an XSS hole but instead a potential CSS injection issue
      // which has lead to a greater discussion about how we're going to
      // trust URLs moving forward. See #2115901

      var isEmpty = value == null || typeof value === "boolean" || value === "";
      if (isEmpty) {
        return "";
      }

      if (
        !isCustomProperty &&
        typeof value === "number" &&
        value !== 0 &&
        !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])
      ) {
        return value + "px"; // Presumes implicit 'px' suffix for unitless numbers
      }

      return ("" + value).trim();
    }

    function isCustomComponent(tagName, props) {
      if (tagName.indexOf("-") === -1) {
        return typeof props.is === "string";
      }
      switch (tagName) {
        // These are reserved SVG and MathML elements.
        // We don't mind this whitelist too much because we expect it to never grow.
        // The alternative is to track the namespace in a few places which is convoluted.
        // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return false;
        default:
          return true;
      }
    }

    var warnValidStyle = function() {};

    {
      // 'msTransform' is correct, but the other prefixes should be capitalized
      var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
      var msPattern$1 = /^-ms-/;
      var hyphenPattern = /-(.)/g;

      // style values shouldn't contain a semicolon
      var badStyleValueWithSemicolonPattern = /;\s*$/;

      var warnedStyleNames = {};
      var warnedStyleValues = {};
      var warnedForNaNValue = false;
      var warnedForInfinityValue = false;

      var camelize = function(string) {
        return string.replace(hyphenPattern, function(_, character) {
          return character.toUpperCase();
        });
      };

      var warnHyphenatedStyleName = function(name) {
        if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
          return;
        }

        warnedStyleNames[name] = true;
        warning$1(
          false,
          "Unsupported style property %s. Did you mean %s?",
          name,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          camelize(name.replace(msPattern$1, "ms-")),
        );
      };

      var warnBadVendoredStyleName = function(name) {
        if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
          return;
        }

        warnedStyleNames[name] = true;
        warning$1(
          false,
          "Unsupported vendor-prefixed style property %s. Did you mean %s?",
          name,
          name.charAt(0).toUpperCase() + name.slice(1),
        );
      };

      var warnStyleValueWithSemicolon = function(name, value) {
        if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
          return;
        }

        warnedStyleValues[value] = true;
        warning$1(
          false,
          "Style property values shouldn't contain a semicolon. " + 'Try "%s: %s" instead.',
          name,
          value.replace(badStyleValueWithSemicolonPattern, ""),
        );
      };

      var warnStyleValueIsNaN = function(name, value) {
        if (warnedForNaNValue) {
          return;
        }

        warnedForNaNValue = true;
        warning$1(false, "`NaN` is an invalid value for the `%s` css style property.", name);
      };

      var warnStyleValueIsInfinity = function(name, value) {
        if (warnedForInfinityValue) {
          return;
        }

        warnedForInfinityValue = true;
        warning$1(false, "`Infinity` is an invalid value for the `%s` css style property.", name);
      };

      warnValidStyle = function(name, value) {
        if (name.indexOf("-") > -1) {
          warnHyphenatedStyleName(name);
        } else if (badVendoredStyleNamePattern.test(name)) {
          warnBadVendoredStyleName(name);
        } else if (badStyleValueWithSemicolonPattern.test(value)) {
          warnStyleValueWithSemicolon(name, value);
        }

        if (typeof value === "number") {
          if (isNaN(value)) {
            warnStyleValueIsNaN(name, value);
          } else if (!isFinite(value)) {
            warnStyleValueIsInfinity(name, value);
          }
        }
      };
    }

    var warnValidStyle$1 = warnValidStyle;

    /**
     * Registers plugins so that they can extract and dispatch events.
     *
     * @see {EventPluginHub}
     */

    /**
     * Ordered list of injected plugins.
     */

    /**
     * Mapping from event name to dispatch config
     */

    /**
     * Mapping from registration name to plugin module
     */

    /**
     * Mapping from registration name to event name
     */

    /**
     * Mapping from lowercase registration names to the properly cased version,
     * used to warn in the case of missing event handlers. Available
     * only in true.
     * @type {Object}
     */

    // Trust the developer to only use possibleRegistrationNames in true

    /**
     * Injects an ordering of plugins (by plugin name). This allows the ordering
     * to be decoupled from injection of the actual plugins so that ordering is
     * always deterministic regardless of packaging, on-the-fly injection, etc.
     *
     * @param {array} InjectedEventPluginOrder
     * @internal
     * @see {EventPluginHub.injection.injectEventPluginOrder}
     */

    /**
     * Injects plugins to be used by `EventPluginHub`. The plugin names must be
     * in the ordering injected by `injectEventPluginOrder`.
     *
     * Plugins can be injected as part of page initialization or on-the-fly.
     *
     * @param {object} injectedNamesToPlugins Map from names to plugin modules.
     * @internal
     * @see {EventPluginHub.injection.injectEventPluginsByName}
     */

    // When adding attributes to the HTML or SVG whitelist, be sure to
    // also add them to this module to ensure casing and incorrect name
    // warnings.

    {
    }

    var emptyFunction = { thatReturns: thing => thing };
    // Based on reading the React.Children implementation. TODO: type this somewhere?

    var toArray = React.Children.toArray;

    var currentDebugStack = void 0;
    var getStackAddendum = () => "";
    var describeStackFrame = () => "";

    {
      describeStackFrame = function(element) {
        var source = element._source;
        var type = element.type;
        var name = getComponentName(type);
        var ownerName = null;
        return describeComponentFrame(name, source, ownerName);
      };

      currentDebugStack = null;
      getStackAddendum = function() {
        if (currentDebugStack === null) {
          return "";
        }
        var stack = "";
        var debugStack = currentDebugStack;
        for (var i = debugStack.length - 1; i >= 0; i--) {
          var frame = debugStack[i];
          var _debugElementStack = frame.debugElementStack;
          for (var ii = _debugElementStack.length - 1; ii >= 0; ii--) {
            stack += describeStackFrame(_debugElementStack[ii]);
          }
        }
        return stack;
      };
    }

    function getComponentName(type) {
      return typeof type === "string" ? type : typeof type === "function" ? type.displayName || type.name : null;
    }

    var processStyleName = memoizeStringOnly_1(function(styleName) {
      return hyphenateStyleName(styleName);
    });

    function createMarkupForStyles(styles) {
      var serialized = "";
      var delimiter = "";
      for (var styleName in styles) {
        if (!styles.hasOwnProperty(styleName)) {
          continue;
        }
        var isCustomProperty = styleName.indexOf("--") === 0;
        var styleValue = styles[styleName];
        {
          if (!isCustomProperty) {
            warnValidStyle$1(styleName, styleValue, getStackAddendum);
          }
        }
        if (styleValue != null) {
          serialized += delimiter + processStyleName(styleName) + ":";
          serialized += dangerousStyleValue(styleName, styleValue, isCustomProperty);

          delimiter = ";";
        }
      }
      return serialized || null;
    }

    var STYLE = "style";
    var RESERVED_PROPS = {
      children: null,
      dangerouslySetInnerHTML: null,
      suppressContentEditableWarning: null,
      suppressHydrationWarning: null,
    };

    function createOpenTagMarkup(tagVerbatim, tagLowercase, props, namespace, makeStaticMarkup, isRootElement) {
      var ret = "<" + tagVerbatim;

      for (var propKey in props) {
        if (!props.hasOwnProperty(propKey)) {
          continue;
        }
        var propValue = props[propKey];
        if (propValue == null) {
          continue;
        }
        if (propKey === STYLE) {
          propValue = createMarkupForStyles(propValue);
        }
        var markup = null;
        if (isCustomComponent(tagLowercase, props)) {
          if (!RESERVED_PROPS.hasOwnProperty(propKey)) {
            markup = createMarkupForCustomAttribute(propKey, propValue);
          }
        } else {
          markup = createMarkupForProperty(propKey, propValue);
        }
        if (markup) {
          ret += " " + markup;
        }
      }

      // For static pages, no need to put React ID and checksum. Saves lots of
      // bytes.
      if (makeStaticMarkup) {
        return ret;
      }

      if (isRootElement) {
        ret += " " + createMarkupForRoot();
      }
      return ret;
    }

    var FunctionalComponent = 0;

    var ClassComponent = 2;

    // Before we know whether it is functional or class
    var HostRoot = 5; // Root of a host tree. Could be nested inside another node.
    // A subtree. Could be an entry point to a different renderer.
    var HostComponent = 7;
    var HostText = 8;
    var Fragment = 9;

    var PlaceholderComponent = 16;

    var AsyncMode = 1;
    var StrictMode = 2;

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _possibleConstructorReturn(self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, enumerable: false, writable: true, configurable: true },
      });
      if (superClass)
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : (subClass.__proto__ = superClass);
    }

    var isArray = Array.isArray;

    var Pending = 0;
    var PendingChildren = 1;
    var Suspended = 2;
    var Complete = 3;

    var GLOBAL_TIMEOUT_MS = 5000;

    var EMPTY_ID = 0;
    var ROOT_BOUNDARY_ID = 1;

    function ReactHTMLStream(stream$$1, rootNode) {
      // 0 is reserved for empty, and 1 is reserved for the root boundary ID,
      var idCounter = 2;

      var currentTimeMs = Date.now();

      var rootChunk = createChunk(HostRoot);
      rootChunk.props = rootNode;
      rootChunk.hostContext = Namespaces.html;
      rootChunk.timeoutMs = GLOBAL_TIMEOUT_MS;

      var rootBoundary = createBoundary(rootChunk, currentTimeMs);
      rootBoundary.id = ROOT_BOUNDARY_ID;

      var pendingBoundaries = new Set([rootBoundary]);

      renderBoundary(rootBoundary);

      function createUniqueId() {
        return idCounter++;
      }

      // function abort() {
      //   stream.closeChunk();
      // }

      function createBoundary(chunk, startTimeMs) {
        return {
          id: EMPTY_ID,
          startTimeMs: startTimeMs,
          child: chunk,
        };
      }

      function createChunk(tag) {
        return {
          tag: tag,
          type: null,
          id: EMPTY_ID,

          props: null,
          state: null,

          return: null,

          children: null,

          status: Pending,

          stateNode: null,

          hasEffect: false,
          effects: null,

          shouldRestart: false,

          timeoutMs: 0,
          hostContext: "TODO",
          legacyContext: null,
        };
      }

      function cloneChunk(chunk) {
        return {
          tag: chunk.tag,
          type: chunk.type,
          id: chunk.id,

          props: chunk.props,
          state: chunk.state,

          return: chunk.return,

          children: chunk.children,

          status: Pending,

          stateNode: chunk.stateNode,

          hasEffect: false,
          effects: null,

          shouldRestart: false,

          timeoutMs: 0,
          hostContext: "TODO",
          legacyContext: chunk.legacyContext,
        };
      }

      function renderHostRoot(boundary, chunk, typeOfWork, type, props, state, hostContext, legacyContext) {
        var startTimeMs = boundary.startTimeMs;
        if (currentTimeMs - startTimeMs >= GLOBAL_TIMEOUT_MS) {
          return null;
        }
        return renderChild(boundary, chunk, props, state, hostContext, legacyContext);
      }

      function shouldConstruct(Component) {
        return Component.prototype && Component.prototype.isReactComponent;
      }

      function renderFunctionalComponent(boundary, chunk, type, props, hostContext, legacyContext) {
        // TODO: Context
        var children = type(props, null);
        renderChild(boundary, chunk, children, null, hostContext, legacyContext);
      }

      function getStateFromUpdate(update, instance, prevState, props) {
        var partialState = update.partialState;
        if (typeof partialState === "function") {
          return partialState.call(instance, prevState, props);
        } else {
          return partialState;
        }
      }

      function renderClassComponent(boundary, chunk, Component, props, instance, hostContext, legacyContext) {
        if (instance === null) {
          var updater = {
            queue: [],
            isMounted: function(publicInstance) {
              return false;
            },
            enqueueForceUpdate: function(publicInstance) {
              if (instance.updater !== updater) {
                // warnNoop(publicInstance, 'forceUpdate');
                return null;
              }
            },
            enqueueReplaceState: function(publicInstance, completeState) {
              if (instance.updater !== updater) {
                // warnNoop(publicInstance, 'setState');
                return null;
              }
              updater.queue.push({ partialState: completeState, isReplace: true });
            },
            enqueueSetState: function(publicInstance, partialState) {
              if (instance.updater !== updater) {
                return null;
              }
              updater.queue.push({ partialState: partialState, isReplace: false });
            },
          };
          instance = new Component(props, legacyContext, updater);
          if (instance.state === undefined) {
            instance.state = null;
          }
        }

        // Call getDerivedStateFromProps
        if (typeof Component.getDerivedStateFromProps === "function") {
          var derivedState = Component.getDerivedStateFromProps.call(null, props, instance.state);

          if (derivedState !== null && derivedState !== undefined) {
            instance.state = _assign({}, instance.state, derivedState);
          }
        } else if (
          typeof instance.UNSAFE_componentWillMount === "function" ||
          typeof instance.componentWillMount === "function"
        ) {
          if (typeof instance.componentWillMount === "function") {
            // In order to support react-lifecycles-compat polyfilled components,
            // Unsafe lifecycles should not be invoked for any component with the new gDSFP.
            instance.componentWillMount();
          }
          if (typeof instance.UNSAFE_componentWillMount === "function") {
            // In order to support react-lifecycles-compat polyfilled components,
            // Unsafe lifecycles should not be invoked for any component with the new gDSFP.
            instance.UNSAFE_componentWillMount();
          }
          // Process the update queue
          var queue = instance.updater.queue;
          if (queue.length > 0) {
            var _state = instance.state;
            var dontMutatePrevState = true;
            for (var i = 0; i < queue.length; i++) {
              var update = queue[i];
              var partialState = void 0;
              if (update.isReplace) {
                _state = getStateFromUpdate(update, instance, _state, props);
                dontMutatePrevState = true;
              } else {
                partialState = getStateFromUpdate(update, instance, _state, props);
                if (partialState) {
                  if (dontMutatePrevState) {
                    // $FlowFixMe: Idk how to type this properly.
                    _state = _assign({}, _state, partialState);
                  } else {
                    _state = _assign(_state, partialState);
                  }
                  dontMutatePrevState = false;
                }
              }
            }
            queue.length = 0;
            instance.state = _state;
          }
        }

        console.log("ehehe", instance);
        var children = instance.render();
        renderChild(boundary, chunk, children, null, hostContext, legacyContext);
      }

      function renderDOMNode(boundary, chunk, elementType, props, parentHostContext, legacyContext) {
        var tag = elementType.toLowerCase();

        var hostContext = parentHostContext === Namespaces.html ? getIntrinsicNamespace(tag) : parentHostContext;

        var opening = createOpenTagMarkup(elementType, tag, props, hostContext, true, false);
        var closing = "";
        if (omittedCloseTags.hasOwnProperty(tag)) {
          opening += "/>";
        } else {
          opening += ">";
          closing = "</" + elementType + ">";
        }
        stream$$1.openChild(opening, closing);
        // TODO: Host context
        renderChild(boundary, chunk, props.children, null, hostContext, legacyContext);
        stream$$1.closeChild();
      }

      function renderText(text) {
        stream$$1.openChild(text, null);
        stream$$1.closeChild();
      }

      function renderArray(boundary, chunk, array, hostContext, legacyContext) {
        for (var i = 0; i < array.length; i++) {
          var childNode = array[i];
          renderChild(boundary, chunk, childNode, null, hostContext, legacyContext);
        }
      }

      function renderPlaceholder(boundary, chunk, props, hostContext, legacyContext) {
        var timeoutPropMs = props.delayMs;
        if (chunk.props !== props) {
          console.log("in placeholder");

          // Timeout components are split into their own chunks.
          // TODO: Is there a better way to check if we're at the top of the stack?
          var childChunk = createChunk(PlaceholderComponent);
          childChunk.return = chunk;
          var childChunkId = createUniqueId();
          childChunk.id = childChunkId;
          childChunk.props = props;
          // Indicates that we have not tried rendering this Timeout yet
          childChunk.state = false;

          // Create a boundary
          var timeoutBoundary = createBoundary(null, currentTimeMs);
          timeoutBoundary.id = createUniqueId();
          childChunk.stateNode = timeoutBoundary;

          var parentTimeoutMs = chunk.timeoutMs;
          childChunk.timeoutMs =
            typeof timeoutPropMs === "number" && timeoutPropMs < parentTimeoutMs ? timeoutPropMs : parentTimeoutMs;

          stream$$1.openBoundary(timeoutBoundary.id);
          stream$$1.insertSlot(createUniqueId());
          stream$$1.closeBoundary();

          // Add the chunk to the parent
          var _children = chunk.children;
          if (_children === null) {
            chunk.children = [childChunk];
          } else {
            _children.push(childChunk);
          }
          return;
        }

        console.log("LOL", chunk);

        var render = props.children;
        var didTimeout = chunk.state;
        let children;
        if (typeof render === "function") {
          children = children(didTimeout);
        } else {
          children = didTimeout ? props.fallback : render;
        }
        renderChild(boundary, chunk, children, null, hostContext, legacyContext);
      }

      function retry(boundary, sourceChunk) {
        sourceChunk.status = Pending;
        renderBoundary(boundary);
      }

      function awaitAndRetryBoundary(promise, boundary, sourceChunk) {
        promise.then(function() {
          retry(boundary, sourceChunk);
        });
      }

      function throwException(boundary, sourceChunk, returnChunk, node, state, hostContext, legacyContext, value) {
        console.log("lmao", value);
        if (value !== null && typeof value === "object" && typeof value.then === "function") {
          // This is a thenable.
          var promise = value;
          var _startTimeMs = boundary.startTimeMs;
          var elapsedTimeMs = currentTimeMs - _startTimeMs;
          console.log("RETURN CHUNK IS", returnChunk);
          var _timeoutMs = returnChunk.timeoutMs;
          var didTimeout = elapsedTimeMs >= _timeoutMs;
          if (didTimeout) {
            var chunk = returnChunk;
            do {
              switch (chunk.tag) {
                case PlaceholderComponent: {
                  var timeoutBoundary = chunk.stateNode;
                  var didAlreadyTimeout = chunk.state;
                  if (!didAlreadyTimeout) {
                    if (timeoutBoundary.child === null) {
                      // Create a new chunk by cloning this one
                      var normalChild = cloneChunk(chunk);
                      normalChild.status = Pending;
                      // The new chunk is the root of a new boundary
                      normalChild.return = null;
                      timeoutBoundary.child = normalChild;

                      // The current chunk is now a placeholder. Resume rendering.
                      chunk.status = Pending;
                      chunk.state = true;
                      chunk.shouldRestart = true;
                    }
                    var effect = promise;
                    if (chunk.effects === null) {
                      chunk.effects = [effect];
                    } else {
                      chunk.effects.push(effect);
                    }
                    // Await the promise and retry the boundary
                    awaitAndRetryBoundary(promise, timeoutBoundary, sourceChunk);
                    return;
                  } else {
                    boundary.startTimeMs = currentTimeMs;
                    // TODO: Await promise and retry this boundary
                    return;
                  }
                }
              }
              chunk = chunk.return;
            } while (chunk !== null);
            // TODO: The root expired, but no fallback was provided. This is
            // an error.
            throw new Error("Missing timeout");
          } else {
            promise.then(function() {
              retry(boundary, sourceChunk);
            });
            setTimeout(function() {
              retry(boundary, sourceChunk);
            }, _timeoutMs);
          }
          return;
        }
        invariant(false, "TODO: Not yet implemented.");
      }

      function renderChildOfTypeImpl(boundary, chunk, typeOfWork, type, props, state, hostContext, legacyContext) {
        switch (typeOfWork) {
          case HostRoot: {
            return renderHostRoot(boundary, chunk, typeOfWork, type, props, state, hostContext, legacyContext);
          }
          case HostComponent: {
            return renderDOMNode(boundary, chunk, type, props, hostContext, legacyContext);
          }
          case HostText:
            return renderText(props);
          case FunctionalComponent: {
            return renderFunctionalComponent(boundary, chunk, type, props, hostContext, legacyContext);
          }
          case ClassComponent: {
            return renderClassComponent(boundary, chunk, type, props, state, hostContext, legacyContext);
          }
          case Fragment:
          case StrictMode:
          case AsyncMode: {
            if (!Array.isArray(props)) {
              return renderChild(boundary, chunk, props, state, hostContext, legacyContext);
            }
            return renderArray(boundary, chunk, props, hostContext, legacyContext);
          }
          case PlaceholderComponent: {
            return renderPlaceholder(boundary, chunk, props, hostContext, legacyContext);
          }
          case null:
            // Treat as empty
            return;
        }
      }

      function renderChildOfType(boundary, chunk, typeOfWork, type, props, state, hostContext, legacyContext) {
        try {
          renderChildOfTypeImpl(boundary, chunk, typeOfWork, type, props, state, hostContext, legacyContext);
        } catch (thrownValue) {
          var childChunk = void 0;
          if (chunk.props === props) {
            childChunk = chunk;
          } else {
            childChunk = createChunk(typeOfWork);
            childChunk.return = chunk;
            childChunk.type = type;
            childChunk.props = props;
            childChunk.timeoutMs = chunk.timeoutMs;
            stream$$1.insertSlot(createUniqueId());

            // Add the chunk to the parent
            chunk.status = PendingChildren;
            var _children2 = chunk.children;
            if (_children2 === null) {
              chunk.children = [childChunk];
            } else {
              _children2.push(childChunk);
            }
            var childChunkId = createUniqueId();
            childChunk.id = childChunkId;
          }

          // TODO: Only if this is a thenable
          childChunk.status = Suspended;

          throwException(
            boundary,
            childChunk,
            childChunk.return,
            props,
            state,
            hostContext,
            legacyContext,
            thrownValue,
          );
        }
      }

      function renderChild(boundary, chunk, child, state, hostContext, legacyContext) {
        var typeOfWork = void 0;
        var type = void 0;
        var props = void 0;

        var isObject = typeof child === "object" && child !== null;
        if (isObject) {
          switch (child.$$typeof) {
            case REACT_ELEMENT_TYPE: {
              type = child.type;
              switch (typeof type) {
                case "string":
                  typeOfWork = HostComponent;
                  props = child.props;
                  break;
                case "function":
                  if (shouldConstruct(type)) {
                    typeOfWork = ClassComponent;
                    props = child.props;
                  } else {
                    typeOfWork = FunctionalComponent;
                    props = child.props;
                  }
                  break;
                default: {
                  switch (type) {
                    case REACT_FRAGMENT_TYPE:
                      typeOfWork = Fragment;
                      props = child.props.children;
                      break;
                    case REACT_STRICT_MODE_TYPE:
                      typeOfWork = StrictMode;
                      props = child.props.children;
                      break;
                    case REACT_ASYNC_MODE_TYPE: {
                      typeOfWork = AsyncMode;
                      props = child.props.children;
                      break;
                    }
                    case REACT_PLACEHOLDER_TYPE: {
                      typeOfWork = PlaceholderComponent;
                      props = child.props;
                      break;
                    }
                    default:
                      return null;
                  }
                }
              }
              break;
            }
            default: {
              type = null;
              if (isArray(child)) {
                typeOfWork = Fragment;
                props = child;
                break;
              }
              return null;
            }
          }
        } else if (typeof child === "string") {
          typeOfWork = HostText;
          type = null;
          props = child;
        } else if (typeof child === "number") {
          typeOfWork = HostText;
          type = null;
          props = child + "";
        } else {
          // Treat everything else as empty.
          return null;
        }

        renderChildOfType(boundary, chunk, typeOfWork, type, props, state, hostContext, legacyContext);
      }

      function renderChunk(boundary, chunk) {
        if (chunk.status === Pending) {
          var _id = createUniqueId();
          chunk.id = _id;
          chunk.children = null;
          stream$$1.openChunk(_id);
          renderChildOfType(
            boundary,
            chunk,
            chunk.tag,
            chunk.type,
            chunk.props,
            chunk.state,
            chunk.hostContext,
            chunk.legacyContext,
          );
          stream$$1.closeChunk();
        }

        // Now work on the children, if they exist
        var children = chunk.children;
        if (children !== null) {
          var allChildrenDidComplete = true;
          for (var i = 0; i < children.length; i++) {
            var _child = children[i];
            if (_child.status !== Suspended) {
              renderChunk(boundary, _child);
            }
            if (_child.status !== Complete) {
              allChildrenDidComplete = false;
            }
          }
          if (chunk.shouldRestart) {
            renderChunk(boundary, chunk);
          } else {
            chunk.status = allChildrenDidComplete ? Complete : PendingChildren;
          }
        } else {
          chunk.status = Complete;
        }
      }

      function awaitAndStartBoundary(boundary, promise) {
        pendingBoundaries.add(boundary);
      }

      function commitChunk(chunk, chunkInfo) {
        var chunkChildren = chunk.children;
        if (chunkChildren !== null) {
          var chunkInfoChildren = chunkInfo[1];
          if (chunkInfoChildren === null) {
            chunkInfoChildren = chunkInfo[1] = [];
          }
          for (var i = 0; i < chunkChildren.length; i++) {
            var childChunk = chunkChildren[i];
            // Set the return pointer before starting on child.
            childChunk.return = chunk;
            var childChunkInfo = [childChunk.id, null];
            commitChunk(childChunk, childChunkInfo);
            chunkInfoChildren.push(childChunkInfo);
          }
        }
        var effects = chunk.effects;
        if (effects !== null) {
          for (var _i = 0; _i < effects.length; _i++) {
            var promise = effects[_i];
            var boundary = chunk.stateNode;
            awaitAndStartBoundary(boundary, promise);
          }
        }
      }

      function commitBoundary(boundary) {
        var chunk = boundary.child;
        var commitInfo = [chunk.id, null];
        commitChunk(chunk, commitInfo);
        stream$$1.commit(boundary.id, commitInfo);
      }

      function renderBoundary(boundary) {
        if (!pendingBoundaries.has(boundary)) {
          // Already committed
          return;
        }

        currentTimeMs = Date.now();
        var child = boundary.child;
        renderChunk(boundary, child);
        if (child.status === Complete) {
          commitBoundary(boundary);
          pendingBoundaries.delete(boundary);
          if (pendingBoundaries.size === 0) {
            stream$$1.finish();
          }
        }
      }
    }

    var PREFIX = "_ssr";

    var SLOT_PREFIX = PREFIX + "_s";
    var BOUNDARY_PREFIX = PREFIX + "_b";

    var STAGE = PREFIX + "_stage";

    var BOUNDARY_MAP = PREFIX + "_boundaries";
    var CHUNK_MAP = PREFIX + "_chunks";
    var SLOT_MAP = PREFIX + "_slots";

    var INIT = PREFIX + "_init";
    var CREATE_COMMENT = PREFIX + "_createComment";
    var GET_BY_ID = PREFIX + "_get";
    var PROCESS_CHUNK = PREFIX + "_process";
    var COMMIT = PREFIX + "_commit";
    var FINISH = PREFIX + "_finish";

    // TODO: Extract this to separate file and minify it
    var runtime =
      "<script>\n" +
      GET_BY_ID +
      " = document.getElementById.bind(document);\n" +
      STAGE +
      " = " +
      GET_BY_ID +
      "('" +
      STAGE +
      "');\n" +
      CHUNK_MAP +
      " = {};\n" +
      SLOT_MAP +
      " = {};\n" +
      BOUNDARY_MAP +
      " = {};\n" +
      CREATE_COMMENT +
      " = function () {\n  return document.createComment('');\n};\n" +
      PROCESS_CHUNK +
      " = function (id, slotIds, boundaryIds, innerHTML) {\n  var container = document.createElement('div');\n  container.innerHTML = innerHTML;\n  " +
      STAGE +
      ".appendChild(container)\n  for (var i = 0; i < slotIds.length; i++) {\n    var slotId = slotIds[i];\n    var slot = " +
      GET_BY_ID +
      "('" +
      SLOT_PREFIX +
      "' + slotId);\n    " +
      SLOT_MAP +
      "[slotId] = slot;\n  }\n  for (var i = 0; i < boundaryIds.length; i++) {\n    var boundaryId = boundaryIds[i];\n    var start = " +
      GET_BY_ID +
      "('" +
      BOUNDARY_PREFIX +
      "' + boundaryId + 'start');\n    var parent = start.parentNode;\n    var startComment = " +
      CREATE_COMMENT +
      "();\n    parent.insertBefore(startComment, start);\n    parent.removeChild(start);  \n    \n    var end = " +
      GET_BY_ID +
      "('" +
      BOUNDARY_PREFIX +
      "' + boundaryId + 'end');\n    var parent = end.parentNode;\n    var endComment = " +
      CREATE_COMMENT +
      "();\n    parent.insertBefore(endComment, end);\n    parent.removeChild(end);\n    \n    " +
      BOUNDARY_MAP +
      "[boundaryId] = {\n      start: startComment,\n      end: endComment,\n    };\n  }\n  var fragment = document.createDocumentFragment();\n  while (container.firstChild !== null) {\n    fragment.appendChild(container.firstChild);\n  }\n  " +
      CHUNK_MAP +
      "[id] = {\n    fragment: fragment,\n    slotIds: slotIds\n  };\n  " +
      STAGE +
      ".removeChild(container);\n};\n" +
      COMMIT +
      " = function (boundaryId, rootInfo) {\n  function commit(info, slot) {\n    var chunk = " +
      CHUNK_MAP +
      "[info[0]];\n    slot.parentNode.insertBefore(chunk.fragment, slot);\n    slot.parentNode.removeChild(slot);\n    var children = info[1];\n    if (children !== null) {\n      var slotIds = chunk.slotIds;\n      for (var i = 0; i < children.length; i++) {\n        var childSlot = " +
      SLOT_MAP +
      "[slotIds[i]];\n        commit(children[i], childSlot);\n      }\n    }\n  }\n\n  var boundary = " +
      BOUNDARY_MAP +
      "[boundaryId];\n  var start = boundary.start;\n  var end = boundary.end;\n  var parent = start.parentNode;\n  while (start.nextSibling !== end) {\n    parent.removeChild(start.nextSibling);\n  }\n  var stage = " +
      STAGE +
      ";\n  var boundarySlot = document.createElement('span');\n  parent.insertBefore(boundarySlot, end);\n  commit(rootInfo, boundarySlot);\n}\n" +
      FINISH +
      " = function () {\n  var stage = " +
      STAGE +
      ";  \n  stage.parentNode.removeChild(stage);\n}\n" +
      INIT +
      " = function() {\n  var stage = " +
      STAGE +
      ";  \n  var parent = stage.parentNode;\n  var rootStart = " +
      CREATE_COMMENT +
      "();\n  var rootEnd = " +
      CREATE_COMMENT +
      "();\n  parent.insertBefore(rootStart, stage);\n  parent.insertBefore(rootEnd, stage);\n  " +
      BOUNDARY_MAP +
      "[" +
      ROOT_BOUNDARY_ID +
      "] = {\n    start: rootStart,\n    end: rootEnd,\n  };\n}\n" +
      INIT +
      "();\n</script>";

    function renderToNodeStream(children) {
      var ReadableImpl = (function(_Readable) {
        _inherits(ReadableImpl, _Readable);

        function ReadableImpl() {
          _classCallCheck(this, ReadableImpl);

          return _possibleConstructorReturn(this, _Readable.apply(this, arguments));
        }

        ReadableImpl.prototype._read = function _read() {};

        return ReadableImpl;
      })(stream.Readable);

      var nodeStream = new ReadableImpl();

      var currentBoundaryId = 0;
      var currentChunkId = 0;
      var boundaryIds = [];
      var closingTags = [];
      var slotIds = [];
      var didFinish = false;

      var bufferedChunk = "";

      var stream$$1 = {
        openBoundary: function(boundaryId) {
          currentBoundaryId = boundaryId;
          bufferedChunk += '<span id="' + (BOUNDARY_PREFIX + boundaryId) + 'start"></span>';
        },
        openChunk: function(id) {
          currentChunkId = id;
        },
        openChild: function(opening, closing) {
          bufferedChunk += opening;
          closingTags.push(closing);
        },
        insertSlot: function(slotId) {
          slotIds.push(slotId);
          bufferedChunk += '<div id="' + (SLOT_PREFIX + slotId) + '"></div>';
        },
        closeChild: function() {
          var closingTag = closingTags.pop();
          if (closingTag !== null) {
            bufferedChunk += closingTag;
          }
        },
        closeChunk: function() {
          var html = bufferedChunk;
          bufferedChunk = "";
          nodeStream.push(
            "<script>window." +
              PROCESS_CHUNK +
              "('" +
              currentChunkId +
              "', " +
              JSON.stringify(slotIds) +
              ", " +
              JSON.stringify(boundaryIds) +
              ", " +
              JSON.stringify(html) +
              ")</script>",
          );
          currentChunkId = 0;
          slotIds = [];
          boundaryIds = [];
        },
        closeBoundary: function() {
          var boundaryId = currentBoundaryId;
          currentBoundaryId = 0;
          bufferedChunk += '<span id="' + (BOUNDARY_PREFIX + boundaryId) + 'end"></span>';
          boundaryIds.push(boundaryId);
        },
        commit: function(boundaryId, commitLog) {
          nodeStream.push(
            "<script>window." + COMMIT + "(" + boundaryId + ", " + JSON.stringify(commitLog) + ")</script>",
          );
        },
        finish: function() {
          if (didFinish) {
            return;
          }
          didFinish = true;
          nodeStream.push("<script>window." + FINISH + "()</script>");
          nodeStream.push("</div>");
          nodeStream.push(null);
        },
      };

      nodeStream.push('<div id="' + STAGE + '">');
      nodeStream.push(runtime);
      ReactHTMLStream(stream$$1, children);
      return nodeStream;
    }

    var ReactSuspenseServerRenderer = Object.freeze({
      ReactHTMLStream: ReactHTMLStream,
      renderToNodeStream: renderToNodeStream,
    });

    // TODO: decide on the top-level export form.
    // This is hacky but makes it work with both Rollup and Jest
    var server_node = ReactSuspenseServerRenderer.default
      ? ReactSuspenseServerRenderer.default
      : ReactSuspenseServerRenderer;

    module.exports = server_node;
  })();
}
