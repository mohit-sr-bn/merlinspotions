import AppEvents from '../global/app-events'

const PWABroadcaster = function(navigationView) {
    this.navigationView = navigationView

    this._bindBroadcasts()
}

PWABroadcaster.prototype._bindBroadcasts = function() {
    AppEvents.on('all', (eventName) => {
        if (eventName.startsWith('broadcast:')) {
            this.navigationView.trigger(eventName)
        }
    })
}

export default PWABroadcaster
