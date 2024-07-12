export default interface UserContextType {
    username: string | null;
    role: string | null;
    isLoggedIn: boolean;
    signOut: () => void;
}
