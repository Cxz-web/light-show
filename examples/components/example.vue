<template>
  <div class="index animated bounce">
    <div class="index__title">
      <span v-for="item in title" :key="item" class="title__world">{{ item }}</span>
    </div>

    <div class="index__desc">一个Vue框架下的的PPT编辑器和阅读器</div>
    <div class="index__desc">来一起看看效果吧!!</div>

    <div class="github">
      <git-hub @openGitHub="openGitHub" />
    </div>

    <div class="index__icon" />

    <div class="title__start animated rubberBand" @click="goRead">start</div>
  </div>
</template>

<script>
import GitHub from './githubBtn.vue'
export default {

  components: {
    GitHub
  },
  data() {
    return {
      title: 'light-show'
    }
  },
  methods: {
    openGitHub(url) {
      window.open(url)
    },
    goRead() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
	.index{
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 4000;
		background-image: linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.index__title{
		height: 100px;
		font-size: 81px;
		display: flex;
		font-weight: bold;
		padding-top: 46px;
		margin-bottom: 20px;
	}
	.title__world{
		margin-right: 7px;
	}
	.title__world:first-child {
		transform: rotateZ(-10deg);
		color: #fd3500;
	}
	.title__world:nth-child(2) {
		transform: rotateZ(5deg);
		color: #f59a24;
	}
	.title__world:nth-child(3) {
		transform: rotateZ(5deg);
		color: limegreen;
	}
	.title__world:nth-child(4) {
		transform: rotateZ(-5deg);
		color: #6f8c53;
	}
	.title__world:nth-child(5) {
		transform: rotateZ(-5deg);
		color: #6f8c53;
	}
	.title__world:nth-child(6) {
		transform: rotateZ(5deg);
		color: #ffc0cb;
	}
	.title__world:nth-child(7) {
		transform: rotateZ(-5deg);
		color: white;
	}
	.title__world:nth-child(8) {
		transform: rotateZ(5deg);
		color: hotpink;
	}
	.title__world:nth-child(9) {
		transform: rotateZ(-5deg);
		color: orangered;
	}
	.title__world:nth-child(10) {
		transform: rotateZ(10deg);
		color: purple;
	}

	.index__desc{
		color: white;
		font-size: 40px;
		margin-top: 50px;
		font-family: cursive;
	}

	.github{
		margin-top: 80px;
		margin-bottom: 10px;
	}

	.index__icon {
		background-image: url(../assets/starTag.svg);
		width: 200px;
		height:200px;
		background-size: contain;
		position: absolute;
		bottom: -40px;
		right: -40px;
		transform: rotateZ(30deg);
	}

	.title__start{
		color: white;
		font-size: 90px;
		margin-top: 50px;
		font-family: fantasy;
		letter-spacing: 10px;
		user-select:none;
		cursor: pointer;
		animation-iteration-count: infinite;
		animation-duration: 3s;
	}
</style>
