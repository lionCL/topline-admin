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
    </el-upload>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <!-- 图像素材列表 -->
    <el-row :gutter="20"
            v-loading="isLoading">
      <el-col :span="6"
              v-for="item in imgList"
              :key="item.id"
              class="my_col">
        <el-card :body-style="{ padding: '0px' }">
          <!-- 图像素材展示区 -->
          <div class="imgWarp"
               :class="{checked:item.id==currentId}"
               @click="chose(item)">
            <img :src="item.url"
                 class="image"
                 style="max-width:100%; max-height:100%">
          </div>
          <!-- 下面的字体图标 -->
          <!-- <div class="icon_bottom">
            <el-tooltip content="收藏"
                        placement="top">
              <el-button :class="item.is_collected? 'el-icon-star-on':'el-icon-star-off'"
                         type="text"
                         @click="doSave(item)">
              </el-button>
            </el-tooltip> -->
          <!-- 分割线 -->
          <!-- <el-divider direction="vertical"></el-divider>
            <el-tooltip content="删除"
                        placement="top">
              <el-button type="text"
                         class="el-icon-delete"
                         @click="doDel(item)">
              </el-button>
            </el-tooltip> -->
          <!-- </div> -->
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
  name: 'media',
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
      total: 0,

      //保存当前被点击的图片
      currentId: ''
    }
  },

  methods: {
    chose(item) {
      //点击谁,就把谁的图片保存起来
      this.currentId = item.id
      //把图片路径传递给父组件
      this.$emit('checked', item.url)
    },

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
    position: relative;
    cursor: pointer;
  }

  .imgWarp.checked {
    &:before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      /* 如果要全部透明就用opacity，但是如果仅仅只是背景颜色透明，那么就给背景颜色加rgba颜色 */
      background-color: rgba(0, 0, 0, 0.3);
      background-image: url(data:image/png;base64,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);
      background-repeat: no-repeat;
      background-position: right top;
      background-size: 40px;
    }
  }
}
.paginationBar {
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>