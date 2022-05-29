    export const shipmentStatuses = {
        0: 'shipmentCreated',
        1: 'shippedOn',
        2: 'eta',
        3: 'delivered',
        4: 'returned',
        5: 'lost',
        6: 'damaged'
    };
    export type ShipmentStatuses = keyof typeof shipmentStatuses;