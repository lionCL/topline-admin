<template>
  <el-card class="box-card">
    <div slot="header"
         class="clearfix">
      <span>发布文章</span>
    </div>
    <el-form ref="formData"
             :model="formData"
             label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="formData.title"
                  style="width:400px"></el-input>
      </el-form-item>

      <el-form-item label="内容">
        <quillEditor v-model="formData.content"
                     :options="editorOption"></quillEditor>
      </el-form-item>

      <el-form-item label="封面">
      </el-form-item>

      <el-form-item label="频道">

      </el-form-item>
      <!-- 分割线 -->
      <el-divider></el-divider>

      <el-form-item>
        <el-button type="primary"
                   size="small">草稿</el-button>
        <el-button type="primary"
                   size="small">发布文章...</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
// 富文本导包
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'publish',
  data() {
    return {
      //表单数据
      formData: {
        title: '',
        content: ''
      },
      //富文本参数配置
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block'],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
            [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
            [{ direction: 'rtl' }], // text direction

            [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],
            ['clean'], // remove formatting button
            ['image'],
            ['video'],
            ['link']
          ]
        }
      }
    }
  },
  components: {
    quillEditor
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

  .ql-editor {
    height: 400px;
  }
}
</style>