# Icon Generation Script

This script automates the process of converting an SVG logo to PNG and generating all required Tauri app icons.

## Prerequisites

You need **one** of the following tools installed:

### Option 1: ImageMagick (Recommended)

```bash
# Windows (using Chocolatey)
choco install imagemagick

# Windows (using Scoop)
scoop install imagemagick

# Or download from: https://imagemagick.org/script/download.php
```

### Option 2: Inkscape

```bash
# Windows (using Chocolatey)
choco install inkscape

# Or download from: https://inkscape.org/release/
```

## Usage

### 1. Prepare Your Logo

Create or place your SVG logo in the project root:

- **Format**: SVG (vector format)
- **Recommended**: Square aspect ratio (1:1)
- **Size**: Any size (will be scaled to 1024x1024)
- **Background**: Transparent recommended

### 2. Run the Script

```bash
# Using the provided sample logo
bun run generate-icons logo.svg

# Using your own logo
bun run generate-icons path/to/your-logo.svg
```

### 3. Verify Generated Icons

The script will generate icons in `src-tauri/icons/`:

- `32x32.png` - Small icon
- `128x128.png` - Medium icon
- `128x128@2x.png` - Retina display icon
- `icon.png` - Source PNG (1024x1024)
- `icon.icns` - macOS app icon
- `icon.ico` - Windows app icon
- Various Windows Store logos

## What the Script Does

1. **Converts SVG to PNG**: Creates a high-resolution 1024x1024 PNG from your SVG
2. **Generates Tauri Icons**: Uses `tauri icon` command to create all platform-specific icons
3. **Copies Source**: Places the source PNG in the icons directory
4. **Cleans Up**: Removes temporary files

## Customizing the Logo

### Edit the Sample Logo

The included `logo.svg` features:

- Blue gradient background
- Pill/capsule icon (pharmacy theme)
- Chart with trend line (analytics theme)
- "SR" monogram (Smart Reorder)

You can edit this file in:

- **Inkscape** (free, open-source)
- **Adobe Illustrator**
- **Figma** (export as SVG)
- Any SVG editor

### Design Tips

- **Keep it simple**: Icons should be recognizable at small sizes
- **Use solid colors**: Avoid complex gradients for small icons
- **Test at different sizes**: View at 32x32 to ensure clarity
- **Consider dark mode**: Test on both light and dark backgrounds

## Troubleshooting

### "Neither ImageMagick nor Inkscape found"

Install one of the required tools (see Prerequisites above).

### "SVG file not found"

Check the path to your SVG file. Use relative or absolute paths.

### Icons look blurry

Ensure your source SVG is high quality and uses vector shapes, not embedded rasters.

### Colors look different

SVG rendering can vary. Test the generated PNG and adjust your SVG if needed.

## Manual Alternative

If you prefer manual control:

1. **Convert SVG to PNG** (1024x1024):

   ```bash
   magick convert -background none -resize 1024x1024 logo.svg icon-1024.png
   ```

2. **Generate Tauri icons**:
   ```bash
   cd src-tauri
   pnpm tauri icon ../icon-1024.png
   ```

## Next Steps

After generating icons:

1. **Rebuild your app**: `pnpm tauri build`
2. **Test the icons**: Check taskbar, window title, installer
3. **Update branding**: Use the `AppLogo` component in your UI

## Resources

- [Tauri Icon Documentation](https://tauri.app/v1/guides/features/icons/)
- [ImageMagick Documentation](https://imagemagick.org/script/command-line-processing.php)
- [Inkscape CLI Guide](https://inkscape.org/doc/inkscape-man.html)
