import { useContext, useMemo } from "react";
import { PaginatorContext } from "./PaginatorProvider";
import { generatePages } from "./helpers";

// lib

type Values = {
    pages: number[];
};

export const useGeneratePages = (): Values => {
    // react hooks
    const { state } = useContext(PaginatorContext);

    // constants
    const { currentPage, innerLimit, outerLimit, pagesQuantity } = state;

    const pages = useMemo(
        () =>
            generatePages({
                currentPage,
                innerLimit,
                outerLimit,
                pagesQuantity,
            }),
        [currentPage, innerLimit, outerLimit, pagesQuantity]
    );

    return {
        pages,
    };
};
