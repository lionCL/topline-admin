<template>
  <div class="login-wrap">
    <div class="login-bar">
      <div class="logo">
        <img src="./imgs/logo_index.png" alt="" />
      </div>
      <div class="form-wrap">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" :rules="rules">

          <el-form-item prop="mobile">
            <el-input v-model="ruleForm.mobile" placeholder="请输入手机号码">
            </el-input>
          </el-form-item>

          <el-form-item prop="code">
            <el-row>
              <el-col :span="14">
                <el-input v-model="ruleForm.code" placeholder="请输入验证码">
                </el-input>
              </el-col>
              <el-col :span="7" :offset="3">
                <el-button @click="getCode">{{sec==60?'验证码':'剩余'+sec+'秒'}}</el-button>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="btn-login" @click="doLogin('ruleForm')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        mobile: '',
        code: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '请输入6位验证码', trigger: 'blur' }
        ]
      },
      //验证码倒计时的初始值
      sec: 60
    }
  },
  methods: {
    getCode() {
      //判断是否输入手机号
      if (this.ruleForm.mobile == '') {
        //message框提示
        this.$message.error('请先输入手机号')
        return
      }

      //定时器会过一秒钟运行  先减去一秒
      this.sec--

      let timeId = setInterval(() => {
        this.sec--
        //模拟给一个验证码
        if (this.sec == 57) {
          this.ruleForm.code = '246810'
        }

        if (this.sec == 0) {
          clearInterval(timeId)
          this.sec = 60
        }
      }, 1000)
    },

    doLogin(formName) {
      if (this.ruleForm.mobile == '' || this.ruleForm.code == '') {
        this.$message({
          message: '手机号或者验证码为空,请重新输入',
          type: 'warning'
        })
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post('http://ttapi.research.itcast.cn/mp/v1_0/authorizations', {
              mobile: this.ruleForm.mobile,
              code: this.ruleForm.code
            })
            .then(res => {
              if (res.data.data) {
                this.$message({
                  message: '登录成功',
                  type: 'success'
                })
                //登录成功跳转到home路由
                this.$router.push('/home')
              } else {
                this.$message({
                  message: '账号或验证码错误',
                  type: 'error'
                })
              }
            })
            //错误的时候触发
            .catch(res => {
              this.$message({
                message: '账号或验证码错误',
                type: 'error'
              })
            })
        } else {
          this.$message.error('账号或验证码错误,请按要求填写')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scope>
.login-wrap {
  height: 100%;
  background: url('./imgs/login_bg.jpg') no-repeat center / cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-bar {
    width: 400px;
    height: 400px;
    background-color: #fff;
    padding: 50px;
    .logo {
      text-align: center;
      margin-bottom: 30px;
      img {
        width: 160px;
      }
    }
    .form-wrap {
      .btn-login {
        width: 100%;
      }
    }
  }
}
</style>