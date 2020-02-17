export const areArraysUnequal = (arr1, arr2, limitKeyComparison: string = '') => {
    if (arr1.length !== arr2.length) {
        return true;
    }
    if (limitKeyComparison === '') {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return true;
            }
        }
    } else {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i][limitKeyComparison] !== arr2[i][limitKeyComparison]) {
                return true;
            }
        }
    }
    return false;
};
