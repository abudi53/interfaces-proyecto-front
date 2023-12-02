export class User {
    constructor(
        public id: number,
        public name: string,
        public secondName: string,
        public cedula: string,
        public email: string,
        public password: string,
        public phone: string,
        public address: string,
        public city: string,
        public country: string,
        public state: string,
        public admin?: boolean
    ) { }

}