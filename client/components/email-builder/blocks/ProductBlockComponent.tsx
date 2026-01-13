import React from "react";
import { ProductBlock } from "../types";
import { ShoppingCart } from "lucide-react";

interface ProductBlockComponentProps {
  block: ProductBlock;
  isSelected: boolean;
}

export const ProductBlockComponent: React.FC<ProductBlockComponentProps> = ({
  block,
  isSelected,
}) => {
  const imageMargin = {
    left: "0 auto 12px 0",
    right: "0 0 12px auto",
    center: "0 auto 12px auto",
  };

  const imageAlignment = {
    left: "flex-start",
    right: "flex-end",
    center: "center",
  };

  return (
    <div
      className={`relative p-4 transition-all ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
    >
      <div
        style={{
          textAlign: block.alignment as any,
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: imageAlignment[block.imagePosition] || "center",
            marginBottom: "12px",
          }}
        >
          {block.image ? (
            <img
              src={block.image}
              alt={block.title}
              style={{
                maxWidth: "300px",
                height: "auto",
                borderRadius: "4px",
              }}
            />
          ) : (
            <div
              style={{
                width: "300px",
                height: "200px",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
              }}
            >
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: "0 0 8px 0",
            color: "#333",
          }}
        >
          {block.title}
        </h3>

        <p
          style={{
            fontSize: "14px",
            color: "#666",
            margin: "0 0 12px 0",
            lineHeight: "1.5",
          }}
        >
          {block.description}
        </p>

        <p
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#FF6A00",
            margin: "0 0 16px 0",
          }}
        >
          {block.price}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent:
              block.alignment === "center"
                ? "center"
                : block.alignment === "right"
                  ? "flex-end"
                  : "flex-start",
          }}
        >
          <a
            href={block.buttonLink}
            style={{
              backgroundColor: "#FF6A00",
              color: "white",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {block.buttonText}
          </a>
        </div>
      </div>
    </div>
  );
};
