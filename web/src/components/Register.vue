<template>
  <div>
    <el-main>
      <el-row>
        <el-col :offset="6" :span="12">
          <el-form :model="formData" ref="vForm" :rules="rules" label-position="left" label-width="80px"
                   size="default" @submit.native.prevent>
            <el-form-item label="用户名" prop="用户名" class="required label-center-align">
              <el-input v-model="formData.用户名" type="text" placeholder="请输入用户名" clearable :minlength="6"
                        :maxlength="12" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="密码" class="required label-center-align">
              <el-input v-model="formData.密码" type="text" placeholder="请输入密码" clearable :minlength="6"
                        :maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="确认密码" class="required label-center-align">
              <el-input v-model="formData.确认密码" type="text" placeholder="请确认密码" clearable :minlength="6"
                        :maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="电子邮箱" class="required label-center-align">
              <el-input v-model="formData.电子邮箱" type="text" placeholder="请输入电子邮箱" clearable></el-input>
            </el-form-item>
            <el-form-item label="电话号码" prop="电话号码" class="required label-center-align">
              <el-input v-model="formData.电话号码" type="text" placeholder="请输入电话号码" clearable></el-input>
            </el-form-item>
            <el-form-item label="工作地点" prop="工作地点" class="required label-center-align">
              <el-input v-model="formData.工作地点" type="text" placeholder="请输入工作地点" clearable :minlength="10"
                        :maxlength="50" show-word-limit></el-input>
            </el-form-item>
            <el-form-item style="width:40%;margin-bottom:20px;" label="职业" prop="select85714" class="required label-center-align" size="medium">
              <el-select v-model="formData.select85714" class="full-width-input" clearable automatic-dropdown
                         placeholder="请选择职业">
                <el-option v-for="(item, index) in select85714Options" :key="index" :label="item.value"
                           :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="人机验证" prop="人机验证" class="required label-center-align">
              <el-col>
                <Verify :bar-size="{width:'100%',height:'40px'}" @success="alertok(true)" @error="alertok(false)" :type="3" :showButton="false"></Verify>
              </el-col>
            </el-form-item>
          </el-form>
          <el-button style="width:50%;margin-bottom:15px;" type="primary" size="medium" @click="send">注册</el-button>
          <br>
          <router-link :to="{name:'Login'}" style="text-decoration:none">
            <a href="#" style="text-decoration:none">已有账号 立即登录</a>
          </router-link>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import Verify from 'vue2-verify'
export default {
  name: "Register",
  data() {
    return {
      formData: {
        用户名: "",
        密码: "",
        确认密码: "",
        电子邮箱: "",
        电话号码: "",
        select85714: "",
        工作地点: "",
      },
      rules: {
        用户名: [{
          required: true,
          message: '用户名不可为空',
        }],
        密码: [{
          required: true,
          message: '密码不可为空',
        }],
        确认密码: [{
          required: true,
          message: '确认密码不可为空',
        }],
        电子邮箱: [{
          required: true,
          message: '电子邮箱不可为空',
        }, {
          pattern: /^([-_A-Za-z0-9.]+)@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/,
          trigger: ['blur', 'change'],
          message: '电子邮箱格式错误'
        }],
        电话号码: [{
          required: true,
          message: '电话号码不可为空',
        }, {
          pattern: /^[1][3-9][0-9]{9}$/,
          trigger: ['blur', 'change'],
          message: '电话号码格式错误'
        }],
        select85714: [{
          required: true,
          message: '请选择身份',
        }],
        工作地点: [{
          required: true,
          message: '工作地点不可为空',
        }],
      },
      select85714Options: [{
        "label": "1",
        "value": "学生"
      }, {
        "label": "2",
        "value": "教师"
      }, {
        "label": "3",
        "value": "研究人员"
      }, {
        "label": "4",
        "value": "其他"
      }],
      human:false,
    }
  },
  methods:{
    async send(){
      if(this.checkForm()) {
        // 异步等待用户名验证消息
        const hasName = await this.checkName();
        if (!hasName) {
          let formdata = new FormData();
          formdata.append("username", this.formData.用户名)
          formdata.append("password", this.formData.密码)
          formdata.append("email", this.formData.电子邮箱)
          formdata.append("phone", this.formData.电话号码)
          formdata.append("occupation", this.formData.select85714)
          formdata.append("place", this.formData.工作地点)
          this.$http.post('/api/user/register/', formdata).then((res) => {
            console.log(res.data);
            const flag = res.data.finish;
            if (flag) {
              this.$notify({
                title: '提示',
                message: "激活邮件已经发送到" + this.formData.电子邮箱
              })
              this.$router.push({name: 'homeindex'});
            } else {
              this.$notify({
                title: '提示',
                message: "注册失败请稍后再试"
              })
            }
          })
        } else {
          this.$notify({
            title: '提示',
            message: "用户名已经存在"
          })
        }
      }
    },
    async checkName() {
      let hasName = false;
      await this.$http.get('/api/user/nameExist/', {
        params: {
          name: this.formData.用户名
        }
      }).then(res=>{
        hasName=res.data.data;
      })
      return hasName;
    },
    checkForm(){
      if(this.human==false){
        this.$notify({
          title: '提示',
          message: "请先进行人机验证"
        })
        return false;
      }
      if(this.formData.用户名!==""&&this.formData.密码!==""&&this.formData.电话号码!==""&&
        this.formData.电子邮箱!==""&&this.formData.select85714!==""&&this.formData.工作地点!==""
        ){
      }else{
        this.$notify({
          title: '提示',
          message: "缺少必填字段"
        })
        return false;
      }
      if(this.formData.密码!==this.formData.确认密码){
        this.$notify({
          title: '提示',
          message: "确认密码与原始密码不一致"
        })
        return false;
      }else{
      }
      return true;
    },
    alertok(text) {
      this.human=text;
    },
    showButton(){
      return false;
    }
  },
  components: {
    Verify
  }
}
</script>

