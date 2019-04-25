<template>
  <div id="app">
		<router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'

const UPLOAD_URL = 'https://www.cxzweb.club/api/upload'
const READ_URL = 'https://www.cxzweb.club/api/public/ppt_data/'

export default {
  name: 'app',
  data() {
	  return {
		uploadURL: null,
		readURL: null
	  }
  },
  created() {
	 
  },
  mounted() {
	  
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
		localStorage.setItem('cxzppt', stringData)
	},
	
	// 读取记录的ppt数据
	readData() {
		axios.get('http://api.cxzweb.club/data.js').then((res) => {
			let data = res.data
			this.$refs.slide.initData(data)
		})
	}
	
  }
  
}
</script>

<style>

</style>
