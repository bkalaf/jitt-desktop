export const mimeTypes = {
    pdf: 'application/pdf',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    tiff: 'image/tiff',
    tif: 'image/tif',
    svg: 'image/svg+xml',
    json: 'application/json',
    epub: 'application/epub',
    csv: 'text/csv',
    xml: 'application/xml',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '': 'unknown'
};

export function invertObject(obj: Record<string, string>) {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]))
}

export const invertMimeTypes: Record<string, MimeTypes> = invertObject(mimeTypes) as any;
export type MimeTypes = keyof typeof mimeTypes;