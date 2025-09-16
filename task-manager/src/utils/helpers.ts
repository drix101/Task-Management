export const makeId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;


export const formatDate = (ts: number | null): string => {
if (!ts) return "";
try {
return new Date(ts).toLocaleDateString();
} catch (e) {
return "";
}
};