// backend/src/main/java/com/servicesphere/service/AnalyticsService.java
package com.servicesphere.service;

import com.servicesphere.dto.response.VendorAnalyticsResponse;

public interface AnalyticsService {
    VendorAnalyticsResponse getVendorAnalytics(String email);
}