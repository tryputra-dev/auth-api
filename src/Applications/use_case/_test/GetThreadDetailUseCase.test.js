const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const CommentDetail = require("../../../Domains/comments/entities/CommentDetail");

describe("GetThreadDetailUseCase", () => {
  const DELETED_COMMENT_MESSAGE = "**komentar telah dihapus**";

  it("should orchestrate the get thread detail action correctly and map deleted comments", async () => {
    // Arrange
    const threadId = "thread-123";

    const dateObject = new Date();
    const dateISOString = dateObject.toISOString();

    const mockThread = {
      id: threadId,
      title: "title",
      body: "body",
      date: dateObject,
      username: "thread_owner",
    };

    const mockCommentsData = [
      {
        id: "comment-1",
        username: "comment_user_a",
        date: dateObject,
        content: "komentar aktif",
        is_deleted: false,
      },
      {
        id: "comment-2",
        username: "comment_user_b",
        date: dateObject,
        content: "komentar disembunyikan",
        is_deleted: true,
      },
    ];

    const expectedCommentDetails = [
      new CommentDetail({
        ...mockCommentsData[0],
        date: dateISOString,
      }),
      new CommentDetail({
        ...mockCommentsData[1],
        date: dateISOString,
        content: DELETED_COMMENT_MESSAGE,
      }),
    ];

    const expectedThreadDetail = {
      ...mockThread,
      date: dateISOString,
      comments: expectedCommentDetails,
    };

    /** Mocking Dependencies */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCommentsData));

    /** Membuat Use Case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      threadId
    );
    expect(threadDetail).toEqual(expectedThreadDetail);
    expect(threadDetail.comments[1].content).toEqual(DELETED_COMMENT_MESSAGE);
  });

  it("should use the date directly if repository returns ISO string", async () => {
    // Arrange
    const threadId = "thread-333";
    const dateISOString = "2025-01-01T10:00:00.000Z";

    const mockThreadStringDate = {
      id: threadId,
      title: "title",
      body: "body",
      date: dateISOString,
      username: "user_c",
    };

    const mockCommentsDataStringDate = [
      {
        id: "comment-3",
        username: "user_d",
        date: dateISOString,
        content: "komentar string date",
        is_deleted: false,
      },
    ];

    const expectedCommentDetails = [
      new CommentDetail(mockCommentsDataStringDate[0]),
    ];

    const expectedThreadDetail = {
      ...mockThreadStringDate,
      comments: expectedCommentDetails,
    };

    /** Mocking Dependencies */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadStringDate));

    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCommentsDataStringDate));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(threadDetail).toEqual(expectedThreadDetail);
  });
});
