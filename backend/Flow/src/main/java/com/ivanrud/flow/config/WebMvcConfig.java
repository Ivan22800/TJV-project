package com.ivanrud.flow.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Говорим Spring: "Если просят /uploads/**, отдавай файлы из папки uploads/ в корне проекта"
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}