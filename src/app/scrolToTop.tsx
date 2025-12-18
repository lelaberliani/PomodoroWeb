import { useEffect } from "react";

interface Props {
  activeTab: string;
}

const ScrollToTop = ({ activeTab }: Props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return null;
};

export default ScrollToTop;
