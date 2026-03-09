import {PaginatedPageModel} from "./PaginatedPageModel";

export interface  PaginatedModel<T> {
    total_items: number;
    total_pages: number;
    prev: null | PaginatedPageModel;
    next: null | PaginatedPageModel;
    data: T[];
}