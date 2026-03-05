import {PaginatedPageModel} from "./PaginatedPageModel";

export interface  PaginatedModel {
    total_items: number;
    total_pages: number;
    prev: null | PaginatedPageModel;
    next: null | PaginatedPageModel;
    items: [];
}