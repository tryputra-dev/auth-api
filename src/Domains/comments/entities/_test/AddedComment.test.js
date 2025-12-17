const AddedComment = require("../AddedComment");

describe("An AddedComment entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload1 = {
      content: "content komentar",
      owner: "user-123",
    };
    const payload2 = {
      id: "comment-123",
      owner: "user-123",
    };
    const payload3 = {
      id: "comment-123",
      content: "content komentar",
    };

    // Action & Assert
    expect(() => new AddedComment(payload1)).toThrow(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
    expect(() => new AddedComment(payload2)).toThrow(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
    expect(() => new AddedComment(payload3)).toThrow(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload1 = {
      id: 123,
      content: "sebuah komentar",
      owner: "user-123",
    };
    const payload2 = {
      id: "comment-123",
      content: true,
      owner: "user-123",
    };
    const payload3 = {
      id: "comment-123",
      content: "sebuah komentar",
      owner: ["user-123"],
    };

    // Action & Assert
    expect(() => new AddedComment(payload1)).toThrow(
      "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    expect(() => new AddedComment(payload2)).toThrow(
      "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    expect(() => new AddedComment(payload3)).toThrow(
      "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddedComment entity correctly when given valid payload", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "sebuah komentar",
      owner: "user-123",
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
