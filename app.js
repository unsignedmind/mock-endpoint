var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const crypto = require('crypto');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function urlBuilder(width, height, bg = 'WHITE') {
    const colorScheme = { WHITE: 'ffffff/000000', BLACK: '000000/ffffff' };
    if (bg === 'FANCY') {
        return `https://picsum.photos/${width}/${height}`;
    } else {
        return `https://placehold.co/${width}x${height}/${colorScheme[bg]}`;
    }
}

function genBreakpoint(
    name,
    mediaQuery,
    imageSize,
    bg
) {
    return {
        name: name,
        mediaQuery: mediaQuery,
        urls: [
            {
                size: '1x',
                url: urlBuilder(imageSize.oneX.width, imageSize.oneX.height, bg),
                width: `${imageSize.oneX.width}`,
                height: `${imageSize.oneX.height}`,
            },
            {
                size: '2x',
                url: urlBuilder(imageSize.twoX.width, imageSize.twoX.height, bg),
                width: `${imageSize.twoX.width}`,
                height: `${imageSize.twoX.height}`,
            },
        ],
    };
}

function generateImageMock(
    widths,
    ar,
    bg
) {
    const imageSizes = [];

    Object.values(widths).forEach((width, index) => {
        let ratioX = 1;
        let ratioY = 1;

        if (ar.default) {
            ratioX = ar.default.ratioX;
            ratioY = ar.default.ratioY;
        } else if (!ar.default) {
            const breakpoint = Object.keys(widths)[index];
            ratioX = ar[breakpoint].ratioX;
            ratioY = ar[breakpoint].ratioY;
        }

        const ratio = width / ratioX;
        const height = Math.round(ratio * ratioY);

        imageSizes.push({
            oneX: {
                width: width,
                height: height,
            },
            twoX: {
                width: width * 2,
                height: height * 2,
            },
        });
    });

    const imageMock = {
        cmPreviewMetadata: '[{"_":{"$Ref":"content/34894"}}]',
        altText: 'bla',
        breakpoints: [
            genBreakpoint('lg', '1200', imageSizes[0], bg),
            genBreakpoint('md', '900', imageSizes[1], bg),
            genBreakpoint('sm', '600', imageSizes[2], bg),
        ],
    };

    if (imageSizes[3]) {
        imageMock.breakpoints.push(genBreakpoint('xs', '0', imageSizes[3], bg));
    }

    return imageMock;
}

const image4x3Mock = generateImageMock(
    { lg: 1200, md: 900, sm: 600 },
    { default: { ratioX: 4, ratioY: 3 } },
    'FANCY'
);

const jdOffer = {
    offerDetails: {
        mediaComponent: {
            staggeredOptions: {
                staggeredCheck: false,
                staggeredImageDirection: 'top',
            },
            teaserMediaLayout: {
                textRatio: '50_50',
            },
            teaserMediaPosition: { textDirection: 'right' },
        },
        backgroundColor: 'WHITE',
        media: {
            name: 'Picture',
            id: crypto.randomUUID(),
            props: {
                images: image4x3Mock,
            },
        },
        textComponent: {
            links: [
                {
                    text: 'Buy Online',
                    href: 'https://www.deere.com/en',
                    variant: 'primary',
                    id: crypto.randomUUID(),
                },
                {
                    text: 'Find a Dealer',
                    href: 'https://www.deere.com/en',
                    variant: 'secondary',
                    id: crypto.randomUUID(),
                },
            ],
            detailText: [
                {
                    name: 'RichTextTypography',
                    id: crypto.randomUUID(),
                    props: {
                        variant: 'h4',
                        text: '3.75% APR Fix Rate for 48 Months¹,² and Save $250³',
                    },
                },
                {
                    name: 'RichTextTypography',
                    id: crypto.randomUUID(),
                    props: {
                        variant: 'body1',
                        text: 'on New John Deere Sub‑Compact and Compact Tractors with the purchase of 2 or more John Deere or Frontier implements.',
                    },
                },
                {
                    name: 'RichTextList',
                    id: crypto.randomUUID(),
                    props: {
                        variant: 'ul',
                        items: [
                            {
                                name: 'RichTextTypography',
                                id: crypto.randomUUID(),
                                props: {
                                    variant: 'body1',
                                    text: '3.75% APR Fix Rate for 48 Months¹,²',
                                },
                            },
                            {
                                name: 'RichTextTypography',
                                id: crypto.randomUUID(),
                                props: {
                                    variant: 'body1',
                                    text: 'Save $250³',
                                },
                            },
                            {
                                name: 'RichTextTypography',
                                id: crypto.randomUUID(),
                                props: {
                                    variant: 'body1',
                                    text: 'Offer Available 01 February, 2023 through 01 May, 2023',
                                },
                            },
                        ],
                    },
                },
            ],
        },
    },
    disclaimer: {
        count: 3,
        textSettings: {
            detailText: [
                {
                    name: 'RichTextList',
                    id: crypto.randomUUID(),
                    props: {
                        variant: 'ol',
                        items: [
                            {
                                name: 'RichTextTypography',
                                id: crypto.randomUUID(),
                                props: {
                                    variant: 'body1',
                                    text: 'Offer valid on qualifying purchases made 01 February 2023 through 01 May 2023. This offer excludes TX Turf Gators and ProGators. Subject to approved credit on a Revolving Plan account, a service of John Deere Financial, f.s.b. For consumer use only. No down payment required. Interest will be charged to your account from the purchase date at 17.9% APR if the purchase balance is not paid in full within 12 months or if your account is otherwise in default. Available at participating U.S. dealers. Prices and models may vary by dealer. Offer available on new equipment and in the U.S. only. Prices and savings in U.S. dollars.',
                                },
                            },
                            {
                                name: 'RichTextTypography',
                                id: crypto.randomUUID(),
                                props: {
                                    variant: 'body1',
                                    text: 'Offer valid on qualifying purchases made 01 February 2023 through 01 May 2023. This offer excludes TX Turf Gators and ProGators. Subject to approved credit on a Revolving Plan account, a service of John Deere Financial, f.s.b. For consumer use only. No down payment required. 3.9% APR is for 84 months only, regular Revolving Plan rates will apply after that. The regular Revolving Plan rate, which varies over time, is currently 22.50% APR (as of 03 January 2023). Available at participating U.S. dealers. Prices and models may vary by dealer. Offer available on new equipment and in the U.S. only. Prices and savings in U.S. dollars.',
                                },
                            },
                            {
                                name: 'RichTextTypography',
                                id: crypto.randomUUID(),
                                props: {
                                    variant: 'body1',
                                    text: 'Offer valid on qualifying purchases made 01 February 2023 through 01 May 2023. This offer excludes TX Turf Gators and ProGators. Subject to approved installment credit with John Deere Financial, for consumer and Ag use only. Down payment may be required. Average down payment is 10%. $13.62 per month for every $1,000 financed. 3.9% APR for 84 months only. Taxes, freight, setup, insurance, fees, and delivery charges could increase monthly payment. Available at participating U.S. dealers. Prices and models may vary by dealer. Offer available on new equipment and in the U.S. only. Prices and savings in U.S. dollars.',
                                },
                            },
                        ],
                    },
                },
            ],
        },
    },
    modalTitle: 'Offers on New Gator Utility Vehicles',
};

app.get('/blueprint/servlet/service/data/:componentname/:contentId/:contextId', function (req, res) {
    const { componentname, contentId, contextId } = req.params;
    const productId = req.query.productId;


    res.send({ ...jdOffer, modalTitle: `${jdOffer.modalTitle} | ContentId: ${contentId}` });
});

app.listen(4000, function () {
    console.log('Example app listening on port ' + 4000 + '!');
});
module.exports = app;
