package com.leoon.config;

import org.jinstagram.Instagram;
import org.jinstagram.auth.InstagramAuthService;
import org.jinstagram.auth.oauth.InstagramService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringConfig {
    @Value("${instagram.client_id}")
    private String CLIENT_ID;

    @Value("${instagram.secret}")
    private String SECRET;

    @Value("${instagram.url}")
    private String URL;

    @Bean
    public Instagram instagram() {
        return new Instagram(CLIENT_ID);
    }

    @Bean
    public String secret() {
        return SECRET;
    }

    @Bean
    public InstagramService instagramService() {
        return new InstagramAuthService()
                .apiKey(CLIENT_ID)
                .apiSecret(SECRET)
                .callback(URL)
                .build();
    }

}
