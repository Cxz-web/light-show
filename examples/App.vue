<template>
  <div id="app">
		<edit-slide @upload="upload"  @saveData="saveData" ref="slide"></edit-slide>
  </div>
</template>

<script>
import axios from 'axios'

const UPLOAD_URL = 'http://127.0.0.1:7001/upload'
const READ_URL = 'http://127.0.0.1:7001/public/ppt_data/'

export default {
  name: 'app',
  data() {
	  return {
		uploadURL: null,
		readURL: null
	  }
  },
  created() {
	  this.uploadURL = UPLOAD_URL
	  this.readURL = READ_URL
  },
  
  methods:{
	// 上传图片
	async upload(file, type) {
		const options = {
			url: UPLOAD_URL,
			method: 'post',
			headers:{
				'Content-Type': 'multipart/form-data'
			},
			onUploadProgress: function(progressEvent) {
				console.log(progressEvent)
			},
			data: file
		}
		const {data} = await axios(options)
		const path = READ_URL + data.path
		if(type === 'img') {
			this.$refs.slide.createImgDom(path)
		}else if(type === 'bacImg') {
			this.$refs.slide.createBacImgDom(path)
		}
		
	},
	
	// 存储ppt数据
	saveData(stringData) {
		console.log(123)
		localStorage.setItem('cxzppt', stringData)
	},
	
	// 读取记录的ppt数据
	readData() {
		localStorage.getItem('cxzppt')
		
	}
	
  }
  
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */

body, html {
	padding: 0px;
	margin: 0px;
	width: 100%;
	height: 100%;
}

#app{
	width: 100%;
	height: 100%;
}


</style>
