<template>
  <el-card class="box-card">
    <div slot="header"
         class="clearfix">
      <span>图片管理</span>
    </div>
    <!-- button按钮样式 -->
    <el-radio-group v-model="menu"
                    size="medium"
                    @change="changeMenu">
      <el-radio-button label="全部"></el-radio-button>
      <el-radio-button label="收藏"></el-radio-button>
    </el-radio-group>
    <!-- Upload上传 -->
    <el-upload class="upload-demo"
               action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
               :show-file-list='false'
               style="float:right"
               name="image"
               :headers='header'
               :on-success="doSuccess">
      <!-- 使用自带的上传请求功能 -->
      <el-button size="medium"
                 type="primary">上传图片</el-button>
    </el-upload>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <!-- 图像素材列表 -->
    <el-row :gutter="20"
            v-loading="isLoading">
      <el-col :span="4"
              v-for="item in imgList"
              :key="item.id"
              class="my_col">
        <el-card :body-style="{ padding: '0px' }">
          <!-- 图像素材展示区 -->
          <div class="imgWarp">
            <img :src="item.url"
                 class="image">
          </div>
          <!-- 下面的字体图标 -->
          <div class="icon_bottom">
            <el-tooltip content="收藏"
                        placement="top">
              <el-button :class="item.is_collected? 'el-icon-star-on':'el-icon-star-off'"
                         type="text"
                         @click="doSave(item)">
              </el-button>
            </el-tooltip>
            <!-- 分割线 -->
            <el-divider direction="vertical"></el-divider>
            <el-tooltip content="删除"
                        placement="top">
              <el-button type="text"
                         class="el-icon-delete"
                         @click="doDel(item)">
              </el-button>
            </el-tooltip>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 分页器 -->
    <el-pagination :current-page="1"
                   :page-size="12"
                   layout="total, prev, pager, next"
                   :total="total"
                   background
                   @current-change="handleCurrentChange"
                   :disabled="isLoading"
                   class="paginationBar">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: 'material',
  data() {
    return {
      //绑定的菜单
      menu: '全部',
      //图像素材数组
      imgList: [],
      // 上传图像请求头
      header: {
        Authorization: `Bearer ${
          JSON.parse(window.sessionStorage.getItem('userInfo')).token
        }`
      },
      //动画开关
      isLoading: false,
      //总页数
      total: 0
    }
  },

  methods: {
    //点击菜单事件
    changeMenu() {
      this.loadData()
    },
    //upload默认上传成功的钩子函数
    doSuccess(res) {
      this.$message.success('提交成功')
      this.loadData()
    },
    //收藏事件
    doSave(item) {
      // 直接改变图标的显示改变图标的显示  避免发送多次请求
      item.is_collected = !item.is_collected

      this.$axios
        .put(`/mp/v1_0/user/images/${item.id}`, {
          collect: item.is_collected
        })
        .then(res => {
          if (res.data.message.toLowerCase() == 'ok') {
            if (item.is_collected) {
              this.$message.success('收藏成功')
            } else {
              this.$message.success('取消收藏成功')
            }
          }
        })
    },
    //删除图像
    doDel(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.delete(`/mp/v1_0/user/images/${item.id}`).then(res => {
            // console.log(res)
            if (res.status == 204) {
              this.loadData()
            }
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //页码改变事件
    handleCurrentChange(page) {
      this.loadData(page)
    },
    //封装获取用户图片素材的函数
    // es6语法可以设置默认值
    loadData(page = 1) {
      this.isLoading = true
      this.$axios
        .get('/mp/v1_0/user/images', {
          params: {
            page,
            per_page: 12,
            // 菜单等于收藏就要查收藏，也就是结果要传true
            // 菜单不等于收藏就要查全部，也就是结果要传false
            collect: this.menu == '收藏'
          }
        })
        .then(res => {
          this.imgList = res.data.data.results

          this.total = res.data.data.total_count

          this.isLoading = false
        })
    }
  },
  created() {
    // 一进到页面发送请求
    this.loadData()
  }
}
</script>

<style lang='less' scoped>
.my_col {
  margin-bottom: 30px;

  .imgWarp {
    height: 180px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .icon_bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f4f5f6;
    font-size: 18px;
  }
}
.paginationBar {
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>