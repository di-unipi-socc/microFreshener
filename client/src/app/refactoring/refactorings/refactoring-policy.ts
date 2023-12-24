export interface RefactoringPolicy {
    isAllowed(): boolean;
    whyNotAllowed(): string;
}