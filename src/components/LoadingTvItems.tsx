import { Skeleton } from "./ui/skeleton"

export default function LoadingTvItems() {
  return (
    <>
      {Array(6).fill(0).map((_, i) => (
        <Skeleton key={i} className="w-[350px] h-[140px] rounded-md" />
      ))}
    </>
  )
}
