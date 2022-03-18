<template>
  <div>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="5">
            <br><br>
            <el-tag
              :key="index"
              v-for="(tag,index) in pointList"
              closable
              :disable-transitions="false"
              @close="tagClose(pointList[index])">
              经度：{{pointList[index].lng}} 纬度：{{pointList[index].lat}}
            </el-tag>
            <br><br>
            <el-form :model="formData" ref="vForm" :rules="rules" label-position="left" label-width="80px"
                     size="small" @submit.native.prevent>
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
              <el-form-item label="参数" prop="prop" class="label-center-align">
                <el-checkbox-group v-model="formData.prop">
                  <el-checkbox v-for="(item, index) in propOptions" :key="index" :label="item.value"
                               :disabled="item.disabled" style="{display: inline}">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="getAnswer">点击获取</el-button>
            <el-button type="primary" @click="gettxt">点击下载结果</el-button>
          </el-col>
          <el-col :offset="1" :span="18">
            <baidu-map :center="center" :minZoom="minzoom" :maxZoom="maxzoom" @ready="handler" style="height:400px" @click="getClickInfo" @dblclick="getClickInfo" :scroll-wheel-zoom='true'>
              <bm-marker :position="{lng: model.lng, lat: model.lat}"/>
            </baidu-map>
          </el-col>
        </el-row>
        <br><br>
        <el-row>
          <el-divider></el-divider>
          <el-col :span="20" :offset="2">
            <el-table
              :data="answer.slice(0,100)"
              border
              style="width: 100%"
              stripe>
              <el-table-column
                prop="lon"
                label="经度"
                width="100"
                sortable>
              </el-table-column>
              <el-table-column
                prop="lat"
                label="纬度"
                width="100">
              </el-table-column>
              <el-table-column
                prop="date"
                label="日期"
                width="100">
              </el-table-column>
              <el-table-column
                prop="AOD"
                label="AOD"
                width="500"
                sortable>
              </el-table-column>
              <el-table-column
                prop="Water"
                label="Water"
                sortable>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {BaiduMap, BmControl, BmView, BmAutoComplete, BmLocalSearch, BmMarker} from 'vue-baidu-map'
export default {
  name: "DataBase",
  components: {
    BaiduMap,
    BmControl,
    BmView,
    BmAutoComplete,
    BmLocalSearch,
    BmMarker
  },
  data: function () {
    return {
      value:'',
      answer:[],
      dateList:[],
      loadingMap: true,
      BMap: '',
      map: '',
      showMap: false,
      pointLngLat: '',
      center: { lng: 109.45744048529967, lat: 36.49771311230842 },
      minzoom: 5,
      maxzoom:9,
      pointList:[],
      model: {
        lng: '',
        lat: '',
        row:'',
        col:'',
        id:'',
      },
      id:0,
      formData: {
        date: ['',''],
        prop: ["AOD", "Water"],
      },
      rules: {
        date: [{
          required: true,
          message: '字段值不可为空',
        }],
      },
      propOptions: [{
        "label": "AOD",
        "value": "AOD"
      },{
        "label": "Water",
        "value": "Water"
      }],
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
  methods: {
    tagClose(tag){
      var alllayer=this.map.getOverlays();
      for(let i=0;i<alllayer.length;i++){
        if(alllayer[i].id===tag.id){
          this.map.removeOverlay(alllayer[i]);
          break;
        }
      }
      for(let i=0;i<this.pointList.length;i++){
        if(this.pointList[i].id===tag.id){
          this.pointList.splice(i,1);
          break;
        }
      }
    },
    getClickInfo (e) {
      this.center = {lng: e.point.lng, lat: e.point.lat}
      this.pointLngLat = {lng: e.point.lng, lat: e.point.lat}
      var marker = new BMap.Marker(this.pointLngLat) // 创建标注
      this.map.addOverlay(marker) // 将标注添加到地图中
      marker.id=this.id;
      this.pointList.push({
        lng: e.point.lng,
        lat: e.point.lat,
        row: this.getlineLat(e.point.lat),
        col: this.getlineLon(e.point.lng),
        id: this.id,
      })
      this.id+=1;
    },
    getlineLon(point){
      return Math.round(point-73)*10;
    },
    getlineLat(point){
      return Math.round(point-18)*10;
    },
    getDateList(){
      let start=this.formData.date[0];
      let end=this.formData.date[1];
      let lists = [];
      const startDate = this.getDayIndex(new Date(start));
      const endDate = this.getDayIndex(new Date(end));
      const startYear=new Date(start).getFullYear();
      const endYear=new Date(end).getFullYear();
      let startday=1;
      let endday=366;
      const zeros=['00','0',''];
      for (let i=startYear; i<=endYear; i++){
        endday=i%4===0?366:365;
        startday=1;
        if(i===startYear){
          startday=startDate;
        }
        if(i===endYear){
          endday=endDate;
        }
        for (let j=startday;j<=endday;j++){
          lists.push(i+""+zeros[Math.floor(Math.log10(j))]+j);
        }
      }
      return lists;
    },
    getDayIndex(date){
      return Math.ceil(( date - new Date(date.getFullYear().toString()))/(24*60*60*1000))+1;
    },
    getAnswer(){
      const list=this.getDateList();
      const submit=[];
      for(let i=0;i<this.pointList.length;i++){
        submit.push({
          'row':this.pointList[i].row,
          'col':this.pointList[i].col,
          'propNames':this.formData.prop,
          'dates':list,
        });
      }
      this.$http.post('/api/data/meta/',submit,{
        'Content-Type':'application/json',
      }).then(res=> {
        const temp = res.data.data;
        for (let i = 0; i < temp.length; i++) {
          const point = temp[i];
          for (let k = 0; k < point.dates.length; k++) {
            this.answer.push({
              'lon': point.col/10+73,
              'lat': point.row/10+18,
              'date': point.dates[k],
              'AOD': point.answerMap['AOD'][k],
              'Water': point.answerMap['Water'][k],
            })
          }
        }

        if(this.answer.length>=100){
          this.$notify({
            title: '提示',
            message: '请求数据大于100为提高响应速度只显示前100条'
          })
        }
      })
    },
    handler ({BMap, map}) {
      this.mapOpen()
      this.BMap = BMap
      this.map = map
      this.loadingMap = true
      var geolocation = new BMap.Geolocation()
      var $this = this
      // 调用百度地图api 中的获取当前位置接口
      geolocation.getCurrentPosition(function (r) {
        let myGeo = new BMap.Geocoder()
        myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function (result) {
          if (result) {
            $this.loadingMap = false
            $this.$set($this, 'pointLngLat', {lng: result.point.lng, lat: result.point.lat})
            map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放,默认关闭
            $this.addPoint({BMap, map})
          }
        })
      })
    },
    addPoint ({BMap, map}) {
      map.clearOverlays()
      var point = new BMap.Point(this.pointLngLat.lng, this.pointLngLat.lat)
      let zoom = map.getZoom()
      setTimeout(() => {
        map.centerAndZoom(point, zoom)
      }, 0)
      var marker = new BMap.Marker(point) // 创建标注
      map.addOverlay(marker) // 将标注添加到地图中
    },
    mapOpen () {
      this.top = this.getScrollTop()
      if (this.top) {
        this.setScrollTop(0)
      }
    },
    getScrollTop () {
      let scrollTop = 0
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
      } else if (document.body) {
        scrollTop = document.body.scrollTop
      }
      return scrollTop
    },
    setScrollTop (top) {
      if (!isNaN(top)) {
        if (document.documentElement && document.documentElement.scrollTop !== undefined) {
          document.documentElement.scrollTop = top
        } else if (document.body) {
          document.body.scrollTop = top
        }
      }
    },
    gettxt(){
      var FileSaver = require('file-saver');
      var content = JSON.stringify(this.answer);
      var blob = new Blob([content ], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "answer.json");
    }
  }
}
</script>

<style scoped>

</style>
