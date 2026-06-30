// backend/src/main/java/com/servicesphere/exception/UnauthorizedException.java
package com.servicesphere.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}