/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import Notification from '../notification'

const NotificationManager = ({
    notifications,
    actions
}) => {
    return (
        <div className="c-notification-manager u-padding-top-md u-padding-bottom-md u-padding-start u-padding-end">
            {notifications.map((notification) => {
                return <Notification key={notification.id} {...notification} {...actions} />
            })}
        </div>
    )
}

NotificationManager.defaultProps = {
    notifications: []
}

NotificationManager.propTypes = {
    actions: PropTypes.object,
    notifications: PropTypes.array
}

export default NotificationManager
