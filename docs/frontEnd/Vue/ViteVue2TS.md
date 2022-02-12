# Vite+Vue2+TS

> [Vite 生态发展的怎么样了](https://zhuanlan.zhihu.com/p/447557046?utm_source=wechat_session&utm_medium=social&utm_oi=35206853558272)  
> [Vite 介绍及实现原理](https://zhuanlan.zhihu.com/p/424842555)  
> [vue2.x 项目 webpack 升级 vite 避坑总结](https://blog.csdn.net/var_deng/article/details/120488439)  
> [vue2 老项目使用 vite2 升级](https://juejin.cn/post/6997310696845213704)  
> [Vite+Vue2+Composition-api+`＜script setup＞`+TS 搭配如何开发项目？](https://zhuanlan.zhihu.com/p/414318880?utm_source=wechat_session&utm_medium=social&utm_oi=35206853558272)  
> [关于 vite.config.js 相关配置](https://www.cnblogs.com/web-learn/p/15670257.html)  
> [什么是 vite + vue3 + ts 现代开发最佳实践？](https://zhuanlan.zhihu.com/p/463047434?utm_source=wechat_session&utm_medium=social&utm_oi=35206853558272)

[[toc]]

## 基础配置

### 模板&资源

Vite 官方默认模板是 Vue3 的，没有提供 Vue2 的模板。

第三方模板：

- pc 端模板 [vite-vue2-windicss-starter](https://github.com/lstoeferle/vite-vue2-windicss-starter?ref=bestofvue.com)

- 移动端模板 [vite2-vue2-ts-vant2](https://github.com/liugangtaotie/vite2-vue2-ts) 移动端不用兼容 ie 可以上 vue3？

- 更多模板和 vite 相关资源 [awesome-vite#templates](https://github.com/vitejs/awesome-vite#templates)

**问题** vite-vue2-windicss-starter 模板配置提交 Eslint 报错：  
::: danger error
ESLint: 8.0.1 No files matching the pattern "'./src/\*_/_.{js,ts,tsx,vue,md}'" were found. Please check for typing mistakes in the pattern.  
:::

**解决** scripts lint 命令加参数 `--no-error-on-unmatched-pattern`，同时修改 eslint 匹配规则：

`"lint": "eslint './src/\*_/_.{js,ts,tsx,vue,md}' --no-error-on-unmatched-pattern"`  
`"lint:fix": "eslint --fix --ext .ts,.js,.vue src --no-error-on-unmatched-pattern",`

### 支持 setup 语法糖

[官方文档：单文件组件 `<script setup>`](https://v3.cn.vuejs.org/api/sfc-script-setup.html#%E5%9F%BA%E6%9C%AC%E8%AF%AD%E6%B3%95)  
[强烈推荐!Vue3.2 中的 setup 语法糖](https://www.jb51.net/article/231485.htm#_lab2_3_2)  
[你不知道的`<script setup>`不完全攻略](https://juejin.cn/post/6941261566985650183)
通过插件 [unplugin-vue2-script-setup](https://github.com/antfu/unplugin-vue2-script-setup#readme) 支持。
[官方示例](https://github.com/antfu/unplugin-vue2-script-setup/tree/main/playground)

**配置 Volar：** 安装 Volar 禁用 Vetur。需要安装@vue/runtime-dom 为 devDependencies 才能使其在 Vue 2 上运行

```bash
yarn add @vue/runtime-dom -D
```

支持 Vue 2 模板

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["unplugin-vue2-script-setup/types"]
  },
  "vueCompilerOptions": {
    "experimentalCompatMode": 2
  }
}
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { createVuePlugin as Vue2 } from "vite-plugin-vue2";
import ScriptSetup from "unplugin-vue2-script-setup/vite";

export default defineConfig({
  //
  plugins: [Vue2(), ScriptSetup({ reactivityTransform: false })],
});
```

`reactivityTransform:false` 关闭实验性 [Ref Sugar（take 2）](https://github.com/vuejs/rfcs/discussions/369)实现。

```ts
// shims-vue.d.ts
/// <reference types="unplugin-vue2-script-setup/shims.js" />
/// <reference types="unplugin-vue2-script-setup/ref-macros.js" />
...
```

修改 eslint 配置，支持 setup 全局的方法。
配置后 eslint 插件报错：[Environment key "vue/setup-compiler-macros" is unknown](https://stackoverflow.com/questions/69796772/what-is-causing-error-eslintrc-js-environment-key-vue-setup-compiler-macros/69806781)。需要更新 eslint 和 eslint-plugin-vue，更新后重启 vscode。

```js
// .eslintrc.js
module.exports = {
  env: {
    node: true,
    "vue/setup-compiler-macros": true,
  },
};
```

**问题** 如何获取当前实例？

```ts
import { getCurrentInstance } from "vue-demi";
const vm = getCurrentInstance()?.proxy; // 相当于this
```

vue3 在弱化 this，推荐使用 `{ useRoute, useRouter }` 通过 composable 的方式获取路由实例、store 等。目前在 vue2 中还是要使用 this。

### Sass 配置

只要安装预处理器即可，自动开启 sass 支持 [官方文档](https://cn.vitejs.dev/guide/features.html#css-pre-processors)

```bash
yarn add sass -D
```

### 配置全局 scss 变量

```js
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `@import "@/styles/index.scss";`;
    }
  }
}
```

### mockjs 配置

[vite 使用 mock 插件(vite-plugin-mock)](https://blog.51cto.com/u_15057858/4395719)  
[使用 mockjs 随机生成大批量常用字段的值(人名，年龄，地址，邮箱，日期……)](https://blog.csdn.net/wuyujin1997/article/details/111656446)  
mock vite 配完后，按照 mockjs 规则写即可

```bash
yarn add mockjs vite-plugin-mock -D
```

vite.config.js

```js
import { createVuePlugin } from "vite-plugin-vue2";
import { viteMockServe } from "vite-plugin-mock";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [
    createVuePlugin(),
    viteMockServe({
      mockPath: "./src/mock", //配置mock路径
      supportTs: false,
    }),
  ],
});
```

mock/user.ts

```js
export default [
  {
    url: "/mock-server/users/info",
    method: "get",
    timeout: 200,
    response: () => {
      return {
        code: 200,
        message: "ok",
        data: {
          user: {
            id: 0,
          },
        },
      };
    },
  },
];
```

### 国际化

[Vue+TS 配置国际化](http://vuepress.wmm66.com/%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91/vue/%E5%9F%BA%E4%BA%8ETypescript%E7%9A%84vue%E9%A1%B9%E7%9B%AE%E9%85%8D%E7%BD%AE%E5%9B%BD%E9%99%85%E5%8C%96.html#%E7%AE%80%E4%BB%8B)
除了配置项目的国际化，还需要配置 ui 框架的国际化

### 图标

vite-plugin-svg-icons 支持 vue2、3，不兼容 ie。  
webpack 项目的 svgIcon 支持 ie。  
unplugin-icons 由于墙的原因无法使用。  
iconfont 没有问题。

### 配置 element-ui

使用分解器自动按需引入

vite.config.js

```js
import { ElementUiResolver} from "unplugin-vue-components/resolvers";
import ViteComponents from "unplugin-vue-components/vite";

const config = defineConfig({
  . . .
  plugins: [
    ViteComponents({
      resolvers: [ElementUiResolver()],//ElementUi组件按需自动导入
    })
  ],
  . . .
});
```

这种方式按需引入，一些全局方法无法使用，如`this.$message`，需要单独引入手动挂载到 `Vue.prototype` 上

#### 组件全局设置 size 大小

按需引入配置：`Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };`  
全局引入配置：`Vue.use(Element, { size: 'small', zIndex: 3000});`

使用分解其自动按需引入的方式，element 组件不会经过 legacy 处理，**不兼容 ie**，改为全量引入。

**问题**
全量引入 element ui 的 css 打包报警告：`"@charset" must be the first rule in the file` 且会导致打包速度变慢。sass 编译的时候，因为被编译的文件里有中文，所以会这样。

**解决** 移除@charset 规则直接在 vite.config.js 里配置，和 postcss.config.js 有冲突, 导致 postcss.config.js 里的插件不生效，修改或新建 postcss.config.js。

```js
module.exports = {
  plugins: [
    {
      postcssPlugin: "internal:charset-removal",
      AtRule: {
        charset: (atRule) => {
          if (atRule.name === "charset") {
            atRule.remove();
          }
        },
      },
    },
  ],
};
```

去除 charset 规则加快打包：Done in 39.63s.

在 vite.config.js 里面，加一个 sass 的配置，把 charset 关掉

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: { charset: false },
    },
  },
});
```

**问题** vite2 打包 sass 出现警告 Using / for division is deprecated。element ui 中使用了旧的语法，新版 sass 将会移除
**解决** 配置 vite 较少警告，或者降级到 `"sass": "1.32.12"`，尽量使用原生支持的 calc()函数

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: { quietDeps: true }, // 减少sass警告 Using / for division is deprecated
    },
  },
});
```

### 不支持的

- scss js 变量共享 vite 好像不支持。[windicss 颜色主题](https://cn.windicss.org/utilities/colors.html#customization) 和 scss 变量要分开配置，或者放弃 scss 变量，统一使用 windicss。

- 在 vite 中 vue 模板依然不支持可选链`?.`和空值合并`??`运算符。

### 生态

- Vue Demi 这是一个让你可以开发同时支持 Vue2 和 3 的通用 Vue 库的开发工具。
- VueUse 基本 Vue 组合实用程序的集合 5 个可以加速开发的 VueUse 函数库。
- unplugin-vue-components [自动引入(组件,ui(Element-ui)库,vue hooks 等)](https://vue-js.com/topic/61d7be4503eaf00040d48063)
- Vuesax 是基于 Vue.js 的 UI 框架，零开始设计，可以逐步采用。
- Vue Volar Extension Pack 包含 12 个扩展。
- Vue 3 Snippets 基于最新的 Vue 2 及 Vue 3 的 API 添加了 Code Snippets。

## 代码规范

> [VUE 项目中的 commit 提交规范插件](https://blog.csdn.net/biraotian/article/details/113629230)  
> [Vue 的 ESLint-stylelint-prettier 联合配置](https://blog.csdn.net/weixin_45191649/article/details/109818249)  
> [eslint-plugin-vue 文档](https://eslint.vuejs.org/)  
> [Vue 风格指南](https://cn.vuejs.org/v2/style-guide/)  
> [prettier 与 Git 整合](https://zhuanlan.zhihu.com/p/81764012)：添加 lint-staged 提交代码时，使用 eslint fix 修复暂存的文件

vue eslint 规则。模板组件名风格：帕斯卡，限制标签属性顺序
.eslintrc.js

```js
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: "@typescript-eslint/parser",
  },
  globals: {
    RouteItem: true,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/component-name-in-template-casing": [
      "error",
      "PascalCase",
      {
        registeredComponentsOnly: false,
        ignores: [],
      },
    ], //模板中组件名PascalCase
    "vue/name-property-casing": ["error", "PascalCase"], //组件名PascalCase
    "vue/match-component-file-name": [
      "error",
      {
        extensions: ["vue"],
        shouldMatchCase: true,
      },
    ], //要求组件name属性匹配其**文件名**
    "vue/prop-name-casing": ["error", "camelCase"], //组件props camelCase
    "vue/this-in-template": ["error", "never"], //不要在模版中使用this
    //自定义事件名称始终使用kebab-case(短横线命名)
    "vue/custom-event-name-casing": ["error", "kebab-case"],
    "vue/attribute-hyphenation": [
      "error",
      "always",
      {
        ignore: [],
      },
    ], //标签属性名称始终使用kebab-case(短横线命名)
    "vue/attributes-order": [
      "error",
      {
        order: [
          "DEFINITION",
          "LIST_RENDERING",
          "CONDITIONALS",
          "RENDER_MODIFIERS",
          "GLOBAL",
          "UNIQUE",
          "TWO_WAY_BINDING",
          "OTHER_DIRECTIVES",
          "OTHER_ATTR",
          "EVENTS",
          "CONTENT",
        ],
      },
    ], //标签属性、指令排序
  },
};
```

.stylelintrc.js

```js
module.exports = {
  extends: ["stylelint-config-recess-order", "stylelint-config-prettier"],
};
```

## Composition API 实践

> [一文了解 Composition API 新特性：ref、toRef、toRefs](https://blog.csdn.net/lhjuejiang/article/details/118542096)  
> [JS 基础系列之 —— Composition API](https://zhuanlan.zhihu.com/p/408272742?utm_source=wechat_session&utm_medium=social&utm_oi=35206853558272)
> Vue3 后台项目 [vue-vben-admin](https://github.com/vbenjs/vue-vben-admin/blob/next/README.zh-CN.md)

在 vue2 中听过插件的方式使用组合式 API [@vue/composition-api](https://github.com/vuejs/composition-api)，官方 README 中有一些注意事项，和 Vue3 中的 Composition API 相比，有一些缺失和差异。

### [该用 ref 还是 reactive](https://www.bilibili.com/video/BV19Q4y1e75C?p=1&share_medium=iphone_b&share_plat=ios&share_session_id=A798B558-752B-4F7A-A31A-A932E9C3C2F5&share_source=WEIXIN&share_tag=s_i&timestamp=1641999797&unique_k=o5mOAAI)

多数场景 ref 够用，注意不是所有变量都要 ref。**注意** 有些变量不需要转为响应式对象

- ref 的参数支持基本数据类型和引用类型
- reactive 参数不能是基本数据类型

### 重置表单

使用 Composition API 时，Element ui 时重置表单的方式：

1. 给 ref 的 value 赋值默认表单
2. reactive 使用 Object.assign 合并默认表单。
3. 使用 el-form 的 resetFields 方法

### 调用子组件方法

子组件需要在 setup 函数 return 的对象中暴露方法，[Vue Composition Api-调用子组件的方法](https://www.5axxw.com/questions/content/zswwzk)

### 组件之间状态共享

[是否应该使用 Composition API 替代 Vuex？](https://zhuanlan.zhihu.com/p/320445941)

创建一个导出响应式变量的文件 stateTest.ts

```js
import { reactive } from "vue-demi";
export const state = reactive({
  a: 1,
  b: 1,
});
```

不同组件导入这个 state，就能实现状态共享了。任意一个组件改变状态，另一个组件的状态也会跟着变化

通过 provide 注入全局，可以实现类似 vuex 的效果。缺点是 vue-devtool 观察不到数据变化

## composable

将逻辑提取到 composable 函数中，避免逻辑堆积，导致组件文件过长，提高可读性和可维护性。

## Vue2 TypeScript 实践

> [总结函数类型的定义方法](https://blog.csdn.net/qq_38277179/article/details/104446592)  
> 从 [element-plus 源码](https://github.com/element-plus/element-plus) 中学习 composition api 和 TypeScript

### TypeScript 怎么声明全局类型

1. 项目的话，直接项目中扔个 xx.d.ts 文件：
   declare const xx:any;
   但是注意这个文件里不要出现 export import 等模块语法，否则会被当作 module 声明而非全局。
2. 如果是公共包（比如发到 npm），declare namespace global ｛ ｝ 中声明即可

在全局类型声明文件中引入其他模块 [import class in definition file .d.ts](https://stackoverflow.com/questions/39040108/import-class-in-definition-file-d-ts)

```ts
declare namespace Express {
  interface Request {
    user: import("./user").User;
  }
}
```

### 用 type 还是 interface？

interface 能实现就用 interface，否则用 type

### 类型声明文件

[ts 类型声明文件的正确使用姿势](https://zhuanlan.zhihu.com/p/103158789?utm_source=wechat_session&utm_medium=social&utm_oi=35206853558272)  
[在 TypeScript 中导入 JavaScript 包，解决声明文件报错问题](https://zhuanlan.zhihu.com/p/349595729?utm_source=wechat_session&utm_medium=social&utm_oi=35206853558272)  
[TypeScript 在 vue 中定义全局类型](https://www.cnblogs.com/leslie1943/p/13466943.html)  
类型声明文件统一放在/src/types 目录

### Volar + TS 在 vue 中提供更好的类型提示

[Volar - vue 终极开发神器！](https://juejin.cn/post/6966106927990308872#heading-0)  
[缺少 UI 库类型提示，你可能使用的是阉割版的 Volar+Vue](https://juejin.cn/post/7043723576121229342)

- 在 vue 模板中，提供更好的类型提示。
- UI 组件：要看有没有提供类型声明文件。

  vue2 的 element ui 不是用 TS 写的，组件没有类型提示，需要自定义类型声明文件：

  ```ts
  // GlobalComponents for Volar 为 Volar 准备的声明文件
  declare module "vue" {
    export interface GlobalComponents {
      ElButton: typeof import("element-plus")["ElButton"]; // vue3
      ElButton: typeof import("element-ui")["Button"]; //vue2
      // ...
    }
  }
  ```

  vue2 版本定义完类型声明文件，提示：`(property) ElButton: typeof Button`。  
  vue3 的 element ui，提供了 global.d.ts。鼠标悬停在组件上可以显示它有哪些属性。

- 自定义组件：手动引入的 TS 写的组件，自动提供类型提示。全局组件需要像 UI 组件一样定义全局组件类型声明文件。vite 提供了配置项，可以自动生成该文件。借助插件 [unplugin-vue-components](https://github.com/antfu/unplugin-vue-componentss)

  ```js
  ViteComponents({
    dirs: ["src/components"], //自动导入自己的组件，默认src/components
    dts: "src/types/components.d.ts", // 生成类型声明文件
  });
  ```

### 组件 props 类型校验

第一种方式：使用 vue 的 props 校验+vue 提供的 PropType 增强校验，可以有默认值。

```js
import { PropType } from "vue-demi";
. . .
  props: {
    routes: {
      type: Array as PropType<RouteItem[]>,
    },
  },
. . .
```

第二种方式：使用 setup 语法糖 + TS 进行类型校验 **推荐**

```ts
// withDefaults、defineProps 不需要导入 网上文章有误，参考官方文档

interface IProps {
  field1: string; // ?: 可选属性
}
const props = withDefaults(defineProps<IProps>(), {
  field1: "", // 默认值
});
```

### shims-vue.d.ts 文件的作用

shims-vue.d.ts 是为了 typescript 做的适配定义文件，因为.vue 文件不是一个常规的文件类型，ts 是不能理解 vue 文件是干嘛的，加这一段是是告诉 ts，vue 文件是这种类型的。

这一段删除，会发现 import 的所有 vue 类型的文件都会报错。

### 为 axios 增加泛型的支持

axios 请求返回的类型是 any，这时我们对请求后的数据进行操作时，没有享受到 ts 带来的类型提示，这时我们要做的就是重新声明 axios 模块：新建一个 shims-axios.d.ts，然后在调用时加上泛型。

```ts
import { AxiosRequestConfig } from "axios";

declare module "axios" {
  interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): Promise<T>;
    request<T = any>(config: AxiosRequestConfig): Promise<T>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T>;
    put<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T>;
    patch<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T>;
  }
}
```

### 自定义指令

组件引入自定义指令时 `directives: { draggable }`，模板报错，变量找不到名称 xxx，改为 setup 可以解决？
换一种写法解决 `directives: { draggable: { ...draggable } }`。  
[使用 Vue、TS 编写一个自定义长按指令](https://juejin.cn/post/6894518151686389774)

### 导入 export default 的文件

类型报错：`"default”隐式具有类型 "any"，因为它不具有类型批注，且在其自身的初始化表达式中得到直接或间接引用。`  
使用 `as` 进行对 `import` 的内容进行类型转换。

### $el 在 element 类型中不存在

[TS 报错：$el 在 element 类型中不存在](https://segmentfault.com/q/1010000019458114)

`let elem = (this.$refs.nav as Vue).$el;`

### EventTarget 类型

> [为什么 EventTarget 类型上比 HTMLElement 类型少那么多属性?](https://segmentfault.com/q/1010000039692067)  
> 因为 `EventTarget` 是一个抽象基类，所有事件的触发都会有一个 `EventTarget`，甚至不一定是一个 `DOM` 对象（比如可能是一个 `VideoContext` 或者 `WebSocket`）

遇到报错时进行类型转换 `e.target as HTMLElement`

### 隐式具有“any”类型

元素隐式具有“any”类型，因为“string”类型的表达式不能用于索引类型。通过类型转换解决：

```ts
field as keyof typeof messages;

(args: typeof xxx) => {};
```

`keyof` 该操作符可以用于获取某种类型的所有键，其返回类型是联合类型  
`typeof` 可以 获取一个值的类型，通过这个类型进行声明

### 模板过滤器问题

- ts 报未定义。声明全局变量 global.d.ts

  ```ts
  declare const $msg: { [key: string]: string };
  declare const selectEcho: function;
  declare const fdate: function;
  ```

- 过滤器 | ts 报：算术运算左侧必须是 "any"、"number"、"bigint" 或枚举类型。[vue3 已经移除过滤器](https://v3.cn.vuejs.org/guide/migration/filters.html)。建议用方法调用或计算属性来替换它们。或者将数据转 any 抑制报错。

## TSX 实践

> [vite-vue2-tsx-composition-api](https://github.com/caoxiemeihao/vite-vue2-tsx-composition-api) 项目混用 vue-cli 和 vite  
> [vite2 + vue2 + tsx + pinia 实战总结](http://soiiy.com/index.php/Vue-js/13783.html)  
> [Vue2.x 开启 Composition API、tsx](https://juejin.cn/post/6957881662302584839)  
> [在 Vue 中使用 JSX](https://www.jianshu.com/p/9616745a8d0a)  
> [Vite + Vue 3 + tsx](https://juejin.cn/post/6972094589251354632#heading-10)  
> [渲染函数 & JSX](https://cn.vuejs.org/v2/guide/render-function.html#ad) 官方文档

### 配置 vite

```js
createVuePlugin({ jsx: true }),
```

### 遇到的问题

1. `vue2` `setup` 中写 `tsx` 报错：`Cannot read property '$createElement' of undefined 等。setup 中不支持 (setup 中没有 this) tsx`

   解决：写在 `render` 选项中，或者引入 [babel-preset-vca-jsx](https://github.com/luwanquan/babel-preset-vca-jsx)

2. jsx 中用帕斯卡 PascalCase 风格 element 组件标签， ts 报：未定义变量

   解决：手动引入 `element ui` 组件

3. 配置组件属性，TS 报错：`“(options?: ThisTypedComponentOptionsWithArrayProps<Vue, object, object, object, never> | undefined): Col”`错误。 解决：修改 shims-tsx.d.ts 类型声明文件：

   ```ts
   import Vue, { VNode } from "vue";
   import Vue, { VNode } from "vue";
   import { ComponentRenderProxy } from "@vue/composition-api";
   declare global {
     namespace JSX {
       interface Element extends VNode {}
       interface ElementClass extends ComponentRenderProxy {}
       interface ElementAttributesProperty {
         $props: Record<string, unknown>; // specify the property name to use
       }
       interface IntrinsicElements {
         [elem: string]: any;
       }
       interface ImportMeta {
         env: Record<any, string>;
         globEager<T = unknown>(globPath: string): Record<string, T>;
       }
     }
   }
   ```

4. TS 报错 `(method) render?(createElement: CreateElement, hack: RenderContext<DefaultProps>): VNode`
   没有与此调用匹配的重载。未解决

## IE 兼容

默认不兼容 IE，配置 `Vite` 兼容 IE 后，打包速度变慢

### js 兼容配置

[vite 兼容 IE、低版本浏览器方法](https://www.codeleading.com/article/62956091258/)

```bash
yarn add @vitejs/plugin-legacy -D
```

兼容 IE11 配置 vite.config.js

```js
import legacy from "@vitejs/plugin-legacy";

export default {
  plugins: [
    legacy({
      targets: ["ie >= 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
  ],
};
```

### css 兼容配置

用了 windi.css ie 不兼容，部分样式丢失，解决方式：使用 [CSS Variables Polyfill for IE11](https://github.com/nuxodin/ie11CustomProperties)

```html
<script>
  window.MSInputMethodContext &&
    document.documentMode &&
    document.write(
      '<script src="https://cdn.jsdelivr.net/gh/nuxodin/ie11CustomProperties@4.1.0/ie11CustomProperties.min.js"><\/script>'
    );
</script>
```

放在项目的 public 目录 public\static\js\ie11CustomProperties.min.js

```html
<script src="/static/js/ie11CustomProperties.min.js"><\/script>
```

### Element ui 在 ie11 中报错

使用解析器 ElementUiResolver 自动按需加载，打包时出问题：不会经过 @vitejs/plugin-legacy
解决方式：改为全局引入 element ui  
[issue](https://github.com/antfu/unplugin-vue-components/issues/212)

### svgIcon 兼容性问题

IE 不兼容 vite 的 svg 图标，无法显示。改为字体图标，用法和 webpack 构建的项目一样

`import "@/assets/icon/iconfont.css";`

## vueUse 实践

### 父子组件数据同步

<https://vueuse.org/core/usevmodel/>

使用方式：

1. 子组件通过 `vueUse` 发布事件 `@update:value`

   ```js
   const activeIndex = useVModel(props, "value", emit);
   ```

   同 `emit('update:value', value)`

2. 子组件 `props` 定义一个 `value` 属性
3. 父组件使用 `value.sync = "xxx"` 绑定到要改的值
   同 `@update:value="value => this.xxx = value"`

和自定义 v-model 有点不同，v-model 在子组件需要定义 model 选项

### 获取鼠标位置

<https://vueuse.org/core/useMouse/>

## 打包上线

> [vue 自动化部署 jenkins 篇](https://juejin.cn/post/6844903816375074830)  
> [vite 根据环境变量与模式打包项目](https://juejin.cn/post/6994310850290909214)  
> [vite 环境变量与模式](https://cn.vitejs.dev/guide/env-and-mode.html#modes)

### 根据环境变量与模式打包项目

通过 `--mode test` 选项标志传递模式，来覆盖命令使用的默认模式

在 vue 里使用，比如：

```js
console.log("VITE_APP_TITLE:" + import.meta.env.VITE_APP_TITLE);
```

**注意** 字符串不能直接用 `import.meta.env.`的方式使用，不然打包的时候会报错，可以用 `import.meta\u200b.env.VITE_APP_TITLE` 的方式使用。比如下面的标题 **vite.config.js 中使用 `import.meta.env.*`**，导致打包报错。

### 项目部署公共基础路径

就是下文的 `base` 路径

涉及 `vue-router` 和 `vite` 配置  
<https://vitejs.cn/guide/build.html#public-base-path>  
<https://router.vuejs.org/zh/api/#base>

### [vite.config.js 中使用 `import.meta\u200b.env.*`](https://www.jianshu.com/p/4973bd983e96)

需求：不同环境配置不同的 base 路径，发布到不同的目录

无法像 `vue-cli` 一样直接取到环境变量，原因是鸡生蛋的问题：

> There's a chicken-egg problem here: Vite expects to resolve .env files from project root, but project root can be made
> different by the config file.
> So if we resolve。 env before resolving the config file, we can only resolve it from CWD, which would then break the case
> where the user puts .env files in a nested root specified via config.

第一种方式：写法要做一点改变，套了一层函数

```js
import { loadEnv } from "vite";
export default ({ mode }) => {
  return defineConfig({
    plugins: [vue()],
    base: loadEnv(mode, process.cwd()).VITE_APP_BASE,
  });
};
```

第二种方式：`dotenv` 需要单独 `npm install`

```js
export default ({ mode }) => {
  require("dotenv").config({ path: `./.env.${mode}` });
  // now you can access config with process.env.{configName}
  return defineConfig({
    plugins: [vue()],
    base: process.env.VITE_APP_BASE,
  });
};
```

### html 中使用环境变量

`vite-plugin-html-env`

**注意** 配置 `base` 发布路径后 `html` 中的路径会自动处理，`js`中的路径不会处理，可以使用外置文件引入 js，`<script>` 标签的路径会被自动修正，一般用不上这个插件。

### 打包文件路径

[vite.config.js 配置踩坑](https://juejin.cn/post/6989475484551610381)

- 打包后静态资源路径不对，封装一个方法：获取 img 目录下图片的动态路径

  ```ts
  /**
   * @param name 图片名称
   * @param format 图片格式 默认png
   */
  export const getImg = (name: string, format = "png") => {
    const path = `/src/assets/img/${name}.${format}`;
    const modules = import.meta.globEager<{ default: string }>(
      "/src/assets/img/*"
    );
    return modules[path].default;
  };
  ```

- 打包后静态资源文件分类存放

  ```js
  defineConfig({
    build: {
      minify: true,
      assetsDir: "static/img/",
      rollupOptions: {
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
      },
    },
  ```
