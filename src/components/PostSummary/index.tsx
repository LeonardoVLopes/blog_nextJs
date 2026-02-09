import { formatDatetime, formatRelativeDate } from "@/utils/format-datetime";
import { PostHeading } from "../PostHeading";
import { postRepository } from "@/repositories/post/json-post-repository";
import { postModel } from "@/models/post/post-model";

type PostSummaryProps = {
  postHeading: "h1" | "h2";
  postLink: string;
  createdAt: string;
  title: string;
  excerpt: string;
};
export function PostSummary({
  postHeading,
  postLink,
  createdAt,
  title,
  excerpt,
}: PostSummaryProps) {
  return (
    <div className="flex flex-col gap-4 sm:justify-center">
      <time
        dateTime={createdAt}
        className="text-slate-600 block text-sm/tight"
        title={formatRelativeDate(createdAt)}
      >
        {formatDatetime(createdAt)}
      </time>
      <PostHeading as="h2" url={postLink}>
        {title}
      </PostHeading>

      <p>{excerpt}</p>
    </div>
  );
}
