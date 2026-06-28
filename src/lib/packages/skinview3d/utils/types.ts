export type TextureCanvas = HTMLCanvasElement | OffscreenCanvas;
export type TextureSource = HTMLImageElement | HTMLVideoElement | ImageBitmap | TextureCanvas;
export type ModelType = "default" | "slim";
export interface ArmorTrim {
  armor: "helmet" | "chestplate" | "leggings" | "boots",
  trim: string,
  material: string
}

export function isTextureSource(value: unknown): value is TextureSource {
  return (
    value instanceof HTMLImageElement ||
    value instanceof HTMLVideoElement ||
    value instanceof HTMLCanvasElement ||
    (typeof ImageBitmap !== "undefined" && value instanceof ImageBitmap) ||
    (typeof OffscreenCanvas !== "undefined" && value instanceof OffscreenCanvas)
  );
}
