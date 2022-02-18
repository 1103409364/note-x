# Vue 踩坑记录

记录工作中遇到的问题，及解决方案。

## 刷新 query 参数消失

### 路由对象属性

[官方文档：完整的导航解析流程](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%AE%8C%E6%95%B4%E7%9A%84%E5%AF%BC%E8%88%AA%E8%A7%A3%E6%9E%90%E6%B5%81%E7%A8%8B)  
`$route.query` 一个 key/value 对象，表示 URL 查询参数。  
`$route.path` 字符串，对应当前路由的路径。  
`$route.fullPath` 完成解析后的 URL，包含查询参数和 hash 的完整路径。

**原因**
当浏览器刷新时，触发 导航守卫 路由守卫 ` beforeResolve``、beforeEach ` 方法等，在 `next(path: to.path)` 时丢了参数。

**解决**
将 `next(path: to.path)` 修改为 `next(path: to.fullPath)`。

### 子组件数据更新不及时

父组件多次修改通过 props 传入子组件的参数，子组件每次处理参数时获取不到最新的数据（是指在方法中使用参数、不是直接在 html 中展示），获取到的是上一次传入的数据。  
**解决** 在 nextTick 中调用子组件方法

### "TypeError: sub is not a function"

在 vue2 项目中发现这个报错  
**原因**
devtools 和 vuex 版本不匹配，详见 [issue](https://github.com/vuejs/devtools/issues/1686) 。
**解决** 升级 vuex 到 3.62，3.x 的最后一个版本。
