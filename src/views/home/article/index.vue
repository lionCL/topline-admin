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
          <el-radio-group v-model="searchForm.status">
            <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道列表:">
          <el-select placeholder="请选择"
                     v-model="searchForm.channel">
            <el-option label="web前端"
                       value=""></el-option>
            <el-option label="java"
                       value="java"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间选择:">
          <el-date-picker v-model="searchForm.date"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table表格部分 -->
    <el-card class="bottom-card">
      <div slot="header"
           class="clearfix">
        <span>共找到{{total}}条符合条件的内容</span>
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
                       size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
  </div>

</template>


<script>
export default {
  name: 'my-article',
  data() {
    return {
      //加载动画
      isLoading: false,
      //form表单数据
      searchForm: {
        status: '全部',
        channel: '',
        date: ''
      },
      //存储table表单数据
      tableData: [],
      //信息总条数
      total: ''
    }
  },

  created() {
    this.isLoading = true
    //发送请求获取文章列表详情
    this.$axios.get('/mp/v1_0/articles').then(res => {
      this.tableData = res.data.data.results
      this.total = res.data.data.total_count
      //关闭动画
      this.isLoading = false
    })
  },

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