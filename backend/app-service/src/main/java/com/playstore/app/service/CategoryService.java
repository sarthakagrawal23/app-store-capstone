package com.playstore.app.service;

import com.playstore.app.entity.Category;
import com.playstore.app.repository.CategoryRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @PostConstruct
    public void seedCategories() {
        String[] cats = {"Productivity", "Creative", "Health", "Entertainment", "Tools", "Travel", "Education", "Finance"};
        for (String name : cats) {
            if (!categoryRepository.existsByName(name)) {
                categoryRepository.save(new Category(name, name + " apps"));
            }
        }
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category create(Category category) {
        if (categoryRepository.existsByName(category.getName()))
            throw new RuntimeException("Category already exists");
        return categoryRepository.save(category);
    }
}
