const NewThread = require("../NewThread");

describe("A NewThread entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload1 = {
      body: "body thread",
      owner: "user-123",
    };
    const payload2 = {
      title: "title thread",
      owner: "user-123",
    };
    const payload3 = {
      title: "title thread",
      body: "body thread",
    };

    // Action & Assert
    expect(() => new NewThread(payload1)).toThrow(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
    expect(() => new NewThread(payload2)).toThrow(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
    expect(() => new NewThread(payload3)).toThrow(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload1 = {
      title: 123,
      body: "body thread",
      owner: "user-123",
    };
    const payload2 = {
      title: "title thread",
      body: true,
      owner: "user-123",
    };
    const payload3 = {
      title: "title thread",
      body: "body thread",
      owner: ["user-123"],
    };

    // Action & Assert
    expect(() => new NewThread(payload1)).toThrow(
      "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    expect(() => new NewThread(payload2)).toThrow(
      "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    expect(() => new NewThread(payload3)).toThrow(
      "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create NewThread entity correctly when given valid payload", () => {
    // Arrange
    const payload = {
      title: "title thread",
      body: "body thread",
      owner: "user-123",
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});
