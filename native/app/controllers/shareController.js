import SharingPlugin from 'progressive-app-sdk/plugins/sharingPlugin'

import AppEvents from '../global/app-events'

const ShareController = function() {}

ShareController.init = async function() {
    const sharingPlugin = await SharingPlugin.init()

    AppEvents.on(AppEvents.shareProduct, ({title, url}) => {
        sharingPlugin.share({
            message: title,
            url
        })
    })

    return new ShareController()
}

export default ShareController
