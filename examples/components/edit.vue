<template>
  <div class="example__read">
    <edit-slide ref="slide" @upload="upload" @saveData="saveData" />
  </div>
</template>

<script>
import axios from 'axios'

const UPLOAD_URL = 'https://www.cxzweb.club/api/upload'
const READ_URL = 'https://www.cxzweb.club/api/public/ppt_data/'
// const TEST_URL = 'https://www.cxzweb.club/api/public/data2.json'
export default {
  name: 'App',
  data() {
    return {
      uploadURL: null,
      readURL: null
    }
  },
  created() {
    this.uploadURL = UPLOAD_URL
    this.readURL = READ_URL
    this.judgeSystem()
  },
  mounted() {
    this.readData()
  },

  methods: {
    judgeSystem() {
      if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
        this.$router.push('/light-show/error')
      }
    },
    // 上传图片
    async upload(file) {
      this.$waiting.add()
      const options = {
        url: UPLOAD_URL,
        method: 'post',
        headers: {
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
    saveData(stringData) {
      localStorage.setItem('cxzppt', stringData)
      this.$tip({ content: '保存成功' })
    },

    // 读取记录的ppt数据
    readData() {
      const data = localStorage.getItem('cxzppt')
      const json = data ? JSON.parse(data) : undefined
      this.$refs.slide.initData(json)
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
