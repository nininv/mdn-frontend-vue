import menuPages from './menus/pages.menu'

export default {
  // main navigation - side menu
  menu: [{
    text: '',
    key: '',
    items: [
      { icon: 'mdi-view-dashboard-outline', key: 'menu.dashboard', text: 'Machines', link: '/dashboard/analytics' },
      { icon: 'mdi-file-outline', key: 'menu.blank', text: 'Alarms', link: '/blank' },
      { icon: 'mdi-account-multiple', key: 'menu.userPages', text: 'User Access', link: '/users/list' },
      { icon: 'mdi-speedometer', key: 'menu.threshold', text: 'Threshold', link: '/threshold' }
    ]
  }
  // {
  //   text: 'Pages',
  //   key: 'menu.pages',
  //   items: menuPages
  // }
  ],

  // footer links
  footer: [{
    text: 'Copyright',
    key: 'menu.parent',
    href: 'https://aecinternet.com',
    target: '_blank'
  }]
}
