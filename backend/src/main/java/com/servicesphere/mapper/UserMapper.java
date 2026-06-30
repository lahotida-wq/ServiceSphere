package com.servicesphere.mapper;

import com.servicesphere.dto.response.UserResponse;
import com.servicesphere.entity.User;
import org.mapstruct.Mapper;

/**
 * Converts between {@link User} entities and {@link UserResponse}.
 * Implementation is generated at compile time by MapStruct.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toUserResponse(User user);
}