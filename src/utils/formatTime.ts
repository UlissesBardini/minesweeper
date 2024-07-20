function leadingZeroes(n: number, length: number) {
    let result = `${n}`;
    while (result.length < length) result = '0' + result;
    return result;
}

export default function(time: number) {
    let seconds = time % 60;
    let minutes = Math.floor(time / 60);
    return `${leadingZeroes(minutes, 2)}:${leadingZeroes(seconds,2)}`;    
}