# Convert the approved source artwork to browser icon sizes.
# The store icon has a 16 px transparent inset, as specified by Chrome.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$assets = Join-Path (Split-Path -Parent $PSScriptRoot) 'extension/assets'
$source = [System.Drawing.Image]::FromFile((Join-Path $assets 'tab-zoo-trex-browser-source.png'))
try {
  foreach ($size in @(16, 32, 48, 128)) {
    $bitmap = [System.Drawing.Bitmap]::new($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.Clear([System.Drawing.Color]::Transparent)
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
      $inset = if ($size -eq 128) { 16 } else { 0 }
      $area = $size - 2 * $inset
      $graphics.DrawImage($source, [System.Drawing.Rectangle]::new($inset, $inset, $area, $area))
      $bitmap.Save((Join-Path $assets "icon$size.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $graphics.Dispose()
      $bitmap.Dispose()
    }
  }
} finally {
  $source.Dispose()
}
