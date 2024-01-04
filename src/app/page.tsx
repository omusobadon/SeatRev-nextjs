// pages/index.js
"use client";
import React, { useState } from "react";
import SeatingSection from "@/components/Seat/SeatingSection"; // SeatingSectionのインポートを確認してください
import seatMapData from '@/lib/seatMapData.json';

export default function Home() {
  const customSeatMap = [];

  const [seatMaps, setSeatMaps] = useState(seatMapData);


  const [productId, setProductId] = useState("1"); // 選択されている product_id
  const [mode, setMode] = useState("1"); // 選択されているモード（教室か映画館か）

  // product_idが変更されたときのハンドラ
  const handleProductChange = (event) => {
    setProductId(event.target.value);
  };

  // モードが変更されたときのハンドラ
  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  return (
    <div>
      <h1>座席予約</h1>
      <select
        name="product_id"
        id="product_id"
        onChange={handleProductChange}
        value={productId}
      >
        <option value="1">product_id1</option>
        <option value="2">product_id2</option>
        <option value="3">product_id3</option>
      </select>
      <select
        className="ml-4"
        name="mode_select"
        id="mode_select"
        onChange={handleModeChange}
        value={mode}
      >
        <option value="1">教室</option>
        <option value="2">映画館</option>
      </select>
      <SeatingSection
        productId={productId}
        seatMap={seatMaps[mode]}
        breakpoint={8}
      />
    </div>
  );
}
