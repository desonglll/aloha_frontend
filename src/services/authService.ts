import api from "./api";

interface LoginCredentials {
    username: string;
    password: string;
}

interface LoginResponse {
    user_id: string;
    username: string;
    user_group_id?: string | null;
}

/**
 * Login user with username and password
 */
export const login = async (
    credentials: LoginCredentials
): Promise<LoginResponse> => {
    try {
        console.log(credentials)
        const response: {
            user_id: string,
            username: string,
            user_group_id: string
        } = await api.post("/api/auth/login", credentials);

        // Store user info in localStorage only if login was successful
        if (response.user_id) {
            localStorage.setItem("user_id", response.user_id);
            localStorage.setItem("username", response.username);
            if (response.user_group_id) {
                localStorage.setItem("user_group_id", response.user_group_id);
            }
        }

        return response;
    } catch (error) {
        console.error("Login failed:", error);
        // Clear any existing user data on login failure
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        localStorage.removeItem("user_group_id");
        throw error;
    }
};

/**
 * Logout user
 */
export const logout = async () => {
    try {
        await api.post("/api/auth/logout");
    } catch (error) {
        console.error("Logout failed:", error);
    } finally {
        // Clear user data from localStorage regardless of API call success
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        localStorage.removeItem("user_group_id");
    }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("user_id");
};

/**
 * Get current user info
 */
export const getCurrentUser = (): {
    user_id: string | null;
    username: string | null;
    user_group_id: string | null;
} => {
    return {
        user_id: localStorage.getItem("user_id"),
        username: localStorage.getItem("username"),
        user_group_id: localStorage.getItem("user_group_id"),
    };
};
