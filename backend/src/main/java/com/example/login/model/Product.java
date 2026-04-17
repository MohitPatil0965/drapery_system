package com.example.login.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    private String category;

    private String tag;

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer reviews = 0;

    // Clothing specific fields
    private Double rentalPrice;
    
    private String size;
    
    private String color;
    
    private String material;

    @Builder.Default
    private Boolean isRentable = true;

    @Builder.Default
    private Boolean isPurchasable = true;
}
