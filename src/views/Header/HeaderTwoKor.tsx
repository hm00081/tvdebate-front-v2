import React from "react";
import style from "./HeaderTwo.module.scss";
// import Group from "./Header.svg";
import Group from "./HeaderTwo.svg";

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ isOpen, setIsOpen }: HeaderProps) {
  return (
    <div className={style.mainLink}>
      <div className={style.naviTwo}>
        {/* SVG 렌더링 */}
        <img
          src={Group}
          alt="Header SVG"
          style={{
            width: "auto",
            height: "auto",
            marginTop: "10px",
          }}
        />
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            marginLeft: "20px",
            marginBottom: "15px",
            background: "#9c27b0",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {isOpen ? "Hide Script" : "View Script"}
        </button>
      </div>
    </div>
  );
}
