import { supabase } from './../supabase';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Shares',
      component: () => import('../views/Shares.vue'!),
      meta: {
        requireAuth: true,
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue'!),
      meta: {
        requireAuth: true,
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Auth.vue'!)
    },
    {
      path: '/buy',
      name: 'Buy Shares',
      component: () => import('../views/BuyShares.vue'!),
      meta: {
        requireAuth: true,
      }
    },
  ]
})

function delay() {
  return new Promise(resolve => setTimeout(resolve, 500));
}

router.beforeEach( (to, from, next) => {
  const requireAuth = to.matched.some(record => record.meta.requireAuth);
  const isAuth = supabase.auth.user();
  if (requireAuth && !isAuth) {
    delay().then(() => next('/login'));
  } else {
    next();
  }
})


export default router
