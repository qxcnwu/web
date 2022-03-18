<template>
  <div>
    <el-main>
      <el-row>
        <el-col :span="16" :offset="4">
          <el-form :model="articalid" ref="vForm" :rules="rules" label-position="left" label-width="80px"
                   size="default" @submit.native.prevent>
            <el-form-item label="文章标题" prop="文章标题" class="required label-center-align">
              <el-input v-model="articalid.title" type="text" placeholder="请输入文章标题" clearable :minlength="5"
                        :maxlength="50" :show-word-limit="true"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12" class="grid-cell">
                <el-form-item label="作者" prop="作者" class="label-center-align">
                  <el-input v-model="articalid.userid" readonly type="text" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :offset="1" :span="11" class="grid-cell">
                <el-form-item label="日期" prop="日期" class="label-center-align">
                  <el-input v-model="articalid.created" readonly type="text" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="文章描述" prop="文章描述" class="required label-center-align">
              <el-input type="textarea" v-model="articalid.description" placeholder="请输入文章描述" rows="4" :minlength="20"
                        :maxlength="400" :show-word-limit="true"></el-input>
            </el-form-item>
            <el-form-item label="权限设置" prop="权限" class="required label-center-align">
              <el-radio-group v-model="articalid.status">
                <el-radio v-for="(item, index) in 权限Options" :key="index" :label="item.value"
                          :disabled="item.disabled" style="{display: inline}">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <mavon-editor
            style="min-height: 400px"
            class="mavon"
            v-model="articalid.content"
            ref=md
            @imgAdd="$imgAdd"
            @save="saveMavon"
          >
          </mavon-editor>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "BlogEditMain",
  data(){
    return{
      seen:false,
      articalid:{
        'title':'',
        'userid':'',
        'created':'          ',
        'description':'',
        'content':'',
        'status':-1
      },
      picked: '',
      id:'',
      value:'',
      rules: {
        文章标题: [{
          required: true,
          message: '文章标题不可为空',
        }],
        文章描述: [{
          required: true,
          message: '文章描述不可为空',
        }],
        权限: [{
          required: false,
        }],
      },
      权限Options: [{
        "label": "公开",
        "value": -1
      }, {
        "label": "内部公开",
        "value": 0
      }, {
        "label": "私有",
        "value": 1
      }],
    }
  },
  mounted() {
    this.id=this.$route.params.id;
    console.log(this.id);
    if(this.id==='-1'){
      this.seen=true;
    }else{
      this.$http.post('/api/myblog/view/'+this.id).then(
        res=>{
          if(res.data.finish){
            this.articalid=res.data.data;
            this.seen=true;
          }else{
            this.$router.push({name:"wrongPage"});
          }
        }
      )
    }
  },
  methods:{
    saveMavon(value, render){
      this.content=value;
      let articalid=new FormData();
      articalid.append("title",this.articalid.title);
      articalid.append("description",this.articalid.description);
      articalid.append("content",this.articalid.content);
      articalid.append("status",this.articalid.status);
      const url=this.$route.params.id!=="-1"?'/api/myblog/edit/'+this.$route.params.id:'/api/myblog/write/';
      this.$http.post(url,articalid).then((res)=>{
        const flag=res.data.data;
        if(flag){
          this.$notify({
            title: '提示',
            message: '保存成功正在跳转'
          })
          console.log(res.data.message);
          this.$router.push({ name:'BlogShow',params:{ id: res.data.message }})
        }else{
          this.$notify({
            title: '提示',
            message: '保存失败服务器繁忙请稍后再试'
          })
        }
        this.id=res.data.message;
      })
    },
    // 绑定@imgAdd event
    $imgAdd(pos, $file){
      // 第一步.将图片上传到服务器.
      const articalid = new FormData();
      articalid.append('image', $file);
      this.$http.post('/api/myblog/upload/',articalid,{
          'Content-Type': 'multipart/form-data'
        }
      ).then((url) => {
        if(!url.data.finish){
          this.$notify({
            title: '提示',
            message: '图像上传失败请检查图像大小'
          })
        }else {
          this.$refs.md.$img2Url(pos, url.data.data);
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
