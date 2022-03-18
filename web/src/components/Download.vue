<template>
  <div>
    <el-main>
      <el-row>
        <el-col :span="7">
          <el-tag type="success">应用下载</el-tag>
          <br><br>
          <el-table
            :data="exe"
            border
            style="width: 100%"
            stripe>
            <el-table-column
              prop="id"
              label="编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="filename"
              label="文件名称"
              width="120">
            </el-table-column>
            <el-table-column
              prop="role"
              label="下载链接">
              <template slot-scope="scope">
                <el-button @click="exedown(scope.row.id,scope.row.filename)" type="text">点击下载</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-divider></el-divider>
        </el-col>
        <el-col :offset="1" :span="7">
          <el-tag>文献下载</el-tag>
          <br><br>
          <el-table
            :data="pdf"
            border
            style="width: 100%"
            stripe>
            <el-table-column
              prop="id"
              label="编号"
              width="150">
            </el-table-column>
            <el-table-column
              prop="filename"
              label="文献名称"
              width="150">
            </el-table-column>
            <el-table-column
              prop="role"
              label="下载链接">
              <template slot-scope="scope">
                <el-button @click="articaldown(scope.row.id,scope.row.filename)" type="text">点击下载</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-divider></el-divider>
        </el-col>
        <el-col :offset="1" :span="7">
          <el-tag type="info">规范下载</el-tag>
          <br><br>
          <el-table
            :data="other"
            border
            style="width: 100%"
            stripe>
            <el-table-column
              prop="id"
              label="编号"
              width="150">
            </el-table-column>
            <el-table-column
              prop="filename"
              label="规范名称"
              width="150">
            </el-table-column>
            <el-table-column
              prop="role"
              label="下载链接">
              <template slot-scope="scope">
                <el-button @click="otherdown(scope.row.id,scope.row.filename)" type="text">点击下载</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-divider></el-divider>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "Download",
  data(){
    return{
      exe:[],
      pdf:[],
      other:[],
    }
  },
  created() {
    this.$http.get('/api/download/all').then(
      res=>{
        if(res.data.finish){
          this.exe=res.data.data[0];
          this.pdf=res.data.data[1];
          this.other=res.data.data[2];
          console.log(res.data.data);
        }
      }
    )
  },
  methods:{
    downloadMain(url,name){
      console.log(url);
      this.$http.get(url,{responseType:'arraybuffer'}).
      then((res)=>{
        console.log(res.data);
        console.log(res.data.byteLength);
        if(res.data.byteLength>=100){
          let filename=name;
          let url=window.URL.createObjectURL(new Blob([res.data]))
          let fileLink=document.createElement('a')
          fileLink.href=url;
          fileLink.setAttribute('download',filename);
          document.body.appendChild(fileLink);
          fileLink.click();
        }else{
          this.$router.push({name:'Login'});
        }
      }).catch(e=>{})
    },
    exedown(id,name){
      this.downloadMain('/api/download/file/'+id,name);
    },
    articaldown(id,name){
      this.downloadMain('/api/download/artical/'+id,name);
    },
    otherdown(id,name){
      this.downloadMain('/api/download/other/'+id,name);
    }
  }
}
</script>

<style scoped>

</style>
