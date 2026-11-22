import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { cropToDataUrl } from '../lib/images.js';

/**
 * Crop and straighten a profile picture before it goes on the board.
 *
 * Drag to move it, pinch or use the slider to zoom, turn it in quarter-turns,
 * and nudge it a few degrees either way if it is slightly crooked. The frame is
 * round because that is how the picture is shown everywhere else.
 */
export default function PhotoCropper({ src, onCancel, onDone }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [quarter, setQuarter] = useState(0); // 0 / 90 / 180 / 270
  const [tilt, setTilt] = useState(0); // -45 .. 45
  const [area, setArea] = useState(null);
  const [busy, setBusy] = useState(false);

  const rotation = (quarter + tilt + 360) % 360;
  const onCropComplete = useCallback((_, pixels) => setArea(pixels), []);

  async function save() {
    if (!area) return;
    setBusy(true);
    try {
      onDone(await cropToDataUrl(src, area, rotation));
    } catch (err) {
      console.warn('Could not crop that photo', err);
      setBusy(false);
    }
  }

  return (
    <div className="cropper-backdrop" role="dialog" aria-modal="true" aria-label="Line up your photo">
      <div className="cropper-panel">
        <h3 className="cropper-title">Line up your photo</h3>
        <p className="cropper-hint">Drag to move it, pinch or zoom to fill the circle.</p>

        <div className="cropper-stage">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            showGrid={false}
            minZoom={1}
            maxZoom={4}
            restrictPosition={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="cropper-controls">
          <label className="cropper-slider">
            <span>Zoom</span>
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </label>

          <label className="cropper-slider">
            <span>Straighten {tilt !== 0 && <small>{tilt > 0 ? `+${tilt}` : tilt}°</small>}</span>
            <input
              type="range"
              min={-45}
              max={45}
              step={1}
              value={tilt}
              onChange={(e) => setTilt(Number(e.target.value))}
            />
          </label>

          <div className="cropper-turns">
            <button className="btn" type="button" onClick={() => setQuarter((q) => (q + 270) % 360)}>
              ↺ Turn left
            </button>
            <button className="btn" type="button" onClick={() => setQuarter((q) => (q + 90) % 360)}>
              ↻ Turn right
            </button>
            <button
              className="btn ghost"
              type="button"
              onClick={() => {
                setQuarter(0);
                setTilt(0);
                setZoom(1);
                setCrop({ x: 0, y: 0 });
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="cropper-actions">
          <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>
          <button className="btn primary" type="button" onClick={save} disabled={busy || !area}>
            {busy ? 'Saving…' : 'Use this photo'}
          </button>
        </div>
      </div>
    </div>
  );
}
