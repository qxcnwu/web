<template>
  <div>
    <router-link :to="{name:'homeindex'}">
      <a href="#">Home</a>
    </router-link>
    <div>logout</div>
    <button @click="send">登出</button>
    <div typeof="text">{{wrongmessage}}</div>
  </div>

</template>

<script>
export default {
  name: "Logout",
  data(){
    return {
      wrongmessage:'',
    }
  },
  methods:{
    send() {
      this.$http.get('/api/user/logout').then((res)=>{
        const temp = res.data.finish;
        //未登陆成功则刷新页面重新登录
        if(temp){
          this.$router.push({name:'homeindex'});
        } else{
          this.$router.push({name:'Login'});
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
