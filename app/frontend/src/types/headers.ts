/**
 * @category Headers
 * @packageDocumentation
 * Documentation for security and configuration headers used in the application
 */

/**
 * Security headers configuration for the application
 * @remarks
 * These headers are configured in the vite.config.ts file and are essential
 * for the application's security.
 */
export interface SecurityHeaders {
  /**
   * Content Security Policy (CSP)
   * @description
   * Defines allowed sources for different types of resources
   * - default-src: Restricts default resources to the site's origin
   * - script-src: Allows scripts from the site's origin and Stripe
   * - style-src: Allows styles from the site's origin
   * - img-src: Allows images from the site's origin and Stripe
   * - frame-src: Allows iframes from the site's origin and Stripe
   * - connect-src: Allows connections to the site's origin, Stripe, and local server
   */
  'Content-Security-Policy': string;
}

/**
 * Development headers configuration
 * @remarks
 * These headers are used in development mode to enhance
 * the development experience.
 */
export interface DevelopmentHeaders {
  /**
   * Hot Module Replacement (HMR) configuration
   * @description
   * Enables hot module replacement during development
   */
  hmr: {
    path: string;
  };

  /**
   * File watching configuration
   * @description
   * Enables change detection on the host machine
   */
  watch: {
    usePolling: boolean;
  };
}

/**
 * Application Headers Documentation
 * @example
 * ```typescript
 * // Example of headers configuration in vite.config.ts
 * server: {
 *   headers: {
 *     'Content-Security-Policy': `
 *       default-src 'self';
 *       script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com;
 *       // ... other directives
 *     `
 *   }
 * }
 * ```
 */
export const HeadersDocumentation = {
  /**
   * Security Headers
   * @description
   * Security headers are essential for protecting the application against
   * various web attacks such as XSS, clickjacking, etc.
   */
  security: {
    csp: {
      description: "Content Security Policy - Restricts resource sources",
      directives: {
        'default-src': "Restricts default resources to the site's origin",
        'script-src': "Allows scripts from the site's origin and Stripe",
        'style-src': "Allows styles from the site's origin",
        'img-src': "Allows images from the site's origin and Stripe",
        'frame-src': "Allows iframes from the site's origin and Stripe",
        'connect-src': "Allows connections to the site's origin, Stripe, and local server"
      }
    }
  },

  /**
   * Development Headers
   * @description
   * Development headers enhance the development experience
   * by enabling hot module replacement and change detection.
   */
  development: {
    hmr: {
      description: "Hot Module Replacement - Enables hot module replacement during development",
      path: "Path for HMR updates"
    },
    watch: {
      description: "File watching configuration",
      usePolling: "Enables change detection on the host machine"
    }
  }
}; 