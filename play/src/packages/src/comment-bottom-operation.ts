import { buildProps, definePropType } from '@tuniao/tnui-vue3-uniapp/utils'
import { commentListBaseProps } from './types'

import type { TnCommentListItem } from './types'
import type { ExtractPropTypes } from 'vue'

export type TnCommentBottomOperationData = Pick<
  TnCommentListItem,
  'date' | 'position' | 'likeActive' | 'likeCount' | 'dislikeActive'
>

export const commentBottomOperationProps = buildProps({
  ...commentListBaseProps,
  /**
   * @description 底部操作栏数据
   */
  data: {
    type: definePropType<TnCommentBottomOperationData>(Object),
    default: () => ({
      date: '',
      position: '',
      likeActive: false,
      likeCount: 0,
      dislikeActive: false,
    }),
  },
  /**
   * @description 是否显示删除按钮
   */
  showDelete: Boolean,
})
export const commentBottomOperationEmits = {
  /**
   * @description 点赞事件
   */
  like: () => true,
  /**
   * @description 点踩事件
   */
  dislike: () => true,
  /**
   * @description 删除事件
   */
  delete: () => true,
}

export type CommentBottomOperationProps = ExtractPropTypes<
  typeof commentBottomOperationProps
>
export type CommentBottomOperationEmits = typeof commentBottomOperationEmits
