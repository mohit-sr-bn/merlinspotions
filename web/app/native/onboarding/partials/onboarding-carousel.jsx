/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'

import CarouselItem from 'progressive-web-sdk/dist/components/carousel/carousel-item'
import Carousel from 'progressive-web-sdk/dist/components/carousel'
import Button from 'progressive-web-sdk/dist/components/button'

const OnboardingScreen = ({imageURL, imageAlt, title, subtitle, primaryButton, laterButton, actionButton, id, active}) => {
    return (
        <CarouselItem caption="Get started" key={id} className="carousel-item" active={active}>
            <div className="carousel-item-wrapper u-direction-column">
                <div className="u-flex u-flexbox u-align-center u-justify-center">
                    <div>
                        <img src={imageURL} className="carousel-item-image" alt={imageAlt} />
                        {title &&
                            <h2 className="item-title u-color-neutral-60 u-text-family u-text-weight-medium">{title}</h2>
                        }
                        <p className="item-subtitle u-text-family">{subtitle}</p>
                    </div>
                </div>
                {primaryButton &&
                    <div className="u-flexbox u-flexbox-gutters button-wrapper">
                        <Button text={primaryButton.title} className="pw--primary u-flex" onClick={primaryButton.action} />
                    </div>
                }
                <div className="u-flexbox u-flexbox-gutters button-wrapper">
                    {laterButton &&
                        <Button className="pw--tertiary u-flex" text={laterButton.title} onClick={laterButton.action} />
                    }
                    {actionButton &&
                        <Button className="pw--secondary u-flex" text={actionButton.title} onClick={actionButton.action} />
                    }
                </div>
            </div>
        </CarouselItem>
    )
}

OnboardingScreen.propTypes = {
    actionButton: PropTypes.object,
    active: PropTypes.bool,
    id: PropTypes.string,
    imageAlt: PropTypes.string,
    imageURL: PropTypes.string,
    laterButton: PropTypes.object,
    primaryButton: PropTypes.object,
    subtitle: PropTypes.string,
    title: PropTypes.string
}

const OnboardingCarousel = ({carouselData}) => {
    return (
        <div className="t-onboarding">
            <Carousel allowLooping={false}>
                {carouselData.map((val, idx) => <OnboardingScreen {...val} id={idx.toString()} key={idx.toString()} />)}
            </Carousel>
        </div>
    )
}

OnboardingCarousel.propTypes = {
    carouselData: PropTypes.array
}

export default OnboardingCarousel
