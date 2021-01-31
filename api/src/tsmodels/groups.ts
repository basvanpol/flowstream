import * as mongoose from 'mongoose';

// export interface IGroup {
//     _id: number;
//     _user: number;
//     title: string,
//     icon: { 
//         type: number, 
//         value: string 
//     },
//     canUserEdit?: boolean
// }

export interface IGroup extends mongoose.Document {
    _user: number;
    title: string,
    _doc: mongoose.Document,
    icon: { 
        type: number, 
        value: string 
    },
    canUserEdit?: boolean
}