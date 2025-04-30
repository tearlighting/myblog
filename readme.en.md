## 🇺🇸 English Version (README.md)

````markdown
# ✨ MyBlog - A Personal Blog Built with Vue2 + TypeScript

A fully self-developed personal blog system built with Vue2 and TypeScript. No UI frameworks used—every component is handcrafted. It integrates authentication, dynamic themes, page animations, Markdown rendering, and even a music player.

## 🧭 Purpose

Originally created to organize code snippets from daily work, this blog gradually evolved into a personal space that showcases writing, effects, customization, and even emotional records of life and growth.

## 📌 Features

- **Permission Control**: Supports guest mode and auto-login via localStorage.
- **Layout System**: Collapsible sidebar, visited-page tags, i18n, theme switcher, fullscreen mode.
- **Dynamic Routing**: Routes are built recursively from a tree, filtering hidden and unauthorized entries.
- **Custom Components**: Custom toast messages, image preloaders, global scroll events using eventBus.
- **Homepage Animation**: Parallax effect with mouse movement, animated subtitles, image lazy-loading.
- **Article Page**: Markdown rendering with syntax highlight, table of contents, anchor scroll syncing.
- **Message Page**: A place for users to leave comments to the site owner.
- **About Me**: Japanese-only section reflecting my thoughts and motivation for coming to Japan.
- **Hobby Page**: Music player featuring my own Japanese song covers over the years.

## 🛠 Tech Stack

- Vue2 + TypeScript
- Vuex, Vue Router
- Less (with theme mixins)
- PrismJS, markdown-it
- No UI frameworks used

## 🚀 Getting Started

```bash
git clone https://github.com/tearlighting/myblog.git
cd myblog
npm install
npm run serve
```
````
