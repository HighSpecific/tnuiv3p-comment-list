import {
  buildProps,
  definePropType,
  isNumber,
  isObject,
  isString,
} from '@tuniao/tnui-vue3-uniapp/utils'

import type { ExtractPropTypes } from 'vue'

/**
 * 评论列表类型
 */
export type TnCommentListItem = {
  id: number | string
  avatar: string
  nickname: string
  date: string
  position: string
  content: string
  likeActive: boolean
  likeCount: number
  dislikeActive: boolean
  disabledReply: boolean
  allowDelete: boolean
  commentCount?: number
  comment?: TnCommentListItem[]
}
export type TnCommentListData = TnCommentListItem[]

export type TnReplyCommentData = Pick<
  TnCommentListItem,
  'id' | 'avatar' | 'nickname' | 'date' | 'position' | 'content' | 'allowDelete'
>

export const commentListBaseProps = buildProps({
  /**
   * @description 显示点赞图标
   */
  showLike: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 显示点踩图标
   */
  showDislike: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 点赞图标
   */
  likeIcon: {
    type: String,
    default: 'like',
  },
  /**
   * @description 激活后的点赞图标
   */
  activeLikeIcon: {
    type: String,
    default: 'like-fill',
  },
  /**
   * @description 点赞图标默认颜色
   */
  likeIconColor: {
    type: String,
    default: 'tn-gray-dark',
  },
  /**
   * @description 点赞图标激活颜色
   */
  activeLikeIconColor: {
    type: String,
    default: 'tn-red',
  },
  /**
   * @description 点踩图标
   */
  dislikeIcon: {
    type: String,
    default: 'like-break',
  },
  /**
   * @description 激活后的点踩图标
   */
  activeDislikeIcon: {
    type: String,
    default: 'like-fill',
  },
  /**
   * @description 点踩图标默认颜色
   */
  dislikeIconColor: {
    type: String,
    default: 'tn-gray-dark',
  },
  /**
   * @description 点踩图标激活颜色
   */
  activeDislikeIconColor: {
    type: String,
    default: 'tn-gray-dark',
  },
})

export const commentListProps = buildProps({
  ...commentListBaseProps,
  /**
   * @description 评论列表
   */
  data: {
    type: definePropType<TnCommentListData>(Array),
    default: () => [],
  },
})

export type TnReplyCommentParams = {
  id: string | number
  nickname: string
}
export type TnShowMoreCommentParams = {
  id: string | number
  currentCommentCount: number
}
export const commentListEmits = {
  /**
   * @description 点赞事件
   */
  like: (id: number | string) => isNumber(id) || isString(id),
  /**
   * @description 点踩事件
   */
  dislike: (id: number | string) => isNumber(id) || isString(id),
  /**
   * @description 回复事件
   */
  reply: (params: TnReplyCommentParams) => isObject(params),
  /**
   * @description 删除事件
   */
  delete: (id: number | string) => isNumber(id) || isString(id),
  /**
   * @description 查看更多评论事件
   */
  'show-more': (params: TnShowMoreCommentParams) => isObject(params),
}

export type CommentListProps = ExtractPropTypes<typeof commentListProps>
export type CommentListEmits = typeof commentListEmits
