import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function SeatingSection({ productId, seatMap, breakpoint }) {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/get_seat?product_id=${productId}`
        );
        setSeats(response.data.seat);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };

    fetchSeats();
  }, [productId]);

  const renderSeat = (seatObj, index) => {
    const { type, id, row, column, labelLength } = seatObj;
    let className = "seat";
    let content = seatObj.content;
  
    if (type === "seat") {
      // 座席のロジックは同じままです
      const seatData = seats.find(
        (seat) => seat.row === row && seat.column === column
      );
      const isReserved = seatData ? seatData.is_reserved : false;
      const isAvailable = seatData ? seatData.is_enable : false;
  
      className += isAvailable
        ? isReserved
          ? " reserved"
          : " available"
        : " empty";
      content = isReserved ? "済" : `${row}${column}`;
  
      // Seat は Button としてレンダリング
      return (
        <Button key={`${id}-${index}`} className={`${className} text-black`}>
          {content}
        </Button>
      );
    } else if (type === "label") {
      className += " label";
      content = labelLength && content ? content.substring(0, labelLength) : content;
  
      const style = labelLength ? { minWidth: `${labelLength}ch` } : {};
  
      // Label は div としてレンダリング
      return (
        <div key={`${id}-${index}`} className={`${className} text-black`} style={style}>
          {content}
        </div>
      );
    }

    const style =
      type === "label" && labelLength ? { minWidth: `${labelLength}ch` } : {};

    return (
      <div key={`${seatObj.id}-${index}`} className={`${className} text-black`} style={style}>
        {content}
      </div>
    );
  };

  const renderRows = () => {
    let rows = [];
    let currentRow = []; // 行の座席を保持するための配列
    let currentIndex = 0; // 行のインデックス

    seatMap.forEach((seatObj, index) => {
      if (seatObj.type === "seat") {
        // 通常の座席を現在の行に追加する
        currentRow.push(renderSeat(seatObj));

        // breakpointに達したか、Enterがtrueの場合、新しい行を開始する
        if (currentRow.length === breakpoint || seatObj.Enter) {
          rows.push(
            <div key={`row-${currentIndex}`} className="seat-row">
              {currentRow}
            </div>
          );
          currentIndex++; // 行のインデックスをインクリメント
          currentRow = []; // 新しい行のために行の配列をリセットする
        }
      } else if (seatObj.type === "label") {
        // ラベルの場合は新しい行に追加する
        if (currentRow.length > 0) {
          // 現在の行が空でない場合、先に現在の行を追加する
          rows.push(
            <div key={`row-${currentIndex}`} className="seat-row">
              {currentRow}
            </div>
          );
          currentIndex++;
          currentRow = [];
        }
        rows.push(
          <div key={`row-${currentIndex}`} className="seat-row">
            {renderSeat(seatObj)}
          </div>
        );
        currentIndex++;
      }
    });

    // 最後の行に残った座席を追加する
    if (currentRow.length > 0) {
      rows.push(
        <div key={`row-${currentIndex}`} className="seat-row">
          {currentRow}
        </div>
      );
    }

    return rows;
  };

  return <div className="seating-chart">{renderRows()}</div>;
}
