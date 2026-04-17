package com.example.login.controller;

import com.example.login.model.Order;
import com.example.login.model.Product;
import com.example.login.model.User;
import com.example.login.repository.OrderRepository;
import com.example.login.repository.ProductRepository;
import com.example.login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderData, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        
        Long productId = Long.valueOf(orderData.get("productId").toString());
        Product product = productRepository.findById(productId).orElse(null);

        if (user == null || product == null) {
            return ResponseEntity.badRequest().body("Invalid user or product");
        }

        String cardNumber = orderData.get("cardNumber").toString();
        String last4 = cardNumber.length() >= 4 ? cardNumber.substring(cardNumber.length() - 4) : cardNumber;

        Order order = Order.builder()
                .user(user)
                .product(product)
                .type(orderData.get("type").toString())
                .amount(Double.valueOf(orderData.get("amount").toString()))
                .cardNumber("**** **** **** " + last4)
                .build();

        return ResponseEntity.ok(orderRepository.save(order));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAllByOrderByOrderDateDesc());
    }
}
