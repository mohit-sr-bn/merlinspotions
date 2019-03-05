// Pointing development base url to prod avoids having to run
// merlins docker locally, yet still allow local MP to function.
const DEVELOPMENT_BASE_URL = 'https://www.merlinspotions.com'
const STAGING_BASE_URL = 'https://staging.merlinspotions.com'
const PRODUCTION_BASE_URL = 'https://www.merlinspotions.com'

export const LIVE_BASE_URLS = {
    dev: DEVELOPMENT_BASE_URL,
    staging: STAGING_BASE_URL,
    prod: PRODUCTION_BASE_URL
}
