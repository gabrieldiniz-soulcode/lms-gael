export { };

declare global {
    interface Window {
        zE?: (command: string, action: string) => void;
    }
}