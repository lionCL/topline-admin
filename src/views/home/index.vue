<template>
  <!-- home主页 -->
  <el-container class="my-home">
    <!-- 第一部分侧栏部分 -->
    <el-aside width="200px"
              class="my-aside">
      <el-container class="my-aside-container">
        <el-header class="asideHeader">
          <img src="./imgs/home_logo.png"
               alt="">
        </el-header>

        <el-main class="asideMean">
          <!-- navmenu导航栏 -->
          <el-menu :default-active="$route.path"
                   class="el-menu-vertical-demo"
                   background-color="#353b4e"
                   text-color="#ADAFB5"
                   :unique-opened="true"
                   :router="true">

            <el-menu-item index="1">
              <i class="el-icon-house"></i><span slot="title">首页</span>
            </el-menu-item>

            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-menu"></i><span>内容管理</span>
              </template>
              <el-menu-item index="/publish">发布文章</el-menu-item>
              <el-menu-item index="/article">内容列表</el-menu-item>
              <el-menu-item index="2-3">评论列表</el-menu-item>
              <el-menu-item index="2-4">素材管理</el-menu-item>
            </el-submenu>

            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-chat-line-round"></i><span>粉丝管理</span>
              </template>
              <el-menu-item index="3-1">图文管理</el-menu-item>
              <el-menu-item index="3-2">粉丝概况</el-menu-item>
              <el-menu-item index="3-3">粉丝画像</el-menu-item>
              <el-menu-item index="3-4">粉丝列表</el-menu-item>
            </el-submenu>

            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">账户信息</span>
            </el-menu-item>

          </el-menu>
        </el-main>
      </el-container>
    </el-aside>
    <!-- 第一部分右边 -->
    <el-main class="my-main">
      <el-container>
        <!-- 头部用户信息展示 -->
        <el-header class="my-header">
          <el-row class="nav">
            <el-col :span="12">
              <span class="header-title">XXXX科技股份有限公司</span>
            </el-col>

            <el-col :span="8"
                    :offset="4">
              <el-input placeholder="搜索"
                        class="search-bar"
                        size="small">
                <i slot="prefix"
                   class="el-input__icon el-icon-search"></i>
              </el-input>
              <span class="mseeage">消息</span>
              <!-- 下拉菜单 -->
              <el-dropdown trigger="click"
                           @command="handleCommand">
                <span class="el-dropdown-link">
                  <img :src="userPhoto"
                       alt="">
                  {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-s-custom"
                                    command="userMessage">个人信息
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-link"
                                    command="gitAddress">git地址
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-switch-button"
                                    divided
                                    command="logout">退出
                  </el-dropdown-item>
                </el-dropdown-menu>

              </el-dropdown>
            </el-col>
          </el-row>
        </el-header>
        <!-- 内容显示区域 -->
        <el-main class="content">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      //登录界面获取的用户信息列表
      userName: '',
      userPhoto: ''
    }
  },
  //最早可以拿到数据的钩子函数
  created() {
    //获取等登录存储的用户信息 渲染到home界面对应的位置.
    let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    // window.console.log(userInfo)
    this.userName = userInfo.name
    this.userPhoto = userInfo.photo
  },
  methods: {
    handleCommand(cmd) {
      //下拉菜单事件
      if (cmd == 'logout') {
        window.sessionStorage.clear()
        this.$router.push('/login')
      } else if (cmd == 'gitAddress') {
        window.open('https://github.com/')
      }
    }
  }
}
</script>

<style lang="less">
.my-home {
  height: 100%;
  .my-aside {
    height: 100%;
    background-color: #323745;
    .my-aside-container {
      width: 100%;
      .asideHeader {
        line-height: 60px;
        img {
          width: 120px;
        }
      }

      .asideMean {
        width: 100%;
        // height: 100%;
        overflow: hidden;
        padding: 0px;

        .el-menu-vertical-demo {
          width: 100%;
        }
      }
    }
  }

  .my-main {
    height: 100%;
    padding: 0;

    .my-header {
      height: 100%;
      background-color: #fff;
      .nav {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .search-bar {
          width: 200px;
          margin-right: 15px;
        }
        .mseeage {
          font-size: 16px;
          color: #2c3e50;
        }
        .el-dropdown-link {
          cursor: pointer;
        }
        .header-title {
          font-size: 18px;
          color: #2c3e50;
        }
      }
      img {
        width: 30px;
        border-radius: 50%;
        margin: 0 10px;
      }
    }

    .content {
      padding: 5px;
    }
  }
}
</style>

