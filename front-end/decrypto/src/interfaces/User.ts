export default interface User{
        id:string
        name:string
        hashedPassword:string
        email:string,
        isBanned: boolean,
        banReason: null,
        isActivated: boolean,
        activationLink: string,
        iat: number,
        exp: number
}
