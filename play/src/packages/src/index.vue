<script lang="ts" setup>
import TnAvatar from '@tuniao/tnui-vue3-uniapp/components/avatar/src/avatar.vue'
import { useNamespace } from '@tuniao/tnui-vue3-uniapp/hooks'
import { commentListEmits, commentListProps } from './types'
import { useCommentList } from './composables'

import CommentBottomOperation from './comment-bottom-operation.vue'

const props = defineProps(commentListProps)
const emits = defineEmits(commentListEmits)

const ns = useNamespace('tn-comment-list')
const {
  listData,
  likeClickHandle,
  dislikeClickHandle,
  replyClickHandle,
  deleteClickHandle,
  replyOperationClickHandle,
  addCommentData,
  addCommentReplyWithId,
  deleteCommentReplyWithId,
} = useCommentList(props, emits)

defineExpose({
  /**
   * @description 添加评论
   */
  addCommentData,
  /**
   * @description 添加评论回复
   */
  addCommentReply: addCommentReplyWithId,
  /**
   * @description 删除评论回复
   */
  deleteCommentReply: deleteCommentReplyWithId,
})
</script>

<template>
  <view :class="[ns.b()]">
    <view
      v-for="(item, index) in listData"
      :key="index"
      :class="[ns.e('item')]"
    >
      <view :class="[ns.e('item-data')]">
        <view :class="[ns.em('item-data', 'left')]">
          <view :class="[ns.e('avatar')]">
            <TnAvatar :url="item.avatar" size="70" />
          </view>
        </view>
        <view :class="[ns.em('item-data', 'right')]">
          <view :class="[ns.e('main-data')]" @tap.stop="replyClickHandle(item)">
            <view :class="[ns.e('nickname')]">{{ item.nickname }}</view>
            <view :class="[ns.e('content')]">{{ item.content }}</view>
            <view :class="[ns.e('bottom-operation')]">
              <CommentBottomOperation
                :data="{
                  date: item.date,
                  position: item.position,
                  likeActive: item.likeActive,
                  likeCount: item.likeCount,
                  dislikeActive: item.dislikeActive,
                }"
                :show-like="showLike"
                :show-dislike="showDislike"
                :like-icon="likeIcon"
                :active-like-icon="activeLikeIcon"
                :dislike-icon="dislikeIcon"
                :like-icon-color="likeIconColor"
                :active-like-icon-color="activeLikeIconColor"
                :dislike-icon-color="dislikeIconColor"
                :show-delete="item.allowDelete"
                :show-reply="!item.disabledReply"
                @like="() => likeClickHandle(item.id, index)"
                @dislike="() => dislikeClickHandle(item.id, index)"
                @delete="() => deleteClickHandle(item.id)"
              />
            </view>
          </view>
          <view
            :class="[ns.e('reply-data')]"
            :style="{
              height: `${item.hidden ? '0px' : 'auto'}`,
            }"
          >
            <view
              v-for="(commentItem, commentIndex) in item.comment"
              :key="commentIndex"
              :class="[ns.e('reply-item')]"
            >
              <view :class="[ns.em('reply-item', 'left')]">
                <view :class="[ns.e('avatar')]">
                  <TnAvatar :url="commentItem.avatar" size="40" />
                </view>
              </view>
              <view
                :class="[ns.em('reply-item', 'right')]"
                @tap.stop="replyClickHandle(commentItem)"
              >
                <view :class="[ns.e('reply-nickname'), ns.e('nickname')]">
                  <view class="nickname">{{ commentItem.nickname }}</view>
                  <view
                    v-if="commentItem.authorNickname"
                    class="author-nickname"
                  >
                    {{ commentItem.authorNickname }}
                  </view>
                </view>
                <view :class="[ns.e('content')]">
                  {{ commentItem.content }}
                </view>
                <view :class="[ns.e('bottom-operation')]">
                  <CommentBottomOperation
                    :data="{
                      date: commentItem.date,
                      position: commentItem.position,
                      likeActive: commentItem.likeActive,
                      likeCount: commentItem.likeCount,
                      dislikeActive: commentItem.dislikeActive,
                    }"
                    :show-like="showLike"
                    :show-dislike="showDislike"
                    :like-icon="likeIcon"
                    :active-like-icon="activeLikeIcon"
                    :dislike-icon="dislikeIcon"
                    :like-icon-color="likeIconColor"
                    :active-like-icon-color="activeLikeIconColor"
                    :dislike-icon-color="dislikeIconColor"
                    :show-delete="commentItem.allowDelete"
                    :show-reply="!commentItem.disabledReply"
                    @like="
                      () => likeClickHandle(commentItem.id, index, commentIndex)
                    "
                    @dislike="
                      () =>
                        dislikeClickHandle(commentItem.id, index, commentIndex)
                    "
                    @delete="() => deleteClickHandle(commentItem.id)"
                  />
                </view>
              </view>
            </view>
          </view>
          <view
            v-if="item.commentCount > 0"
            :class="[ns.e('show-more-operation')]"
            @tap.stop="replyOperationClickHandle(item.id)"
          >
            <view :class="[ns.em('show-more-operation', 'tips')]">
              <text v-if="!item?.comment?.length || item.hidden">
                查看{{ item.commentCount }}条回复
              </text>
              <text v-else-if="item.commentCount > item.comment.length">
                加载更多回复
              </text>
              <text v-else-if="item.commentCount === item.comment.length">
                收起
              </text>
            </view>
            <view :class="[ns.em('show-more-operation', 'icon')]">
              <TnIcon
                :name="
                  item.commentCount > item.comment.length || item.hidden
                    ? 'down'
                    : 'up'
                "
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import './theme-chalk/index.scss';
</style>
