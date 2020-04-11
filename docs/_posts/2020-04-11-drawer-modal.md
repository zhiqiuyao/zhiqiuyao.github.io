---
title: "如何实现一个抽屉式弹窗"
date: Sat Apr 11 2020 21:54:04 GMT+0800 (中国标准时间)
---

最近工作中接到了一个任务式需要实现一个抽屉弹窗。如下图所示：

<video width="100%">
  <source src="./media/drawer-effect-modal.mp4"  type="video/mp4">
  Your browser does not support the video tag.
</video>

现在我把实现过程记录下来。

从视频中可以看到弹窗是从左到右的抽屉效果，我采用 `react-transition-group` 来实现这个过渡效果。这个库本身不对样式进行动画处理，它把过渡阶段交给用户，而且它的性能开销极小。

## Step1: 实现弹窗基本结构

我们把弹窗的显/隐状态交给外部去控制，定义 props 为 visible，弹窗内部需要一个关闭按钮，这样还需要一个props 为 onClose 去通知父组件关闭弹窗

```jsx
class DrawerModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func
  };
  static defaultProps = {
    visible: false,
    onClose: () => {}
  };
  handleClose = e => {
    this.props.onClose();
  };

  render() {
    return (
      <div
        className={["modal-container", this.props.visible && "visible"]
          .filter(Boolean)
          .join(" ")}
      >
        <Button
          className="btn-close"
          shape="circle"
          icon={<CloseOutlined />}
          onClick={this.handleClose}
        />
        <div className="content">Modal Content</div>
      </div>
    );
  }
}
```

通过父组件调用

```jsx
class App extends Component {
  state = {
    visible: false
  };

  onOpen = e => {
    this.setState({
      visible: true
    });
  }

  onClose = () => {
    this.setState({
      visible: false
    });
  }

  render() {
    return (
      <Layout style={{ padding: "24px" }}>
        <Button type="primary" onClick={this.onOpen}>
          打开弹窗
        </Button>
        <DrawerModal visible={this.state.visible} onClose={this.onClose} />
      </Layout>
    );
  }
}
```

上面通过控制弹窗 dom 的 display 样式属性实现了一个简单的弹窗，但没有任何动画过渡效果。

## Step2: 添加动画过渡效果

引入 `react-transition-group` 并设定过渡效果

```js
import {Transition}  from 'react-transition-group';

const transitionStyles = {
  entering: {
      opacity: 1,
      transform: 'translateX(0%)'
  },
  entered: {
      opacity: 1,
      transform: 'translateX(0%)'
  },
  exiting: {
      opacity: 1,
      transform: 'translateX(-100%)'
  },
  exited: {
      opacity: 1,
      transform: 'translateX(-100%)'
  }
};
```

修改 DrawerModal 组件

```jsx
class DrawerModal extends Component {
  // ...
  render() {
    return (
      <Transition in={this.props.visible} timeout={500}>
        {state => (
          <div
            className="modal-container"
            style={{
                ...transitionStyles[state]
            }}
          >
            {/*...*/}
          </div>
        )}
      </Transition>    
    )
  }
}
```

这样就实现的动画过渡，代码示例如下

<iframe
     src="https://codesandbox.io/embed/drawer-effect-modal-tjtgd?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="drawer-effect-modal"
     allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
     sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
   ></iframe>