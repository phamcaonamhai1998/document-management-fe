import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import DashboardView from '../views/dashboard/DashboardView.vue'
import ProceduresView from '../views/procedures/ProcedureView.vue'
import ProcedureDetailView from '../views/procedures/ProcedureDetailView.vue'
import UsersView from '../views/users/UsersView.vue'
import DocumentsView from '../views/documents/DocumentsView.vue'
import UserDetailView from '../views/users/UserDetailView.vue'
import DocumentDetailView from '../views/documents/DocumentDetailView.vue'
import SignaturesView from '../views/signatures/SignaturesView.vue'
import SignatureDetailView from '../views/signatures/SignatureDetailView.vue'
import LoginView from '../views/auth/LoginView.vue'
import RolesView from '../views/roles/RolesView.vue'
import RoleDetailView from '../views/roles/RoleDetailView.vue'
import OrganizationsViewVue from '../views/organizations/OrganizationsView.vue'
import OrganizationDetailViewVue from '../views/organizations/OrganizationDetailView.vue'
import DepartmentsViewVue from '../views/departments/DepartmentsView.vue'
import DepartmentDetailViewVue from '../views/departments/DepartmentDetailView.vue'
import { TOKEN_KEY } from '../constants/index.constant'
import PublicDocumentView from '../views/public-documents/PublicDocumentView.vue'
import PublicDocumentDetailView from '../views/public-documents/PublicDocumentDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainView,
      children: [
        // Dashboard
        {
          path: '/',
          name: 'dashboard',
          component: DashboardView
        },
        // Organizations
        {
          path: '/organizations',
          name: 'organizations',
          component: OrganizationsViewVue
        },
        {
          path: '/organizations/create',
          name: 'Create Organization Page',
          component: OrganizationDetailViewVue
        },
        {
          path: '/organizations/edit/:id',
          name: 'Edit Organization Page',
          component: OrganizationDetailViewVue
        },

        //Departments
        {
          path: '/departments',
          name: 'departments',
          component: DepartmentsViewVue
        },
        {
          path: '/departments/create',
          name: 'Create Department Page',
          component: DepartmentDetailViewVue
        },
        {
          path: '/departments/edit/:id',
          name: 'Edit Department Page',
          component: DepartmentDetailViewVue
        },

        // Procedures
        {
          path: '/procedures',
          name: 'procedures',
          component: ProceduresView
        },
        {
          path: '/procedures/create',
          name: 'Create Procedure Page',
          component: ProcedureDetailView
        },
        {
          path: '/procedures/edit/:id',
          name: 'Edit Procedure Page',
          component: ProcedureDetailView
        },

        //Roles
        {
          path: '/roles',
          name: 'roles',
          component: RolesView
        },
        {
          path: '/roles/create',
          name: 'Create Role Page',
          component: RoleDetailView
        },
        {
          path: '/roles/edit/:id',
          name: 'Edit Role Page',
          component: RoleDetailView
        },

        // Users
        {
          path: '/users',
          name: 'users',
          component: UsersView
        },
        {
          path: '/users/create',
          name: 'Create User Page',
          component: UserDetailView
        },
        {
          path: '/users/edit/:id',
          name: 'Edit User Page',
          component: UserDetailView
        },

        // Documents
        {
          path: '/documents',
          name: 'documents',
          component: DocumentsView
        },
        {
          path: '/documents/create',
          name: 'Create Document Page',
          component: DocumentDetailView
        },
        {
          path: '/documents/edit/:id',
          name: 'Edit Document Page',
          component: DocumentDetailView
        },

        // Signatures
        {
          path: '/signatures',
          name: 'signatures',
          component: SignaturesView
        },
        {
          path: '/signatures/create',
          name: 'Create Signature',
          component: SignatureDetailView
        },

        //Public Documents
        {
          path: '/public-documents',
          name: 'Public Documents',
          component: PublicDocumentView
        },
        {
          path: '/public-documents/detail/:id',
          name: 'Detail Public Document Page',
          component: PublicDocumentDetailView
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

export default router

router.beforeEach((to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem(TOKEN_KEY)
  // const token = localStorage.getItem(TOKEN_KEY)
  // const decodeToken: any = token && jwt_decode(token)

  if (authRequired && !loggedIn) {
    return next('/login')
  }
  next()
})
