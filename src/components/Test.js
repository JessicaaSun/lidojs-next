"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

import axios from "axios";
import { isArray } from "lodash";
import { Editor, GetFontQuery, PageControl } from "@lidojs/editor";
import { FontData } from "@lidojs/core";
import HeaderLayout from "./layouts/HeaderLayout";
import PreviewModal from "./PreviewModal";
import Sidebar from "./layouts/Sidebar";
import AppLayerSettings from "./layouts/AppLayerSettings";
import EditorContent from "./pages/EditorContent";

const Test = () => {
  const leftSidebarRef = useRef(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [viewPortHeight, setViewPortHeight] = useState(0);

  const getFonts = useCallback(async (query) => {
    const buildParams = (data) => {
      const params = new URLSearchParams();

      Object.entries(data).forEach(([key, value]) => {
        if (isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.append(key, value);
        }
      });

      return params;
    };
    const res = await axios.get(`/fonts?${buildParams(query)}`);
    return res.data;
  }, []);
  const windowHeight = () => {
    try {
      const height = window?.innerHeight;
      setViewPortHeight(height);
    } catch (error) {
      console.log("-->", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", windowHeight);
      windowHeight();
      return () => {
        window.removeEventListener("resize", windowHeight);
      };
    }
  }, [viewPortHeight]);

  if (viewPortHeight === 0) {
    return "Loading";
  }
  return (
    <Editor
      config={{
        assetPath: "./assets",
        frame: {
          defaultImage: {
            url: `./assets/images/frame-placeholder.png`,
            width: 1200,
            height: 800,
          },
        },
      }}
      getFonts={getFonts}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          height: "100vh",
          maxHeight: viewPortHeight ? `${viewPortHeight}px` : "auto",
        }}
      >
        <HeaderLayout openPreview={() => setOpenPreview(true)} />
        {openPreview && <PreviewModal onClose={() => setOpenPreview(false)} />}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flex: "auto",
            overflow: "auto",
            background: "#EBECF0",
            "@media (maxWidth: 900px)": {
              flexDirection: "column-reverse",
            },
          }}
        >
          <div
            ref={leftSidebarRef}
            style={{
              display: "flex",
              background: "white",
            }}
          >
            <Sidebar />
          </div>
          <div
            style={{
              flexGrow: 1,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
            }}
          >
            <AppLayerSettings />
            <div
              style={{
                flexGrow: 1,
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <EditorContent />
            </div>
            <div
              style={{
                height: 40,
                background: "#fff",
                borderTop: "1px solid rgba(57,76,96,.15)",
                display: "grid",
                alignItems: "center",
                flexShrink: 0,
                "@media (maxWidth: 900px)": {
                  display: "none",
                },
              }}
            >
              <PageControl />
            </div>
          </div>
        </div>
      </div>
    </Editor>
  );
};

export default Test;
