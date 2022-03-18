<template>
  <div>
    <el-main>
      <el-row>
        <el-col>
          <el-button type="primary" icon="el-icon-edit" size="small" @click="write">创建博客</el-button>
          <br><br>
          <el-table
            :data="articals"
            border
            style="width: 100%"
            stripe>
            <el-table-column
              prop="id"
              label="文章索引"
              width="120"
              sortable>
            </el-table-column>
            <el-table-column
              prop="title"
              label="文章标题"
              width="300">
            </el-table-column>
            <el-table-column
              prop="description"
              label="文章描述"
              width="400">
            </el-table-column>
            <el-table-column
              prop="userid"
              label="作者"
              sortable
              width="120">
            </el-table-column>
            <el-table-column
              prop="created"
              label="修改日期"
              sortable
              width="300">
            </el-table-column>
            <el-table-column
              prop="role"
              label="详情">
              <template slot-scope="scope">
                <el-button @click="read(scope.row.id)" type="text">点击查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-divider></el-divider>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="6" :span="16">
          <div class="block">
            <el-pagination
              style="width: 300px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-sizes="[10,20,50,100]"
              :page-size="20"
              layout="total, sizes, prev, pager, next, jumper"
              :total="maxnum"
              background>
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "BlogView",
  data(){
    return{
      num:20,
      page:1,
      articals:[],
      maxnum:200,
    }
  },
  created() {
    //生成过程中开始加载
    this.getAllBlog(this.num,this.page);
    this.changePage();
  },
  methods:{
    handleSizeChange(val) {
      this.num=val;
      this.getAllBlog(this.num,this.page);
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.page=val;
      this.getAllBlog(this.num,this.page);
      console.log(`当前页: ${val}`);
    },
    nextPage(num_){
      this.page+=num_;
      this.maxbtn = this.page < this.maxPage;
      this.minbtn = this.page > this.minPage;
      this.getAllBlog(this.num,this.page)
    },
    getAllBlog(num,page){
      this.changePage();
      this.$http.get('/api/blog/all/'+num+'/'+page).then(
        res=>{
          if(res.data.length===0){
            //跳转登录
            this.$router.push({name:'Login'});
          }else{
            this.articals=res.data.data;
          }
        }
      ).catch(error=>{
        this.$notify({
          title: '提示',
          message: '请先登录'
        })
        this.$router.push({name:'Login'});
      });
    },
    read(id){
      this.$router.push({ name:'BlogShow',params:{ id: id }})
    },
    changePage(){
      this.$http.post('/api/blog/allnum').then(
        res=>{
          if(res.data.finish){
            this.maxnum=parseInt(res.data.data);
          }
        });
    },
    write(){
      this.$router.push({ name:'BlogEditMain',params:{ id:'-1'}})
    }
  }
}
</script>

<style scoped>

</style>
