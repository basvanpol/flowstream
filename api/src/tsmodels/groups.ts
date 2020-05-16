export interface IGroup {
    _id: number;
    _user: number;
    title: string,
    icon: { 
        type: number, 
        value: string 
    },
    canUserEdit?: boolean
}