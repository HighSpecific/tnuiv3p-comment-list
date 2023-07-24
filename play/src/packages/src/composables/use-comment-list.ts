import { ref, watch } from 'vue'
import { debugWarn } from '@tuniao/tnui-vue3-uniapp/utils'

import type { SetupContext } from 'vue'
import type {
  CommentListEmits,
  CommentListProps,
  TnCommentListData,
  TnCommentListItem,
  TnReplyCommentData,
} from '../types'

type CommentListItem = Omit<TnCommentListItem, 'comment' | 'commentCount'> & {
  authorNickname?: string
}
type CommentListData = CommentListItem & {
  hidden: boolean
  commentCount: number
  comment: CommentListItem[]
}
type CommentList = CommentListData[]

export const useCommentList = (
  props: CommentListProps,
  emits: SetupContext<CommentListEmits>['emit']
) => {
  // 列表数据
  const listData = ref<CommentList>([])

  // 处理数据，将数据拍扁形成树
  const handleListData = () => {
    const { data } = props
    const list: CommentList = []

    // 开始遍历数据
    data.forEach((item) => {
      const {
        id,
        avatar,
        nickname,
        date,
        position,
        content,
        likeActive,
        likeCount,
        dislikeActive,
        disabledReply,
        commentCount,
        allowDelete,
      } = item
      const commentItem: CommentListData = {
        id,
        avatar,
        nickname,
        date,
        position,
        content,
        likeActive,
        likeCount,
        dislikeActive,
        disabledReply,
        allowDelete,
        hidden: false,
        commentCount: commentCount || 0,
        comment: [],
      }
      list.push(commentItem)
    })

    listData.value = list
  }
  watch(
    () => props.data,
    () => handleListData(),
    {
      immediate: true,
    }
  )

  const _findCommentIdInComment = (
    id: string | number
  ): { index: number; subIndex: number } => {
    let indexValue = -1
    let subIndexValue = -1
    listData.value.forEach((item, index) => {
      item?.comment?.forEach((_, subIndex) => {
        if (_.id === id) {
          indexValue = index
          subIndexValue = subIndex
          return
        }
      })
    })
    return { index: indexValue, subIndex: subIndexValue }
  }

  // 新增评论数据
  const addCommentData = (id: string | number, data: TnCommentListData) => {
    const _handleCommentData = (
      authorNickname: string,
      comment: TnCommentListData
    ) => {
      const commentData: CommentListItem[] = []
      comment.forEach((item) => {
        const {
          id,
          avatar,
          nickname,
          date,
          position,
          content,
          likeActive,
          likeCount,
          dislikeActive,
          disabledReply,
          allowDelete,
          comment,
        } = item
        const commentItem: CommentListItem = {
          id,
          avatar,
          nickname,
          authorNickname,
          date,
          position,
          content,
          likeActive,
          likeCount,
          dislikeActive,
          disabledReply,
          allowDelete,
        }
        commentData.push(commentItem)
        if (comment?.length) {
          commentData.push(..._handleCommentData(nickname, comment))
        }
      })

      return commentData
    }

    // 根据id查询主评论索引
    const commentIndex = listData.value.findIndex((_) => _.id === id)
    if (commentIndex === -1) {
      debugWarn('TnCommentList', '未找到对应的评论')
      return
    }

    // 插入评论
    listData.value[commentIndex].comment.push(..._handleCommentData('', data))
  }

  // 根据评论id插入评论
  const addCommentReplyWithId = (
    id: string | number,
    data: TnReplyCommentData
  ) => {
    // 获取评论索引
    let commentIndex = listData.value.findIndex((_) => _.id === id)
    let subCommentIndex = -1
    if (commentIndex === -1) {
      const { index, subIndex } = _findCommentIdInComment(id)
      commentIndex = index
      subCommentIndex = subIndex
    }

    if (commentIndex === -1 && subCommentIndex === -1) {
      debugWarn('TnCommentList', '未找到对应的评论')
      return
    }

    // 插入评论
    // 判断插入的评论是主评论还是子评论
    if (subCommentIndex === -1) {
      listData.value[commentIndex].comment.unshift({
        id: data.id,
        avatar: data.avatar,
        nickname: data.nickname,
        authorNickname: '',
        date: data.date,
        position: data.position,
        content: data.content,
        allowDelete: data.allowDelete,
        likeActive: false,
        likeCount: 0,
        dislikeActive: false,
        disabledReply: false,
      })
    } else {
      const nickname =
        listData.value[commentIndex].comment[subCommentIndex].nickname
      listData.value[commentIndex].comment.splice(subCommentIndex + 1, 0, {
        id: data.id,
        avatar: data.avatar,
        nickname: data.nickname,
        authorNickname: nickname,
        date: data.date,
        position: data.position,
        content: data.content,
        allowDelete: data.allowDelete,
        likeActive: false,
        likeCount: 0,
        dislikeActive: false,
        disabledReply: false,
      })
    }
    // 增加评论数量
    listData.value[commentIndex].commentCount++
  }

  // 根据id删除评论
  const deleteCommentReplyWithId = (id: string | number) => {
    // 获取评论索引
    let commentIndex = listData.value.findIndex((_) => _.id === id)
    let subCommentIndex = -1
    if (commentIndex === -1) {
      const { index, subIndex } = _findCommentIdInComment(id)
      commentIndex = index
      subCommentIndex = subIndex
    }

    if (commentIndex === -1 && subCommentIndex === -1) {
      debugWarn('TnCommentList', '未找到对应的评论')
      return
    }

    // 删除评论
    // 判断删除的评论是主评论还是子评论
    if (subCommentIndex === -1) {
      listData.value.splice(commentIndex, 1)
    } else {
      listData.value[commentIndex].comment.splice(subCommentIndex, 1)
      // 减少评论数量
      listData.value[commentIndex].commentCount--
    }
  }

  // 点赞事件
  const likeClickHandle = (
    id: string | number,
    index: number,
    subIndex?: number
  ) => {
    let item: CommentListItem | null = null
    if (subIndex === undefined) {
      item = listData.value[index]
    } else {
      item = listData.value[index].comment[subIndex]
    }
    item.likeActive = !item.likeActive
    if (item.likeActive) {
      item.likeCount++
    } else {
      item.likeCount--
    }
    if (item.dislikeActive) item.dislikeActive = false
    emits('like', id)
  }

  // 点踩事件
  const dislikeClickHandle = (
    id: string | number,
    index: number,
    subIndex?: number
  ) => {
    let item: CommentListItem | null = null
    if (subIndex === undefined) {
      item = listData.value[index]
    } else {
      item = listData.value[index].comment[subIndex]
    }
    item.dislikeActive = !item.dislikeActive
    if (item.likeActive) {
      item.likeActive = false
      item.likeCount--
    }
    emits('dislike', id)
  }

  // 回复点击事件
  const replyClickHandle = (item: CommentListItem) => {
    if (item.disabledReply) return
    emits('reply', {
      id: item.id,
      nickname: item.nickname,
    })
  }

  // 回复操作点击事件
  const replyOperationClickHandle = (id: string | number) => {
    const item = listData.value.find((_) => _.id === id)!
    if (item.comment.length >= item.commentCount) {
      item.hidden = !item.hidden
      return
    }
    emits('show-more', {
      id,
      currentCommentCount:
        listData.value.find((_) => _.id === id)?.comment.length || 0,
    })
  }

  // 删除点击事件
  const deleteClickHandle = (id: string | number) => {
    emits('delete', id)
  }

  return {
    listData,
    likeClickHandle,
    dislikeClickHandle,
    replyClickHandle,
    deleteClickHandle,
    replyOperationClickHandle,
    addCommentData,
    addCommentReplyWithId,
    deleteCommentReplyWithId,
  }
}
