import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="absolute top-4 left-4 z-30 p-2">
      <Loader2 className="animate-spin h-7 w-7" />
    </div>
  );
}
