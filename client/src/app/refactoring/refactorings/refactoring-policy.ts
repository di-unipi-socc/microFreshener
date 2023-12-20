export interface RefactoringPolicy {
    isAllowed(): Promise<void>;
}
