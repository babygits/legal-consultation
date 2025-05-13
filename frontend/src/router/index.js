import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import UserManage from '../views/admin/UserManage.vue'
import CaseManage from '../views/admin/CaseManage.vue'
import AdminCaseDetail from '../views/admin/AdminCaseDetail.vue'
import LawyerApprovals from '../views/admin/LawyerApprovals.vue'
import FeedbackList from '../views/admin/FeedbackList.vue'
import ConsultManage from '../views/admin/ConsultManage.vue'
import AdminConsultDetail from '../views/admin/AdminConsultDetail.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import UserLayout from '../layouts/UserLayout.vue'
import Home from '../views/user/Home.vue'
import AIConsult from '../views/user/AIConsult.vue'
import Lawyer from '../views/user/Lawyer.vue'
import UserCaseManage from '../views/user/CaseManage.vue'
import Info from '../views/user/profile/Info.vue'
import Records from '../views/user/profile/Records.vue'
import LawyerDetail from '../views/user/LawyerDetail.vue'
import Reserve from '../views/user/Reserve.vue'
import ChangePassword from '../views/user/profile/ChangePassword.vue'
import VoucherCenter from '../views/user/profile/VoucherCenter.vue'
import ConsultChat from '../views/user/ConsultChat.vue'
import UserCaseList from '../views/user/UserCaseList.vue'
import UserCaseDetail from '../views/user/UserCaseDetail.vue'
import ConsultList from '../views/user/ConsultList.vue'
import LawyerLayout from '../layouts/LawyerLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import LawyerHome from '../views/lawyer/Home.vue'
import LawyerCaseList from '../views/lawyer/LawyerCaseList.vue'
import LawyerCaseReply from '../views/lawyer/LawyerCaseReply.vue'
import LawyerVerify from '../views/lawyer/LawyerVerify.vue'
import LawyerConsultList from '../views/lawyer/LawyerConsultList.vue'
import LawyerConsultDetail from '../views/lawyer/LawyerConsultDetail.vue'
import LawyerCaseDetail from '../views/lawyer/LawyerCaseDetail.vue'
import LawyerProfile from '../views/user/profile/Info.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'users', component: UserManage },
      { path: 'lawyers', component: LawyerApprovals },
      { path: 'cases', component: CaseManage },
      { path: 'cases/:id', component: AdminCaseDetail },
      { path: 'consults', component: ConsultManage },
      { path: 'consults/:id', component: AdminConsultDetail },
      { path: 'feedback', component: FeedbackList }
    ]
  },
  {
    path: '/user',
    component: UserLayout,
    children: [
      { path: '', redirect: '/user/home' },
      { path: 'home', component: Home },
      { path: 'consult', component: AIConsult },
      { path: 'consult-list/:id', component: ConsultChat },
      { path: 'consult-list', component: ConsultList },
      { path: 'lawyer', component: Lawyer },
      { path: 'cases', component: UserCaseList },
      { path: 'cases/:id', component: UserCaseDetail },
      { path: 'lawyer/:id', component: LawyerDetail },
      { path: 'reserve/:id', component: Reserve },
      {
        path: 'profile',
        children: [
          { path: 'info', component: Info },
          { path: 'change-password', component: ChangePassword },
          { path: 'records', component: Records },
          { path: 'voucher-center', component: VoucherCenter },
        ]
      }
    ]
  },
  {
    path: '/lawyer',
    component: LawyerLayout,
    children: [
      { path: '', redirect: '/lawyer/home' },
      { path: 'home', component: LawyerHome },
      { path: 'consults', component: LawyerConsultList },
      { path: 'consults/:id', component: LawyerConsultDetail },
      { path: 'cases', component: LawyerCaseList },
      { path: 'cases/:id', component: LawyerCaseDetail },
      { path: 'verify', component: LawyerVerify },

      { path: 'income/overview', component: () => import('../views/lawyer/income/IncomeOverview.vue') },
      { path: 'income/details', component: () => import('../views/lawyer/income/IncomeDetails.vue') },
      { path: 'income/withdraw', component: () => import('../views/lawyer/income/IncomeWithdraw.vue') },
      { path: 'income/withdrawals', component: () => import('../views/lawyer/income/WithdrawalList.vue') },

      { path: 'profile', component: LawyerProfile },
      { path: 'change-pwd', component: ChangePassword },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
