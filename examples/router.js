import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			redirect: '/light-show/read'
		},
		{
			path: '/light-show/edit',
			component: () => import('./components/edit.vue')
		}, 
		{
			path: '/light-show/read',
			component: () => import('./components/read.vue')
		},	
		{
			path: '/light-show/error',
			component: () => import('./components/error.vue')
		},
		{
			path: '/light-show/mEdit',
			component: () => import('./components/mEdit.vue')
		},
		{
			path: '/light-show/mRead/:id',
			component: () => import('./components/mRead.vue')
		}
	]
})

