export default {
  // global theme for the app
  globalTheme: 'light', // light | dark

  // side menu theme, use global theme or custom
  menuTheme: 'global', // global | light | dark

  // toolbar theme, use global theme or custom
  toolbarTheme: 'global', // global | light | dark

  // show toolbar detached from top
  isToolbarDetached: true,

  // wrap pages content with a max-width
  isContentBoxed: false,

  // application is right to left
  isRTL: false,

  // dark theme colors
  dark: {
    background: '#05090c',
    surface: '#5a5d61',
    primary: '#c8c62e',
    secondary: '#c8c62e',
    accent: '#82B1FF',
    error: '#ea344e',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  light: {
    background: '#ffffff',
    surface: '#6dbe4b', //background on screen behind chart
    surface2: '#eeeeef',
    primary: '#ff8300', // darker accent color
    secondary: '#818a8f', //lighter color // 002855
    accent: '#333333', //almost same as primary
    error: '#ea2839',
    info: '#00a599',
    success: '#6dbe4b',
    warning: '#ffd166',
    // custom colors
    'acs-online': '#6dbe4b',
    'acs-offline': '#ea2839',
    'acs-machine-running': '#6dbe4b',
    'acs-machine-not-running': '#818a8f',
    'acs-system-steady': '#6dbe4b',
    'acs-system-not-steady': '#818a8f',
    'acs-stable': '#6dbe4b',
    'acs-stable-waiting': '#818a8f',
    'acs-unstable': '#818a8f',
    'acs-hopper-disabled': '#333333',
    'acs-hopper-setback': '#004165',
    'acs-hopper-autotune': '#00a599',
    'acs-hopper-alarmed': '#818a8f',
    'acs-hopper-enabled': '#6dbe4b',
    'acs-checkin': '#6dbe4b',
    'acs-not-checkin': '#818a8f',
    'acs-plc-link': '#6dbe4b',
    'acs-plc-not-link': '#818a8f'
  }
}
