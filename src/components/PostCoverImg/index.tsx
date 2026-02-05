import Image from "next/image";
import Link from "next/link";

type PostCoverImgPros = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export function PostCoverImg({ src, width, height, alt }: PostCoverImgPros) {
  return (
    <Link className="w-full h-full overflow-hidden rounded-xl" href="#">
      <Image
        className="w-full h-full object-cover object-center group-hover:scale-105 transition"
        src={src}
        width={width}
        height={height}
        alt={alt}
        priority
      />
    </Link>
  );
}
