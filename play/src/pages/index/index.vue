<script setup lang="ts">
import { ref } from 'vue'
import TnCommentList from '../../packages/src/index.vue'

import type {
  TnCommentListData,
  TnCommentListInstance,
  TnCommentListItem,
  TnReplyCommentParams,
  TnShowMoreCommentParams,
} from '../../packages/src'

const message = ref<string>('欢迎开发TuniaoUI v3 uniapp 插件')

const commentListRef = ref<TnCommentListInstance>()

const avatarList = Array.from({ length: 20 }).map(
  (_, i) => `https://tnuiimage.tnkjapp.com/avatar/normal/${i + 1}.png`
)
// 获取随机头像
const getRandomAvatar = () => {
  const index = Math.floor(Math.random() * avatarList.length)
  return avatarList[index]
}
// 随机生成0 - 1000的数字
const getRandomNumber = () => {
  return Math.floor(Math.random() * 1000)
}
// 随机生成是否可以删除
const getAllowDelete = () => {
  return Math.random() > 0.5
}

const commentList = ref<TnCommentListData>([])
const commentData: {
  [key: string]: {
    current: number
    data: TnCommentListItem[]
  }
} = {}
// 生成回复列表数据
const generateCommentListData = () => {
  const _generateCommentData = (idPrefix: string, start: number) => {
    const comment: TnCommentListItem[] = []
    for (let i = start; i < 5; i++) {
      const id = `${idPrefix}${i + 1}`
      comment.push({
        id,
        avatar: getRandomAvatar(),
        nickname: `图鸟${getRandomNumber()}kldfjdk克里斯朵夫家的六块腹肌你看大家反馈你的世界佛诶跑我房间可能大煞风景可能打飞机的是可能风刀霜剑`,
        date: '07-22',
        position: '广东',
        content: `这是一条回复-${id}-${getRandomNumber()}看到了房间的分开了多久啊法律框架放弃哦品味i俄飞机的旅客煞风景对你说分开；几滴漏式咖啡机你的快速反击大厦看能否加我企鹅哦IP发i接纳开发的风景的；了`,
        likeActive: false,
        likeCount: getRandomNumber(),
        dislikeActive: false,
        disabledReply: false,
        allowDelete: getAllowDelete(),
        comment: _generateCommentData(id, i + 1),
      })
    }
    return comment
  }
  for (let i = 0; i < 10; i++) {
    const id = `${i + 1}`
    commentList.value.push({
      id,
      avatar: getRandomAvatar(),
      nickname: `图鸟i${i + 1}`,
      date: '07-22',
      position: '广东',
      content: `这是一条评论-i-${i + 1}`,
      likeActive: false,
      likeCount: getRandomNumber(),
      dislikeActive: false,
      disabledReply: false,
      allowDelete: getAllowDelete(),
      commentCount: 31,
    })
    commentData[id] = {
      current: 0,
      data: _generateCommentData(id, 0),
    }
  }
}
generateCommentListData()

// 生成对应评论的回复
const showMoreClickHandle = ({ id }: TnShowMoreCommentParams) => {
  commentListRef.value?.addCommentData(id, [
    commentData[id].data[commentData[id].current],
  ])
  commentData[id].current++
}

// 评论回复
const replyClickHandle = ({ id }: TnReplyCommentParams) => {
  commentListRef.value?.addCommentReply(id, {
    id: `11 ${getRandomNumber()}`,
    avatar: getRandomAvatar(),
    nickname: `图鸟-r${id}-${getRandomNumber()}`,
    date: '07-23',
    position: '广东',
    content: `这是一条插入的回复-r-${id}-${getRandomNumber()}`,
    allowDelete: getAllowDelete(),
  })
}

// 删除评论
const deleteClickHandle = (id: string | number) => {
  commentListRef.value?.deleteCommentReply(id)
}
</script>

<template>
  <view class="content">
    <view class="message">{{ message }}</view>
  </view>
  <view class="comment-list">
    <TnCommentList
      ref="commentListRef"
      :data="commentList"
      @reply="replyClickHandle"
      @show-more="showMoreClickHandle"
      @delete="deleteClickHandle"
    />
  </view>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .message {
    font-size: 50rpx;
  }
}
</style>
