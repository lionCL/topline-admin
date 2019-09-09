<template>
  <div>
    <div class="cover-wrap">
      <p v-if="!isShowImg">点击选择图片</p>
      <i v-if="!isShowImg"
         class="iconfont icon-image_upload"></i>
      <img v-if="isShowImg"
           :src="imageUrl"
           alt />
    </div>
  </div>
</template>

<script>
export default {
  name: 'upload',
  data() {
    return {
      imageUrl: '',
      //控制对话框显示影藏属性
      isShowImg: false
    }
  }
}
</script>

<style lang='less' scoped>
.cover-wrap {
  padding: 5px;
  width: 200px;
  height: 200px;
  border: 1px dashed #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;

  p {
    font-size: 20px;
    margin: 20px 0 30px 0;
  }
  .icon-image_upload {
    font-size: 80px;
    color: #eee;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>