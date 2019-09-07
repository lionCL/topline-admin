<template>
  <div>
    <el-table :data="tableData"
              style="width: 100%"
              v-loading="isloading">
      <el-table-column prop="title"
                       label="标题"
                       width="600px">
      </el-table-column>
      <el-table-column prop="comment_status"
                       label="评论状态"
                       width="100px">
        <!--获取当行的数据 -->
        <template slot-scope="scope">
          {{scope.row.comment_status?'正常':'关闭'}}
        </template>
      </el-table-column>
      <el-table-column prop="total_comment_count"
                       label="总评论数"
                       width="120px">
      </el-table-column>
      <el-table-column prop="fans_comment_count"
                       label="粉丝评论数"
                       width="120px">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.comment_status"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     @change="doChange(scope.row)">
          </el-switch>
          <el-divider direction="vertical"></el-divider>
          <el-button type="primary"
                     size="mini"
                     plain>修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="page"
                   :page-sizes="[10, 20, 30, 40,50]"
                   :page-size="per_page"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total"
                   background
                   :disabled="isloading">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'comment',
  data() {
    return {
      tableData: [],
      total: 0,
      page: 1,
      per_page: 10,
      isloading: false
    }
  },
  created() {
    this.loadData()
    //发送请求
  },

  methods: {
    doChange(row) {
      this.$axios
        .put(`/mp/v1_0/comments/status?article_id=${row.id}`, {
          allow_comment: row.comment_status
        })
        .then(res => {
          // console.log(res)
          this.$message.success('修改成功')
        })
    },
    //页容量改变事件
    handleSizeChange(val) {
      // console.log(val)
      this.per_page = val
      this.loadData()
    },
    //页码改变事件
    handleCurrentChange(val) {
      // console.log(val)
      this.page = val
      this.loadData()
    },
    //封装获取评论函数
    loadData() {
      //开启动画
      this.isloading = true
      this.$axios
        .get('/mp/v1_0/articles', {
          params: {
            page: this.page,
            response_type: 'comment',
            per_page: this.per_page
          }
        })
        .then(res => {
          this.tableData = res.data.data.results
          this.total = res.data.data.total_count
          //关闭动画
          this.isloading = false
        })
    }
  }
}
</script>

<style>
</style>