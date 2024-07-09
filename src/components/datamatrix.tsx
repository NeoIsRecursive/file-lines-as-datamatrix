import { BakeryColor } from "@barcode-bakery/barcode-react";
import { BakeryDatamatrix } from "@barcode-bakery/barcode-react/datamatrix";
import { memo } from "react";

export const Datamatrix = memo(({ data }: { data: string }) => {
  const colorBlack = new BakeryColor(0, 0, 0);
  const colorWhite = new BakeryColor(255, 255, 255);

  return (
    <BakeryDatamatrix
      scale={12}
      foregroundColor={colorBlack}
      backgroundColor={colorWhite}
      text={data}
    />
  );
});
