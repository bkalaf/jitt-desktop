export const webdriver = {
    urls: {
        mercari: 'https://www.mercari.com/'
    },
    selectors: {
        logInButton: ['testid', 'LoginButton'] as [string, string],
        emailInput: ['testid', 'EmailInput'] as [string, string],
        passwordInput: ['testid', 'PasswordInput'] as [string, string],
        logInSubmitButton: ['testid', 'LoginSubmitButton'] as [string, string],
        CTA: ['testid', 'SellOnMercariCTA'] as [string, string],
        listingForm: {
            title: ['testid', 'Title', 80] as [string, string, number],
            description: ['testid', 'Description', 1000] as [string, string, number],
            tag1: ['testid', 'Tag1'] as [string, string],
            tag2: ['testid', 'Tag2'] as [string, string],
            tag3: ['testid', 'Tag3'] as [string, string],
            brand: ['testid', 'Brand'] as [string, string],
            brandDropdown: ['testid', 'BrandDropdown'] as [string, string],
            dropdown1: ['#downshift-0-item-0'],
            noBrand: ['testid', 'NoBrandLink'] as [string, string],
            category: ['testid', 'CategoryL0'] as [string, string],
            categoryList: 'ul#categoryId > li',
            subCategory: ['testid', 'CategoryL1'] as [string, string],
            subCategoryList: 'ul#subCategoryId > li',
            subSubCategory: ['testid', 'CategoryL2'] as [string, string],
            subSubCategoryList: 'ul#subSubCategoryId > li',
            condition: {
                1: ['testid', 'ConditionNew'] as [string, string],
                2: ['testid', 'ConditionLikenew'] as [string, string],
                3: ['testid', 'ConditionGood'] as [string, string],
                4: ['testid', 'ConditionFair'] as [string, string],
                5: ['testid', 'ConditionPoor'] as [string, string]
            },
            color: ['testid', 'Color'] as [string, string],
            colors: {
                black: ['testid', 'select-opt-0'] as [string, string],
                grey: ['testid', 'select-opt-1'] as [string, string],
                white: ['testid', 'select-opt-2'] as [string, string],
                beige: ['testid', 'select-opt-3'] as [string, string],
                red: ['testid', 'select-opt-4'] as [string, string],
                pink: ['testid', 'select-opt-5'] as [string, string],
                purple: ['testid', 'select-opt-6'] as [string, string],
                blue: ['testid', 'select-opt-7'] as [string, string],
                green: ['testid', 'select-opt-8'] as [string, string],
                yellow: ['testid', 'select-opt-9'] as [string, string],
                orange: ['testid', 'select-opt-10'] as [string, string],
                brown: ['testid', 'select-opt-11'] as [string, string],
                gold: ['testid', 'select-opt-12'] as [string, string],
                silver: ['testid', 'select-opt-13'] as [string, string],
            },
            zipcode: ['testid', 'ShipsFrom'] as [string, string],
            shipping: ['testid', 'MercariLocalAndShipping'] as [string, string],
            rates: ['testid', 'SelectShipping'] as [string, string],
            editShipping: ['testid', 'EditShippingButton'] as [string, string],
            weight: {
                lbs: ['testid', 'ItemWeightInPounds'] as [string, string],
                ozs: ['testid', 'ItemWeightInOunces'] as [string, string]
            },
            dims: {
                l: ['testid', 'ItemLength'] as [string, string],
                w: ['testid', 'ItemWidth'] as [string, string],
                h: ['testid', 'ItemHeight'] as [string, string]
            },
            carrier: ['testid', 'SelectCarrierButton'] as [string, string],
            shippingOptions: ['testid', 'shipping-choice'] as [string, string],
            shippingOption: {
                button: '[data-testid="shipping-choice"] > div',
                // dataset.testid
                name: '[data-testid="shipping-choice"] > div > div > div > div > p',
                priceAndTime: '[data-testid="shipping-choice"] > div > div > div > div > p ~ p',
                splitter: '|',
                // trim and remove $
            },
            saveShipping: ['testid', 'SaveButton'] as [string, string],
            price: ['testid', 'Price'] as [string, string],
            salesFee: ['testid', 'SalesFee'] as [string, string],
            processingFee: ['testid', 'ProcessingFee'] as [string, string],
            earn: ['testid', 'YouEarn'] as [string, string],
            smartPricing: ['testid', 'SmartPricingButton'] as [string, string],
            floor: ['testid', 'SmartPricingFloorPrice'] as [string, string],
            saveDraft: ['testid', 'SaveDraftButton'] as [string, string],
            publish: ['testid', 'ListButton'] as [string, string],
            photos: ['testid', 'PhotoUploadBox'] as [string, string]
        }
    }
}