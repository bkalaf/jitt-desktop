export const carriers = {
    USPS: 'USPS',
    UPS: 'UPS',
    FedEx: 'FedEx',
    DHL: 'DHL'
};
export type Carriers = keyof typeof carriers;