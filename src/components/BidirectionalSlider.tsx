import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { updateFilter } from "../redux/reducers/matrixFilterReducer";
import "./BidirectionalSlider.scss";

const BidirectionalSlider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<{ thumb: "min" | "max" | null }>({ thumb: null });
  const dispatch = useDispatch();
  const { filter } = useSelector((state: RootState) => state.matrixFilter);
  const [minValue, maxValue] = filter;
  const [tempMinValue, setTempMinValue] = useState(minValue);
  const [tempMaxValue, setTempMaxValue] = useState(maxValue);
  let min = minValue;
  let max = maxValue;

  const handleMouseDown = (thumb: "min" | "max") => {
    isDragging.current.thumb = thumb;
    document.addEventListener("mousemove", handleMouseMove);
    console.log('mouse down');
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!sliderRef.current || !isDragging.current.thumb) return;

    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const value = Math.round((offsetX / rect.width) * 100);
    if (isDragging.current.thumb === "min") {
      min = Math.min(Math.max(value, 0), tempMaxValue - 1)
      setTempMinValue(min);
    } else {
      max = Math.max(Math.min(value, 100), tempMinValue + 1)
      setTempMaxValue(max);
    }
  };

  const handleMouseUp = () => {
    isDragging.current.thumb = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    dispatch(updateFilter([min, max]));
  };

  return (
    <div className="slider-container" ref={sliderRef}>
      <div className="slider-track">
        <div
          className="slider-range"
          style={{ left: `${tempMinValue}%`, width: `${tempMaxValue - tempMinValue}%` }}
        ></div>

        <div
          className="slider-thumb slider-thumb-min"
          style={{ left: `${tempMinValue}%` }}
          onMouseDown={() => handleMouseDown("min")}
        >
          <span className="slider-value">{tempMinValue}</span>
        </div>

        <div
          className="slider-thumb slider-thumb-max"
          style={{ left: `${tempMaxValue}%` }}
          onMouseDown={() => handleMouseDown("max")}
        >
          <span className="slider-value">{tempMaxValue}</span>
        </div>
      </div>
    </div>
  );
};

export default BidirectionalSlider;
