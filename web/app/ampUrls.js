export const baseAMPUrl = 'https://amp.merlinspotions.com'

const validAMPUrls = [
    // PLPs
    '^/potions.html',
    '^/books.html',
    '^/ingredients.html',
    '^/supplies.html',
    '^/new-arrivals.html',
    '^/charms.html',
    // PDPS
    '^/eye-of-newt.html',
    '^/unicorn-blood.html',
    '^/aging-potion.html',
    '^/aging-potion-1.html',
    '^/aging-potion-2.html',
    '^/beginners-guide-to-transfiguration.html',
    '^/dragon-breeding-for-pleasure-and-profit.html',
    '^/beginner-s-guide-to-transfiguration-2.html',
    '^/necronomicon.html',
    '^/potions/.*.html',
    '^/books/.*.html'
]

export const hasAMPPage = (path) => {
    return validAMPUrls.some((url) => {
        return new RegExp(url).test(path)
    })
}
