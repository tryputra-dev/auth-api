const NewComment = require("../NewComment");

describe("A NewComment entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload1 = {
      threadId: "thread-123",
      owner: "user-123",
    };
    const payload2 = {
      content: "content komentar",
      owner: "user-123",
    };
    const payload3 = {
      content: "content komentar",
      threadId: "thread-123",
    };

    // Action & Assert
    expect(() => new NewComment(payload1)).toThrow(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
    expect(() => new NewComment(payload2)).toThrow(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
    expect(() => new NewComment(payload3)).toThrow(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload1 = {
      content: 123,
      threadId: "thread-123",
      owner: "user-123",
    };
    const payload2 = {
      content: "content komentar",
      threadId: true,
      owner: "user-123",
    };
    const payload3 = {
      content: "content komentar",
      threadId: "thread-123",
      owner: ["user-123"],
    };

    // Action & Assert
    expect(() => new NewComment(payload1)).toThrow(
      "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    expect(() => new NewComment(payload2)).toThrow(
      "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    expect(() => new NewComment(payload3)).toThrow(
      "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create NewComment entity correctly when given valid payload", () => {
    // Arrange
    const payload = {
      content: "content komentar",
      threadId: "thread-123",
      owner: "user-123",
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.owner).toEqual(payload.owner);
  });
});
