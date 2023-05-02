export default interface Message{
    id: string;
    message: string;
    name: string;
    encodingType: string;
    decodingKey: string;
}

export interface CreateMessage{
    message: string;
    name: string;
    decodingKey:string
}

export interface PatchMessage{
    message: string;
    decodingKey: string;
}