<template>
  <div>
    <el-main>
      <el-row>
        <el-carousel :interval="4000" type="card" height="300px">
          <el-carousel-item v-for="item in 6" :key="item">
            <h3 class="medium" style="text-align:center;">{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
      </el-row>
      <br>
      <el-row>
        <el-col span="6" style="text-align: center;margin:0px auto;">
          <el-avatar :size="150" style="margin: 0 auto;font-size: 300%;"> 快速 </el-avatar>
          <div style="text-align: center">The translation of the corresponding feature function is added here, which is no more than five lines, and the page will not fall or rise</div>
        </el-col>
        <el-col span="6" style="text-align: center;margin:0px auto;">
          <el-avatar :size="150" style="margin: 0 auto;font-size: 300%;"> 高效 </el-avatar>
          <div style="text-align: center">The translation of the corresponding feature function is added here, which is no more than five lines, and the page will not fall or rise</div>
        </el-col>
        <el-col span="6" style="text-align: center;margin:0px auto;">
          <el-avatar :size="150" style="margin: 0 auto; font-size: 300%;"> 准确 </el-avatar>
          <div style="text-align: center">The translation of the corresponding feature function is added here, which is no more than five lines, and the page will not fall or rise</div>
        </el-col>
        <el-col span="6" style="text-align: center;margin:0px auto;">
          <el-avatar :size="150" style="margin: 0 auto;font-size: 300%;"> 易用 </el-avatar>
          <div style="text-align: center">The translation of the corresponding feature function is added here, which is no more than five lines, and the page will not fall or rise</div>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "homeindex",
  methods:{
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
