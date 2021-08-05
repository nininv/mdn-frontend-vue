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
    surface: '#5a5d61', //background on screen behind chart
    surface2: '#eeeeef',
    primary: '#0f2d52', // darker accent color
    secondary: '#c8c62e', //lighter color // 002855
    accent: '#096288', //almost same as primary
    error: '#623266',
    info: '#29b1b8',
    success: '#06d6a0',
    warning: '#ffd166',
    // custom colors
    'acs-online': '#29b1b8',
    'acs-offline': '#5a5d61',
    'acs-machine-running': '#096288',
    'acs-machine-not-running': '#5a5d61',
    'acs-system-steady': '#096288',
    'acs-system-not-steady': '#5a5d61',
    'acs-stable': '#29b1b8',
    'acs-stable-waiting': '#c8c62e',
    'acs-unstable': '#5a5d61',
    'acs-hopper-disabled': '#5a5d61',
    'acs-hopper-setback': '#29b1b8',
    'acs-hopper-autotune': '#c8c62e',
    'acs-hopper-alarmed': '#623266',
    'acs-hopper-enabled': '#096288',
    'acs-checkin': '#096288',
    'acs-not-checkin': '#5a5d61',
    'acs-plc-link': '#096288',
    'acs-plc-not-link': '#5a5d61'
  }
}
