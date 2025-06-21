export default [
  {
    component: 'CNavItem',
    name: 'Home',
    to: '/dashboard',
    icon: 'cil-home',
  },
  {
    component: 'CNavItem',
    name: 'CS',
    to: '/office_cs',
    icon: 'cil-home',
  },
  {
    component: 'CNavItem',
    name: 'Work',
    to: '/office_work',
    icon: 'cil-home',
  },
  {
    component: 'CNavTitle',
    name: 'Master',
  },
  {
    component: 'CNavGroup',
    name: 'Basic',
    to: '/master',
    icon: 'cil-puzzle',
    items: [
      {
        component: 'CNavItem',
        name: 'Company',
        to: '/master/company',
      },
      {
        component: 'CNavItem',
        name: 'City',
        to: '/master/city',
      },
      {
        component: 'CNavItem',
        name: 'Location',
        to: '/master/location',
      },
      {
        component: 'CNavItem',
        name: 'Branch',
        to: '/master/branch',
      },
      {
        component: 'CNavItem',
        name: 'Warehouse',
        to: '/master/warehouse',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Item',
    to: '/buttons',
    icon: 'cil-cursor',
    items: [
      {
        component: 'CNavItem',
        name: 'Item',
        to: '/master/item',
      },
      {
        component: 'CNavItem',
        name: 'Item Category',
        to: '/master/item_subcategory',
      },
      {
        component: 'CNavItem',
        name: 'Item Super Group',
        to: '/master/item_super_group'
      },
      {
        component: 'CNavItem',
        name: 'Item Group',
        to: '/master/item_group',
      },
      {
        component: 'CNavItem',
        name: 'Item Subgroup',
        to: '/master/subcategory',
      },
      {
        component: 'CNavItem',
        name: 'Unit',
        to: '/master/unit',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Customer',
    to: '/master/customer',
    icon: 'cil-drop',
  },
  {
    component: 'CNavItem',
    name: 'Vendor',
    to: '/master/vendor',
    icon: 'cil-drop',
  },
  {
    component: 'CNavItem',
    name: 'Bank Account',
    to: '/master/bankaccount',
    icon: 'cil-drop',
  },
  {
    component: 'CNavItem',
    name: 'Technician',
    to: '/master/technician',
    icon: 'cil-drop',
  },
  {
    component: 'CNavItem',
    name: 'Salesman',
    to: '/theme/colors',
    icon: 'cil-drop',
  },
  {
    component: 'CNavItem',
    name: 'Business Type',
    to: '/master/business_type',
    icon: 'cil-drop',
  },
  {
    component: 'CNavItem',
    name: 'Facility',
    to: '/master/facility',
    icon: 'cil-drop',
  },
  {
    component: 'CNavItem',
    name: 'Ticketing',
    to: '/master/ticketing',
    icon: 'cil-drop',
  },
  {
    component: 'CNavItem',
    name: 'Machine',
    to: '/theme/colors',
    icon: 'cil-drop',
  },
  {
    component: 'CNavGroup',
    name: 'Price',
    icon: 'cil-star',
    items: [
      {
        component: 'CNavGroup',
        name: 'Service',
        icon: 'cil-puzzle',
        items: [
          {
            component: 'CNavItem',
            name: 'Cost',
            to: '/master/office_cost',
          },
          {
            component: 'CNavItem',
            name: 'Cost On Site',
            to: '/master/office_cost/onsite',
          },
          {
            component: 'CNavItem',
            name: 'Price List',
            to: '/master/office_price_list',
          },
          {
            component: 'CNavItem',
            name: 'Reset',
            to: '/master/office_reset',
          },
          {
            component: 'CNavItem',
            name: 'Consumable',
            to: '/master/office_consumable',
          },
        ],
      },
      {
        component: 'CNavItem',
        name: 'Sales Order',
        to: '/master/price_list_so',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'General Ledger',
    to: '/icons',
    icon: 'cil-star',
    items: [
      {
        component: 'CNavGroup',
        name: 'Setup',
        icon: 'cil-puzzle',
        items: [
          {
            component: 'CNavItem',
            name: 'Financial Statement Row',
            to: '/master/financial_statement_row',
          },
          {
            component: 'CNavItem',
            name: 'Financial Statement',
            to: '/master/financial_statement',
          },
          {
            component: 'CNavItem',
            name: 'Chart of Account',
            to: '/master/chart_of_account',
          },
          {
            component: 'CNavItem',
            name: 'Reset',
            to: '/master/office_reset',
          },
          {
            component: 'CNavItem',
            name: 'Consumable',
            to: '/master/office_consumable',
          },
        ],
      },
      {
        component: 'CNavItem',
        name: 'Sales Tax',
        to: '/master/item_sales_tax',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Notifications',
    to: '/notifications',
    icon: 'cil-bell',
    items: [
      {
        component: 'CNavItem',
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        component: 'CNavItem',
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        component: 'CNavItem',
        name: 'Modals',
        to: '/notifications/modals',
      },
      {
        component: 'CNavItem',
        name: 'Toasts',
        to: '/notifications/toasts',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Widgets',
    to: '/widgets',
    icon: 'cil-calculator',
    badge: {
      color: 'primary',
      text: 'NEW',
      shape: 'pill',
    },
  },
  {
    component: 'CNavTitle',
    name: 'Extras',
  },
  {
    component: 'CNavGroup',
    name: 'Pages',
    to: '/pages',
    icon: 'cil-star',
    items: [
      {
        component: 'CNavItem',
        name: 'Login',
        to: '/login',
      },
      {
        component: 'CNavItem',
        name: 'Register',
        to: '/pages/register',
      },
      {
        component: 'CNavItem',
        name: 'Error 404',
        to: '/pages/404',
      },
      {
        component: 'CNavItem',
        name: 'Error 500',
        to: '/pages/500',
      },
    ],
  },
]
