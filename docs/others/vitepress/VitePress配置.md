# VitePress 配置

## 设置搜索使用 Algolia 搜索

在 algolia 网站注册，然后自己上传网站数据非常麻烦。
algolia 提供了简化的方式 Algolia DocSearch，提交自己的网站，然后加入少量的脚本，就能使用了。

具体使用方法：

1. 打开 [Algolia DocSearch](https://docsearch.algolia.com/) 输入自己的文档地址和邮箱。
2. Algolia DocSearch 会发送确认邮件，收到后需要回复一下这个网站是你自己的，并且可以修改网站代码：
   ![回复邮件](./img/2022-02-07-13-45-47.png)
3. Algolia DocSearch 会发送一封使用邮件，里面有 apiKey 和 indexName
4. 在配置文件中添加如下内容, apiKey 和 indexName 就是上面邮件中的内容

> 参考[VuePress 搭建个人技术文档网站教程](https://segmentfault.com/a/1190000017055963)

## Vite 打包报错

可能是

- .md 文件的文件名使用了特殊符号，如 `+`
- 超链接里使用了 `import.meta.env.*`

## Github Pages 自动化部署

[GitHub-Pages 自动化部署 + github/gitee 选择](https://blog.csdn.net/qq_39823295/article/details/108913538)

使用 GitHub-Actions 实现文档更新后自动化部署到 Github Pages

**第一步** 新建目录和 Actions 配置文件 `.github\workflows\deploy.yml`

```yml
name: Deploy to Github-Pages
on: [push] # 触发条件(git 推送时)
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v2 # 下面这个最好设成 false
        with:
          persist-credentials: false

      - name: Install and Build 🔧
        run: |
          npm install 
          npm run build
        env:
          CI: false

      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@releases/v3
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          BRANCH: gh-pages # 部署的目标分支
          FOLDER: docs/.vitepress/dist # 部署的静态资源文件，打包后的文件的路径
```

**第二步** 配置 Pages，进入 Github-Settings-Pages，配置 Github Pages 的 Source 分支和路径  
**第三步** 在 main 分支提交代码测试。git 提交 push 后，在 Github-Actions 中可以看到 git 工作流执行的情况。

![Actions](./img/2022-02-10-14-18-04.png)
