import { withNoopInstall } from '@tuniao/tnui-vue3-uniapp/utils'
import CommentList from './index.vue'

export const TnCommentList = withNoopInstall(CommentList)
export default TnCommentList

export * from './types'
export type { TnCommentListInstance } from './instance'
