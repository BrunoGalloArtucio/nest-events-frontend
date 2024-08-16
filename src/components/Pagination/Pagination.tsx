import { ITEMS_PER_PAGE } from "../../common/constants";
import { activeStyles, normalStyles, separatorStyles } from "./constants";
import { PageGroup } from "./PageGroup";
import { Paginator } from "./Paginator";

interface PaginationProps {
    currentPage: number;
    totalElements: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    onPageChange,
    totalElements,
}: PaginationProps) {
    return (
        <Paginator
            currentPage={currentPage}
            pagesQuantity={Math.ceil(totalElements / ITEMS_PER_PAGE)}
            onPageChange={onPageChange}
            activeStyles={activeStyles}
            normalStyles={normalStyles}
            separatorStyles={separatorStyles}
        >
            <PageGroup align="center" />
        </Paginator>
    );
}
