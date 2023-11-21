import FaqComponent from "../home/components/sections/FaqComponent";

export const metadata = {
  title: 'FAQ'
}

export default function Faq() {
  return <FaqComponent home={false} />;
}
