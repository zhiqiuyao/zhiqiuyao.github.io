---
title:  "React开发中常见的反模式"
description: "避免犯这些错误能够提高代码质量"
date:  Sat Mar 24 2018 23:40:08 GMT+0800 (CST)
---

什么是反模式？它是指在软件开发中被认为糟糕实践的一类模式。在过去的某个时候，同样的模式可能被认为是正确的，但现在开发人员已经意识到，它们在长期内会导致更多的痛苦和难以跟踪的错误。

## 1. 在组件中使用 bind() 和箭头函数

下面这种写法有问题，由于.bind()每次运行时创建一个新函数，该方法将导致每次执行呈现函数时创建一个新函数。这对性能有一定的影响。然而，在一个小应用程序中，它可能不会被注意到。随着应用程序的发展，这种差异将开始显现。这里有一个[案例研究](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f)。

```jsx
// bad
<input onChange={this.updateValue.bind(this)} value={this.state.name} />
```

下面的这种箭头函数写法与 bind 存在同样的性能问题，也会在每次输入渲染时创建新的匿名函数

```jsx
<input
  onChange={evt => this.setState({ name: e.target.value })}
  value={this.state.name}
/>
```

避免上述性能损失的最佳方法是在构造函数本身中绑定函数。这种方法只在组件创建时创建一个额外的函数，并且在重新执行渲染时使用该函数。

```jsx
// good
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
    this.updateValue = this.updateValue.bind(this);
  }
  updateValue(e) {
    this.setState({
      name: e.target.value
    });
  }
  render() {
    return (
      <form>
        <input onChange={this.updateValue} value={this.state.name} />
      </form>
    );
  }
}
```

使用上面这种规范写法是，我们经常忘记将函数绑定到构造函数中。babel 有一个插件：使用 fat-arrow 语法编写自动绑定函数。这个插件是 Class property 转换。现在可以编写这样的组件了:

```jsx
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }
  updateValue = evt => {
    this.setState({
      name: evt.target.value
    });
  };
  render() {
    return (
      <form>
        <input onChange={this.updateValue} value={this.state.name} />
      </form>
    );
  }
}
```

## 2. 使用索引值 index 作为 key

 这个没什么好说的了

## 3. setState() 是异步的

React Component 由三部分组成：state、props 和 视图（JSX），props 是不变的，state 是可变的，更改 state 将重新渲染组件。

```jsx
class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 350
    };
  }

  updateCounter() {
    // 这行不会运行
    this.state.counter = this.state.counter + this.props.increment;

    // 这行不会像预期的运行
    this.setState({
      counter: this.state.counter + this.props.increment; // 可能不渲染
    });

    this.setState({
      counter: this.state.counter + this.props.increment; // 此时 this.state.counter 是多少?
    });

    // 这行运行 (async setState)
    this.setState((prevState, props) => ({
      counter: prevState.counter + props.increment
    }));

    this.setState((prevState, props) => ({
      counter: prevState.counter + props.increment
    }));
  }
}
```

## 4. Props in Initial State

```jsx
import React, { Component } from "react";

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      someValue: props.someValue
    };
  }
}
```

问题：constructor 仅仅调用一次（组件创建时），接下来 props 的 someValue 发生改变，state 中 someValue 不会随之改变。如果你想要特定的行为，可以使用此模式。也就是说，你希望 state 只被  初始化一次。state 将由组件在内部管理。

在其他情况下,可以使用 componentWillReceiveProps 生命周期方法保持 state 和 props 同步,如下：

```js
import React, { Component } from "react";

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      someValue: props.someValue
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.inputValue !== this.props.inputValue) {
      this.setState({ inputVal: nextProps.inputValue });
    }
  }
}
```

## 组件名称

如果使用 JSX 渲染组件，则该组件的名称必须以大写字母开头。

```jsx
<MyComponent>
    <app /> // 异常
</MyComponent>

<MyComponent>
    <App /> // 正常
</MyComponent>
```

Reference:
[How to NOT React: Common Anti-Patterns and Gotchas in React](https://codeburst.io/how-to-not-react-common-anti-patterns-and-gotchas-in-react-40141fe0dcd)
