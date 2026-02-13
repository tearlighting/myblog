# 整体定义

```ts
Chaper 1：Intro / 我是谁

- 单画面
- X：轻微扫视
- 偏氛围

Chaper 2：经历

- 多 panel
- X：可能 snap
- 有时间线感

Chaper 3：兴趣

- 更自由
- X：free

Chaper 4：Projects

- 可能复用你现有 Project 表达
```

Y 是章节(Chapter)，不是滚动

X 是探索(Section Union)，不是翻页

## 关于x轴

x轴的是由不同的section组成。Section组件自己实现

### 关于Section

每一个Section有自己的x去控制动画

```ts
Section A: x ∈ [0,1]
↓ 切换
Section B: x ∈ [0,1]
↓ 切换
Section C: x ∈ [0,1]
```

切换的本质上就是吸附。只是离散的吸附可能感觉太像轮播图了，你无法停在SectionA和SectionB之间,这需要引入过渡走廊，我暂时还不知道能不能实现，但是效果我现在还不确定。

**注**
你可能想要用timeLine,但是这个成本太高了。你想想啊，你需要知道你的具体位置，要不然动画直接炸。你调组件的顺序，这些又炸。如果没有动画，你就是一个长的横向的图吧。
如果你还有支持卸载部分组件，你的位置还需要重新计算。所以就放弃了这种写法了。

## 关于Y轴

y轴天然适合离散切换。其实这需要状态机跑一下流程就可以了。然后继续回归x轴
