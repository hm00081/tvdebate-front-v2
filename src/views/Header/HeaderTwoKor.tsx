import style from "./HeaderTwo.module.scss";
import React from "react";

interface LegendProps {
  color: string | string[];
  label: string;
  svgPath?: string[];
}

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const participantColors = [
  { color: "#B60E3C", label: "이준석" },
  { color: "#C7611E", label: "박휘락" },
  { color: "#00AB6E", label: "김종대" },
  { color: "#00a0e2", label: "장경태" },
  { color: "#808080", label: "진행자" },
];

const topicColors = [
  { color: "#400000", label: "논쟁" },
  { color: "#ff0000", label: "논쟁구간" },
];

const LegendItem: React.FC<LegendProps> = ({ color, label }) => {
  const isOutlineOnly = label === "논쟁구간";

  const transform = isOutlineOnly
    ? "translate(8, 11.5) rotate(45) translate(-8, -8)"
    : "";

  let labelStyle = { marginTop: "-25px" };
  let svgStyle = {
    marginTop: "-22.5px",
    marginRight: "5px",
    marginLeft: "8px",
  }; // default style

  if (label === "논쟁") {
    //@ts-ignore
    labelStyle = { ...labelStyle, marginRight: "11px" };
    svgStyle = {
      marginTop: "-22.5px",
      marginRight: "5px",
      marginLeft: "139px",
    }; // changed style
  } else if (label === "논쟁구간") {
    //@ts-ignore
    labelStyle = { ...labelStyle, marginLeft: "25px" };
  }

  return (
    <>
      <svg width="16" height="16" style={svgStyle}>
        <rect
          width={isOutlineOnly ? "11" : "16"}
          height={isOutlineOnly ? "11" : "16"}
          //@ts-ignore
          fill={isOutlineOnly ? "none" : color}
          transform={transform}
          //@ts-ignore
          stroke={color}
          strokeWidth="1"
        />
      </svg>
      <div style={labelStyle}>{label}</div>
    </>
  );
};

export default function Header({ isOpen, setIsOpen }: HeaderProps) {
  return (
    <a className={style.mainLink}>
      <div
        className={style.naviTwo}
        style={{
          display: "flex",
          alignItems: "center",
          //justifyContent: "space-between",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <h3
            style={{ marginLeft: "5px", marginTop: "-18px", fontWeight: "550" }}
          >
            Legends:
          </h3>
          {participantColors.map((item, i) => (
            <LegendItem
              key={i}
              color={item.color}
              label={item.label}
            ></LegendItem>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "-55px",
            marginLeft: "-327px",
          }}
        >
          {topicColors.map((item, i) => (
            <LegendItem
              key={i}
              color={item.color}
              label={item.label}
            ></LegendItem>
          ))}
          <svg
            width="22"
            height="22"
            style={{
              marginBottom: "28px",
              marginLeft: "-290px",
              marginTop: "8px",
              scale: "0.9",
            }}
          >
            <path
              style={{
                fill: "#ffffff",
                marginLeft: "20px",
                strokeWidth: "1",
                stroke: "black",
              }}
              // d="M19.7,15.6h0.2c0.9,0,1.7-0.8,1.6-1.7c0-0.9-0.7-1.6-1.6-1.6h-0.4c0.9,0,1.7-0.8,1.7-1.7c0-0.9-0.8-1.7-1.7-1.7  h-1.2h-2c-1-0.4-1.3-1.2-1.4-2.1c0-0.7,0.1-1.4,0.2-2c0.2-0.8,0.3-1.7,0-2.5c-0.3-0.8-0.9-1.6-1.9-1.8c-0.3-0.1-0.6-0.1-0.9,0  c-0.4,0.2-0.6,0.6-0.6,1.1c0,0.4,0.1,0.8,0.2,1.3C12,3.5,12,4.1,11.8,4.7c-0.4,1.1-1.6,1.9-2.6,2.6C8.6,7.7,8,8.1,7.5,8.6  C7.2,8.8,7.2,8.9,7.1,9.2c0,0.1-0.1,0.5-0.3,0.5H5.2V8.8c0-0.1-0.1-0.3-0.3-0.3H1.1C1,8.5,0.8,8.6,0.8,8.8v12.5  c0,0.1,0.1,0.3,0.3,0.3h3.8c0.1,0,0.3-0.1,0.3-0.3v-1.2c0.8,0,1.6,0,2,0.5c0.2,0.2,0.3,0.4,0.5,0.5c0.6,0.4,1.7,0.2,2.4,0.2  c2.7,0,5.5,0,8.2,0h1c0.7,0,1.2-0.5,1.2-1.2c0-0.7-0.5-1.2-1.2-1.2l0.5,0h0.1c0.9,0,1.7-0.7,1.7-1.7C21.4,16.3,20.6,15.6,19.7,15.6z  "
              d="M9,2c3.9,0,7,3.1,7,7s-3.1,7-7,7s-7-3.1-7-7S5.1,2,9,2 M9,1C4.6,1,1,4.6,1,9c0,4.4,3.6,8,8,8c4.4,0,8-3.6,8-8
		C17,4.6,13.4,1,9,1L9,1z"
            />
          </svg>
          <div style={{ marginTop: "-23px", marginLeft: "2px" }}>찬성</div>
          <svg
            width="22"
            height="22"
            style={{
              marginBottom: "21px",
              marginLeft: "15px",
              scale: "0.85",
            }}
          >
            <path
              style={{
                fill: "#ffffff",
                marginLeft: "20px",
                strokeWidth: "1",
                stroke: "black",
              }}
              // d="M2.7,6.4H2.5c-0.9,0-1.7,0.8-1.6,1.7c0,0.9,0.7,1.6,1.6,1.6h0.4c-0.9,0-1.7,0.8-1.7,1.7c0,0.9,0.8,1.7,1.7,1.7  h1.2h2c1,0.4,1.3,1.2,1.4,2.1c0,0.7-0.1,1.4-0.2,2c-0.2,0.8-0.3,1.7,0,2.5c0.3,0.8,0.9,1.6,1.9,1.8c0.3,0.1,0.6,0.1,0.9,0  c0.4-0.2,0.6-0.6,0.6-1.1c0-0.4-0.1-0.8-0.2-1.3c-0.1-0.6-0.1-1.2,0.1-1.8c0.4-1.1,1.6-1.9,2.6-2.6c0.6-0.4,1.2-0.8,1.7-1.3  c0.2-0.2,0.3-0.3,0.4-0.6c0-0.1,0.1-0.5,0.3-0.5h1.7v0.9c0,0.1,0.1,0.3,0.3,0.3h3.8c0.1,0,0.3-0.1,0.3-0.3V0.7  c0-0.1-0.1-0.3-0.3-0.3h-3.8c-0.1,0-0.3,0.1-0.3,0.3v1.2c-0.8,0-1.6,0-2-0.5c-0.2-0.2-0.3-0.4-0.5-0.5c-0.6-0.4-1.7-0.2-2.4-0.2  c-2.7,0-5.5,0-8.2,0h-1c-0.7,0-1.2,0.5-1.2,1.2c0,0.7,0.5,1.2,1.2,1.2l-0.5,0H2.7C1.8,3.1,1,3.8,1,4.8C1,5.7,1.8,6.4,2.7,6.4z"
              d="M12,2.4c0.8,0,1.5,0.3,2,0.8l1.1,1.1c1.1,1.1,1.1,2.9,0,4l-0.4,0.4l-0.7,0.7l0.7,0.7l0.4,0.4c1.1,1.1,1.1,2.9,0,4L14,15.6
              c-0.5,0.5-1.3,0.8-2,0.8c-0.8,0-1.5-0.3-2-0.8l-0.4-0.4l-0.7-0.7l-0.7,0.7l-0.4,0.4c-0.5,0.5-1.2,0.8-2,0.8c-0.8,0-1.5-0.3-2-0.8
              l-1.1-1.1c-0.5-0.5-0.8-1.3-0.8-2c0-0.8,0.3-1.5,0.8-2l0.4-0.4l0.7-0.7L3.1,8.7L2.7,8.4c-1.1-1.1-1.1-2.9,0-4l1.1-1.1
              c0.5-0.5,1.3-0.8,2-0.8s1.5,0.3,2,0.8l0.4,0.4l0.7,0.7l0.7-0.7L10,3.2C10.5,2.7,11.2,2.4,12,2.4 M12,1.4c-1,0-2,0.4-2.7,1.1
              L8.9,2.9L8.6,2.5C7.8,1.8,6.8,1.4,5.9,1.4c-1,0-2,0.4-2.7,1.1L2,3.7C0.5,5.2,0.5,7.6,2,9.1l0.3,0.3L2,9.8c-1.5,1.5-1.5,3.9,0,5.4
              l1.1,1.1c0.7,0.7,1.7,1.1,2.7,1.1c1,0,2-0.4,2.7-1.1L8.9,16l0.4,0.4c0.7,0.7,1.7,1.1,2.7,1.1s2-0.4,2.7-1.1l1.1-1.1
              c1.5-1.5,1.5-3.9,0-5.4l-0.4-0.4L15.8,9c1.5-1.5,1.5-3.9,0-5.4l-1.1-1.1C14,1.8,13,1.4,12,1.4L12,1.4z"
            />
          </svg>
          <div style={{ marginTop: "-23px", marginLeft: "2px" }}>반대</div>
          <svg
            width="19"
            height="19"
            style={{ marginLeft: "108px", marginTop: "-19px" }}
          >
            <path
              d="M8,1.6C8,1.6,8,1.6,8,1.6L8,0C3.6,0,0,3.6,0,8h1.6C1.6,4.5,4.5,1.6,8,1.6z"
              style={{
                fill: "#ca6061",
                stroke: "#ca6061",
                strokeWidth: "1",
              }}
            ></path>
            <path
              d="M14.3,8H16c0-4.4-3.6-8-8-8v1.6C11.5,1.6,14.3,4.5,14.3,8z"
              style={{
                fill: "#C7611E",
                stroke: "#C7611E",
                strokeWidth: "1",
              }}
            ></path>
            <path
              d="M8,14.4c-3.5,0-6.4-2.8-6.4-6.4H0c0,4.4,3.6,8,8,8L8,14.4C8,14.4,8,14.4,8,14.4z"
              style={{
                fill: "#00AB6E",
                stroke: "#00AB6E",
                strokeWidth: "1",
              }}
            ></path>
            <path
              d="M14.3,8c0,3.5-2.8,6.4-6.3,6.4V16c4.4,0,8-3.6,8-8H14.3z"
              style={{
                fill: "#00a0e2",
                stroke: "#00a0e2",
                strokeWidth: "1",
              }}
            ></path>
          </svg>
          <div style={{ marginLeft: "-315px", marginTop: "28px" }}>
            {/* Circle Packing for Comparing Argumentation */}
          </div>
        </div>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            marginLeft: "380px",
            marginBottom: "20px",
            background: "#9c27b0",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {isOpen ? "Hide Script" : "View Script"}
        </button>
      </div>
    </a>
  );
}
