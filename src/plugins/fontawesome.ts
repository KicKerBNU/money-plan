import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowRightFromBracket,
  faArrowTrendUp,
  faBolt,
  faBuildingColumns,
  faChartColumn,
  faChartPie,
  faPalette,
  faDatabase,
  faGear,
  faMoon,
  faPlus,
  faReceipt,
  faRoute,
  faLayerGroup,
  faCode,
  faBook,
  faGlobe,
  faSun,
  faUser,
  faWallet,
} from '@fortawesome/free-solid-svg-icons'
import type { App } from 'vue'

library.add(
  faArrowRightFromBracket,
  faArrowTrendUp,
  faBolt,
  faBuildingColumns,
  faChartColumn,
  faChartPie,
  faDatabase,
  faGear,
  faMoon,
  faPalette,
  faPlus,
  faReceipt,
  faRoute,
  faLayerGroup,
  faCode,
  faBook,
  faGlobe,
  faSun,
  faUser,
  faWallet
)

export function registerFontAwesome(app: App) {
  app.component('FontAwesomeIcon', FontAwesomeIcon)
}
