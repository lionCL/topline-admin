<template>
  <el-select placeholder="请选择"
             v-model="channel_id">
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
      channel_id: '',
      channels: []
    }
  },
  created() {
    //频道列表请求
    this.$axios.get('/mp/v1_0/channels').then(res => {
      this.channels = res.data.data.channels
    })
  }
}
</script>

<style>
</style>