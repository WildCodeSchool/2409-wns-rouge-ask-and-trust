import { AuthChecker } from "type-graphql";
import { Context } from "../types/types";
import { whoami } from "../services/auth-service";

export const customAuthChecker: AuthChecker<Context> = async ({ context }, roles: string[]) => {
    const { cookies } = context;

    try {
        // Get the user from the database
        const user = await whoami(cookies);

        // Set the user in the context
        if (user) {
            context.user = user;
        }

        // Check if the user is an admin
        if (roles.length === 0) {
            return !!user;
        }

        // Check if the user is authenticated
        const isAuthenticated = !!user; // Return true if the user is authenticated

        // Check if the user has the required role
        const hasRole = roles.includes(user?.role || "");

        // Return true if the user is authenticated and has the required role
        return isAuthenticated && hasRole;
    } catch (error) {
        return false; // Return false if any error occurs
    }
};