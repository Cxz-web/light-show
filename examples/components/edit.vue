<template>
	<div class="example__read">
		<edit-slide @upload="upload"  @saveData="saveData" ref="slide"></edit-slide>
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
			readURL: null
		  }
	  },
	  created() {
		  this.uploadURL = UPLOAD_URL
		  this.readURL = READ_URL
	  },
	  mounted() {
		  this.readData()		  
	  },
	 
	  methods:{
		// 上传图片
		async upload(file, type) {
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
			const {data} = await axios(options)
			const path = READ_URL + data.path
			if(type === 'img') {
				this.$refs.slide.createImgDom(path)
			}else if(type === 'bacImg') {
				this.$refs.slide.createBacImgDom(path)
			}
			this.$waiting.close()
			
		},
		
		// 存储ppt数据
		saveData(stringData) {
			localStorage.setItem('cxzppt', stringData)
			this.$tip({content: '保存成功'})
		},
		
		// 读取记录的ppt数据
		readData() {
			let data = localStorage.getItem('cxzppt')
			let json = data ? JSON.parse(data) : undefined
			this.$refs.slide.initData(json)
			// axios.get(TEST_URL).then((res) => {
			// 	this.$refs.slide.initData(res.data)
			// })
			
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
