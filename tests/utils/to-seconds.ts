export default function toSeconds(str: string): number {
    const [m, s] = str.split(':').map(Number);
    return m * 60 + s;
}
