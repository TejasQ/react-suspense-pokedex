<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with [DocToc](https://github.com/thlorenz/doctoc)_

- [`react-dom`](#react-dom)
  - [Installation](#installation)
  - [Usage](#usage)
    - [In the browser](#in-the-browser)
    - [On the server](#on-the-server)
  - [API](#api)
    - [`react-dom`](#react-dom-1)
    - [`react-dom/server`](#react-domserver)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# `react-dom`

This package serves as the entry point of the DOM-related rendering paths. It is intended to be paired with the isomorphic React, which will be shipped as `react` to npm.

## Installation

```sh
npm install react react-dom
```

## Usage

### In the browser

```js
var React = require("react");
var ReactDOM = require("react-dom");

class MyComponent extends React.Component {
  render() {
    return <div>Hello World</div>;
  }
}

ReactDOM.render(<MyComponent />, node);
```

### On the server

```js
var React = require("react");
var ReactDOMServer = require("react-dom/server");

class MyComponent extends React.Component {
  render() {
    return <div>Hello World</div>;
  }
}

ReactDOMServer.renderToString(<MyComponent />);
```

## API

### `react-dom`

- `findDOMNode`
- `render`
- `unmountComponentAtNode`

### `react-dom/server`

- `renderToString`
- `renderToStaticMarkup`
