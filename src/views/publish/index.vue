<template>
  <el-card class="box-card">
    <div slot="header"
         class="clearfix">
      <span>发布文章</span>
    </div>

    <el-form ref="formData"
             :model="formData"
             label-width="100px">
      <el-form-item label="标题">
        <el-input v-model="formData.title"
                  style="width:400px"></el-input>
      </el-form-item>

      <el-form-item label="内容">

      </el-form-item>

    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'publish',
  data() {
    return {
      formData: {
        title: ''
      }
    }
  }
}
</script>

<style lang="less" socpe>
.box-card {
  .clearfix {
    span {
      font-size: 14px;
      color: #323745;
    }
  }
}
</style>