<template>
  <div class="error">
    <p class="error__title">对不起,</p>
    <p class="error__title">暂时仅支持PC端编辑PPT。</p>
  </div>
</template>

<script>
export default {
  created() {
    this.judgeSystem()
  },
  methods: {
    judgeSystem() {
      if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) return
      this.$router.push('/light-show/read')
    }
  }
}
</script>

<style scoped>
	.error{
		width: 100%;
		height: 100%;
		display: flex;
		box-sizing: border-box;
		padding-top: 100px;
		align-items: center;
		background-image: linear-gradient( 135deg, #81FFEF 10%, #F067B4 100%);
		flex-direction: column;
	}
	.error__title{
		color: white;
		font-size: 20px;
		margin: 0px;
		padding: 0px;
		margin-bottom: 20px;
		letter-spacing: 1px;
		font-weight: bold;
	}
</style>
