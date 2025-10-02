import React from "react";
import Standard3DCanvas from "./Standard3DCanvas";

// Predefined canvas sizes for consistent UI
export const CANVAS_SIZES = {
  thumbnail: { width: 150, height: 120 },
  small: { width: 250, height: 200 },
  medium: { width: 400, height: 300 },
  large: { width: 600, height: 450 },
  xlarge: { width: 800, height: 600 },
  square_small: { width: 200, height: 200 },
  square_medium: { width: 300, height: 300 },
  square_large: { width: 400, height: 400 },
  wide: { width: 500, height: 280 },
  ultrawide: { width: 700, height: 300 },
};

// Thumbnail 3D Canvas - for cards and lists
export const Thumbnail3DCanvas = ({ fileUrl, fileName, ...props }) => (
  <Standard3DCanvas
    fileUrl={fileUrl}
    fileName={fileName}
    width={CANVAS_SIZES.thumbnail.width}
    height={CANVAS_SIZES.thumbnail.height}
    showInfo={false}
    showControls={false}
    autoRotate={true}
    {...props}
  />
);

// Small 3D Canvas - for previews
export const Small3DCanvas = ({ fileUrl, fileName, ...props }) => (
  <Standard3DCanvas
    fileUrl={fileUrl}
    fileName={fileName}
    width={CANVAS_SIZES.small.width}
    height={CANVAS_SIZES.small.height}
    showInfo={true}
    showControls={true}
    autoRotate={true}
    {...props}
  />
);

// Medium 3D Canvas - for main displays
export const Medium3DCanvas = ({ fileUrl, fileName, ...props }) => (
  <Standard3DCanvas
    fileUrl={fileUrl}
    fileName={fileName}
    width={CANVAS_SIZES.medium.width}
    height={CANVAS_SIZES.medium.height}
    showInfo={true}
    showControls={true}
    autoRotate={false}
    {...props}
  />
);

// Large 3D Canvas - for detailed viewing
export const Large3DCanvas = ({ fileUrl, fileName, ...props }) => (
  <Standard3DCanvas
    fileUrl={fileUrl}
    fileName={fileName}
    width={CANVAS_SIZES.large.width}
    height={CANVAS_SIZES.large.height}
    showInfo={true}
    showControls={true}
    autoRotate={false}
    {...props}
  />
);

// Square 3D Canvas - for uniform layouts
export const Square3DCanvas = ({
  fileUrl,
  fileName,
  size = "medium",
  ...props
}) => {
  const dimensions =
    CANVAS_SIZES[`square_${size}`] || CANVAS_SIZES.square_medium;

  return (
    <Standard3DCanvas
      fileUrl={fileUrl}
      fileName={fileName}
      width={dimensions.width}
      height={dimensions.height}
      showInfo={true}
      showControls={true}
      autoRotate={false}
      {...props}
    />
  );
};

// Wide 3D Canvas - for banner-style displays
export const Wide3DCanvas = ({
  fileUrl,
  fileName,
  ultrawide = false,
  ...props
}) => {
  const dimensions = ultrawide ? CANVAS_SIZES.ultrawide : CANVAS_SIZES.wide;

  return (
    <Standard3DCanvas
      fileUrl={fileUrl}
      fileName={fileName}
      width={dimensions.width}
      height={dimensions.height}
      showInfo={true}
      showControls={true}
      autoRotate={true}
      {...props}
    />
  );
};

// Responsive 3D Canvas - adapts to container
export const Responsive3DCanvas = ({
  fileUrl,
  fileName,
  maxWidth = 600,
  aspectRatio = 4 / 3,
  ...props
}) => {
  const width = Math.min(maxWidth, window.innerWidth - 40);
  const height = width / aspectRatio;

  return (
    <Standard3DCanvas
      fileUrl={fileUrl}
      fileName={fileName}
      width={width}
      height={height}
      showInfo={true}
      showControls={true}
      autoRotate={false}
      {...props}
    />
  );
};

// Gallery 3D Canvas - optimized for artwork galleries
export const Gallery3DCanvas = ({ fileUrl, fileName, ...props }) => (
  <Standard3DCanvas
    fileUrl={fileUrl}
    fileName={fileName}
    width={CANVAS_SIZES.medium.width}
    height={CANVAS_SIZES.medium.height}
    showInfo={true}
    showControls={true}
    autoRotate={false}
    backgroundColor="#2a2a2a"
    cameraPosition={[0, 0, 4]}
    {...props}
  />
);

// Preview 3D Canvas - for upload previews
export const Preview3DCanvas = ({ fileUrl, fileName, ...props }) => (
  <Standard3DCanvas
    fileUrl={fileUrl}
    fileName={fileName}
    width={CANVAS_SIZES.small.width}
    height={CANVAS_SIZES.small.height}
    showInfo={true}
    showControls={false}
    autoRotate={true}
    backgroundColor="#1e1e1e"
    {...props}
  />
);

// Card 3D Canvas - for artwork cards
export const Card3DCanvas = ({ fileUrl, fileName, ...props }) => (
  <Standard3DCanvas
    fileUrl={fileUrl}
    fileName={fileName}
    width={CANVAS_SIZES.square_small.width}
    height={CANVAS_SIZES.square_small.height}
    showInfo={false}
    showControls={false}
    autoRotate={true}
    backgroundColor="#1a1a1a"
    {...props}
  />
);

export default {
  Standard3DCanvas,
  Thumbnail3DCanvas,
  Small3DCanvas,
  Medium3DCanvas,
  Large3DCanvas,
  Square3DCanvas,
  Wide3DCanvas,
  Responsive3DCanvas,
  Gallery3DCanvas,
  Preview3DCanvas,
  Card3DCanvas,
  CANVAS_SIZES,
};
