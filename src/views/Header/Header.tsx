import style from "./Header.module.scss";
import React from "react";

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ isOpen, setIsOpen }: HeaderProps) {
  return (
    <a className={style.mainLink}>
      <div className={style.navi}>MetaDebateVis</div>
    </a>
  );
}
