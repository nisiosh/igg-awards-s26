export interface Ballot {
    name: string,
    assetPath: string,
    categories: Category[]
};

export interface Category {
    title: string;
    options: Option[];
}

export interface Option {
    name: string,
    creator?: string,
    asset: string
}