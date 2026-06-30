// backend/src/main/java/com/servicesphere/exception/SlotNotAvailableException.java
package com.servicesphere.exception;

public class SlotNotAvailableException extends RuntimeException {
    public SlotNotAvailableException(String message) {
        super(message);
    }
}