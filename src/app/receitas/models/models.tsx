
interface Ingredient {
    image_url: string | undefined;
    title: string;
    description: string;
}

interface Preparation {
    step: number;
    title: string;
    description: string;
    image_url: string | undefined;
}

interface Session {
    id: number;
    title: string;
}
interface Image {
    url: string;
    name?: string;
}
interface Recipe {
    id?: number;
    images?: Image[];
    title?: string;
    description?: string;
    thumbnail?: string;
    ingredients?: Ingredient[];
    preparations?: Preparation[];
    session_id?: number;
    portions?: number;
    preparation_time?: number;
    dificulty?: string;
    categories?: string[];
    download_image?: boolean;
    property?: string;
}