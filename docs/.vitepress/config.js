const pkg = require("../../package.json");
import frontEndSidebar from "./frontEndSidebar";
import othersSidebar from "./othersSidebar";

module.exports = {
  title: "Note-x", // 网站标题
  description: "Note-x with vitePress", // 网站描述
  dest: "./dist", // 打包目录
  // base: "/docs/",
  // 头部head
  head: [["link", { rel: "icon", href: "/favicon.ico" }]], // 添加图标
  // 使用插件
  plugins: [
    "@vuepress/active-header-links",
    "@vuepress/back-to-top",
    "@vuepress/medium-zoom",
    "@vuepress/nprogress",
    [
      "@vuepress/plugin-search",
      {
        locales: {
          "/": {
            placeholder: "Search",
          },
          "/zh/": {
            placeholder: "搜索",
          },
        },
      },
    ],
  ],
  // 主题配置
  themeConfig: {
    repo: pkg.repository,
    // logo: "/logo.svg",
    // 获取每个文件最后一次 git 提交的 UNIX 时间戳(ms)，同时它将以合适的日期格式显示在每一页的底部
    // lastUpdated: 'Last Updated', // string | boolean
    // 启动页面丝滑滚动
    smoothScroll: true,
    editLinks: true,
    editLinkText: "为此页提供修改建议",
    // https://segmentfault.com/a/1190000015010997 全站搜索，填写文档网站的地址和邮箱进行申请
    algolia: {
      apiKey: "b573aa848fd57fb47d693b531297403c",
      indexName: "note-x",
      searchParameters: {
        facetFilters: ["tags:cn"],
      },
    },
    // 导航栏配置
    nav: [
      { text: "前端", link: "/frontEnd/" },
      { text: "后端", link: "/backEnd/" },
      { text: "运维", link: "/devOps/" },
      { text: "其他", link: "/others/" },
      // {
      //   text: "相关链接",
      //   items: [
      //     {
      //       text: "Twitter",
      //       link: "https://twitter.com/vite_js",
      //     },
      //   ],
      // },
    ],
    sidebar: {
      "/backEnd/": "auto",
      "/ops/": "auto",
      "/others/": othersSidebar,
      "/": frontEndSidebar,
    },
  },
};
