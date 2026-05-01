import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowRightFromBracket,
  faArrowTrendUp,
  faBagShopping,
  faBasketShopping,
  faBolt,
  faBuildingColumns,
  faBus,
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
  faHeartPulse,
  faHouse,
  faIdCard,
  faSun,
  faUtensils,
  faUser,
  faWallet,
} from '@fortawesome/free-solid-svg-icons'
import type { App } from 'vue'

library.add(
  faArrowRightFromBracket,
  faArrowTrendUp,
  faBagShopping,
  faBasketShopping,
  faBolt,
  faBuildingColumns,
  faBus,
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
  faHeartPulse,
  faHouse,
  faIdCard,
  faSun,
  faUtensils,
  faUser,
  faWallet
)

export function registerFontAwesome(app: App) {
  app.component('FontAwesomeIcon', FontAwesomeIcon)
}
