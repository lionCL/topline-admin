<template>
  <el-card class="box-card">
    <div slot="header"
         class="clearfix">
      <span>发布文章</span>
    </div>

    <el-form ref="formData"
             :model="formData"
             label-width="80px"
             :rules="rules"
             v-loading="isloading">

      <el-form-item label="标题"
                    prop="title">
        <el-input v-model="formData.title"
                  style="width:400px"
                  placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="内容">
        <quillEditor v-model="formData.content"
                     :options="editorOption"></quillEditor>
      </el-form-item>

      <el-form-item label="封面">
      </el-form-item>

      <el-form-item label="频道">
        <channelTool v-model="formData.channel_id"></channelTool>
      </el-form-item>
      <!-- 分割线 -->
      <el-divider></el-divider>

      <el-form-item>
        <el-button type="primary"
                   size="small">草稿</el-button>
        <el-button type="primary"
                   size="small"
                   @click="doPublish('formData')">发布文章...</el-button>
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

import channelTool from '../../components/channelTool/'

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
      },
      //表单验证规则
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' },
          {
            min: 5,
            max: 30,
            message: '标题必须长度在5到30个字以内',
            trigger: 'blur'
          }
        ]
      },

      //加载动画
      isloading: false
    }
  },
  //子组件
  components: {
    quillEditor,
    channelTool
  },

  methods: {
    doPublish(formName) {
      this.$refs[formName].validate(valid => {
        // 做整个表单的验证
        if (valid) {
          if (this.$route.name == 'publish-edit') {
            //发送修改文章请求
            this.$axios
              .put(`/mp/v1_0/articles/${this.$route.params.id}`, {
                title: this.formData.title,
                content: this.formData.content,
                cover: {
                  type: 1,
                  images: [
                    'http://toutiao.meiduo.site/Fjl26KTE9-NFfkRzIZOner4yeqGl'
                  ]
                },
                channel_id: this.formData.channel_id
              })
              .then(res => {
                if (res.data.message.toLowerCase() == 'ok') {
                  this.$message.success('文章修改成功!!!')
                  this.$router.push('/article')
                }
              })
          } else {
            // 发请求去做新增
            this.$axios
              .post('/mp/v1_0/articles', {
                title: this.formData.title,
                content: this.formData.content,
                cover: {
                  type: 1,
                  images: [
                    'http://toutiao.meiduo.site/Fjl26KTE9-NFfkRzIZOner4yeqGl'
                  ]
                },
                channel_id: this.formData.channel_id
              })
              .then(res => {
                if (res.data.message.toLowerCase() == 'ok') {
                  this.$message.success('文章发布成功！')
                  this.$router.push('/article')
                }
              })
          }
        } else {
          return false
        }
      })
    }
  },

  created() {
    //根据动态路由获取id渲染 发送请求获取指定文章内容
    if (this.$route.name == 'publish-edit') {
      this.isloading = true
      this.$axios
        .get(`/mp/v1_0/articles/${this.$route.params.id}`)
        .then(res => {
          // window.console.log(res)
          if (res.data.message.toLowerCase() == 'ok') {
            this.formData = res.data.data
            this.isloading = false
          }
        })
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

  .ql-editor {
    height: 400px;
  }
}
</style>