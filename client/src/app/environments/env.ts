
export const env = (process.env.NODE_ENV === 'production') ? require('./environment.prod.ts') : require('./environment.ts');


