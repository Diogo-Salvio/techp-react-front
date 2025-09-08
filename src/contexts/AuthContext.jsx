import React, { createContext, useContext, useState, useEffect } from 'react';
import { musicService } from '../musicService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            const userData = localStorage.getItem('user_data');

            if (token && userData) {
                try {

                    const response = await musicService.getCurrentUser();
                    if (response.success) {
                        setUser(response.data);
                    } else {

                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('user_data');
                        setUser(null);
                    }
                } catch (error) {

                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_data');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            console.log('AuthContext: Iniciando login...');
            const response = await musicService.login(credentials);
            console.log('AuthContext: Resposta do login:', response);

            if (response.success) {
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('user_data', JSON.stringify(response.data.user));
                setUser(response.data.user);
                console.log('AuthContext: Usuário definido:', response.data.user);
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (error) {
            console.error('AuthContext: Erro no login:', error);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            await musicService.logout();
        } catch (error) {
            console.warn('Erro ao fazer logout no servidor:', error.message);
        } finally {

            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            setUser(null);
        }
    };

    const isAdmin = () => {
        console.log('AuthContext: Verificando se é admin. User:', user);
        console.log('AuthContext: user.role:', user?.role);
        console.log('AuthContext: user.is_admin:', user?.is_admin);
        console.log('AuthContext: user.admin:', user?.admin);

        return user && (
            user.role === 'admin' ||
            user.is_admin === true ||
            user.is_admin === 1 ||
            user.admin === true ||
            user.admin === 1
        );
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAdmin,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
