<template>
  <!-- 子组件向父组件传值 并做双向绑定 -->
  <el-select placeholder="请选择"
             :value="channel_id"
             @change="toFather($event)">
    <el-option label="所有频道"
               value=""></el-option>
    <el-option :label="item.name"
               :value="item.id"
               v-for="item in channels"
               :key="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'channelTool',
  data() {
    return {
      channels: []
    }
  },

  props: ['channel_id'],
  //父组件可以直接使用v-model
  model: {
    prop: 'channel_id',
    event: 'change'
  },

  created() {
    //频道列表请求
    this.$axios.get('/mp/v1_0/channels').then(res => {
      this.channels = res.data.data.channels
    })
  },
  methods: {
    toFather(e) {
      this.$emit('change', e)
    }
  }
}
</script>

<style>
</style>