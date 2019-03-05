import Astro from 'progressive-app-sdk/astro-full'
import BackboneEvents from 'vendor/backbone-events'

const AppEvents = Astro.Utils.extend({}, BackboneEvents)

AppEvents.signInShow = 'sign-in:show'
AppEvents.shopShow = 'shop:show'
AppEvents.cartCountUpdated = 'cart:count-updated'
AppEvents.cartModalNeedsUpdate = 'cart:modal-needs-update'
AppEvents.shareProduct = 'product:share'

AppEvents.broadcastDidLogin = 'broadcast:user:did-login'
AppEvents.broadcastDidLogout = 'broadcast:user:did-logout'

export default AppEvents
