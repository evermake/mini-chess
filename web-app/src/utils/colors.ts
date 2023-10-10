/**
 * Converts color from HEX to HSL color space.
 *
 * @param hexColor Color in format `RRGGBB` or `#RRGGBB`.
 * @returns HSL values in range [0, 1].
 */
export function hexToHsl(hexColor: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hexColor)
  return rgbToHsl(r, g, b)
}

/**
 * Converts color from HEX to RGB color space.
 *
 * @param hexColor Color in format `RRGGBB` or `#RRGGBB`.
 * @returns RGB values in range [0, 255].
 */
export function hexToRgb(hexColor: string): [number, number, number] {
  hexColor = hexColor.replace("#", "")
  const r = Number.parseInt(hexColor.slice(0, 2), 16)
  const g = Number.parseInt(hexColor.slice(2, 4), 16)
  const b = Number.parseInt(hexColor.slice(4, 6), 16)
  return [r, g, b]
}

/**
 * Converts color from RGB to HSL color space.
 *
 * @param r Red channel in range [0, 255].
 * @param g Green channel in range [0, 255].
 * @param b Blue channel in range [0, 255].
 * @returns HSL values in range [0, 1].
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h
  let s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
      default:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return [h, s, l]
}
