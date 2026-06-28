import type { ArmorTrim } from "$lib/packages/skinview3d/utils/types.js";

export interface Ballot {
    name: string,
    assetPath: string,
    categories: Category[]
};

export interface Category {
    title: string;
    subtitle?: string;
    options: Option[];
}

export interface Option {
    name: string,
    creator?: string,
    asset: string
}

export interface TrimData {
    armor_material?: string,
    skin?: string,
    helmet?: ArmorTrim,
    chestplate?: ArmorTrim,
    leggings?: ArmorTrim,
    boots?: ArmorTrim
}