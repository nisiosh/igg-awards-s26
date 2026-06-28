import type { ArmorTrim } from "./types.ts";

export default async function generateTrim(
    armorMaterial: string,
    pieces: ArmorTrim[]
): Promise<HTMLCanvasElement> {
    if (pieces.length === 0) throw new Error("no pieces provided");

    const isLeggings = pieces[0].armor === "leggings";

    const armorImage = new Image();
    armorImage.crossOrigin = "anonymous";
    armorImage.src = isLeggings
        ? `/trims/armor/${armorMaterial}_layer_2.png`
        : `/trims/armor/${armorMaterial}_layer_1.png`;
    await armorImage.decode();

    const canvas = document.createElement("canvas");
    canvas.width = armorImage.naturalWidth;
    canvas.height = armorImage.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("2d context not available");

    context.drawImage(armorImage, 0, 0);

    for (const piece of pieces) {
        const trimImage = new Image();
        trimImage.crossOrigin = "anonymous";
        trimImage.src = piece.armor === "leggings"
            ? `/trims/design/trim_leggings/${piece.trim}.png`
            : `/trims/design/trim_main/${piece.trim}.png`;
        await trimImage.decode();

        const paletteName = resolvePaletteName(piece.material, armorMaterial);
        const trimCanvas = await recolorTrim(
            trimImage,
            "/trims/palettes/trim_palette.png",
            `/trims/palettes/${paletteName}.png`
        );

        switch (piece.armor) {
            case "helmet":
                context.drawImage(trimCanvas, 0, 0, 32, 15, 0, 0, 32, 15);
                break;
            case "chestplate":
                context.drawImage(trimCanvas, 16, 16, 40, 16, 16, 16, 40, 16);
                break;
            case "boots":
                context.drawImage(trimCanvas, 0, 16, 16, 16, 0, 16, 16, 16);
                break;
            case "leggings":
                context.drawImage(trimCanvas, 0, 0);
                break;
        }
    }

    return canvas;
}

async function loadPalette(src: string): Promise<[number, number, number, number][]> {
    const palette = new Image();
    palette.crossOrigin = "anonymous";
    palette.src = src;
    await palette.decode();

    const canvas = document.createElement("canvas");
    canvas.width = palette.naturalWidth;
    canvas.height = palette.naturalHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("2d context not available");
    context.drawImage(palette, 0, 0);

    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    const colors: [number, number, number, number][] = [];
    for (let i = 0; i < data.length; i += 4) {
        colors.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
    }
    return colors;
}

const DARKER_OVERRIDES: Record<string, string> = {
    iron: "iron_darker",
    gold: "gold_darker",
    diamond: "diamond_darker",
    netherite: "netherite_darker",
};

function resolvePaletteName(trimMaterial: string, armorMaterial: string): string {
    if (trimMaterial === armorMaterial && DARKER_OVERRIDES[trimMaterial]) {
        return DARKER_OVERRIDES[trimMaterial];
    }
    return trimMaterial;
}

async function recolorTrim(
    trimImage: HTMLImageElement,
    keyPaletteSrc: string,
    materialPaletteSrc: string,
): Promise<HTMLCanvasElement> {
    const [keyPalette, materialPalette] = await Promise.all([
        loadPalette(keyPaletteSrc),
        loadPalette(materialPaletteSrc),
    ]);

    const map = new Map<string, [number, number, number, number]>();
    for (let i = 0; i < keyPalette.length; i++) {
        const k = keyPalette[i];
        map.set(`${k[0]},${k[1]},${k[2]}`, materialPalette[i]);
    }

    const temp = document.createElement("canvas");
    temp.width = trimImage.naturalWidth;
    temp.height = trimImage.naturalHeight;
    const context = temp.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("2d context not available");
    context.drawImage(trimImage, 0, 0);

    const imageData = context.getImageData(0, 0, temp.width, temp.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) continue; // Skip transparent
        const replacement = map.get(`${data[i]},${data[i + 1]},${data[i + 2]}`);
        if (replacement) {
            data[i] = replacement[0];
            data[i + 1] = replacement[1];
            data[i + 2] = replacement[2];
        }
    }
    context.putImageData(imageData, 0, 0);
    return temp;
}