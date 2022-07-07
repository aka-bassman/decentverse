import dynamic from "next/dynamic";
import styles from "./index.module.css";

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  const ReactverseWithNoSSR = dynamic(import("../components/ReactverseWrapper"), { ssr: false });
  return (
    <div className={styles.page}>
      <ReactverseWithNoSSR />
    </div>
  );
}

export default Index;
