# Academic Homepage

一个零依赖、响应式的中英双语个人学术网站。首页为一屏式封面，详细内容分别位于关于、研究、成果和经历页面；页眉语言按钮会记住访客上次选择的语言。

## 本地预览

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 修改内容

- 中英文内容：编辑各 HTML 元素的 `data-zh` / `data-en` 属性
- 首页入口：编辑 `index.html`
- 详细页面：编辑 `about.html`、`research.html`、`publications.html` 和 `experience.html`
- 配色与排版：编辑 `styles.css` 顶部的 CSS 变量
- 头像：替换 `头像.jpg`（建议使用正方形图片）
- 简历：替换 `RESUME_KYLE.pdf`

## 发布

可以直接部署到 GitHub Pages、Netlify 或 Vercel，无需构建步骤。
