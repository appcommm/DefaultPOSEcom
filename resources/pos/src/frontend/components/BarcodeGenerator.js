import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const BarcodeGenerator = ({ code }) => {
  const barcodeRef = useRef();

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, code, {
        format: "CODE128", // Barcode type
        width: 2, // Width of a single bar
        height: 50, // Height of the barcode
        displayValue: true, // Show the value below the barcode
      });
    }
  }, [code]);

  return (
    <div>
      <svg ref={barcodeRef}></svg>
    </div>
  );
};

export default BarcodeGenerator;
