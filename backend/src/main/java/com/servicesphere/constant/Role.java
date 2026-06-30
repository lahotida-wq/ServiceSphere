package com.servicesphere.constant;

/**
 * Defines the set of roles a {@link com.servicesphere.entity.User} can hold
 * within ServiceSphere. Drives both authorization (Spring Security
 * authorities) and role-specific application behavior (e.g. only VENDOR
 * accounts can create services).
 */
public enum Role {

    /** A user who browses vendors and books services. */
    CUSTOMER,

    /** A user who offers services and manages bookings made against them. */
    VENDOR
}