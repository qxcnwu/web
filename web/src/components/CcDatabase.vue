<template>
  <el-container>
    <el-aside width="500px">
      <el-row>
        <el-col :offset="2" :span="20">
          <el-form :model="formData" ref="vForm" :rules="rules" label-position="left" label-width="80px"
                   size="default" @submit.native.prevent>
            <el-form-item label="时间范围" prop="date" class="required label-center-align">
              <el-date-picker
                v-model="formData.date[0]"
                type="date"
                value-format='yyyy-MM-dd'
                placeholder="开始日期"
                :picker-options="pickerOptions0">
              </el-date-picker>
              <el-date-picker
                v-model="formData.date[1]"
                type="date"
                value-format='yyyy-MM-dd'
                placeholder="结束日期"
                :picker-options="pickerOptions1">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="参数" prop="prop" class="required label-center-align">
              <el-checkbox-group v-model="formData.prop">
                <el-checkbox v-for="(item, index) in propOptions" :key="index" :label="item.value"
                             :disabled="item.disabled" style="{display: inline}">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="getAnswer">点击获取</el-button>
          <el-button type="primary" @click="gettxt">下载结果</el-button>
        </el-col>
      </el-row>
    </el-aside>
    <el-main>
      <el-table
        :data="answer.slice(0,100)"
        border
        style="width: 100%"
        stripe>
        <el-table-column
          prop="name"
          label="传感器名称"
          sortable>
        </el-table-column>
        <el-table-column
          prop="date"
          label="日期"
          width="100">
        </el-table-column>
        <el-table-column
          prop="data.r"
          label="红波段"
          width="100">
        </el-table-column>
        <el-table-column
          prop="data.g"
          label="绿波段"
          width="100">
        </el-table-column>
        <el-table-column
          prop="data.b"
          label="蓝波段"
          width="100">
        </el-table-column>
        <el-table-column
          prop="data.nir"
          label="近红外波段"
          width="100">
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>

</template>

<script>
export default {
  name: "CcDatabase",
  data(){
    return{
      formData: {
        date: ['',''],
        prop: [],
      },
      rules: {
        date: [{
          required: true,
          message: '日期不可为空',
        }],
        prop: [{
          required: true,
          message: '属性不可为空',
        }],
      },
      propOptions: [],
      answer:[],
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.formData.date[1] !== "") {
            return time.getTime() > new Date(this.formData.date[0]).getTime();
          } else {
            return false;
          }
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          if (this.formData.date[0] !== "") {
            return time.getTime() < new Date(this.formData.date[0]).getTime();
          } else {
            return false;
          }
        }
      },
    }
  },
  created() {
    this.$http.post('/api/data/ccall').then(res=>{
      if(res.data.finish){
        console.log(res.data);
        for(let i=0;i<res.data.data.length;i++){
          this.propOptions.push({
            "label": res.data.data[i].sensorname,
            "value": res.data.data[i].sensorname
          })
        }
      }
    })
  },
  methods: {
    getDateList() {
      let start = this.formData.date[0];
      let end = this.formData.date[1];
      let lists = [];
      const startDate = this.getDayIndex(new Date(start));
      const endDate = this.getDayIndex(new Date(end));
      const startYear = new Date(start).getFullYear();
      const endYear = new Date(end).getFullYear();
      let startday = 1;
      let endday = 366;
      const zeros = ['00', '0', ''];
      for (let i = startYear; i <= endYear; i++) {
        endday = i % 4 === 0 ? 366 : 365;
        startday = 1;
        if (i === startYear) {
          startday = startDate;
        }
        if (i === endYear) {
          endday = endDate;
        }
        for (let j = startday; j <= endday; j++) {
          lists.push(i + "" + zeros[Math.floor(Math.log10(j))] + j);
        }
      }
      return lists;
    },
    getDayIndex(date) {
      return Math.ceil((date - new Date(date.getFullYear().toString())) / (24 * 60 * 60 * 1000)) + 1;
    },
    getAnswer() {
      const list = this.getDateList();
      const submit = [];
      submit.push({
        "name": this.formData.prop,
        "date": list,
      })
      this.$http.post('/api/data/cc/', submit, {
        'Content-Type': 'application/json',
      }).then(res => {
        //解析
        const temp = res.data.data[0];
        const name = temp.name;

        for (let j = 0; j < name.length; j++) {
          const a = name[j];
          for (let i = 0; i < temp.date.length; i++) {
            this.answer.push({
              'name': a,
              'date': temp.date[i],
              'data': temp.map[a][i]
            })
          }
        }
        if (this.answer.length >= 100) {
          this.$notify({
            title: '提示',
            message: '请求数据大于100为提高响应速度只显示前100条'
          })
        }
      })
    },
    gettxt() {
      const FileSaver = require('file-saver');
      const content = JSON.stringify(this.answer);
      const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "answer.json");
    },
  }
}
</script>

<style scoped>

</style>
