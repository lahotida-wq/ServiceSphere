package com.servicesphere.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Enables @CreatedDate / @LastModifiedDate auto-population on BaseEntity.
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}