package kolab.service.impl;

import kolab.dao.UserRepository;
import kolab.domain.User;
import kolab.service.UserService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import java.util.List;
import java.util.UUID;

@Service
public class UserServiceJpa implements UserService {
    @Autowired
    private UserRepository userRepo;

    @Override
    public List<User> getUsers() {
        return userRepo.findAll();
    }

    @Override
    public User getUserById(UUID id) {
        return userRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("User with id " + id + " not found"));
    }

    @Override
    public User findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    @Override
    public User createUser(User user) {
        Assert.notNull(user, "User object must be given.");
        validateUser(user);
        return userRepo.save(user);
    }

    @Override
    public User updateUser(UUID id, User updatedUser) {
        User user = getUserById(id);
        validateUser(updatedUser);
        
        user.setName(updatedUser.getName());
        user.setSurname(updatedUser.getSurname());
        user.setNickname(updatedUser.getNickname());
        user.setEmail(updatedUser.getEmail());
        user.setAuthorization(updatedUser.getAuthorization());
        user.setDescription(updatedUser.getDescription());
        
        return userRepo.save(user);
    }

    @Override
    public void deleteUser(UUID id) {
        if (userRepo.existsById(id)) {
            userRepo.deleteById(id);
        } else {
            throw new NotFoundException("User with id " + id + " not found");
        }
    }

    private void validateUser(User user) {
        if (user.getEmail() == null || !user.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (user.getSurname() == null || user.getSurname().trim().isEmpty()) {
            throw new IllegalArgumentException("Surname is required");
        }
        if (user.getAuthorization() == null || user.getAuthorization().trim().isEmpty()) {
            throw new IllegalArgumentException("Authorization is required");
        }
    }
}


