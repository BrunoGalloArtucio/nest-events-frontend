import { useSearchParams } from "react-router-dom";

export function usePageParam() {
    const [searchParams] = useSearchParams();

    const page = searchParams.get("page");

    if (!page || isNaN(Number(page))) {
        return 1;
    }

    return Math.max(1, Number(page));
}
