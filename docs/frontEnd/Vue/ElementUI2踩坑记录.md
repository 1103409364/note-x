# ElementUI2 踩坑

记录工作中遇到的问题，及解决方案。

## 表单校验问题

```html
<el-form-item prop="page" :rules="[ { max: 50, message: `page超了` } ]">
  <el-input v-model="item.page" type="number"> </el-input>
</el-form-item>
```

手动给 page 一个初始值 1，校验不过。给一个'1'，校验通过。

**解决** 进行类型转换，使用 `string` 类型。

**注意** `el-input` `type="number"` 得到的值是 `string` 类型。

## 密码输入框自动填充用户名密码

浏览器自带的功能，注册和重置密码的场景不需要自动填充功能

**解决** 配置属性

```html
<!-- 普通标签  autocomplete="off"-->
<input type="password" autocomplete="off" />
<!-- 组件 auto-complete="new-password"-->
<el-input
  type="password"
  v-model="form.password"
  show-password
  auto-complete="new-password"
></el-input>
```

## el-select 绑定值为对象报错

el-select 除了可以绑定单个字段，还可以绑定对象。应对选择时需要取多个字段时的场景。

**解决** `el-select` 配置主键 `value-key="id"`，`el-option` 的 `value` 配置为对象。

```html
<el-select v-model="formData.arr" value-key="id">
  <el-option
    v-for="item in doctorTeamList"
    :key="item.id"
    :label="item.name"
    :value="item"
  >
  </el-option>
</el-select>
```

## el-select 允许创建新项，失去焦点保留输入的值

利用 el-select 的 visible-change 事件获取值

```js
const visibleChange = (val: string) => {
  if (!$attrs["allow-create"]) return;
  if (!val) {
    let input = (searchSelectRef as ElSelect).$children[0].$refs
      .input as HTMLInputElement;
    emit("update:val", input?.value);
  }
};
```
