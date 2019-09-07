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
                   size="small"
                   @click="doDrafts('formData')">草稿</el-button>
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
//导入频道组件
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
      //旧数据
      oldFormData: {},
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
    //发布功能
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
    },
    //草稿功能
    doDrafts(formName) {
      this.$refs[formName].validate(valid => {
        // 做整个表单的验证
        if (valid) {
          // 发请求去做新增
          this.$axios
            .post('/mp/v1_0/articles?draft=true', {
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
                this.$message.success('草稿发布成功！')
                this.$router.push('/article')
              }
            })
        } else {
          return false
        }
      })
    },
    //获取指定文章函数封装
    loadData() {
      this.isloading = true
      this.$axios
        .get(`/mp/v1_0/articles/${this.$route.params.id}`)
        .then(res => {
          // window.console.log(res)
          if (res.data.message.toLowerCase() == 'ok') {
            this.formData = res.data.data

            //获取表单的每个属性的值
            this.oldFormData = { ...this.formData }

            this.isloading = false
          }
        })
    }
  },

  created() {
    //根据动态路由获取id渲染 发送请求获取指定文章内容
    if (this.$route.name == 'publish-edit') {
      this.loadData()
    }
  },
  //组件内守卫
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用   可以访问组件实例 `this`

    //判断原来的内容和当前表单内容是否一样，一样代表没改过，就直接放行
    if (this.$route.name == 'publish-edit') {
      if (
        this.formData.title == this.oldFormData.title &&
        this.formData.content == this.oldFormData.content
      ) {
        return next()
      }
    } else {
      //新增内容是否为空
      if (this.formData.title == '' && this.formData.content == '') {
        return next()
      }
    }
    //数据有变动 询问用户是否离开
    this.$confirm('当前页面有未保存的内容, 是否退出?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        //点击确认后放行
        next()
      })
      .catch(() => {})
  },

  //监控路由地址id是否发生变化
  watch: {
    // 参数是变化后的值
    '$route.params.id'(value) {
      if (value) {
        this.loadData()
      } else {
        // 如果值没有变,清空列表
        this.formData.title = ''
        this.formData.content = ''
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

  .ql-editor {
    height: 400px;
  }
}
</style>