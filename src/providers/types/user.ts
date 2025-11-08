export interface UserDto {
    name?: string;
    sipName?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'supervisor'
}