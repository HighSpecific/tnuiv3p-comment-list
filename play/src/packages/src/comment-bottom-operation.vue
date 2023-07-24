<script lang="ts" setup>
import { computed } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import { useNamespace } from '@tuniao/tnui-vue3-uniapp/hooks'

import {
  commentBottomOperationEmits,
  commentBottomOperationProps,
} from './comment-bottom-operation'

const props = defineProps(commentBottomOperationProps)
const emits = defineEmits(commentBottomOperationEmits)

const ns = useNamespace('tn-comment-bottom-operation')

const likeIconColor = computed<string>(() =>
  props.likeIconColor !== undefined ? props.likeIconColor : 'tn-gray-dark'
)
const activeLikeIconColor = computed<string>(() =>
  props.activeLikeIconColor !== undefined ? props.activeLikeIconColor : 'tn-red'
)
const dislikeIconColor = computed<string>(() =>
  props.dislikeIconColor !== undefined ? props.dislikeIconColor : 'tn-gray-dark'
)
const activeDislikeIconColor = computed<string>(() =>
  props.activeDislikeIconColor !== undefined
    ? props.activeDislikeIconColor
    : 'tn-gray-dark'
)

const likeClickHandle = () => {
  emits('like')
}
const dislikeClickHandle = () => {
  emits('dislike')
}
const deleteClickHandle = () => {
  emits('delete')
}
</script>

// #ifdef MP-WEIXIN
<script lang="ts">
export default {
  options: {
    // 在微信小程序中将组件节点渲染为虚拟节点，更加接近Vue组件的表现(不会出现shadow节点下再去创建元素)
    virtualHost: true,
  },
}
</script>
// #endif

<template>
  <view :class="[ns.b()]">
    <view :class="[ns.e('left')]">
      <view :class="[ns.e('date')]">{{ data.date }}</view>
      <view v-if="!!data.position" :class="[ns.e('position')]">
        {{ data.position }}
      </view>
      <view :class="[ns.e('reply')]">回复</view>
      <view
        v-if="showDelete"
        :class="ns.e('delete')"
        @tap.stop="deleteClickHandle"
      >
        删除
      </view>
    </view>
    <view :class="[ns.e('right')]" @tap.stop="null">
      <view
        v-if="showLike"
        :class="[ns.e('like-container')]"
        @tap.stop="likeClickHandle"
      >
        <view class="like" :class="[ns.e('icon')]">
          <TnIcon
            :name="data.likeActive ? activeLikeIcon : likeIcon"
            :color="data.likeActive ? activeLikeIconColor : likeIconColor"
          />
        </view>
        <view :class="[ns.e('like-value')]">{{ data.likeCount }}</view>
      </view>
      <view
        v-if="showDislike"
        class="dislike"
        :class="[ns.e('icon')]"
        @tap.stop="dislikeClickHandle"
      >
        <TnIcon
          :name="data.dislikeActive ? activeDislikeIcon : dislikeIcon"
          :color="
            data.dislikeActive ? activeDislikeIconColor : dislikeIconColor
          "
        />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import './theme-chalk/comment-bottom-operation.scss';
</style>
