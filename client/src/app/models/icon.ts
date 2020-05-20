export interface IIcon {
    type: IconTypes;
    value: number | string;
}

export enum IconTypes {
    'SVG_CLASS' = 0
}

export const defaultSvgClass = 'icon-folder';
