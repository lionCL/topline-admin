<template>
  <div class="login-wrap">
    <div class="login-bar">
      <div class="logo">
        <img src="./imgs/logo_index.png" alt="" />
      </div>
      <div class="form-wrap">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" :rules="rules"
          :status-icon="true">

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
              <el-col :span="8" :offset="2">
                <el-button @click="getCode" :disabled="sec!=60">{{sec==60?'获取验证码':'剩余'+sec+'秒'}}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item prop="agree">
            <el-checkbox v-model="ruleForm.agree"></el-checkbox><span class="clause">我已阅读并同意<a
                href='javascript:void(0)'>用户协议</a>和<a href='javascript:void(0)'>隐私条款</a></span>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="btn-login" @click="doLogin('ruleForm')"
              :loading="isLoading">登录</el-button>
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
        mobile: '18801185985',
        code: '',
        agree: false
      },
      rules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          { len: 11, message: '请输入11位手机号码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '请输入6位验证码', trigger: 'blur' }
        ],
        agree: [{ pattern: /true/, message: '请勾选同意', trigger: 'change' }]
      },
      //验证码倒计时的初始值
      sec: 60,

      //登录加载
      isLoading: false
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
      //element表单全验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          //登录按钮切换成登录状态
          this.isLoading = true
          this.$axios
            .post('http://ttapi.research.itcast.cn/mp/v1_0/authorizations', {
              mobile: this.ruleForm.mobile,
              code: this.ruleForm.code
            })
            .then(res => {
              if (res.data.data) {
                //将登录成功的信息存入到sessionstorage中
                //将用户信息转换成jison对象  sessionstorage只能存储字符串
                let infoStr = JSON.stringify(res.data.data)
                window.sessionStorage.setItem('userInfo', infoStr)
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
              //清除登录按钮的登录中状态
              this.isLoading = false
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
    width: 450px;
    // height: 400px;
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
      .demo-ruleForm {
        .clause {
          margin-left: 10px;
          color: #999;
          font-size: 14px;
          margin-bottom: 10px;
          a {
            color: #3296fa;
          }
        }
        .btn-login {
          width: 100%;
        }
      }
    }
  }
}
</style>