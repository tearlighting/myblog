# ReactiveStore：从 React 痛点到统一响应式模型

<!-- section: overview -->

## Overview

一句话概括这个项目是干什么的。  
这里更像论文的 Abstract / 产品的 Lead。

- 做了什么
- 解决了什么问题
- 和常见方案的核心区别

---

## Background

### 为什么要做这个？

- React rerender 的痛点
- Zustand / Redux 的不满足点
- 我在项目中真实遇到的问题

可以写故事、经历、吐槽，没关系。

---

<!-- section: core -->

## Core

### 核心思想

- 数据是中心
- UI 是订阅者
- 更新是可控的、可追踪的

你可以在这里放**图、伪代码、概念对比**。

---

## Implementation

```ts
class ReactiveStore<T> {
  subscribe(fn: () => void) {}
  notify() {}
}
```

- 设计取舍
- 边界条件
- 为什么不用某某方案

这里是最技术向的部分。

<!-- section: result -->

## Result

<a id="result"></a>

实际效果

rerender 次数对比

复杂页面拆分前 / 后

demo / GIF / 使用场景

可以偏“展示”和“结论”。

## Reflection

<a id="reflection"></a>

反思与下一步

哪些地方做得不好

哪些是妥协

如果重来会怎么设计

这是个人风格最强的一块。

---
