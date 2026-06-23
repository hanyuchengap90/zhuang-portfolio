# 个人网站

这是庄志城的个人网站，用于展示建筑设计、室内设计、设计类 AI 应用方向、履历和作品集。

## 打开方式

直接打开 `index.html` 即可浏览。

如果浏览器限制本地资源，也可以在项目目录运行本地服务后访问：

```bash
python3 -m http.server 4173
```

然后打开：

```text
http://127.0.0.1:4173
```

## 后续增加内容

- 新作品：把图片放到 `public/assets/projects/`，再在 `script.js` 的 `works` 数组追加一个项目对象。
- 新分类：直接在新作品的 `category` 字段写新分类，筛选按钮会自动生成。
- 新履历：修改 `script.js` 的 `experiences` 数组。

## GitHub Pages

仓库发布到 GitHub Pages 时，发布源使用 `main` 分支根目录。
