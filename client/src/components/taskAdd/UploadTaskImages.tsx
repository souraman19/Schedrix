import Image from "next/image";
import React, { useEffect } from "react";

export default function UploadTaskImages({
  selectedImages,
  setSelectedImages,
  errors,
  labelStyle,
}: {
  selectedImages: { file: File; url: string }[];
  setSelectedImages: React.Dispatch<
    React.SetStateAction<{ file: File; url: string }[]>
  >;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  inputStyle: Record<string, string>;
  labelStyle: Record<string, string>;
}) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newImages = Array.from(e.target.files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(selectedImages[index].url);
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      // Cleanup function to revoke object URLs when component unmounts only
      selectedImages.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, [selectedImages]);

  useEffect(() => {
    // console.log("Selected Images:", selectedImages);
  }, [selectedImages]);

  return (
    <>
      <label style={labelStyle}>Upload Images</label>
      <label
        style={{
          display: "inline-block",
          padding: "8px 16px",
          background: "grey",
          color: "#fff",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Select Images
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          name="image"
          style={{ display: "none" }}
        />
      </label>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "1rem",
        }}
      >
        {selectedImages.length > 0 &&
          selectedImages.map((image, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                width: "100px",
                height: "100px",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #ccc",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Image
                src={image.url}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  backgroundColor: "#f44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: "1",
                  boxShadow: "0 0 6px rgba(0,0,0,0.2)",
                }}
                title="Remove image"
              >
                ×
              </button>
            </div>
          ))}
      </div>

      {errors.image && (
        <div style={{ color: "red", marginTop: "8px" }}>{errors.image}</div>
      )}
    </>
  );
}
