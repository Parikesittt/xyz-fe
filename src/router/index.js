import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth";


import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/dashboard/Dashboard.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/admin',
        name: 'Admin',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect:'/admin/user',
        children: [
          {
            path: '/admin/role',
            name: 'Role',
            component: () => import('@/views/admin/role/Index.vue')
          },
          {
            path: '/admin/role/create',
            name: 'Create Role',
            component: () => import('@/views/admin/role/Detail.vue')
          },
          {
            path: '/admin/role/edit/:id',
            name: 'Edit Role',
            component: () => import('@/views/admin/role/Detail.vue')
          },
        ]
      },
      {
        path: '/master',
        name: 'Master',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/base/breadcrumbs',
        children: [
          {
            path: '/master/company',
            name: 'Company',
            component: () => import('@/views/master/company/Index.vue'),
          },
          {
            path: '/master/company/create',
            name: 'Create Company',
            component: () => import('@/views/master/company/Detail.vue'),
          },
          {
            path: '/master/company/edit/:id',
            name: 'Edit Company',
            component: () => import('@/views/master/company/Detail.vue'),
          },
          {
            path: '/master/city',
            name: 'City',
            component: () => import('@/views/master/city/Index.vue'),
          },
          {
            path: '/master/city/create',
            name: 'Create City',
            component: () => import('@/views/master/city/Detail.vue'),
          },
          {
            path: '/master/city/update/:id',
            name: 'Edit City',
            component: () => import('@/views/master/city/Detail.vue'),
          },
          {
            path: '/master/location',
            name: 'Location',
            component: () => import('@/views/master/location/Index.vue'),
          },
          {
            path: '/master/location/create',
            name: 'Create Location',
            component: () => import('@/views/master/location/Detail.vue'),
          },
          {
            path: '/master/location/update/:id',
            name: 'Edit Location',
            component: () => import('@/views/master/location/Detail.vue'),
          },
          {
            path: '/master/branch',
            name: 'Branch',
            component: () => import('@/views/master/branch/Index.vue'),
          },
          {
            path: '/master/branch/create',
            name: 'Create Branch',
            component: () => import('@/views/master/branch/Detail.vue'),
          },
          {
            path: '/master/branch/update/:id',
            name: 'Edit Branch',
            component: () => import('@/views/master/branch/Detail.vue'),
          },
          {
            path: '/master/warehouse',
            name: 'Warehouse',
            component: () => import('@/views/master/warehouse/Index.vue'),
          },
          {
            path: '/master/warehouse/create',
            name: 'Create Warehouse',
            component: () => import('@/views/master/warehouse/Detail.vue'),
          },
          {
            path: '/master/warehouse/update/:id',
            name: 'Edit Warehouse',
            component: () => import('@/views/master/warehouse/Detail.vue'),
          },
          {
            path: '/master/item',
            name: 'Item',
            component: () => import('@/views/master/item/Index.vue'),
          },
          {
            path: '/master/item/create',
            name: 'Create Item',
            component: () => import('@/views/master/item/Create.vue'),
          },
          {
            path: '/master/item/update/:id',
            name: 'Edit Item',
            component: () => import('@/views/master/item/Detail.vue'),
          },
          {
            path: '/master/item/upload/new',
            name: 'Upload Item',
            component: () => import('@/views/master/item/uploadItem.vue'),
          },
          {
            path: '/master/item_subcategory',
            name: 'Item Category',
            component: () => import('@/views/master/item_subcategory/Index.vue'),
          },
          {
            path: '/master/item_subcategory/create',
            name: 'Create Item Category',
            component: () => import('@/views/master/item_subcategory/Detail.vue'),
          },
          {
            path: '/master/item_subcategory/update/:id',
            name: 'Edit Item Category',
            component: () => import('@/views/master/item_subcategory/Detail.vue'),
          },
          {
            path: '/master/item_super_group',
            name: 'Item Super Group',
            component: () => import('@/views/master/item_super_group/Index.vue'),
          },
          {
            path: '/master/item_super_group/create',
            name: 'Create Item Super Group',
            component: () => import('@/views/master/item_super_group/Detail.vue'),
          },
          {
            path: '/master/item_super_group/edit/:id',
            name: 'Edit Item Super Group',
            component: () => import('@/views/master/item_super_group/Detail.vue'),
          },
          {
            path: '/master/item_group',
            name: 'Item Group',
            component: () => import('@/views/master/item_group/Index.vue'),
          },
          {
            path: '/master/item_group/create',
            name: 'Create Item Group',
            component: () => import('@/views/master/item_group/Detail.vue'),
          },
          {
            path: '/master/item_group/update/:id',
            name: 'Edit Item Group',
            component: () => import('@/views/master/item_group/Detail.vue'),
          },
          {
            path: '/master/subcategory',
            name: 'Item Subgroup',
            component: () => import('@/views/master/item_subgroup/Index.vue'),
          },
          {
            path: '/master/subcategory/create',
            name: 'Create Item Subgroup',
            component: () => import('@/views/master/item_subgroup/Detail.vue'),
          },
          {
            path: '/master/subcategory/update/:id',
            name: 'Edit Item Subgroup',
            component: () => import('@/views/master/item_subgroup/Detail.vue'),
          },
          {
            path: '/master/customer',
            name: 'Customer',
            component: () => import('@/views/master/customer/Index.vue'),
          },
          {
            path: '/master/customer/create',
            name: 'Create Customer',
            component: () => import('@/views/master/customer/Detail.vue'),
          },
          {
            path: '/master/customer/update/:id',
            name: 'Edit Customer',
            component: () => import('@/views/master/customer/Detail.vue'),
          },
          {
            path: '/master/vendor',
            name: 'Vendor',
            component: () => import('@/views/master/vendor/Index.vue'),
          },
          {
            path: '/master/vendor/create',
            name: 'Create Vendor',
            component: () => import('@/views/master/vendor/Detail.vue'),
          },
          {
            path: '/master/vendor/update/:id',
            name: 'Edit Vendor',
            component: () => import('@/views/master/vendor/Detail.vue'),
          },
          {
            path: '/master/unit',
            name: 'Unit',
            component: () => import('@/views/master/unit/Index.vue'),
          },
          {
            path: '/master/unit/create',
            name: 'Create Unit',
            component: () => import('@/views/master/unit/Detail.vue'),
          },
          {
            path: '/master/unit/update/:id',
            name: 'Edit Unit',
            component: () => import('@/views/master/unit/Detail.vue'),
          },
          {
            path: '/master/bankaccount',
            name: 'Bank Account',
            component: () => import('@/views/master/bankaccount/Index.vue'),
          },
          {
            path: '/master/bankaccount/create',
            name: 'Create Bank Account',
            component: () => import('@/views/master/bankaccount/Detail.vue'),
          },
          {
            path: '/master/bankaccount/update/:id',
            name: 'Edit Bank Account',
            component: () => import('@/views/master/bankaccount/Detail.vue'),
          },
          {
            path: '/master/technician',
            name: 'Technician',
            component: () => import('@/views/master/technician/Index.vue'),
          },
          {
            path: '/master/technician/create',
            name: 'Create Technician',
            component: () => import('@/views/master/technician/Detail.vue'),
          },
          {
            path: '/master/technician/update/:id',
            name: 'Edit Technician',
            component: () => import('@/views/master/technician/Detail.vue'),
          },
          {
            path: '/master/business_type',
            name: 'Business Type',
            component: () => import('@/views/master/business_type/Index.vue'),
          },
          {
            path: '/master/business_type/create',
            name: 'Create Business Type',
            component: () => import('@/views/master/business_type/Detail.vue'),
          },
          {
            path: '/master/business_type/update/:id',
            name: 'Edit Business Type',
            component: () => import('@/views/master/business_type/Detail.vue'),
          },
          {
            path: '/master/facility',
            name: 'Facility',
            component: () => import('@/views/master/facility/Index.vue'),
          },
          {
            path: '/master/facility/create',
            name: 'Create Facility',
            component: () => import('@/views/master/facility/Detail.vue'),
          },
          {
            path: '/master/facility/update/:id',
            name: 'Edit Facility',
            component: () => import('@/views/master/facility/Detail.vue'),
          },
          {
            path: '/master/ticketing',
            name: 'Ticketing',
            component: () => import('@/views/master/ticketing/Index.vue'),
          },
          {
            path: '/master/ticketing/create',
            name: 'Create Ticketing',
            component: () => import('@/views/master/ticketing/Detail.vue'),
          },
          {
            path: '/master/ticketing/update/:id',
            name: 'Edit Ticketing',
            component: () => import('@/views/master/ticketing/Detail.vue'),
          },
          {
            path: '/master/office_cost',
            name: 'Cost',
            component: () => import('@/views/master/cost/Index.vue'),
          },
          {
            path: '/master/office_cost/create',
            name: 'Create Cost',
            component: () => import('@/views/master/cost/Detail.vue'),
          },
          {
            path: '/master/office_cost/update/:id',
            name: 'Edit Cost',
            component: () => import('@/views/master/cost/Detail.vue'),
          },
          {
            path: '/master/office_cost/onsite',
            name: 'Cost Onsite',
            component: () => import('@/views/master/costonsite/Index.vue'),
          },
          {
            path: '/master/office_cost/onsite/create',
            name: 'Create Cost Onsite',
            component: () => import('@/views/master/costonsite/Detail.vue'),
          },
          {
            path: '/master/office_cost/onsite/update/:id',
            name: 'Edit Cost Onsite',
            component: () => import('@/views/master/costonsite/Detail.vue'),
          },
          {
            path: '/master/office_price_list',
            name: 'Price List',
            component: () => import('@/views/master/office_price_list/Index.vue'),
          },
          {
            path: '/master/office_price_list/create',
            name: 'Create Price List',
            component: () => import('@/views/master/office_price_list/Detail.vue'),
          },
          {
            path: '/master/office_price_list/update/:id',
            name: 'Edit Price List',
            component: () => import('@/views/master/office_price_list/Detail.vue'),
          },
          {
            path: '/master/office_reset',
            name: 'Office Reset',
            component: () => import('@/views/master/office_reset/Index.vue'),
          },
          {
            path: '/master/office_reset/create',
            name: 'Create Office Reset',
            component: () => import('@/views/master/office_reset/Detail.vue'),
          },
          {
            path: '/master/office_reset/update/:id',
            name: 'Edit Office Reset',
            component: () => import('@/views/master/office_reset/Detail.vue'),
          },
          {
            path: '/master/office_consumable',
            name: 'Office Consumable',
            component: () => import('@/views/master/office_consumable/Index.vue'),
          },
          {
            path: '/master/office_consumable/create',
            name: 'Create Office Consumable',
            component: () => import('@/views/master/office_consumable/Detail.vue'),
          },
          {
            path: '/master/office_consumable/update/:id',
            name: 'Edit Office Consumable',
            component: () => import('@/views/master/office_consumable/Detail.vue'),
          },
          {
            path: '/master/price_list_so',
            name: 'Price List SO',
            component: () => import('@/views/master/price_list_so/Index.vue'),
          },
          {
            path: '/master/price_list_so/create',
            name: 'Create Price List SO',
            component: () => import('@/views/master/price_list_so/Detail.vue'),
          },
          {
            path: '/master/price_list_so/update/:id',
            name: 'Edit Price List SO',
            component: () => import('@/views/master/price_list_so/Detail.vue'),
          },
          {
            path: '/master/financial_statement_row',
            name: 'Financial Statement Row',
            component: () => import('@/views/master/financial_statement_row/Index.vue'),
          },
          {
            path: '/master/financial_statement_row/create',
            name: 'Create Financial Statement Row',
            component: () => import('@/views/master/financial_statement_row/Detail.vue'),
          },
          {
            path: '/master/financial_statement_row/update/:id',
            name: 'Edit Financial Statement Row',
            component: () => import('@/views/master/financial_statement_row/Detail.vue'),
          },
          {
            path: '/master/financial_statement',
            name: 'Financial Statement',
            component: () => import('@/views/master/financial_statement/Index.vue'),
          },
          {
            path: '/master/financial_statement/create',
            name: 'Create Financial Statement',
            component: () => import('@/views/master/financial_statement/Detail.vue'),
          },
          {
            path: '/master/financial_statement/update/:id',
            name: 'Edit Financial Statement',
            component: () => import('@/views/master/financial_statement/Detail.vue'),
          },
          {
            path: '/master/chart_of_account',
            name: 'Chart of Account',
            component: () => import('@/views/master/chart_of_account/Index.vue'),
          },
          {
            path: '/master/chart_of_account/create',
            name: 'Create Chart of Account',
            component: () => import('@/views/master/chart_of_account/Detail.vue'),
          },
          {
            path: '/master/chart_of_account/update/:id',
            name: 'Edit Chart of Account',
            component: () => import('@/views/master/chart_of_account/Detail.vue'),
          },
          {
            path: '/master/item_sales_tax',
            name: 'Item Sales Tax',
            component: () => import('@/views/master/item_sales_tax/Index.vue'),
          },
          {
            path: '/master/item_sales_tax/create',
            name: 'Create Item Sales Tax',
            component: () => import('@/views/master/item_sales_tax/Detail.vue'),
          },
          {
            path: '/master/item_sales_tax/update/:id',
            name: 'Edit Item Sales Tax',
            component: () => import('@/views/master/item_sales_tax/Detail.vue'),
          },
          {
            path: '/office_cs',
            name: 'Office CS',
            component: () => import('@/views/office_cs/Index.vue'),
          },
          {
            path: '/office_cs/create',
            name: 'Create Office CS',
            component: () => import('@/views/office_cs/Create.vue'),
          },
          {
            path: '/office_cs/update/:id',
            name: 'Edit Office CS',
            component: () => import('@/views/office_cs/Detail.vue'),
          },
          {
            path: '/office_work',
            name: 'Office Work',
            component: () => import('@/views/office_work/Index.vue'),
          },
          {
            path: '/office_work/update/:id',
            name: 'Edit Office Work',
            component: () => import('@/views/office_work/Detail.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/pages/Login'),
    meta: { guest: true }
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },

      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Halaman yang membutuhkan autentikasi
    if (!authStore.isAuthenticated) {
      next("/login"); // Redirect ke halaman login jika tidak terautentikasi
    } else {
      next(); // Lanjutkan ke halaman yang diminta
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    // Halaman yang hanya boleh diakses oleh tamu (misal: halaman login atau register)
    if (authStore.isAuthenticated && to.name === "Login") {
      next("/dashboard"); // Redirect ke dashboard jika sudah login dan mencoba mengakses login
    } else {
      next(); // Lanjutkan ke halaman login atau halaman tamu lainnya
    }
  } else {
    next(); // Lanjutkan untuk rute lainnya
  }
});

export default router
