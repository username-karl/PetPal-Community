package com.petpal.community;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PetPalCommunityApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetPalCommunityApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.boot.CommandLineRunner demo(
			com.petpal.community.repository.UserRepository userRepository) {
		return (args) -> {
			if (userRepository.count() == 0) {
				com.petpal.community.model.User user = new com.petpal.community.model.User();
				user.setEmail("penida.karlmiguel@gmail.com");
				user.setPassword("123123123");
				user.setName("Karl");
				user.setRole("Owner");
				userRepository.save(user);
				System.out.println("Seeded default user: " + user);
			}
		};
	}

}
