import React, { useState, useEffect, useRef } from "react";

import Draggable from "react-draggable";

const CropTool = ({ imageDetails }) => {
  const cropLength = 512;
  const { image, image_res } = imageDetails;
  const [originalImgWidth, originalImgHeight] = image_res;

  const [cropBoxLength, setCropBoxLength] = useState();
  const [cropBounds, setGridBounds] = useState();

  const imageRef = useRef();

  useEffect(() => {
    const { width, height, top, left } =
      imageRef.current.getBoundingClientRect();

    console.log(width, originalImgWidth);
    console.log(width, height, top, left);

    setCropBoxLength((width / originalImgWidth) * cropLength);

    setGridBounds({
      top,
      left,
      right: left + width - cropBoxLength,
      bottom: top + height - cropBoxLength,
    });
  }, []);

  return (
    <>
      <h2>Crop tool</h2>

      {originalImgWidth === cropLength && originalImgHeight === cropLength ? (
        <label>
          The image provided matches the resolution required by the Deep
          Learning model ({cropLength}x{cropLength}). Please just confirm the
          image below is the image you intend to submit for classification.
        </label>
      ) : originalImgWidth > cropLength || originalImgHeight > cropLength ? (
        <label>
          The image submitted has a higher resolution than the Deep Learning
          model's required resolution ({cropLength}x{cropLength}). Please use
          our cropping tool to select what part of the image best represents the
          skin lesion.
        </label>
      ) : originalImgWidth < cropLength || originalImgHeight < cropLength ? (
        <label>
          Our Deep Learning model requires images of resolution {cropLength}x
          {cropLength}. The{" "}
          {originalImgWidth < originalImgHeight ? "width" : "height"} is less
          than {cropLength} pixels. Our application will upscale and resize the
          image to {cropLength} pixels but this could reduce accuracy so taking
          a higher resolution image should be consider if possible.
        </label>
      ) : null}

      <div>
        {cropBoxLength != null && (
          <Draggable bounds={cropBounds}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: cropBoxLength,
                height: cropBoxLength,
                backgroundColor: "rgba(0, 168, 107, 0.5)",
                zIndex: 2,
              }}
            ></div>
          </Draggable>
        )}

        <img
          ref={imageRef}
          style={{ maxWidth: "95%" }}
          alt="uploaded skin lesion"
          src={`data:image/png;base64, ${image}`}
        />
      </div>
    </>
  );
};

export default CropTool;
