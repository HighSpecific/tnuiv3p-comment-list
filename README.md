# 图鸟 UI vue3 uniapp Plugins - 评论列表

![TuniaoUI vue3 uniapp](https://resource.tuniaokj.com/images/vue3/market/vue3-banner-min.jpg 'TuniaoUI vue3 uniapp')

[Tuniao UI vue3官方仓库](https://github.com/tuniaoTech/tuniaoui-rc-vue3-uniapp)

该组件一般用于展示评论信息

## 组件安装

```bash
npm i tnuiv3p-tn-comment-list
```

## 组件位置

```bash
tnuiv3p-tn-comment-list/index.vue
```

## 平台差异说明

| App(vue) | H5  | 微信小程序 | 支付宝小程序 |  ...   |
| :------: | :-: | :--------: | :----------: | :----: |
|    √     |  √  |     √      |      √       | 适配中 |

## 基础使用

- 通过`data`属性传入评论列表数据

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { TnCommentListData } from 'tnuiv3p-tn-comment-list'

const commentList = ref<TnCommentListData>([
  {
    id: 1,
    avatar: 'https://tnuiimage.tnkjapp.com/avatar/normal/1.png',
    nickname: '图鸟用户1',
    date: '07-22',
    position: '广东',
    content: '这是一条来自图鸟用户1的评论',
    likeActive: false,
    likeCount: 0,
    dislikeActive: false,
    disabledReply: false,
    allowDelete: false,
    commentCount: 3,
  },
  {
    id: 2,
    avatar: 'https://tnuiimage.tnkjapp.com/avatar/normal/2.png',
    nickname: '图鸟用户2',
    date: '07-22',
    position: '广东',
    content: '这是一条来自图鸟用户2的评论',
    likeActive: true,
    likeCount: 1,
    dislikeActive: false,
    disabledReply: false,
    allowDelete: false,
    commentCount: 2,
  },
])
</script>

<template>
  <TnCommentList :data="commentList" />
</template>
```

## 对评论列表的增删查操作

### 评论列表查看更多操作

- 通过`show-more`事件可以监听到用户点击了评论列表的查看更多按钮，该事件返回的参数中包含了当前点击的评论的`id`，可以通过该`id`去请求该评论的回复列表；`currentCommentCount`可以获取当前已展示的评论数量

- 通过调用`TnCommentList`内部`addCommentData`函数添加数据，该函数接收`需要添加回复数据的评论id`和`评论列表数据`的参数

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type {
  TnCommentListInstance,
  TnCommentListItem,
  TnShowMoreCommentParams,
} from 'tnuiv3p-tn-comment-list'
// ...列表数据定义...

const commentListRef = ref<TnCommentListInstance>()

const showMoreClickHandle = ({ id }: TnShowMoreCommentParams) => {
  // 通过id去请求该评论的回复列表
  // ...
  const commentData: TnCommentListItem = [
    {
      id: 3,
      avatar: 'https://tnuiimage.tnkjapp.com/avatar/normal/3.png',
      nickname: '图鸟用户3',
      date: '07-23',
      position: '广东',
      content: '这是一条来自图鸟用户3的评论',
      likeActive: false,
      likeCount: 0,
      dislikeActive: false,
      disabledReply: false,
      allowDelete: false,
      commentCount: 3,
      comment: [
        {
          id: 5,
          avatar: 'https://tnuiimage.tnkjapp.com/avatar/normal/5.png',
          nickname: '图鸟用户5',
          date: '07-23',
          position: '广东',
          content: '这是一条来自图鸟用户5的评论',
          likeActive: false,
          likeCount: 0,
          dislikeActive: false,
          disabledReply: false,
          allowDelete: false,
        },
      ],
    },
    {
      id: 4,
      avatar: 'https://tnuiimage.tnkjapp.com/avatar/normal/4.png',
      nickname: '图鸟用户4',
      date: '07-23',
      position: '广东',
      content: '这是一条来自图鸟用户4的评论',
      likeActive: false,
      likeCount: 0,
      dislikeActive: false,
      disabledReply: false,
      allowDelete: false,
    },
  ]
  commentListRef.value?.addCommentData(id, commentData)
}
</script>

<template>
  <TnCommentList :data="commentList" @show-more="showMoreClickHandle" />
</template>
```

### 添加单条评论操作

- 通过`reply`事件可以监听点击了评论的回复操作，该事件返回的参数中包含了当前点击评论的`id`和待回复的用户名称`nickname`

- 通过调用`TnCommentList`的`addCommentReply`函数添加单条评论数据，该函数接收需要添加到的评论的`id`和`评论数据`的参数

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type {
  TnCommentListInstance,
  TnReplyCommentParams,
} from 'tnuiv3p-tn-comment-list'
// ...列表数据定义...

const commentListRef = ref<TnCommentListInstance>()

const replyClickHandle = ({ id }: TnReplyCommentParams) => {
  // 通过id添加评论到数据库中
  // ...
  commentListRef.value?.addCommentReply(id, {
    id: 10,
    avatar: 'https://tnuiimage.tnkjapp.com/avatar/normal/6.png',
    nickname: '图鸟用户6',
    date: '07-24',
    position: '广东',
    content: '这是一条来自图鸟用户6的评论',
    allowDelete: true,
  })
}
</script>

<template>
  <TnCommentList :data="commentList" @reply="replyClickHandle" />
</template>
```

### 删除评论操作

- 通过`delete`事件可以监听到用户点击了评论的删除按钮，该事件返回的参数中包含了当前点击的评论的`id`，可以通过该`id`去请求删除该评论

- 如果需要显示删除按钮，需要在数据参数中设置`allowDelete`为`true`

- 通过调用`TnCommentList`的`deleteCommentReply`函数删除评论，该函数接受评论的`id`

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { TnCommentListInstance } from 'tnuiv3p-tn-comment-list'
// ...列表数据定义...

const commentListRef = ref<TnCommentListInstance>()

const deleteClickHandle = (id: string | number) => {
  // 通过id从数据库中删除评论
  // ...
  commentListRef.value?.deleteCommentReply(id)
}
</script>

<template>
  <TnCommentList :data="commentList" @delete="deleteClickHandle" />
</template>
```



## API

### Props

| 属性名                    | 说明             | 类型              | 默认值       | 可选值                                                       |
| ------------------------- | ---------------- | ----------------- | ------------ | ------------------------------------------------------------ |
| data                      | 评论列表         | TnCommentListData | []           | -                                                            |
| show-like                 | 显示点赞图标     | Boolean           | `true`       | `false`                                                      |
| show-dislike              | 显示点踩图标     | Boolean           | `true`       | `false`                                                      |
| like-icon                 | 点赞图标         | String            | like         | [图标有效值](https://vue3.tuniaokj.com/zh-CN/component/icon.html) |
| active-like-icon          | 激活后的点赞图标 | String            | like-fill    | [图标有效值](https://vue3.tuniaokj.com/zh-CN/component/icon.html) |
| like-icon-color           | 点赞图标默认颜色 | String            | tn-gray-dark | [颜色有效值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html) |
| active-like-icon-color    | 点赞图标激活颜色 | String            | tn-red       | [颜色有效值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html) |
| dislike-icon              | 点踩图标         | String            | like-break   | [图标有效值](https://vue3.tuniaokj.com/zh-CN/component/icon.html) |
| active-dislike-icon       | 激活后的点踩图标 | String            | like-fill    | [图标有效值](https://vue3.tuniaokj.com/zh-CN/component/icon.html) |
| dislike-icon-color        | 点踩图标默认颜色 | String            | tn-gray-dark | [颜色有效值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html) |
| active-dislike-icon-color | 点踩图标激活颜色 | String            | tn-gray-dark | [颜色有效值](https://vue3.tuniaokj.com/zh-CN/guide/style/text.html) |

### Emits

| 事件名    | 说明         | 类型                                        |
| --------- | ------------ | ------------------------------------------- |
| like      | 点赞事件     | `(id: string \| number) => void`            |
| dislike   | 点踩事件     | `(id: string \|number) => void`             |
| reply     | 回复事件     | `(params: TnReplyCommentParams) => void`    |
| delete    | 删除事件     | `(id: string \|number) => void`             |
| show-more | 查看更多事件 | `(params: TnShowMoreCommentParams) => void` |

### Expose

| 函数名             | 说明         | 类型                                                       |
| ------------------ | ------------ | ---------------------------------------------------------- |
| addCommentData     | 添加评论     | `(id: string \| number, data: TnCommentListData) => void`  |
| addCommentReply    | 添加评论回复 | `(id: string \| number, data: TnReplyCommentData) => void` |
| deleteCommentReply | 删除评论回复 | `(id: string \| number) => void`                           |



#### TnCommentListItem

| 参数          | 类型                | 说明           | 必填 |
| ------------- | ------------------- | -------------- | ---- |
| id            | string \| number    | 评论id         | 是   |
| avatar        | string              | 用户头像       | 是   |
| nickname      | string              | 用户名         | 是   |
| date          | string              | 评论日期       | 是   |
| position      | string              | 评论所在所属地 | 是   |
| content       | string              | 评论内容       | 是   |
| likeActive    | boolean             | 激活点赞操作   | 是   |
| likeCount     | number              | 点赞数量       | 是   |
| dislikeActive | boolean             | 激活点踩操作   | 是   |
| disabledReply | boolean             | 禁止评论       | 是   |
| allowDelete   | boolean             | 允许删除       | 是   |
| commentCount  | number              | 总评论数据条数 | 否   |
| comment       | TnCommentListItem[] | 子评论数据     | 否   |

#### TnCommentListData = TnCommentListItem[]

#### TnReplyCommentParams

| 参数     | 类型             | 说明                       |
| -------- | ---------------- | -------------------------- |
| id       | string \| number | 评论id                     |
| nickname | string           | 正在回复评论所属用户的名称 |

#### TnShowMoreCommentParams

| 参数                | 类型             | 说明                 |
| ------------------- | ---------------- | -------------------- |
| id                  | string \| number | 评论id               |
| currentCommentCount | number           | 当前已显示的评论数量 |

#### TnReplyCommentData

| 参数          | 类型             | 说明           | 必填 |
| ------------- | ---------------- | -------------- | ---- |
| id            | string \| number | 评论id         | 是   |
| avatar        | string           | 用户头像       | 是   |
| nickname      | string           | 用户名         | 是   |
| date          | string           | 评论日期       | 是   |
| position      | string           | 评论所在所属地 | 是   |
| content       | string           | 评论内容       | 是   |
| allowDelete   | boolean          | 允许删除       | 是   |
| disabledReply | boolean          | 禁止回复       | 是   |
