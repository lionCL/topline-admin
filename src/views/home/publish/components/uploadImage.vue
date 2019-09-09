<template>
  <div>
    <!--选择框 -->
    <div class="cover-wrap"
         @click="dialogVisible = true">
      <p v-if="!isShowImg">点击选择图片</p>
      <i v-if="!isShowImg"
         class="iconfont icon-image_upload"></i>
      <img v-if="isShowImg"
           :src="imageUrl"
           alt />
    </div>

    <!-- 提示框 -->
    <el-dialog :visible.sync="dialogVisible"
               width="50%">
      <!-- tags标签页 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="上传图片"
                     name="first">
          <!-- 上传图片功能 -->
          <el-upload class="avatar-uploader"
                     action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                     :show-file-list="false"
                     :headers="header"
                     :on-success="doSuccess"
                     name="image">
            <img v-if="imageUrl"
                 :src="imageUrl"
                 class="avatar" />
            <i v-else
               class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>

        <el-tab-pane label="媒体库"
                     name="second">配置管理</el-tab-pane>
      </el-tabs>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="daOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'upload',
  data() {
    return {
      imageUrl: '',
      //控制对话框显示影藏属性
      dialogVisible: false,
      //控制图片的显示
      isShowImg: false,
      //默认显示哪个标签页
      activeName: 'first',

      header: {
        Authorization: `Bearer ${
          JSON.parse(window.sessionStorage.getItem('userInfo')).token
        }`
      }
    }
  },
  methods: {
    //上传图片成功钩子函数
    doSuccess(response) {
      //将请求成功响应回来图片url地址赋值给img src
      this.imageUrl = response.data.url
    },
    // 点击确定按钮事件
    daOK() {
      //显示图片
      this.isShowImg = true
      //隐藏对话框
      this.dialogVisible = false

      //传递当前图片路径给父组件
      this.$emit('change', this.imageUrl)
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