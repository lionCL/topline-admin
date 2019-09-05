<template>
  <div class="content">
    <!-- 删选条件区域 -->
    <el-card class="top-card">
      <div slot="header"
           class="clearfix">
        <span>全部图文</span>
      </div>
      <!-- form表单 -->
      <el-form ref="searchForm">
        <el-form-item label="文章状态:">
          <!-- 接口文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部 -->
          <el-radio-group v-model="searchForm.status">
            <el-radio label="">全部</el-radio>
            <el-radio label="0">草稿</el-radio>
            <el-radio label="1">待审核</el-radio>
            <el-radio label="2">审核通过</el-radio>
            <el-radio label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道列表:">
          <el-select placeholder="请选择"
                     v-model="searchForm.channel_id">
            <el-option label="所有频道"
                       value=""></el-option>
            <el-option :label="item.name"
                       :value="item.id"
                       v-for="item in channels"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间选择:">
          <el-date-picker v-model="searchForm.date"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd">
            <!-- 设置时间格式 -->
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
                     round
                     @click="doSearch">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table表格部分 -->
    <el-card class="bottom-card">
      <div slot="header"
           class="clearfix">
        <span>共找到<b>{{total}}</b>条符合条件的内容</span>
      </div>
      <el-table :data="tableData"
                v-loading="isLoading"
                style="width: 100%">
        <el-table-column prop="cover.images[0]"
                         label="封面"
                         width="120">
          <!--表格默认渲染的数值只能是字符串 -->
          <template slot-scope="scope">
            <img :src="scope.row.cover.images[0]"
                 alt=""
                 width="50px">
          </template>
        </el-table-column>
        <el-table-column prop="title"
                         label="标题">
        </el-table-column>
        <el-table-column prop="status"
                         label="状态"
                         width="120">
          <template slot-scope="scope">
            <el-tag>{{scope.row.status | filterStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate"
                         label="发布时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary"
                       plain
                       size="small">修改</el-button>
            <el-button type="danger"
                       plain
                       size="small"
                       @click="doDel(scope.row.id)">删除</el-button>
            <!-- scope.row是这一行的数据信息 -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination @current-change="handleCurrentChange"
                     :current-page="1"
                     :page-size="10"
                     layout="total, prev, pager, next"
                     :total="total"
                     background
                     :disabled="isLoading">
      </el-pagination>

    </el-card>
  </div>

</template>

<script>
import { setTimeout } from 'timers'
export default {
  name: 'articleList',
  data() {
    return {
      //加载动画
      isLoading: false,
      //form表单数据
      searchForm: {
        status: '',
        channel_id: '',
        date: ''
      },
      //存储table表单数据
      tableData: [],
      //信息总条数
      total: 0,
      //频道列表
      channels: []
    }
  },

  created() {
    // //发送请求获取文章列表详情
    // this.$axios
    //   .get('/mp/v1_0/articles', {
    //     params: {
    //       page: 1
    //     }
    //   })
    //   .then(res => {
    //     this.tableData = res.data.data.results
    //     this.total = res.data.data.total_count
    //     //关闭动画
    //     this.isLoading = false
    //   })
    this.getPageData(1)

    //频道列表请求
    this.$axios.get('/mp/v1_0/channels').then(res => {
      this.channels = res.data.data.channels
    })
  },

  methods: {
    //分页点击切换
    handleCurrentChange(page) {
      this.getPageData(page)
    },
    //筛选功能
    doSearch() {
      // 根据删选条件获取数据
      this.getPageData(1)
    },
    //删除功能
    doDel(id) {
      //删除接口文档需要的是文章id 由于js大数据有丢失精度的问题 所有我们需要处理一下
      //用JSON-BingInt插件处理js大数字精度丢失问题
      //在请求响应回来的原始数据阶段来处理
      // console.log(id.toString())
      const newId = id.toString()
      // console.log(newId)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

        .then(() => {
          //确认删除后 发送请求
          this.$axios.delete(`/mp/v1_0/articles/${newId}`).then(res => {
            // window.console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })

            // this.$router.push('/home')
            // debugger

            this.getPageData(1)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //封装请求内容列表完整函数函数
    getPageData(page) {
      //发送请求时候加载动画
      this.isLoading = true
      //接口文档中status和channel_id 不传值的话 为全部  当status为undefined时 请求文件就不会添加status 设置为空不行
      // 数组元素不存在的时候 取下标 返回值为undefined
      let status =
        this.searchForm.status === '' ? undefined : this.searchForm.status
      let channel_id =
        this.searchForm.channel_id === ''
          ? undefined
          : this.searchForm.channel_id
      this.$axios
        .get('/mp/v1_0/articles', {
          params: {
            status,
            channel_id,
            begin_pubdate: this.searchForm.date[0],
            end_pubdate: this.searchForm.date[1],
            page: page
          }
        })
        .then(res => {
          // window.console.log(res)
          this.tableData = res.data.data.results
          this.total = res.data.data.total_count
          //关闭loading动画
          this.isLoading = false
        })
    }
  },
  //过滤器
  filters: {
    filterStatus(data) {
      switch (data) {
        case 0:
          return '草稿'
        case 1:
          return '待审核'
        case 2:
          return '审核通过'
        case 3:
          return '审核失败'
        case 4:
          return '已删除'

        default:
          break
      }
    }
  }
}
</script>

<style lang="less">
.content {
  .top-card {
    margin-bottom: 5px;
    span {
      font-size: 14px;
      color: #323745;
    }
  }
  .bottom-card {
    font-size: 14px;
    color: 323745;
  }
}
</style>