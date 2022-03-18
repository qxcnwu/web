<template>
  <div>
    <el-main>
      <el-col :span="16" :offset="4">
        <el-form :model="articalid" ref="vForm" label-position="left" label-width="80px"
                 size="default" @submit.native.prevent>
          <el-form-item label="文章标题" prop="文章标题" class="label-center-align">
            <el-input v-model="articalid.title" readonly type="text" placeholder="请输入文章标题" :minlength="5"
                      :maxlength="50" :show-word-limit="true"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12" class="grid-cell">
              <el-form-item label="作者" prop="作者" class="label-center-align">
                <el-input v-model="articalid.userid" readonly type="text"></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="11" class="grid-cell">
              <el-form-item label="日期" prop="日期" class="label-center-align">
                <el-input v-model="articalid.created" readonly type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="文章描述" prop="文章描述" class="required label-center-align">
            <el-input type="textarea" v-model="articalid.description" readonly placeholder="请输入文章描述" rows="4"
                      :minlength="20" :maxlength="400" :show-word-limit="true"></el-input>
          </el-form-item>
          <el-form-item class="required label-center-align">
            <div class="static-content-item">
              <div v-html="articalid.content" class="markdown-body" style="text-align:left;width:90%;margin-bottom:50px"></div>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-main>
  </div>
</template>

<script>
import {marked} from 'marked'
export default {
  name: "BlogShow",
  data(){
    return{
      seen:false,
      articalid:{
        'title':'',
        'userid':'',
        'created':'          ',
        'description':'',
        'content':'',
      },
    }
  },
  mounted() {
    this.articalid=this.$route.params.id;
    this.$http.get('/api/blog/view/'+this.articalid).then(
      res=>{
        if(res.data.finish){
          this.articalid=res.data.data;
          this.seen=true;
          this.articalid.content=marked(this.articalid.content);
        }else{
          this.$router.push({name:"wrongPage"});
        }
      }
    ).catch(error=>{
      this.$router.push({name:"wrongPage"});
    });
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = 'https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css'
    document.head.appendChild(link);
  },
  methods:{

  }
}
</script>

<style scoped>

</style>
