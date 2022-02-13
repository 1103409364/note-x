# Javascript 进阶

## 不用插件实现拖拽排序

[MDN Reference: drag event](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/drag_event)

```html
<div
  v-for="(item, index) in list"
  :key="index"
  draggable="true"
  @dragenter.prevent
  @dragover.prevent
  @dragstart="handleDragStart($event, index)"
  @drop.prevent="handleDrop($event, index)"
>
  {{ item.name }}
</div>
```

```js
// 拖拽携带数据
const list = [{ name: 1 }, { name: 2 }];
const handleDragStart = (e, index) => {
  e.dataTransfer.setData("text/plain", index);
};
// 拖拽调整顺序
const handleDrop = (e, targetIndex) => {
  const sourceIndex = e.dataTransfer.getData("text");
  // 插入
  list.splice(targetIndex, 0, list.splice(sourceIndex, 1)[0]);
  //两两交换
  // list[sourceIndex] = list.splice(targetIndex, 1, list[sourceIndex])[0]
};
```

<!-- ## 数据类型

### == 操作符的强制类型转换规则？

### instanceof 操作符的实现原理及实现

### 其他值到字符串的转换规则

### 其他值到数字值的转换规则

### 其他值到布尔类型的值的转换规则

### || 和 && 操作符的返回值

### Object.is() 与比较操作符 “===”、“==” 的区别

### JavaScript 中如何进行隐式类型转换

### object.assign 和扩展运算法是深拷贝还是浅拷贝，两者区别

### new 操作符的实现原理及实现

### map 和 Object 的区别

### JavaScript 为什么要进行变量提升，它导致了什么问题

## ES6

### ES6 模块与 CommonJS 模块有什么异同 -->
