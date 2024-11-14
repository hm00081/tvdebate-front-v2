// export default Home;
/* eslint-disable no-unused-vars */
// import { Button, Checkbox } from "antd";
import { useState } from "react";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom"; // Link 를 사용하기 위해 임포트
// import Axios from "axios";
import { TermType } from "../ConceptualRecurrencePlot/DataImporter";

// ... (기타 임포트 내용)
interface ComponentProps {}

function Home(props: ComponentProps) {
  const [termType, setTermType] = useState<TermType>("compound_term");

  return (
    <div className={styles.home}>
      <div className={styles.serviceTitle}>MetaDebateVis</div>
      <div className={styles.links}>
        <Link
          to={`/coocurence_matrix?debate_name=모병제&term_type=${termType}`}
          className={`${styles.button} ant-btn ant-btn-primary`}
        >
          Recruitment system(모병제)
        </Link>
      </div>
    </div>
  );
}

export default Home;
