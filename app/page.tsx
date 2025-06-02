import Image from "next/image";
import Button from "antd"
import Link from "next/link";

export default function Home() {
  return (
   <div className="flex ">
      <Link href="/single_choice">单选题</Link>
     <Link href="/multiple_choice">多选题</Link>
   </div>
  );
}
