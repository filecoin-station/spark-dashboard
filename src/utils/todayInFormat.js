export function todayInFormat() {
    const currentDate = new Date(Date.now());
    return currentDate.toISOString().split('T')[0];
}
