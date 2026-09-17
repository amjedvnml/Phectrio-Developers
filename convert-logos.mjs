import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertToTransparentWhite(inputPath, outputPath, trim = false) {
  const image = sharp(inputPath);
  let raw = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  
  const { data, info } = raw;
  const { width, height, channels } = info;
  
  const outBuffer = Buffer.alloc(width * height * 4);
  
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate lightness (0 is black, 255 is white)
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
    
    // Invert: black logo becomes opaque white, white background becomes transparent
    const alpha = Math.max(0, Math.min(255, Math.round(255 - brightness)));
    
    const outIdx = (i / channels) * 4;
    outBuffer[outIdx] = 255;     // Red = 255 (White)
    outBuffer[outIdx + 1] = 255; // Green = 255 (White)
    outBuffer[outIdx + 2] = 255; // Blue = 255 (White)
    outBuffer[outIdx + 3] = alpha; // Alpha based on darkness of original
  }
  
  let processed = sharp(outBuffer, {
    raw: { width, height, channels: 4 }
  });

  if (trim) {
    processed = processed.trim();
  }

  await processed.png().toFile(outputPath);
  console.log(`Saved transparent white image: ${outputPath}`);
}

async function run() {
  const assetsDir = path.resolve(__dirname, 'client/public/assets');
  
  await convertToTransparentWhite(
    path.join(assetsDir, 'logo-mark-black.png'),
    path.join(assetsDir, 'logo-mark-white.png'),
    true
  );

  await convertToTransparentWhite(
    path.join(assetsDir, 'logo-full-black.png'),
    path.join(assetsDir, 'logo-full-white.png'),
    true
  );

  console.log('Finished logo conversion.');
}

run().catch(console.error);
