import "./stickers.css";

import { useStore } from "@nanostores/react";
import { type DragHandlers, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { getRandomValueBetween } from "../../helpers";
import { incrementTopZIndex, topZIndex } from "../../stores/sam";

interface VariantData {
  path: string;
  srcSet: string;
  src: string;
  alt: string;
}

const variantsData: VariantData[] = [
  {
    path: "M4 4h392.732v395.736H4Z ",
    srcSet: "/images/sam/sam1.webp",
    src: "/images/sam/sam1.png",
    alt: "blahzilla",
  },
  {
    path: "M66,200a134,134 0 1,0 268,0a134,134 0 1,0 -268,0",
    srcSet: "/images/sam/sam2.webp",
    src: "/images/sam/sam2.png",
    alt: "blahzilla",
  },
  {
    path: "M66,200a134,134 0 1,0 268,0a134,134 0 1,0 -268,0",
    srcSet: "/images/sam/sam3.webp",
    src: "/images/sam/sam3.png",
    alt: "blah",
  },
  {
    path: "M66,200a134,134 0 1,0 268,0a134,134 0 1,0 -268,0",
    srcSet: "/images/sam/sam4.webp",
    src: "/images/sam/sam4.png",
    alt: "ba",
  },
  {
    path: "M66,200a134,134 0 1,0 268,0a134,134 0 1,0 -268,0",
    srcSet: "/images/sam/sam5.webp",
    src: "/images/sam/sam5.png",
    alt: "Sb",
  },
  {
    path: "M4 4h392.732v395.736H4Z",
    srcSet: "/images/sam/sam6.webp",
    src: "/images/sam/sam6.png",
    alt: "blah",
  },
  {
    path: "M66,200a134,134 0 1,0 268,0a134,134 0 1,0 -268,0",
    srcSet: "/images/sam/sam7.webp",
    src: "/images/sam/sam7.png",
    alt: "blah",
  },
  {
    path: "M4 4h392.732v395.736H4Z",
    srcSet: "/images/sam/sam8.webp",
    src: "/images/sam/sam8.png",
    alt: "ba",
  },
  {
    path: "M4 4h392.732v395.736H4Z",
    srcSet: "/images/sam/sam9.webp",
    src: "/images/sam/sam9.png",
    alt: "ba",
  },
  {
    path: "M66,200a134,134 0 1,0 268,0a134,134 0 1,0 -268,0",
    srcSet: "/images/sam/sam10.webp",
    src: "/images/sam/sam10.png",
    alt: "b",
  },
  {
    path: "M4 4h392.732v395.736H4ZZ",
    srcSet: "/images/sam/sam11.webp",
    src: "/images/sam/sam11.png",
    alt: "b",
  },
  {
    path: "M4 4h392.732v395.736H4Z",
    srcSet: "/images/sam/sam12.webp",
    src: "/images/sam/sam12.png",
    alt: "babbbaaaa",
  },
  {
    path: "M4 4h392.732v395.736H4Z",
    srcSet: "/images/sam/sam13.webp",
    src: "/images/sam/sam13.png",
    alt: "",
  },
];

export interface StickerProps {
  /**
   * The unique identifier for the sticker.
   */
  id: string;

  /**
   * The variant of the sticker to display.
   * There are 13 variants total.
   */
  variant: number;
}

export const Sticker = ({ variant }: StickerProps) => {
  // Pixel buffer to prevent stickers from going off the canvas when placed randomly
  const BUFFER = 200;

  const totalVariants = variantsData.length;
  const currentVariant = variant % totalVariants;
  const nextVariant = (variant + 1) % totalVariants;

  useEffect(() => {
    // Preload next variant to display
    new Image().src = variantsData[nextVariant].srcSet;
  }, [nextVariant]);

  const $topZIndex = useStore(topZIndex);
  const [zIndex, setZIndex] = useState($topZIndex);
  const [x, setX] = useState(
    getRandomValueBetween(0, window.innerWidth - BUFFER),
  );
  const [y, setY] = useState(
    getRandomValueBetween(0, window.innerHeight - BUFFER),
  );
  const [rotate] = useState(getRandomValueBetween(-10, 10));

  // Twist in animation
  const initialRotation = rotate + getRandomValueBetween(-25, 25);

  const handleDragStart: DragHandlers["onDragStart"] = () => {
    incrementTopZIndex();
    setZIndex($topZIndex);
  };

  const handleDragEnd: DragHandlers["onDragEnd"] = (_, info) => {
    const { x, y } = info.point;
    setX(x);
    setY(y);
  };

  const getNearestOffCanvasCoordinates = (
    x: number,
    y: number,
    offset: number,
  ): { x: number; y: number } => {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    // Calculate the center of the canvas
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // Calculate the vector from the input point to the center of the canvas
    const dx = x - centerX;
    const dy = y - centerY;

    // Calculate the angle of the vector
    const angle = Math.atan2(dy, dx);

    // Calculate the off-canvas coordinates by moving in the direction of the angle
    // by the specified offset, taking the point off the canvas
    const offCanvasX = x + Math.cos(angle) * (canvasWidth / 2 + offset);
    const offCanvasY = y + Math.sin(angle) * (canvasHeight / 2 + offset);

    return { x: offCanvasX, y: offCanvasY };
  };

  return (
    <motion.div
      className="sticker"
      initial={{ opacity: 0, x, y, scale: 2, rotate: initialRotation }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate,
        transition: {
          type: "spring",
          damping: 9,
          mass: 0.2,
          stiffness: 60,
        },
      }}
      exit={{
        ...getNearestOffCanvasCoordinates(x, y, 400),
        rotate: getRandomValueBetween(-90, 90),
        transition: {
          type: "spring",
          mass: 4,
          delay: getRandomValueBetween(0.2, 0.7),
        },
      }}
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.3, cursor: "grabbing" }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ zIndex }}
      data-testid="samSticker"
    >
      <svg
        className="stickerSvg"
        width="400"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stickerPath"
          d={variantsData[currentVariant].path}
          fill="white"
        />
      </svg>
      <picture className="stickerPicture">
        <source
          srcSet={variantsData[currentVariant].srcSet}
          type="image/webp"
        />
        <img
          src={variantsData[currentVariant].src}
          alt={variantsData[currentVariant].alt}
          draggable="false"
        />
      </picture>
    </motion.div>
  );
};
