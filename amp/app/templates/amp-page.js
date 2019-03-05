/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

const ampPage = ({title, canonicalURL, body, css, scriptIncludes, fontIncludes, debugInfo}) => (
    /*eslint-disable */
    `
    <!doctype html>
    <html amp lang="en" class="wf-active">
        <head>
            <!-- Standard AMP markup -->
            <meta charset="utf-8">
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <title>${title}</title>
            <link rel="canonical" href="${canonicalURL}" />
            ${fontIncludes}
            <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
            <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>

            <!-- AMP Component JS includes go here -->
            ${scriptIncludes}

            <!-- Page styles -->
            <style amp-custom>
                ${css}
            </style>
        </head>
        ${body}
        ${debugInfo}
    </html>
    `
    /*eslint-enable */
)


export default ampPage
