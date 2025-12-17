const AuthenticationRepository = require("../AuthenticationRepository");

describe("AuthenticationRepository interface", () => {
  it("should throw error when invoke abstract method", async () => {
    // Arrange
    const authenticationRepository = new AuthenticationRepository();

    // Action & Assert
    await expect(authenticationRepository.addToken("token")).rejects.toThrow(
      "AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      authenticationRepository.checkAvailabilityToken("token")
    ).rejects.toThrow("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(authenticationRepository.deleteToken("token")).rejects.toThrow(
      "AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
