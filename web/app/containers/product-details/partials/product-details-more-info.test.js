/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
import React from 'react'
import ConnectedProductDetailsMoreInfo from './product-details-more-info'
import {shallow, mount, render} from 'enzyme'
import {Accordion, AccordionItem} from 'progressive-web-sdk/dist/components/accordion'

const ProductDetailsMoreInfo = ConnectedProductDetailsMoreInfo.WrappedComponent

/* eslint-disable newline-per-chained-call */

// Mock the mutation observer used to update the accordion's height
// The tests don't use the mutation observer, so we can use a minimal mock
beforeAll(() => {
    window.MutationObserver = function() {
        this.observe = () => {}
    }
})

afterAll(() => {
    delete window.MutationObserver
})

test('renders without errors', () => {
    const wrapper = render(<ProductDetailsMoreInfo />)

    expect(wrapper.length).toBe(1)
})

const ROOT_CLASS = 't-product-details__more-info'
const ACCORDION_CLASS = 'pw-accordion'

test('renders the component class correctly', () => {
    const wrapper = shallow(<ProductDetailsMoreInfo />)

    expect(wrapper.find(`.${ROOT_CLASS}`).length).toBe(1)
})

test('renders no accordion if there is no description prop', () => {
    const wrapper = shallow(<ProductDetailsMoreInfo />)
    const accordion = wrapper.find(`.${ACCORDION_CLASS}`)

    expect(accordion.length).toBe(0)
})

test('renders the Product Description AccordionItem Header correctly', () => {
    const string = 'The text that we text is text'
    const wrapper = shallow(<ProductDetailsMoreInfo viewportSize="small" description={string} />)
    const accordion = wrapper.find('Accordion')
    expect(accordion.type()).toBe(Accordion)

    expect(accordion.children().length).toBe(1)
    const accordionItem = accordion.children().first()
    expect(accordionItem.type()).toBe(AccordionItem)

    expect(accordionItem.prop('header')).toBe('Product Description')
})

test('renders the description in an AccordionItem', () => {
    const string = 'The text that we text is text'
    const wrapper = mount(<ProductDetailsMoreInfo description={string} />)

    expect(wrapper.html().includes(string)).toBe(true)
})
