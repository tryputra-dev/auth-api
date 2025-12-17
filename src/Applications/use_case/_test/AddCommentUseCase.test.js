const NewComment = require("../../../Domains/comments/entities/NewComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddCommentUseCase = require("../AddCommentUseCase");

describe("AddCommentUseCase", () => {
  it("should orchestrate the add comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      content: "content komentar",
      owner: "user-123",
    };

    const mockAddedComment = new AddedComment({
      id: "comment-123",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** Mocking Dependency */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** Mocking method yang digunakan */
    mockThreadRepository.checkThreadExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // 2. Mock addComment:
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    /** Membuat Use Case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: "comment-123",
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );

    expect(mockThreadRepository.checkThreadExistence).toHaveBeenCalledWith(
      useCasePayload.threadId
    );

    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
      new NewComment({
        threadId: useCasePayload.threadId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
  });
});
