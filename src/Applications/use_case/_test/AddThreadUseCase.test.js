const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestrate the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "title thread",
      body: "body thread",
      owner: "user-123",
    };

    const mockAddedThread = new AddedThread({
      id: "thread-123",
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    /** Mocking Dependency */
    const mockThreadRepository = new ThreadRepository();

    /** Mocking method yang digunakan */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** Membuat Use Case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: "thread-123",
        title: useCasePayload.title,
        owner: useCasePayload.owner,
      })
    );

    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      })
    );
  });
});
