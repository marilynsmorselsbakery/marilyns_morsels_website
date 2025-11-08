"use client";

import { useEffect } from "react";
import Image from "next/image";

interface IngredientLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  labelUrl: string;
  cookieName: string;
}

export default function IngredientLabelModal({
  isOpen,
  onClose,
  labelUrl,
  cookieName,
}: IngredientLabelModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-morselGold/20">
          <h2 className="text-lg font-semibold">{cookieName} Ingredients</h2>
          <button
            onClick={onClose}
            className="text-morselBrown/70 hover:text-morselBrown transition text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="overflow-auto max-h-[calc(90vh-80px)] bg-white flex justify-center">
          <Image
            src={labelUrl}
            alt={`${cookieName} Ingredient Label`}
            width={800}
            height={1000}
            className="w-auto h-auto max-w-full"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}

