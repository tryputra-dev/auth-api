const CommentDetail = require("../CommentDetail");

describe("A CommentDetail entity", () => {
  const basePayload = {
    id: "comment-123",
    username: "dicoding",
    date: new Date().toISOString(),
    content: "sebuah komentar",
    is_deleted: false,
  };

  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payloads = [
      { ...basePayload, id: undefined },
      { ...basePayload, username: undefined },
      { ...basePayload, date: undefined },
      { ...basePayload, content: undefined },
      { ...basePayload, is_deleted: undefined },
      { ...basePayload, is_deleted: null },
    ];

    // Action & Assert
    payloads.forEach((payload) => {
      expect(() => new CommentDetail(payload)).toThrow(
        "COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY"
      );
    });
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payloads = [
      { ...basePayload, id: 123 },
      { ...basePayload, username: {} },
      { ...basePayload, date: 12345 },
      { ...basePayload, content: ["konten"] },
      { ...basePayload, is_deleted: "true" },
    ];

    // Action & Assert
    payloads.forEach((payload) => {
      expect(() => new CommentDetail(payload)).toThrow(
        "COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    });
  });

  it("should create CommentDetail entity correctly when given valid payload and is_deleted is false", () => {
    // Arrange
    const payload = { ...basePayload };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail).toBeInstanceOf(CommentDetail);
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.content).toEqual(payload.content);
  });

  it('should change content to "**komentar telah dihapus**" when is_deleted is true', () => {
    // Arrange
    const payload = {
      ...basePayload,
      is_deleted: true,
      content: "Konten asli yang harus disembunyikan",
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail).toBeInstanceOf(CommentDetail);
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.content).toEqual("**komentar telah dihapus**");
  });
});
