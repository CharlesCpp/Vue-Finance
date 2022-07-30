import { supabase } from './../supabase';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Shares',
      component: () => import('../views/Shares.vue'!)
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue'!)
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Auth.vue'!)
    },
  ]
})

router.beforeEach((to, from, next) => {
  if(supabase.auth.user()) {
    next('/login');
  }
})
export default router
