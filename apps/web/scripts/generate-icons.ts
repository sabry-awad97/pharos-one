#!/usr/bin/env bun

/**
 * Icon Generation Script
 *
 * This script converts an SVG or PNG logo and generates all required
 * Tauri app icons in various sizes for different platforms.
 *
 * Usage:
 *   bun run generate-icons <path-to-svg-or-png>
 *   bun run generate-icons ./logo.svg
 *   bun run generate-icons ./logo.png
 */

import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const TEMP_DIR = join(process.cwd(), "temp");
const ICONS_DIR = join(process.cwd(), "src-tauri", "icons");
const TAURI_DIR = join(process.cwd(), "src-tauri");
const PNG_SIZE = 1024; // High resolution source PNG

async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.error("❌ Error: Please provide path to SVG or PNG file");
		console.log("Usage: bun run generate-icons <path-to-image>");
		console.log("Example: bun run generate-icons ./logo.svg");
		console.log("Example: bun run generate-icons ./logo.png");
		process.exit(1);
	}

	const inputPath = resolve(args[0]);
	const inputExt = extname(inputPath).toLowerCase();

	// Validate file exists
	if (!existsSync(inputPath)) {
		console.error(`❌ Error: File not found: ${inputPath}`);
		process.exit(1);
	}

	// Validate file type
	if (![".svg", ".png"].includes(inputExt)) {
		console.error(`❌ Error: Unsupported file type: ${inputExt}`);
		console.error("Supported formats: .svg, .png");
		process.exit(1);
	}

	console.log("🎨 Starting icon generation...\n");

	// Create temp directory
	if (!existsSync(TEMP_DIR)) {
		mkdirSync(TEMP_DIR, { recursive: true });
	}

	const pngPath = join(TEMP_DIR, "icon-1024.png");
	let needsConversion = true;

	// If input is already PNG, check if it needs resizing
	if (inputExt === ".png") {
		console.log("📐 Step 1: Processing PNG file...");

		// Check PNG dimensions using ImageMagick
		try {
			const identifyProc = Bun.spawn([
				"magick",
				"identify",
				"-format",
				"%wx%h",
				inputPath,
			]);
			const output = await new Response(identifyProc.stdout).text();
			const [width, height] = output.trim().split("x").map(Number);

			if (width === PNG_SIZE && height === PNG_SIZE) {
				console.log(
					`✅ PNG is already ${PNG_SIZE}x${PNG_SIZE}, converting to ensure proper format\n`,
				);
				// Use ImageMagick to ensure proper PNG format
				const convertProc = Bun.spawn([
					"magick",
					"convert",
					inputPath,
					pngPath,
				]);
				await convertProc.exited;
				needsConversion = false;
			} else {
				console.log(
					`📏 PNG is ${width}x${height}, resizing to ${PNG_SIZE}x${PNG_SIZE}...`,
				);
			}
		} catch {
			console.log(
				"⚠️  Could not check PNG dimensions, will resize to be safe...",
			);
		}
	}

	// Convert/resize if needed
	if (needsConversion) {
		if (inputExt === ".svg") {
			console.log("📐 Step 1: Converting SVG to PNG (1024x1024)...");
		} else {
			console.log("📐 Step 1: Resizing PNG to 1024x1024...");
		}

		let converted = false;

		// Try using ImageMagick (magick command)
		try {
			const magickProc = Bun.spawn([
				"magick",
				"convert",
				"-background",
				"none",
				"-resize",
				`${PNG_SIZE}x${PNG_SIZE}`,
				inputPath,
				pngPath,
			]);
			const exitCode = await magickProc.exited;
			if (exitCode === 0) {
				console.log("✅ Processed using ImageMagick\n");
				converted = true;
			}
		} catch {
			// ImageMagick not available, will try Inkscape for SVG
		}

		// Fallback to Inkscape if ImageMagick failed and input is SVG
		if (!converted && inputExt === ".svg") {
			try {
				const inkscapeProc = Bun.spawn([
					"inkscape",
					inputPath,
					"--export-type=png",
					`--export-filename=${pngPath}`,
					`--export-width=${PNG_SIZE}`,
					`--export-height=${PNG_SIZE}`,
				]);
				const inkscapeExit = await inkscapeProc.exited;
				if (inkscapeExit === 0) {
					console.log("✅ Converted using Inkscape\n");
					converted = true;
				}
			} catch {
				// Inkscape not available either
			}
		}

		if (!converted) {
			console.error("❌ Error: ImageMagick not found.");
			console.error("Please install ImageMagick:");
			console.error("  - https://imagemagick.org/script/download.php");
			if (inputExt === ".svg") {
				console.error("\nAlternatively, install Inkscape for SVG conversion:");
				console.error("  - https://inkscape.org/release/");
			}
			process.exit(1);
		}
	}

	// Verify PNG was created
	if (!existsSync(pngPath)) {
		console.error("❌ Error: Failed to create PNG file");
		process.exit(1);
	}

	// Step 2: Generate Tauri icons
	console.log("🔧 Step 2: Generating Tauri icons...");

	try {
		// Run tauri icon command from src-tauri directory
		const tauriProc = Bun.spawn(["bun", "tauri", "icon", resolve(pngPath)], {
			cwd: TAURI_DIR,
			stdout: "inherit",
			stderr: "inherit",
		});
		const tauriExit = await tauriProc.exited;
		if (tauriExit !== 0) throw new Error("Tauri icon generation failed");
		console.log("✅ Generated all Tauri icons\n");
	} catch (error) {
		console.error("❌ Error generating Tauri icons:", error);
		process.exit(1);
	}

	// Step 3: Copy the source PNG to icons directory
	console.log("📦 Step 3: Copying source PNG to icons directory...");
	copyFileSync(pngPath, join(ICONS_DIR, "icon.png"));
	console.log("✅ Copied source PNG\n");

	// Step 4: Cleanup temp directory
	console.log("🧹 Step 4: Cleaning up...");
	rmSync(TEMP_DIR, { recursive: true, force: true });
	console.log("✅ Cleanup complete\n");

	console.log("🎉 Success! All icons generated successfully!");
	console.log(`📁 Icons location: ${ICONS_DIR}`);
	console.log("\n📝 Generated files:");
	console.log("  - 32x32.png");
	console.log("  - 128x128.png");
	console.log("  - 128x128@2x.png");
	console.log("  - icon.png (1024x1024)");
	console.log("  - icon.icns (macOS)");
	console.log("  - icon.ico (Windows)");
	console.log("  - Various Windows Store logos");
}

main().catch((error) => {
	console.error("❌ Unexpected error:", error);
	process.exit(1);
});
