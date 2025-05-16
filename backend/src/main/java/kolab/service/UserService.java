package kolab.service;

import kolab.domain.User;
import java.util.List;
import java.util.UUID;

public interface UserService {
    List<User> getUsers();
    User getUserById(UUID id);
    User findByEmail(String email);
    User createUser(User user);
    User updateUser(UUID id, User updatedUser);
    void deleteUser(UUID id);
}


