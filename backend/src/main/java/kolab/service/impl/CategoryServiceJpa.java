package kolab.service.impl;

import kolab.dao.CategoryRepository;
import kolab.domain.Category;
import kolab.service.CategoryService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryServiceJpa implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + id));
    }

    @Override
    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Category with name " + category.getName() + " already exists");
        }
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(UUID id, Category category) {
        Category existingCategory = getCategoryById(id);
        
        if (!existingCategory.getName().equals(category.getName()) && 
            categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Category with name " + category.getName() + " already exists");
        }
        
        existingCategory.setName(category.getName());
        return categoryRepository.save(existingCategory);
    }

    @Override
    public void deleteCategory(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new NotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}