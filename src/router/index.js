import { createRouter, createWebHistory } from 'vue-router'
import Hw from '../components/HelloWorld.vue'
import KevinComponent from '../components/KevinComponent'

const routes = [
    {
        path: '/',
        component: Hw
    },
    {
        path: '/kevin',
        component: KevinComponent
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router