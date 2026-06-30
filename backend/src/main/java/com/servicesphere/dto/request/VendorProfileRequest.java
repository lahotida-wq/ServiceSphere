// backend/src/main/java/com/servicesphere/dto/request/VendorProfileRequest.java
package com.servicesphere.dto.request;

import jakarta.validation.constraints.*;

/**
 * Payload for creating or updating a Vendor profile.
 */
public record VendorProfileRequest(

        @NotBlank(message = "Business name is required")
        @Size(max = 150, message = "Business name must not exceed 150 characters")
        String businessName,

        @Size(max = 1000, message = "Description too long")
        String description,

        @NotBlank(message = "Category is required")
        @Size(max = 100)
        String category,

        @Pattern(regexp = "^[+]?[0-9]{7,15}$", message = "Enter a valid phone number")
        String phone,

        String address,

        @NotBlank(message = "City is required")
        @Size(max = 100)
        String city,

        @Size(max = 100)
        String state,

        @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
        String pincode
) {}