import { addons } from 'storybook/manager-api'
import { brixTheme } from './brix-theme'

addons.setConfig({
  theme: brixTheme,
  panelPosition: 'bottom',
  showToolbar: true,
})
