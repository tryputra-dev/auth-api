const AddedThread = require("../AddedThread");

describe("An AddedThread entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload1 = {
      title: "title thread",
      owner: "user-123",
    };
    const payload2 = {
      id: "thread-123",
      owner: "user-123",
    };
    const payload3 = {
      id: "thread-123",
      title: "title thread",
    };

    // Action & Assert
    expect(() => new AddedThread(payload1)).toThrow(
      "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
    expect(() => new AddedThread(payload2)).toThrow(
      "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
    expect(() => new AddedThread(payload3)).toThrow(
      "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload1 = {
      id: 123,
      title: "title thread",
      owner: "user-123",
    };
    const payload2 = {
      id: "thread-123",
      title: true,
      owner: "user-123",
    };
    const payload3 = {
      id: "thread-123",
      title: "title thread",
      owner: ["user-123"],
    };

    // Action & Assert
    expect(() => new AddedThread(payload1)).toThrow(
      "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    expect(() => new AddedThread(payload2)).toThrow(
      "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    expect(() => new AddedThread(payload3)).toThrow(
      "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddedThread entity correctly when given valid payload", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "title thread",
      owner: "user-123",
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread).toBeInstanceOf(AddedThread);
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
