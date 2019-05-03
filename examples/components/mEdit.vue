<template>
	<div class="example__read">
		<m-edit @upload="upload"  @saveData="saveData" ref="slide"></m-edit>
	</div>
</template>

<script>
	import axios from 'axios'
	
	const UPLOAD_URL = 'https://www.cxzweb.club/api/upload'
	const READ_URL = 'https://www.cxzweb.club/api/public/ppt_data/'
	const TEST_URL = 'https://www.cxzweb.club/api/public/data2.json'
	export default {
	  name: 'app',
	  data() {
		  return {
			uploadURL: null,
			readURL: null,
			id: null,
			fileName: null
		  }
	  },
	  created() {
		  this.setFileName()
		  this.id = this.$route.params.id
		  this.uploadURL = UPLOAD_URL
		  this.readURL = READ_URL
		  this.judgeSystem()
	  },
	  mounted() {
		  this.readData()
		  
	  },
	 
	  methods:{
		judgeSystem() {
		  	if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
		  		this.$router.push('/light-show/error')
		  	}
		},
		
		
		
		setFileName() {
			const name = localStorage .getItem('LIGHT_SHOW_NAME')
			if(name){
				this.fileName = name
			}else{
				this.fileName = Math.random() + 'ppt'
				localStorage.setItem('LIGHT_SHOW_NAME', this.fileName)
			}
			
		},
		
		// 上传图片
		async upload(file) {
			this.$waiting.add()
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
			const { data } = await axios(options)
			const path = READ_URL + data.path
			this.$refs.slide.createImg(path)
		},
		
		// 存储ppt数据
		async saveData(stringData) {
			await axios.post('https://www.cxzweb.club/api/saveData', {
				content: stringData,
				id: this.fileName
			})
			// localStorage.setItem('cxzppt', stringData)
			this.$tip({content: '保存成功'})
		},
		
		// 读取记录的ppt数据
		async readData(name) {
			const { data } = await axios.post('https://www.cxzweb.club/api/getData', {
				id: this.fileName
			})
			const content = data.content
			if(content) {
				let string = content.ppt_data
				let json = string ? JSON.parse(string) : undefined
				this.$refs.slide.initData(json)
			}else{
				this.$refs.slide.initData(undefined)
			}
			const testURL = `http://192.168.1.100:8080/#/light-show/mRead/${this.fileName}`
			const url = `https://www.cxzweb.club/#/light-show/mRead/${this.fileName}`
			this.$refs.slide.getCode(testURL)
		}
			
	  }
	  
	}
</script>

<style scoped>
	.example__read {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}
</style>
