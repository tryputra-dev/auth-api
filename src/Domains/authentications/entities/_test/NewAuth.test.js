const NewAuth = require("../NewAuth");

describe("A NewAuth entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload1 = {
      accessToken: "access_token_value",
    };
    const payload2 = {
      refreshToken: "refresh_token_value",
    };

    // Action & Assert
    expect(() => new NewAuth(payload1)).toThrow(
      "NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY"
    );
    expect(() => new NewAuth(payload2)).toThrow(
      "NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload1 = {
      accessToken: 123,
      refreshToken: "refresh_token_value",
    };
    const payload2 = {
      accessToken: "access_token_value",
      refreshToken: true,
    };

    // Action & Assert
    expect(() => new NewAuth(payload1)).toThrow(
      "NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    expect(() => new NewAuth(payload2)).toThrow(
      "NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create NewAuth entity correctly when given valid payload", () => {
    // Arrange
    const payload = {
      accessToken: "access_token_value",
      refreshToken: "refresh_token_value",
    };

    // Action
    const newAuth = new NewAuth(payload);

    // Assert
    expect(newAuth).toBeInstanceOf(NewAuth);
    expect(newAuth.accessToken).toEqual(payload.accessToken);
    expect(newAuth.refreshToken).toEqual(payload.refreshToken);
  });
});
