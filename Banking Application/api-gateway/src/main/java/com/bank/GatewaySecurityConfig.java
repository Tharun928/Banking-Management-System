package com.bank;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;

@Configuration
public class GatewaySecurityConfig {

    // WebFlux Security for Gateway
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable())        // Disable CSRF
            .authorizeExchange(exchanges -> exchanges.anyExchange().permitAll()); // Allow all requests

        return http.build();
    }

    // Routes
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/auth/**").uri("lb://auth-service"))
                .route("customer-service", r -> r.path("/customer/**").uri("lb://customer-service"))
                .route("account-service", r -> r.path("/account/**").uri("lb://account-service"))
                .route("payment-service", r -> r.path("/payment/**").uri("lb://payment-service"))
                .route("notification-service", r -> r.path("/notification/**").uri("lb://notification-service"))
                .route("audit-service", r -> r.path("/audit/**").uri("lb://audit-service"))
                .build();
    }
}
