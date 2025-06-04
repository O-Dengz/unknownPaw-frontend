package com.seroter.unknownPaw.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/community")
public class CommunityController {

    private final CommunityService communityService;
    private final ImageService imageService;

    public CommunityController(CommunityService communityService, ImageService imageService) {
        this.communityService = communityService;
        this.imageService = imageService;
    }

    @PostMapping("/post")
    public ResponseEntity<Long> createCommunityPostWithImage(@RequestParam("images") List<MultipartFile> images, @RequestParam("postId") Long postId) {
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile image : images) {
            String imageUrl = imageService.saveImage(image, ImageType.COMMUNITY.name(), "community", postId, null);
            imageUrls.add(imageUrl);
        }
        communityService.addImagesToCommunity(postId, imageUrls);
        return ResponseEntity.status(HttpStatus.CREATED).body(postId);
    }
} 