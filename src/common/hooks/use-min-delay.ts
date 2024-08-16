import { useEffect, useState } from "react";

export function useMinDelay(minDelayMs: number, value: boolean) {
    const [wasDelayElapsed, setWasDelayedElapsed] = useState<boolean>();

    useEffect(() => {
        const timeout = setTimeout(
            () => setWasDelayedElapsed(true),
            minDelayMs
        );
        return () => clearTimeout(timeout);
    }, [minDelayMs]);

    return value && wasDelayElapsed;
}
