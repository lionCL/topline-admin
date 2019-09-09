<template>
  <el-card class="box-card">
    <el-container>
      <!-- 左边区域 -->
      <el-aside width="450px">
        <el-form ref="accountInfo"
                 :model="accountInfo"
                 label-width="80px"
                 label-position='top'
                 :rules="rules">
          <el-form-item label="媒体名称"
                        prop="name">
            <el-input v-model="accountInfo.name"
                      size="small"></el-input>
          </el-form-item>

          <el-form-item label="媒体简介">
            <el-input v-model="accountInfo.intro"
                      size="small"
                      type="textarea"
                      :rows="2"></el-input>
          </el-form-item>

          <el-form-item label="头条号ID">
            <el-input v-model="accountInfo.id"
                      size="small"
                      :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="绑定手机">
            <el-input v-model="accountInfo.mobile"
                      size="small"
                      :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input v-model="accountInfo.email"
                      size="small"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary"
                   @click="doSave">保存更新</el-button>
      </el-aside>
      <!-- 右边区域 -->
      <el-main>
        <p class="author_photo">媒体头像</p>
        <el-upload class="avatar-uploader"
                   action=""
                   :show-file-list="false"
                   :http-request="customUpload">
          <!-- 自定义请求事件 -->
          <img v-if="$store.state.accountInfo.photo"
               :src="$store.state.accountInfo.photo"
               class="avatar">
          <i v-else
             class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-main>
    </el-container>
  </el-card>
</template>

<script>
export default {
  name: 'account',
  data() {
    return {
      accountInfo: {
        email: '',
        id: '',
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 7, message: '长度在 1 到 7个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$axios.get('/mp/v1_0/user/profile').then(res => {
      this.accountInfo = res.data.data
      // 界面一打开就应该先给vuex赋值
      this.$store.commit('changeUserInfo', this.accountInfo)
    })
  },
  methods: {
    doSave() {
      this.$axios
        .patch('/mp/v1_0/user/profile', this.accountInfo)
        .then(res => {
          // console.log(res)
          if (res.data.message.toLowerCase() == 'ok') {
            this.$message.success('修改成功')

            //修改成功后修改vuex保存的数据
            this.$store.commit('changeUserInfo', this.accountInfo)
          } else {
            this.$message.error('修改失败')
          }
        })
        .catch(error => {
          this.$message.error('修改失败,接口错误')
        })
    },
    //图像自定义请求事件  上传文件需要foraData数据
    // data参数里的file属性就是刚刚选择的文件
    customUpload(data) {
      let fd = new FormData()
      //参数1:参数名
      //参数2:上传的值
      fd.append('photo', data.file)

      this.$axios.patch('/mp/v1_0/user/photo', fd).then(res => {
        this.accountInfo.photo = res.data.data.photo

        //上传的头像数据,保存到vuex中
        this.$store.commit('changeUserInfo', this.accountInfo)
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-top: 20px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 27px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  line-height: 178px;
}

.author_photo {
  font-size: 20px;
  color: #999;
}
</style>