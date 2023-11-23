"use client";
import React, { forwardRef, useRef } from "react";
import PlayCircleIcon from "@duyank/icons/regular/PlayCircle";

import { useEditor } from "@lidojs/editor";
import { downloadObjectAsJson } from "@/utils/download";


const HeaderLayout = forwardRef(function HeaderLayout({ openPreview }, ref) {
  const uploadRef = useRef(null);
  const { actions, query } = useEditor();

  const handleExport = () => {
    downloadObjectAsJson("file", query.serialize());
  };

  const handleImport = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const fileContent = JSON.parse(reader.result);
        actions.setData(fileContent);
      };
      reader.readAsText(file);
      e.target.value = "";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        background: "#1E1E2D",
        padding: "12px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        "@media (max-width: 900px)": {
          padding: 12,
        },
      }}
    >
      <div
        style={{
          color: "#3d8eff",
          fontSize: 36,
        }}
      >
        <div style={{ color: "white", height: 46 }}>
          <img src={"./assets/logo.png"} style={{ maxHeight: "100%" }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            margin: "0 16px",
            cursor: "pointer",
            color: "#fff",
            fontWeight: 700,
            ":hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => uploadRef.current?.click()}
        >
          <input
            ref={uploadRef}
            type="file"
            accept="application/json"
            onChange={handleImport}
            style={{ display: "none" }}
          />
          Import
        </div>
        <div
          style={{
            margin: "0 16px",
            cursor: "pointer",
            color: "#fff",
            fontWeight: 700,
            ":hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => handleExport()}
        >
          Export
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#fff",
            lineHeight: 1,
            background: "#3a3a4c",
            padding: "8px 14px",
            borderRadius: 8,
            cursor: "pointer",
            ":hover": {
              background: "rgba(58,58,76,0.5)",
            },
          }}
          onClick={openPreview}
        >
          <div style={{ marginRight: 4, fontSize: 20 }}>
            <PlayCircleIcon />
          </div>{" "}
          Preview
        </div>
      </div>
    </div>
  );
});

export default HeaderLayout;
