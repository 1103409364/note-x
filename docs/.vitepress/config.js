const pkg = require("../../package.json");
import frontEnd from "./router/frontEnd";
import backEnd from "./router/backEnd";
import devOps from "./router/devOps";
import others from "./router/others";

module.exports = {
  title: "Note-x", // 网站标题
  description: "Note-x with vitePress", // 网站描述
  dest: "../../dist", // 打包目录
  base: "/note-x/",
  // 头部head
  head: [["link", { rel: "icon", href: "/favicon.ico" }]], // 添加图标
  // 使用插件 用不了
  // plugins: [
  //   "@vuepress/active-header-links",
  //   "@vuepress/back-to-top",
  //   "@vuepress/medium-zoom",
  //   "@vuepress/nprogress",
  //   [
  //     "@vuepress/plugin-search",
  //     {
  //       locales: {
  //         "/": {
  //           placeholder: "Search",
  //         },
  //         "/zh/": {
  //           placeholder: "搜索",
  //         },
  //       },
  //     },
  //   ],
  // ],
  // 主题配置
  themeConfig: {
    repo: pkg.repository,
    logo: "/OneNote.svg",
    docsBranch: "main",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "为此页提供修改建议",
    // 获取每个文件最后一次 git 提交的 UNIX 时间戳(ms)，同时它将以合适的日期格式显示在每一页的底部
    // lastUpdated: 'Last Updated', // string | boolean
    // search: true, //内置搜索 用不了
    searchMaxSuggestions: 10, //结果数量的限制
    // 启动页面丝滑滚动
    smoothScroll: true,
    // https://segmentfault.com/a/1190000015010997 全站搜索，填写文档网站的地址和邮箱进行申请
    // algolia: {
    //   apiKey: "a13e112ab3ca2b0038a9df3fae771fb3",
    //   indexName: "note-x",
    //   searchParameters: {
    //     facetFilters: ["tags:cn"],
    //   },
    // },
    // 导航栏配置
    nav: [
      { text: "前端", items: frontEnd },
      // { text: "后端", link: backEnd },
      // { text: "运维", link: devOps },
      { text: "其他", items: others },
    ],
    sidebar: {
      "/frontEnd": frontEnd,
      "/backEnd/": backEnd,
      "/ops/": devOps,
      "/others/": others,
    },
    // 路由根路径和.vitepress 路径同级
  },
};
