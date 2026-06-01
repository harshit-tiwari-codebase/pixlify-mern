import {createContext , useState , useEffect} from 'react';

import { login , register , getMe } from './services/auth.api';

export const authContext = createContext();

export function AuthProvider({children}){
     const [user, setuser] = useState(null);
     const [loading, setloading] = useState(false);

     const handleLogin = async (username, password) => {
        setloading(true);
        try {
            const response = await login(username, password);
            setuser(response.user);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setloading(false);
        }
     }

     const handleRegister = async (username, email, password) => {
        setloading(true);
        try {
            const response = await register(username, email, password);
            setuser(response.user);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
             setloading(false);
        }
     }

     return (
        <authContext.Provider value={{user , loading , handleLogin , handleRegister}}>
            {children}
        </authContext.Provider>
     )
}