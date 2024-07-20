export interface Validation<T> {
    rule: (value: T) => boolean;
    message: string;
}